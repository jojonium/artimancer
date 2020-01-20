import { FontFaceDescriptors } from "css-font-loading-module";

/**
 * List all resources to load here
 */
export const resources = {
  sprites: [{ spriteLabel: "test", length: 6, slowdown: 48 }],
  images: [
    { filename: "images/f1.svg", spriteLabel: "test", index: 0 },
    { filename: "images/f2.svg", spriteLabel: "test", index: 1 },
    { filename: "images/f3.svg", spriteLabel: "test", index: 2 },
    { filename: "images/f4.svg", spriteLabel: "test", index: 3 },
    { filename: "images/f5.svg", spriteLabel: "test", index: 4 },
    { filename: "images/f6.svg", spriteLabel: "test", index: 5 }
  ],
  fonts: [
    {
      family: "Bitter",
      filename: "fonts/bitter/Bitter-Regular.otf",
      options: { style: "normal", weight: "400" } as FontFaceDescriptors
    },
    {
      family: "Bitter",
      filename: "fonts/bitter/Bitter-Bold.otf",
      options: { style: "normal", weight: "700" } as FontFaceDescriptors
    },
    {
      family: "Bitter",
      filename: "fonts/bitter/Bitter-Italic.otf",
      options: { style: "italic", weight: "400" } as FontFaceDescriptors
    },
    {
      family: "Bitter",
      filename: "fonts/bitter/Bitter-BoldItalic.otf",
      options: { style: "italic", weight: "700" } as FontFaceDescriptors
    }
  ]
};
