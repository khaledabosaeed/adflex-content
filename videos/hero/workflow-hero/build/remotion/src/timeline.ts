// Scene start frames (30 fps) for the v14 timeline. WorkflowHero and Sound both read these.
// Story order: problem → Lama photographs her product → match cut onto the product photo, which flies into ALFA's
// prompt → ALFA plans → builds → the run's story video grows out of the last node into a player (the result) →
// next week: a new product, the same way → ALFA runs it again → end card.
// Every cut sits on the music's beat grid (120 BPM = one beat every 15 frames).
export const SCENES = {
  title: 0,
  problem: 60,
  shoot: 105,
  ask: 150,
  plan: 210,
  build: 285,
  result: 345,
  lama: 405,
  ask2: 450,
  flow: 495,
  end: 570,
  total: 654,
};
