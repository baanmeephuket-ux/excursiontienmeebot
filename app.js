const tg = window.Telegram?.WebApp;
const API_URL = "https://worker-production-07b7a.up.railway.app/api/order";

async function sendOrder(order) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...order,
        initData: tg?.initData || ""
      })
    });

    const result = await response.json();

   if (!response.ok || !result.ok) {
  throw new Error(
    `Ошибка ${response.status}: ${result.error || "Ошибка отправки"}`
  );
}

    return true;

  } catch (error) {
    console.error("Ошибка отправки заявки:", error);
    alert(error.message || "Не удалось отправить заявку.");
    return false;
  }
}
if (tg) {
  tg.ready();
  tg.expand();
}

const home = document.getElementById('home');
const screens = document.querySelectorAll('.screen');
const ordersList = document.getElementById('ordersList');
const titles = {
  excursions:'Экскурсии', fasttrack:'Fast Track', transfer:'Трансфер', cars:'Аренда авто',
  exchange:'Обмен валюты', realestate:'Недвижимость', business:'Консультация', orders:'Мои заказы', manager:'Связь с менеджером'
};

function show(id) {
  if (home) home.style.display = id === 'home' ? 'block' : 'none';
  screens.forEach(s => s.classList.toggle('active', s.id === id));
  if (id === 'orders') renderOrders();
  window.scrollTo(0,0);
}

function getTelegramUser() { return tg?.initDataUnsafe?.user || {}; }
function saveOrder(order) {
  const orders = JSON.parse(localStorage.getItem('tienMeeOrders') || '[]');
  orders.unshift(order); localStorage.setItem('tienMeeOrders', JSON.stringify(orders));
}
function makeId(prefix) { return prefix + '-' + Date.now().toString().slice(-8); }
function telegramData() {
  const u = getTelegramUser();
  return {
    telegramUsername: u.username ? '@'+u.username : '',
    telegramName: [u.first_name,u.last_name].filter(Boolean).join(' '),
    telegramId: u.id || ''
  };
}
function feedback() { if (tg?.HapticFeedback) tg.HapticFeedback.notificationOccurred('success'); }

// Навигация
function openSection(section) { show(section); }
document.querySelectorAll('[data-open]').forEach(btn => btn.addEventListener('click', () => openSection(btn.dataset.open)));
document.querySelectorAll('[data-home]').forEach(btn => btn.addEventListener('click', () => show('home')));
const backButton = document.querySelector('[data-back]');
if (backButton) backButton.addEventListener('click', () => show('excursions'));
const langButton = document.getElementById('lang');
if (langButton) langButton.addEventListener('click', () => alert('English version подключим после утверждения структуры.'));

// Экскурсии
const names = {sea:'Морские',land:'Сухопутные',boats:'Аренда лодок',private:'Приватные экскурсии'};
document.querySelectorAll('[data-cat]').forEach(btn => btn.addEventListener('click', () => {
  document.getElementById('catTitle').textContent = names[btn.dataset.cat] || 'Экскурсии';
  show('category');
}));

// Трансфер
let transferDirection = 'Аэропорт → Отель';
document.querySelectorAll('.direction').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.direction').forEach(x => x.classList.remove('active'));
  btn.classList.add('active'); transferDirection = btn.dataset.direction;
}));
const transferForm = document.getElementById('transferForm');
if (transferForm) transferForm.addEventListener('submit', async e=>{
  e.preventDefault(); const f = new FormData(transferForm); const order = {
    type:'transfer', id:makeId('TR'), status:'Новая заявка', direction:transferDirection,
    date:f.get('date'), flightNumber:f.get('flightNumber'), arrivalTime:f.get('arrivalTime'),
    people:Number(f.get('people')), suitcases:Number(f.get('suitcases')), hotel:f.get('hotel'), phone:f.get('phone'),
    payment: Наличными — водителю при встрече <p>
    <p>Заранее — перевод в рублях <p>
  ', ...telegramData()
  }; 

const sent = await sendOrder(order);

if (!sent) return;

saveOrder(order);
transferForm.hidden=true;
  document.getElementById('transferConfirmation').hidden=false;
  document.getElementById('transferConfirmation').innerHTML=`<h3>✅ Заявка отправлена</h3><p><b>Номер:</b> ${order.id}</p><p><b>Направление:</b> ${order.direction}</p><p><b>Дата:</b> ${order.date}</p><p><b>Рейс:</b> ${order.flightNumber}</p><p><b>Время:</b> ${order.arrivalTime}</p><p><b>Пассажиры:</b> ${order.people}</p><p><b>Чемоданы:</b> ${order.suitcases}</p><p><b>Отель:</b> ${order.hotel}</p><p><b>Оплата:</b> способ оплаты будет подтверждён менеджером.</p><p> Оставьте детали поездки-мы проверим наличие свободного автомобиля и сообщим стоимость.</p><button type="button" id="newTransfer">Создать ещё одну заявку</button>`;
  document.getElementById('newTransfer').onclick=()=>{ transferForm.reset(); transferForm.hidden=false; document.getElementById('transferConfirmation').hidden=true; document.querySelectorAll('.direction').forEach(x=>x.classList.toggle('active',x.dataset.direction==='Аэропорт → Отель')); transferDirection='Аэропорт → Отель'; };
  feedback();
});

