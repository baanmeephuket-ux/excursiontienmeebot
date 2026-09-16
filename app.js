const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}

const screens = document.querySelectorAll(".screen");
const home = document.getElementById("home");

function show(id) {
  home.style.display = id === "home" ? "block" : "none";

  screens.forEach(screen => {
    screen.classList.toggle("active", screen.id === id);
  });

  window.scrollTo(0, 0);
}

const otherTitles = {
  fasttrack: "Fast Track",
  exchange: "Обмен валюты",
  business: "Консультации по бизнесу",
  orders: "Мои заказы",
  manager: "Связь с менеджером"
};

document.querySelectorAll("[data-open]").forEach(button => {
  button.onclick = () => {
    const section = button.dataset.open;

    if (section === "excursions") {
      show("excursions");
      return;
    }

    if (section === "transfer") {
      document.getElementById("transferScreen").style.display = "block";
      document.getElementById("otherPlaceholder").style.display = "none";
      show("placeholder");
      return;
    }

    document.getElementById("transferScreen").style.display = "none";
    document.getElementById("otherPlaceholder").style.display = "block";

    document.getElementById("placeholderTitle").textContent =
      otherTitles[section] || section;

    show("placeholder");
  };
});

document.querySelectorAll("[data-home]").forEach(button => {
  button.onclick = () => show("home");
});

document.querySelector("[data-back]").onclick = () => {
  show("excursions");
};

const categoryNames = {
  sea: "Морские",
  land: "Сухопутные",
  boats: "Аренда лодок",
  private: "Приватные экскурсии"
};

document.querySelectorAll("[data-cat]").forEach(button => {
  button.onclick = () => {
    document.getElementById("catTitle").textContent =
      categoryNames[button.dataset.cat];

    show("category");
  };
});

document.getElementById("lang").onclick = () => {
  alert("English version подключим после утверждения структуры.");
};


/* =========================
   ТРАНСФЕР
========================= */

let transferDirection = "Аэропорт → Отель";

document.querySelectorAll(".transfer-direction").forEach(button => {
  button.addEventListener("click", () => {

    document
      .querySelectorAll(".transfer-direction")
      .forEach(item => item.classList.remove("active"));

    button.classList.add("active");

    transferDirection = button.dataset.direction;
  });
});


const transferForm = document.getElementById("transferForm");
const confirmation = document.getElementById("transferConfirmation");


transferForm.addEventListener("submit", event => {

  event.preventDefault();

  const form = new FormData(transferForm);

  const telegramUser =
    tg?.initDataUnsafe?.user || {};

  const order = {

    type: "transfer",

    id:
      "TR-" +
      Date.now()
        .toString()
        .slice(-8),

    status: "Новый заказ",

    direction:
      transferDirection,

    date:
      form.get("date"),

    flightNumber:
      form.get("flightNumber"),

    arrivalTime:
      form.get("arrivalTime"),

    people:
      Number(form.get("people")),

    suitcases:
      Number(form.get("suitcases")),

    hotel:
      form.get("hotel"),

    phone:
      form.get("phone"),

    payment:
      "Оплата водителю по факту",

    telegramUsername:
      telegramUser.username
        ? "@" + telegramUser.username
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


  /* Сохраняем заказ */
  const orders =
    JSON.parse(
      localStorage.getItem("tienMeeOrders") || "[]"
    );

  orders.unshift(order);

  localStorage.setItem(
    "tienMeeOrders",
    JSON.stringify(orders)
  );


  /* Показываем подтверждение */
  confirmation.hidden = false;

  confirmation.innerHTML = `

    <b>✅ Заказ создан</b>

    <br><br>

    Номер заказа:
    <strong>${order.id}</strong>

    <br>

    Направление:
    ${order.direction}

    <br>

    Дата:
    ${order.date}

    <br>

    Рейс:
    ${order.flightNumber}

    <br>

    Время прилёта:
    ${order.arrivalTime}

    <br>

    Пассажиры:
    ${order.people}

    <br>

    Чемоданы:
    ${order.suitcases}

    <br>

    Отель:
    ${order.hotel}

    <br>

    Телефон:
    ${order.phone}

    <br>

    Оплата:
    <strong>водителю по факту</strong>

    ${
      order.telegramUsername
        ? `<br>Telegram: ${order.telegramUsername}`
        : ""
    }

    <br><br>

    <span>
      Мы получили вашу заявку.
      Менеджер свяжется с вами для подтверждения трансфера.
    </span>

    <br><br>

    <button
      type="button"
      id="newTransfer">
      Создать ещё один заказ
    </button>

  `;


  transferForm.hidden = true;


  document
    .getElementById("newTransfer")
    .onclick = () => {

      transferForm.reset();

      transferForm.hidden = false;

      confirmation.hidden = true;

      document
        .querySelectorAll(".transfer-direction")
        .forEach(button => {

          button.classList.toggle(
            "active",
            button.dataset.direction ===
              "Аэропорт → Отель"
          );

        });

      transferDirection =
        "Аэропорт → Отель";
    };


  if (tg?.HapticFeedback) {

    tg.HapticFeedback
      .notificationOccurred("success");

  }

});
