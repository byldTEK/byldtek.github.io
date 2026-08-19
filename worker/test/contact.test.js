import assert from 'node:assert/strict';
import test from 'node:test';

import { handleRequest } from '../src/index.js';

const ORIGIN = 'https://byldtek.com';
const ENV = {
  ALLOWED_ORIGINS: `${ORIGIN},https://www.byldtek.com`,
  CONTACT_FROM_EMAIL: 'Website <website@byldtek.com>',
  CONTACT_RATE_LIMITER: { limit: async () => ({ success: true }) },
  CONTACT_TO_EMAIL: 'hello@byldtek.com',
  EXTERNAL_TIMEOUT_MS: '25',
  RESEND_API_KEY: 're_test',
  TURNSTILE_EXPECTED_HOSTNAMES: 'byldtek.com,www.byldtek.com',
  TURNSTILE_SECRET_KEY: 'turnstile_test',
};

function contactRequest(body, origin = ORIGIN, ip = '203.0.113.7') {
  return new Request('https://contact-worker.example.workers.dev/contact', {
    method: 'POST',
    headers: {
      'CF-Connecting-IP': ip,
      'content-type': 'application/json',
      origin,
    },
    body: JSON.stringify(body),
  });
}

const validBody = {
  email: 'client@example.com',
  language: 'en',
  message: 'We need a client portal for our operations team.',
  services: ['Web Platform', 'Backend & Systems'],
  turnstileToken: 'valid-token',
  website: '',
};

test('rejects requests from an origin outside the site allowlist', async () => {
  const response = await handleRequest(
    contactRequest(validBody, 'https://attacker.example'),
    ENV,
    async () => {
      throw new Error('External services must not be called');
    },
  );

  assert.equal(response.status, 403);
});

test('rejects malformed contact details before calling external services', async () => {
  const response = await handleRequest(
    contactRequest({ ...validBody, email: 'not-an-email', message: 'short' }),
    ENV,
    async () => {
      throw new Error('External services must not be called');
    },
  );

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    ok: false,
    error: 'Please check your email address and message.',
  });
});

test('rejects submissions that Turnstile does not verify', async () => {
  const response = await handleRequest(contactRequest(validBody), ENV, async (url) => {
    assert.equal(url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
    return Response.json({ success: false, 'error-codes': ['invalid-input-response'] });
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    ok: false,
    error: 'Verification failed. Please try again.',
  });
});

test('rate limits repeated submissions before calling external services', async () => {
  const env = {
    ...ENV,
    CONTACT_RATE_LIMITER: { limit: async () => ({ success: false }) },
  };
  const response = await handleRequest(
    contactRequest(validBody),
    env,
    async () => {
      throw new Error('External services must not be called');
    },
  );

  assert.equal(response.status, 429);
  assert.deepEqual(await response.json(), {
    ok: false,
    error: 'Too many attempts. Please wait and try again.',
  });
});

test('rate limit key cannot be bypassed by changing the submitted email', async () => {
  const keys = [];
  const env = {
    ...ENV,
    CONTACT_RATE_LIMITER: {
      limit: async ({ key }) => {
        keys.push(key);
        return { success: false };
      },
    },
  };

  await handleRequest(contactRequest(validBody), env, async () => Response.json({}));
  await handleRequest(
    contactRequest({ ...validBody, email: 'another@example.com' }),
    env,
    async () => Response.json({}),
  );

  assert.deepEqual(keys, ['203.0.113.7', '203.0.113.7']);
});

test('rejects a Turnstile token issued for an unexpected hostname', async () => {
  const response = await handleRequest(contactRequest(validBody), ENV, async (url) => {
    if (url.includes('siteverify')) {
      return Response.json({ success: true, hostname: 'attacker.example' });
    }
    throw new Error('Resend must not be called');
  });

  assert.equal(response.status, 400);
});

test('accepts a Turnstile token issued on the www hostname', async () => {
  const response = await handleRequest(
    contactRequest(validBody, 'https://www.byldtek.com'),
    ENV,
    async (url) => {
      if (url.includes('siteverify')) {
        return Response.json({ success: true, hostname: 'www.byldtek.com' });
      }
      return Response.json({ id: 'email_www' });
    },
  );

  assert.equal(response.status, 200);
});

test('stops reading a streaming request as soon as it exceeds the size limit', async () => {
  let reads = 0;
  const body = new ReadableStream(
    {
      pull(controller) {
        reads += 1;
        if (reads === 1) {
          controller.enqueue(new Uint8Array(13_000));
          return;
        }
        throw new Error('The oversized body should have been cancelled');
      },
    },
    { highWaterMark: 0 },
  );
  const request = new Request(
    'https://contact-worker.example.workers.dev/contact',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: ORIGIN },
      body,
      duplex: 'half',
    },
  );

  const response = await handleRequest(request, ENV, async () => {
    throw new Error('External services must not be called');
  });

  assert.equal(response.status, 413);
  assert.equal(reads, 1);
});

