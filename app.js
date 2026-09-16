const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}

const home = document.getElementById("home");
const screens = document.querySelectorAll(".screen");

const transferScreen =
  document.getElementById("transferScreen");

const businessConsultation =
  document.getElementById("businessConsultation");

const placeholderDefault =
  document.getElementById("placeholderDefault");

const placeholderTitle =
  document.getElementById("placeholderTitle");


/* =========================
   НАЗВАНИЯ РАЗДЕЛОВ
========================= */

const titles = {
  fasttrack: "Fast Track",
  exchange: "Обмен валюты",
  orders: "Мои заказы",
  manager: "Связь с менеджером"
};


/* =========================
   ПОКАЗ ЭКРАНА
========================= */

function show(id) {

  if (home) {
    home.style.display =
      id === "home" ? "block" : "none";
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
   СБРОС ВНУТРЕННИХ ЭКРАНОВ
========================= */

function resetPlaceholder() {

  if (transferScreen) {
    transferScreen.hidden = true;
  }

  if (businessConsultation) {
    businessConsultation.hidden = true;
  }

  if (placeholderDefault) {
    placeholderDefault.hidden = true;
  }

}


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

        resetPlaceholder();

        show("excursions");

        return;
      }


      /* ТРАНСФЕР */

      if (section === "transfer") {

        resetPlaceholder();

        if (transferScreen) {
          transferScreen.hidden = false;
        }

        show("placeholder");

        return;
      }


      /* КОНСУЛЬТАЦИЯ */

      if (section === "business") {

        resetPlaceholder();

        if (businessConsultation) {
          businessConsultation.hidden = false;
        }

        show("placeholder");

        return;
      }


      /* ОСТАЛЬНЫЕ РАЗДЕЛЫ */

      resetPlaceholder();

      if (placeholderTitle) {

        placeholderTitle.textContent =
          titles[section] || section;

      }

      if (placeholderDefault) {
        placeholderDefault.hidden = false;
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
      () => {

        resetPlaceholder();

        show("home");

      }
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
   ЯЗЫК
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
            names[
              button.dataset.cat
            ] || "Экскурсии";

        }

        show("category");

      }
    );

  });


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

            item.classList.remove(
              "active"
            );

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

const transferConfirmation =
  document.getElementById(
    "transferConfirmation"
  );


if (transferForm) {

  transferForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const form =
        new FormData(
          transferForm
        );


      const telegramUser =
        tg?.initDataUnsafe?.user || {};


      const order = {

        type:
          "transfer",

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
          form.get(
            "flightNumber"
          ),

        arrivalTime:
          form.get(
            "arrivalTime"
          ),

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


      /* ПОДТВЕРЖДЕНИЕ */

      if (transferConfirmation) {

        transferConfirmation.hidden =
          false;

        transferConfirmation.innerHTML = `

          <h3>✅ Заказ создан</h3>

          <p>
            <b>Номер:</b>
            ${order.id}
          </p>

          <p>
            <b>Направление:</b>
            ${order.direction}
          </p>

          <p>
            <b>Дата:</b>
            ${order.date}
          </p>

          <p>
            <b>Рейс:</b>
            ${order.flightNumber}
          </p>

          <p>
            <b>Время:</b>
            ${order.arrivalTime}
          </p>

          <p>
            <b>Пассажиры:</b>
            ${order.people}
          </p>

          <p>
            <b>Чемоданы:</b>
            ${order.suitcases}
          </p>

          <p>
            <b>Отель:</b>
            ${order.hotel}
          </p>

          <p>
            <b>Телефон:</b>
            ${order.phone}
          </p>

          <p>
            <b>Оплата:</b>
            водитель по факту
          </p>

          <p>
            Мы получили вашу заявку.
            Менеджер свяжется с вами
            для подтверждения трансфера.
          </p>

          <button
            type="button"
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

            transferForm.hidden =
              false;


            if (transferConfirmation) {

              transferConfirmation.hidden =
                true;

              transferConfirmation.innerHTML =
                "";

            }


            document
              .querySelectorAll(
                ".direction"
              )
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


      if (tg?.HapticFeedback) {

        tg.HapticFeedback
          .notificationOccurred(
            "success"
          );

      }

    }
  );

}


/* =========================
   КОНСУЛЬТАЦИЯ
========================= */

const businessForm =
  document.getElementById(
    "businessForm"
  );

const businessConfirmation =
  document.getElementById(
    "businessConfirmation"
  );


if (businessForm) {

  businessForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const form =
        new FormData(
          businessForm
        );


      const telegramUser =
        tg?.initDataUnsafe?.user || {};


      const order = {

        type:
          "business_consultation",

        id:
          "BC-" +
          Date.now()
            .toString()
            .slice(-8),

        status:
          "Ожидает оплаты",

        date:
          form.get("date"),

        time:
          form.get("time"),

        phone:
          form.get("phone"),

        question:
          form.get("question") || "",

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
          telegramUser.id || "",

        price:
          "10 000 ₽"

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


      /*
        Сейчас здесь только
        подготовка заявки.

        Реальную оплату подключим
        следующим этапом.
      */


      businessForm.hidden =
        true;


      if (businessConfirmation) {

        businessConfirmation.hidden =
          false;

        businessConfirmation.innerHTML = `

          <h3>📅 Заявка сохранена</h3>

          <p>
            <b>Номер заявки:</b>
            ${order.id}
          </p>

          <p>
            <b>Дата:</b>
            ${order.date}
          </p>

          <p>
            <b>Время:</b>
            ${order.time}
          </p>

          <p>
            <b>Стоимость:</b>
            10 000 ₽
          </p>

          <p>
            Следующий шаг —
            оплата консультации.
          </p>

          <p>
            <b>Контакты после оплаты:</b>
            <br>
            Telegram:
            @Spravkathailand
            <br>
            WhatsApp:
            +66 61 727 6406
          </p>

        `;

      }


      if (tg?.HapticFeedback) {

        tg.HapticFeedback
          .notificationOccurred(
            "success"
          );

      }

    }
  );

}
