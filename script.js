/* ═══════════════════════════════════════════════════════
   ICOSIUM STORE — Complete & Fixed Storefront Script
═══════════════════════════════════════════════════════ */

// ─── 0. إعداد SUPABASE ───
const { createClient } = supabase;
const SUPABASE_URL = 'https://vhrvdkaqlrwplkdgwwkl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZocnZka2FxbHJ3cGxrZGd3d2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzOTUyMTAsImV4cCI6MjA3ODk3MTIxMH0.mNAn3qo48y46FDkDOqUVt1xwN2smFMZL1lBNbT0OkTA';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── 1. الترجمات ───
const translations = {
    ar: {
        out_of_stock: "نفاذ الكمية",
        nav_home: "الرئيسية", nav_category: "الفئات", nav_trend: "الرائج", nav_about: "من نحن", nav_contact: "اتصل بنا",
        hero_title: "اكتشف مجموعتنا الجديدة", hero_subtitle: "تصميم عصري بجودة عالية",
        products_title: "منتجاتنا", category_all: "الكل",
        about_title: "عن ICOSIUM",
        about_history_text: "في عام 140 قبل الميلاد، أسس الفينيقيون 'إيكوزيم' على ساحل شمال إفريقيا — القلب القديم لما يعرف اليوم بالجزائر العاصمة. مرت قرون، وقامت إمبراطوريات وسقطت. ومع ذلك، فإن روح إيكوزيم لا تزال حية.",
        about_why_title: "لماذا تختار ICOSIUM؟",
        about_why_text: "لأن ما ترتديه يجب أن يحمل معنى. في ICOSIUM، كل قطعة تحكي قصة أرض وثقافة وجيل لا يخشى التميز.",
        reviews_title: "آراء الزبائن", btn_write_review: "أكتب رأيك", review_form_title: "شاركنا تجربتك",
        contact_title: "تواصل معنا", contact_message_title: "راسلنا مباشرة", contact_send: "إرسال",
        cart_title: "السلة", cart_total: "الإجمالي", checkout_title: "إتمام الطلب",
        form_name: "الاسم", form_phone: "الهاتف", form_address: "العنوان", delivery_fee: "التوصيل", form_confirm: "تأكيد",
        alert_color: "يرجى اختيار اللون", alert_size: "يرجى اختيار المقاس", alert_added: "تمت الإضافة للسلة بنجاح!", alert_order_success: "تم إرسال طلبك بنجاح! شكراً لثقتكم.",
        colors: "الألوان:", sizes: "المقاسات:", search_placeholder: "ابحث عن منتج..."
    },
    fr: {
        out_of_stock: "Rupture de stock",
        nav_home: "Accueil", nav_category: "Catégorie", nav_trend: "Tendance", nav_about: "À Propos", nav_contact: "Contact",
        hero_title: "Découvrez notre nouvelle collection", hero_subtitle: "Design moderne, qualité supérieure",
        products_title: "Nos Produits", category_all: "Tout",
        about_title: "À propos d'ICOSIUM",
        about_history_text: "En 140 av. J.-C., les Phéniciens fondèrent Ikosim sur la côte nord-africaine — le cœur antique de l'actuelle Alger. Des siècles ont passé, des empires se sont élevés et effondrés. Pourtant, l'esprit d'Ikosim perdure.",
        about_why_title: "Pourquoi choisir ICOSIUM",
        about_why_text: "Parce que ce que vous portez doit avoir du sens. Chez ICOSIUM, chaque pièce raconte une histoire — celle d'une terre, d'une culture et d'une génération qui n'a pas peur de se démarquer.",
        reviews_title: "Avis Clients", btn_write_review: "Écrire un avis", review_form_title: "Partagez votre avis",
        contact_title: "Contact", contact_message_title: "Contactez-nous directement", contact_send: "Envoyer",
        cart_title: "Votre Panier", cart_total: "Total", checkout_title: "Commander",
        form_name: "Nom", form_phone: "Tél", form_address: "Adresse", delivery_fee: "Livraison", form_confirm: "Confirmer",
        alert_color: "Veuillez choisir une couleur", alert_size: "Veuillez choisir une taille", alert_added: "Ajouté au panier !", alert_order_success: "Commande envoyée avec succès !",
        colors: "Couleurs:", sizes: "Tailles:", search_placeholder: "Rechercher..."
    },
    en: {
        out_of_stock: "Out of Stock",
        nav_home: "Home", nav_category: "Category", nav_trend: "Trend", nav_about: "About", nav_contact: "Contact",
        hero_title: "Discover our new collection", hero_subtitle: "Modern design, premium quality",
        products_title: "Our Products", category_all: "All",
        about_title: "About ICOSIUM",
        about_history_text: "In 140 B.C.E., the Phoenicians founded Ikosim on the North African coast — the ancient heart of what is today Algiers. Centuries have passed. Empires have risen and fallen. Yet, the spirit of Ikosim still lives on.",
        about_why_title: "Why Choose ICOSIUM",
        about_why_text: "Because what you wear should mean something. At ICOSIUM, every piece tells a story — built for those who value identity over trend.",
        reviews_title: "Customer Reviews", btn_write_review: "Write Review", review_form_title: "Share your experience",
        contact_title: "Contact", contact_message_title: "Contact us directly", contact_send: "Send",
        cart_title: "Your Cart", cart_total: "Total", checkout_title: "Checkout",
        form_name: "Name", form_phone: "Phone", form_address: "Address", delivery_fee: "Delivery", form_confirm: "Confirm",
        alert_color: "Please select a color", alert_size: "Please select a size", alert_added: "Added to cart!", alert_order_success: "Order placed successfully!",
        colors: "Colors:", sizes: "Sizes:", search_placeholder: "Search..."
    }
};

