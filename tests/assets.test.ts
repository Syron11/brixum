import { describe, expect, it } from 'vitest';
import { publicAsset } from '../src/lib/assets';

describe('Public assets on a domain and GitHub project path', () => {
  it('resolves the same editable asset under either deployment root', () => {
    expect(publicAsset('/products/botanical/orchid.jpg', '/')).toBe(
      '/products/botanical/orchid.jpg',
    );
    expect(publicAsset('/products/botanical/orchid.jpg', '/brixum/')).toBe(
      '/brixum/products/botanical/orchid.jpg',
    );
    expect(publicAsset('/models/grand-prix-racer.glb', '/brixum/')).toBe(
      '/brixum/models/grand-prix-racer.glb',
    );
  });
  it('preserves external, data and relative URLs', () => {
    for (const path of [
      'https://example.com/image.jpg',
      'data:image/svg+xml,test',
      '//cdn.example.com/a.png',
      'relative.jpg',
    ]) {
      expect(publicAsset(path, '/brixum/')).toBe(path);
    }
  });
});
