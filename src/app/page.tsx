import { Leonida } from "@/components/world/opening";
import {
  AudacityHero,
  AudacityTakeover,
  HowToBuy,
} from "@/components/world/audacity";
import { CastGallery } from "@/components/world/cast-gallery";
import { Exchange } from "@/components/world/exchange";
import { WantedLevel, Transmissions } from "@/components/world/after-hours";
export default function Home() {
  return (
    <>
      <AudacityHero />
      <Leonida />
      <CastGallery />
      <Exchange />
      <WantedLevel />
      <Transmissions />
      <HowToBuy />
      <AudacityTakeover />
    </>
  );
}
