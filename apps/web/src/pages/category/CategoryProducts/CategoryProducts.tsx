import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { getCategories, getCategoryId } from '@web/components/NavBar/api';
import ProductCard from '@web/components/ProductCard/ProductCard';
import { activeFilters } from '@web/libs/helpers/filters';
import { getProductsList } from '@web/pages/products/api';
import React, { useMemo, useState } from 'react';

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

  const { data: categoryProductsResponse } = useQuery({
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

  const products = categoryProductsResponse?.Data;

  return (
    <section className="w-full max-w-[1220px] min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      <h1 className="text-4xl font-medium">{name}</h1>
      <div className="flex justify-center items-center flex-wrap md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-10 ">
        {products &&
          products.length > 0 &&
          products.map((product) => <ProductCard ProductId={product.Id} />)}
      </div>
    </section>
  );
};

export default CategoryProducts;
