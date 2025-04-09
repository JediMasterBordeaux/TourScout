import { isUnpicCompatible, unpicOptimizer, astroAssetsOptimizer } from './images-optimization';
import type { ImageMetadata } from 'astro';
import type { OpenGraph } from '@astrolib/seo';

const defaultImage = {
  url: 'https://concertindustry.com/images/tourscout-social-preview.png',
  width: 1200,
  height: 630,
};

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
    return defaultImage.url;
  }

  // Not string
  if (typeof imagePath !== 'string') {
    return imagePath;
  }

  // Absolute paths
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('/')) {
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
    : defaultImage.url;
};

/** */
export const adaptOpenGraphImages = async (
  openGraph: OpenGraph = {},
  astroSite: URL | undefined = new URL('')
): Promise<OpenGraph> => {
  if (!openGraph?.images?.length) {
    return {
      ...openGraph,
      images: [defaultImage]
    };
  }

  const images = openGraph.images;
  const defaultWidth = 1200;
  const defaultHeight = 630;

  const adaptedImages = await Promise.all(
    images.map(async (image) => {
      if (!image?.url) {
        return defaultImage;
      }

      const resolvedImage = (await findImage(image.url)) as ImageMetadata | string | undefined;
      if (!resolvedImage) {
        return defaultImage;
      }

      let _image: ImageMetadata | undefined;

      try {
        if (
          typeof resolvedImage === 'string' &&
          (resolvedImage.startsWith('http://') || resolvedImage.startsWith('https://')) &&
          isUnpicCompatible(resolvedImage)
        ) {
          _image = (await unpicOptimizer(resolvedImage, [defaultWidth], defaultWidth, defaultHeight, 'jpg'))[0] as ImageMetadata;
        } else if (resolvedImage) {
          const dimensions =
            typeof resolvedImage !== 'string' && resolvedImage?.width <= defaultWidth
              ? [resolvedImage?.width, resolvedImage?.height]
              : [defaultWidth, defaultHeight];
          _image = (await astroAssetsOptimizer(resolvedImage, [dimensions[0]], dimensions[0], dimensions[1], 'jpg'))[0] as ImageMetadata;
        }

        if (_image) {
          return {
            url: typeof _image.src === 'string' ? String(new URL(_image.src, astroSite)) : defaultImage.url,
            width: _image.width || defaultImage.width,
            height: _image.height || defaultImage.height,
          };
        }
      } catch (error) {
        // If any error occurs during image processing, return the default
        console.error('Error processing image:', error);
      }

      return defaultImage;
    })
  );

  return { ...openGraph, images: adaptedImages };
};
