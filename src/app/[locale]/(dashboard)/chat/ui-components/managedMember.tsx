import Image from 'next/image';

import { roboto } from '../fonts';
import { PresenceIcon } from '../types';
import Avatar from './avatar';

export default function ManagedMember({ user, name, lastElement = false }) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 ${
        !lastElement && 'border-navy200 border-b border-solid'
      }`}
    >
      <div className="flex flex-row items-center">
        <Avatar
          present={user.active ? PresenceIcon.ONLINE : PresenceIcon.OFFLINE}
          avatarUrl={user.profileUrl}
        />
        <div className="flex pl-3 text-sm font-normal text-neutral-900">{name}</div>
      </div>
    </div>
  );
}