let currentLanguage = localStorage.getItem('icosium_lang') || 'fr';
let allProducts = [];
let cart = [];

const wilayasData = [
    { id: 1, name: "Adrar", price: 1300 }, { id: 2, name: "Chlef", price: 700 }, { id: 3, name: "Laghouat", price: 850 },
    { id: 4, name: "Oum El Bouaghi", price: 700 }, { id: 5, name: "Batna", price: 700 }, { id: 6, name: "Béjaïa", price: 700 },
    { id: 7, name: "Biskra", price: 850 }, { id: 8, name: "Béchar", price: 1100 }, { id: 9, name: "Blida", price: 500 },
    { id: 10, name: "Bouira", price: 600 }, { id: 11, name: "Tamanrasset", price: 1500 }, { id: 12, name: "Tébessa", price: 750 },
    { id: 13, name: "Tlemcen", price: 750 }, { id: 14, name: "Tiaret", price: 750 }, { id: 15, name: "Tizi Ouzou", price: 600 },
    { id: 16, name: "Alger", price: 400 }, { id: 17, name: "Djelfa", price: 800 }, { id: 18, name: "Jijel", price: 700 },
    { id: 19, name: "Sétif", price: 650 }, { id: 20, name: "Saïda", price: 750 }, { id: 21, name: "Skikda", price: 700 },
    { id: 22, name: "Sidi Bel Abbès", price: 700 }, { id: 23, name: "Annaba", price: 700 }, { id: 24, name: "Guelma", price: 700 },
    { id: 25, name: "Constantine", price: 650 }, { id: 26, name: "Médéa", price: 600 }, { id: 27, name: "Mostaganem", price: 700 },
    { id: 28, name: "M'Sila", price: 750 }, { id: 29, name: "Mascara", price: 700 }, { id: 30, name: "Ouargla", price: 1000 },
    { id: 31, name: "Oran", price: 650 }, { id: 32, name: "El Bayadh", price: 900 }, { id: 33, name: "Illizi", price: 1500 },
    { id: 34, name: "Bordj Bou Arreridj", price: 650 }, { id: 35, name: "Boumerdès", price: 500 }, { id: 36, name: "El Tarf", price: 750 },
    { id: 37, name: "Tindouf", price: 1500 }, { id: 38, name: "Tissemsilt", price: 750 }, { id: 39, name: "El Oued", price: 950 },
    { id: 40, name: "Khenchela", price: 750 }, { id: 41, name: "Souk Ahras", price: 750 }, { id: 42, name: "Tipaza", price: 500 },
    { id: 43, name: "Mila", price: 700 }, { id: 44, name: "Aïn Defla", price: 600 }, { id: 45, name: "Naâma", price: 900 },
    { id: 46, name: "Aïn Témouchent", price: 700 }, { id: 47, name: "Ghardaïa", price: 950 }, { id: 48, name: "Relizane", price: 700 },
    { id: 49, name: "El M'Ghair", price: 950 }, { id: 50, name: "El Meniaa", price: 1100 }, { id: 51, name: "Ouled Djellal", price: 900 },
    { id: 52, name: "Bordj Baji Mokhtar", price: 1600 }, { id: 53, name: "Béni Abbès", price: 1200 }, { id: 54, name: "Timimoun", price: 1300 },
    { id: 55, name: "Touggourt", price: 1000 }, { id: 56, name: "Djanet", price: 1600 }, { id: 57, name: "In Salah", price: 1400 },
    { id: 58, name: "In Guezzam", price: 1600 }
];

