import { StreamChat } from 'stream-chat';

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

const serverClient = StreamChat.getInstance(apiKey, apiSecret);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId } = req.body;

    // Generate a token for the user
    const token = serverClient.createToken(userId);
    res.status(200).json({ token });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
