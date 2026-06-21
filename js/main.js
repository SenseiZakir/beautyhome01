let isSearching = false;

function normalizeText(text){

  return text
    .toLowerCase()
    .replace(/й/g,"и")
    .replace(/ы/g,"и")
    .replace(/я/g,"а")
    .replace(/ь/g,"")
    .trim();

}

/* =========================
   CART
========================= */
function addToCart(name, price, image) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
    showToast("Количество увеличено (+1)");
  } else {
    cart.push({
      name,
      price,
      image,
      quantity: 1
    });

    showToast("Добавлено в корзину");
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

/* =========================
   TOAST (ОДИН)
========================= */
window.toastTimer = null;

function showToast(message) {
  let toast = document.getElementById("toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;

  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.background = "#2563eb";
  toast.style.color = "#fff";
  toast.style.padding = "12px 16px";
  toast.style.borderRadius = "10px";
  toast.style.fontSize = "14px";
  toast.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
  toast.style.zIndex = "9999";

  clearTimeout(window.toastTimer);

  toast.style.transition = "none";
  toast.style.opacity = "0";
  toast.style.transform = "translateY(20px)";

  void toast.offsetWidth;

  toast.style.transition = "all 0.3s ease";
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";

  window.toastTimer = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
  }, 1200);
}

/* =========================
   CARDS SLIDER + CLICK
========================= */
document.querySelectorAll(".card").forEach(card => {
  const productId = card.dataset.id;

  const track = card.querySelector(".track");
  const images = card.querySelectorAll(".track img");
  const nextBtn = card.querySelector(".next");
  const prevBtn = card.querySelector(".prev");
  const slider = card.querySelector(".slider");

  let index = 0;

  function updateSlider() {
    const width = slider.clientWidth;
    track.style.transform = `translateX(${-index * width}px)`;
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", e => {
      e.stopPropagation();
      if (index < images.length - 1) {
        index++;
        updateSlider();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", e => {
      e.stopPropagation();
      if (index > 0) {
        index--;
        updateSlider();
      }
    });
  }

  images.forEach(img => {
    img.addEventListener("click", e => {
      if (isSearching) return;

      e.stopPropagation();
      window.location.href = `product.html?id=${productId}`;
    });
  });

  card.addEventListener("click", e => {
    if (isSearching) {
      e.preventDefault();
      return;
    }
  });

  updateSlider();
});

/* =========================
   FILTERS (если есть)
========================= */
function openFilters() {
  document.getElementById("sidebarFilters").classList.add("active");
  document.getElementById("overlay").classList.add("active");
}

function closeFilters() {
  document.getElementById("sidebarFilters").classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
}

