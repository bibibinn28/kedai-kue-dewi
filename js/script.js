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

  // Scroll ke bagian menu
  const menuSection = document.querySelector("#menu");
  if (menuSection) {
    menuSection.scrollIntoView({ behavior: "smooth" });
  }
};

// Fitur pencarian menu
searchBox.addEventListener("input", () => {
  const keyword = searchBox.value.toLowerCase();
  const menuCards = document.querySelectorAll(".menu-card");
  const noResult = document.querySelector("#no-result");
  let anyVisible = false;

  menuCards.forEach((card) => {
    const title = card
      .querySelector(".menu-card-title")
      .textContent.toLowerCase();
    if (title.includes(keyword)) {
      card.style.display = "block";
      anyVisible = true;
    } else {
      card.style.display = "none";
    }
  });

  if (!anyVisible) {
    noResult.style.display = "block";
  } else {
    noResult.style.display = "none";
  }
});

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

  const isInsideCart =
    shoppingCart.contains(e.target) ||
    e.target.closest(".increase-qty") ||
    e.target.closest(".decrease-qty") ||
    e.target.closest(".remove-item") ||
    e.target.classList.contains("in-cart");

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
  button.addEventListener("click", (e) => {
    e.preventDefault();

    const parent = button.closest(".menu-card");
    const itemName = parent
      .querySelector(".menu-card-title")
      .textContent.trim();
    const itemPriceText = parent
      .querySelector(".menu-card-price")
      .textContent.trim();
    const itemPrice =
      parseFloat(itemPriceText.replace(/[^\d,]/g, "").replace(",", ".")) * 1000;

    // Jika item sudah pernah ditambahkan
    if (button.classList.contains("in-cart")) {
      e.preventDefault();
      shoppingCart.classList.add("active");
      return;
    }

    // Tambahkan ke cart
    cartItems.push({ name: itemName, price: itemPrice, qty: 1 });
    displayCart();

    // Ubah tampilan tombol
    button.textContent = "Lihat Keranjang";
    button.classList.add("in-cart");
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
    if (checkoutBtn) checkoutBtn.style.display = "none";

    // Sembunyikan badge jumlah item
    const cartCountBadge = document.querySelector("#cart-count");
    if (cartCountBadge) {
      cartCountBadge.textContent = "0";
      cartCountBadge.style.display = "none";
    }

    // Reset semua tombol ke "Tambah"
    document.querySelectorAll(".add-to-cart").forEach((btn) => {
      btn.textContent = "Tambah";
      btn.classList.remove("in-cart");
    });

    // Tambahkan event klik ke tombol "Lihat Menu"
    const goShopBtn = document.querySelector(".go-shop");
    if (goShopBtn) {
      goShopBtn.addEventListener("click", () => {
        document.querySelector("#menu").scrollIntoView({ behavior: "smooth" });
        shoppingCart.classList.remove("active");
      });
    }

    return;
  } else {
    if (checkoutBtn) checkoutBtn.style.display = "block";
  }

  // Tampilkan isi keranjang
  cartItems.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
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

  // Update badge cart count
  const cartCountBadge = document.querySelector("#cart-count");
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  if (cartCountBadge) {
    cartCountBadge.textContent = totalItems;
    cartCountBadge.style.display = totalItems > 0 ? "inline-block" : "none";
  }

  feather.replace();

  document.querySelectorAll(".increase-qty").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      cartItems[index].qty += 1;
      displayCart();
    });
  });

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

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      cartItems.splice(index, 1);
      displayCart();
    });
  });

  // Reset tombol yang tidak ada lagi di keranjang
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    const card = btn.closest(".menu-card");
    const name = card.querySelector(".menu-card-title").textContent.trim();
    const isInCart = cartItems.find((item) => item.name === name);

    if (!isInCart) {
      btn.textContent = "Tambah";
      btn.classList.remove("in-cart");
    }
  });
}

// Checkout WhatsApp
const checkoutBtn = document.querySelector("#checkout-whatsapp");
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (checkoutBtn.disabled) return;

    const nama = prompt("Masukkan nama Anda:");
    if (!nama || nama.trim() === "") {
      alert("Mohon masukkan nama terlebih dahulu.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Keranjang belanja masih kosong.");
      return;
    }

    let pesan = `Halo, nama saya ${nama}. Saya ingin memesan. Apakah menu berikut masih tersedia?%0A%0A`;
    let total = 0;

    cartItems.forEach((item) => {
      pesan += `- ${item.name} (${item.qty}x)%0A`;
      total += item.price * item.qty;
    });

    pesan += `%0ATotal: Rp ${total.toLocaleString()}`;
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
    const nohp = document.querySelector("#nohp").value.trim();
    const email = document.querySelector("#email").value.trim();

    if (!nama || !nohp) {
      alert("Mohon isi nama dan nomor HP.");
      return;
    }

    let pesan = `Halo, saya ingin memesan beberapa jenis makanan dari UMKM Kedai Kue ibu Dewi.%0A%0A*Nama:* ${nama}%0A*No HP:* ${nohp}`;
    if (email) {
      pesan += `%0A*Email:* ${email}`;
    }

    const url = `https://wa.me/6288237067042?text=${pesan}`;
    window.open(url, "_blank");
  });
}

// Feather icons init
feather.replace();

// Tampilkan isi keranjang saat pertama kali halaman dibuka

function loadMenu() {
  fetch("menu.json")
    .then((res) => res.json())
    .then((data) => {
      const menuList = document.querySelector("#menu-list");
      const noResult = document.querySelector("#no-result");

      data.forEach((item) => {
        const card = document.createElement("div");
        card.classList.add("menu-card");

        card.innerHTML = `
  <div class="menu-card-img-wrapper">
    <img src="${item.image}" alt="${item.name}" class="menu-card-img" />
    ${
      item.bestSeller
        ? '<span class="best-seller-badge">Best Seller</span>'
        : ""
    }
  </div>
  <h3 class="menu-card-title">- ${item.name} -</h3>
  <p class="menu-card-price">${item.price}</p>
  <button type="button" class="add-to-cart btn">Tambah</button>
`;

        menuList.insertBefore(card, noResult);
      });

      // Setelah render, aktifkan tombol add-to-cart
      attachCartEvents();
    })
    .catch((err) => console.error("Gagal memuat menu:", err));
}

function attachCartEvents() {
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const parent = button.closest(".menu-card");
      const itemName = parent
        .querySelector(".menu-card-title")
        .textContent.trim();
      const itemPriceText = parent
        .querySelector(".menu-card-price")
        .textContent.trim();
      const itemImage = parent.querySelector("img").getAttribute("src");
      const itemPrice =
        parseFloat(itemPriceText.replace(/[^\d,]/g, "").replace(",", ".")) *
        1000;

      // Cek apakah sudah di keranjang
      if (button.classList.contains("in-cart")) {
        shoppingCart.classList.add("active");
        return;
      }

      // Tambahkan ke cart termasuk image
      cartItems.push({
        name: itemName,
        price: itemPrice,
        qty: 1,
        image: itemImage,
      });
      displayCart();

      // Ubah tampilan tombol
      button.textContent = "Lihat Keranjang";
      button.classList.add("in-cart");
    });
  });
}

displayCart();
loadMenu();
