import { publicAsset } from '../lib/assets';
import { store } from '../data/store';
export function Brand() {
  return (
    <img
      className="brand-logo"
      src={publicAsset(store.logo)}
      width="1805"
      height="475"
      alt="BRIXUM"
    />
  );
}
