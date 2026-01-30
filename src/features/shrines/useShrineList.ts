// produce a UI-ready list of shrines for the list screen

import data from "../../../app/_data/test.json";
import { toShrineCardModels, ShrineCardModel, ShrineImage, Shrine } from "./mappers";

export function useShrineList(): {
  shrines: ShrineCardModel[];
  isEmpty: boolean;
} {
  const shrines: Shrine[] = (data as any).shrines ?? [];
  const images: ShrineImage[] = (data as any).images ?? [];

  const shrinesWithImage = toShrineCardModels(shrines, images);

  return {
    shrines: shrinesWithImage,
    isEmpty: shrinesWithImage.length === 0,
  };
}