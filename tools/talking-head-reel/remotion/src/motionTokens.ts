import { Easing, interpolate, spring } from "remotion";

/**
 * One motion language for every 3D element (12-principles audit):
 * - entrances: the same spring everywhere (~7% overshoot, settles in ~0.5s)
 * - exits: 0.2s, ease-in so they accelerate away
 * - everything is in seconds so the overlay can render at 120fps for motion blur
 * - stagger: <= 50ms between items of a group
 * - deformation punches: <= 1.05
 * scripts/motion.py mirrors these numbers for the 2D layer.
 */
export const ENTER_SPRING = { damping: 12, mass: 0.6, stiffness: 140 } as const;
export const EXIT_S = 0.2;
export const STAGGER_S = 0.05;
export const PUNCH = 0.05;

export const enterSpring = (frame: number, fps: number) => spring({ frame, fps, config: ENTER_SPRING });

export const exitScale = (frame: number, durationInFrames: number, fps: number) =>
  interpolate(frame, [durationInFrames - EXIT_S * fps, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
