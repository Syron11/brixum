import { publicAsset } from '../lib/assets';
import { store } from '../data/store';
function Brick({ className }: { className: string }) {
  return (
    <div className={`sculpture-brick ${className}`}>
      <div className="brick-face brick-front">
        {className.includes('red') && (
          <img src={publicAsset(store.logo)} width="1805" height="475" alt="" />
        )}
      </div>
      <div className="brick-face brick-back" />
      <div className="brick-face brick-left" />
      <div className="brick-face brick-right" />
      <div className="brick-face brick-bottom" />
      <div className="brick-face brick-top">
        {Array.from({ length: 8 }, (_, i) => (
          <span className="brick-stud" key={i} />
        ))}
      </div>
    </div>
  );
}
export function BrickSculpture() {
  return (
    <section className="footer-sculpture" aria-label="Детали BRIXUM">
      <div className="sculpture-copy">
        <p>
          Всё начинается
          <br />с одной детали.
        </p>
      </div>
      <div className="sculpture-stage" aria-hidden="true">
        <div className="sculpture-assembly">
          <Brick className="sculpture-brick-red" />
          <Brick className="sculpture-brick-white" />
        </div>
      </div>
    </section>
  );
}
