// @ts-nocheck

import Avatar from './avatar';
import Image from 'next/image';
import { roboto } from '../fonts';

export default function MentionSuggestions({
  suggestedUsers,
  suggestedChannels,
  pickSuggestedUser,
  pickSuggestedChannel,
}) {
  return (
    <div className="flex w-full flex-row bg-white px-7">
      {suggestedUsers.map((user, index) => {
        return (
          <div
            key={index}
            className={`${roboto.className} m-1 line-clamp-1 flex cursor-pointer text-nowrap rounded-lg border border-neutral-300 bg-neutral-50 px-2 py-1 text-sm text-neutral-900`}
            onClick={() => {
              pickSuggestedUser(user);
            }}
          >
            {user.name}
          </div>
        );
      })}
      {suggestedChannels.map((channel, index) => {
        return (
          <div
            key={index}
            className={`${roboto.className} m-1 line-clamp-1 flex cursor-pointer text-nowrap rounded-lg border border-neutral-300 bg-neutral-50 px-2 py-1 text-sm text-neutral-900`}
            onClick={() => {
              pickSuggestedChannel(channel);
            }}
          >
            {channel.name}
          </div>
        );
      })}
    </div>
  );
}
