import { Bodoni_Moda, Outfit } from "next/font/google";

export const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500"],
});

export const fontVariables = `${bodoni.variable} ${outfit.variable}`;
