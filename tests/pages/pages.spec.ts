import { test, expect } from '@playwright/test';

test('Pages build: assets, 3D, navigation, refresh, cart and WhatsApp', async ({
  page,
  baseURL,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
  const response = await page.goto(baseURL!);
  expect(response?.status()).toBe(200);
  await expect(page.locator('.hero-race-car canvas')).toHaveAttribute('data-model-ready', 'true', {
    timeout: 20000,
  });
  await page.getByRole('button', { name: 'Приостановить вращение модели' }).click();
  for (const image of await page.locator('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate((node) => node.decode());
    expect(new URL((await image.getAttribute('src'))!, baseURL).pathname).toMatch(/^\/brixum\//);
  }
  await page.locator('.category-formula-1').click();
  await expect(page).toHaveURL(/#\/catalog\?category=formula-1/);
  await expect(page.locator('.product-card')).toHaveCount(5);
  await page.getByRole('link', { name: 'Подробнее: Mercedes-AMG F1 W14 E Performance' }).click();
  await page.reload();
  await expect(page.locator('h1')).toHaveText('Mercedes-AMG F1 W14 E Performance');
  await page.getByRole('button', { name: 'Добавить в корзину', exact: true }).click();
  await page.goto(new URL('#/cart', baseURL!).href);
  await expect(page.locator('.summary-total')).toContainText(/18\s000/);
  await page.reload();
  await expect(page.locator('.cart-item')).toHaveCount(1);
  await page.getByRole('link', { name: 'Перейти к оформлению' }).click();
  await page.getByLabel('Город', { exact: false }).fill('Астана');
  await page.getByRole('checkbox', { name: /Согласен передать/ }).check();
  await page.getByRole('button', { name: 'Проверить сообщение заказа' }).click();
  const href = (await page
    .getByRole('link', { name: 'Открыть WhatsApp', exact: true })
    .getAttribute('href'))!;
  expect(new URL(href).pathname).toBe('/77476502456');
  expect(new URL(href).searchParams.get('text')).toBe(
    await page.locator('#order-message').inputValue(),
  );
  await page.goto(new URL('#/sources', baseURL!).href);
  const download = page.locator('a[download]');
  expect(
    (
      await page.request.head(new URL((await download.getAttribute('href'))!, baseURL!).href)
    ).status(),
  ).toBe(200);
  await page.goto(new URL('#/', baseURL!).href);
  await page.reload();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'К содержимому' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await expect(page).not.toHaveURL(/#main$/);
  expect(errors).toEqual([]);
  await page.screenshot({ path: 'test-results/pages-home.png', fullPage: true });
});
