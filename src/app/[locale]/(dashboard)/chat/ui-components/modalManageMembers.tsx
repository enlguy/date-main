import Image from 'next/image';
import { useState } from 'react';
import { roboto } from '../fonts';
import Avatar from './avatar';
import ManagedMember from './managedMember';
import { ChatEventTypes } from '../types';

export default function ModalManageMembers({
  activeChannelUsers,
  currentUserId,
  activeChannel,
  saveAction,
  manageMembersModalVisible,
  setManageMembersModalVisible,
  sendChatEvent,
}) {
  return (
    <div
      className={`${
        !manageMembersModalVisible && 'hidden'
      } fixed inset-0 z-40 mx-auto flex select-none items-center justify-center`}
    >
      {/* Example Modal */}
      <div className="flex flex-col rounded-xl border border-neutral-300 bg-white shadow-xl sm:w-2/3 md:w-2/3 lg:w-1/2">
        <div className="flex flex-row justify-end">
          <div
            className=" cursor-pointer"
            onClick={() => {
              setManageMembersModalVisible(false);
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
        <div className="flex flex-col gap-3 px-12 pb-12">
          <div className="mb-2 flex justify-center text-lg font-semibold text-neutral-900">
            View Members ({activeChannelUsers?.length})
          </div>
          <div className="flex justify-center text-base font-normal text-neutral-600">
            A membership associates a user with a specific channel and is created / destroyed when a
            user joins or leaves a channel respectively.
          </div>

          <div className="my-2 flex max-h-[40vh] flex-col overflow-y-auto overscroll-none">
            {activeChannelUsers?.map((user, index) => {
              return (
                <ManagedMember
                  key={index}
                  user={user}
                  name={`${user.name}`}
                  lastElement={index == activeChannelUsers?.length - 1}
                />
              );
            })}
          </div>
          <div className="flex flex-row justify-end">
            <div
              className={`${roboto.className} bg-navy900 flex h-12 w-1/3 cursor-pointer flex-row items-center justify-center rounded-lg text-base font-normal text-neutral-50 shadow-sm`}
              onClick={(e) => saveAction()}
            >
              OK
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
