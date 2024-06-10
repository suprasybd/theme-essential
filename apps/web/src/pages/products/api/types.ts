export interface ProductType {
  Id: number;
  StoreKey: string;
  HasVariant: boolean;
  CategoryId: number;
  Slug: string;
  Title: string;
  Description: string;
  Summary: string;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface ProductsVairantsTypes {
  Id: number;
  StoreKey: string;
  ProductId: number;
  Price: number;
  Inventory: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface ProductImagesTypes {
  Id: number;
  StoreKey: string;
  ProductId: number;
  Order: number;
  ImageUrl: string;
  CreatedAt: string;
  UpdatedAt: string;
}

// OPTIONS - Option - Value (size - lg)
export interface Options {
  storefront_options: StorefrontOptions;
  storefront_options_value: StorefrontOptionsValue;
}

export interface StorefrontOptions {
  Id: number;
  StoreKey: string;
  ProductId: number;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface StorefrontOptionsValue {
  Id: number;
  StoreKey: string;
  OptionId: number;
  Value: string;
  CreatedAt: string;
  UpdatedAt: string;
}

// Multiple Variants (HasVariants: True)

export interface MultipleVariantsTypes {
  storefront_variants: StorefrontVariants;
  storefront_variants_options: StorefrontVariantsOptions;
  storefront_options: StorefrontOptions;
  storefront_options_value: StorefrontOptionsValue;
}

export interface StorefrontVariants {
  Id: number;
  StoreKey: string;
  ProductId: number;
  Price: number;
  Inventory: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface StorefrontVariantsOptions {
  Id: number;
  StoreKey: string;
  VariantId: number;
  OptionId: number;
  ValueId: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface StorefrontOptions {
  Id: number;
  StoreKey: string;
  ProductId: number;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface StorefrontOptionsValue {
  Id: number;
  StoreKey: string;
  OptionId: number;
  Value: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface ProductSku {
  Id: number;
  StoreKey: string;
  ProductId: number;
  AttributeOptionId: number;
  Price: number;
  Sku: string;
  CompareAtPrice: number;
  ShowCompareAtPrice: boolean;
  Inventory: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface AttributeName {
  Id: number;
  StoreKey: string;
  ProductId: number;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface AttributeValue {
  Id: number;
  StoreKey: string;
  AttributeId: number;
  ProductId: number;
  Value: string;
  CreatedAt: string;
  UpdatedAt: string;
}
