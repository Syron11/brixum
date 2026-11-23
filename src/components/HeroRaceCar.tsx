import { publicAsset } from '../lib/assets';
import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import type { mountRaceCar } from '../lib/race-car';
import { heroModel } from '../data/hero-model';
export function HeroRaceCar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controller = useRef<Awaited<ReturnType<typeof mountRaceCar>> | null>(null);
  const [paused, setPaused] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const pausedRef = useRef(paused);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    pausedRef.current = paused;
    controller.current?.setPaused(paused);
  }, [paused]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let visible = true;
    import('../lib/race-car')
      .then(async ({ mountRaceCar }) => {
        if (disposed) return;
        const mounted = await mountRaceCar(canvas, publicAsset(heroModel.file));
        if (disposed) {
          mounted.dispose();
          return;
        }
        controller.current = mounted;
        controller.current.setPaused(pausedRef.current);
        controller.current.setVisible(visible);
        setLoaded(true);
      })
      .catch(() => {
        if (!disposed) setFailed(true);
      });
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      controller.current?.setVisible(visible);
    });
    observer.observe(canvas);
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onPreference = () => setPaused(preference.matches);
    preference.addEventListener('change', onPreference);
    return () => {
      disposed = true;
      observer.disconnect();
      preference.removeEventListener('change', onPreference);
      controller.current?.dispose();
      controller.current = null;
    };
  }, []);
  return (
    <div className="hero-race-car">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Гоночный конструктор Grand Prix Racer — объёмная модель с подвеской, балками и соединениями Technic"
      />
      {!loaded && !failed && (
        <p className="model-loading" role="status">
          Загружаем 3D-модель…
        </p>
      )}
      {failed ? (
        <p className="model-fallback">3D-визуализация недоступна в этом браузере.</p>
      ) : (
        <button
          className="model-motion-toggle"
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Включить вращение модели' : 'Приостановить вращение модели'}
          aria-pressed={paused}
          title={paused ? 'Включить вращение' : 'Приостановить вращение'}
        >
          {paused ? <Play size={17} aria-hidden="true" /> : <Pause size={17} aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}
