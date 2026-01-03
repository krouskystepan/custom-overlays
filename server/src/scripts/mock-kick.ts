const MOCK_ENDPOINT = 'http://localhost:3000/__mock/kick'

async function send(eventType: string, payload: unknown) {
  const res = await fetch(MOCK_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Kick-Event-Type': eventType,
      'Kick-Event-Version': '1'
    },
    body: JSON.stringify(payload)
  })

  console.log(`✅ ${eventType}`, await res.text())
}

async function run() {
  // -------------------------
  // channel.followed
  // -------------------------
  await send('channel.followed', {
    broadcaster: {
      user_id: 1,
      username: 'Broadcaster',
      is_verified: true,
      profile_picture: '',
      channel_slug: 'broadcaster'
    },
    follower: {
      user_id: 2,
      username: 'MockFollower',
      is_verified: false,
      profile_picture: '',
      channel_slug: 'mockfollower'
    }
  })

  // -------------------------
  // channel.subscription.new
  // -------------------------
  await send('channel.subscription.new', {
    broadcaster: {
      user_id: 1,
      username: 'Broadcaster',
      is_verified: true,
      profile_picture: '',
      channel_slug: 'broadcaster'
    },
    subscriber: {
      user_id: 3,
      username: 'MockSub',
      is_verified: false,
      profile_picture: '',
      channel_slug: 'mocksub'
    },
    duration: 1,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 86400000).toISOString()
  })

  // -------------------------
  // channel.subscription.renewal
  // -------------------------
  await send('channel.subscription.renewal', {
    broadcaster: {
      user_id: 1,
      username: 'Broadcaster',
      is_verified: true,
      profile_picture: '',
      channel_slug: 'broadcaster'
    },
    subscriber: {
      user_id: 3,
      username: 'MockSub',
      is_verified: false,
      profile_picture: '',
      channel_slug: 'mocksub'
    },
    duration: 3,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 90 * 86400000).toISOString()
  })

  // -------------------------
  // channel.subscription.gifts
  // -------------------------
  await send('channel.subscription.gifts', {
    broadcaster: {
      user_id: 1,
      username: 'Broadcaster',
      is_verified: true,
      profile_picture: '',
      channel_slug: 'broadcaster'
    },
    gifter: {
      user_id: 4,
      username: 'MockGifter',
      is_verified: false,
      profile_picture: '',
      channel_slug: 'mockgifter'
    },
    giftees: [
      {
        user_id: 5,
        username: 'GiftedUser1',
        is_verified: false,
        profile_picture: '',
        channel_slug: 'gifted1'
      },
      {
        user_id: 6,
        username: 'GiftedUser2',
        is_verified: false,
        profile_picture: '',
        channel_slug: 'gifted2'
      }
    ],
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 86400000).toISOString()
  })
}

run().catch(console.error)
