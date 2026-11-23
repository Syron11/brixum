# Hero model — Grand Prix Racer

- Model: **Grand Prix Racer (42000-1)**, **Oh-Seong KWON [widetent]**.
- OMR preparation: **technicbasics**, 2019-03-22 (see original !HISTORY).
- Source: https://library.ldraw.org/omr/sets/892
- Original MPD: https://library.ldraw.org/media/omr_models/1047/42000-1.mpd
- Model license: **Creative Commons Attribution 2.0** — https://creativecommons.org/licenses/by/2.0/
- Original header: `0 !LICENSE Redistributable under CCAL version 2.0 : see CAreadme.txt`.
- Parts: **LDraw.org Parts Library contributors** — https://library.ldraw.org/
- Parts licenses: CC BY 2.0 / CC BY 4.0 as declared by individual !LICENSE and !HISTORY lines; https://creativecommons.org/licenses/by/4.0/
- Contributor agreement / legacy license explanation: https://www.ldraw.org/article/349.html
- Downloaded from official LDraw sources, 2026-11-23.

## Preparation for BRIXUM

The model was parsed with Three.js LDrawLoader using the official LDraw library. LDraw Y-down coordinates were converted to Y-up. Instruction lines were removed. Surface meshes were merged by material and exported to GLB; original LDraw colours were retained. gltfpack/meshopt compressed and optimized the mesh (`-si 0.5 -se 0.0005 -vp 16 -vn 12`); maximum simplification error constrained to 0.0005 relative to model extent. Final model: 1,072,625 triangles, 13 material primitives, 8,060,256 bytes. Runtime framing, environment lighting and rotation were added.

The exact MPD and the 535 local files read from the parts library, including their author/history headers, LDConfig and all three library license documents, are preserved in [grand-prix-sources.zip](./grand-prix-sources.zip). Conversion script: `scripts/prepare-hero.mjs`. The source archive may also be used as the local library directory to reproduce the conversion.

Visible attribution appears in the website footer. Full attribution and download are on `/sources`. The model illustrates the world of construction sets; it is not presented as a photo of a BRIXUM catalog SKU. No endorsement by LEGO or LDraw is claimed. LEGO is a trademark of the LEGO Group.
