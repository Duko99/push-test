const express = require('express')
const app = express()
const cors = require('cors')
const webpush = require('web-push')
require('dotenv').config({ path: ['.env.local', '.env'] })

const port = 3000

app.use(cors())
app.use(express.json())

const subscriptions = []

app.post('/push-subscription', async (req, res, next) => {
  console.log('/push-subscription req.body:', req.body)

  console.log('Sending push notification acknowledgement...')
  
  const sub = req.body.data.subscription
  subscriptions.push(sub)
  try {
    const result = await webpush.sendNotification(sub, JSON.stringify({
      payload: 'Push subscription acknowledgement',
    }))
    console.log('Push notification sent successfully:', result.statusCode)
  } catch (err) {
    console.error('Failed to send push notification:', err)
    next(err)
  }

  res.send('OK')
})

app.post('/trigger-push', async (req, res, next) => {
  for (const subscription of subscriptions) {
    console.log('processing subscription:', subscription)
    try {
      const parsedSub = JSON.parse(JSON.stringify(subscription))
      const resp = await webpush.sendNotification(parsedSub, JSON.stringify({
        payload: 'This is a test push message',
      }))
      console.log('resp:', resp)
    } catch (err) {
      console.error(`Failed to send push message`, err)
    }
  }
  res.send('OK')
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
  registerPushVAPIDKeys()
})

function registerPushVAPIDKeys() {
  const publicKey = process.env.PUSH_VAPID_PUBLIC_KEY
  const privateKey = process.env.PUSH_VAPID_PRIVATE_KEY
  if (publicKey && privateKey) {
    webpush.setVapidDetails(
      `mailto:${process.env.ADMIN_EMAIL}`,
      publicKey,
      privateKey,
    )
    console.log('Registered VAPID keys')
  } else {
    const missing = []
    if (!publicKey) missing.push('PUSH_VAPID_PUBLIC_KEY')
    if (!privateKey) missing.push('PUSH_VAPID_PRIVATE_KEY')
    throw new Error(`Missing VAPID keys: ${missing.join(', ')}`)
  }
}