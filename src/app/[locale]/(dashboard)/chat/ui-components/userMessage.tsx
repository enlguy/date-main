import { useEffect,useState } from 'react';
import Image from 'next/image';

import { ToastType } from '../types';

export default function UserMessage({
  userMsgShown,
  title = 'Please Note:',
  message,
  href = '',
  type = ToastType.INFO,
  closeToastAction,
}) {
  return (
    <div
      className={`${
        userMsgShown ? 'flex' : 'hidden'
      } absolute bottom-5 left-5 flex-row justify-start rounded-lg p-4 shadow-lg ${
        type == ToastType.INFO && 'bg-statusIndicatorInfo100'
      } ${type == ToastType.CHECK && 'bg-statusIndicatorSuccess100'} ${
        type == ToastType.ERROR && 'bg-red-100'
      } z-40 w-2/6`}
    >
      <div className="flex min-w-[24px] place-self-start">
        {type === ToastType.INFO && (
          <Image
            src="/icons/toast_info.svg"
            alt="Info"
            className=""
            width={24}
            height={24}
            priority
          />
        )}
        {type === ToastType.CHECK && (
          <Image
            src="/icons/toast_check.svg"
            alt="Check"
            className=""
            width={24}
            height={24}
            priority
          />
        )}
        {type === ToastType.ERROR && (
          <Image
            src="/icons/toast_error.svg"
            alt="Error"
            className=""
            width={24}
            height={24}
            priority
          />
        )}
      </div>
      <div className="flex flex-col gap-1 px-4 py-1">
        <div className="flex text-base font-normal text-neutral-900">
          {title || 'Please Note: '}
        </div>
        <div className="flex text-sm font-normal text-neutral-700">{message}</div>
        {href != '' && (
          <div className="my-2.5 flex text-base font-medium text-sky-700">
            <a href={href} target="_new">
              Learn More...
            </a>
            <Image src="/icons/arrow_forward.svg" alt="Info" width={16} height={16} />
          </div>
        )}
      </div>
      <div className="absolute right-0 top-0 cursor-pointer" onClick={() => closeToastAction()}>
        <Image src="/icons/close.svg" alt="Error" className="m-3" width={24} height={24} />
      </div>
    </div>
  );
}
