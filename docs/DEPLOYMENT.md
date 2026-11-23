# GitHub Pages

Сайт: https://syron11.github.io/brixum/

Каталог: https://syron11.github.io/brixum/#/catalog

## Сборка

Для GitHub Pages используются `VITE_BASE_PATH=/brixum/` и `VITE_ROUTER_MODE=hash`. Это обеспечивает работу изображений и прямых ссылок на страницы внутри репозитория.

```sh
npm ci
npm run lint
npm test
npm run build:pages
npm run test:pages
```

Локальный `npm run dev` использует обычные маршруты без `#`. Для размещения в корне домена доступна стандартная сборка `npm run build`; серверу требуется SPA fallback.

## Автоматическое обновление

Workflow `.github/workflows/pages.yml` собирает и публикует ветку `main`. В Settings → Pages выберите GitHub Actions. Зависимости устанавливаются через `npm ci`; пользовательские ключи для публикации не требуются.

После изменения файлов отправьте коммит в `main` и дождитесь успешного workflow Deploy BRIXUM to GitHub Pages.

Проверка опубликованного сайта:

```sh
PAGES_URL=https://syron11.github.io/brixum/ npm run test:pages
```

Сценарий проверяет изображения, 3D-модель, навигацию, сохранение корзины, состав WhatsApp-сообщения и клавиатурный переход к содержимому. Сообщения не отправляются.