// Аренда авто
let delivery = 'Аэропорт';
document.querySelectorAll('.choice').forEach(btn => btn.addEventListener('click',()=>{document.querySelectorAll('.choice').forEach(x=>x.classList.remove('active'));btn.classList.add('active');delivery=btn.dataset.delivery;}));
const carForm=document.getElementById('carForm');
if(carForm) carForm.addEventListener('submit',async e=>{
  e.preventDefault();

const f=new FormData(carForm);

const order={
  type:'car',
  id:makeId('CAR'),
  status:'Новая заявка',
  startDate:f.get('startDate'),
  endDate:f.get('endDate'),
  delivery,
  location:f.get('location'),
  carType:f.get('carType'),
  people:Number(f.get('people')),
  phone:f.get('phone'),
  comment:f.get('comment')||'',
  ...telegramData()
};

const sent=await sendOrder(order);

if(!sent)return;

saveOrder(order);
carForm.hidden=true;
  const box=document.getElementById('carConfirmation'); box.hidden=false; box.innerHTML=`<h3>✅ Заявка отправлена</h3><p><b>Номер:</b> ${order.id}</p><p>Мы проверим наличие автомобилей и свяжемся с вами с подходящими вариантами.</p><button type="button" id="newCar">Создать ещё одну заявку</button>`;
  document.getElementById('newCar').onclick=()=>{carForm.reset();carForm.hidden=false;box.hidden=true;}; feedback();
});

// Недвижимость
const realEstateForm=document.getElementById('realEstateForm');

if(realEstateForm) realEstateForm.addEventListener('submit',async e=>{
  e.preventDefault();

  const f=new FormData(realEstateForm);

  const order={
    type:'property',
    id:makeId('RE'),
    status:'Новая заявка',
    budget:f.get('budget'),
    propertyType:f.get('propertyType'),
    bedrooms:f.get('bedrooms'),
    purpose:f.get('purpose'),
    statusOnPhuket:f.get('status'),
    arrivalDate:f.get('arrivalDate')||'',
    phone:f.get('phone'),
    ...telegramData()
  };

  const sent=await sendOrder(order);

  if(!sent)return;

  saveOrder(order);
  realEstateForm.hidden=true;

  const box=document.getElementById('realEstateConfirmation');
  box.hidden=false;

  box.innerHTML=`
    <h3>✅ Заявка отправлена</h3>
    <p><b>Номер:</b> ${order.id}</p>
    <p>Мы получили ваш запрос. Менеджер свяжется с вами и подберёт подходящие варианты.</p>
    <button type="button" id="newRE">Создать ещё одну заявку</button>
  `;

  document.getElementById('newRE').onclick=()=>{
    realEstateForm.reset();
    realEstateForm.hidden=false;
    box.hidden=true;
  };

  feedback();
});

// Консультация
async function prepareReceipt(file) {
  if (!file) return '';

  if (!file.type.startsWith('image/')) {
    throw new Error('Чек нужно прикрепить изображением.');
  }

  return await new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const maxSide = 1600;

        const scale = Math.min(
          1,
          maxSide / Math.max(img.width, img.height)
        );

        const canvas = document.createElement('canvas');

        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        const ctx = canvas.getContext('2d');

        ctx.drawImage(
          img,
          0,
          0,
          canvas.width,
          canvas.height
        );

        resolve(
          canvas.toDataURL('image/png', 0.82)
        );
      };

      img.onerror = () => {
        reject(
          new Error('Не удалось прочитать чек.')
        );
      };

      img.src = reader.result;
    };

    reader.onerror = () => {
      reject(
        new Error('Не удалось загрузить чек.')
      );
    };

    reader.readAsDataURL(file);
  });
}

const businessForm =
  document.getElementById('businessForm');

