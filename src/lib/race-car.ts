import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/** Grand Prix Racer, LDraw OMR; атрибуция в футере и public/models/ATTRIBUTION.md. */
export async function mountRaceCar(canvas: HTMLCanvasElement, modelUrl: string) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
  renderer.setClearColor(0x0b0b0b, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04);
  scene.environment = environment.texture;
  room.dispose();
  pmrem.dispose();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x32323b, 0.65));
  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(4, 8, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xcad6ff, 0.8);
  rim.position.set(-5, 4, -5);
  scene.add(rim);
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  let asset;
  try {
    asset = await loader.loadAsync(modelUrl);
  } catch (error) {
    environment.dispose();
    renderer.dispose();
    throw error;
  }
  const model = asset.scene;
  // Сохраняем исходные PBR-материалы, стекло, лак, карты рельефа и текстуры.
  const anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 16);
  model.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of materials) {
      for (const value of Object.values(material)) {
        if (value instanceof THREE.Texture) value.anisotropy = anisotropy;
      }
    }
  });
  let bounds = new THREE.Box3().setFromObject(model);
  const size = bounds.getSize(new THREE.Vector3());
  // Подготовленный файл — Y-up; продольную ось располагаем по X.
  if (size.z > size.x) model.rotation.y = Math.PI / 2;
  bounds = new THREE.Box3().setFromObject(model);
  const scale = 7.2 / Math.max(bounds.max.x - bounds.min.x, bounds.max.z - bounds.min.z);
  model.scale.multiplyScalar(scale);
  bounds = new THREE.Box3().setFromObject(model);
  const center = bounds.getCenter(new THREE.Vector3());
  model.position.sub(new THREE.Vector3(center.x, bounds.min.y, center.z));
  const car = new THREE.Group();
  car.add(model);
  scene.add(car);
  car.rotation.y = -0.35;
  let ready = false,
    paused = false,
    visible = true,
    previous = 0,
    needsRender = true;
  const resize = () => {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Keep the whole car inside the narrow tablet column as well as the wide mobile canvas.
    const distance = 12 * Math.max(1, 1.25 / camera.aspect);
    camera.position.set(9, 4.8, 10).setLength(distance);
    camera.lookAt(0, 1.0, 0);
    camera.updateProjectionMatrix();
    needsRender = true;
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();
  renderer.setAnimationLoop((time: number) => {
    const delta = previous ? Math.min((time - previous) / 1000, 0.06) : 0;
    previous = time;
    if (!visible || document.hidden) return;
    if (!paused) {
      car.rotation.y += delta * 0.15;
      needsRender = true;
    }
    if (needsRender) {
      renderer.render(scene, camera);
      canvas.dataset.modelAngle = car.rotation.y.toFixed(4);
      if (!ready) {
        canvas.dataset.modelReady = 'true';
        ready = true;
      }
      needsRender = false;
    }
  });
  return {
    setPaused(value: boolean) {
      paused = value;
      needsRender = true;
    },
    setVisible(value: boolean) {
      visible = value;
      previous = 0;
    },
    dispose() {
      observer.disconnect();
      renderer.setAnimationLoop(null);
      const materials = new Set<THREE.Material>();
      model.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          (Array.isArray(object.material) ? object.material : [object.material]).forEach((m) =>
            materials.add(m),
          );
        }
      });
      materials.forEach((m) => m.dispose());
      environment.dispose();
      renderer.dispose();
      delete canvas.dataset.modelReady;
    },
  };
}
