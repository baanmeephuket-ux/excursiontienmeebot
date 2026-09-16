const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}


/* =========================
   ОСНОВНЫЕ ЭКРАНЫ
========================= */

const home = document.getElementById("home");
const screens = document.querySelectorAll(".screen");

function show(id) {
  if (home) {
    home.style.display = id === "home" ? "block" : "none";
  }

  screens.forEach(screen => {
    screen.classList.toggle(
      "active",
      screen.id === id
    );
  });

  window.scrollTo(0, 0);
}


/* =========================
   НАЗВАНИЯ РАЗДЕЛОВ
========================= */

const titles = {
  fasttrack: "Fast Track",
  exchange: "Обмен валюты",
  business: "Консультации по бизнесу",
  orders: "Мои заказы",
  manager: "Связь с менеджером"
};


/* =========================
   КНОПКИ ГЛАВНОГО ЭКРАНА
========================= */

document
  .querySelectorAll("[data-open]")
  .forEach(button => {

    button.addEventListener("click", () => {

      const section =
        button.dataset.open;


      /* ЭКСКУРСИИ */

      if (section === "excursions") {
        show("excursions");
        return;
      }


      /* ТРАНСФЕР */

      if (section === "transfer") {

        const transferScreen =
          document.getElementById(
            "transferScreen"
          );

        const otherPlaceholder =
          document.getElementById(
            "otherPlaceholder"
          );

        if (transferScreen) {
          transferScreen.style.display =
            "block";
        }

        if (otherPlaceholder) {
          otherPlaceholder.style.display =
            "none";
        }

        show("placeholder");

        return;
      }


      /* ОСТАЛЬНЫЕ РАЗДЕЛЫ */

      const transferScreen =
        document.getElementById(
          "transferScreen"
        );

      const otherPlaceholder =
        document.getElementById(
          "otherPlaceholder"
        );

      if (transferScreen) {
        transferScreen.style.display =
          "none";
      }

      if (otherPlaceholder) {
        otherPlaceholder.style.display =
          "block";
      }

      const placeholderTitle =
        document.getElementById(
          "placeholderTitle"
        );

      if (placeholderTitle) {
        placeholderTitle.textContent =
          titles[section] || section;
      }

      show("placeholder");

    });

  });


/* =========================
   КНОПКИ НАЗАД НА ГЛАВНУЮ
========================= */

document
  .querySelectorAll("[data-home]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => show("home")
    );

  });


/* =========================
   НАЗАД ИЗ КАТЕГОРИИ
========================= */

const backButton =
  document.querySelector("[data-back]");

if (backButton) {

  backButton.addEventListener(
    "click",
    () => show("excursions")
  );

}


/* =========================
   ЭКСКУРСИИ
========================= */

const names = {
  sea: "Морские",
  land: "Сухопутные",
  boats: "Аренда лодок",
  private: "Приватные экскурсии"
};

document
  .querySelectorAll("[data-cat]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const catTitle =
          document.getElementById(
            "catTitle"
          );

        if (catTitle) {
          catTitle.textContent =
            names[button.dataset.cat] ||
            "Экскурсии";
        }

        show("category");

      }
    );

  });


/* =========================
   ЯЗЫК
   НЕ ЛОМАЕМ ПРИ ОТСУТСТВИИ КНОПКИ
========================= */

const langButton =
  document.getElementById("lang");

if (langButton) {

  langButton.addEventListener(
    "click",
    () => {
      alert(
        "English version подключим после утверждения структуры."
      );
    }
  );

}


/* =========================
   ТРАНСФЕР
========================= */

let transferDirection =
  "Аэропорт → Отель";


document
  .querySelectorAll(".direction")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".direction")
          .forEach(item => {
            item.classList.remove("active");
          });

        button.classList.add("active");

        transferDirection =
          button.dataset.direction;

      }
    );

  });


/* =========================
   ФОРМА ТРАНСФЕРА
========================= */

