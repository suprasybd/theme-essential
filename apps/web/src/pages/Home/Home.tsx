import Cards from '@web/components/Home/Cards';
import { Discount } from '@web/components/Home/Discount';
import { getHomeSections, getHomesectionsProducts } from './api/index';
import { useQuery } from '@tanstack/react-query';
import { Button, RichTextRender } from '@frontend.suprasy.com/ui';
import ProductCard from '@web/components/ProductCard/ProductCard';

const Home = () => {
  const { data: homeSectionsResponse, refetch } = useQuery({
    queryKey: ['getHomeSections'],
    queryFn: () => getHomeSections(),
  });

  const homeSesctions = homeSectionsResponse?.Data;

  return (
    <div className="w-full max-w-[1220px] min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      <Discount />

      {homeSesctions &&
        homeSesctions.length > 0 &&
        homeSesctions.map((section) => (
          <div className="mb-24">
            <div>
              <h1 className="text-5xl font-bold mb-5">{section.Title}</h1>
              <RichTextRender
                className="min-h-fit"
                initialVal={section.Description}
              />

              <SectionProducts sectionId={section.Id} />
            </div>
          </div>
        ))}
    </div>
  );
};

const SectionProducts: React.FC<{ sectionId: number }> = ({ sectionId }) => {
  const { data: sectionProductsResponse } = useQuery({
    queryKey: ['getSectionsProducts', sectionId],
    queryFn: () => getHomesectionsProducts(sectionId),
    enabled: !!sectionId,
  });
  const sectionProducts = sectionProductsResponse?.Data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-10 ">
      {sectionProducts &&
        sectionProducts.length &&
        sectionProducts.map((products) => (
          <ProductCard ProductId={products.ProductId} />
        ))}
    </div>
  );
};

export default Home;
