export async function sendContact({
  endpoint,
  payload,
  fetchImpl = fetch,
  timeoutMs = 15_000,
}) {
  if (!endpoint) throw new Error('CONTACT_NOT_CONFIGURED');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  let result;
  try {
    response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    result = await response.json();
  } catch {
    throw new Error('CONTACT_SUBMISSION_FAILED');
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok || result?.ok !== true) {
    throw new Error('CONTACT_SUBMISSION_FAILED');
  }

  return { ok: true };
}
