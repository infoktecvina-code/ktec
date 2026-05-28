'use client';

import React, { useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

// Simple overlay config - hỗ trợ 5 tỷ lệ khung hình (Aspect Ratio) overlay khác nhau
export function useProductFrameConfig(aspectRatio?: string) {
  const enabledSetting = useQuery(api.settings.getValue, {
    key: 'enable_product_frames',
    defaultValue: false,
  });

  // Query cả 5 cài đặt tỷ lệ khung hình
  const squareSetting = useQuery(api.settings.getValue, { key: 'product_frame_overlay_square_url' });
  const portrait916Setting = useQuery(api.settings.getValue, { key: 'product_frame_overlay_portrait916_url' });
  const portrait34Setting = useQuery(api.settings.getValue, { key: 'product_frame_overlay_portrait34_url' });
  const landscape43Setting = useQuery(api.settings.getValue, { key: 'product_frame_overlay_landscape43_url' });
  const wide169Setting = useQuery(api.settings.getValue, { key: 'product_frame_overlay_wide169_url' });

  // Query tỷ lệ ảnh mặc định của hệ thống
  const defaultImageAspectRatio = useQuery(api.admin.modules.getModuleSetting, {
    moduleKey: 'products',
    settingKey: 'defaultImageAspectRatio',
  });

  // Query khung hình đơn lẻ cũ để tương thích ngược
  const legacySetting = useQuery(api.settings.getValue, {
    key: 'product_frame_overlay_url',
  });

  const enabled = enabledSetting === true;
  const resolvedAr = aspectRatio || (typeof defaultImageAspectRatio === 'string' ? defaultImageAspectRatio : 'square');

  const overlayUrl = useMemo(() => {
    if (!enabled) return null;
    let url = null;
    switch (resolvedAr) {
      case 'square':
        url = squareSetting;
        break;
      case 'portrait916':
        url = portrait916Setting;
        break;
      case 'portrait34':
        url = portrait34Setting;
        break;
      case 'landscape43':
        url = landscape43Setting;
        break;
      case 'wide169':
        url = wide169Setting;
        break;
      default:
        url = squareSetting;
    }
    // Tương thích ngược: Nếu ảnh khung cho tỷ lệ cụ thể trống, dùng product_frame_overlay_url cũ làm fallback
    return (typeof url === 'string' && url)
      ? url
      : (typeof legacySetting === 'string' && legacySetting ? legacySetting : null);
  }, [enabled, resolvedAr, squareSetting, portrait916Setting, portrait34Setting, landscape43Setting, wide169Setting, legacySetting]);

  return useMemo(
    () => ({ enabled, overlayUrl, frame: overlayUrl }),
    [enabled, overlayUrl]
  );
}

// Export type để ProductImageWithOverlay có thể sử dụng
export type ProductFrameConfig = ReturnType<typeof useProductFrameConfig>;

type ProductImageFrameBoxProps = {
  overlayUrl?: string | null;
  frame?: any;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

export function ProductImageFrameBox({
  overlayUrl,
  frame,
  className,
  style,
  children,
}: ProductImageFrameBoxProps) {
  return (
    <div className={className ? `relative ${className}` : 'relative'} style={style}>
      {children}
      <ProductImageFrameOverlay overlayUrl={overlayUrl} frame={frame} />
    </div>
  );
}

export function ProductImageFrameOverlay({
  overlayUrl,
  frame,
}: {
  overlayUrl?: string | null;
  frame?: any;
}) {
  const resolvedUrl = typeof frame === 'string' ? frame : overlayUrl;

  if (resolvedUrl) {
    return (
      <img
        src={resolvedUrl}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-contain pointer-events-none select-none"
      />
    );
  }

  if (frame && typeof frame === 'object') {
    const { sourceType, overlayImageUrl, lineConfig, logoConfig } = frame;

    if (sourceType === 'uploaded_overlay' && overlayImageUrl) {
      return (
        <img
          src={overlayImageUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-contain pointer-events-none select-none"
        />
      );
    }

    if (sourceType === 'line_generator' && lineConfig) {
      const { strokeWidth, inset, radius, color, shadow } = lineConfig;
      return (
        <div
          className="absolute pointer-events-none select-none"
          style={{
            left: `${inset}%`,
            top: `${inset}%`,
            right: `${inset}%`,
            bottom: `${inset}%`,
            border: `${strokeWidth}px solid ${color}`,
            borderRadius: `${radius}px`,
            boxShadow: shadow || undefined,
          }}
        />
      );
    }

    if (sourceType === 'logo_generator' && logoConfig) {
      const { logoUrl, scale, opacity, x, y } = logoConfig;
      if (!logoUrl) return null;
      
      const size = Math.max(10, Math.min(40, scale * 40));
      return (
        <img
          src={logoUrl}
          alt=""
          aria-hidden="true"
          className="absolute object-contain pointer-events-none select-none"
          style={{
            width: `${size}%`,
            height: `${size}%`,
            left: `${x}%`,
            top: `${y}%`,
            transform: 'translate(-50%, -50%)',
            opacity: opacity,
          }}
        />
      );
    }
  }

  return null;
}


