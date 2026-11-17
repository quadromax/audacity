# Artwork and fonts

The hero is original generated fan-inspired artwork, created with the built-in imagegen tool. It is not official Rockstar key art and is not copied from the reference site.

Final production asset: `public/assets/characters/jason-leonida.webp` (1672 × 941, approximately 187 KB). Original retained at `public/assets/characters/jason-leonida.png`. The WebP is served through Next.js Image with responsive sizing. No hotlinks are used.

Generation prompt: “Original digital painted crime-drama illustration, no logos no text no watermark. Jason-inspired rugged young adult man with short brown hair, light stubble, faded olive sleeveless shirt, thin silver chain, looking resolutely at camera, waist-up, on RIGHT THIRD of frame. Nightfall Florida Keys waterfront, palm silhouettes, weathered motel, power lines, low sports car, distant neon lights, tropical amber sunset fading to deep aubergine, pink neon rim light on character. Premium detailed hand-painted key art, cinematic film grain, rich dark shadows, restrained glowing pink highlights. Wide landscape. Left half mostly atmospheric dark violet open sky and sparse palm silhouettes with ample quiet space for separate title overlay. Face near upper right third with generous top margin. No lettering or interface elements.”

To replace: add an authorized image to `public/assets/characters`, update the path in `src/components/hero.tsx` and the Open Graph path/dimensions in `src/app/layout.tsx`. Preserve the face on the right at desktop and test the 66% mobile crop. Keep alt text accurate. Asset slots under `backgrounds`, `icons`, and `textures` can be used for future licensed work. Curated post/reward image paths must start with `/assets/` and point to committed files. Video paths also use `/assets/`; keep files small and use MP4 with a widely supported codec.

Fonts: Barlow Condensed and Inter from Fontsource, self-hosted through npm packages. Both use the SIL Open Font License; license texts ship in their packages. Lucide icons use the ISC license. Generated artwork does not confer ownership of third-party characters or trademarks. The site identifies itself as an unofficial fan project.

## Cinematic redesign assets

The opening separates environment and foreground character for depth and responsive composition:

- public/assets/backgrounds/leonida-dusk.webp — 1659 × 948, approximately 275 KB. Original PNG retained alongside it for download.
- public/assets/characters/jason-cutout.webp — 1024 × 1536, approximately 264 KB, alpha transparency. Original PNG retained.
- The original jason-leonida.webp is reused in the dossier, downloadable art, and closing scene.
- Scene composition lives in src/components/world/opening.tsx and after-hours.tsx; the obsolete hero.tsx mentioned above was removed.
- Fonts remain self-hosted. Decorative grain, paper noise, fictional route graphics and HUD marks are SVG/CSS.

Generation directions: an original tropical Keys canal/motel environment with pastel coral and lilac sunset, palms, power lines and a parked muscle car; no people, logos, lettering or watermarks. The foreground was generated using the existing original character artwork as reference: the same rugged olive-tank character and chain, both arms and upper thighs visible, isolated on transparent background, matching warm sunset lighting. These are generated fan-inspired assets, not official promotional assets.

The share section offers original PNG files. Its on-page typography is composed in HTML; the downloaded file is the original artwork, not a raster capture of the poster typography.

## Second art-direction pass

Two additional original scenes were generated with the built-in image tool and saved locally:

- public/assets/backgrounds/leonida-causeway.png (1536 × 1024), with a 529 KB WebP for responsive delivery.
- public/assets/backgrounds/leonida-nightdrive.png (1536 × 1024), with a 267 KB WebP for responsive delivery.

Causeway prompt: original premium cinematic game-promotion landscape; elevated diagonal view of a Florida Keys causeway over turquoise water, emerald mangroves and palms, a burgundy 1980s muscle car, creamy golden late-afternoon sun, atmospheric haze, sun-bleached asphalt, analog summer texture; no text, people close-up, trademarks or logos.

Night-drive prompt: original premium crime-drama key art; low view through an open burgundy muscle-car window at a rain-soaked Florida motel; rugged olive-tank driver with short brown hair and silver chain on the right, rain on metal, red neon and icy cyan streetlights, dark palm-lined roadway on the left; detailed semi-realistic painted style, no writing, logos, weapons or watermarks.

The revised opening uses a central character with title layers before and behind it. The Leonida gallery switches among causeway, waterfront and night-drive scenes; the night-drive asset also replaces repeated portrait art in the closing composition and downloadable after-hours scene.

## Recreated night-drive artwork

User-requested correction: public/assets/backgrounds/leonida-nightdrive-v2.png and its optimized WebP replace the night-drive image in the gallery, sharing/download section and final scene. Created with the built-in image tool using the rejected night scene for setting and the original jason-leonida portrait for identity/style. Prompt: recreate the rainy neon motel scene with the original character's face, natural seated proportions, roof clearance, left forearm resting on the open driver window, realistic hands, far hand on a properly positioned steering wheel, coherent car geometry, mostly dry skin inside the cabin, rain on exterior surfaces, dark left-side space for text, and illustrated cinematic finish. No text or logos. Original version retained; versioned URLs avoid stale image caches.

## After-hours composition v3

Replaced the similar driver-window composition with an entirely new exterior scene: Jason standing beside a burgundy coupe outside a neon motel after rain. Assets: public/assets/backgrounds/leonida-afterhours-v3.png and .webp. Built-in image generation used the original character portrait solely for identity/style. Prompt direction: wide cinematic painted illustration, standing mid-thigh portrait on right, relaxed natural arms, car parked separately behind him, blue-hour Keys waterfront, wet neon reflections, ample left-side space for site text, no text or logos. All active gallery, poster, download and closing references use the versioned v3 paths.
V4 masked edit: removed the car in the user-provided white mask, reconstructed wet pavement and motel facade, preserved character and atmosphere. Built-in image tool. Saved as public/assets/backgrounds/leonida-afterhours-v4.png and .webp; all active references updated.

## Current AUDACITY ensemble (supersedes earlier Jason-only composition)

The production roster uses eight original generated transparent fan-art assets in public/assets/audacity/: jason, lucia, cal, boobie, drequan, real-dimez, raul and brian. Real Dimez depicts both Bae-Luxe and Roxy. Each asset has an original PNG and an optimized WebP. Existing sunset and other environment artwork is retained. The hero and final ensemble use layered local assets; the gallery renders all eight entries.

The images were generated using the built-in image tool with the official Rockstar character portraits as identity references: original mid-thigh poses, coherent painted finish, warm peach key light, restrained magenta rim light, transparent backgrounds, no logos, lettering, weapons or extra objects. Reference images are retained privately under docs/references and are not served as site art. Character biographies are original concise paraphrases of https://www.rockstargames.com/VI/only-in-leonida. Fan interpretations and third-party characters remain distinguished.

The AUDACITY social preview uses the local Jason/Lucia PNG assets and the self-hosted Barlow font. Presentation is authored in src/app/opengraph-image.tsx.

LEONIDA FM is an original procedural composition in src/lib/soundtrack.ts, authored for this project. It uses generated oscillators and noise, not third-party recordings or samples. No external music asset or commercial music license is claimed.

TradingView Lightweight Charts 5.3.0 uses Apache-2.0. Its NOTICE and LICENSE are preserved in public/licenses and accessible from the footer; chart attribution links to TradingView. Existing font/icon notices remain applicable.
