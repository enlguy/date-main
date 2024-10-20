import Head from 'next/head';
import './chat.css';
import dynamic from 'next/dynamic';

const Chat = dynamic(() => import('@/components/chat/Chat'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Realtime Chat App with Ably, NextJS and Vercel</title>
        <link
          rel="icon"
          href="https://static.ably.dev/motif-red.svg?nextjs-vercel"
          type="image/svg+xml"
        />
      </Head>
      <main>
        <h1 className="title">Your Chat with</h1>
        <Chat />
      </main>
    </div>
  );
}
