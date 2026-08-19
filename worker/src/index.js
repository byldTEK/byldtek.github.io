const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const RESEND_EMAIL_URL = 'https://api.resend.com/emails';
const MAX_BODY_BYTES = 12_000;

function allowedOrigins(env) {
  return (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function expectedTurnstileHostnames(env) {
  return (env.TURNSTILE_EXPECTED_HOSTNAMES || '')
    .split(',')
    .map((hostname) => hostname.trim())
    .filter(Boolean);
}

function externalTimeoutMs(env) {
  const configured = Number(env.EXTERNAL_TIMEOUT_MS);
  return Number.isFinite(configured) && configured > 0
    ? Math.min(configured, 30_000)
    : 8_000;
}

async function fetchWithTimeout(
  fetchImpl,
  url,
  options,
  timeoutMs,
  consumeResponse,
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const result = await fetchImpl(url, { ...options, signal: controller.signal });
    return consumeResponse ? await consumeResponse(result) : result;
  } finally {
    clearTimeout(timeout);
  }
}

async function readBoundedBody(request) {
  const declaredLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return { tooLarge: true, text: '' };
  }
  if (!request.body) return { tooLarge: false, text: '' };

  const reader = request.body.getReader();
  const chunks = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > MAX_BODY_BYTES) {
      try {
        await reader.cancel();
      } catch {}
      return { tooLarge: true, text: '' };
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { tooLarge: false, text: new TextDecoder().decode(bytes) };
}

function response(origin, env, status, body) {
  const headers = {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    vary: 'Origin',
  };

  if (allowedOrigins(env).includes(origin)) {
    headers['access-control-allow-origin'] = origin;
  }

  return new Response(JSON.stringify(body), { status, headers });
}

function isValidEmail(value) {
  return (
    typeof value === 'string' &&
    value.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}

function cleanPayload(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;

  const email = typeof value.email === 'string' ? value.email.trim() : '';
  const message = typeof value.message === 'string' ? value.message.trim() : '';
  const language = value.language === 'ar' ? 'ar' : 'en';
  const turnstileToken =
    typeof value.turnstileToken === 'string' ? value.turnstileToken.trim() : '';
  const website = typeof value.website === 'string' ? value.website.trim() : '';
  const services = Array.isArray(value.services)
    ? value.services
        .filter((service) => typeof service === 'string')
        .map((service) => service.trim())
    : [];

  if (
    !isValidEmail(email) ||
    message.length < 10 ||
    message.length > 5_000 ||
    !turnstileToken ||
    turnstileToken.length > 2_048 ||
    services.length > 5 ||
    services.some((service) => !service || service.length > 80)
  ) {
    return null;
  }

  return { email, language, message, services, turnstileToken, website };
}

async function verifyTurnstile(payload, request, env, fetchImpl) {
  const form = new URLSearchParams({
    secret: env.TURNSTILE_SECRET_KEY,
    response: payload.turnstileToken,
  });
  const remoteIp = request.headers.get('CF-Connecting-IP');
  if (remoteIp) form.set('remoteip', remoteIp);

  const verification = await fetchWithTimeout(
    fetchImpl,
    TURNSTILE_VERIFY_URL,
    {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    },
    externalTimeoutMs(env),
    async (verifyResponse) => ({
      ok: verifyResponse.ok,
      result: verifyResponse.ok ? await verifyResponse.json() : null,
    }),
  );
  if (!verification.ok) return false;

  const { result } = verification;
  return (
    result.success === true &&
    expectedTurnstileHostnames(env).includes(result.hostname)
  );
}

function buildEmail(payload, env) {
  const services = payload.services.length
    ? payload.services.join(', ')
    : 'Not specified';
  const subject =
    payload.language === 'ar'
      ? 'استفسار مشروع جديد عبر byldTEK.com'
      : 'New project inquiry via byldTEK.com';

  return {
    from: env.CONTACT_FROM_EMAIL,
    to: [env.CONTACT_TO_EMAIL],
    reply_to: payload.email,
    subject,
    text: [
      `Reply email: ${payload.email}`,
      `Language: ${payload.language}`,
      `Services: ${services}`,
      '',
      payload.message,
    ].join('\n'),
  };
}

function hasRequiredConfig(env) {
  return [
    env.ALLOWED_ORIGINS,
    env.CONTACT_FROM_EMAIL,
    env.CONTACT_RATE_LIMITER,
    env.CONTACT_TO_EMAIL,
    env.RESEND_API_KEY,
    env.TURNSTILE_EXPECTED_HOSTNAMES,
    env.TURNSTILE_SECRET_KEY,
  ].every(Boolean);
}

export async function handleRequest(request, env, fetchImpl = fetch) {
  const origin = request.headers.get('origin') || '';

  if (!allowedOrigins(env).includes(origin)) {
    return response(origin, env, 403, { ok: false, error: 'Forbidden' });
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'access-control-allow-origin': origin,
        'access-control-allow-methods': 'POST, OPTIONS',
        'access-control-allow-headers': 'Content-Type',
        'access-control-max-age': '86400',
        vary: 'Origin',
      },
    });
  }

  const url = new URL(request.url);
  if (request.method !== 'POST' || url.pathname !== '/contact') {
    return response(origin, env, 404, { ok: false, error: 'Not found' });
  }

  if (!hasRequiredConfig(env)) {
    return response(origin, env, 500, {
      ok: false,
      error: 'Contact service is not configured.',
    });
  }

  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    return response(origin, env, 415, {
      ok: false,
      error: 'Content type must be application/json.',
    });
  }

  let bodyResult;
  try {
    bodyResult = await readBoundedBody(request);
  } catch {
    return response(origin, env, 400, {
      ok: false,
      error: 'Please check your email address and message.',
    });
  }
  if (bodyResult.tooLarge) {
    return response(origin, env, 413, {
      ok: false,
      error: 'Message is too large.',
    });
  }

  let body;
  try {
    body = JSON.parse(bodyResult.text);
  } catch {
    return response(origin, env, 400, {
      ok: false,
      error: 'Please check your email address and message.',
    });
  }

  const payload = cleanPayload(body);
  if (!payload) {
    return response(origin, env, 400, {
      ok: false,
      error: 'Please check your email address and message.',
    });
  }

  if (payload.website) {
    return response(origin, env, 200, { ok: true });
  }

  const actor = request.headers.get('CF-Connecting-IP') || 'unknown';
  const rateLimit = await env.CONTACT_RATE_LIMITER.limit({
    key: actor,
  });
  if (!rateLimit.success) {
    return response(origin, env, 429, {
      ok: false,
      error: 'Too many attempts. Please wait and try again.',
    });
  }

  let verified = false;
  try {
    verified = await verifyTurnstile(payload, request, env, fetchImpl);
  } catch {
    verified = false;
  }
  if (!verified) {
    return response(origin, env, 400, {
      ok: false,
      error: 'Verification failed. Please try again.',
    });
  }

  let emailResponse;
  try {
    emailResponse = await fetchWithTimeout(
      fetchImpl,
      RESEND_EMAIL_URL,
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${env.RESEND_API_KEY}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify(buildEmail(payload, env)),
      },
      externalTimeoutMs(env),
    );
  } catch {
    emailResponse = null;
  }

  if (!emailResponse?.ok) {
    return response(origin, env, 502, {
      ok: false,
      error: 'We could not send your message. Please email hello@byldtek.com.',
    });
  }

  return response(origin, env, 200, { ok: true });
}

export default {
  fetch(request, env) {
    return handleRequest(request, env);
  },
};
