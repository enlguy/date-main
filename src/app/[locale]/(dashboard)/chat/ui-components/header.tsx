import Image from 'next/image';
import { roboto } from '../fonts';
import { ToastType } from '../types';

export default function Header({
  setRoomSelectorVisible,
  setProfileScreenVisible,
  creatingNewMessage,
  setCreatingNewMessage,
  showNotificationBadge = false,
  showMentionsBadge = false,
  showUserMessage,
  guidedDemo,
}) {
  return (
    <div
      id="header"
      className="fixed z-10 flex h-16 w-full select-none flex-row flex-nowrap justify-between bg-sky-950"
    >
      <div
        id="room-selector"
        className="m-1 ml-2.5 flex cursor-pointer items-center justify-center gap-2.5 rounded-md px-2 hover:bg-sky-900"
        onClick={(e) => setRoomSelectorVisible(true)}
      >
        <div id="room-avatar" className="bg-navy50 flex h-12 w-12 justify-center rounded-full">
          <Image
            src="/pn-logo-red-tint.png"
            alt="PubNub Logo"
            className="flex self-center"
            width={23.81}
            height={17.07}
            priority
          />
        </div>
        <div className="text-neutral50 text-base">PubNub</div>
      </div>
      {guidedDemo && (
        <div className="text-neutral50 hidden items-center text-2xl font-semibold md:flex">
          Guided Demo - demo@pubnub.com
        </div>
      )}
      <div className="mr-2.5 flex items-center">
        <div
          id="btn-message-new"
          className={`${
            roboto.className
          } mx-2.5 flex h-10 min-w-52 flex-row items-center rounded-lg px-4 text-sm font-medium ${'bg-pubnubbabyblue'} cursor-pointer`}
          onClick={() => setCreatingNewMessage(true)}
        >
          <Image
            src="/icons/new_message.svg"
            alt="New Message icon"
            className="mr-3 flex self-center"
            width={15}
            height={15}
            priority
          />
          New Message / Group
        </div>
        <div
          className="cursor-pointer hover:rounded-md hover:bg-sky-900"
          onClick={(e) =>
            showUserMessage(
              'Demo Limitation:',
              'Although not supported by this demo, you use the Chat SDK to alert your users with built-in or custom events',
              'https://www.pubnub.com/docs/chat/chat-sdk/build/features/custom-events',
              ToastType.INFO
            )
          }
        >
          <div className="relative min-w-12">
            <Image
              src="/icons/notifications_none.svg"
              alt="Notifications"
              className="m-3 flex self-center"
              width={24}
              height={24}
              priority
            />
            {showNotificationBadge && (
              <div className="bg-cherry absolute left-[23px] top-[0px] h-[12px] w-[12px] rounded-full border-2 border-sky-950"></div>
            )}
          </div>
        </div>
        <div
          className="cursor-pointer hover:rounded-md hover:bg-sky-900"
          onClick={(e) =>
            showUserMessage(
              null,
              'The Chat SDK supports mentioning @users and #channels.  This demo will show you a pop-up message when somebody mentions you',
              'https://www.pubnub.com/docs/chat/chat-sdk/build/features/users/mentions'
            )
          }
        >
          <div className="relative min-w-12">
            <Image
              src="/icons/alternate_email.svg"
              alt="Mentions"
              className="m-3 flex self-center"
              width={24}
              height={24}
              priority
            />
            {showMentionsBadge && (
              <div className="bg-cherry absolute left-[23px] top-[0px] h-[12px] w-[12px] rounded-full border-2 border-sky-950"></div>
            )}
          </div>
        </div>
        <div
          className="min-w-12 cursor-pointer hover:rounded-md hover:bg-sky-900"
          onClick={(e) => setProfileScreenVisible(true)}
        >
          <Image
            src="/icons/person_outline.svg"
            alt="My Profile"
            className="m-3 flex self-center"
            width={24}
            height={24}
            priority
          />
        </div>
      </div>
    </div>
  );
}