// ─── 2. إدارة وتخزين السلة (localStorage) ───
function loadCartFromStorage() {
    try {
        const saved = localStorage.getItem('icosium_cart');
        cart = saved ? JSON.parse(saved) : [];
    } catch(e) {
        cart = [];
    }
    updateCartCountHeader();
}

function saveCartToStorage() {
    localStorage.setItem('icosium_cart', JSON.stringify(cart));
    updateCartCountHeader();
}

function updateCartCountHeader() {
    const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = totalItems;
    const countElPage = document.getElementById('cart-count-page');
    if (countElPage) countElPage.textContent = totalItems;
}

function addToCart(item) {
    loadCartFromStorage();
    // إذا كان نفس المنتج ونفس المقاس واللون موجودين مسبقاً، نزيد الكمية
    const existingIndex = cart.findIndex(c => c.id === item.id);
    if (existingIndex > -1) {
        cart[existingIndex].qty += item.qty;
        cart[existingIndex].price += item.price;
    } else {
        cart.push(item);
    }
    saveCartToStorage();
    alert(translations[currentLanguage]?.alert_added || "Ajouté au panier !");
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCartToStorage();
    if (window.location.pathname.includes('cart.html')) {
        renderCartPage();
    }
}

// ─── 3. فحص Coming Soon ───
function checkIsComingSoon(product) {
    if (!product.is_coming_soon) return false;
    if (!product.available_at) return true; // مفعل وبدون تاريخ يبقى قريباً
    const now = new Date();
    const target = new Date(product.available_at);
    return target > now; // يصبح متاحاً إذا وصل التاريخ
}

// ─── 4. تحميل المنتجات والبيانات ───
async function loadInitialData() {
    await getCategories();
    await getProducts();
    await getReviews();
    setLanguage(currentLanguage);
    const savedTheme = localStorage.getItem('icosium_theme') || 'dark';
    applyTheme(savedTheme);
}

