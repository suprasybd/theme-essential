import { Button } from '@frontend.suprasy.com/ui';
import { useQuery } from '@tanstack/react-query';
import { getOrders, OrdersType } from '@web/api/orders';
import React from 'react';

const Orders = () => {
  const { data: ordersResponse } = useQuery({
    queryKey: ['getOrders'],
    queryFn: () => getOrders(),
  });

  const orders = ordersResponse?.Data;
  return (
    <div>
      {orders?.map((order) => (
        <OrdersCard order={order} />
      ))}
    </div>
  );
};

const OrdersCard: React.FC<{ order: OrdersType }> = ({ order }) => {
  return (
    <div className="p-3 rounded-md flex justify-between items-center">
      <div> status: {order.Status}</div>
      <div>
        <Button>View Details</Button>
      </div>
    </div>
  );
};

export default Orders;
