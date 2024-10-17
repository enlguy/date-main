// @ts-nocheck

import Image from 'next/image';
import Avatar from './avatar';
import { roboto } from '../fonts';
import { useState, useEffect } from 'react';
import { ToastType } from '../types';
import { actionCompleted } from 'pubnub-demo-integration';

export default function ProfileScreen({
  profileScreenVisible,
  setProfileScreenVisible,
  name,
  profileUrl,
  logout,
  changeName,
  showUserMessage,
  changeUserNameScreenVisible,
}) {
  useEffect(() => {
    if (!profileScreenVisible) return;
    actionCompleted({
      action: 'Open your Profile Settings',
      blockDuplicateCalls: false,
      debug: false,
    });
  }, [profileScreenVisible]);

  return (
    <div
      className={`${
        !profileScreenVisible && 'hidden'
      } fixed right-0 z-20 flex h-full w-96 select-none flex-col rounded-l-lg bg-sky-950 p-3`}
    >
      <div
        className={`${roboto.className} ${
          changeUserNameScreenVisible && 'opacity-40'
        } flex flex-row items-center py-3 text-sm font-medium text-white`}
      >
        <div className="flex cursor-pointer" onClick={(e) => setProfileScreenVisible(false)}>
          <Image
            src="/icons/close-rooms.svg"
            alt="Close Rooms"
            className="p-3"
            width={36}
            height={36}
            priority
          />
        </div>
        Profile
      </div>

      <div className={`flex flex-col ${changeUserNameScreenVisible && 'opacity-40'}`}>
        <div
          className={`${roboto.className} flex flex flex-row items-center justify-between p-3 text-sm font-medium text-white`}
        >
          Settings
        </div>

        <div className="flex justify-center pb-6">
          <Avatar
            avatarUrl={profileUrl}
            width={88}
            height={88}
            editIcon={true}
            editActionHandler={() => {
              showUserMessage(
                'Demo Limitation',
                'Though supported by the Chat SDK, this demo does not support changing your user avatar, unless you use the "User Management" feature of BizOps Workspace',
                'https://www.pubnub.com/docs/bizops-workspace/user-management',
                ToastType.INFO
              );
            }}
          />
        </div>
        <div className="flex flex-row items-center justify-between px-4 py-4">
          <div className="flex flex-col">
            <div className="text-lg text-white">Name</div>
            <div className="text-lg font-semibold text-white">{name}</div>
          </div>
          <div
            className={`${roboto.className} bg-pubnubbabyblue mx-2.5 flex h-10 cursor-pointer flex-row items-center justify-between rounded-lg px-6 text-sm font-medium`}
            onClick={(e) => changeName()}
          >
            Change
          </div>
        </div>

        <div className="border-navy600 border"></div>

        <div className="flex flex-row px-4 py-6">
          <div className="flex flex-col">
            <div className="pb-2 text-lg text-white">Notifications</div>
            <div className="text-base text-white">
              Get notified about new messages and mentions from chats
            </div>
          </div>
          <div
            className="relative inline-block h-6"
            onClick={() =>
              showUserMessage(
                'Demo Limitation:',
                'Although not supported by this demo, you use the Chat SDK to alert your users with built-in or custom events',
                'https://www.pubnub.com/docs/chat/chat-sdk/build/features/custom-events',
                ToastType.INFO
              )
            }
          >
            {/* Checkbox is currently disabled with no handlers */}
            <input
              type="checkbox"
              className="checked:before:bg-neutral-400 checked:after:translate-x-0"
              defaultChecked={false}
              onChange={(e) => {}}
            />
          </div>
        </div>
        <div className="border-navy600 border"></div>

        <div className="flex flex-row px-4 py-6">
          <div className="flex flex-col">
            <div className="pb-2 text-lg text-white">Read receipts</div>
            <div className="text-base text-white">
              Receive receipts when messages are sent and read
            </div>
          </div>
          <div
            className="relative inline-block h-6"
            onClick={() =>
              showUserMessage(
                'Demo Limitation:',
                'Though supported by the Chat SDK, this demo does not support disabling read receipts',
                'https://www.pubnub.com/docs/chat/chat-sdk/build/features/messages/read-receipts',
                ToastType.INFO
              )
            }
          >
            {/* Checkbox is currently disabled with no handlers */}
            <input
              type="checkbox"
              className="before:bg-sky-600 after:translate-x-4"
              onChange={() => {}}
            />
          </div>
        </div>

        <div className="border-navy600 border"></div>

        <div
          className={`${roboto.className} mx-2.5 my-6 flex h-10 cursor-pointer flex-row items-center justify-center rounded-lg border border-[#938F99] bg-sky-950 px-4 text-sm font-medium text-white`}
          onClick={(e) => logout()}
        >
          <Image
            src="/icons/logout.svg"
            alt="Logout"
            className="p-3"
            width={36}
            height={36}
            priority
          />
          Log out
        </div>
      </div>
    </div>
  );
}
