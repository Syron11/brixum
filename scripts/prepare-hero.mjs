// Convert the licensed OMR model using a locally extracted official LDraw library.
// node scripts/prepare-hero.mjs <model.mpd> <ldraw-directory> <output.glb>
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import process from 'node:process';
import { LDrawLoader } from 'three/addons/loaders/LDrawLoader.js';
import { LDrawConditionalLineMaterial } from 'three/addons/materials/LDrawConditionalLineMaterial.js';
import { LDrawUtils } from 'three/addons/utils/LDrawUtils.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

const [source, library, output] = process.argv.slice(2).map((p) => resolve(p));
if (!source || !library || !output)
  throw new Error('Expected model.mpd, LDraw directory, output.glb');
const used = new Set();
// Three's FileLoader uses fetch; this offline converter resolves file URLs only.
globalThis.fetch = async (request) => {
  const url = new URL(typeof request === 'string' ? request : request.url);
  if (url.protocol !== 'file:') throw new Error('Only local LDraw sources are allowed');
  const file = fileURLToPath(url);
  try {
    const bytes = await readFile(file);
    used.add(file);
    return new Response(bytes, {
      status: 200,
      headers: { 'Content-Length': String(bytes.length) },
    });
  } catch {
    return new Response('', { status: 404 });
  }
};
globalThis.ProgressEvent = class {
  constructor(type, properties) {
    Object.assign(this, { type }, properties);
  }
};
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((value) => {
      this.result = value;
      this.onloadend?.();
    });
  }
};

const loader = new LDrawLoader();
loader.setConditionalLineMaterial(LDrawConditionalLineMaterial);
loader.setPartsLibraryPath(pathToFileURL(library + '/').href);
await loader.preloadMaterials(pathToFileURL(join(library, 'LDConfig.ldr')).href);
const sourceText = await readFile(source, 'utf8');
const group = await new Promise((ok, fail) => loader.parse(sourceText, ok, fail));
// LDraw uses negative Y as up. Only instruction edge lines are removed.
group.rotation.x = Math.PI;
const lines = [];
group.traverse((object) => {
  if (object.isLineSegments) lines.push(object);
});
for (const line of lines) line.removeFromParent();
const merged = LDrawUtils.mergeObject(group);
merged.name = 'Grand Prix Racer — Oh-Seong KWON — LDraw OMR';
merged.userData = {
  source: 'https://library.ldraw.org/omr/sets/892',
  license: 'CC BY 2.0; LDraw parts CC BY 2.0 / CC BY 4.0',
};
const triangles = merged.children.reduce(
  (sum, mesh) => sum + mesh.geometry.attributes.position.count / 3,
  0,
);
const bytes = await new GLTFExporter().parseAsync(merged, { binary: true, onlyVisible: true });
await mkdir(dirname(output), { recursive: true });
await writeFile(output, new Uint8Array(bytes));

// Preserve exact source files, author headers, and licenses for attribution/reproduction.
const sourceDir = output.replace(/\.glb$/, '-sources');
await mkdir(sourceDir, { recursive: true });
await copyFile(source, join(sourceDir, '42000-1.mpd'));
for (const name of ['CAreadme.txt', 'CAlicense.txt', 'CAlicense4.txt'])
  used.add(join(library, name));
for (const file of used) {
  const dest = join(sourceDir, file.slice(library.length + 1));
  await mkdir(dirname(dest), { recursive: true });
  await copyFile(file, dest);
}
await writeFile(
  join(sourceDir, 'README.txt'),
  'Grand Prix Racer (42000-1), Oh-Seong KWON. OMR preparation: technicbasics.\nhttps://library.ldraw.org/omr/sets/892\nModel: CC BY 2.0. Parts: see individual !LICENSE, Author and !HISTORY headers.\nConverted to GLB for BRIXUM; drawing edge lines removed; meshes merged by material.\nConversion does not simplify geometry or substitute colours. The web GLB is subsequently meshopt-optimized with -si 0.5 -se 0.0005. Original source files retained here.\n',
);
process.stdout.write(
  JSON.stringify({
    triangles,
    draws: merged.children.length,
    sourceFiles: used.size,
    bytes: bytes.byteLength,
  }) + '\n',
);
