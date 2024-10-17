import { useEffect,useState } from 'react';
import Image from 'next/image';

import { roboto } from '../fonts';
import { ChatNameModals, ToastType } from '../types';

export default function ModalChangeName({
  name,
  activeChannel,
  modalType,
  saveAction,
  showUserMessage,
  changeNameModalVisible,
  setChangeNameModalVisible,
}) {
  const [newChatName, setNewChatName] = useState('');

  useEffect(() => {
    if (!activeChannel || modalType == ChatNameModals.USER) return;
    setNewChatName(activeChannel.name);
  }, [activeChannel, modalType]);

  useEffect(() => {
    if (!name || modalType == ChatNameModals.CHANNEL) return;
    setNewChatName(name);
  }, [modalType, name]);

  return (
    <div
      className={`${
        !changeNameModalVisible && 'hidden'
      } fixed inset-0 z-40 mx-auto flex select-none items-center justify-center`}
    >
      {/* Example Modal */}
      <div className="flex flex-col rounded-xl border border-neutral-300 bg-white shadow-xl sm:w-2/3 md:w-2/3 lg:w-1/2">
        <div className="flex flex-row justify-end">
          <div
            className=" cursor-pointer"
            onClick={() => {
              setChangeNameModalVisible(false);
            }}
          >
            <Image
              src="/icons/close.svg"
              alt="Close"
              className="m-3"
              width={24}
              height={24}
              priority
            />
          </div>
        </div>
        <div className="flex flex-col gap-5 px-12 pb-12">
          <div className="mb-2 flex justify-center text-lg font-semibold text-neutral-900">
            {modalType == ChatNameModals.USER ? 'Change your name' : 'Change chat name'}
          </div>
          <div className="flex justify-center text-base font-normal text-neutral-600">
            {modalType == ChatNameModals.USER
              ? 'The Chat SDK uses Metadata to store context about your user, such as their name or alias'
              : 'The Chat SDK uses Metadata to store context about your chat, such as a human readable name'}
          </div>

          <div className="my-4 flex flex-col gap-1">
            <div className="flex text-sm font-normal text-neutral-900">Name</div>
            <div className="flex">
              {' '}
              <input
                className="focus:ring-inputring flex h-12 w-full rounded-md border border-neutral-300 bg-white px-6 text-sm shadow-sm outline-none placeholder:text-neutral-600 focus:ring-1"
                placeholder="New chat name"
                value={newChatName}
                onChange={(e) => {
                  setNewChatName(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <div
              className={`${roboto.className} text-navy700 flex h-12 w-1/3 cursor-pointer flex-row items-center justify-center rounded-lg border border-neutral-300 bg-white text-base font-normal`}
              onClick={(e) => {
                setChangeNameModalVisible(false);
              }}
            >
              Cancel
            </div>
            <div
              className={`${roboto.className} bg-navy900 flex h-12 w-1/3 cursor-pointer flex-row items-center justify-center rounded-lg text-base font-normal text-neutral-50 shadow-sm`}
              onClick={() => {
                if (activeChannel?.type === 'public') {
                  {
                    showUserMessage(
                      'Demo Limitation',
                      'Though supported by the Chat SDK, this demo does not support changing public channel names.  Please try changing a private group name instead',
                      'https://www.pubnub.com/docs/chat/chat-sdk/build/features/channels/updates#update-channel-details',
                      ToastType.ERROR
                    );
                  }
                } else {
                  if (newChatName && newChatName.length > 0) {
                    saveAction(newChatName);
                    setChangeNameModalVisible(false);
                  }
                }
              }}
            >
              Save
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
