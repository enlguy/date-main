import Ably from 'ably';

require('dotenv').config();

// ensure Vercel doesn't cache the result of this route,
// as otherwise the token request data will eventually become outdated
// and we won't be able to authenticate on the client side
export const revalidate = 0;

export async function GET(request) {
  const client = new Ably.Rest(process.env.ABLY_API_KEY);
  //  const tokenRequestData = await client.auth.createTokenRequest({
  // Figure this out - need to take JWT token created by SignJWT
  //    clientId: 'ably-nextjs-demo',
  //  });
  //  return Response.json(tokenRequestData);
}
