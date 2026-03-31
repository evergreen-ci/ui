import banner1 from "./images/banner1.png";
import banner2 from "./images/banner2.png";
import banner3 from "./images/banner3.png";
import banner4 from "./images/banner4.png";
import banner5 from "./images/banner5.png";
import banner6 from "./images/banner6.png";
import banner7 from "./images/banner7.png";
import banner8 from "./images/banner8.png";

const APRIL_FOOLS_BANNERS = [
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
