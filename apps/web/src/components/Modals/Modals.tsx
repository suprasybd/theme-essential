import React from 'react';
import CartModal from './Cart/Cart';
import SearchModal from './Search/Search';

const Modals: React.FC = () => {
  return (
    <div>
      <CartModal />
      <SearchModal />
    </div>
  );
};

export default Modals;
