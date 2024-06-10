import { useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { getCategories } from '@web/components/NavBar/api';
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
    queryFn: () => getCategories(),
    queryKey: ['getCategoriesResponse'],
  });
  const categories = catagoriesResponse?.Data;

  const categoryId = useMemo(() => {
    if (categories && categories?.length > 0 && name) {
      const found = categories.find((category) => category.Name === name);
      return found?.Id;
    }
  }, [categories, name]);

  const { data: categoryProductsResponse } = useQuery({
    queryFn: () =>
      getProductsList({
        Limit: limit,
        Page: page,
        ...activeFilters([
          {
            key: 'CategoryId',
            value: categoryId?.toString() || '0',
            isActive: !!categoryId,
          },
        ]),
      }),
    queryKey: ['getAllProdcutsForCategory', categoryId, name],
  });

  const products = categoryProductsResponse?.Data;

  return (
    <section className="w-full max-w-[1220px] min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      <h1 className="text-4xl font-medium">{name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-10 ">
        {products &&
          products.length > 0 &&
          products.map((product) => <ProductCard ProductId={product.Id} />)}
      </div>
    </section>
  );
};

export default CategoryProducts;
