import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { getCategories, getCategoryId } from '@/components/NavBar/api';
import PaginationMain from '@/components/Pagination/Pagination';
import ProductCard from '@/components/ProductCard/ProductCard';
import { activeFilters } from '@/libs/helpers/filters';
import { getProductsList } from '@/api/products';
import React, { useMemo, useState } from 'react';
import { ShoppingBag } from 'lucide-react';

const CategoryProducts: React.FC = () => {
  const { name } = useParams({ strict: false }) as { name: string };
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  // get all products for that category

  const { data: catagoriesResponse } = useQuery({
    queryFn: () => getCategoryId(name),
    queryKey: ['getCategoriesResponseIdpage', name],
    enabled: !!name,
  });
  const category = catagoriesResponse?.Data;

  const { data: productsListResponse } = useQuery({
    queryFn: () =>
      getProductsList({
        Limit: limit,
        Page: page,
        ...activeFilters([
          {
            key: 'CategoryId',
            value: category?.Id?.toString() || '0',
            isActive: !!category?.Id,
          },
          {
            key: 'Status',
            value: 'active',
            isActive: true,
          },
        ]),
      }),
    queryKey: ['getAllProdcutsForCategory', category?.Id, name],
    enabled: !!category?.Id,
  });

  const products = productsListResponse?.Data;

  if (!products || products.length === 0) {
    return (
      <section className="w-full max-w-[1220px] min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
        <h1 className="text-4xl font-medium">{name}</h1>
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-medium text-gray-900 mb-2">
            No products found
          </h2>
          <p className="text-gray-500 max-w-md">
            We couldn't find any products in this category. Please check back
            later or try a different category.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-[1220px] min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      <h1 className="text-4xl font-medium">{name}</h1>
      <div className="flex justify-center items-center flex-wrap md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-10">
        {products
          .filter((product) => product?.Id)
          .map((product) => (
            <ProductCard key={product.Id} ProductId={product.Id} />
          ))}
      </div>
      {productsListResponse?.Pagination && (
        <PaginationMain
          PaginationDetails={productsListResponse.Pagination}
          setPage={setPage}
        />
      )}
    </section>
  );
};

export default CategoryProducts;
