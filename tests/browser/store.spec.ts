import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const product = '/product/mercedes-amg-petronas-f1';
test('каталог: поиск, категории, фильтры и сортировка', async ({ page }) => {
  await page.goto('/catalog');
  await expect(page.locator('.product-card')).toHaveCount(11);
  await page.getByRole('searchbox').fill('BRX-F1-003');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await expect(page.locator('.product-card h3')).toHaveText('Ferrari SF-24 F1');
  await page.getByRole('searchbox').fill('несуществующий набор');
  await expect(page.getByText('Такой модели пока нет')).toBeVisible();
  await page.getByRole('button', { name: 'Показать все модели' }).click();
  await page.getByRole('button', { name: 'Formula 1', exact: true }).click();
  await expect(page.locator('.product-card')).toHaveCount(5);
  await page.getByLabel('Только в наличии').check();
  await expect(page.locator('.product-card')).toHaveCount(0);
  await page.getByLabel('Только в наличии').uncheck();
  await page.getByLabel('Цена от', { exact: true }).fill('18300');
  await page.getByLabel('Цена до', { exact: true }).fill('19000');
  await expect(page.locator('.product-card')).toHaveCount(3);
  await page.getByRole('combobox', { name: 'Сортировка' }).selectOption('price-asc');
  await expect(page.locator('.product-card h3').first()).toHaveText('Ferrari SF-24 F1');
  await page.getByRole('button', { name: 'Сбросить фильтры' }).click();
  await page.getByRole('button', { name: 'Botanical', exact: true }).click();
  await expect(page.locator('.product-card')).toHaveCount(6);
  await expect(page.locator('.preliminary-price')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('.product-card')).toHaveCount(6);
});
test('корзина, расчёты, сохранение и сообщение WhatsApp', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(product);
  await page.getByRole('button', { name: 'Добавить в корзину', exact: true }).click();
  await page.goto('/product/pink-roses');
  await page.getByRole('button', { name: 'Увеличить: Количество', exact: true }).click();
  await page.getByRole('button', { name: 'Добавить в корзину', exact: true }).click();
  await page.goto('/cart');
  await expect(page.locator('.cart-item')).toHaveCount(2);
  await expect(page.locator('.summary-total')).toContainText(/35\s980/);
  await page.reload();
  await expect(page.locator('.cart-item')).toHaveCount(2);
  await page.getByRole('button', { name: /Увеличить: Bouquet of Pink Roses/ }).click();
  await expect(page.locator('.summary-total')).toContainText(/44\s970/);
  await page.getByRole('button', { name: /Уменьшить: Bouquet of Pink Roses/ }).click();
  await page.evaluate(() =>
    sessionStorage.setItem(
      'brixum.customer.session.v1',
      JSON.stringify({ name: 'Старый черновик', city: '', comment: '' }),
    ),
  );
  await page.getByRole('link', { name: 'Перейти к оформлению' }).click();
  await expect(page.getByRole('textbox', { name: 'Имя', exact: false })).toHaveCount(0);
  await expect
    .poll(() =>
      page.evaluate(() => JSON.parse(sessionStorage.getItem('brixum.customer.session.v1') || '{}')),
    )
    .not.toHaveProperty('name');
  await page.getByRole('button', { name: 'Проверить сообщение заказа' }).click();
  await expect(page.getByText('Укажите город получения.')).toBeVisible();
  await expect(page.getByLabel('Город', { exact: false })).toBeFocused();
  await page.getByLabel('Город', { exact: false }).fill('Астана');
  await page.getByLabel('Комментарий', { exact: false }).fill('Подарок & коробка? 🎁');
  await page.getByRole('button', { name: 'Проверить сообщение заказа' }).click();
  await expect(
    page.getByText('Подтвердите согласие на передачу сведений через WhatsApp.'),
  ).toBeVisible();
  await expect(page.getByRole('checkbox', { name: /Согласен передать/ })).toBeFocused();
  await expect(page.getByRole('link', { name: 'Открыть WhatsApp', exact: true })).toHaveCount(0);
  await page.getByRole('checkbox', { name: /Согласен передать/ }).check();
  await page.getByRole('button', { name: 'Проверить сообщение заказа' }).click();
  await expect(page.locator('#order-message')).toHaveValue(/BRX-F1-001/);
  await expect(page.locator('#order-message')).toHaveValue(/35\s980/);
  await expect(page.locator('#order-message')).toHaveValue(/Уточнить наличие/);
  const whatsappOrder = new URL(
    (await page.getByRole('link', { name: 'Открыть WhatsApp', exact: true }).getAttribute('href'))!,
  );
  expect(whatsappOrder.pathname).toBe('/77476502456');
  expect(whatsappOrder.searchParams.get('text')).toBe(
    await page.locator('#order-message').inputValue(),
  );
  expect(whatsappOrder.searchParams.get('text')).not.toContain('Имя:');
  await page.getByRole('button', { name: 'Скопировать текст' }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    'Комментарий: Подарок & коробка? 🎁',
  );
  const a11y = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(a11y.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))).toEqual(
    [],
  );
  await page.screenshot({ path: 'test-results/checkout-message-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/checkout-message-mobile.png', fullPage: true });
  await page.reload();
  await expect(page.getByLabel('Город', { exact: false })).toHaveValue('Астана');
  await expect(page.getByRole('checkbox', { name: /Согласен передать/ })).not.toBeChecked();
  await page.goto('/cart');
  await page.getByRole('button', { name: /Удалить: Bouquet of Pink Roses/ }).click();
  await expect(page.locator('.cart-item')).toHaveCount(1);
  await page.getByRole('button', { name: 'Отменить', exact: true }).click();
  await expect(page.locator('.cart-item')).toHaveCount(2);
});
test('настроенные социальные ссылки и заказ используют один номер', async ({ page, context }) => {
  // Подставляем тестовые настройки только в изолированном браузере, не в файлах магазина.
  await page.route('**/src/data/store.ts*', async (route) => {
    const r = await route.fetch();
    let body = await r.text();
    body = body
      .replace(/whatsapp:\s*["'][^"']*["']/, 'whatsapp: "77001234567"')
      .replace(
        /instagram:\s*["'][^"']*["']/,
        'instagram: "https://www.instagram.com/brixum_test/"',
      );
    await route.fulfill({ response: r, body });
  });
  await page.goto('/');
  const footer = page.locator('footer');
  const instagram = footer.getByRole('link', { name: /Instagram магазина/ }),
    whatsapp = footer.getByRole('link', { name: /WhatsApp магазина/ });
  await expect(instagram).toHaveAttribute('href', 'https://www.instagram.com/brixum_test/');
  await expect(whatsapp).toHaveAttribute('href', /^https:\/\/wa.me\/77001234567\?text=/);
  for (const link of [instagram, whatsapp]) {
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }
  await page.goto(product);
  await page.getByRole('button', { name: 'Добавить в корзину', exact: true }).click();
  await page.goto('/checkout');
  await page.getByLabel('Город', { exact: false }).fill('Астана');
  await page.getByRole('checkbox', { name: /Согласен передать/ }).check();
  await page.getByRole('button', { name: 'Проверить сообщение заказа' }).click();
  const open = page.getByRole('link', { name: 'Открыть WhatsApp', exact: true });
  const href = (await open.getAttribute('href'))!;
  expect(new URL(href).pathname).toBe('/77001234567');
  expect(new URL(href).searchParams.get('text')).toContain('BRX-F1-001');
  // Перехватываем внешнюю навигацию, чтобы не обращаться к тестовому номеру.
  await context.route('https://wa.me/**', (r) =>
    r.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<title>Тест внешнего перехода</title>',
    }),
  );
  const popup = context.waitForEvent('page');
  await open.click();
  const target = await popup;
  await target.waitForLoadState();
  await target.close();
  await page.goto('/cart');
  await expect(page.locator('.cart-item')).toHaveCount(1);
});
test('клавиатура, меню и честное пустое оформление', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'К содержимому' })).toBeFocused();
  await expect(page.getByRole('link', { name: 'К содержимому' })).toHaveCSS(
    'outline-style',
    'solid',
  );
  await page.getByRole('button', { name: 'Открыть меню' }).click();
  await expect(page.locator('#mobile-nav')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#mobile-nav')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Открыть меню' })).toBeFocused();
  await page.goto('/checkout');
  await expect(page.getByText('Корзина пока пуста.', { exact: false })).toBeVisible();
});
for (const viewport of [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 },
]) {
  test(`адаптивность, футер, логотип и доступность ${viewport.width}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
    });
    await page.goto(product);
    await page.getByRole('button', { name: 'Добавить в корзину', exact: true }).click();
    for (const route of [
      '/',
      '/catalog',
      product,
      '/cart',
      '/checkout',
      '/about',
      '/delivery',
      '/sources',
      '/privacy',
      '/terms',
      '/missing',
    ]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      if (route === '/') {
        await expect(page.locator('.hero-race-car canvas')).toHaveAttribute(
          'data-model-ready',
          'true',
        );
        await page.getByRole('button', { name: 'Приостановить вращение модели' }).click();
        const covers = page.locator('.category-card');
        await expect(covers).toHaveCount(2);
        for (const cover of await covers.all()) {
          const image = cover.locator('img');
          await image.evaluate((node) => node.decode());
          await expect(image).toHaveAttribute('src', /^\/images\/collections\//);
          await expect(image).toHaveCSS('object-fit', 'cover');
          const cardBox = await cover.boundingBox();
          const imageBox = await image.boundingBox();
          expect(
            Math.abs(cardBox!.width / cardBox!.height - (viewport.width <= 899 ? 1.5 : 2)),
          ).toBeLessThan(0.01);
          expect(Math.abs(cardBox!.width - imageBox!.width)).toBeLessThan(3);
          expect(Math.abs(cardBox!.height - imageBox!.height)).toBeLessThan(3);
        }
        const gridBox = await page.locator('.category-grid').boundingBox();
        const headingBox = await page
          .locator('.category-grid')
          .locator('..')
          .locator('.section-heading')
          .boundingBox();
        expect(Math.abs(gridBox!.x - headingBox!.x)).toBeLessThan(1);
        expect(Math.abs(gridBox!.width - headingBox!.width)).toBeLessThan(1);
        await page
          .locator('.category-grid')
          .screenshot({ path: `test-results/${viewport.width}-collection-covers.png` });
      }
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('body')).not.toContainText(
        /демонстрацион|заказы не принимаются|цены и остатки условные/i,
      );
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        route + ' overflow',
      ).toBe(true);
      await page.locator('footer').scrollIntoViewIfNeeded();
      await expect(page.locator('footer')).toHaveCSS('background-color', 'rgb(11, 11, 11)');
      await expect(page.locator('footer').getByText('Астана, Казахстан')).toBeVisible();
      const instagram = page.locator('footer').getByRole('link', { name: /Instagram магазина/ });
      const whatsapp = page.locator('footer').getByRole('link', { name: /WhatsApp магазина/ });
      await expect(instagram).toHaveAttribute('href', 'https://www.instagram.com/brickcars.kz/');
      await expect(whatsapp).toHaveAttribute('href', /^https:\/\/wa.me\/77476502456\?text=/);
      await expect(instagram).toHaveText('');
      await expect(whatsapp).toHaveText('');
      const logos = page.locator('.brand-logo');
      await expect(logos).toHaveCount(2);
      expect(
        await logos.evaluateAll((imgs) =>
          imgs.every((img) => {
            const i = img as HTMLImageElement;
            return (
              i.complete &&
              i.naturalWidth === 1805 &&
              i.naturalHeight === 475 &&
              Math.abs(i.width / i.height - 1805 / 475) < 0.1
            );
          }),
        ),
      ).toBe(true);
      expect(
        await page
          .locator('img')
          .evaluateAll((imgs) =>
            imgs.filter((i) => i.complete && !i.naturalWidth).map((i) => i.src),
          ),
      ).toEqual([]);
      const a11y = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(
        a11y.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
        route + ' accessibility',
      ).toEqual([]);
      if (
        [
          '/',
          '/catalog',
          product,
          '/cart',
          '/checkout',
          '/delivery',
          '/privacy',
          '/terms',
        ].includes(route)
      ) {
        await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
        await page.screenshot({
          path: `test-results/${viewport.width}-${route === '/' ? 'home' : route.includes('product') ? 'product' : route.slice(1)}.png`,
          fullPage: true,
        });
      }
      if (route === '/') {
        await page
          .locator('footer')
          .screenshot({ path: `test-results/${viewport.width}-footer.png` });
      }
    }
    // Переходы по существующим ссылкам футера проверяются в реальном приложении.
    await page.locator('footer').getByRole('link', { name: 'Formula 1', exact: true }).click();
    await expect(page).toHaveURL(/category=formula-1/);
    await expect(page.locator('.product-card')).toHaveCount(5);
    await page.locator('footer').getByRole('link', { name: 'Botanical', exact: true }).click();
    await expect(page.locator('.product-card')).toHaveCount(6);
    expect(errors).toEqual([]);
  });
}

test('return to catalog filters and automatic hero rotation', async ({ page }) => {
  await page.goto('/catalog?category=formula-1&q=Mercedes&sort=price-asc');
  await page.getByRole('link', { name: 'Подробнее: Mercedes-AMG F1 W14 E Performance' }).click();
  await page.getByRole('link', { name: 'Вернуться в каталог' }).click();
  await expect(page).toHaveURL('/catalog?category=formula-1&q=Mercedes&sort=price-asc');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page.goto(product);
  await page.getByRole('link', { name: 'Вернуться в каталог' }).click();
  await expect(page).toHaveURL('/catalog');
  await page.goto('/');
  await expect(page.locator('.sculpture-brick')).toHaveCount(2);
  await expect(page.getByRole('button', { name: 'Повернуть 3D-композицию' })).toHaveCount(0);
  const canvas = page.locator('.hero-race-car canvas');
  await expect(canvas).toHaveAttribute('data-model-ready', 'true');
  const firstAngle = await canvas.getAttribute('data-model-angle');
  await expect.poll(() => canvas.getAttribute('data-model-angle')).not.toBe(firstAngle);
  await page.getByRole('button', { name: 'Приостановить вращение модели' }).click();
  await expect(page.getByRole('button', { name: 'Включить вращение модели' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await canvas.screenshot({ path: 'test-results/hero-model.png' });
  await page.goto('/catalog');
  await expect(page.locator('.footer-sculpture')).toHaveCount(0);
});

test('retina hero keeps native pixel resolution and removes the extra strip', async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 2,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto('/');
  const canvas = page.locator('.hero-race-car canvas');
  await expect(canvas).toHaveAttribute('data-model-ready', 'true', { timeout: 15000 });
  expect(
    await canvas.evaluate((node) => node.width / node.getBoundingClientRect().width),
  ).toBeGreaterThanOrEqual(1.99);
  await expect(page.locator('.hero-bottom')).toHaveCount(0);
  await expect(page.getByText('Собрать. Подарить. Сохранить.', { exact: true })).toHaveCount(0);
  await expect(page.getByText('Formula 1 / Botanical', { exact: true })).toHaveCount(0);
  await expect(page.locator('.hero').getByText('CC BY 2.0', { exact: true })).toHaveCount(0);
  const credit = page.locator('footer .footer-model-credit');
  await expect(credit).toContainText('Oh-Seong KWON');
  await expect(credit.getByRole('link', { name: 'CC BY 2.0', exact: true })).toHaveAttribute(
    'href',
    'https://creativecommons.org/licenses/by/2.0/',
  );
  await canvas.screenshot({ path: 'test-results/hero-model-retina.png' });
  await page.locator('.hero').screenshot({ path: 'test-results/hero-retina-desktop.png' });
  await credit.getByRole('link', { name: 'Материалы и лицензии' }).click();
  await expect(page).toHaveURL('/sources');
  await expect(
    page.locator('main').getByRole('heading', { name: '3D-модель на главной' }),
  ).toBeVisible();
  await expect(
    page.locator('main').getByRole('link', { name: 'Исходники, авторы деталей и тексты лицензий' }),
  ).toHaveAttribute('href', '/models/grand-prix-sources.zip');
  await context.close();
});

test('reduced motion keeps the hero car static initially', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.hero-race-car canvas')).toHaveAttribute('data-model-ready', 'true');
  await expect(page.getByRole('button', { name: 'Включить вращение модели' })).toBeVisible();
  await expect(page.locator('.sculpture-assembly')).toHaveCSS('transition-duration', '0s');
});

test('контакты показывают профиль и телефон, страницы информации доступны из футера', async ({
  page,
}) => {
  await page.goto('/delivery');
  const main = page.locator('main');
  await expect(main.getByRole('link', { name: '@brickcars.kz', exact: true })).toHaveAttribute(
    'href',
    'https://www.instagram.com/brickcars.kz/',
  );
  await expect(main.getByRole('link', { name: '+7 747 650 24 56', exact: true })).toHaveAttribute(
    'href',
    /^https:\/\/wa.me\/77476502456\?text=/,
  );
  await expect(main.getByRole('link', { name: '+', exact: true })).toHaveCount(0);
  await expect(main.getByText('Instagram BRIXUM', { exact: true })).toHaveCount(0);
  await page
    .locator('footer')
    .getByRole('link', { name: 'Конфиденциальность', exact: true })
    .click();
  await expect(page).toHaveURL('/privacy');
  await expect(
    page.getByRole('heading', { name: 'Передача через WhatsApp', exact: true }),
  ).toBeVisible();
  await page.locator('footer').getByRole('link', { name: 'Условия заказа', exact: true }).click();
  await expect(page).toHaveURL('/terms');
  await expect(
    page.getByRole('heading', { name: 'Как согласуется заказ', exact: true }),
  ).toBeVisible();
});

test('пять постеров болидов загружаются целиком, поиск находит модель и галерея увеличивается', async ({
  page,
}) => {
  await page.goto('/catalog?category=formula-1');
  await expect(page.locator('.product-card-poster')).toHaveCount(5);
  const images = page.locator('.product-card-poster .product-image img');
  for (const img of await images.all()) {
    await img.scrollIntoViewIfNeeded();
    await img.evaluate((node) => node.decode());
    expect(await img.evaluate((node) => [node.naturalWidth, node.naturalHeight])).toEqual([
      1254, 1254,
    ]);
    await expect(img).toHaveCSS('object-fit', 'contain');
  }
  await expect(page.locator('.product-card-poster .product-image .product-status')).toHaveCount(0);
  await page.getByRole('searchbox').fill('RB20');
  await expect(page.locator('.product-card')).toHaveCount(1);
  await expect(page.locator('.product-card h3')).toHaveText('Red Bull Racing RB20');
  await page.getByRole('searchbox').clear();
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: 'test-results/posters-catalog-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'test-results/posters-catalog-mobile.png', fullPage: true });
  const box = await page.locator('.product-card-poster .product-image').first().boundingBox();
  expect(box!.width).toBeGreaterThan(300);
  expect(Math.abs(box!.width - box!.height)).toBeLessThan(1);
  await page.goto(product);
  const poster = page.locator('.gallery-poster img');
  await poster.evaluate((node) => node.decode());
  await expect(poster).toHaveCSS('object-fit', 'contain');
  await expect(page.locator('.specifications')).toContainText('1642');
  await expect(page.locator('.specifications')).toContainText('Система DRS и поршневая группа V6');
  await page.getByRole('button', { name: 'Увеличить деталь фотографии' }).click();
  await expect(page.getByRole('button', { name: 'Показать общий вид', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Показать общий вид', exact: true }).click();
  await expect(page.locator('.gallery-main.detail-view')).toHaveCount(0);
});

test('Botanical: шесть карточек, русскоязычный поиск и Pretty Pink без прежней заглушки', async ({
  page,
}) => {
  await page.goto('/catalog?category=botanical');
  await expect(page.locator('.product-card-poster')).toHaveCount(6);
  await expect(page.locator('.preliminary-price')).toHaveCount(0);
  for (const img of await page.locator('.product-card-poster .product-image img').all()) {
    await img.scrollIntoViewIfNeeded();
    await img.evaluate((node) => node.decode());
    expect(await img.evaluate((node) => [node.naturalWidth, node.naturalHeight])).toEqual([
      1254, 1254,
    ]);
    await expect(img).toHaveCSS('object-fit', 'contain');
  }
  await page.getByRole('searchbox').fill('орхидея');
  await expect(page.locator('.product-card h3')).toHaveText(['Orchid']);
  await page.getByRole('searchbox').fill('полевые цветы');
  await expect(page.locator('.product-card h3')).toHaveText(['Wildflower Bouquet']);
  await page.getByRole('searchbox').clear();
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({ path: `test-results/botanical-${width}-catalog.png`, fullPage: true });
  }
  await page.goto('/product/pink-peonies');
  await expect(page.locator('h1')).toHaveText('Pretty Pink Flower Bouquet');
  await expect(page.locator('.specifications')).toContainText('740+');
  await expect(page.locator('.detail-price')).toContainText(/9\s490/);
  await page.locator('.gallery-poster img').evaluate((node) => node.decode());
  await expect(page.locator('main')).not.toContainText(
    /Розовые пионы|Фотография готовится|Предварительная цена/,
  );
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: 'test-results/botanical-pretty-pink-mobile.png', fullPage: true });
  const a11y = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(a11y.violations.map((v) => v.id)).toEqual([]);
  await page.getByRole('button', { name: 'Добавить в корзину', exact: true }).click();
  await page.goto('/cart');
  await expect(page.locator('.cart-item')).toContainText('Pretty Pink Flower Bouquet');
  await expect(page.locator('.summary-total')).toContainText(/9\s490/);
});
