const hourScrollContainer = "hour-scroll-container";
const minuteScrollContainer = "minute-scroll-container";

const hourOptions = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0"),
);
const minuteOptions = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, "0"),
);

export {
  hourScrollContainer,
  minuteScrollContainer,
  hourOptions,
  minuteOptions,
};
