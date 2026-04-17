'use client';

import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ComponentFormWrapper, useComponentForm } from '../shared';
import { ProductCategoriesPreview } from '../../product-categories/_components/ProductCategoriesPreview';
import type { CategoryConfigItem, ProductCategoriesBrandMode, ProductCategoriesStyle } from '../../product-categories/_types';
import { useTypeColorOverrideState } from '../../_shared/hooks/useTypeColorOverride';
import { useTypeFontOverrideState } from '../../_shared/hooks/useTypeFontOverride';
import { ProductCategoriesForm } from '../../product-categories/_components/ProductCategoriesForm';
import { toast } from 'sonner';

export default function ProductCategoriesCreatePage() {
  const COMPONENT_TYPE = 'ProductCategories';
  const { title, setTitle, active, setActive, handleSubmit, isSubmitting } = useComponentForm('Danh mục sản phẩm', COMPONENT_TYPE);
  const { customState, effectiveColors, showCustomBlock, setCustomState, systemColors } = useTypeColorOverrideState(COMPONENT_TYPE, { seedCustomFromSettingsWhenTypeEmpty: true });
  const { customState: customFontState, effectiveFont, showCustomBlock: showFontCustomBlock, setCustomState: setCustomFontState } = useTypeFontOverrideState(COMPONENT_TYPE, { seedCustomFromSettingsWhenTypeEmpty: true });
  const { primary, secondary, mode } = effectiveColors;
  const brandMode: ProductCategoriesBrandMode = mode === 'single' ? 'single' : 'dual';
  const fontStyle = { '--font-active': `var(${effectiveFont.fontVariable})` } as React.CSSProperties;

  const categoriesData = useQuery(api.productCategories.listActive);
  const productsData = useQuery(api.products.listPublicResolved, { limit: 100 });
  
  const [selectedCategories, setSelectedCategories] = useState<CategoryConfigItem[]>([]);
  const [style, setStyle] = useState<ProductCategoriesStyle>('grid');
  const [showProductCount, setShowProductCount] = useState(true);
  const [columnsDesktop, setColumnsDesktop] = useState(4);
  const [columnsMobile, setColumnsMobile] = useState(2);

  const onSubmit = (e: React.FormEvent) => {
    const invalidItem = selectedCategories.find((item) => item.linkMode === 'custom' && !item.customLinkValue?.trim());
    if (invalidItem) {
      e.preventDefault();
      toast.error('Custom link đang bật nhưng chưa có URL đích');
      return;
    }

    void handleSubmit(e, {
      categories: selectedCategories.map(c => ({ 
        categoryId: c.categoryId, 
        customImage: c.customImage,
        imageMode: c.imageMode ?? 'default',
        linkMode: c.linkMode ?? 'default',
        customLinkType: c.customLinkType,
        customLinkValue: c.customLinkValue?.trim() || undefined,
        sourceProductId: c.sourceProductId,
      })),
      columnsDesktop,
      columnsMobile,
      showProductCount,
      style,
    });
  };

  const availableCategories = categoriesData ?? [];
  const availableProducts = (productsData ?? []).map((product) => ({
    _id: product._id,
    name: product.name,
    slug: product.slug,
  }));

  return (
    <ComponentFormWrapper
      type={COMPONENT_TYPE}
      title={title}
      setTitle={setTitle}
      active={active}
      setActive={setActive}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      customState={customState}
      showCustomBlock={showCustomBlock}
      setCustomState={setCustomState}
      systemColors={systemColors}
      customFontState={customFontState}
      showFontCustomBlock={showFontCustomBlock}
      setCustomFontState={setCustomFontState}
    >
      <ProductCategoriesForm
        productCategoriesItems={selectedCategories}
        setProductCategoriesItems={setSelectedCategories}
        productCategoriesColsDesktop={columnsDesktop}
        setProductCategoriesColsDesktop={setColumnsDesktop}
        productCategoriesColsMobile={columnsMobile}
        setProductCategoriesColsMobile={setColumnsMobile}
        productCategoriesShowCount={showProductCount}
        setProductCategoriesShowCount={setShowProductCount}
        productCategoriesData={availableCategories}
        productsData={availableProducts}
        brandColor={primary}
      />

      <ProductCategoriesPreview 
        config={{
          categories: selectedCategories,
          columnsDesktop,
          columnsMobile,
          showProductCount,
          style,
        }}
        brandColor={primary}
        secondary={secondary}
        mode={brandMode}
        selectedStyle={style}
        onStyleChange={setStyle}
        categoriesData={availableCategories}
        fontStyle={fontStyle}
        fontClassName="font-active"
      />
    </ComponentFormWrapper>
  );
}
