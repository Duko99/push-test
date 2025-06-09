<template>
  <q-page class="q-ma-md">
    <q-btn
      label="Register Push"
      data-cy="registerPushBtn"
      @click="setupPush()"
    />
    <q-btn
      label="Trigger Push"
      data-cy="triggerPushBtn"
      @click="triggerPush()"
    />
    <p data-cy="latestMsg">Latest message: {{ latestMsg }}</p>
  </q-page>
</template>

<script setup lang="ts">
import {
  isNil,
  isEmpty,
} from 'lodash'
import { api } from 'src/boot/axios'
import {
  Notify,
} from 'quasar'
import { ref } from 'vue'

const broadcastChannel = new BroadcastChannel('sw-messages')
broadcastChannel.addEventListener('message', (event) => {
  console.log('broadcast listener:', event)
})

const latestMsg = ref<unknown>(null)

broadcastChannel.onmessage = (event) => {
  console.log('event.data:', event?.data)
  if (event?.data?.payload) {
    console.log('setting latestMsg:', event.data.payload)
    latestMsg.value = event.data.payload
  }
}

async function setupPush() {
  await subscribeWebPushService()
}

async function triggerPush() {
  await triggerServerPush()
}

async function subscribeWebPushService() {
  console.log('subscribeWebPushService()')
  console.log(navigator.serviceWorker)
  if (!(
    'serviceWorker' in navigator ||
    'PushManager' in window
  )) {
    console.warn('Push and/or SW not supported')
    return
  }
  const pushPublicKey = process.env.PUSH_VAPID_PUBLIC_KEY
  if (
    isNil(pushPublicKey) ||
    isEmpty(pushPublicKey) ||
    typeof pushPublicKey !== 'string'
  ) {
    console.warn('No Push public key')
    return
  }

  console.log('Waiting for SW to be ready...')
  await navigator.serviceWorker.ready
  console.log('SW ready')

  const { subscription: existingSubscription } = await getWebPushSubscription()
  if (existingSubscription) {
    console.log('Subscription already exists')
    await existingSubscription.unsubscribe()
  }

  const serviceWorker = await navigator.serviceWorker.getRegistration()
  if (!serviceWorker) {
    console.warn('No SW registered')
    return
  }
  try {
    const subscription = await serviceWorker.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: pushPublicKey,
    })
    if (subscription) {
      await sendPushSubscriptionToApi(subscription)
    }
    console.log('Successfully subscribed')
    Notify.create({
      type: 'positive',
      message: 'Successfully subscribed',
    })
  } catch (err) {
    console.error('Failed to subscribe:', err)
    const subscription = await serviceWorker.pushManager.getSubscription()
    if (subscription) {
      console.log('Removing failed subscription')
      await subscription.unsubscribe()
    } else {
      console.log('No failed subscription to remove')
    }
  }
}

async function getWebPushSubscription() {
  if (!('serviceWorker' in navigator)) {
    console.warn('Cannot get push subscription as SW is not supported')
    return { subscription: null }
  }

  const serviceWorkerRegistration = await navigator.serviceWorker?.getRegistration()
  const subscription = await serviceWorkerRegistration?.pushManager.getSubscription()

  return {
    subscription,
  }
}

async function sendPushSubscriptionToApi(subscription: PushSubscription) {
  try {
    const resp = await api.post(
      '/push-subscription',
      {
        data: {
          subscription,
        }
      },
    )
    console.log('sendPushSubscriptionToApi resp:', resp)
  } catch (err) {
    console.error('Failed to send subscription:', err)
  }
}

async function triggerServerPush() {
  try {
    const resp = await api.post(
      '/trigger-push',
    )
    console.log('triggerServerPush resp:', resp)
    Notify.create({
      type: 'positive',
      message: 'Successfully triggered notification',
    })
  } catch (err) {
    console.error('Failed to trigger notification:', err)
  }
}
</script>