const transferForm =
  document.getElementById(
    "transferForm"
  );

const confirmation =
  document.getElementById(
    "transferConfirmation"
  );


if (transferForm) {

  transferForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const form =
        new FormData(transferForm);


      const telegramUser =
        tg?.initDataUnsafe?.user || {};


      const order = {

        type: "transfer",

        id:
          "TR-" +
          Date.now()
            .toString()
            .slice(-8),

        status:
          "Новый заказ",

        direction:
          transferDirection,

        date:
          form.get("date"),

        flightNumber:
          form.get("flightNumber"),

        arrivalTime:
          form.get("arrivalTime"),

        people:
          Number(
            form.get("people")
          ),

        suitcases:
          Number(
            form.get("suitcases")
          ),

        hotel:
          form.get("hotel"),

        phone:
          form.get("phone"),

        payment:
          "Оплата водителю по факту",

        telegramUsername:
          telegramUser.username
            ? "@" +
              telegramUser.username
            : "",

        telegramName:
          [
            telegramUser.first_name,
            telegramUser.last_name
          ]
            .filter(Boolean)
            .join(" "),

        telegramId:
          telegramUser.id || ""

      };


      /* СОХРАНЯЕМ ЗАКАЗ */

      const orders =
        JSON.parse(
          localStorage.getItem(
            "tienMeeOrders"
          ) || "[]"
        );

      orders.unshift(order);

      localStorage.setItem(
        "tienMeeOrders",
        JSON.stringify(orders)
      );


      /* ПОКАЗЫВАЕМ ПОДТВЕРЖДЕНИЕ */

      if (confirmation) {

        confirmation.hidden = false;

        confirmation.innerHTML = `

          <h2>✅ Заказ создан</h2>

          <p>
            Номер заказа:
            <strong>${order.id}</strong>
          </p>

          <p>
            Направление:
            <strong>${order.direction}</strong>
          </p>

          <p>
            Дата:
            <strong>${order.date}</strong>
          </p>

          <p>
            Рейс:
            <strong>${order.flightNumber}</strong>
          </p>

          <p>
            Время прилёта:
            <strong>${order.arrivalTime}</strong>
          </p>

          <p>
            Пассажиры:
            <strong>${order.people}</strong>
          </p>

          <p>
            Чемоданы:
            <strong>${order.suitcases}</strong>
          </p>

          <p>
            Отель:
            <strong>${order.hotel}</strong>
          </p>

          <p>
            Телефон:
            <strong>${order.phone}</strong>
          </p>

          <p>
            Оплата:
            <strong>
              водителю по факту
            </strong>
          </p>

          ${
            order.telegramUsername
              ? `
                <p>
                  Telegram:
                  <strong>
                    ${order.telegramUsername}
                  </strong>
                </p>
              `
              : ""
          }

          <p>
            Мы получили вашу заявку.
            Менеджер свяжется с вами
            для подтверждения трансфера.
          </p>

          <br>

          <button
            type="button"
            class="primary-button"
            id="newTransfer"
          >
            Создать ещё один заказ
          </button>

        `;

      }


      transferForm.hidden = true;


      /* НОВЫЙ ЗАКАЗ */

      const newTransfer =
        document.getElementById(
          "newTransfer"
        );

      if (newTransfer) {

        newTransfer.addEventListener(
          "click",
          () => {

            transferForm.reset();

            transferForm.hidden = false;

            if (confirmation) {
              confirmation.hidden = true;
              confirmation.innerHTML = "";
            }

            document
              .querySelectorAll(".direction")
              .forEach(button => {

                button.classList.toggle(
                  "active",
                  button.dataset.direction ===
                    "Аэропорт → Отель"
                );

              });

            transferDirection =
              "Аэропорт → Отель";

          }
        );

      }


      /* HAPTIC */

      if (tg?.HapticFeedback) {

        tg.HapticFeedback
          .notificationOccurred(
            "success"
          );

      }

    }
  );

}
