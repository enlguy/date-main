import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations();

  return (
    <div className="flex flex-row items-center self-end p-2 text-right text-xs font-normal leading-4 tracking-normal">
      <div>
        Supaluva{'. '}
        {/*{t(`service-provided`)}{' '}
        <a
          href={`https://www.jackepner.com/`}
          target="_blank"
          className="my-6 text-center text-sm text-c42green transition-all duration-300 ease-in-out hover:text-c42orange"
        >
          Jack Epner
        </a>
        {'. '}*/}
        {t(`rights-reserved`)}
        {'.'}
      </div>
    </div>
  );
};

export default Footer;
