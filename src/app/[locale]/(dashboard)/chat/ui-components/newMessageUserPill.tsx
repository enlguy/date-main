// @ts-nocheck

import Avatar from './avatar';
import Image from 'next/image';
import { roboto } from '../fonts';

export default function NewMessageUserPill({ user, removePillAction, isMe = false }) {
  return (
    <div
      className={`${roboto.className} m-1 flex flex-row rounded-lg border border-neutral-300 bg-neutral-50 px-2 py-1 text-base text-neutral-900`}
    >
      <div className="">{user.name}</div>
      {!isMe && (
        <div className="cursor-pointer" onClick={() => removePillAction(user.id)}>
          <Image
            src="/icons/close.svg"
            alt="Remove"
            className="ml-2"
            width={24}
            height={24}
            priority
          />
        </div>
      )}
    </div>
  );
}
