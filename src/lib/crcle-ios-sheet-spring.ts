/** Shared iOS-style sheet spring (mobile project folder overlay). */
export const CRCLE_IOS_SHEET_SPRING = {
  type: "spring",
  stiffness: 560,
  damping: 36,
  mass: 0.86,
  restDelta: 0.35,
  restSpeed: 0.35,
} as const;

export const CRCLE_MOTION_INSTANT = { duration: 0.01 } as const;