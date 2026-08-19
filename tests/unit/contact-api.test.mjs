import assert from 'node:assert/strict';
import test from 'node:test';

import { sendContact } from '../../app/contact-api.mjs';

const payload = {
  email: 'client@example.com',
  language: 'en',
  message: 'We need a new operations portal.',
  services: ['Web Platform'],
  turnstileToken: 'token',
  website: '',
};

test('posts the contact payload as JSON to the configured endpoint', async () => {
  let request;
  const result = await sendContact({
    endpoint: 'https://worker.example/contact',
    payload,
    fetchImpl: async (url, options) => {
      request = { url, options };
      return Response.json({ ok: true });
    },
  });

  assert.deepEqual(result, { ok: true });
  assert.equal(request.url, 'https://worker.example/contact');
  assert.equal(request.options.method, 'POST');
  assert.deepEqual(JSON.parse(request.options.body), payload);
  assert.equal(request.options.headers['content-type'], 'application/json');
});

test('reports a safe error when the backend rejects the inquiry', async () => {
  await assert.rejects(
    sendContact({
      endpoint: 'https://worker.example/contact',
      payload,
      fetchImpl: async () =>
        Response.json({ ok: false, error: 'Internal provider details' }, { status: 502 }),
    }),
    { message: 'CONTACT_SUBMISSION_FAILED' },
  );
});

test('does not make a request when the public endpoint is missing', async () => {
  await assert.rejects(
    sendContact({
      endpoint: '',
      payload,
      fetchImpl: async () => {
        throw new Error('fetch should not run');
      },
    }),
    { message: 'CONTACT_NOT_CONFIGURED' },
  );
});

test('reports a safe error when the browser request times out', async () => {
  let sawSignal = false;
  await assert.rejects(
    sendContact({
      endpoint: 'https://worker.example/contact',
      payload,
      timeoutMs: 5,
      fetchImpl: async (url, options) => {
        sawSignal = options.signal instanceof AbortSignal;
        return new Promise((resolve, reject) => {
          options.signal.addEventListener('abort', () => reject(options.signal.reason));
        });
      },
    }),
    { message: 'CONTACT_SUBMISSION_FAILED' },
  );
  assert.equal(sawSignal, true);
});

test('keeps the browser deadline active while parsing the response body', async () => {
  await assert.rejects(
    sendContact({
      endpoint: 'https://worker.example/contact',
      payload,
      timeoutMs: 5,
      fetchImpl: async (url, options) => {
        const body = new ReadableStream({
          start(controller) {
            setTimeout(() => {
              if (options.signal.aborted) {
                controller.error(options.signal.reason);
              } else {
                controller.enqueue(new TextEncoder().encode('{"ok":true}'));
                controller.close();
              }
            }, 10);
          },
        });
        return new Response(body, {
          headers: { 'content-type': 'application/json' },
        });
      },
    }),
    { message: 'CONTACT_SUBMISSION_FAILED' },
  );
});
