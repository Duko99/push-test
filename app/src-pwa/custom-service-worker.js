/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config file > pwa > workboxMode is set to "injectManifest"
 */

import { clientsClaim } from 'workbox-core'
import {
  precacheAndRoute,
  cleanupOutdatedCaches,
} from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkOnly } from 'workbox-strategies'

self.skipWaiting()
clientsClaim()

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST)

cleanupOutdatedCaches()

registerRoute(
  ({request}) => request.url.includes('cypress'),
  new NetworkOnly(),
)


registerRoute(
  ({ request }) => request.mode === 'navigate',
  async ({ event }) => {
    try {
      return await fetch(event.request)
    } catch (error) {
      console.error(error)
      return caches.match('index.html')
    }
  }
)


self.addEventListener('push', async function (event) {
  console.log(`push addEventListener`)
  const data = event.data ? event.data.json() : 'missing push'
  console.log('data:', data)
  console.log(`push message payload received at ${new Date()}:`, JSON.stringify(data?.payload))
})