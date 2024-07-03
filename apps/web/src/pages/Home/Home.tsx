import { Discount } from '@web/components/Home/Discount';
import {
  getHomeHeroOptions,
  getHomeSectionsOptions,
  getHomesectionsProductsOptions,
} from './api/index';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  RichTextRender,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@frontend.suprasy.com/ui';
import ProductCard from '@web/components/ProductCard/ProductCard';

const Home = () => {
  const { data: homeSectionsResponse } = useSuspenseQuery(
    getHomeSectionsOptions()
  );

  const homeSesctions = homeSectionsResponse?.Data;

  const { data: homeHeroResposne } = useSuspenseQuery(getHomeHeroOptions());
  const homeHero = homeHeroResposne.Data;

  return (
    <div className="w-full max-w-[1220px] min-h-full mx-auto gap-6 py-6 px-4 sm:px-8">
      {homeHero?.length > 0 && (
        <div className="mb-10">
          <Carousel className="rounded-md">
            <CarouselContent className="rounded-md">
              {homeHero.map((hero) => (
                <CarouselItem>
                  <img
                    className="rounded-md"
                    width={'100%'}
                    height={'auto'}
                    src={hero.ImageLink}
                    alt="hero"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}

      {homeSesctions &&
        homeSesctions.length > 0 &&
        homeSesctions.map((section) => (
          <div className="mb-24" key={section.Id.toString()}>
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
  const { data: sectionProductsResponse } = useSuspenseQuery(
    getHomesectionsProductsOptions(sectionId)
  );
  const sectionProducts = sectionProductsResponse?.Data;

  return (
    <div className="flex w-full justify-center items-center flex-wrap md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 my-10 ">
      {sectionProducts &&
        sectionProducts.length &&
        sectionProducts.map((products) => (
          <ProductCard
            key={products.Id.toString()}
            ProductId={products.ProductId}
          />
        ))}
    </div>
  );
};

export default Home;
