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

if (transferForm) transferForm.addEventListener('submit', async e => {
  e.preventDefault();

  const f = new FormData(fastTrackForm);

  const order = {
    type: 'transfer',
    id: makeId('TR'),
    status: 'Новая заявка',
    direction: transferDirection,
    date: f.get('date'),
    flightNumber: f.get('flightNumber'),
    arrivalTime: f.get('arrivalTime'),
    people: Number(f.get('people')),
    suitcases: Number(f.get('suitcases')),
    hotel: f.get('hotel'),
    phone: f.get('phone'),
    payment: 'Наличными — водителю при встрече / Заранее — перевод в рублях',
    ...telegramData()
  };

  const sent = await sendOrder(order);

  if (!sent) return;

  saveOrder(order);

  transferForm.hidden = true;

  document.getElementById('transferConfirmation').hidden = false;

  document.getElementById('transferConfirmation').innerHTML = `
    <h3>✅ Заявка отправлена</h3>
    <p><b>Номер:</b> ${order.id}</p>
    <p><b>Направление:</b> ${order.direction}</p>
    <p><b>Дата:</b> ${order.date}</p>
    <p><b>Рейс:</b> ${order.flightNumber}</p>
    <p><b>Время:</b> ${order.arrivalTime}</p>
    <p><b>Пассажиры:</b> ${order.people}</p>
    <p><b>Чемоданы:</b> ${order.suitcases}</p>
    <p><b>Отель:</b> ${order.hotel}</p>
    <p><b>Оплата:</b> наличными водителю при встрече или заранее переводом в рублях.</p>
    <p>Мы проверим доступность автомобиля, уточним стоимость и свяжемся с вами для подтверждения поездки.</p>
    <button type="button" id="newTransfer">Создать ещё одну заявку</button>
  `;

  document.getElementById('newTransfer').onclick = () => {
    transferForm.reset();
    transferForm.hidden = false;
    document.getElementById('transferConfirmation').hidden = true;

    document
      .querySelectorAll('.direction')
      .forEach(x =>
        x.classList.toggle(
          'active',
          x.dataset.direction === 'Аэропорт → Отель'
        )
      );

    transferDirection = 'Аэропорт → Отель';
  };

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
  const box=document.getElementById('carConfirmation'); box.hidden=false; box.innerHTML=`<h3>✅ Заявка отправлена</h3><p><b>Номер:</b> ${order.id}</p><p>Мы проверим наличие автомобилей и свяжемся с вами</p><button type="button" id="newCar">Создать ещё одну заявку</button>`;
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
            '+66 617 276 406 · Елена',

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
            Заявка и чек получены!
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
            +66 617 276 406 Елена
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

    <p>
      Ваша заявка принята. Мы свяжемся с вами и запросим паспорта всех пассажиров.
      Проверим данные, уточним стоимость Fast Track и сообщим вам итоговую сумму.
    </p>

    <p>
      После подтверждения стоимости вы производите оплату, и мы оформляем услугу.
    </p>

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


// Tien Mee excursions catalogue integration (app.js patch)
(function initTienMeeExcursions() {
  const categoryMeta = {
    sea: { title: 'Морские экскурсии', image: 'images/islands-route.jpg', label: 'Морские' },
    land: { title: 'Сухопутные программы', image: 'images/hong-phangnga.jpg', label: 'Сухопутные' },
    activities: { title: 'Активности и аренда', image: 'images/jet-ski-route.jpg', label: 'Активности' },
    shows: { title: 'Вечерние шоу', image: 'images/maiton-coral-racha.jpg', label: 'Вечерние шоу' },
    boats: { title: 'Аренда лодок', image: 'images/speedboat.jpg', label: 'Аренда лодок' },
    private: { title: 'Приватные экскурсии', image: 'images/speedboat.jpg', label: 'Приватные' }
  };
  const escapeHtml = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = p => p == null ? 'Уточнить стоимость' : `${Number(p).toLocaleString('ru-RU')} ${'THB'}`;
  function loadCatalog(callback) {
    if (Array.isArray(window.TIENMEE_EXCURSIONS)) return callback();
    const s = document.createElement('script');
    s.src = './excursions.js';
    s.onload = callback;
    s.onerror = () => {
      const box = document.getElementById('category');
      if (box) box.innerHTML = '<button data-home class="back" type="button">‹ Назад</button><p>Не удалось загрузить каталог. Проверьте, что excursions.js находится в корне репозитория.</p>';
    };
    document.head.appendChild(s);
  }
  function ensureDetailScreen() {
    let detail = document.getElementById('excursionDetail');
    if (!detail) {
      detail = document.createElement('section');
      detail.id = 'excursionDetail';
      detail.className = 'screen';
      detail.innerHTML = '<button type="button" class="back" id="excursionDetailBack">‹ К списку экскурсий</button><div id="excursionDetailContent"></div>';
      document.querySelector('.app')?.appendChild(detail);
      document.getElementById('excursionDetailBack').addEventListener('click', () => show('category'));
    }
    return detail;
  }
  function renderCategory(category) {
    loadCatalog(() => {
      const all = window.TIENMEE_EXCURSIONS || [];
      const categoryMap = { boats: 'activities', private: 'activities' };
      const key = categoryMap[category] || category;
      const items = all.filter(x => x.category === key);
      const section = document.getElementById('category');
      if (!section) return;
      const meta = categoryMeta[category] || categoryMeta[key] || { title: 'Экскурсии', image: 'images/islands-route.jpg' };
      section.innerHTML = `<button data-back class="back" type="button">‹ К экскурсиям</button><h2 id="catTitle">${escapeHtml(meta.title)}</h2><div class="excursion-grid">${items.map(x => {
        const fallback = meta.image;
        return `<button class="excursion-card" type="button" data-excursion-id="${escapeHtml(x.id)}"><img src="${escapeHtml(fallback)}" alt="" loading="lazy"><span class="excursion-card-body"><b>${escapeHtml(x.title)}</b><small>${escapeHtml(x.description || '')}</small><strong>${money(x.price?.adult)}</strong></span><span class="excursion-arrow">›</span></button>`;
      }).join('') || '<p class="excursion-empty">В этой категории пока нет программ.</p>'}</div>`;
      section.querySelector('[data-back]')?.addEventListener('click', () => show('excursions'));
      section.querySelectorAll('[data-excursion-id]').forEach(btn => btn.addEventListener('click', () => renderDetail(btn.dataset.excursionId)));
      show('category');
    });
  }
  function renderDetail(id) {
    loadCatalog(() => {
      const x = (window.TIENMEE_EXCURSIONS || []).find(item => item.id === id);
      if (!x) return;
      const meta = categoryMeta[x.category] || categoryMeta.sea;
      const detail = ensureDetailScreen();
      const program = Array.isArray(x.program) && x.program.length
        ? `<h3>Программа</h3><ol class="excursion-program">${x.program.map(row => Array.isArray(row) ? `<li><b>${escapeHtml(row[0])}</b> ${escapeHtml(row[1])}</li>` : `<li>${escapeHtml(row)}</li>`).join('')}</ol>`
        : '';
      const days = x.days === 'daily' ? 'Ежедневно' : Array.isArray(x.days) ? x.days.join(', ') : (x.days || 'Уточняется');
      const notes = x.notes ? `<p class="excursion-notes">${escapeHtml(x.notes)}</p>` : '';
      detail.querySelector('#excursionDetailContent').innerHTML = `
        <img class="excursion-hero-image" src="${escapeHtml(meta.image)}" alt="" onerror="this.style.display='none'">
        <h2>${escapeHtml(x.title)}</h2>
        <p class="excursion-description">${escapeHtml(x.description || '')}</p>
        <div class="excursion-prices"><div><small>Взрослый</small><b>${money(x.price?.adult)}</b></div><div><small>Детский</small><b>${money(x.price?.child)}</b></div></div>
        ${x.childAge ? `<p><b>Детский тариф:</b> ${escapeHtml(x.childAge)}</p>` : ''}
        <p><b>Дни отправления:</b> ${escapeHtml(days)}</p>${notes}${program}
        <h3>Оставить заявку</h3>
        <form id="excursionBookingForm" class="excursion-form">
          <label>Имя и фамилия (латиницей)<input name="fullName" required autocomplete="name" placeholder="Например, IVAN IVANOV"></label>
          <label>Отель или место подачи<input name="hotel" required placeholder="Название отеля / адрес"></label>
          <label>Дата экскурсии<input name="date" type="date" required></label>
          <div class="excursion-form-row"><label>Взрослые<input name="adults" type="number" min="1" value="2" required></label><label>Дети<input name="children" type="number" min="0" value="0" required></label></div>
          <label>Возраст детей (если есть)<input name="childrenAges" placeholder="Например, 5 и 8 лет"></label>
          <label>Контакт для связи<input name="phone" required placeholder="Telegram / WhatsApp / телефон"></label>
          <label>Комментарий<textarea name="comment" rows="3" placeholder="Дополнительные пожелания"></textarea></label>
          <button type="submit">Отправить заявку</button><p class="excursion-form-status" aria-live="polite"></p>
        </form>`;
      show('excursionDetail');
      const form = detail.querySelector('#excursionBookingForm');
      form.addEventListener('submit', async e => {
        e.preventDefault();
        const submit = form.querySelector('button[type="submit"]');
        const status = form.querySelector('.excursion-form-status');
        submit.disabled = true; submit.textContent = 'Отправляем…';
        const f = new FormData(form);
        const order = {
          type: 'excursion', id: makeId('EX'), status: 'Новая заявка',
          excursionId: x.id, service: x.title, excursionTitle: x.title,
          excursionPriceAdult: x.price?.adult ?? '', excursionPriceChild: x.price?.child ?? '',
          fullName: f.get('fullName'), hotel: f.get('hotel'), date: f.get('date'),
          adults: Number(f.get('adults')), children: Number(f.get('children')),
          childrenAges: f.get('childrenAges') || '', phone: f.get('phone'),
          comment: f.get('comment') || '', departureDays: days, ...telegramData()
        };
        const sent = await sendOrder(order);
        if (!sent) { submit.disabled = false; submit.textContent = 'Отправить заявку'; return; }
        saveOrder(order); feedback();
        form.innerHTML = `<h3>✅ Заявка отправлена</h3><p>Номер заявки: <b>${escapeHtml(order.id)}</b></p><p>Экскурсия: ${escapeHtml(x.title)}</p><p>Менеджер свяжется с вами для подтверждения деталей.</p><button type="button" id="excursionNewRequest">Оставить ещё одну заявку</button>`;
        form.querySelector('#excursionNewRequest').addEventListener('click', () => renderDetail(id));
      });
    });
  }
  const style = document.createElement('style');
  style.textContent = `
    .excursion-grid{display:grid;gap:12px;margin:16px 0}
    .excursion-card{display:flex;align-items:stretch;gap:12px;width:100%;padding:0;border:1px solid #e5e8df;border-radius:16px;background:#fff;color:#253126;text-align:left;overflow:hidden;position:relative}
    .excursion-card img{width:112px;min-width:112px;object-fit:cover;min-height:132px}
    .excursion-card-body{display:flex;flex-direction:column;gap:7px;padding:12px 30px 12px 0}
    .excursion-card-body b{font-size:15px}.excursion-card-body small{font-size:12px;line-height:1.4;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;color:#626b60}
    .excursion-card-body strong{font-size:14px;color:#5f7658}.excursion-arrow{position:absolute;right:10px;top:45%;font-size:22px}
    .excursion-hero-image{width:100%;max-height:240px;object-fit:cover;border-radius:16px;margin:12px 0}
    .excursion-description{line-height:1.6;white-space:pre-line}.excursion-prices{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:16px 0}
    .excursion-prices>div{padding:14px;border-radius:12px;background:#f2f4ee;display:flex;flex-direction:column;gap:5px}
    .excursion-prices small{color:#697364}.excursion-prices b{color:#40583c}
    .excursion-program{padding-left:22px;line-height:1.55}.excursion-program li{margin:8px 0}
    .excursion-form{display:grid;gap:12px;margin:16px 0}.excursion-form label{display:grid;gap:6px;font-size:13px}
    .excursion-form input,.excursion-form textarea{width:100%;box-sizing:border-box;padding:12px;border:1px solid #d8ddd3;border-radius:10px;font:inherit;background:#fff}
    .excursion-form-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}.excursion-form button{padding:14px;border:0;border-radius:12px;background:#5f7658;color:#fff;font-weight:700}
    .excursion-form button:disabled{opacity:.65}.excursion-form-status{font-size:12px;color:#a33}
    .excursion-empty{padding:16px;color:#687064}
  `;
  document.head.appendChild(style);
  document.querySelectorAll('[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => renderCategory(btn.dataset.cat));
  });
})();

// Старт
show('home');
