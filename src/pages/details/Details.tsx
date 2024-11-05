import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
import Orders from './components/Orders';

const Details = () => {
  return (
    <div className="w-full max-w-[1220px]  mx-auto gap-6 py-6 px-4 sm:px-8">
      <Tabs defaultValue="orders" className="">
        <TabsList>
          <TabsTrigger className="cursor-pointer" value="orders">
            Orders
          </TabsTrigger>
          {/* <TabsTrigger className="cursor-pointer" value="account">
            Account
          </TabsTrigger> */}
        </TabsList>
        <TabsContent value="orders">
          <Orders />
        </TabsContent>
        <TabsContent value="account">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};

export default Details;
