import { ICompany } from '@erxes/ui-contacts/src/companies/types';
import { ITag } from '@erxes/ui-tags/src/types';
import { QueryResponse } from '@erxes/ui/src/types';

export interface IProductDoc {
  _id?: string;
  type: string;
  name?: string;
  description?: string;
  createdAt?: Date;
  customFieldsData?: any;
}

export interface IUom {
  _id: string;
  name: string;
  code: string;
  createdAt: Date;
}

export interface IVariant {
  [code: string]: { name?: string; image?: any };
}
export interface IProduct {
  _id: string;
  name: string;
  shortName: string;
  type: string;
  categoryId: string;
  description: string;
  getTags?: ITag[];
  barcodes: string[];
  variants: IVariant;
  barcodeDescription: string;
  code: string;
  unitPrice: number;
  customFieldsData?: any;
  createdAt: Date;
  vendorId?: string;
  scopeBrandIds: string[];

  attachment?: any;
  attachmentMore?: any[];
  category: IProductCategory;
  vendor?: ICompany;

  uom?: string;
  subUoms?: any[];
  taxType?: string;
  taxCode?: string;
}

export interface IProductCategory {
  _id: string;
  name: string;
  order: string;
  code: string;
  description?: string;
  attachment?: any;
  status: string;
  parentId?: string;
  createdAt: Date;
  productCount: number;
  isRoot: boolean;
  meta: string;
  maskType: string;
  mask: any;
  isSimilarity: boolean;
  similarities: any[];
}

export type MutationVariables = {
  _id?: string;
  type: string;
  name?: string;
  description?: string;
  barcodes?: string[];
  createdAt?: Date;
};

export type DetailQueryResponse = {
  productDetail: IProduct;
  loading: boolean;
};

// mutation types
export type ProductsQueryResponse = {
  loading: boolean;
  refetch: (variables?: {
    searchValue?: string;
    perPage?: number;
    categoryId?: string;
    vendorId?: string;
  }) => void;
  products: IProduct[];
};

export type ProductAddMutationResponse = {
  productAdd: (params: { variables: IProductDoc }) => Promise<void>;
};

export type ProductCategoriesQueryResponse = {
  productCategories: IProductCategory[];
} & QueryResponse;

export type ProductsQueryResponses = {
  products: IProduct[];
} & QueryResponse;

export type EditMutationResponse = {
  editMutation: (mutation: { variables: MutationVariables }) => Promise<any>;
};

// UOM
export type UomsQueryResponse = {
  uoms: IUom[];
} & QueryResponse;

// SETTINGS

export type IConfigsMap = { [key: string]: any };

export type IAccountingConfig = {
  _id: string;
  code: string;
  value: any;
};

export type AccountingConfigsQueryResponse = {
  accountingConfigs: IAccountingConfig[];
  loading: boolean;
  refetch: () => void;
};

export type Counts = {
  [key: string]: number;
};
type ProductCounts = {
  bySegment: Counts;
  byTag: Counts;
};
// query types

export type ProductsCountQueryResponse = {
  productsTotalCount: number;
} & QueryResponse;

export type ProductsGroupCountsQueryResponse = {
  productsGroupsCounts: ProductCounts;
} & QueryResponse;

export type ProductCategoriesCountQueryResponse = {
  productCategoriesTotalCount: number;
} & QueryResponse;

// UOM
export type UomsCountQueryResponse = {
  uomsTotalCount: number;
} & QueryResponse;

export type MutationUomVariables = {
  _id?: string;
  name: string;
  code: string;
};

export type UomAddMutationResponse = {
  uomsAdd: (mutation: { variables: MutationUomVariables }) => Promise<any>;
};

export type UomEditMutationResponse = {
  uomsEdit: (mutation: { variables: MutationUomVariables }) => Promise<any>;
};

export type UomRemoveMutationResponse = {
  uomsRemove: (mutation: { variables: { uomIds: string[] } }) => Promise<any>;
};

// mutation types

export type AddMutationResponse = {
  addMutation: (mutation: { variables: MutationVariables }) => Promise<any>;
};

export type ProductRemoveMutationResponse = {
  productsRemove: (mutation: {
    variables: { productIds: string[] };
  }) => Promise<any>;
};

export type ProductCategoryRemoveMutationResponse = {
  productCategoryRemove: (mutation: {
    variables: { _id: string };
  }) => Promise<any>;
};

export type CategoryDetailQueryResponse = {
  productCategoryDetail: IProductCategory;
  loading: boolean;
};

export type CountByTagsQueryResponse = {
  productCountByTags: { [key: string]: number };
  loading: boolean;
};

export type MergeMutationVariables = {
  productIds: string[];
  productFields: IProduct;
};

export type MergeMutationResponse = {
  productsMerge: (params: {
    variables: MergeMutationVariables;
  }) => Promise<any>;
};

// SETTINGS
export type BarcodeConfig = {
  row: number;
  column: number;
  width: number;
  height: number;
  margin: number;
  isDate: boolean;
  date: number;
  isProductName: boolean;
  productNameFontSize: number;
  isPrice: boolean;
  priceFontSize: number;

  isBarcode: boolean;
  isBarcodeDescription: boolean;
  barWidth: number;
  barHeight: number;
  barcodeFontSize: number;
  barcodeDescriptionFontSize: number;

  isQrcode: boolean;
  qrSize: number;
};
