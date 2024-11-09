import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { getPage } from '@/components/Footer/api';
import React from 'react';
import { SuprasyRender } from 'suprasy-render-react';

const Page = () => {
  const { url } = useParams({ strict: false }) as { url: string };

  const { data: pageResponse } = useQuery({
    queryKey: ['getPagePageId'],
    queryFn: () => getPage(url),
    enabled: !!url,
  });

  console.log('url', url);

  const page = pageResponse?.Data;

  return (
    <section className=" py-8 w-full max-w-[1220px] min-h-full mx-auto gap-6  px-4 sm:px-8">
      {page?.Description && <SuprasyRender initialVal={page.Description} />}
    </section>
  );
};

export default Page;
