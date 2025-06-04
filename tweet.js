import { TwitterApi } from 'twitter-api-v2';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, tokenName } = req.body;
  if (!username || !username.startsWith('@')) {
    return res.status(400).json({ error: 'Please enter a valid @username' });
  }

  try {
    const client = new TwitterApi({
      appKey: process.env.API_KEY,
      appSecret: process.env.API_SECRET,
      accessToken: process.env.ACCESS_TOKEN,
      accessSecret: process.env.ACCESS_SECRET,
    });

    const tweetMessage = tokenName
      ? `Hey ${username}, today is the unlock day for ${tokenName}! 🔓`
      : `Hey ${username}, here's your reminder! 🔔`;

    await client.v2.tweet(tweetMessage);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Tweet failed:', error);
    return res.status(500).json({ error: 'Tweet could not be sent' });
  }
}