async function getCategories() {
    const { data: categories } = await supabaseClient.from('categories').select('*');
    if (!categories) return;

    const filterContainer = document.getElementById('categories-filter');
    const navDropdown = document.querySelector('.dropdown-content');

    if (filterContainer) filterContainer.innerHTML = `<button class="category-btn active" data-id="all">${translations[currentLanguage].category_all}</button>`;
    if (navDropdown) navDropdown.innerHTML = '';

    if (filterContainer && filterContainer.querySelector('[data-id="all"]')) {
        filterContainer.querySelector('[data-id="all"]').addEventListener('click', () => filterProducts('all'));
    }

    categories.forEach(cat => {
        const name = cat[`name_${currentLanguage}`] || cat.name_fr || cat.name;
        if (filterContainer) {
            const btn = document.createElement('button');
            btn.className = 'category-btn';
            btn.textContent = name;
            btn.addEventListener('click', () => {
                filterProducts(cat.id);
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
            filterContainer.appendChild(btn);
        }
        if (navDropdown) {
            const link = document.createElement('a');
            link.href = "index.html#products-section";
            link.textContent = name;
            link.addEventListener('click', () => {
                filterProducts(cat.id);
                document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
            });
            navDropdown.appendChild(link);
        }
    });
}

async function getProducts() {
    const { data: products, error } = await supabaseClient
        .from('products')
        .select('*')
        .eq('is_deleted', false)
        .order('id', { ascending: false });

    if (error) {
        console.error("Error loading products:", error);
        return;
    }
    allProducts = products || [];
    renderProducts(allProducts);
}

async function getReviews() {
    const container = document.querySelector('.reviews-container');
    if (!container) return;
    const { data: reviews } = await supabaseClient.from('reviews').select('*').eq('is_approved', true).order('created_at', { ascending: false });
    if (!reviews || !reviews.length) return;

    container.innerHTML = reviews.map(r => {
        let stars = '';
        for (let i = 1; i <= 5; i++) stars += i <= r.rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        return `
            <div class="review-card">
                <div class="review-header">
                    <div><h4>${r.reviewer_name}</h4><small>${r.reviewer_location || ''}</small></div>
                    <div class="review-stars">${stars}</div>
                </div>
                <p>"${r.review_text}"</p>
            </div>
        `;
    }).join('');
}

// ─── 5. رسم كروت المنتجات ───
function renderProducts(products) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (!products.length) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--color-text-muted);">Aucun produit disponible pour le moment.</p>';
        return;
    }

    products.forEach(p => {
        const isOutOfStock = p.stock <= 0;
        const isComingSoon = checkIsComingSoon(p);
        const outOfStockText = translations[currentLanguage].out_of_stock;

        const card = document.createElement('div');
        card.className = `product-card ${isOutOfStock ? 'out-of-stock' : ''} ${isComingSoon ? 'is-coming-soon' : ''}`;

        card.innerHTML = `
            ${isComingSoon ? '<span class="card-cs-tag">COMING SOON</span>' : (isOutOfStock ? `<div class="out-of-stock-badge">${outOfStockText}</div>` : '')}
            <img src="${p.image_url || 'images/logo3.png'}" class="${isComingSoon ? 'is-coming-soon-blur' : ''}" alt="${p.name}">
            <div class="product-details">
                <h3 class="product-name">${p.name}</h3>
                <p class="product-price">${isComingSoon ? 'Bientôt disponible' : p.price + ' DZD'}</p>
                <div class="product-actions">
                    <button class="details-btn">Détails</button>
                    <button class="add-to-cart-btn" ${isOutOfStock || isComingSoon ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>
                        ${isComingSoon ? 'Bientôt' : (isOutOfStock ? outOfStockText : 'Ajouter')}
                    </button>
                </div>
            </div>
        `;

        card.querySelector('.details-btn').addEventListener('click', () => openDetails(p));
        const addBtn = card.querySelector('.add-to-cart-btn');
        if (!isComingSoon && !isOutOfStock) {
            addBtn.addEventListener('click', () => openDetails(p));
        }

        grid.appendChild(card);
    });
}

function filterProducts(catId) {
    renderProducts(catId === 'all' ? allProducts : allProducts.filter(p => p.category_id == catId));
}

// ─── 6. تفاصيل المنتج المنبثقة (MODAL) ───
let countdownInterval = null;

