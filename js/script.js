// Toggle hamburger menu
const navbarNav = document.querySelector(".navbar-nav");
const hamburgerMenu = document.querySelector("#hamburger-menu");
hamburgerMenu.onclick = () => {
  navbarNav.classList.toggle("active");
};

// Toggle search form
const searchForm = document.querySelector(".search-form");
const searchBox = document.querySelector("#search-box");
const searchButton = document.querySelector("#search-button");
searchButton.onclick = (e) => {
  e.preventDefault();
  searchForm.classList.toggle("active");
  searchBox.focus();
};

// Toggle shopping cart
const shoppingCart = document.querySelector("#shopping-cart");
const shoppingCartButton = document.querySelector("#shopping-cart-button");
shoppingCartButton.onclick = (e) => {
  e.preventDefault();
  shoppingCart.classList.toggle("active");
};

// Klik di luar elemen untuk menutup nav, search, dan cart
document.addEventListener("click", function (e) {
  if (!navbarNav.contains(e.target) && !hamburgerMenu.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
  if (!searchForm.contains(e.target) && !searchButton.contains(e.target)) {
    searchForm.classList.remove("active");
  }
  if (
    !shoppingCart.contains(e.target) &&
    !shoppingCartButton.contains(e.target)
  ) {
    shoppingCart.classList.remove("active");
  }
});

// ===== Cart Logic =====
const cartItems = [];

document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    const parent = button.closest(".menu-card");
    const itemName = parent
      .querySelector(".menu-card-title")
      .textContent.trim();
    const itemPriceText = parent
      .querySelector(".menu-card-price")
      .textContent.trim();
    const itemPrice =
      parseFloat(itemPriceText.replace(/[^\d,]/g, "").replace(",", ".")) * 1000;

    const existingItem = cartItems.find((item) => item.name === itemName);
    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cartItems.push({ name: itemName, price: itemPrice, qty: 1 });
    }

    displayCart();
  });
});

function displayCart() {
  const cartList = document.querySelector("#cart-items");
  if (!cartList) return;

  cartList.innerHTML = "";
  let total = 0;

  cartItems.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="img/menu/1.jpg" alt="${item.name}" />
      <div class="item-detail">
        <h3>${item.name}</h3>
        <div class="item-price">Rp ${item.price.toLocaleString()} x ${
      item.qty
    }</div>
      </div>
      <i data-feather="trash-2" class="remove-item" data-index="${index}"></i>
    `;
    cartList.appendChild(div);
  });

  // Tambahkan total harga ke cart
  const totalDiv = document.createElement("div");
  totalDiv.classList.add("cart-total");
  totalDiv.innerHTML = `<hr><h3>Total: Rp ${total.toLocaleString()}</h3>`;
  cartList.appendChild(totalDiv);

  // Pasang ulang feather icon & event hapus
  feather.replace();
  document.querySelectorAll(".remove-item").forEach((icon) => {
    icon.addEventListener("click", () => {
      const index = icon.dataset.index;
      cartItems.splice(index, 1);
      displayCart();
    });
  });
}

// Checkout WhatsApp
const checkoutBtn = document.querySelector("#checkout-whatsapp");
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    const nama = prompt("Masukkan nama Anda:");
    if (!nama || nama.trim() === "") {
      alert("Mohon masukkan nama terlebih dahulu.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Keranjang belanja masih kosong.");
      return;
    }

    let pesan = `Halo, saya ingin memesan:%0A%0A`;
    let total = 0;

    cartItems.forEach((item) => {
      pesan += `- ${item.name} (${item.qty}x)%0A`;
      total += item.price * item.qty;
    });

    pesan += `%0ATotal: Rp ${total.toLocaleString()}%0A%0ANama: ${nama}`;
    const url = `https://wa.me/6288237067042?text=${pesan}`;
    window.open(url, "_blank");
  });
}

// Form kontak ke WhatsApp
const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const nama = document.querySelector("#nama").value.trim();
    const email = document.querySelector("#email").value.trim();
    const nohp = document.querySelector("#nohp").value.trim();

    if (!nama || !email || !nohp) {
      alert("Mohon lengkapi semua data terlebih dahulu.");
      return;
    }

    const pesan = `Halo, saya ingin menghubungi UMKM Kedai Kue Dewi.%0A%0A*Nama:* ${nama}%0A*Email:* ${email}%0A*No HP:* ${nohp}`;
    const url = `https://wa.me/6288237067042?text=${pesan}`;
    window.open(url, "_blank");
  });
}

// Feather icons init
feather.replace();
