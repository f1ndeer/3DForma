/* =========================================
   1. ГЛОБАЛЬНІ ФУНКЦІЇ ЗВ'ЯЗКУ ТА GMAIL
   ========================================= */

// Відкриття вікна зв'язку
function openContact() {
    const bar = document.getElementById('contactBar');
    const label = document.getElementById('horizontalContact');
    const overlay = document.getElementById('contactOverlay');

    if (bar) bar.classList.add('active');
    if (label) label.style.display = 'none'; 
    if (overlay) overlay.style.display = 'block';
}

// Закриття вікна зв'язку
function closeContact() {
    const bar = document.getElementById('contactBar');
    const label = document.getElementById('horizontalContact');
    const overlay = document.getElementById('contactOverlay');

    if (bar) bar.classList.remove('active');
    if (overlay) overlay.style.display = 'none';

    setTimeout(() => {
        if (label) label.style.display = 'block';
    }, 400);
}

// ФУНКЦІЯ: Для загальної форми "Зв'язок" (Gmail)
function sendMail() {
    const messageInput = document.getElementById('message');
    const messageText = messageInput.value.trim();

    if (!messageText) {
        alert("Будь ласка, введіть ваше повідомлення!");
        return;
    }

    const recipient = "zippoziga32@gmail.com";
    const subject = encodeURIComponent("Запитання від клієнта — Форма3D");
    const bodyText = encodeURIComponent(
        `НОВЕ ПОВІДОМЛЕННЯ (Зв'язок)\n` +
        `---------------------------\n` +
        `💬 Повідомлення:\n${messageText}\n` +
        `---------------------------\n` +
        `⚠️ ВАЖЛИВО: Натисніть "Надіслати" у вікні Gmail, щоб ми отримали лист!`
    );

    const gmailUrl = `https://mail.google.com/mail/u/0/?fs=1&to=${recipient}&su=${subject}&body=${bodyText}&tf=cm`;
    window.open(gmailUrl, '_blank');

    messageInput.value = "";
    closeContact();
}

// ФУНКЦІЯ: Для замовлення конкретного товару (Gmail)
function sendOrder() {
    if (!window.selectedColor) {
        alert("Будь ласка, спочатку оберіть колір!");
        return;
    }

    const recipient = "zippoziga32@gmail.com";
    const subject = encodeURIComponent(`Замовлення: ${window.productName}`);
    const bodyText = encodeURIComponent(
        `НОВЕ ЗАМОВЛЕННЯ\n` +
        `---------------------------\n` +
        `📦 Товар: ${window.productName}\n` +
        `🎨 Колір: ${window.selectedColor}\n` +
        `💰 Ціна: ${window.productPrice} ГРН\n` +
        `---------------------------\n` +
        `⚠️ Натисніть "Надіслати" у вікні Gmail!`
    );

    const gmailUrl = `https://mail.google.com/mail/u/0/?fs=1&to=${recipient}&su=${subject}&body=${bodyText}&tf=cm`;
    window.open(gmailUrl, '_blank');
}

/* =========================================
   2. ФІЛЬТРАЦІЯ ТА СОРТУВАННЯ КАТАЛОГУ
   ========================================= */

function filterProducts() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const categoryId = document.getElementById('categoryFilter').value;
    const cards = document.querySelectorAll('.product-card');
    let visibleCount = 0;

    cards.forEach(card => {
        const name = card.getAttribute('data-name');
        const category = card.getAttribute('data-category');
        
        const matchesSearch = name.includes(searchQuery);
        const matchesCategory = (categoryId === 'all' || category === categoryId);

        if (matchesSearch && matchesCategory) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    const noProducts = document.getElementById('noProducts');
    const grid = document.getElementById('productGrid');
    
    if (visibleCount === 0 && !noProducts && grid) {
        const msg = document.createElement('p');
        msg.id = 'noProducts';
        msg.style.textAlign = 'center';
        msg.style.color = 'white';
        msg.style.gridColumn = '1 / -1';
        msg.innerText = 'Нічого не знайдено за вашим запитом';
        grid.appendChild(msg);
    } else if (visibleCount > 0 && noProducts) {
        noProducts.remove();
    }
}

function sortProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll('.product-card'));
    const sortValue = document.getElementById('priceSort').value;

    if (sortValue === 'default') return;

    cards.sort((a, b) => {
        const priceA = parseFloat(a.getAttribute('data-price'));
        const priceB = parseFloat(b.getAttribute('data-price'));
        return sortValue === 'low-to-high' ? priceA - priceB : priceB - priceA;
    });

    cards.forEach(card => grid.appendChild(card));
}

/* =========================================
   3. ЛОГІКА УЛЮБЛЕНИХ ТОВАРІВ (LocalStorage)
   ========================================= */

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function updateFavoritesUI() {
    const countElement = document.getElementById('favoritesCount');
    if (countElement) {
        countElement.innerText = favorites.length;
        countElement.style.display = favorites.length > 0 ? 'block' : 'none';
    }

    document.querySelectorAll('.product-card').forEach(card => {
        const id = card.getAttribute('data-id');
        const star = card.querySelector('.star-icon');
        if (star) {
            star.innerText = favorites.includes(id) ? '★' : '☆';
            star.classList.toggle('active', favorites.includes(id));
        }
    });
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('star-icon')) {
        const card = e.target.closest('.product-card');
        const id = card.getAttribute('data-id');
        
        const index = favorites.indexOf(id);
        if (index === -1) {
            favorites.push(id);
        } else {
            favorites.splice(index, 1);
        }
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoritesUI();
    }
});

// Ініціалізація при завантаженні
document.addEventListener('DOMContentLoaded', updateFavoritesUI);

function filterProducts() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const categoryId = document.getElementById('categoryFilter').value;
    const cards = document.querySelectorAll('.product-card');
    const grid = document.getElementById('productGrid');
    let visibleCount = 0;

    // 1. Логіка фільтрації
    cards.forEach(card => {
        const name = card.getAttribute('data-name') || "";
        const category = card.getAttribute('data-category') || "";
        
        const matchesSearch = name.includes(searchQuery);
        const matchesCategory = (categoryId === 'all' || category === categoryId);

        if (matchesSearch && matchesCategory) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // 2. Логіка відображення результатів або порожнього стану
    const noProducts = document.querySelector('.empty-state');
    
    if (visibleCount === 0) {
        // Якщо результатів немає, показуємо красиве вікно (якщо його ще немає)
        if (!noProducts && grid) {
            grid.insertAdjacentHTML('beforeend', `
                <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 50px;">
                    <div style="font-size: 60px;"></div>
                    <h3 style="color: #fff; margin-top: 20px;">Упс! Таких моделей поки немає</h3>
                    <p style="color: #666;">Спробуйте змінити фільтри або написати нам у Зв'язок</p>
                    <button onclick="location.reload()" class="buy-btn" style="margin-top: 20px; cursor: pointer;">Скинути все</button>
                </div>
            `);
        }
    } else {
        // Якщо результати є, видаляємо повідомлення про порожній стан
        if (noProducts) noProducts.remove();
    }
}