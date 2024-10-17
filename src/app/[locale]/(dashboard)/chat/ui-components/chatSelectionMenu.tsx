// @ts-nocheck

'use client';

import Image from 'next/image';
import { useState } from 'react';
import ChatMenuHeader from './chatMenuHeader';
import ChatMenuItem from './chatMenuItem';
import {
  ChatHeaderActionIcon,
  PresenceIcon,
  ToastType,
  useBreakpoints,
  useMediaQuery,
} from '../types';

export default function ChatSelectionMenu({
  chatSelectionMenuMinimized,
  setChatSelectionMenuMinimized,
  chat,
  setCreatingNewMessage,
  setShowThread,
  unreadMessages,
  publicChannels,
  publicChannelsMemberships,
  privateGroups,
  privateGroupsUsers,
  privateGroupsMemberships,
  directChats,
  directChatsUsers,
  directChatsMemberships,
  activeChannel,
  setActiveChannel,
  setActiveChannelPinnedMessage,
  updateUnreadMessagesCounts,
  currentUserProfileUrl,
  showUserMessage,
}) {
  const [unreadExpanded, setUnreadExpanded] = useState(true);
  const [publicExpanded, setPublicExpanded] = useState(true);
  const [groupsExpanded, setGroupsExpanded] = useState(true);
  const [directMessagesExpanded, setDirectMessagesExpanded] = useState(true);
  const { isXs, isSm, isMd, isLg, active } = useBreakpoints();
  const [searchChannels, setSearchChannels] = useState('');

  function handleChatSearch(term: string) {
    setSearchChannels(term);
  }

  return (
    <div
      id="chats-menu"
      className={`flex flex-col ${
        !isLg && chatSelectionMenuMinimized ? 'w-5 min-w-5' : 'w-60 min-w-60 lg:w-80 lg:min-w-80'
      } bg-navy50 border-navy-200 mt-[64px] select-none overflow-y-auto overscroll-none border-r py-0 pb-6`}
    >
      <div
        className={`${
          !isLg && chatSelectionMenuMinimized ? 'flex flex-row' : 'hidden'
        } h-screen min-h-screen bg-sky-950`}
      >
        <div
          className="flex cursor-pointer"
          onClick={(e) => {
            setChatSelectionMenuMinimized(!chatSelectionMenuMinimized);
            setShowThread(false);
          }}
        >
          <Image
            src="/icons/close-rooms.svg"
            alt="Expand Chats"
            className="mb-7 rotate-180 p-1"
            width={36}
            height={36}
            priority
          />
        </div>
      </div>
      <div className={`flex flex-col ${!isLg && chatSelectionMenuMinimized ? 'hidden' : 'flex'}`}>
        <div className={`relative mt-5 px-4`}>
          <input
            id="chats-search-input"
            value={searchChannels}
            className="bg-navy50 focus:ring-inputring flex w-full rounded-md  border border-neutral-400 px-[13px] py-[9px] pl-9 text-sm outline-none placeholder:text-neutral-500 focus:ring-1"
            placeholder="Search"
            onChange={(e) => {
              handleChatSearch(e.target.value);
            }}
          />
          <Image
            src="/icons/search.svg"
            alt="Search Icon"
            className="absolute left-6 top-1/2 h-[20px] w-[20px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"
            width={20}
            height={20}
            priority
          />
        </div>

        {unreadMessages && unreadMessages.length > 0 && (
          <ChatMenuHeader
            text="UNREAD"
            actionIcon={ChatHeaderActionIcon.MARK_READ}
            expanded={unreadExpanded}
            expandCollapse={() => {
              setUnreadExpanded(!unreadExpanded);
            }}
            action={async () => {
              const markedAsRead = await chat.markAllMessagesAsRead();
              updateUnreadMessagesCounts();

              showUserMessage(
                'Success:',
                'All messsages have been marked as read, and sent receipts are updated accordingly',
                'https://www.pubnub.com/docs/chat/chat-sdk/build/features/messages/unread#mark-messages-as-read-all-channels',
                ToastType.CHECK
              );
            }}
          />
        )}
        {unreadExpanded && (
          <div>
            {unreadMessages?.map(
              (unreadMessage, index) =>
                unreadMessage.channel.id !== activeChannel?.id &&
                (
                  (unreadMessage.channel.type === 'direct' && directChats
                    ? directChatsUsers[
                        directChats.findIndex(
                          (dmChannel) => dmChannel.id == unreadMessage.channel.id
                        )
                      ]?.find((user) => user.id !== chat.currentUser.id)?.name
                    : unreadMessage.channel.name) ?? ''
                )
                  .toLowerCase()
                  ?.indexOf(searchChannels.toLowerCase()) > -1 && (
                  <ChatMenuItem
                    key={index}
                    avatarUrl={
                      unreadMessage.channel.type === 'group'
                        ? currentUserProfileUrl
                          ? currentUserProfileUrl
                          : '/avatars/placeholder.png'
                        : unreadMessage.channel.type == 'public'
                          ? unreadMessage.channel.custom?.profileUrl
                            ? unreadMessage.channel.custom?.profileUrl
                            : '/avatars/placeholder.png'
                          : unreadMessage.channel.type == 'direct' && directChats
                            ? directChatsUsers[
                                directChats.findIndex(
                                  (dmChannel) => dmChannel.id == unreadMessage.channel.id
                                )
                              ]?.find((user) => user.id !== chat.currentUser.id)?.profileUrl
                              ? directChatsUsers[
                                  directChats.findIndex(
                                    (dmChannel) => dmChannel.id == unreadMessage.channel.id
                                  )
                                ]?.find((user) => user.id !== chat.currentUser.id)?.profileUrl
                              : '/avatars/placeholder.png'
                            : '/avatars/placeholder.png'
                    }
                    avatarBubblePrecedent={
                      unreadMessage.channel.type === 'group' && privateGroups
                        ? privateGroupsUsers[
                            privateGroups.findIndex((group) => group.id == unreadMessage.channel.id)
                          ]?.map((user) => user.id !== chat.currentUser.id)
                          ? `+${
                              privateGroupsUsers[
                                privateGroups.findIndex(
                                  (group) => group.id == unreadMessage.channel.id
                                )
                              ]?.map((user) => user.id !== chat.currentUser.id).length - 1
                            }`
                          : ''
                        : ''
                    }
                    text={
                      unreadMessage.channel.type === 'direct' && directChats
                        ? directChatsUsers[
                            directChats.findIndex(
                              (dmChannel) => dmChannel.id == unreadMessage.channel.id
                            )
                          ]?.find((user) => user.id !== chat.currentUser.id)?.name
                        : unreadMessage.channel.name
                    }
                    present={PresenceIcon.NOT_SHOWN}
                    count={'' + unreadMessage.count}
                    markAsRead={true}
                    markAsReadAction={async (e) => {
                      e.stopPropagation();
                      if (
                        unreadMessage.channel.type === 'public' &&
                        publicChannelsMemberships &&
                        publicChannels
                      ) {
                        const index = publicChannelsMemberships.findIndex(
                          (membership) => membership.channel.id == unreadMessage.channel.id
                        );
                        if (index > -1) {
                          const lastMessage = await publicChannels[index]?.getHistory({ count: 1 });
                          if (lastMessage && lastMessage.messages) {
                            await publicChannelsMemberships[index].setLastReadMessage(
                              lastMessage.messages[0]
                            );
                            updateUnreadMessagesCounts();
                          }
                        }
                      } else if (
                        unreadMessage.channel.type === 'group' &&
                        privateGroupsMemberships &&
                        privateGroups
                      ) {
                        const index = privateGroupsMemberships.findIndex(
                          (membership) => membership.channel.id == unreadMessage.channel.id
                        );
                        if (index > -1) {
                          const lastMessage = await privateGroups[index]?.getHistory({ count: 1 });
                          if (lastMessage && lastMessage.messages) {
                            await privateGroupsMemberships[index].setLastReadMessage(
                              lastMessage.messages[0]
                            );
                            updateUnreadMessagesCounts();
                          }
                        }
                      } else if (
                        unreadMessage.channel.type === 'direct' &&
                        directChatsMemberships &&
                        directChats
                      ) {
                        const index = directChatsMemberships.findIndex(
                          (membership) => membership.channel.id == unreadMessage.channel.id
                        );
                        if (index > -1) {
                          const lastMessage = await directChats[index]?.getHistory({ count: 1 });
                          if (lastMessage && lastMessage.messages) {
                            await directChatsMemberships[index].setLastReadMessage(
                              lastMessage.messages[0]
                            );
                            updateUnreadMessagesCounts();
                          }
                        }
                      }
                    }}
                    setActiveChannel={() => {
                      setActiveChannelPinnedMessage(null);
                      setCreatingNewMessage(false);
                      if (unreadMessage.channel.type === 'public' && publicChannels) {
                        const index = publicChannels.findIndex(
                          (channel) => channel.id == unreadMessage.channel.id
                        );
                        if (index > -1) {
                          setActiveChannel(publicChannels[index]);
                        }
                      } else if (unreadMessage.channel.type === 'group' && privateGroups) {
                        const index = privateGroups.findIndex(
                          (group) => group.id == unreadMessage.channel.id
                        );
                        if (index > -1) {
                          setActiveChannel(privateGroups[index]);
                        }
                      } else if (unreadMessage.channel.type === 'direct' && directChats) {
                        const index = directChats.findIndex(
                          (dmChannel) => dmChannel.id == unreadMessage.channel.id
                        );
                        if (index > -1) {
                          setActiveChannel(directChats[index]);
                        }
                      }
                    }}
                  ></ChatMenuItem>
                )
            )}
          </div>
        )}

        {unreadMessages && unreadMessages.length > 0 && (
          <div className="border-navy200 mt-4 w-full border"></div>
        )}

        <ChatMenuHeader
          text="PUBLIC CHANNELS"
          expanded={publicExpanded}
          expandCollapse={() => {
            setPublicExpanded(!publicExpanded);
          }}
          actionIcon={ChatHeaderActionIcon.NONE}
          action={() => {}}
        />
        {publicExpanded && (
          <div>
            {publicChannels?.map(
              (publicChannel, index) =>
                (publicChannel.name ?? '').toLowerCase().indexOf(searchChannels.toLowerCase()) >
                  -1 && (
                  <ChatMenuItem
                    key={index}
                    avatarUrl={
                      publicChannel.custom.profileUrl
                        ? publicChannel.custom.profileUrl
                        : '/avatars/placeholder.png'
                    }
                    text={publicChannel.name}
                    present={PresenceIcon.NOT_SHOWN}
                    setActiveChannel={() => {
                      setCreatingNewMessage(false);
                      setActiveChannelPinnedMessage(null);
                      setActiveChannel(publicChannels[index]);
                    }}
                  ></ChatMenuItem>
                )
            )}
          </div>
        )}

        <div className="border-navy200 mt-4 w-full border"></div>
        <ChatMenuHeader
          text="PRIVATE GROUPS"
          expanded={groupsExpanded}
          expandCollapse={() => setGroupsExpanded(!groupsExpanded)}
          actionIcon={ChatHeaderActionIcon.ADD}
          action={setCreatingNewMessage}
        />
        {groupsExpanded && (
          <div>
            {privateGroups?.map(
              (privateGroup, index) =>
                (privateGroup.name ?? '').toLowerCase().indexOf(searchChannels.toLowerCase()) >
                  -1 && (
                  <ChatMenuItem
                    key={index}
                    avatarUrl={
                      currentUserProfileUrl ? currentUserProfileUrl : '/avatars/placeholder.png'
                    }
                    text={privateGroup.name}
                    present={PresenceIcon.NOT_SHOWN}
                    avatarBubblePrecedent={
                      privateGroupsUsers[index]?.map((user) => user.id !== chat.currentUser.id)
                        ? `+${
                            privateGroupsUsers[index]?.map(
                              (user) => user.id !== chat.currentUser.id
                            ).length - 1
                          }`
                        : ''
                    }
                    setActiveChannel={() => {
                      setCreatingNewMessage(false);
                      setActiveChannelPinnedMessage(null);
                      setActiveChannel(privateGroups[index]);
                    }}
                  />
                )
            )}
          </div>
        )}

        <div className="border-navy200 mt-4 w-full border"></div>
        <ChatMenuHeader
          text="DIRECT MESSAGES"
          expanded={directMessagesExpanded}
          expandCollapse={() => setDirectMessagesExpanded(!directMessagesExpanded)}
          actionIcon={ChatHeaderActionIcon.ADD}
          action={setCreatingNewMessage}
        />
        {directMessagesExpanded && (
          <div>
            {directChats?.map(
              (directChat, index) =>
                (
                  directChatsUsers[index]?.find((user) => user.id !== chat.currentUser.id)?.name ??
                  ''
                )
                  .toLowerCase()
                  .indexOf(searchChannels.toLowerCase()) > -1 && (
                  <ChatMenuItem
                    key={index}
                    avatarUrl={
                      directChatsUsers[index]?.find((user) => user.id !== chat.currentUser.id)
                        ?.profileUrl
                        ? directChatsUsers[index]?.find((user) => user.id !== chat.currentUser.id)
                            ?.profileUrl
                        : '/avatars/placeholder.png'
                    }
                    text={
                      directChatsUsers[index]?.find((user) => user.id !== chat.currentUser.id)?.name
                    }
                    present={
                      directChatsUsers[index]?.find((user) => user.id !== chat.currentUser.id)
                        ?.active
                        ? PresenceIcon.ONLINE
                        : PresenceIcon.OFFLINE
                    }
                    setActiveChannel={() => {
                      setCreatingNewMessage(false);
                      setActiveChannelPinnedMessage(null);
                      setActiveChannel(directChats[index]);
                    }}
                  />
                )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
