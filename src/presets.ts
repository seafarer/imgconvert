export type ImagePreset = {
  id: string;
  label: string;
  width: number;
  height: number;
  suffix: string;
};

export const presets: ImagePreset[] = [
  { id: "hero", label: "Hero", width: 1600, height: 1000, suffix: "hero" },
  { id: "card", label: "Card", width: 1200, height: 900, suffix: "card" },
  {
    id: "portrait",
    label: "Portrait",
    width: 900,
    height: 1100,
    suffix: "portrait",
  },
];

export const WEBP_QUALITY = 0.82;
export const MAX_SOURCE_DIMENSION = 6000;
export const DOWNSCALE_TARGET = 2560;
export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
