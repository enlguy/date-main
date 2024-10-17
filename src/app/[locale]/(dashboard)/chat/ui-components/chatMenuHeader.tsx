import Image from 'next/image';
import { roboto } from '../fonts';
import { useState } from 'react';
import { ChatHeaderActionIcon } from '../types';

export default function ChatMenuHeader({
  text,
  actionIcon,
  expanded,
  expandCollapse,
  action = (b) => {},
}) {
  return (
    <div className="mt-2">
      <div className="flex h-12 flex-row items-center justify-between text-sm tracking-wide">
        <div className="flex select-none flex-row  items-center">
          <div
            className="flex h-12 w-12 cursor-pointer items-center justify-center"
            onClick={() => expandCollapse()}
          >
            <Image
              src="/icons/expand-more.svg"
              alt="Expand"
              className={`${expanded ? '' : 'rotate-180'} h-[7px] w-3`}
              width={12}
              height={7}
              priority
            />
          </div>
          {text}
        </div>
        <div className="flex h-12 items-center justify-center">
          {actionIcon === ChatHeaderActionIcon.MARK_READ && (
            <div
              className="mr-2 cursor-pointer font-medium tracking-normal text-sky-700 hover:text-sky-900"
              onClick={(e) => action(e)}
            >
              Mark all as read
            </div>
          )}
          {actionIcon === ChatHeaderActionIcon.ADD && (
            <div className="cursor-pointer" onClick={() => action(true)}>
              <Image
                src="/icons/add.svg"
                alt="Add"
                className="m-3"
                width={14}
                height={14}
                priority
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