/* =========================
   HOME LINK SCROLL
========================= */
document.querySelectorAll(".homeLink").forEach(link => {
  link.addEventListener("click", e => {
    if (
      window.location.pathname.includes("index.html") ||
      window.location.pathname === "/"
    ) {
      e.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  });
});

/* =========================
   BANNER BUTTON
========================= */
const bannerCatalogBtn = document.getElementById("bannerCatalogBtn");

if (bannerCatalogBtn) {
  bannerCatalogBtn.addEventListener("click", () => {
    const catalog = document.getElementById("catalog");
    if (catalog) {
      catalog.scrollIntoView({ behavior: "smooth" });
    }
  });
}

/* =========================
   HEADER SEARCH (ЕДИНСТВЕННЫЙ)
========================= */


/* =========================
   RESET SEARCH STATE
========================= */
window.addEventListener("load", () => {
  isSearching = false;
});

function initFilters() {
  const applyBtn = document.getElementById("applyFilters");
  const resetBtn = document.getElementById("resetFilters");
  const productsContainer = document.getElementById("products");

  if (!applyBtn || !resetBtn || !productsContainer) return;

  applyBtn.addEventListener("click", () => {
    const search = document.getElementById("searchInput")?.value.toLowerCase().trim() || "";
    const category = document.getElementById("categoryFilter")?.value || "";
    const minPrice = Number(document.getElementById("minPrice")?.value) || 0;
    const maxPrice = Number(document.getElementById("maxPrice")?.value) || Infinity;
    const sortValue = document.getElementById("sortPrice")?.value || "";

    const cards = Array.from(document.querySelectorAll(".card"));

    const visible = [];

    cards.forEach(card => {
      const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
      const price = Number(card.dataset.price || 0);
      const cat = card.dataset.category || "";

      


const searchWords = search.split(" ");

const keywords = (
  title + " " +
  (card.dataset.keywords || "")
).toLowerCase();


const matchSearch = searchWords.every(word =>
  normalizeText(keywords)
.includes(
 normalizeText(word)
)
);
      const matchCat = !category || cat === category;
      const matchPrice = price >= minPrice && price <= maxPrice;

      if (matchSearch && matchCat && matchPrice) {
        card.style.display = "block";
        visible.push(card);
      } else {
        card.style.display = "none";
      }
    });

    if (sortValue) {
      visible.sort((a, b) => {
        const pa = Number(a.dataset.price || 0);
        const pb = Number(b.dataset.price || 0);

        return sortValue === "asc" ? pa - pb : pb - pa;
      });

      visible.forEach(card => productsContainer.appendChild(card));
    }
  });

  resetBtn.addEventListener("click", () => {
    document.getElementById("searchInput").value = "";
    document.getElementById("categoryFilter").value = "";
    document.getElementById("minPrice").value = "";
    document.getElementById("maxPrice").value = "";
    document.getElementById("sortPrice").value = "";

    document.querySelectorAll(".card").forEach(card => {
      card.style.display = "block";
    });
  });
}

document.addEventListener("DOMContentLoaded", initFilters);

document.addEventListener("DOMContentLoaded", () => {
  const skeleton = document.getElementById("skeleton");

  if (skeleton) {
    skeleton.style.display = "none";
  }
});

function initHeaderSearch() {

  const btn = document.getElementById("searchBtn");
  const input = document.getElementById("headerSearch");

  if (!btn || !input) return;


  function findProductAndOpen() {

    const query = input.value.trim().toLowerCase();

    if (!query) return;


    const found = products.find(p => {

      const text =
        p.title +
        " " +
        (p.keywords ? p.keywords.join(" ") : "");

      return normalizeText(text)
      .includes(normalizeText(query));

    });


    if(found){

      window.location.href =
      `product.html?id=${found.id}`;

    } else {

      alert("Товар не найден");

    }

  }


  btn.addEventListener("click", findProductAndOpen);


  input.addEventListener("keydown", e => {

    if(e.key === "Enter"){
      findProductAndOpen();
    }

  });

}


document.addEventListener("DOMContentLoaded", initHeaderSearch);

/* =========================
   HEADER CATALOG SCROLL
========================= */

document.querySelectorAll("#catalogLink").forEach(link => {

  link.addEventListener("click", function(e){

    const catalog = document.getElementById("catalog");


    // если мы на главной
    if(catalog){

      e.preventDefault();

      catalog.scrollIntoView({
        behavior:"smooth"
      });

    }

    // если мы НЕ на главной
    else {

      window.location.href = "index.html#catalog";

    }


  });

});

const translations = {
  ru: {
    home: "Главная",
    catalog: "Каталог",
    cart: "Корзина",
    services: "Услуги",
    delivery: "Доставка",
    contacts: "Контакты"
  },

  kg: {
    home: "Башкы бет",
    catalog: "Каталог",
    cart: "Себет",
    services: "Кызматтар",
    delivery: "Жеткирүү",
    contacts: "Байланыш"
  }
};

function setLanguage(lang) {

  document.querySelectorAll("[data-lang]").forEach(el => {

    const key = el.dataset.lang;

    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }

  });

  // Поиск в шапке
  const headerSearch = document.getElementById("headerSearch");
  if (headerSearch) {
    headerSearch.placeholder =
      lang === "kg"
        ? "Эмерек издөө..."
        : "Поиск мебели...";
  }

  // Большой баннер
  const bannerTitle = document.getElementById("bannerTitle");
  const bannerText = document.getElementById("bannerText");
  const bannerBtn = document.getElementById("bannerCatalogBtn");

  if (bannerTitle) {
    bannerTitle.textContent =
      lang === "kg"
        ? "Кыялыңыздагы үйдү түзүңүз"
        : "Создайте дом своей мечты";
  }

  if (bannerText) {
    bannerText.textContent =
      lang === "kg"
        ? "Жайлуу жашоо үчүн заманбап эмерек"
        : "Современная мебель для комфортной жизни";
  }

  if (bannerBtn) {
    bannerBtn.textContent =
      lang === "kg"
        ? "Каталогду көрүү"
        : "Смотреть каталог";
  }

  // Фильтры
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.placeholder =
      lang === "kg"
        ? "Товар издөө"
        : "Поиск товара";
  }

  const applyBtn = document.getElementById("applyFilters");
  if (applyBtn) {
    applyBtn.textContent =
      lang === "kg"
        ? "Колдонуу"
        : "Применить";
  }

  const resetBtn = document.getElementById("resetFilters");
  if (resetBtn) {
    resetBtn.textContent =
      lang === "kg"
        ? "Тазалоо"
        : "Сбросить";
  }

  localStorage.setItem("lang", lang);
}

