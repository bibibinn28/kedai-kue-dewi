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
  // Navbar
  if (!navbarNav.contains(e.target) && !hamburgerMenu.contains(e.target)) {
    navbarNav.classList.remove("active");
  }

  // Search
  if (!searchForm.contains(e.target) && !searchButton.contains(e.target)) {
    searchForm.classList.remove("active");
  }

  // Shopping Cart
  const isInsideCart =
    shoppingCart.contains(e.target) ||
    e.target.closest(".increase-qty") ||
    e.target.closest(".decrease-qty") ||
    e.target.closest(".remove-item");

  if (
    !shoppingCart.contains(e.target) &&
    !shoppingCartButton.contains(e.target) &&
    !isInsideCart
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
  const checkoutBtn = document.querySelector("#checkout-whatsapp");
  if (!cartList) return;

  cartList.innerHTML = "";

  // Jika keranjang kosong
  if (cartItems.length === 0) {
    cartList.innerHTML = `
      <div class="cart-empty">
        <p>Keranjang masih kosong.</p>
        <a href="#menu" class="btn go-shop">Lihat Menu</a>
      </div>
    `;
    // Sembunyikan tombol checkout saat kosong
    if (checkoutBtn) checkoutBtn.style.display = "none";
    return;
  } else {
    if (checkoutBtn) checkoutBtn.style.display = "block";
  }

  // Tampilkan isi keranjang
  cartItems.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="img/menu/1.jpg" alt="${item.name}" />
      <div class="item-detail">
        <h3>${item.name}</h3>
        <div class="item-qty-control">
          <button class="decrease-qty" data-index="${index}">−</button>
          <span>${item.qty}</span>
          <button class="increase-qty" data-index="${index}">+</button>
        </div>
        <div class="item-price">Rp ${item.price.toLocaleString()} x ${
      item.qty
    }</div>
      </div>
      <i data-feather="trash-2" class="remove-item" data-index="${index}"></i>
    `;
    cartList.appendChild(div);
  });

  feather.replace();

  // Tambah qty
  document.querySelectorAll(".increase-qty").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      cartItems[index].qty += 1;
      displayCart();
    });
  });

  // Kurangi qty
  document.querySelectorAll(".decrease-qty").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      if (cartItems[index].qty > 1) {
        cartItems[index].qty -= 1;
      } else {
        cartItems.splice(index, 1);
      }
      displayCart();
    });
  });

  // Hapus item
  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
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

// Tampilkan isi keranjang saat pertama kali halaman dibuka
displayCart();
