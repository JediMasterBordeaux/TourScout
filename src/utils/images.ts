import { isUnpicCompatible, unpicOptimizer, astroAssetsOptimizer } from './images-optimization';
import type { ImageMetadata } from 'astro';
import type { OpenGraph } from '@astrolib/seo';
import tourScoutMockup from '~/assets/images/tour-scout-mockup.png';

const load = async function () {
  let images: Record<string, () => Promise<unknown>> | undefined = undefined;
  try {
    images = import.meta.glob('~/assets/images/**/*.{jpeg,jpg,png,tiff,webp,gif,svg,JPEG,JPG,PNG,TIFF,WEBP,GIF,SVG}');
  } catch {
    // continue regardless of error
  }
  return images;
};

let _images: Record<string, () => Promise<unknown>> | undefined = undefined;

/** */
export const fetchLocalImages = async () => {
  _images = _images || (await load());
  return _images;
};

/** */
export const findImage = async (
  imagePath?: string | ImageMetadata | null
): Promise<string | ImageMetadata | undefined | null> => {
  // Handle undefined or null
  if (!imagePath) {
    return null;
  }

  // Not string
  if (typeof imagePath !== 'string') {
    return imagePath;
  }

  // Absolute paths
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('/')) {
    if (imagePath === '/images/tour-scout-mockup.png') {
      return tourScoutMockup;
    }
    return imagePath;
  }

  // Relative paths or not "~/assets/"
  if (!imagePath.startsWith('~/assets/images')) {
    return imagePath;
  }

  const images = await fetchLocalImages();
  const key = imagePath.replace('~/', '/src/');

  return images && typeof images[key] === 'function'
    ? ((await images[key]()) as { default: ImageMetadata })['default']
    : null;
};

/** */
export const adaptOpenGraphImages = async (
  openGraph: OpenGraph = {},
  astroSite: URL | undefined = new URL('')
): Promise<OpenGraph> => {
  if (!openGraph?.images?.length) {
    return {
      ...openGraph,
      images: [{
        url: '/images/tourscout-social-preview.png',
        width: 1200,
        height: 630,
      }]
    };
  }

  const images = openGraph.images;
  const defaultWidth = 1200;
  const defaultHeight = 626;

  const adaptedImages = await Promise.all(
    images.map(async (image) => {
      if (!image?.url) {
        return {
          url: '/images/tourscout-social-preview.png',
          width: 1200,
          height: 630,
        };
      }

      const resolvedImage = (await findImage(image.url)) as ImageMetadata | string | undefined;
      if (!resolvedImage) {
        return {
          url: '/images/tourscout-social-preview.png',
          width: 1200,
          height: 630,
        };
      }

      let _image;

      try {
        if (
          typeof resolvedImage === 'string' &&
          (resolvedImage.startsWith('http://') || resolvedImage.startsWith('https://')) &&
          isUnpicCompatible(resolvedImage)
        ) {
          _image = (await unpicOptimizer(resolvedImage, [defaultWidth], defaultWidth, defaultHeight, 'jpg'))[0];
        } else if (resolvedImage) {
          const dimensions =
            typeof resolvedImage !== 'string' && resolvedImage?.width <= defaultWidth
              ? [resolvedImage?.width, resolvedImage?.height]
              : [defaultWidth, defaultHeight];
          _image = (
            await astroAssetsOptimizer(resolvedImage, [dimensions[0]], dimensions[0], dimensions[1], 'jpg')
          )[0];
        }

        if (typeof _image === 'object' && 'src' in _image) {
          return {
            url: typeof _image.src === 'string' ? String(new URL(_image.src, astroSite)) : '/images/tourscout-social-preview.png',
            width: 'width' in _image && typeof _image.width === 'number' ? _image.width : 1200,
            height: 'height' in _image && typeof _image.height === 'number' ? _image.height : 630,
          };
        }
      } catch (error) {
        // If any error occurs during image processing, return the default
        console.error('Error processing image:', error);
      }

      return {
        url: '/images/tourscout-social-preview.png',
        width: 1200,
        height: 630,
      };
    })
  );

  return { ...openGraph, images: adaptedImages };
};