function openDetails(p) {
    const modal = document.getElementById('product-details-modal');
    if (!modal) return;

    const overlay = document.getElementById('modal-coming-soon-overlay');
    const imageContainer = modal.querySelector('.modal-image-container');
    const infoContainer = modal.querySelector('.modal-info-container');
    const countdownEl = document.getElementById('cs-countdown');

    if (countdownInterval) clearInterval(countdownInterval);

    const isComingSoon = checkIsComingSoon(p);

    if (isComingSoon) {
        if (imageContainer) imageContainer.classList.add('is-coming-soon-blur');
        if (infoContainer) infoContainer.classList.add('is-coming-soon-blur');
        if (overlay) overlay.style.display = 'flex';

        if (p.available_at && countdownEl) {
            countdownEl.style.display = 'block';
            const targetTime = new Date(p.available_at).getTime();

            const updateTimer = () => {
                const now = new Date().getTime();
                const diff = targetTime - now;

                if (diff <= 0) {
                    clearInterval(countdownInterval);
                    if (overlay) overlay.style.display = 'none';
                    if (imageContainer) imageContainer.classList.remove('is-coming-soon-blur');
                    if (infoContainer) infoContainer.classList.remove('is-coming-soon-blur');
                    return;
                }

                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const secs = Math.floor((diff % (1000 * 60)) / 1000);

                countdownEl.textContent = `Disponible dans: ${days}j ${hours}h ${mins}m ${secs}s`;
            };
            updateTimer();
            countdownInterval = setInterval(updateTimer, 1000);
        } else if (countdownEl) {
            countdownEl.style.display = 'none';
        }
    } else {
        if (imageContainer) imageContainer.classList.remove('is-coming-soon-blur');
        if (infoContainer) infoContainer.classList.remove('is-coming-soon-blur');
        if (overlay) overlay.style.display = 'none';
    }

    const mainImg = document.getElementById('modal-product-image');
    if (mainImg) mainImg.src = p.image_url || 'images/logo3.png';

    document.getElementById('modal-product-name').textContent = p.name;
    document.getElementById('modal-product-desc').textContent = p.description || '';
    document.getElementById('modal-product-price').textContent = p.price + ' DZD';

    const opts = document.getElementById('modal-product-options');
    if (opts) {
        opts.innerHTML = '';
        let parsedSizes = [];
        if (p.sizes) {
            try { parsedSizes = typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes; } catch(e) {}
        }

        let availableColors = [];
        let availableSizes = [];
        if (Array.isArray(parsedSizes)) {
            parsedSizes.forEach(s => {
                if (s.color && !availableColors.includes(s.color)) availableColors.push(s.color);
                if (s.size && !availableSizes.includes(s.size)) availableSizes.push(s.size);
            });
        }

        let html = '';
        if (availableColors.length > 0) {
            html += `<div class="modal-opts-group"><label>${translations[currentLanguage].colors}</label><div class="product-colors" style="display:flex; gap:8px; flex-wrap:wrap;">`
                + availableColors.map(c => `<span class="color-box" data-val="${c}" style="border:1.5px solid var(--color-border); padding:6px 14px; border-radius:8px; cursor:pointer; font-weight:600;">${c}</span>`).join('')
                + '</div></div>';
        }
        if (availableSizes.length > 0) {
            html += `<div class="modal-opts-group" style="margin-top:12px;"><label>${translations[currentLanguage].sizes}</label><div class="product-sizes" style="display:flex; gap:8px; flex-wrap:wrap;">`
                + availableSizes.map(s => `<span class="size-box" data-val="${s}" style="border:1.5px solid var(--color-border); padding:6px 14px; border-radius:8px; cursor:pointer; font-weight:600;">${s}</span>`).join('')
                + '</div></div>';
        }

        // اختيار الكمية
        html += `
            <div class="modal-opts-group" style="margin-top:14px;">
                <label>Quantité</label>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <button type="button" id="qty-minus" style="width:36px; height:36px; border:1px solid var(--color-border); background:var(--color-bg); border-radius:8px; cursor:pointer; font-weight:bold;">-</button>
                    <input type="number" id="modal-product-qty" value="1" min="1" max="50" style="width:60px; height:36px; text-align:center; border:1px solid var(--color-border); border-radius:8px; background:var(--color-bg); color:var(--color-text); font-weight:bold;">
                    <button type="button" id="qty-plus" style="width:36px; height:36px; border:1px solid var(--color-border); background:var(--color-bg); border-radius:8px; cursor:pointer; font-weight:bold;">+</button>
                </div>
            </div>
        `;
        opts.innerHTML = html;

        let selColor = availableColors.length > 0 ? null : 'Standard';
        let selSize = availableSizes.length > 0 ? null : 'Standard';

        opts.querySelectorAll('.color-box').forEach(b => b.addEventListener('click', e => {
            opts.querySelectorAll('.color-box').forEach(x => { x.style.borderColor = 'var(--color-border)'; x.style.backgroundColor = 'transparent'; x.style.color = 'var(--color-text)'; });
            e.target.style.borderColor = 'var(--color-primary)'; e.target.style.backgroundColor = 'var(--color-primary)'; e.target.style.color = '#fff';
            selColor = e.target.dataset.val;
        }));

        opts.querySelectorAll('.size-box').forEach(b => b.addEventListener('click', e => {
            opts.querySelectorAll('.size-box').forEach(x => { x.style.borderColor = 'var(--color-border)'; x.style.backgroundColor = 'transparent'; x.style.color = 'var(--color-text)'; });
            e.target.style.borderColor = 'var(--color-primary)'; e.target.style.backgroundColor = 'var(--color-primary)'; e.target.style.color = '#fff';
            selSize = e.target.dataset.val;
        }));

        const qtyInput = document.getElementById('modal-product-qty');
        document.getElementById('qty-minus')?.addEventListener('click', () => {
            let val = parseInt(qtyInput.value) || 1;
            if (val > 1) qtyInput.value = val - 1;
        });
        document.getElementById('qty-plus')?.addEventListener('click', () => {
            let val = parseInt(qtyInput.value) || 1;
            qtyInput.value = val + 1;
        });

        const cartBtn = document.getElementById('modal-add-to-cart-btn');
        const newCartBtn = cartBtn.cloneNode(true);
        cartBtn.parentNode.replaceChild(newCartBtn, cartBtn);

        if (isComingSoon) {
            newCartBtn.disabled = true;
            newCartBtn.style.opacity = '0.5';
            newCartBtn.textContent = "Bientôt disponible";
        } else {
            newCartBtn.disabled = false;
            newCartBtn.style.opacity = '1';
            newCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Ajouter au panier';
            newCartBtn.addEventListener('click', () => {
                if (availableColors.length > 0 && !selColor) return alert(translations[currentLanguage].alert_color);
                if (availableSizes.length > 0 && !selSize) return alert(translations[currentLanguage].alert_size);

                const quantity = parseInt(qtyInput?.value, 10) || 1;
                addToCart({
                    id: `${p.id}-${selColor}-${selSize}`,
                    product_id: p.id,
                    name: p.name,
                    color: selColor,
                    size: selSize,
                    qty: quantity,
                    unit_price: parseFloat(p.price),
                    price: parseFloat(p.price) * quantity
                });
                modal.style.display = 'none';
            });
        }
    }

    modal.style.display = 'block';
}

