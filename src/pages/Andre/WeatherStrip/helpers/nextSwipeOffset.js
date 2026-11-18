export const clampOffset = (offset, maxOffset) => {
  const max = Math.max(0, maxOffset);
  if (offset <= 0) return 0;
  if (offset >= max) return max;
  return offset;
};

export const nextSwipeOffset = (startOffset, deltaX, maxOffset) =>
  clampOffset(startOffset - deltaX, maxOffset);
