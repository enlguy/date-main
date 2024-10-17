// @ts-nocheck

import Image from 'next/image';

export default function QuotedMessage({
  originalMessage,
  originalMessageReceived = false,
  quotedMessage,
  quotedMessageSender,
  setQuotedMessage,
  displayedWithMesageInput, //  Whether this component is rendered above the input control, or as part of a message
}) {
  return (
    <div
      className={`flex w-full flex-row justify-between ${
        displayedWithMesageInput ? 'ml-6' : 'mb-2'
      } mr-24 mt-2 rounded-r-md ${
        originalMessage && !originalMessageReceived
          ? 'bg-neutral-50'
          : originalMessage && originalMessageReceived
            ? 'bg-[#e3f1fd]'
            : 'bg-neutral-50'
      }`}
    >
      <div className="flex w-full flex-col justify-center border-l-2 border-sky-950 p-2.5 ">
        <div className="mb-1 text-sm font-normal text-neutral-900">{quotedMessageSender}</div>
        <div className="line-clamp-2 text-sm font-normal text-neutral-900">
          {quotedMessage.text}
        </div>
      </div>
      {displayedWithMesageInput && setQuotedMessage && (
        <div className=" cursor-pointer" onClick={() => setQuotedMessage(null)}>
          <Image
            src="/icons/close.svg"
            alt="Close"
            className="m-3"
            width={20}
            height={20}
            priority
          />
        </div>
      )}
    </div>
  );
}
