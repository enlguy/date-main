import { useState } from 'react';
import Image from 'next/image';

import { Chat, User } from '@pubnub/chat';
import { actionCompleted } from 'pubnub-demo-integration';

import { roboto } from '../fonts';
import { ChatEventTypes, PresenceIcon,ToastType } from '../types';
import Avatar from './avatar';
import Message from './message';
import NewMessageUserPill from './newMessageUserPill';
import NewMessageUserRow from './newMessageUserRow';

export default function NewMessageGroup({
  chat,
  currentUser,
  setCreatingNewMessage,
  showUserMessage,
  sendChatEvent,
  invokeRefresh,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [newDraftGroupUsers, setNewDraftGroupUsers] = useState<User[]>([currentUser]);
  const [creationInProgress, setCreationInProgress] = useState(false);

  function handleUserSearch(term: string) {
    setSearchTerm(term);
    if (!chat) return;
    chat
      .getUsers({
        limit: 10,
        filter: `name LIKE "*${term}*" || id LIKE "*${term}*"`,
      }) //  Could also filter by Profile URL:  || profileUrl LIKE "*${term}*"
      .then((userResults) => {
        setSearchResults(userResults.users);
      });
  }

  function onSearchResultClicked(newUser: User) {
    const alreadyPresent = newDraftGroupUsers.find((user) => user.id === newUser.id);
    if (alreadyPresent) {
      showUserMessage(
        'User Already Selected',
        `${newUser.name} is already selected for this new group`,
        '',
        ToastType.ERROR
      );
    } else if (newDraftGroupUsers.length >= 10) {
      showUserMessage(
        'Demo Limitation',
        'Though the Chat SDK supports groups of up to 100 members, this demo caps the maximum member count at 10',
        'https://www.pubnub.com/docs/chat/chat-sdk/build/features/channels/create#input-1',
        ToastType.ERROR
      );
    } else {
      setNewDraftGroupUsers((newDraftGroupUsers) => [...newDraftGroupUsers, newUser]);
      setSearchTerm('');
    }
  }

  function onRemovePill(removingUserId) {
    const filteredArray = newDraftGroupUsers.filter((user) => user.id !== removingUserId);
    setNewDraftGroupUsers(filteredArray);
  }

  async function createGroup() {
    setCreationInProgress(true);
    //  Call createGroup or direct conversation, depending on which one it is.
    //  Send joined events to all participants to let them know they are in a new group
    //  Refresh all my membership arrays from the server
    //  Set the new group as the active chat session

    let desiredChannelId = '';
    let createdChannel = null;
    if (newDraftGroupUsers.length == 2) {
      //  Creating a 1:1 conversation
      const otherUser = newDraftGroupUsers.find((user) => user.id !== chat.currentUser.id);
      const { channel } = await chat.createDirectConversation({
        user: otherUser,
      }); //  Accepting defaults for channel ID and channel Data
      desiredChannelId = channel.id;
      createdChannel = channel;
      actionCompleted({
        action: 'Create a new 1:1 (Direct) Chat',
        blockDuplicateCalls: false,
        debug: false,
      });
    } else {
      //  Creating a group conversation
      const randomNewChannelName = 'Group ' + Math.floor(Math.random() * 1000);
      const others = newDraftGroupUsers.filter((user) => user.id !== chat.currentUser.id);
      const { channel } = await chat.createGroupConversation({
        users: others,
        channelData: { name: randomNewChannelName },
      });
      desiredChannelId = channel.id;
      createdChannel = channel;
      actionCompleted({
        action: 'Create a new Private Group',
        blockDuplicateCalls: false,
        debug: false,
      });
    }
    if (createdChannel) {
      invokeRefresh(desiredChannelId, createdChannel['type']);
    }
    setCreatingNewMessage(false);
  }

  return (
    <div className="flex max-h-screen select-none flex-col">
      <div className="border-navy-200 flex min-w-full flex-col border">
        <div className="flex flex-row gap-4 py-2">
          <div
            className={`${roboto.className} flex flex-row items-center px-3 text-base font-medium`}
          >
            <div className="cursor-pointer" onClick={(e) => setCreatingNewMessage(false)}>
              <Image
                src="/icons/west.svg"
                alt="Send"
                className="m-3"
                width={24}
                height={24}
                priority
              />
            </div>
            New Message / Group
          </div>
          <div
            className={`${roboto.className} flex min-h-10 grow flex-row items-center justify-center gap-4 text-base font-medium text-[#101729]`}
          >
            <div className="flex flex-row -space-x-2.5">
              {newDraftGroupUsers?.map((user, index) => (
                <Avatar
                  key={index}
                  present={PresenceIcon.NOT_SHOWN}
                  avatarUrl={user.profileUrl ? user.profileUrl : '/avatars/placeholder.png'}
                  border={true}
                  width={36}
                  height={36}
                />
              ))}
            </div>
            <div className="flex flex-row gap-2">
              {newDraftGroupUsers?.length == 1
                ? 'Please Choose some friends'
                : newDraftGroupUsers?.length == 2
                  ? 'New Direct Conversation'
                  : 'New Private Group'}
            </div>
          </div>
        </div>

        <div className="w-2/3 px-6 py-2">
          <input
            className="focus:ring-inputring flex h-12 w-full rounded-md border border-neutral-300 bg-white px-6 text-sm shadow-sm outline-none placeholder:text-neutral-600 focus:ring-1"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => {
              handleUserSearch(e.target.value);
            }}
          />
        </div>

        {/* Search Results */}
        {searchTerm.length > 0 && (
          <div className="w-full px-6">
            <div className="relative w-full px-6">
              <div className="absolute left-[0px] top-[0px] z-10 flex w-2/5 flex-col rounded-lg border border-neutral-100 bg-white shadow-lg">
                {/* Search Results */}

                {searchResults?.map((user, index) => (
                  <NewMessageUserRow
                    key={index}
                    user={user}
                    present={user.active ? PresenceIcon.ONLINE : PresenceIcon.OFFLINE}
                    clickAction={(user) => onSearchResultClicked(user)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mb-2 flex w-full flex-wrap bg-white px-6 ">
          {newDraftGroupUsers?.map((user, index) => (
            <NewMessageUserPill
              key={index}
              user={user}
              isMe={user.id == chat.currentUser.id}
              removePillAction={(userId) => onRemovePill(userId)}
            />
          ))}
        </div>
      </div>
      <div
        className={`${newDraftGroupUsers.length < 2 ? 'hidden' : 'flex'} mt-3 flex-row justify-end`}
      >
        <div className={`${roboto.className} flex flex-row`} onClick={(e) => createGroup()}>
          <div
            className={`${
              creationInProgress && 'hidden'
            } bg-pubnubbabyblue mx-2.5 flex h-10 cursor-pointer items-center justify-between rounded-lg px-6 text-sm font-medium`}
          >
            Create
          </div>
          <div
            className={`${
              !creationInProgress ? 'hidden' : 'flex'
            }  mr-3 h-[40px] w-[40px] animate-spin`}
          >
            <Image
              src="/icons/loading.png"
              alt="Chat Icon"
              className=""
              width={40}
              height={40}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
