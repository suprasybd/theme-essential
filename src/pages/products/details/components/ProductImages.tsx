import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui';
import { ProductImagesTypes } from '../../../../api/products/types';
import ImagePreview from '@/components/Image/ImagePreview';

interface ProductImagesPropTypes {
  Images: ProductImagesTypes[];
}

const ProductImages: React.FC<ProductImagesPropTypes> = ({ Images }) => {
  const [selectedImage, setSelectedImage] = useState<string>(
    Images[0].ImageUrl
  );
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="w-[100px]  flex justify-center items-center my-3">
          <Carousel className="w-full max-w-sm" orientation="vertical">
            <CarouselContent className="-ml-1 h-[480px]">
              {Images.map((image, index) => (
                <CarouselItem
                  key={index}
                  className="pl-1 md:basis-1/3 lg:basis-1/5 hover:cursor-pointer "
                  onClick={() => {
                    setSelectedImage(image.ImageUrl);
                  }}
                >
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-0">
                      <ImagePreview
                        className="rounded-md"
                        src={image.ImageUrl}
                        alt="single product"
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <div className="max-w-[500px] max-h-[500px] sm:w-[500px] sm:h-[500px] flex justify-center items-center ">
          <ImagePreview
            alt="prodcut details"
            className="mb-3 rounded-lg"
            sizes=""
            src={selectedImage}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductImages;
