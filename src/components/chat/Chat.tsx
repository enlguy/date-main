'use client';

import * as Ably from 'ably';
import { AblyProvider, ChannelProvider } from 'ably/react';
import ChatBox from './Chatbox';

export default function Chat() {
  const client = new Ably.Realtime({ authUrl: '/api/route.js' }); // Change to authCallback for token

  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName="chat-demo">
        <ChatBox />
      </ChannelProvider>
    </AblyProvider>
  );
}
