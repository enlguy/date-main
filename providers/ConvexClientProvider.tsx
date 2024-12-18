// @ts-nocheck

'use client';

import {
  ClerkProvider,
  SignIn,
  useAuth,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

// import { ConvexProviderWithClerk } from "convex/react-clerk";
import React from 'react';

type Props = { children: React.ReactNode };

// const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "";

// const convex = new ConvexReactClient(CONVEX_URL);

const ConvexClientProvider = ({ children }: Props) => {
  return (
    <ClerkProvider>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <SignIn routing={'hash'} />
      </SignedOut>
    </ClerkProvider>
  );
};

export default ConvexClientProvider;
