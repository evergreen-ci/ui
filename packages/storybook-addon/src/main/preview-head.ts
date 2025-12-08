import type { StorybookConfig } from "@storybook/react-vite";
import { fontStyles, resetStyles } from "@evg-ui/lib/src/components/styles/index";

export const previewHead: StorybookConfig["previewHead"] = (head) => `
${head}
<link rel="preconnect" href="https://fonts.gstatic.com" />
<link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
<style type="text/css">
  ${fontStyles}
  ${resetStyles}

  a {
    text-decoration: none;
  }

  fieldset {
    border: 0;
    margin: 0;
    padding: 0;
  }

  /* Copied from LeafyGreen: https://github.com/mongodb/leafygreen-ui/blob/9718c2333ce1ba4a708e81a1bfe99bfd4a8b2f73/tools/storybook-addon/src/main/preview-head.ts#L62-L155 */

  /**
   * Euclid
   */


  /* Semibold */
  @font-face {
    font-family: 'Euclid Circular A';
    src: url('https://d2va9gm4j17fy9.cloudfront.net/fonts/euclid-circular/EuclidCircularA-Semibold-WebXL.woff') format('woff'),
      url('https://d2va9gm4j17fy9.cloudfront.net/fonts/euclid-circular/EuclidCircularA-Semibold-WebXL.woff2') format('woff2'),
      url('https://d2va9gm4j17fy9.cloudfront.net/fonts/euclid-circular/EuclidCircularA-Semibold.ttf') format('truetype');
    font-weight: 700;
    font-style: normal;
  }


  /* Semibold Italic */
  @font-face {
    font-family: 'Euclid Circular A';
    src: url('https://d2va9gm4j17fy9.cloudfront.net/fonts/euclid-circular/EuclidCircularA-SemiboldItalic-WebXL.woff') format('woff'),
      url('https://d2va9gm4j17fy9.cloudfront.net/fonts/euclid-circular/EuclidCircularA-SemiboldItalic-WebXL.woff2') format('woff2'),
      url('https://d2va9gm4j17fy9.cloudfront.net/fonts/euclid-circular/EuclidCircularA-SemiboldItalic.ttf') format('truetype');
    font-weight: 700;
    font-style: italic;
  }


  /* Medium */
  @font-face {
    font-family: 'Euclid Circular A';
    src: url('https://d2va9gm4j17fy9.cloudfront.net/fonts/euclid-circular/EuclidCircularA-Medium-WebXL.woff') format('woff'),
      url('https://d2va9gm4j17fy9.cloudfront.net/fonts/euclid-circular/EuclidCircularA-Medium-WebXL.woff2') format('woff2'),
      url('https://d2va9gm4j17fy9.cloudfront.net/fonts/euclid-circular/EuclidCircularA-Medium.ttf') format('truetype');
    font-weight: 500;
    font-style: normal;
  }


  /* Medium Italic */
  @font-face {
    font-family: 'Euclid Circular A';
    src: url('https://d2va9gm4j17fy9.cloudfront.net/fonts/euclid-circular/EuclidCircularA-MediumItalic-WebXL.woff') format('woff'),
      url('https://d2va9gm4j17fy9.cloudfront.net/fonts/euclid-circular/EuclidCircularA-MediumItalic-WebXL.woff2') format('woff2'),
      url('https://d2va9gm4j17fy9.cloudfront.net/fonts/euclid-circular/EuclidCircularA-MediumItalic.ttf') format('truetype');
    font-weight: 500;
    font-style: italic;
  }


  /* Normal */
  @font-face {
    font-family: 'Euclid Circular A';
    src: url('https://d2va9gm4j17fy9.cloudfront.net/fonts/euclid-circular/EuclidCircularA-Regular-WebXL.woff') format('woff'),
      url('https://d2va9gm4j17fy9.cloudfront.net/fonts/euclid-circular/EuclidCircularA-Regular-WebXL.woff2') format('woff2'),
      url('https://d2va9gm4j17fy9.cloudfront.net/fonts/euclid-circular/EuclidCircularA-Regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
  }


  /* Italic */
  @font-face {
    font-family: 'Euclid Circular A';
    src: url('https://d2va9gm4j17fy9.cloudfront.net/fonts/euclid-circular/EuclidCircularA-RegularItalic-WebXL.woff') format('woff'),
      url('https://d2va9gm4j17fy9.cloudfront.net/fonts/euclid-circular/EuclidCircularA-RegularItalic-WebXL.woff2') format('woff2'),
      url('https://d2va9gm4j17fy9.cloudfront.net/fonts/euclid-circular/EuclidCircularA-RegularItalic.ttf') format('truetype');
    font-weight: 400;
    font-style: italic;
  }


  /**
   * Value Serif
   */


  /* Bold */
  @font-face {
    font-family: 'MongoDB Value Serif';
    font-weight: 700;
    src: url('https://d2va9gm4j17fy9.cloudfront.net/fonts/value-serif/MongoDBValueSerif-Bold.woff') format('woff'),
      url('https://d2va9gm4j17fy9.cloudfront.net/fonts/value-serif/MongoDBValueSerif-Bold.woff2') format('woff2'),
      url('https://d2va9gm4j17fy9.cloudfront.net/fonts/value-serif/MongoDBValueSerif-Bold.ttf') format('truetype');
  }


  /* Medium */
  @font-face {
    font-family: 'MongoDB Value Serif';
    font-weight: 500;
    src: url('https://d2va9gm4j17fy9.cloudfront.net/fonts/value-serif/MongoDBValueSerif-Medium.woff') format('woff'),
      url('https://d2va9gm4j17fy9.cloudfront.net/fonts/value-serif/MongoDBValueSerif-Medium.woff2') format('woff2'),
      url('https://d2va9gm4j17fy9.cloudfront.net/fonts/value-serif/MongoDBValueSerif-Medium.ttf') format('truetype');
  }


  /* Normal */
  @font-face {
    font-family: 'MongoDB Value Serif';
    font-weight: 400;
    src: url('https://d2va9gm4j17fy9.cloudfront.net/fonts/value-serif/MongoDBValueSerif-Regular.woff') format('woff'),
      url('https://d2va9gm4j17fy9.cloudfront.net/fonts/value-serif/MongoDBValueSerif-Regular.woff2') format('woff2'),
      url('https://d2va9gm4j17fy9.cloudfront.net/fonts/value-serif/MongoDBValueSerif-Regular.ttf') format('truetype');
  }
</style>
`;