// ─── 7. صفحة السلة (CART.HTML) والولايات ───
function populateWilayas() {
    const wilayaSelect = document.getElementById('checkout-wilaya');
    if (!wilayaSelect) return;

    wilayaSelect.innerHTML = '<option value="" disabled selected>Choisir Wilaya</option>';
    wilayasData.forEach(w => {
        const opt = document.createElement('option');
        opt.value = w.price;
        opt.textContent = `${w.id} - ${w.name} (+${w.price} DA)`;
        wilayaSelect.appendChild(opt);
    });

    wilayaSelect.addEventListener('change', (e) => {
        const fee = parseFloat(e.target.value) || 0;
        const feeDisplay = document.getElementById('delivery-fee-display');
        if (feeDisplay) feeDisplay.textContent = fee;
        calcFinalTotalPage();
    });
}

function renderCartPage() {
    const container = document.getElementById('cart-items-container-page');
    const totalEl = document.getElementById('cart-total-price-page');
    if (!container) return;

    container.innerHTML = '';
    let subtotal = 0;

    if (!cart.length) {
        container.innerHTML = '<p style="text-align:center; padding:30px; color:var(--color-text-muted);">Votre panier est vide.</p>';
    } else {
        cart.forEach((item, i) => {
            subtotal += item.price;
            container.innerHTML += `
                <div class="cart-item-row" style="display:flex; justify-content:space-between; align-items:center; padding:16px 0; border-bottom:1px solid var(--color-border);">
                    <div class="cart-item-info">
                        <h4 style="margin:0; font-size:1rem;">${item.name}</h4>
                        <small style="color:var(--color-text-muted);">Couleur: ${item.color || '-'} | Taille: ${item.size || '-'} | Qté: <strong>${item.qty || 1}</strong></small>
                    </div>
                    <div style="display:flex; align-items:center; gap:16px;">
                        <span style="font-weight:700; color:var(--color-primary);">${item.price} DZD</span>
                        <i class="fas fa-trash" style="color:#ef4444; cursor:pointer; font-size:1.1rem;" onclick="removeFromCart(${i})"></i>
                    </div>
                </div>
            `;
        });
    }

    if (totalEl) totalEl.textContent = subtotal;
    calcFinalTotalPage();
}

function calcFinalTotalPage() {
    const totalEl = document.getElementById('cart-total-price-page');
    const feeDisplay = document.getElementById('delivery-fee-display');
    const finalDisplay = document.getElementById('final-total-price');

    if (!totalEl || !feeDisplay || !finalDisplay) return;
    const subtotal = parseFloat(totalEl.textContent) || 0;
    const fee = parseFloat(feeDisplay.textContent) || 0;
    finalDisplay.textContent = subtotal + fee;
}

