import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getFooter, getPages } from './api';
import { RichTextRender } from '@frontend.suprasy.com/ui';

const Footer = () => {
  const { data: footerResponse } = useQuery({
    queryKey: ['getFooter'],
    queryFn: getFooter,
  });

  const { data: pagesResponse } = useQuery({
    queryKey: ['getPages'],
    queryFn: getPages,
  });

  const footer = footerResponse?.Data;
  const pages = pagesResponse?.Data;

  return (
    <footer className=" py-8 w-full max-w-[1220px] min-h-full mx-auto gap-6  px-4 sm:px-8">
      <div className="container mx-auto flex flex-wrap justify-around">
        {pages && pages.length > 0 && (
          <div className="w-full md:w-1/2 px-4">
            <h3 className="text-2xl mb-5">Quick Links</h3>
            <ul className="list-none space-y-5">
              {pages.map((page) => (
                <li className="my-3">
                  <a href={`/page/${page.Url}`} className=" hover:underline">
                    {page.Url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {footer?.Description && (
          <div className="w-full md:w-1/2 px-4 mt-5 md:mt-0">
            <RichTextRender initialVal={footer.Description} />
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
