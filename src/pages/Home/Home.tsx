import { Discount } from '@/components/Home/Discount';
import {
  getHomeHeroOptions,
  getHomeSectionsOptions,
  getHomesectionsProductsOptions,
} from '../../api/home/index';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  RichTextRender,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui';
import ProductCard from '@/components/ProductCard/ProductCard';

const Home = () => {
  const { data: homeSectionsResponse } = useSuspenseQuery(
    getHomeSectionsOptions()
  );

  const homeSesctions = homeSectionsResponse?.Data;

  const { data: homeHeroResposne } = useSuspenseQuery(getHomeHeroOptions());
  const homeHero = homeHeroResposne.Data;

  return (
    <div className="w-full max-w-[1220px] mx-auto gap-6 py-6 px-4 sm:px-8">
      {homeHero?.length > 0 && (
        <div className="mb-6 sm:mb-10">
          <Carousel
            className="rounded-2xl overflow-hidden bg-slate-100"
            opts={{
              loop: true,
              align: 'start',
            }}
          >
            <CarouselContent className="h-[300px] sm:h-[400px] md:h-[500px]">
              {homeHero.map((hero, index) => (
                <CarouselItem key={index}>
                  <div className="relative w-full h-full group">
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={hero.ImageLink}
                      alt={`hero slide ${index + 1}`}
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-white/90 hover:bg-white shadow-lg border-none transition-transform duration-300 hover:scale-110" />
            <CarouselNext className="right-4 bg-white/90 hover:bg-white shadow-lg border-none transition-transform duration-300 hover:scale-110" />
          </Carousel>
        </div>
      )}

      {homeSesctions?.length > 0 && (
        <div className="space-y-12 sm:space-y-24">
          {homeSesctions.map((section) => (
            <div key={section.Id.toString()}>
              <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
                  {section.Title}
                </h1>
                <div className="max-w-3xl mx-auto">
                  <RichTextRender
                    className="text-gray-600 !min-h-fit"
                    initialVal={section.Description}
                  />
                </div>
              </div>

              <SectionProducts sectionId={section.Id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SectionProducts: React.FC<{ sectionId: number }> = ({ sectionId }) => {
  const { data: sectionProductsResponse } = useSuspenseQuery(
    getHomesectionsProductsOptions(sectionId)
  );
  const sectionProducts = sectionProductsResponse?.Data;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {sectionProducts?.length > 0 &&
        sectionProducts.map((products) => (
          <div
            key={products.Id.toString()}
            className="transform transition duration-300 hover:scale-105"
          >
            <ProductCard ProductId={products.ProductId} />
          </div>
        ))}
    </div>
  );
};

export default Home;
