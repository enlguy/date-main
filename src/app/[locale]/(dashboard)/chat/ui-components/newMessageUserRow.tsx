import Avatar from './avatar';
import Image from 'next/image';
import { roboto } from '../fonts';
import { User } from '@pubnub/chat';

export default function NewMessageUserRow({ user, present, clickAction }) {
  return (
    <div
      className={`${roboto.className} mx-4 my-2 flex w-full cursor-pointer flex-row items-center gap-2 text-base text-neutral-900`}
      onClick={() => clickAction(user)}
    >
      <Avatar
        present={present}
        avatarUrl={user.profileUrl ? user.profileUrl : '/avatars/placeholder.png'}
      />
      <div className="">{user.name}</div>
    </div>
  );
}
