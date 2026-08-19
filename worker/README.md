# byldTEK contact Worker

This Worker receives the static website's contact form, verifies Cloudflare
Turnstile, rate-limits repeated attempts, and sends the inquiry through
Resend. It stores no submissions.

## One-time setup

1. In Resend, add and verify the sending subdomain `contact.byldtek.com`.
   Add the DNS records Resend provides in NamesLink. Using a subdomain keeps
   these sending records separate from the DNS for `hello@byldtek.com`.
2. In Cloudflare Turnstile, create a managed widget named `byldTEK contact`
   and allow both `byldtek.com` and `www.byldtek.com`. Keep its secret key
   private; the site key is intentionally public.
3. From this `worker` directory, authenticate Wrangler:

   ```sh
   npx wrangler@latest login
   ```

4. Add the two Worker secrets when prompted:

   ```sh
   npx wrangler@latest secret put RESEND_API_KEY
   npx wrangler@latest secret put TURNSTILE_SECRET_KEY
   ```

5. Deploy the Worker:

   ```sh
   npx wrangler@latest deploy
   ```

   Wrangler prints a `workers.dev` URL. The form endpoint is that URL with
   `/contact` appended.

6. In the GitHub repository, open **Settings → Secrets and variables →
   Actions → Variables** and add:

   - `CONTACT_API_URL`: the complete Worker URL ending in `/contact`
   - `TURNSTILE_SITE_KEY`: the public Turnstile site key

   The existing GitHub Pages workflow injects both values during the static
   build. Re-run that workflow after adding or changing either value.

The domain registration, nameservers, GitHub Pages records, and email MX
records stay at NamesLink. Only the Resend verification records are added
there.

## Local checks

Run the dependency-free Worker tests:

```sh
npm test
```

For local Worker development, copy `.dev.vars.example` to `.dev.vars` and
replace its placeholders. Never commit `.dev.vars`.
