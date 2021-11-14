const mySwiper = new Swiper(".swiper-container", {
  loop: true,
  navigation: {
    nextEl: ".slider-button-next",
    prevEl: ".slider-button-prev",
  },
});

//cart

const buttonCarts = document.querySelectorAll(".button-cart");
const modalCart = document.querySelector("#modal-cart");
const modalClose = document.querySelector(".modal-close");
const longGoodsList = document.querySelector(".long-goods-list");
const viewAll = document.querySelectorAll(".view-all");
const navigationLink = document.querySelectorAll(
  ".navigation-link:not(.view-all)"
);
const showClothing = document.querySelectorAll(".show-clothing");
const showAcsessories = document.querySelectorAll(".show-acsessories");
const cartTableGoods = document.querySelector(".cart-table__goods");
const cartTableTotal = document.querySelector(".card-table__total");
const modalCard = document.querySelector(".modalCard");
const modalCardBuy = document.querySelector(".modalCardBuy")






const modalform =  document.querySelector(".modal-form")
modalform.addEventListener("submit",  function (e){
  e.preventDefault();
  if (modalCardBuy.classList.contains("close")) {
    modalCardBuy.classList.replace("close", "active");
  } else modalCardBuy.classList.add("active");
   closeModal();
  let modalClose2 = document.querySelector(".modal-close2");
  modalClose2.addEventListener("click", () => {
    modalCardBuy.classList.replace("active", "close");
  });
});

const showModal = function () {
  const buttons = document.querySelectorAll(".goods-card-btn");
  buttons.forEach(function (btn) {
    // Вешаем событие клик
    btn.addEventListener("click", function (e) {
      if (modalCard.classList.contains("close")) {
        modalCard.classList.replace("close", "active");
      } else modalCard.classList.add("active");

      closeModal();
      modalClose.addEventListener("click", () => {
        modalCard.classList.replace("active", "close");
      });
    });
  });
};
showModal();
const getGoods = async () => {
  const result = await fetch("db/db.json");
  if (!result.ok) {
    throw "Ошибочка вышла:" + result.status;
  }
  return await result.json();
};

const cart = {
  cartGoods: [],
  renderCart() {
    cartTableGoods.textContent = "";
    this.cartGoods.forEach(({ id, name, price, count }) => {
      const trGood = document.createElement("tr");
      trGood.className = "cart-item";
      trGood.dataset.id = id;
      trGood.innerHTML = `
          <td>${name}</td>
					<td>${price}BYN</td>
					<td><button class="cart-btn-minus">-</button></td>
					<td>${count}</td>
					<td><button class="cart-btn-plus">+</button></td>
					<td>${price * count}BYN</td>
					<td><button class="cart-btn-delete">x</button></td>
`;
      cartTableGoods.append(trGood);
    });
    const totalPrice = this.cartGoods.reduce((sum, item) => {
      return sum + item.price * item.count;
    }, 0);
    cartTableTotal.textContent = totalPrice + "BYN";
  },

  deleteGood(id) {
    this.cartGoods = this.cartGoods.filter((item) => id !== item.id);
    this.renderCart();
  },
  minusGood(id) {
    for (const item of this.cartGoods) {
      if (item.id === id) {
        if (item.count <= 1) {
          this.deleteGood(id);
        } else {
          item.count--;
        }
        break;
      }
    }
    this.renderCart();
  },
  plusGood(id) {
    for (const item of this.cartGoods) {
      if (item.id === id) {
        item.count++;
        break;
      }
    }
    this.renderCart();
  },

  addCartGoods(id) {
    const goodItem = this.cartGoods.find((item) => item.id === id);
    if (goodItem) {
      this.plusGood(id);
    } else {
      getGoods()
        .then((data) => data.find((item) => item.id === id))
        .then(({ id, name, price, count }) => {
          this.cartGoods.push({
            id,
            name,
            price,
            count: 1,
          });
        });
    }
  },
};

document.body.addEventListener("click", (event) => {
  const addToCart = event.target.closest(".add-to-cart");
  if (addToCart) {
    cart.addCartGoods(addToCart.dataset.id);
  }
});

cartTableGoods.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("cart-btn-delete")) {
    const id = target.closest(".cart-item").dataset.id;
    cart.deleteGood(id);
  }
  if (target.classList.contains("cart-btn-minus")) {
    const id = target.closest(".cart-item").dataset.id;
    cart.minusGood(id);
  }
  if (target.classList.contains("cart-btn-plus")) {
    const id = target.closest(".cart-item").dataset.id;
    cart.plusGood(id);
  }
});

const openModal = function () {
  cart.renderCart();
  modalCart.classList.add("show");
  if (modalCard.classList.contains("active")) {
    modalCard.classList.replace("active", "close");
  }
};
const closeModal = function () {
  modalCart.classList.remove("show");
};

buttonCarts.forEach(function (btn) {
  btn.addEventListener("click", openModal);
});

modalCart.addEventListener("click", function (event) {
  const target = event.target;
  if (
    target.classList.contains("overlay") ||
    target.classList.contains("modal-close")
  ) {
    closeModal();
  }
});

const scrollLinks = document.querySelectorAll("a.scroll-link");
for (const scrollLink of scrollLinks) {
  scrollLink.addEventListener("click", (event) => {
    event.preventDefault();
    const id = scrollLink.getAttribute("href");
    document.querySelector(id).scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}
/*
for (let i = 0; i < scrollLinks.length; i++) {
  scrollLinks[i].addEventListener("click", function (event) {
    event.preventDefault();
    const id = scrollLinks[i].getAttribute("href");
    document.querySelector(id).scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}
*/
//goods

const createCard = function ({ label, name, img, id, description, price }) {
  const card = document.createElement("div");
  card.className = "col-lg-4 col-sm-6";
  card.innerHTML = `
	<div class="goods-card">
	${label ? `<span class="label">${label}</span>` : ""}
		<img src="db/${img}" alt="${name}" class="goods-image">
	<h3 class="goods-title">${name}</h3>
     <p class="goods-description">${description}</p>
	<button class="goods-card-btn add-to-cart" data-id="${id}">
		<span class="button-price">${price} BYN</span>
	</button>
</div>
	`;
  return card;
};

const renderCards = function (data) {
  longGoodsList.textContent = "";
  const cards = data.map(createCard);
  longGoodsList.append(...cards);
  document.body.classList.add("show-goods");
  showModal();
};

const showAll = function (event) {
  event.preventDefault();
  getGoods().then(renderCards);
};

viewAll.forEach(function (elem) {
  elem.addEventListener("click", showAll);
});

const filterCards = function (field, value) {
  getGoods()
    .then((data) => data.filter((good) => good[field] === value))
    .then(renderCards);
};

navigationLink.forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    const field = link.dataset.field;
    const value = link.textContent;
    filterCards(field, value);
  });
});

showClothing.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    filterCards("category", "Одежда");
  });
});

showAcsessories.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    filterCards("category", "Аксессуары");
  });
});
