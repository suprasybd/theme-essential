export interface ProductType {
  Id: number;

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

export interface VariationType {
  Id: number;
  ProductId: number;
  ChoiceName: string;
  Price: number;
  SalesPrice: number;
  Sku: string;
  Inventory: number;
  Deleted: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface ProductsVairantsTypes {
  Id: number;

  ProductId: number;
  Price: number;
  Inventory: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface ProductImagesTypes {
  Id: number;

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

  ProductId: number;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface StorefrontOptionsValue {
  Id: number;

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

  ProductId: number;
  Price: number;
  Inventory: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface StorefrontVariantsOptions {
  Id: number;

  VariantId: number;
  OptionId: number;
  ValueId: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface StorefrontOptions {
  Id: number;

  ProductId: number;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface StorefrontOptionsValue {
  Id: number;

  OptionId: number;
  Value: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface ProductSku {
  Id: number;

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

  ProductId: number;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface AttributeValue {
  Id: number;

  AttributeId: number;
  ProductId: number;
  Value: string;
  CreatedAt: string;
  UpdatedAt: string;
}