document.addEventListener("DOMContentLoaded", () => {

  const savedLang =
    localStorage.getItem("lang") || "ru";

  setLanguage(savedLang);

  document
    .getElementById("ruBtn")
    ?.addEventListener("click", () => {
      setLanguage("ru");
    });

  document
    .getElementById("kgBtn")
    ?.addEventListener("click", () => {
      setLanguage("kg");
    });

});

translations.ru = {
  ...translations.ru,

  catalog: "Каталог",

  bannerTitle: "Создайте дом своей мечты",
  bannerText: "Современная мебель для комфортной жизни",
  bannerBtn: "Смотреть каталог",

  searchPlaceholder: "Поиск мебели...",

  aboutTitle: "О компании Beauty Home",

  aboutText1:
    "Beauty Home — это современная мебель для дома, созданная с заботой о комфорте и стиле.",

  aboutText2:
    "Мы предлагаем кровати, диваны, консоли, тумбы, столики и другую мебель высокого качества по доступным ценам.",

  aboutText3:
    "Наша цель — помочь каждому клиенту создать уютный интерьер своей мечты.",

  whyUs: "Почему выбирают нас",

  adv1: "🛋 Качественная мебель",
  adv2: "🚚 Быстрая доставка",
  adv3: "💰 Доступные цены",
  adv4: "🛠 Гарантия 1 год",

  filters: "Фильтры",

  productSearch: "Поиск товара",
  priceFrom: "Цена от",
  priceTo: "Цена до",

  apply: "Применить",
  reset: "Сбросить",

  addCart: "В корзину"
};

translations.kg = {
  ...translations.kg,

  catalog: "Каталог",

  bannerTitle: "Кыялыңыздагы үйдү түзүңүз",
  bannerText: "Жайлуу жашоо үчүн заманбап эмерек",
  bannerBtn: "Каталогду көрүү",

  searchPlaceholder: "Эмерек издөө...",

  aboutTitle: "Beauty Home жөнүндө",

  aboutText1:
    "Beauty Home — үй үчүн заманбап жана ыңгайлуу эмеректерди сунуштайт.",

  aboutText2:
    "Биз керебеттерди, дивандарды, консольдорду, тумбаларды жана башка сапаттуу эмеректерди сунуштайбыз.",

  aboutText3:
    "Биздин максат — ар бир кардардын кыялындагы интерьерин түзүүгө жардам берүү.",

  whyUs: "Эмне үчүн бизди тандашат",

  adv1: "🛋 Сапаттуу эмерек",
  adv2: "🚚 Ыкчам жеткирүү",
  adv3: "💰 Жеткиликтүү баалар",
  adv4: "🛠 1 жыл кепилдик",

  filters: "Чыпкалар",

  productSearch: "Товар издөө",
  priceFrom: "Баасы баштап",
  priceTo: "Баасы чейин",

  apply: "Колдонуу",
  reset: "Тазалоо",

  addCart: "Себетке кошуу"
};

function translateProducts(lang) {

  document.querySelectorAll("[data-ru][data-kg]").forEach(el => {

    if(lang === "kg"){
      el.textContent = el.dataset.kg;
    } else {
      el.textContent = el.dataset.ru;
    }

  });

}


const oldSetLanguage = setLanguage;


setLanguage = function(lang){

  oldSetLanguage(lang);

  translateProducts(lang);

}

