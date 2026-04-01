import banner1 from "./images/banner1.png";
import banner2 from "./images/banner2.png";
import banner3 from "./images/banner3.png";
import banner4 from "./images/banner4.png";
import banner5 from "./images/banner5.png";
import banner6 from "./images/banner6.png";
import banner7 from "./images/banner7.png";
import banner8 from "./images/banner8.png";
import image1 from "./images/image1.png";
import image2 from "./images/image2.png";
import image3 from "./images/image3.png";
import image4 from "./images/image4.png";
import image5 from "./images/image5.png";
import image6 from "./images/image6.png";
import image7 from "./images/image7.png";

export const APRIL_FOOLS_BANNERS = [
  banner1,
  banner2,
  banner3,
  banner4,
  banner5,
  banner6,
  banner7,
  banner8,
] as const;

export type AprilFoolsBanner = (typeof APRIL_FOOLS_BANNERS)[number];

export const getRandomAprilFoolsBanner = (): AprilFoolsBanner => {
  const index = Math.floor(Math.random() * APRIL_FOOLS_BANNERS.length);
  return APRIL_FOOLS_BANNERS[index];
};

export const APRIL_FOOLS_IMAGES = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
] as const;

export type AprilFoolsImage = (typeof APRIL_FOOLS_IMAGES)[number];

export const getRandomAprilFoolsImage = (): AprilFoolsImage => {
  const index = Math.floor(Math.random() * APRIL_FOOLS_IMAGES.length);
  return APRIL_FOOLS_IMAGES[index];
};
