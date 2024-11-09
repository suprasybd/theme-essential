import { Discount } from '@/components/Home/Discount';
import {
  getHomeHeroOptions,
  getHomeSectionsOptions,
  getHomesectionsProductsOptions,
} from '../../api/home/index';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui';
import ProductCard from '@/components/ProductCard/ProductCard';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SuprasyRender } from 'suprasy-render-react';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout>();

  const { data: homeSectionsResponse } = useSuspenseQuery(
    getHomeSectionsOptions()
  );

  const homeSesctions = homeSectionsResponse?.Data;

  const { data: homeHeroResposne } = useSuspenseQuery(getHomeHeroOptions());
  const homeHero = homeHeroResposne.Data;

  const handleCarouselApi = useCallback((api: any) => {
    if (!api) return;

    api.on('select', () => {
      setCurrentSlide(api.selectedScrollSnap());
    });

    // Initial slide position
    setCurrentSlide(api.selectedScrollSnap());
  }, []);

  // Custom autoplay functionality
  useEffect(() => {
    const startAutoplay = () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }

      autoplayRef.current = setInterval(() => {
        if (!isPaused && carouselRef.current) {
          const nextButton = carouselRef.current.querySelector(
            '[data-carousel-next]'
          ) as HTMLButtonElement;
          nextButton?.click();
        }
      }, 5000); // 5 seconds interval
    };

    startAutoplay();

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [isPaused]);

  return (
    <div className="w-full max-w-[1220px] mx-auto gap-6 py-6 px-4 sm:px-8">
      {homeHero?.length > 0 && (
        <div className="mb-6 sm:mb-10">
          <div
            ref={carouselRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <Carousel
              className="rounded-2xl overflow-hidden bg-slate-100"
              opts={{
                loop: true,
                align: 'start',
              }}
              setApi={handleCarouselApi}
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
              <CarouselPrevious
                data-carousel-prev
                className="left-4 bg-white/90 hover:bg-white shadow-lg border-none transition-transform duration-300 hover:scale-110"
              />
              <CarouselNext
                data-carousel-next
                className="right-4 bg-white/90 hover:bg-white shadow-lg border-none transition-transform duration-300 hover:scale-110"
              />

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {homeHero.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? 'bg-white w-6'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    onClick={() => {
                      const api = (
                        document.querySelector('[data-embla-api]') as any
                      )?.__embla;
                      api?.scrollTo(index);
                    }}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </Carousel>
          </div>
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
                  <SuprasyRender
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
    <div className="flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {sectionProducts?.length > 0 &&
          sectionProducts.map((products) => (
            <div
              key={products.Id.toString()}
              className="transform transition duration-300 hover:scale-105 flex justify-center"
            >
              <ProductCard ProductId={products.ProductId} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;
