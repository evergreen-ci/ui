export const scrollToIdx = (
  scrollContainerId: string,
  index: number,
  behavior?: "smooth",
) => {
  const scrollContainer = document.getElementById(scrollContainerId);
  if (scrollContainer && index > -1) {
    scrollContainer.scrollTo({ top: 32.5 * index, behavior });
  }
};
