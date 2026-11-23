import { publicAsset } from '../lib/assets';
import { Link } from 'react-router-dom';
import { store } from '../data/store';
import { storeContactLinks, contactPhone, instagramHandle } from '../lib/store-links';
import { heroModel } from '../data/hero-model';
export function About() {
  return (
    <section className="container page-space info-intro">
      <p className="breadcrumb">Главная / О магазине</p>
      <h1>
        Увлечение
        <br />
        обретает форму.
      </h1>
      <div className="info-split">
        <p className="large-copy">
          Время, которое
          <br />
          вы посвящаете себе.
        </p>
        <div>
          <p>
            BRIXUM — магазин коллекционных конструкторов в Казахстане. Здесь встречаются два разных
            увлечения: автомобильная коллекция Formula 1 и цветочные композиции Botanical.
          </p>
          <p>
            Собрать из отдельных деталей целый мир — особое удовольствие. Разобраться в замысле,
            найти нужную форму и создать предмет, который хочется оставить рядом или подарить.
          </p>
          <p>
            Выберите модели в каталоге, проверьте корзину и подготовьте сообщение для WhatsApp.
            Наличие, доставку и оплату магазин подтверждает в переписке.
          </p>
          <Link to="/catalog" className="button button-red">
            Посмотреть коллекции
          </Link>
        </div>
      </div>
    </section>
  );
}
export function Delivery() {
  const links = storeContactLinks();
  return (
    <div className="container page-space info-intro">
      <p className="breadcrumb">Главная / Доставка и оплата</p>
      <h1>
        Детали
        <br />
        имеют значение.
      </h1>
      <div className="info-split">
        <div>
          <h2>Доставка и получение</h2>
          <p>
            {store.delivery ||
              'Способ, сроки и стоимость доставки согласуются с магазином после уточнения города получения.'}
          </p>
          <h2>Оплата</h2>
          <p>
            {store.payment ||
              'Способ оплаты и окончательная сумма согласуются до подтверждения заказа. Онлайн-оплата на сайте не предусмотрена.'}
          </p>
          <div className="info-panel">
            <h3>Как оформить заказ</h3>
            <ol>
              <li>Добавьте модели в корзину.</li>
              <li>Укажите город и пожелания к заказу.</li>
              <li>Проверьте состав и текст сообщения.</li>
              <li>Отправьте сообщение в WhatsApp и согласуйте наличие, доставку и оплату.</li>
            </ol>
            <p>
              Добавление в корзину и открытие WhatsApp не подтверждают заказ. Для товаров с пометкой
              «Уточнить наличие» сначала требуется ответ магазина.
            </p>
          </div>
        </div>
        <div>
          <h2>Контакты</h2>
          <dl className="contact-list">
            <div>
              <dt>Город</dt>
              <dd>{store.city}</dd>
            </div>
            {links.instagram && (
              <div>
                <dt>Instagram</dt>
                <dd>
                  <a href={links.instagram} target="_blank" rel="noopener noreferrer">
                    {instagramHandle(store.instagram) || 'Открыть Instagram'}
                  </a>
                </dd>
              </div>
            )}
            {links.whatsapp && (
              <div>
                <dt>WhatsApp</dt>
                <dd>
                  <a href={links.whatsapp} target="_blank" rel="noopener noreferrer">
                    {contactPhone(store.whatsapp) || 'Написать в WhatsApp'}
                  </a>
                </dd>
              </div>
            )}
            {store.email && (
              <div>
                <dt>Электронная почта</dt>
                <dd>
                  <a href={`mailto:${store.email}`}>{store.email}</a>
                </dd>
              </div>
            )}
            {store.address && (
              <div>
                <dt>Адрес</dt>
                <dd>{store.address}</dd>
              </div>
            )}
            {store.hours && (
              <div>
                <dt>Время работы</dt>
                <dd>{store.hours}</dd>
              </div>
            )}
          </dl>
          {!links.instagram && !links.whatsapp && (
            <p className="contact-pending">
              Контактные ссылки магазина будут добавлены. Вы можете сохранить выбранные модели в
              корзине и скопировать текст запроса при оформлении.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
export function Sources() {
  return (
    <div className="container page-space sources-page">
      <p className="breadcrumb">Главная / Материалы сайта</p>
      <h1>Внимание к деталям.</h1>
      <p className="large-copy">
        На сайте используется оригинальный SVG-логотип BRIXUM, предоставленный владельцем.
      </p>
      <p>
        Для всех одиннадцати моделей Formula 1 и Botanical используются промокарточки,
        предоставленные владельцем BRIXUM. Названия моделей, цены и характеристики перенесены из
        этих материалов. Изображения представлены как промокарточки, а не как фотографии съёмки
        магазина.
      </p>
      <p>
        Обложки разделов Formula 1 и Botanical созданы с помощью генерации изображений специально
        для BRIXUM. Это тематические иллюстрации мира конструкторов, а не фотографии конкретных
        товаров или комплектаций из каталога.
      </p>
      <h2>3D-модель на главной</h2>
      <p>
        <a href={heroModel.url} target="_blank" rel="noopener noreferrer">
          {heroModel.title} (42000-1)
        </a>{' '}
        — автор {heroModel.author}, подготовка файла OMR: technicbasics. Лицензия{' '}
        <a href={heroModel.licenseUrl} target="_blank" rel="noopener noreferrer">
          {heroModel.license}
        </a>
        . Геометрия деталей — авторы библиотеки{' '}
        <a href="https://library.ldraw.org/" target="_blank" rel="noopener noreferrer">
          LDraw.org
        </a>
        , CC BY 2.0 и{' '}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noopener noreferrer"
        >
          CC BY 4.0
        </a>{' '}
        согласно заголовкам отдельных файлов.
      </p>
      <p>
        Для сайта исходник переведён в GLB, геометрия объединена по материалам, линии сборочной
        схемы удалены. Формы деталей и исходные цвета сохранены. Это иллюстрация мира конструкторов,
        а не изображение конкретного товара из каталога BRIXUM.
      </p>
      <p>
        <a href={publicAsset('/models/grand-prix-sources.zip')} download>
          Исходники, авторы деталей и тексты лицензий
        </a>
      </p>
      <p>
        Названия команд и товарные знаки принадлежат их владельцам. Официальное лицензирование и
        партнёрство с производителями не заявляются.
      </p>
    </div>
  );
}
export function NotFound() {
  return (
    <div className="container empty-state">
      <h1>Здесь пока нет деталей</h1>
      <p>Страница не найдена. Начните с нашей коллекции.</p>
      <Link to="/catalog" className="button button-red">
        Открыть каталог
      </Link>
    </div>
  );
}
