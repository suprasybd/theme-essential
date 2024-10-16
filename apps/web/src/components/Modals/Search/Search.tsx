import { useModalStore } from '@web/store/modalStore';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
} from '@frontend.suprasy.com/ui';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProductsList } from '@web/api/products';
import { activeFilters } from '@web/libs/helpers/filters';
import { useDebounce } from 'use-debounce';
import ProductCardSmall from '@web/components/ProductCard/ProductCardSmall';

const SearchModal: React.FC = () => {
  const { modal, clearModalPath } = useModalStore((state) => state);
  const modalName = modal.modal;
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    if (modalName === 'search') {
      setModalOpen(true);
    }
  }, [modalName]);

  const [dSearch] = useDebounce(search, 1000);

  const { data: productsResponse } = useQuery({
    queryKey: ['searchProduct', dSearch],
    queryFn: () =>
      getProductsList({
        Limit: 5,
        Page: 1,
        ...activeFilters([
          {
            key: 'Title',
            value: dSearch || '',
            isActive: true,
          },
        ]),
      }),
  });

  const products = productsResponse?.Data;

  const closeModal = () => {
    setModalOpen(false);
    clearModalPath();
  };

  return (
    <div>
      <Dialog
        open={modalOpen}
        onOpenChange={(data) => {
          if (!data) {
            closeModal();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search Product</DialogTitle>
          </DialogHeader>

          <Input
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Search product"
          />

          {products && products?.length > 0 && (
            <div>
              {products?.map((product) => (
                <ProductCardSmall
                  ProductId={product.Id}
                  setModal={setModalOpen}
                ></ProductCardSmall>
              ))}
            </div>
          )}

          <Button
            className="bg-green-500 hover:bg-green-600"
            onClick={() => closeModal()}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchModal;