test('fails closed when Turnstile exceeds its deadline', async () => {
  let sawSignal = false;
  const response = await handleRequest(contactRequest(validBody), ENV, (url, options) => {
    assert.match(url, /siteverify/);
    sawSignal = options.signal instanceof AbortSignal;
    return new Promise((resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(options.signal.reason));
    });
  });

  assert.equal(sawSignal, true);
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    ok: false,
    error: 'Verification failed. Please try again.',
  });
});

test('keeps the Turnstile deadline active while parsing its response body', async () => {
  const env = { ...ENV, EXTERNAL_TIMEOUT_MS: '5' };
  const response = await handleRequest(contactRequest(validBody), env, async (url, options) => {
    if (!url.includes('siteverify')) {
      return Response.json({ id: 'email_should_not_send' });
    }
    const body = new ReadableStream({
      start(controller) {
        setTimeout(() => {
          if (options.signal.aborted) {
            controller.error(options.signal.reason);
          } else {
            controller.enqueue(
              new TextEncoder().encode('{"success":true,"hostname":"byldtek.com"}'),
            );
            controller.close();
          }
        }, 10);
      },
    });
    return new Response(body, {
      headers: { 'content-type': 'application/json' },
    });
  });

  assert.equal(response.status, 400);
});

test('sends a verified inquiry to the configured mailbox', async () => {
  const calls = [];
  const response = await handleRequest(contactRequest(validBody), ENV, async (url, options) => {
    calls.push({ url, options });
    if (url.includes('siteverify')) {
      return Response.json({ success: true, hostname: 'byldtek.com' });
    }
    return Response.json({ id: 'email_123' }, { status: 200 });
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(calls.length, 2);
  assert.equal(calls[1].url, 'https://api.resend.com/emails');

  const email = JSON.parse(calls[1].options.body);
  assert.equal(email.from, ENV.CONTACT_FROM_EMAIL);
  assert.deepEqual(email.to, [ENV.CONTACT_TO_EMAIL]);
  assert.equal(email.reply_to, validBody.email);
  assert.match(email.text, /Web Platform, Backend & Systems/);
  assert.match(email.text, /client portal/);
});

test('does not reveal Resend errors to the visitor', async () => {
  const response = await handleRequest(contactRequest(validBody), ENV, async (url) => {
    if (url.includes('siteverify')) {
      return Response.json({ success: true, hostname: 'byldtek.com' });
    }
    return Response.json({ message: 'provider details' }, { status: 500 });
  });

  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), {
    ok: false,
    error: 'We could not send your message. Please email hello@byldtek.com.',
  });
});

test('returns a safe error when Resend exceeds its deadline', async () => {
  let resendHadSignal = false;
  const response = await handleRequest(contactRequest(validBody), ENV, (url, options) => {
    if (url.includes('siteverify')) {
      return Response.json({ success: true, hostname: 'byldtek.com' });
    }
    resendHadSignal = options.signal instanceof AbortSignal;
    return new Promise((resolve, reject) => {
      options.signal.addEventListener('abort', () => reject(options.signal.reason));
    });
  });

  assert.equal(resendHadSignal, true);
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), {
    ok: false,
    error: 'We could not send your message. Please email hello@byldtek.com.',
  });
});
