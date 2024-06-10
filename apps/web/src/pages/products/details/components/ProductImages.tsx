import React, { useState } from 'react';
import { Card, CardContent } from '@frontend.suprasy.com/ui';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@frontend.suprasy.com/ui';
import { ProductImagesTypes } from '../../api/types';

interface ProductImagesPropTypes {
  Images: ProductImagesTypes[];
}

const ProductImages: React.FC<ProductImagesPropTypes> = ({ Images }) => {
  const [selectedImage, setSelectedImage] = useState<string>(
    Images[0].ImageUrl
  );
  return (
    <div>
      <div className="max-w-[500px] max-h-[500px] sm:w-[500px] sm:h-[500px] flex justify-center items-center">
        <img
          alt="prodcut details"
          className="mb-3"
          sizes="(min-width: 1200px) 495px, (min-width: 990px) calc(45.0vw - 10rem), (min-width: 750px) calc((100vw - 11.5rem) / 2), calc(100vw / 1 - 4rem)"
          src={selectedImage}
        />
      </div>

      <Carousel className="w-full max-w-sm">
        <CarouselContent className="-ml-1">
          {Images.map((image, index) => (
            <CarouselItem
              key={index}
              className="pl-1 md:basis-1/2 lg:basis-1/3 hover:cursor-pointer "
              onClick={() => {
                setSelectedImage(image.ImageUrl);
              }}
            >
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-2">
                    <img src={image.ImageUrl} alt="single product" />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default ProductImages;
