export type Category = 'formula-1' | 'botanical';
export type Availability = 'in_stock' | 'out_of_stock' | 'preorder' | 'unconfirmed';
export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  currency: string;
  shortDescription: string;
  description: string;
  images: string[];
  imagePending: boolean;
  imageType?: 'poster' | 'photo';
  searchTerms?: string[];
  specifications: Record<string, string>;
  availability: Availability;
  stock: number | null;
  pricePreliminary: boolean;
  featured: boolean;
  editorNote?: string;
  variants: { id: string; name: string; extra: number }[];
}
export const availabilityLabels: Record<Availability, string> = {
  in_stock: 'В наличии',
  out_of_stock: 'Нет в наличии',
  preorder: 'Предзаказ',
  unconfirmed: 'Уточнить наличие',
};
// Ограничение количества в одном запросе, не остаток склада.
export const REQUEST_QUANTITY_LIMIT = 99;
export const maxQuantity = (p: Product) =>
  p.availability === 'out_of_stock'
    ? 0
    : Math.min(p.stock ?? REQUEST_QUANTITY_LIMIT, REQUEST_QUANTITY_LIMIT);
export const categories: { id: Category; name: string; description: string; image: string }[] = [
  {
    id: 'formula-1',
    name: 'Formula 1',
    description: 'Гоночный характер. В каждой детали.',
    image: '/images/collections/formula-1-editorial.jpg',
  },
  {
    id: 'botanical',
    name: 'Botanical',
    description: 'Цветы, которые вы собрали сами.',
    image: '/images/collections/botanical-editorial.jpg',
  },
];
// Данные и цены перенесены из промокарточек. Наличие не подтверждено.
export const products: Product[] = [
  {
    id: 'mercedes-amg-petronas-f1',
    sku: 'BRX-F1-001',
    slug: 'mercedes-amg-petronas-f1',
    name: 'Mercedes-AMG F1 W14 E Performance',
    category: 'formula-1',
    price: 18000,
    currency: 'KZT',
    shortDescription:
      'Болид Mercedes-AMG W14 в масштабе 1:8: 1642 детали, система DRS и поршневая группа V6.',
    description:
      'Коллекционный конструктор Mercedes-AMG F1 W14 E Performance в масштабе 1:8. Набор из 1642 деталей передаёт характерный силуэт болида, его чёрно-бирюзовую расцветку и инженерные механизмы. Модель длиной около 60 см оснащена системой DRS и поршневой группой V6.',
    images: ['/products/formula-1/mercedes-amg-w14.jpg'],
    imagePending: false,
    imageType: 'poster',
    specifications: {
      Тип: 'Коллекционный автомобильный конструктор',
      Масштаб: '1:8',
      'Количество деталей': '1642',
      Длина: '≈ 60 см',
      Особенности: 'Система DRS и поршневая группа V6',
    },
    availability: 'unconfirmed',
    stock: null,
    pricePreliminary: false,
    featured: true,
    variants: [
      {
        id: 'standard',
        name: 'Набор',
        extra: 0,
      },
    ],
  },
  {
    id: 'red-bull-racing-f1',
    sku: 'BRX-F1-002',
    slug: 'red-bull-racing-f1',
    name: 'Red Bull Racing RB20',
    category: 'formula-1',
    price: 19900,
    currency: 'KZT',
    shortDescription:
      'Red Bull Racing RB20 в масштабе 1:8: 1639 деталей, рабочая подвеска и матовая ливрея.',
    description:
      'Коллекционная модель Red Bull Racing RB20 в масштабе 1:8. Конструктор состоит из 1639 деталей и воспроизводит узнаваемый гоночный силуэт в синей ливрее с жёлтыми и красными акцентами. Длина собранного болида — около 60 см. Особенности модели — рабочая подвеска и матовая ливрея.',
    images: ['/products/formula-1/red-bull-rb20.jpg'],
    imagePending: false,
    imageType: 'poster',
    specifications: {
      Тип: 'Коллекционный автомобильный конструктор',
      Масштаб: '1:8',
      'Количество деталей': '1639',
      Длина: '≈ 60 см',
      Особенности: 'Рабочая подвеска и матовая ливрея',
    },
    availability: 'unconfirmed',
    stock: null,
    pricePreliminary: false,
    featured: false,
    variants: [
      {
        id: 'standard',
        name: 'Набор',
        extra: 0,
      },
    ],
  },
  {
    id: 'scuderia-ferrari-f1',
    sku: 'BRX-F1-003',
    slug: 'scuderia-ferrari-f1',
    name: 'Ferrari SF-24 F1',
    category: 'formula-1',
    price: 18350,
    currency: 'KZT',
    shortDescription: 'Ferrari SF-24 F1 в масштабе 1:8: 1361 деталь, съёмный кожух и трансмиссия.',
    description:
      'Коллекционный конструктор Ferrari SF-24 F1 в фирменной красной расцветке. Набор из 1361 детали в масштабе 1:8 передаёт силуэт и инженерные особенности гоночного болида. Длина модели — примерно 58–60 см. Съёмный кожух позволяет рассмотреть внутреннее устройство; в конструкции предусмотрена трансмиссия.',
    images: ['/products/formula-1/ferrari-sf24.jpg'],
    imagePending: false,
    imageType: 'poster',
    specifications: {
      Тип: 'Коллекционный автомобильный конструктор',
      Масштаб: '1:8',
      'Количество деталей': '1361',
      Длина: '≈ 58–60 см',
      Особенности: 'Съёмный кожух и трансмиссия',
    },
    availability: 'unconfirmed',
    stock: null,
    pricePreliminary: false,
    featured: true,
    variants: [
      {
        id: 'standard',
        name: 'Набор',
        extra: 0,
      },
    ],
  },
  {
    id: 'mclaren-f1',
    sku: 'BRX-F1-004',
    slug: 'mclaren-f1',
    name: 'McLaren MCL39',
    category: 'formula-1',
    price: 18990,
    currency: 'KZT',
    shortDescription:
      'McLaren MCL39 в масштабе 1:8: 1675 деталей, DRS, двигатель V6 и подвеска 2025 года.',
    description:
      'Соберите McLaren MCL39 из 1675 деталей. Коллекционная модель в масштабе 1:8 выполнена в оранжево-чёрной цветовой гамме и достигает 61 см в длину. В конструкции предусмотрены система DRS, двигатель V6 и подвеска 2025 года.',
    images: ['/products/formula-1/mclaren-mcl39.jpg'],
    imagePending: false,
    imageType: 'poster',
    specifications: {
      Тип: 'Коллекционный автомобильный конструктор',
      Масштаб: '1:8',
      'Количество деталей': '1675',
      Длина: '61 см',
      Особенности: 'Система DRS, двигатель V6 и подвеска 2025 года',
    },
    availability: 'unconfirmed',
    stock: null,
    pricePreliminary: false,
    featured: false,
    variants: [
      {
        id: 'standard',
        name: 'Набор',
        extra: 0,
      },
    ],
  },
  {
    id: 'aston-martin-aramco-f1',
    sku: 'BRX-F1-005',
    slug: 'aston-martin-aramco-f1',
    name: 'Aston Martin AMR25',
    category: 'formula-1',
    price: 18990,
    currency: 'KZT',
    shortDescription:
      'Aston Martin AMR25 в масштабе 1:8: 1547 деталей, аэродинамический обвес и детализированный интерьер.',
    description:
      'Коллекционная модель Aston Martin AMR25 в зелёной гоночной расцветке. Конструктор включает 1547 деталей, выполнен в масштабе 1:8 и достигает примерно 60 см в длину. Особенности набора — аэродинамический обвес и детализированный интерьер.',
    images: ['/products/formula-1/aston-martin-amr25.jpg'],
    imagePending: false,
    imageType: 'poster',
    specifications: {
      Тип: 'Коллекционный автомобильный конструктор',
      Масштаб: '1:8',
      'Количество деталей': '1547',
      Длина: '≈ 60 см',
      Особенности: 'Аэродинамический обвес и детализированный интерьер',
    },
    availability: 'unconfirmed',
    stock: null,
    pricePreliminary: false,
    featured: false,
    variants: [
      {
        id: 'standard',
        name: 'Набор',
        extra: 0,
      },
    ],
  },
  {
    id: 'pink-roses',
    sku: 'BRX-BOT-001',
    slug: 'pink-roses',
    name: 'Bouquet of Pink Roses',
    searchTerms: ['Розовые розы', 'Букет розовых роз'],
    category: 'botanical',
    price: 8990,
    currency: 'KZT',
    shortDescription: 'Букет розовых роз из 789 деталей — декоративный конструктор для интерьера.',
    description:
      'Bouquet of Pink Roses — декоративный конструктор из 789 деталей. Соберите композицию из розовых роз и небольших светлых цветов для украшения интерьера или подарка.',
    images: ['/products/botanical/bouquet-of-pink-roses.jpg'],
    imagePending: false,
    imageType: 'poster',
    specifications: {
      Тип: 'Декоративный конструктор',
      'Количество деталей': '789',
      Назначение: 'Декоративная модель для интерьера',
    },
    availability: 'unconfirmed',
    stock: null,
    pricePreliminary: false,
    featured: true,
    variants: [
      {
        id: 'standard',
        name: 'Набор',
        extra: 0,
      },
    ],
  },
  {
    id: 'red-roses',
    sku: 'BRX-BOT-002',
    slug: 'red-roses',
    name: 'Bouquet of Roses',
    searchTerms: ['Красные розы', 'Букет красных роз'],
    category: 'botanical',
    price: 8990,
    currency: 'KZT',
    shortDescription: 'Букет красных роз из 822 деталей для украшения интерьера.',
    description:
      'Bouquet of Roses — декоративная композиция из красных роз в формате конструктора. Набор включает 822 детали и позволяет собрать выразительный цветочный букет для интерьера.',
    images: ['/products/botanical/bouquet-of-roses.jpg'],
    imagePending: false,
    imageType: 'poster',
    specifications: {
      Тип: 'Декоративный конструктор',
      'Количество деталей': '822',
      Назначение: 'Декоративная модель для интерьера',
    },
    availability: 'unconfirmed',
    stock: null,
    pricePreliminary: false,
    featured: false,
    variants: [
      {
        id: 'standard',
        name: 'Набор',
        extra: 0,
      },
    ],
  },
  {
    id: 'orchid',
    sku: 'BRX-BOT-003',
    slug: 'orchid',
    name: 'Orchid',
    searchTerms: ['Орхидея', 'Орхидеи'],
    category: 'botanical',
    price: 8990,
    currency: 'KZT',
    shortDescription: 'Декоративная орхидея из 608 деталей с белыми цветами и розовыми акцентами.',
    description:
      'Orchid — декоративный конструктор из 608 деталей. Изящные белые цветы с розовыми акцентами и зелёные листья складываются в орхидею для украшения интерьера.',
    images: ['/products/botanical/orchid.jpg'],
    imagePending: false,
    imageType: 'poster',
    specifications: {
      Тип: 'Декоративный конструктор',
      'Количество деталей': '608',
      Назначение: 'Декоративная модель для интерьера',
    },
    availability: 'unconfirmed',
    stock: null,
    pricePreliminary: false,
    featured: true,
    variants: [
      {
        id: 'standard',
        name: 'Набор',
        extra: 0,
      },
    ],
  },
  {
    id: 'flower-arrangement',
    sku: 'BRX-BOT-004',
    slug: 'flower-arrangement',
    name: 'Wildflower Bouquet',
    searchTerms: ['Полевые цветы', 'Букет полевых цветов', 'Цветочная композиция'],
    category: 'botanical',
    price: 8990,
    currency: 'KZT',
    shortDescription: 'Яркий букет полевых цветов из 939 деталей для интерьера.',
    description:
      'Wildflower Bouquet — декоративный конструктор с яркой композицией полевых цветов. Набор из 939 деталей объединяет разные формы и оттенки в выразительный букет для интерьера.',
    images: ['/products/botanical/wildflower-bouquet.jpg'],
    imagePending: false,
    imageType: 'poster',
    specifications: {
      Тип: 'Декоративный конструктор',
      'Количество деталей': '939',
      Назначение: 'Декоративная модель для интерьера',
    },
    availability: 'unconfirmed',
    stock: null,
    pricePreliminary: false,
    featured: false,
    variants: [
      {
        id: 'standard',
        name: 'Набор',
        extra: 0,
      },
    ],
  },
  {
    id: 'flower-bouquet',
    sku: 'BRX-BOT-005',
    slug: 'flower-bouquet',
    name: 'Flower Bouquet',
    searchTerms: ['Букет цветов', 'Цветочный букет'],
    category: 'botanical',
    price: 8990,
    currency: 'KZT',
    shortDescription: 'Разноцветная цветочная композиция из 756 деталей.',
    description:
      'Flower Bouquet — декоративный цветочный конструктор из 756 деталей. Соберите яркую композицию с цветами разных форм и оттенков для украшения интерьера.',
    images: ['/products/botanical/flower-bouquet.jpg'],
    imagePending: false,
    imageType: 'poster',
    specifications: {
      Тип: 'Декоративный конструктор',
      'Количество деталей': '756',
      Назначение: 'Декоративная модель для интерьера',
    },
    availability: 'unconfirmed',
    stock: null,
    pricePreliminary: false,
    featured: false,
    variants: [
      {
        id: 'standard',
        name: 'Набор',
        extra: 0,
      },
    ],
  },
  {
    id: 'pink-peonies',
    sku: 'BRX-BOT-006',
    slug: 'pink-peonies',
    name: 'Pretty Pink Flower Bouquet',
    searchTerms: ['Розовый букет', 'Яркий букет', 'Розовые цветы'],
    category: 'botanical',
    price: 9490,
    currency: 'KZT',
    shortDescription: 'Выразительный букет розовых и ярких цветов из 740+ деталей.',
    description:
      'Pretty Pink Flower Bouquet — декоративный конструктор из 740+ деталей с выразительной композицией розовых и ярких цветов. Соберите цветочный букет для украшения интерьера.',
    images: ['/products/botanical/pretty-pink-flower-bouquet.jpg'],
    imagePending: false,
    imageType: 'poster',
    specifications: {
      Тип: 'Декоративный конструктор',
      'Количество деталей': '740+',
      Назначение: 'Декоративная модель для интерьера',
    },
    availability: 'unconfirmed',
    stock: null,
    pricePreliminary: false,
    featured: false,
    variants: [
      {
        id: 'standard',
        name: 'Набор',
        extra: 0,
      },
    ],
  },
];
export const productById = new Map(products.map((p) => [p.id, p]));

export const productBySlug = new Map(products.map((p) => [p.slug, p]));
