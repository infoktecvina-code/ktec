'use client';

import type { CategoryConfigItem } from '../_types';

export const getDefaultCategoryLink = (slug?: string) => slug ? `/products?category=${slug}` : '/products';

export const resolveProductCategoryHref = (
  item: Pick<CategoryConfigItem, 'linkMode' | 'customLinkValue'>,
  categorySlug?: string
) => {
  if (item.linkMode === 'custom' && item.customLinkValue?.trim()) {
    return item.customLinkValue.trim();
  }

  return getDefaultCategoryLink(categorySlug);
};

export const isCustomProductCategoryLink = (
  item: Pick<CategoryConfigItem, 'linkMode' | 'customLinkValue'>,
  categorySlug?: string
) => {
  const defaultHref = getDefaultCategoryLink(categorySlug);
  return item.linkMode === 'custom' && !!item.customLinkValue?.trim() && item.customLinkValue.trim() !== defaultHref;
};