if (businessForm) {

  businessForm.addEventListener(
    'submit',
    async e => {

      e.preventDefault();

      const f = new FormData(businessForm);

      const receiptFile =
        f.get('receipt');

      if (
        !receiptFile ||
        !receiptFile.size
      ) {
        alert(
          'Пожалуйста, прикрепите чек об оплате.'
        );
        return;
      }

      const submitButton =
        businessForm.querySelector(
          'button[type="submit"]'
        );

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent =
          'Отправляем заявку…';
      }

      try {

        const receiptData =
          await prepareReceipt(receiptFile);

        const order = {

          type:
            'business_consultation',

          id:
            makeId('BC'),

          date:
            f.get('date'),

          time:
            f.get('time'),

          phone:
            f.get('phone'),

          question:
            f.get('question') || '',

          price:
            '10 000 ₽',

          payment:
            'Сбербанк · +7 910 090-46-35 · Елена Валерьевна Ф.',

          consultantPhone:
            '+66 617 276 406' Елена,

          consultantTelegram:
            '@Spravkathailand',

          receiptData,

          ...telegramData()
        };

        const sent =
          await sendOrder(order);

        if (!sent) return;

        saveOrder({
          ...order,
          receiptData: ''
        });

        businessForm.hidden = true;

        const box =
          document.getElementById(
            'businessConfirmation'
          );

        box.hidden = false;

        box.innerHTML = `

          <h3>
            ✅ Спасибо!
          </h3>

          <p>
            Заявка и чек получены.
          </p>

          <p>
            Мы проверим оплату и
            свяжемся с вами в выбранное
            время.
          </p>

          <p>
            <b>Контакт консультанта:</b>
            <br>
            WhatsApp:
            +66 617 276 406
            <br>
            Telegram:
            @Spravkathailand
          </p>

        `;

        feedback();

      } catch (error) {

        console.error(error);

        alert(
          error.message ||
          'Не удалось отправить чек.'
        );

        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent =
            'Отправить заявку · 10 000 ₽';
        }
      }
    }
  );
}

// FAST TRACK
const fastTrackForm = document.getElementById('fastTrackForm');

if (fastTrackForm) fastTrackForm.addEventListener('submit', async e => {
  e.preventDefault();

  const f = new FormData(fastTrackForm);

  const order = {
    type: 'fasttrack',
    id: makeId('FT'),
    status: 'Новая заявка',
    service: 'Fast Track',
    date: f.get('date'),
    time: f.get('time'),
    people: Number(f.get('people')),
    price: 'от 1 500 THB',
    payment: 'Баты / Рубли / USDT',
    passportRequired: 'Паспорта всех пассажиров',
    ...telegramData()
  };

  const sent = await sendOrder(order);

  if (!sent) return;

  saveOrder(order);

  fastTrackForm.hidden = true;

  const box = document.getElementById('fastTrackConfirmation');
  box.hidden = false;

  box.innerHTML = `
    <h3>✅ Заявка отправлена</h3>
    <p><b>Номер:</b> ${order.id}</p>
    <p><b>Дата прилёта:</b> ${order.date}</p>
    <p><b>Время:</b> ${order.time}</p>
    <p><b>Количество человек:</b> ${order.people}</p>
    <p>Ваша заявка принята.Мы свяжемся с вами в Telegram и запросим паспорта всех пассажиров. Проверим данные, уточним стоимость Fast Track и сообщим вам итоговую сумму</p>
    </p>После подтверждения стоимости вы производите оплату, и мы оформляем услугу</p>
    <button type="button" id="newFastTrack">
      Создать ещё одну заявку
    </button>
  `;

  document.getElementById('newFastTrack').onclick = () => {
    fastTrackForm.reset();
    fastTrackForm.hidden = false;
    box.hidden = true;
  };

  feedback();
});
// Быстрые заявки
function simpleRequest(type, label) {
  const order = {
    type: type,
    id: makeId(type === 'fasttrack' ? 'FT' : 'EX'),
    status: 'Новая заявка',
    service: label,
    ...telegramData()
  };

  saveOrder(order);

  alert('✅ Заявка отправлена. Менеджер свяжется с вами для уточнения деталей.');

  feedback();
}
document.querySelectorAll('[data-contact-request]').forEach(btn =>
  btn.addEventListener(
    'click',
    () => simpleRequest(
      btn.dataset.contactRequest,
      btn.dataset.contactRequest === 'fasttrack'
        ? 'Fast Track'
        : 'Обмен валюты'
    )
  )
);

// Мои заказы
function renderOrders(){
  if(!ordersList)return;

  const orders = JSON.parse(
    localStorage.getItem('tienMeeOrders') || '[]'
  );

  if(!orders.length){
    ordersList.innerHTML = `
      <div class="empty">
        <span>📋</span>
        <b>Пока нет заявок</b>
        <small>Ваши заявки и бронирования появятся здесь.</small>
      </div>`;
    return;
  }

  ordersList.innerHTML = orders.map(o => {
    let title = {
      transfer:'🚕 Трансфер',
      car_rental:'🚗 Аренда авто',
      real_estate_purchase:'🏠 Недвижимость',
      business_consultation:'💼 Консультация',
      fasttrack:'✈️ Fast Track',
      exchange:'💱 Обмен валюты'
    }[o.type] || 'Заявка';

    return `
      <div class="order-card">
        <b>${title}</b>
        <span>${o.id}</span>
        ${o.status ? `<small>${o.status}</small>` : ''}
        <em>${o.date || o.startDate || ''}</em>
      </div>
    `;
  }).join('');
}

// Старт
show('home');
