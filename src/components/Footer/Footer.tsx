import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getFooter, getPages } from './api';
import { SuprasyRender } from 'suprasy-render-react';

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
    <footer className="bg-slate-50 border-t border-slate-200">
      <div className="py-12 w-full max-w-[1220px] mx-auto px-4 sm:px-8">
        <div className="flex flex-wrap justify-between gap-8">
          {pages && pages.length > 0 && (
            <div className="flex-1 min-w-[250px]">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {pages.map((page) => (
                  <li key={page.Url}>
                    <a
                      href={`/page/${page.Url}`}
                      className="text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      {page.Url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {footer?.Description && (
            <div className="flex-1 min-w-[250px]">
              <div className="prose prose-slate max-w-none">
                <SuprasyRender initialVal={footer.Description} />
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
