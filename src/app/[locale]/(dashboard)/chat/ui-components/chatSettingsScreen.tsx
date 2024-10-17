import Image from 'next/image';
import Avatar from './avatar';
import { roboto } from '../fonts';
import { Membership, User } from '@pubnub/chat';
import { useState, useEffect } from 'react';
import { ToastType } from '../types';
import { actionCompleted } from 'pubnub-demo-integration';

export default function ChatSettingsScreen({
  chatSettingsScreenVisible,
  setChatSettingsScreenVisible,
  changeChatNameScreenVisible,
  manageMembersModalVisible,
  isDirectChat,
  activeChannel,
  activeChannelUsers,
  buttonAction,
  changeChatNameAction = () => {},
  manageMembershipsAction = () => {},
  showUserMessage,
}) {
  const MAX_AVATARS_SHOWN = 13;

  useEffect(() => {
    if (!chatSettingsScreenVisible) return;
    actionCompleted({
      action: 'Open the Chat Settings',
      blockDuplicateCalls: false,
      debug: false,
    });
  }, [chatSettingsScreenVisible]);

  return (
    <div
      className={`${
        !chatSettingsScreenVisible && 'hidden'
      } fixed right-0 z-20 flex h-16 h-full w-96 select-none flex-col flex-wrap rounded-l-lg bg-sky-950 p-3`}
    >
      <div
        className={`${roboto.className} ${
          (changeChatNameScreenVisible || manageMembersModalVisible) && 'opacity-40'
        }  flex flex flex-row items-center py-3 text-sm font-medium text-white`}
      >
        <div className={`flex cursor-pointer`} onClick={(e) => setChatSettingsScreenVisible(false)}>
          <Image
            src="/icons/close-rooms.svg"
            alt="Close Rooms"
            className="p-3"
            width={36}
            height={36}
            priority
          />
        </div>
        Chat settings
      </div>

      <div
        className={`${(changeChatNameScreenVisible || manageMembersModalVisible) && 'opacity-40'} `}
      >
        <div
          className={`${roboto.className} flex flex flex-row items-center justify-between p-4 text-sm font-medium text-white`}
        >
          Settings
        </div>

        <div className="flex flex-col">
          {/* Avatar(s) */}
          <div className="flex justify-center pb-6">
            <div className="flex flex-row -space-x-2.5">
              {activeChannelUsers?.map(
                (member, index) =>
                  index < MAX_AVATARS_SHOWN && (
                    <Avatar key={index} avatarUrl={member.profileUrl} width={88} height={88} />
                  )
              )}
            </div>
          </div>

          {/* Chat members for 1:1 chats, or Chat name for Group chats */}
          {isDirectChat ? (
            <div className="flex flex-row items-center justify-between px-4 py-4">
              <div className="flex flex-col">
                <div className="text-lg text-white">Chat members</div>
                {activeChannelUsers?.map((member, index) => (
                  <div className="text-lg font-semibold text-white" key={index}>
                    {member.name}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-row items-center justify-between px-4 py-4">
              <div className="flex flex-col">
                <div className="text-lg font-normal text-white">Chat name</div>
                <div className="text-lg font-semibold text-white">{activeChannel?.name}</div>
              </div>
              <div
                className={`${roboto.className} bg-pubnubbabyblue mx-2.5 flex h-10 cursor-pointer flex-row items-center justify-between rounded-lg px-6 text-sm font-medium`}
                onClick={(e) => changeChatNameAction()}
              >
                Change
              </div>
            </div>
          )}

          <div className="border-navy600 border"></div>

          {!isDirectChat && (
            <div>
              {' '}
              <div className="flex flex-row items-center justify-between px-4 py-6">
                <div className="text-lg text-white">Members</div>
                <div
                  className={`${roboto.className} bg-pubnubbabyblue mx-2.5 flex h-10 cursor-pointer flex-row items-center justify-between rounded-lg px-6 text-sm font-medium`}
                  onClick={(e) => manageMembershipsAction()}
                >
                  Manage
                </div>
              </div>
              <div className="border-navy600 border"></div>
            </div>
          )}

          <div className="flex flex-row px-4 py-6">
            <div className="flex flex-col">
              <div className="pb-2 text-lg text-white">Mute chat</div>
              <div className="text-base text-white">
                Get notified about new messages and mentions from chats
              </div>
            </div>
            <div
              className="relative inline-block h-6"
              onClick={() => {
                showUserMessage(
                  'Demo Limitation:',
                  'Though supported by the Chat SDK, this demo does not yet support custom events or notifications',
                  'https://www.pubnub.com/docs/chat/chat-sdk/build/features/custom-events',
                  ToastType.INFO
                );
              }}
            >
              {/* Checkbox is currently disabled with no handlers */}
              <input
                type="checkbox"
                defaultChecked={false}
                className="checked:before:bg-neutral-400 checked:after:translate-x-0"
                onChange={(e) => {}}
              />
            </div>
          </div>
          <div className="border-navy600 border"></div>

          {isDirectChat ? (
            <div
              className={`${roboto.className} mx-2.5 my-6 flex h-10 cursor-pointer flex-row items-center justify-center rounded-lg border border-[#938F99] bg-sky-950 px-4 text-sm font-medium text-white`}
              onClick={(e) => buttonAction()}
            >
              <Image
                src="/icons/logout.svg"
                alt="Leave Conversation"
                className="p-2"
                width={36}
                height={36}
                priority
              />
              Leave this 1:1 chat
            </div>
          ) : (
            activeChannel?.type !==
              'public' /* To simplify the logic of the demo, do not allow to leave from public channels */ && (
              <div
                className={`${roboto.className} mx-2.5 my-6 flex h-10 cursor-pointer flex-row items-center justify-center rounded-lg border border-[#938F99] bg-sky-950 px-4 text-sm font-medium text-white`}
                onClick={(e) => buttonAction()}
              >
                <Image
                  src="/icons/logout.svg"
                  alt="Logout"
                  className="p-3"
                  width={36}
                  height={36}
                  priority
                />
                Leave conversation
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
