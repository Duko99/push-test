# Getting Started

Tested/validated on Ubuntu 24.04.2 LTS.

## Environment Variables

### Generate VAPID keys

Install web-push globally:

```bash
npm install web-push -g
```

Then generate the keys:

```bash
web-push generate-vapid-keys --json
```

It should output `publicKey` and `privateKey`.

### `.env.local`

In both `/app` and `/api` create a `.env.local` file.

App gets `PUSH_VAPID_PUBLIC_KEY`. API gets both `PUSH_VAPID_PUBLIC_KEY` and `PUSH_VAPID_PRIVATE_KEY`.

## Dependencies

`npm install` in both `/app` and `/api`.

You may need to install the Quasar CLI globally (or don't and start the app with `npx`):

```bash
npm i -g @quasar/cli
```

## Start

### Server (`/api`)

```bash
node index.js
```

It should be listening on port 3000.

### App (`/app`)

> Note we start in PWA mode for service workers

```bash
quasar dev -m pwa
```

If you don't have the Quasar CLI globally installed:

```bash
npx quasar dev -m pwa
```

It should start on port 9200.

## Validate

Open the app and click 'register push'. After a delay it will POST to `/push-subscription` and will receive an acknowledgement push message via the push event listener in `/app/src-pwa/custom-service-worker`.

Also test the 'trigger push' button: it will receive a test push message in the push event listener "This is a test push message".
