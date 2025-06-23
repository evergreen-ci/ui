const hourOptions = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0"),
);
const minuteOptions = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, "0"),
);

export { hourOptions, minuteOptions };
