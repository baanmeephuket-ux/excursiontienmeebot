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
      throw new Error(result.error || "Ошибка отправки");
    }

    return true;

  } catch (error) {
    console.error("Ошибка отправки заявки:", error);
    alert("Не удалось отправить заявку. Попробуйте ещё раз.");
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
    payment:'Способ оплаты подтвердит менеджер', ...telegramData()
  }; 

const sent = await sendOrder(order);

if (!sent) return;

saveOrder(order);
transferForm.hidden=true;
  document.getElementById('transferConfirmation').hidden=false;
  document.getElementById('transferConfirmation').innerHTML=`<h3>✅ Заявка отправлена</h3><p><b>Номер:</b> ${order.id}</p><p><b>Направление:</b> ${order.direction}</p><p><b>Дата:</b> ${order.date}</p><p><b>Рейс:</b> ${order.flightNumber}</p><p><b>Время:</b> ${order.arrivalTime}</p><p><b>Пассажиры:</b> ${order.people}</p><p><b>Чемоданы:</b> ${order.suitcases}</p><p><b>Отель:</b> ${order.hotel}</p><p><b>Оплата:</b> способ оплаты будет подтверждён менеджером.</p><p>Менеджер проверит возможность трансфера, подтвердит стоимость и сообщит вам способ оплаты.</p><button type="button" id="newTransfer">Создать ещё одну заявку</button>`;
  document.getElementById('newTransfer').onclick=()=>{ transferForm.reset(); transferForm.hidden=false; document.getElementById('transferConfirmation').hidden=true; document.querySelectorAll('.direction').forEach(x=>x.classList.toggle('active',x.dataset.direction==='Аэропорт → Отель')); transferDirection='Аэропорт → Отель'; };
  feedback();
});

// Аренда авто
let delivery = 'Аэропорт';
document.querySelectorAll('.choice').forEach(btn => btn.addEventListener('click',()=>{document.querySelectorAll('.choice').forEach(x=>x.classList.remove('active'));btn.classList.add('active');delivery=btn.dataset.delivery;}));
const carForm=document.getElementById('carForm');
if(carForm) carForm.addEventListener('submit',e=>{
  e.preventDefault(); const f=new FormData(carForm); const order={type:'car',id:makeId('CAR'),status:'Новая заявка',startDate:f.get('startDate'),endDate:f.get('endDate'),delivery,location:f.get('location'),carType:f.get('carType'),people:Number(f.get('people')),phone:f.get('phone'),comment:f.get('comment')||'',...telegramData()}; saveOrder(order); carForm.hidden=true;
  const box=document.getElementById('carConfirmation'); box.hidden=false; box.innerHTML=`<h3>✅ Заявка отправлена</h3><p><b>Номер:</b> ${order.id}</p><p>Мы проверим наличие автомобилей и свяжемся с вами с подходящими вариантами.</p><button type="button" id="newCar">Создать ещё одну заявку</button>`;
  document.getElementById('newCar').onclick=()=>{carForm.reset();carForm.hidden=false;box.hidden=true;}; feedback();
});

// Недвижимость
const realEstateForm=document.getElementById('realEstateForm');
if(realEstateForm) realEstateForm.addEventListener('submit',e=>{
  e.preventDefault(); const f=new FormData(realEstateForm); const order={type:'real_estate_purchase',id:makeId('RE'),status:'Новая заявка',budget:f.get('budget'),propertyType:f.get('propertyType'),bedrooms:f.get('bedrooms'),purpose:f.get('purpose'),statusOnPhuket:f.get('status'),arrivalDate:f.get('arrivalDate')||'',phone:f.get('phone'),...telegramData()}; saveOrder(order); realEstateForm.hidden=true;
  const box=document.getElementById('realEstateConfirmation'); box.hidden=false; box.innerHTML=`<h3>✅ Заявка отправлена</h3><p><b>Номер:</b> ${order.id}</p><p>Мы получили ваш запрос. Менеджер свяжется с вами и подберёт подходящие варианты.</p><button type="button" id="newRE">Создать ещё одну заявку</button>`;
  document.getElementById('newRE').onclick=()=>{realEstateForm.reset();realEstateForm.hidden=false;box.hidden=true;}; feedback();
});

// Консультация
const businessForm=document.getElementById('businessForm');
if(businessForm) businessForm.addEventListener('submit',e=>{
  e.preventDefault(); const f=new FormData(businessForm); const order={type:'business_consultation',id:makeId('BC'),status:'Ожидает оплаты',date:f.get('date'),time:f.get('time'),phone:f.get('phone'),question:f.get('question')||'',price:'10 000 ₽',...telegramData()}; saveOrder(order); businessForm.hidden=true;
  const box=document.getElementById('businessConfirmation'); box.hidden=false; box.innerHTML=`<h3>📅 Заявка сохранена</h3><p><b>Номер:</b> ${order.id}</p><p><b>Дата:</b> ${order.date}</p><p><b>Время:</b> ${order.time}</p><p><b>Стоимость:</b> 10 000 ₽</p><p>Следующий шаг — оплата консультации. После успешной оплаты вы получите контакты.</p><p><b>Telegram:</b> @Spravkathailand<br><b>WhatsApp:</b> +66 61 727 6406</p>`; feedback();
});

// Быстрые заявки
function simpleRequest(type,label){
  const order={type,id:makeId(type==='fasttrack'?'FT':'EX'),status:'Новая заявка',service:label,...telegramData()}; saveOrder(order);
  alert('✅ Заявка отправлена. Менеджер свяжется с вами для уточнения деталей.'); feedback();
}
document.querySelectorAll('[data-contact-request]').forEach(btn=>btn.addEventListener('click',()=>simpleRequest(btn.dataset.contactRequest,btn.dataset.contactRequest==='fasttrack'?'Fast Track':'Обмен валюты')));

// Мои заказы
function renderOrders(){
  if(!ordersList)return; const orders=JSON.parse(localStorage.getItem('tienMeeOrders')||'[]');
  if(!orders.length){ordersList.innerHTML='<div class="empty"><span>📋</span><b>Пока нет заявок</b><small>Ваши заявки и бронирования появятся здесь.</small></div>';return;}
  ordersList.innerHTML=orders.map(o=>{let title={transfer:'🚕 Трансфер',car_rental:'🚗 Аренда авто',real_estate_purchase:'🏠 Недвижимость',business_consultation:'💼 Консультация',fasttrack:'✈️ Fast Track',exchange:'💱 Обмен валюты'}[o.type]||'Заявка';return `<div class="order-card"><b>${title}</b><span>${o.id}</span><small>${o.status}</small><em>${o.date||o.startDate||''}</em></div>`}).join('');
}

// Старт
show('home');