function translateFilters(lang){


  // option категорий
  document.querySelectorAll("#categoryFilter option").forEach(option=>{

    if(option.dataset.ru && option.dataset.kg){

      option.textContent =
      lang === "kg"
      ? option.dataset.kg
      : option.dataset.ru;

    }

  });


  // сортировка
  const sort = document.getElementById("sortPrice");

  if(sort){

    sort.options[0].textContent =
    lang === "kg"
    ? "Сортировка жок"
    : "Без сортировки";


    sort.options[1].textContent =
    lang === "kg"
    ? "Баасы ↑"
    : "Цена ↑";


    sort.options[2].textContent =
    lang === "kg"
    ? "Баасы ↓"
    : "Цена ↓";

  }


  // цена
  const min =
  document.getElementById("minPrice");

  const max =
  document.getElementById("maxPrice");


  if(min){

    min.placeholder =
    lang === "kg"
    ? "Баасы баштап"
    : "Цена от";

  }


  if(max){

    max.placeholder =
    lang === "kg"
    ? "Баасы чейин"
    : "Цена до";

  }


}


const oldTranslateProducts = translateProducts;


translateProducts = function(lang){

 oldTranslateProducts(lang);

 translateFilters(lang);

}

function translateContacts(lang){

  document.querySelectorAll(
    ".contacts-page [data-ru][data-kg]"
  ).forEach(el=>{

    if(lang === "kg"){
      el.textContent = el.dataset.kg;
    } else {
      el.textContent = el.dataset.ru;
    }

  });

}


const oldSetLanguage2 = setLanguage;


setLanguage = function(lang){

  oldSetLanguage2(lang);

  translateProducts(lang);

  translateFilters(lang);

  translateContacts(lang);

}

function translatePages(lang){

  document.querySelectorAll("[data-ru][data-kg]").forEach(el=>{

    if(lang === "kg"){
      el.textContent = el.dataset.kg;
    } else {
      el.textContent = el.dataset.ru;
    }

  });

}


setLanguage = function(lang){

  oldSetLanguage(lang);

  translateProducts(lang);

  translateFilters(lang);

  translateContacts(lang);

  translatePages(lang);

}

document.addEventListener("DOMContentLoaded", () => {

  const links = document.querySelectorAll(".nav-link");

  links.forEach(link => {

    link.onclick = function(e){

      const href = this.getAttribute("href");

      if(href === "services.html"){
        window.location.href = "services.html";
      }

      if(href === "delivery.html"){
        window.location.href = "delivery.html";
      }

    }

  });

});

function translatePlaceholders(lang){

document.querySelectorAll("[data-ru-placeholder]").forEach(el=>{

el.placeholder =
lang === "kg"
? el.dataset.kgPlaceholder
: el.dataset.ruPlaceholder;

});

}


function translateProductPage(lang){

  const title = document.querySelector(".product-hero h1");
  const desc = document.querySelector(".description");

  if(title && title.dataset.ru && title.dataset.kg){
    title.textContent =
      lang === "kg"
        ? title.dataset.kg
        : title.dataset.ru;
  }

  if(desc && desc.dataset.ru && desc.dataset.kg){
    desc.textContent =
      lang === "kg"
        ? desc.dataset.kg
        : desc.dataset.ru;
  }

  document
    .querySelectorAll("#productFeatures li")
    .forEach(li => {

      if(!li.dataset.ru || !li.dataset.kg) return;

      li.textContent =
        lang === "kg"
          ? li.dataset.kg
          : li.dataset.ru;
    });
}

document.addEventListener("DOMContentLoaded", () => {

  const savedLang =
    localStorage.getItem("lang") || "ru";

  translateProductPage(savedLang);

});

/* =========================
   AUTO KEYWORDS AFTER LOAD
========================= */

document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll(".card").forEach(card => {

    const category = card.dataset.category;


    const keywords = {

      "Банкетки":
      "банкетка банкетки отургуч отургучтар bench",

      "Пуфы будуарные":
      "пуф пуфы будуардук пуфтар pouf",

      "Туалетные столики":
      "туалетный столик косметикалык столдор",

      "Кровати":
      "кровать кровати керебет керебеттер bed",

      "Консоли":
      "консоль консоли консолдор console",

      "Кресла и стулья":
      "кресло кресла стул стулья креслолор отургучтар",

      "Диваны":
      "диван диваны дивандар sofa",

      "Тумбы":
      "тумба тумбы тумбалар",

      "Столики":
      "стол столик столики столдор",

      "Пуфы":
      "пуф пуфы пуфтар",

      "Подвесные консоли":
      "подвесная консоль илме консолдор",

      "Прикроватные тумбы":
      "прикроватная тумба керебет жанындагы тумбалар",

      "ТВ-Тумбы":
      "тв тумба телевизордук тумба"

    };


    card.dataset.keywords = keywords[category] || "";

  });

});
