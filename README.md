# BRIXUM

Каталог коллекционных конструкторов Formula 1 и Botanical. React, TypeScript, Vite и Tailwind CSS.

## Запуск

Требуется Node.js 24 LTS.

```sh
npm ci
npm run dev -- --port 5173
```

Локальный адрес: http://localhost:5173/.

## Обновление каталога

- Товары, цены, характеристики и категории: `src/data/products.ts`.
- Настройки магазина и публичных ссылок: `src/data/store.ts`.
- Изображения товаров: `public/products/`.
- Обложки коллекций: `public/images/collections/`.
- Стили: `src/styles.css`.

Пути к изображениям указываются в поле `images`. Для квадратных промокарточек используйте `imageType: 'poster'`. Если цена напечатана на изображении, обновляйте его вместе с ценой в каталоге. Поля `availability` и `stock` управляют наличием и ограничениями количества.

Корзина сохраняется в браузере. Оформление создаёт текст запроса с составом заказа и открывает WhatsApp; отправку сообщения выполняет покупатель. Переход не очищает корзину.

## Проверки

```sh
npm run lint
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Браузерные проверки `test:e2e` требуют запущенного сервера разработки.

## GitHub Pages

Сайт: https://syron11.github.io/brixum/

```sh
npm run build:pages
npm run test:pages
```

Изменения в `main` публикуются через GitHub Actions. Настройка сборки и маршрутов описана в [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Материалы

Обложки разделов — сгенерированные тематические иллюстрации. Изображения каталога — промокарточки. Происхождение материалов сохранено в `assets/`. Авторство, лицензии и исходники декоративной 3D-модели: [public/models/ATTRIBUTION.md](public/models/ATTRIBUTION.md) и страница «Материалы и лицензии» на сайте.

Зависимости, сборка, локальные настройки и секреты исключены через `.gitignore`.
