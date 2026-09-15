const tg=window.Telegram?.WebApp;if(tg){tg.ready();tg.expand();}
const screens=document.querySelectorAll(".screen");const home=document.getElementById("home");
function show(id){home.style.display=id==="home"?"block":"none";screens.forEach(x=>x.classList.toggle("active",x.id===id));scrollTo(0,0)}
document.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>{let x=b.dataset.open;if(x==="excursions")show("excursions");else{document.getElementById("placeholderTitle").textContent={fasttrack:"Fast Track",transfer:"Трансфер",exchange:"Обмен валюты",business:"Консультации по бизнесу",orders:"Мои заказы",manager:"Связь с менеджером"}[x];show("placeholder")}});
document.querySelectorAll("[data-home]").forEach(b=>b.onclick=()=>show("home"));
document.querySelector("[data-back]").onclick=()=>show("excursions");
const names={sea:"Морские",land:"Сухопутные",boats:"Аренда лодок",private:"Приватные экскурсии"};
document.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{document.getElementById("catTitle").textContent=names[b.dataset.cat];show("category")});
document.getElementById("lang").onclick=()=>alert("English version подключим после утверждения структуры.");
