// @ts-nocheck

import Avatar from './avatar';
import Image from 'next/image';
import { roboto } from '../fonts';
import { useState, useEffect, useCallback } from 'react';
import MessageActions from './messageActions';
import PinnedMessagePill from './pinnedMessagePill';
import QuotedMessage from './quotedMessage';
import MessageReaction from './messageReaction';
import { MessageActionsTypes, PresenceIcon, ToastType } from '../types';
import ToolTip from './toolTip';
import { Channel, TimetokenUtils, MixedTextTypedElement } from '@pubnub/chat';

export default function Message({
  received,
  inThread = false,
  inPinned = false,
  avatarUrl,
  readReceipts,
  showReadIndicator = true,
  quotedMessageSender = '',
  sender,
  messageActionHandler = (a, b) => {},
  pinned = false,
  unpinMessageHandler = () => {},
  message,
  currentUserId,
  isOnline = -1,
  showUserMessage = (a, b, c, d) => {},
}) {
  const [showToolTip, setShowToolTip] = useState(false);
  const [actionsShown, setActionsShown] = useState(false);
  let messageHovered = false;
  let actionsHovered = false;

  const handleMessageMouseEnter = (e) => {
    messageHovered = true;
    setActionsShown(true);
  };
  const handleMessageMouseLeave = (e) => {
    messageHovered = false;
    setActionsShown(false);
  };

  function testIfActionsHovered() {
    if (messageHovered) return;
    if (!actionsHovered) {
      setActionsShown(false);
    }
  }

  function handleMessageActionsEnter() {
    actionsHovered = true;
    setActionsShown(true);
  }

  function handleMessageActionsLeave() {
    actionsHovered = false;
    if (!messageHovered) {
      setActionsShown(false);
    }
  }

  function copyMessageText(messageText) {
    navigator.clipboard.writeText(messageText);
  }

  function openLink(url) {
    window.open(url, '_blank');
  }

  function userClick(userId, userName) {
    showUserMessage(
      '@Mentioned User Clicked:',
      `You have Clicked on user with ID ${userId} and name ${userName}`,
      'https://www.pubnub.com/docs/chat/chat-sdk/build/features/users/mentions',
      ToastType.INFO
    );
  }

  function channelClick(channelId, channelName) {
    showUserMessage(
      '#Referenced Channel Clicked:',
      `You have Clicked on channel with ID ${channelId} and name ${channelName}`,
      'https://www.pubnub.com/docs/chat/chat-sdk/build/features/channels/references',
      ToastType.INFO
    );
  }

  async function reactionClicked(emoji, timetoken) {
    await message?.toggleReaction(emoji);
  }

  const determineUserReadableDate = useCallback((timetoken) => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const date = TimetokenUtils.timetokenToDate(timetoken);
    const datetime = `${days[date.getDay()]} ${date.getDate()} ${
      months[date.getMonth()]
    } ${(date.getHours() + '').padStart(2, '0')}:${(date.getMinutes() + '').padStart(2, '0')}`;

    return datetime;
  }, []);

  //  Originally I was not writing the 'lastTimetoken' for messages I was sending myself, however
  //  that caused the Chat SDK's notion of an unread message count inconsistent, so I am removing
  //  readReceipts I set myself in this useCallback
  const determineReadStatus = useCallback((timetoken, readReceipts) => {
    if (!readReceipts) return false;
    let returnVal = false;
    for (var i = 0; i < Object.keys(readReceipts).length; i++) {
      const receipt = Object.keys(readReceipts)[i];
      const findMe = readReceipts[receipt].indexOf(currentUserId);
      if (findMe > -1) {
        readReceipts[receipt].splice(findMe, 1);
      }
      if (readReceipts[receipt].length > 0 && receipt >= timetoken) {
        return true;
      }
    }
    return false;
  }, []);

  const renderMessagePart = useCallback((messagePart: MixedTextTypedElement, index: number) => {
    if (messagePart?.type === 'text') {
      return <span key={index}>{messagePart.content.text}</span>;
    }
    if (messagePart?.type === 'plainLink') {
      return (
        <span
          key={index}
          className="cursor-pointer underline"
          onClick={() => openLink(`${messagePart.content.link}`)}
        >
          {messagePart.content.link}
        </span>
      );
    }
    if (messagePart?.type === 'textLink') {
      return (
        <span
          key={index}
          className="cursor-pointer underline"
          onClick={() => openLink(`${messagePart.content.link}`)}
        >
          {messagePart.content.link}
        </span>
      );
    }
    if (messagePart?.type === 'mention') {
      return (
        <span
          key={index}
          onClick={() => userClick(`${messagePart.content.id}`, `${messagePart.content.name}`)}
          className="m-1 line-clamp-1 cursor-pointer select-none text-nowrap rounded-lg border border-neutral-300 bg-neutral-50 px-2 py-0.5 text-neutral-900"
        >
          @{messagePart.content.name}
        </span>
      );
    }

    if (messagePart?.type === 'channelReference') {
      return (
        <span
          key={index}
          onClick={() => channelClick(`${messagePart.content.id}`, `${messagePart.content.name}`)}
          className="m-1 line-clamp-1 cursor-pointer select-none text-nowrap rounded-lg border border-neutral-300 bg-neutral-50 px-2 py-0.5 text-neutral-900"
        >
          #{messagePart.content.name}
        </span>
      );
    }
    return 'error';
  }, []);

  return (
    <div className="flex w-full flex-col">
      <div
        className={`flex flex-row ${inThread ? '' : 'w-5/6'} my-4 ${
          inThread ? 'mx-6' : 'mx-8'
        } ${!received && !inThread && 'self-end'}`}
      >
        {received && !inThread && !inPinned && (
          <div className="min-w-11">
            {!inThread && (
              <Avatar
                present={isOnline}
                avatarUrl={avatarUrl ? avatarUrl : '/avatars/placeholder.png'}
              />
            )}
          </div>
        )}

        <div className="flex w-full flex-col gap-2">
          <div
            className={`flex flex-row ${
              inThread || inPinned || received ? 'justify-between' : 'justify-end'
            }`}
          >
            {pinned && !received && (
              <div className="flex grow select-none justify-start">
                <PinnedMessagePill />
              </div>
            )}
            {(inThread || inPinned || received) && (
              <div className={`${roboto.className} flex text-sm font-normal text-neutral-600`}>
                {sender}
                {(inThread || inPinned) && !received && ' (you)'}
                {pinned && <PinnedMessagePill />}
              </div>
            )}
            <div className={`${roboto.className} flex text-sm font-normal text-neutral-600`}>
              {determineUserReadableDate(message.timetoken)}
            </div>
          </div>

          <div
            className={`${roboto.className} relative flex text-base font-normal text-black ${
              received ? 'bg-neutral-50' : 'bg-[#e3f1fd]'
            } rounded-b-lg p-4 ${
              received ? 'rounded-tr-lg' : 'rounded-tl-lg'
            } pb-[${!received ? '40px' : '0px'}]`}
            onMouseEnter={handleMessageMouseEnter}
            onMouseMove={handleMessageMouseEnter}
            onMouseLeave={handleMessageMouseLeave}
          >
            {inPinned && (
              <div
                className="cursor-pointer"
                onClick={() => unpinMessageHandler()}
                onMouseEnter={() => {
                  setShowToolTip(true);
                }}
                onMouseLeave={() => {
                  setShowToolTip(false);
                }}
              >
                <div className="absolute right-[10px] top-[10px]">
                  <div className="relative">
                    <ToolTip
                      className={`${showToolTip ? 'block' : 'hidden'} bottom-[0px]`}
                      tip="Unpin"
                      messageActionsTip={false}
                    />
                  </div>
                  <Image
                    src="/icons/close.svg"
                    alt="Close"
                    className=""
                    width={20}
                    height={20}
                    priority
                  />
                </div>
              </div>
            )}
            <div className="flex w-full flex-col">
              {message.quotedMessage && (
                <QuotedMessage
                  originalMessage={message}
                  originalMessageReceived={received}
                  quotedMessage={message.quotedMessage}
                  quotedMessageSender={quotedMessageSender}
                  setQuotedMessage={null}
                  displayedWithMesageInput={false}
                />
              )}
              {/* Will chase with the chat team to see why I need these conditions (get an error about missing 'type' if they are absent) */}
              <div className="flex w-full flex-row flex-wrap items-center">
                {(message.content.text ||
                  message.content.plainLink ||
                  message.content.textLink ||
                  message.content.mention ||
                  message.content.channelReference) &&
                  message
                    .getMessageElements()
                    .map((msgPart, index) => renderMessagePart(msgPart, index))}
                {message.actions && message.actions.edited && (
                  <span className="text-navy500">&nbsp;&nbsp;(edited)</span>
                )}
                {message.files && message.files.length > 0 && (
                  <Image
                    src={`${message.files[0].url}`}
                    alt="PubNub Logo"
                    className="absolute right-2 top-2"
                    width={25}
                    height={25}
                  />
                )}
              </div>
            </div>
            {!received && showReadIndicator && (
              <Image
                src={`${
                  determineReadStatus(message.timetoken, readReceipts)
                    ? '/icons/read.svg'
                    : '/icons/sent.svg'
                }`}
                alt="Read"
                className="absolute bottom-[14px] right-[10px]"
                width={21}
                height={10}
                priority
              />
            )}
            <div className="absolute -bottom-[20px] right-[10px] z-10 flex select-none flex-row items-center">
              {/*arrayOfEmojiReactions*/}
              {message.reactions
                ? Object?.keys(message.reactions)
                    .slice(0, 18)
                    .map((emoji, index) => (
                      <MessageReaction
                        emoji={emoji}
                        messageTimetoken={message.timetoken}
                        count={message.reactions[emoji].length}
                        reactionClicked={reactionClicked}
                        key={index}
                      />
                    ))
                : ''}
            </div>
            {!inThread && message.hasThread && (
              <div
                className="absolute -bottom-[28px] right-[10px] z-0 flex cursor-pointer select-none flex-row items-center"
                onClick={() => {
                  messageActionHandler(MessageActionsTypes.REPLY_IN_THREAD, message);
                }}
              >
                {/*Whether or not there is a threaded reply*/}
                <div className="flex cursor-pointer flex-row">
                  <Image
                    src="/icons/reveal-thread.svg"
                    alt="Expand"
                    className=""
                    width={20}
                    height={20}
                    priority
                  />
                  <div className="text-navy700 text-sm font-normal">Replies</div>
                </div>
              </div>
            )}
            {/* actions go here for received */}
            {received && !inThread && !inPinned && (
              <MessageActions
                received={received}
                actionsShown={actionsShown}
                timetoken={message.timetoken}
                isPinned={pinned}
                messageActionsEnter={() => handleMessageActionsEnter()}
                messageActionsLeave={() => handleMessageActionsLeave()}
                replyInThreadClick={() =>
                  messageActionHandler(MessageActionsTypes.REPLY_IN_THREAD, message)
                }
                quoteMessageClick={() => messageActionHandler(MessageActionsTypes.QUOTE, message)}
                pinMessageClick={() => {
                  messageActionHandler(MessageActionsTypes.PIN, message);
                }}
                showEmojiPickerClick={(data) => {
                  messageActionHandler(MessageActionsTypes.SHOW_EMOJI, data);
                }}
                copyMessageClick={() => {
                  copyMessageText(message.content.text);
                  messageActionHandler(MessageActionsTypes.COPY, {
                    text: message.content.text,
                  });
                }}
              />
            )}
          </div>
          {/* actions go here for sent */}
          {!received && !inThread && !inPinned && (
            <MessageActions
              received={received}
              actionsShown={actionsShown}
              timetoken={message.timetoken}
              isPinned={pinned}
              messageActionsEnter={() => handleMessageActionsEnter()}
              messageActionsLeave={() => handleMessageActionsLeave()}
              replyInThreadClick={() =>
                messageActionHandler(MessageActionsTypes.REPLY_IN_THREAD, message)
              }
              quoteMessageClick={() => messageActionHandler(MessageActionsTypes.QUOTE, message)}
              pinMessageClick={() => {
                messageActionHandler(MessageActionsTypes.PIN, message);
              }}
              showEmojiPickerClick={(data) => {
                messageActionHandler(MessageActionsTypes.SHOW_EMOJI, data);
              }}
              copyMessageClick={() => {
                copyMessageText(message.content.text);
                messageActionHandler(MessageActionsTypes.COPY, {
                  text: message.content.text,
                });
              }}
            />
          )}
        </div>
      </div>
      {inPinned && (
        <div className="border-navy200 mt-2 flex w-5/6 flex-row place-self-center border"></div>
      )}
    </div>
  );
}
