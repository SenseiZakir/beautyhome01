const page = document.querySelector(".product-page");

const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

const product = products.find(p => p.id === id);

/* =========================
   SEO
========================= */

document.title =
product.seoTitle ||
`${product.title} в Бишкеке — Beauty Home`;

let metaDescription =
document.querySelector('meta[name="description"]');

if (metaDescription) {
  metaDescription.setAttribute(
    "content",
    product.seoDescription ||
    product.description
  );
}

let metaKeywords =
document.querySelector('meta[name="keywords"]');

if (metaKeywords) {
  metaKeywords.setAttribute(
    "content",
    [
      product.title,
      "мебель Бишкек",
      ...(product.keywords || [])
    ].join(", ")
  );
}

if (!product) {
  document.body.innerHTML = "<h1>Товар не найден</h1>";
}

/* =========================
   PRODUCT INFO
========================= */

const title = document.querySelector("h1");

title.textContent = product.title;

title.dataset.ru = product.title;
title.dataset.kg = product.kg || product.title;


document.querySelector(".price").textContent =
product.price + " сом";


const desc = document.querySelector(".description");

desc.textContent = product.description;

desc.dataset.ru = product.description;
desc.dataset.kg = product.descriptionKg || product.description;

/* =========================
   FEATURES
========================= */

const features = document.getElementById("productFeatures");

features.innerHTML = `

<li 
data-ru="Материал: ЛДСП"
data-kg="Материал: ЛДСП">
Материал: ЛДСП
</li>


<li
data-ru="Каркас: ЛДСП"
data-kg="Каркас: ЛДСП">
Каркас: ЛДСП
</li>


<li
data-ru="Стиль: Современный"
data-kg="Стиль: Заманбап">
Стиль: Современный
</li>


<li
data-ru="Цвет: На выбор"
data-kg="Түсү: Тандоо боюнча">
Цвет: На выбор
</li>


<li
data-ru="Гарантия: 12 месяцев"
data-kg="Кепилдик: 12 ай">
Гарантия: 12 месяцев
</li>


<li
data-ru="Страна: Кыргызстан"
data-kg="Өлкө: Кыргызстан">
Страна: Кыргызстан
</li>

`;

const currentLang =
localStorage.getItem("lang") || "ru";

if(currentLang === "kg"){

  title.textContent = title.dataset.kg;

  desc.textContent = desc.dataset.kg;

  document.querySelectorAll("#productFeatures li")
  .forEach(el=>{
    el.textContent = el.dataset.kg;
  });

}
/* =========================
   MAIN IMAGE
========================= */
const mainImg = document.querySelector("#mainImage");
mainImg.src = product.images[0];

/* =========================
   THUMBS
========================= */
const thumbs = document.querySelector(".thumbnails");
thumbs.innerHTML = "";

product.images.forEach((img, index) => {
  const image = document.createElement("img");
  image.src = img;

  if (index === 0) {
    image.classList.add("active");
    mainImg.src = img;
  }

  image.addEventListener("click", () => {
    mainImg.src = img;

    document.querySelectorAll(".thumbnails img")
      .forEach(i => i.classList.remove("active"));

    image.classList.add("active");
  });

  thumbs.appendChild(image);
});

/* =========================
   CART BUTTON
========================= */
const addToCartBtn = document.getElementById("addToCartBtn");

if (addToCartBtn) {
  addToCartBtn.addEventListener("click", () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existingItem = cart.find(item => item.name === product.title);

    if (existingItem) {
      existingItem.quantity += 1;
      showToast("Товар уже в корзине (+1)");
    } else {
      cart.push({
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.images[0],
        quantity: 1
      });

      showToast("Добавлено в корзину");
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  });
}

/* =========================
   WHATSAPP BUTTON
========================= */

const whatsappBtn = document.getElementById("whatsappBtn");

if (whatsappBtn) {

  const phone = "77075732940"; // твой номер

  const message =
`Здравствуйте! Хочу заказать товар:

${product.title}

Цена: ${product.price} сом`;

  whatsappBtn.href =
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

}
/* =========================
   TOAST
========================= */
let productToastTimer;

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

  clearTimeout(productToastTimer);

  toast.style.transition = "none";
  toast.style.opacity = "0";
  toast.style.transform = "translateY(20px)";

  void toast.offsetWidth;

  toast.style.transition = "all 0.3s ease";
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";

  productToastTimer = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
  }, 1500);
}

/* =========================
   SHOW PAGE
========================= */
if (page) {
  page.classList.remove("hidden");
}
