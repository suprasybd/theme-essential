import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

import { cn } from '../../lib/utils';

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-2', className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      style={{ border: '1px solid gray' }}
      className={cn(
        'aspect-square rounded-full h-[20px] w-[20px]  text-primary ring-offset-background   flex items-center justify-center p-0',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="w-[20px] h-[20px] flex items-center justify-center">
        <div
          className="rounded-full w-full h-full flex justify-center items-center"
          style={{ background: '#1773b0', border: '2px solid #1773b0' }}
        >
          <div
            className="rounded-full "
            style={{ background: 'white', height: '6px', width: '6px' }}
          ></div>
        </div>
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