// ─── 8. إعدادات الثيم واللغة والتشغيل عند التحميل ───
function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('icosium_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-key]').forEach(el => {
        const k = el.getAttribute('data-key');
        if (translations[lang][k]) el.textContent = translations[lang][k];
    });

    const langSelect = document.getElementById('language-switcher');
    if (langSelect) langSelect.value = lang;
}

function applyTheme(theme) {
    const icon = document.querySelector('#dark-mode-toggle i');
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        if (icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
    } else {
        document.body.classList.remove('dark-mode');
        if (icon) { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
    }
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    const newTheme = isDark ? 'dark' : 'light';
    localStorage.setItem('icosium_theme', newTheme);
    applyTheme(newTheme);
}

// ─── 9. البدء والتنفيذ ───
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromStorage();

    // فحص ما إذا كنا في صفحة cart.html أو index.html
    if (window.location.pathname.includes('cart.html')) {
        populateWilayas();
        renderCartPage();

        // إرسال الطلب إلى قاعدة البيانات
        const form = document.getElementById('checkout-form-page');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (!cart.length) return alert('Votre panier est vide !');

                const btn = document.getElementById('checkout-submit-btn');
                btn.disabled = true;
                btn.textContent = "Envoi en cours...";

                const wilayaSelect = document.getElementById('checkout-wilaya');
                const wilayaName = wilayaSelect.options[wilayaSelect.selectedIndex].text.split(' (+')[0];

                const orderData = {
                    customer_name: document.getElementById('checkout-name').value.trim(),
                    customer_phone: document.getElementById('checkout-phone').value.trim(),
                    customer_address: `${wilayaName} - ${document.getElementById('checkout-address').value.trim()}`,
                    items: cart,
                    total_price: parseFloat(document.getElementById('final-total-price').textContent) || 0,
                    delivery_fee: parseFloat(document.getElementById('delivery-fee-display').textContent) || 0,
                    status: 'Pending'
                };

                const { error } = await supabaseClient.from('orders').insert([orderData]);

                if (error) {
                    console.error("Order error:", error);
                    alert("Erreur lors de la commande. Veuillez réessayer.");
                    btn.disabled = false;
                    btn.textContent = "Confirmer la commande";
                } else {
                    alert(translations[currentLanguage]?.alert_order_success || "Commande réussie ! Merci.");
                    cart = [];
                    saveCartToStorage();
                    window.location.href = 'index.html';
                }
            });
        }
    } else {
        loadInitialData();
    }

    // زر السلة العلوي: توجيه مباشر دائماً إلى cart.html
    const cartButton = document.getElementById('cart-button');
    if (cartButton) {
        cartButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    }

    // زر الثيم واللغة
    document.getElementById('dark-mode-toggle')?.addEventListener('click', toggleTheme);
    document.getElementById('language-switcher')?.addEventListener('change', e => setLanguage(e.target.value));

    // زر البحث
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-button');
    if (searchInput) {
        const doSearch = () => {
            const q = searchInput.value.toLowerCase().trim();
            renderProducts(allProducts.filter(p => p.name.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q))));
        };
        searchInput.addEventListener('input', doSearch);
        searchBtn?.addEventListener('click', doSearch);
    }

    // إغلاق النوافذ المنبثقة
    document.querySelectorAll('.close-btn').forEach(b => b.addEventListener('click', e => e.target.closest('.modal').style.display = 'none'));
    window.onclick = e => { if (e.target.classList.contains('modal')) e.target.style.display = 'none'; };

    // القائمة الجانبية في الهاتف
    const nav = document.getElementById('main-nav');
    const overlay = document.getElementById('nav-overlay');
    document.getElementById('burger-menu-btn')?.addEventListener('click', () => { nav?.classList.add('nav-active'); overlay?.classList.add('overlay-active'); });
    const closeMenu = () => { nav?.classList.remove('nav-active'); overlay?.classList.remove('overlay-active'); };
    document.getElementById('close-nav-btn')?.addEventListener('click', closeMenu);
    overlay?.addEventListener('click', closeMenu);

    // زر Scroll to products
    document.getElementById('scroll-to-products')?.addEventListener('click', () => {
        document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
    });
});
