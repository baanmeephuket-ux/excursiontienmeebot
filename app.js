<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, viewport-fit=cover"
  >

  <meta name="theme-color" content="#5F7658">

  <title>Tien Mee Phuket</title>

  <link rel="stylesheet" href="styles.css">

  <script src="https://telegram.org/js/telegram-web-app.js"></script>
</head>

<body>

<div id="app">


  <!-- =========================
       ГЛАВНЫЙ ЭКРАН
  ========================== -->

  <main id="home">

    <section class="hero">

      <h1 class="hero-title">
        your way
      </h1>

      <p>
        Отдыхайте, путешествуйте<br>
        и решайте всё в одном месте
      </p>

    </section>


    <div class="section-header">

      <h2>
        Сервисы Tien Mee
      </h2>

      <span>
        Выберите нужное
      </span>

    </div>


    <section class="services">


      <!-- ЭКСКУРСИИ -->

      <button
        class="service-card full"
        data-open="excursions"
        type="button"
      >

        <div class="service-icon">
          🌴
        </div>

        <div class="service-content">

          <h3>
            Экскурсии
          </h3>

          <p>
            Морские · сухопутные · private
          </p>

        </div>

        <div class="service-arrow">
          ›
        </div>

      </button>


      <!-- FAST TRACK -->

      <button
        class="service-card"
        data-open="fasttrack"
        type="button"
      >

        <div class="service-icon">
          ✈️
        </div>

        <div class="service-content">

          <h3>
            Fast Track
          </h3>

          <p>
            Быстро пройти аэропорт
          </p>

        </div>

        <div class="service-arrow">
          ›
        </div>

      </button>


      <!-- ТРАНСФЕР -->

      <button
        class="service-card"
        data-open="transfer"
        type="button"
      >

        <div class="service-icon">
          🚕
        </div>

        <div class="service-content">

          <h3>
            Трансфер
          </h3>

          <p>
            Аэропорт ↔ отель
          </p>

        </div>

        <div class="service-arrow">
          ›
        </div>

      </button>


      <!-- ОБМЕН -->

      <button
        class="service-card"
        data-open="exchange"
        type="button"
      >

        <div class="service-icon">
          💱
        </div>

        <div class="service-content">

          <h3>
            Обмен валюты
          </h3>

          <p>
            Удобно и безопасно
          </p>

        </div>

        <div class="service-arrow">
          ›
        </div>

      </button>


      <!-- ЗАКАЗЫ -->

      <button
        class="service-card"
        data-open="orders"
        type="button"
      >

        <div class="service-icon">
          📋
        </div>

        <div class="service-content">

          <h3>
            Мои заказы
          </h3>

          <p>
            Ваши бронирования
          </p>

        </div>

        <div class="service-arrow">
          ›
        </div>

      </button>


      <!-- БИЗНЕС -->

      <button
        class="service-card full"
        data-open="business"
        type="button"
      >

        <div class="service-icon">
          💼
        </div>

        <div class="service-content">

          <h3>
            Консультации по бизнесу
          </h3>

          <p>
            Бизнес в Таиланде и на Пхукете
          </p>

        </div>

        <div class="service-arrow">
          ›
        </div>

      </button>


      <!-- МЕНЕДЖЕР -->

      <button
        class="service-card full manager"
        data-open="manager"
        type="button"
      >

        <div class="service-icon">
          👩🏻‍💼
        </div>

        <div class="service-content">

          <h3>
            Алина — ваш менеджер
          </h3>

          <p>
            Помогу с вопросами и заказами
          </p>

        </div>

        <div class="service-arrow">
          ›
        </div>

      </button>

    </section>


    <footer class="footer">

      <span>
        Made with 🌴 in Phuket
      </span>

    </footer>

  </main>



  <!-- =========================
       ЭКСКУРСИИ
  ========================== -->

  <section
    id="excursions"
    class="screen"
  >

    <div class="page">

      <div class="page-header">

        <button
          class="back-button"
          data-home
          type="button"
        >
          ‹
        </button>

        <h1 class="page-title">
          Экскурсии
        </h1>

      </div>


      <div class="category-grid">


        <button
          class="category-card"
          data-cat="sea"
          type="button"
        >

          <span class="emoji">
            🏝️
          </span>

          <strong>
            Морские
          </strong>

        </button>


        <button
          class="category-card"
          data-cat="land"
          type="button"
        >

          <span class="emoji">
            🌿
          </span>

          <strong>
            Сухопутные
          </strong>

        </button>


        <button
          class="category-card"
          data-cat="boats"
          type="button"
        >

          <span class="emoji">
            🛥️
          </span>

          <strong>
            Аренда лодок
          </strong>

        </button>


        <button
          class="category-card"
          data-cat="private"
          type="button"
        >

          <span class="emoji">
            ✨
          </span>

          <strong>
            Приватные
          </strong>

        </button>

      </div>

    </div>

  </section>



  <!-- =========================
       КАТЕГОРИЯ ЭКСКУРСИЙ
  ========================== -->

  <section
    id="category"
    class="screen"
  >

    <div class="page">

      <div class="page-header">

        <button
          class="back-button"
          data-back
          type="button"
        >
          ‹
        </button>

        <h1
          id="catTitle"
          class="page-title"
        >
          Морские
        </h1>

      </div>


      <div class="excursion-list">


        <article class="excursion-card">

          <div
            class="excursion-photo"
            style="
              background:
              linear-gradient(
                135deg,
                #9fbba1,
                #dfe9d9
              );
            "
          ></div>

          <div class="excursion-body">

            <h3>
              Пхи-Пхи
            </h3>

            <p>
              Один из самых красивых островных маршрутов
              вокруг Пхукета.
            </p>

            <div class="excursion-meta">

              <span class="meta-item">
                🕐 1 день
              </span>

              <span class="meta-item">
                🚤 Катер
              </span>

            </div>

            <button
              class="primary-button"
              type="button"
            >
              Выбрать
            </button>

          </div>

        </article>


        <article class="excursion-card">

          <div
            class="excursion-photo"
            style="
              background:
              linear-gradient(
                135deg,
                #b9c9ae,
                #eef0df
              );
            "
          ></div>

          <div class="excursion-body">

            <h3>
              Симиланы
            </h3>

            <p>
              Белый песок, бирюзовая вода
              и острова национального парка.
            </p>

            <div class="excursion-meta">

              <span class="meta-item">
                🕐 1 день
              </span>

              <span class="meta-item">
                🚤 Катер
              </span>

            </div>

            <button
              class="primary-button"
              type="button"
            >
              Выбрать
            </button>

          </div>

        </article>


        <article class="excursion-card">

          <div
            class="excursion-photo"
            style="
              background:
              linear-gradient(
                135deg,
                #8fb7a8,
                #e3eadb
              );
            "
          ></div>

          <div class="excursion-body">

            <h3>
              Coral Island
            </h3>

            <p>
              Тёплое море, пляж и спокойный
              островной отдых.
            </p>

            <div class="excursion-meta">

              <span class="meta-item">
                🕐 1 день
              </span>

              <span class="meta-item">
                🏝️ Остров
              </span>

            </div>

            <button
              class="primary-button"
              type="button"
            >
              Выбрать
            </button>

          </div>

        </article>

      </div>

    </div>

  </section>



  <!-- =========================
       ОБЩИЕ ЭКРАНЫ
  ========================== -->

  <section
    id="placeholder"
    class="screen"
  >

    <div class="placeholder">

      <button
        class="back-button"
        data-home
        type="button"
      >
        ‹
      </button>

      <div
        id="otherPlaceholder"
        class="placeholder-card"
        style="margin-top:20px;"
      >

        <h1 id="placeholderTitle">
          Раздел
        </h1>

        <p>
          Этот раздел скоро будет доступен.
        </p>

      </div>


      <!-- =====================
           ТРАНСФЕР
      ====================== -->

      <div
        id="transferScreen"
        class="transfer-screen"
        style="display:none;"
      >

        <div class="transfer-header">

          <h1>
            Трансфер
          </h1>

          <p>
            Встреча в аэропорту или поездка
            из отеля в аэропорт
          </p>

        </div>


        <div class="direction-switch">

          <button
            class="direction active"
            data-direction="Аэропорт → Отель"
            type="button"
          >
            ✈️ Аэропорт → Отель
          </button>

          <button
            class="direction"
            data-direction="Отель → Аэропорт"
            type="button"
          >
            🏨 Отель → Аэропорт
          </button>

        </div>


        <form
          id="transferForm"
          class="transfer-form"
        >


          <div class="form-group">

            <label for="date">
              Дата
            </label>

            <input
              id="date"
              name="date"
              type="date"
              required
            >

          </div>


          <div class="form-group">

            <label for="flightNumber">
              Номер рейса
            </label>

            <input
              id="flightNumber"
              name="flightNumber"
              type="text"
              placeholder="Например, SU 274"
              autocomplete="off"
              required
            >

          </div>


          <div class="form-group">

            <label for="arrivalTime">
              Время прилёта
            </label>

            <input
              id="arrivalTime"
              name="arrivalTime"
              type="time"
              required
            >

          </div>


          <div class="form-row">


            <div class="form-group">

              <label for="people">
                Пассажиры
              </label>

              <input
                id="people"
                name="people"
                type="number"
                min="1"
                value="1"
                required
              >

            </div>


            <div class="form-group">

              <label for="suitcases">
                Чемоданы
              </label>

              <input
                id="suitcases"
                name="suitcases"
                type="number"
                min="0"
                value="1"
                required
              >

            </div>


          </div>


          <div class="form-group">

            <label for="hotel">
              Название отеля
            </label>

            <input
              id="hotel"
              name="hotel"
              type="text"
              placeholder="Введите название отеля"
              autocomplete="organization"
              required
            >

          </div>


          <div class="form-group">

            <label for="phone">
              Номер телефона
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+66 ..."
              autocomplete="tel"
              required
            >

          </div>


          <div class="payment-note">

            <strong>
              💳 Оплата
            </strong>

            Оплата водителю по факту.
            Стоимость трансфера сообщит менеджер
            после подтверждения заявки.

          </div>


          <button
            class="primary-button"
            type="submit"
          >
            Заказать трансфер
          </button>


        </form>


        <div
          id="transferConfirmation"
          class="transfer-confirmation"
          hidden
        ></div>

      </div>

    </div>

  </section>



</div>


<script src="app.js"></script>

</body>
</html>
