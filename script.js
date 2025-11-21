// ---------------------------------------------------
// ملف script.js النهائي (مع حفظ الإعدادات - LocalStorage)
// ---------------------------------------------------

// --- 0. إعداد Supabase ---
const { createClient } = supabase;
const SUPABASE_URL = 'https://vhrvdkaqlrwplkdgwwkl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZocnZka2FxbHJ3cGxrZGd3d2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzOTUyMTAsImV4cCI6MjA3ODk3MTIxMH0.mNAn3qo48y46FDkDOqUVt1xwN2smFMZL1lBNbT0OkTA';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log('Supabase client is ready!');

// --- 1. الترجمة الكاملة ---
const translations = {
    ar: {
        nav_home: "الرئيسية", nav_category: "الفئات", nav_trend: "الرائج", nav_about: "من نحن", nav_contact: "اتصل بنا",
        hero_title: "اكتشف مجموعتنا الجديدة", hero_subtitle: "تصميم عصري بجودة عالية",
        products_title: "منتجاتنا", category_all: "الكل",
        about_title: "عن ICOSIUM",
        about_history_text: "في عام 140 قبل الميلاد، أسس الفينيقيون 'إيكوزيم' على ساحل شمال إفريقيا — القلب القديم لما يعرف اليوم بالجزائر العاصمة. مرت قرون، وقامت إمبراطوريات وسقطت. ومع ذلك، فإن روح إيكوزيم لا تزال حية. من تلك الطاقة الخالدة، ولدت ICOSIUM كعلامة تجارية جزائرية عصرية تمزج بين التراث والأناقة المعاصرة. نحن نجلب روح الماضي إلى عالم اليوم — ونصمم ملابس تعبر عن الهوية والإبداع والهدف. مهمتنا هي إعادة تعريف الموضة المحلية لجيل جديد يقدر الأصالة والشجاعة. ICOSIUM ليست مجرد علامة تجارية، إنها حركة وجسر بين الروح القديمة والحياة العصرية.",
        about_why_title: "لماذا تختار ICOSIUM؟",
        about_why_text: "لأن ما ترتديه يجب أن يحمل معنى. في ICOSIUM، كل قطعة تحكي قصة — قصة أرض وثقافة وجيل لا يخشى التميز. نحن لا نصنع الملابس فحسب؛ بل نخلق صلة بين روح الجزائر العريقة والروح الحديثة لشبابها. تصاميمنا أصيلة، ومصممة بعناية لتدوم — صُنعت لأولئك الذين يقدرون الهوية على الموضة العابرة، والمعنى على الإنتاج الضخم. عندما ترتدي ICOSIUM، فأنت ترتدي التراث والإبداع والثقة — لأن الأناقة الحقيقية تبدأ من الداخل.",
        reviews_title: "آراء الزبائن", btn_write_review: "أكتب رأيك", review_form_title: "شاركنا تجربتك",
        contact_title: "تواصل معنا", contact_message_title: "راسلنا مباشرة", contact_send: "إرسال",
        cart_title: "السلة", cart_total: "الإجمالي", checkout_title: "إتمام الطلب", 
        form_name: "الاسم", form_phone: "الهاتف", form_address: "العنوان", delivery_fee: "التوصيل", form_confirm: "تأكيد",
        alert_color: "اختر اللون", alert_size: "اختر المقاس", alert_added: "تمت الإضافة للسلة", alert_order_success: "تم الطلب بنجاح!",
        colors: "الألوان:", sizes: "المقاسات:", search_placeholder: "ابحث عن منتج..."
    },
    fr: {
        nav_home: "Accueil", nav_category: "Catégorie", nav_trend: "Tendance", nav_about: "À Propos", nav_contact: "Contact",
        hero_title: "Découvrez notre nouvelle collection", hero_subtitle: "Design moderne, qualité supérieure",
        products_title: "Nos Produits", category_all: "Tout",
        about_title: "À propos d'ICOSIUM",
        about_history_text: "En 140 av. J.-C., les Phéniciens fondèrent Ikosim sur la côte nord-africaine — le cœur antique de l'actuelle Alger. Des siècles ont passé, des empires se sont élevés et effondrés. Pourtant, l'esprit d'Ikosim perdure. Née de cette énergie intemporelle, ICOSIUM est une marque algérienne moderne qui allie héritage et style contemporain. Nous transportons l'âme du passé dans le monde d'aujourd'hui, créant des vêtements qui expriment identité et créativité. ICOSIUM est plus qu'une marque. C'est un mouvement — un pont entre l'esprit ancien et la vie moderne.",
        about_why_title: "Pourquoi choisir ICOSIUM",
        about_why_text: "Parce que ce que vous portez doit avoir du sens. Chez ICOSIUM, chaque pièce raconte une histoire — celle d'une terre, d'une culture et d'une génération qui n'a pas peur de se démarquer. Nous créons un lien entre l'âme ancienne de l'Algérie et l'esprit moderne de sa jeunesse. Nos designs sont authentiques, pensés avec soin et faits pour durer — pour ceux qui privilégient l'identité sur la tendance et le sens sur la production de masse. Porter ICOSIUM, c'est porter l'héritage, la créativité et la confiance — car le vrai style vient de l'intérieur.",
        reviews_title: "Avis Clients", btn_write_review: "Écrire un avis", review_form_title: "Partagez votre avis",
        contact_title: "Contact", contact_message_title: "Contactez-nous directement", contact_send: "Envoyer",
        cart_title: "Votre Panier", cart_total: "Total", checkout_title: "Commander", 
        form_name: "Nom", form_phone: "Tél", form_address: "Adresse", delivery_fee: "Livraison", form_confirm: "Confirmer",
        alert_color: "Choisir une couleur", alert_size: "Choisir une taille", alert_added: "Ajouté au panier", alert_order_success: "Commande envoyée!",
        colors: "Couleurs:", sizes: "Tailles:", search_placeholder: "Rechercher..."
    },
    en: {
        nav_home: "Home", nav_category: "Category", nav_trend: "Trend", nav_about: "About", nav_contact: "Contact",
        hero_title: "Discover our new collection", hero_subtitle: "Modern design, premium quality",
        products_title: "Our Products", category_all: "All",
        about_title: "About ICOSIUM",
        about_history_text: "In 140 B.C.E., the Phoenicians founded Ikosim on the North African coast — the ancient heart of what is today Algiers. Centuries have passed. Empires have risen and fallen. Yet, the spirit of Ikosim still lives on. Born from that timeless energy, ICOSIUM is a modern Algerian casualwear brand that blends heritage with contemporary style. We bring the soul of the past into today’s world — crafting clothing that expresses identity, creativity, and purpose. ICOSIUM is more than a brand. It’s a movement — a bridge between ancient spirit and modern life.",
        about_why_title: "Why Choose ICOSIUM",
        about_why_text: "Because what you wear should mean something. At ICOSIUM, every piece tells a story — the story of a land, a culture, and a generation unafraid to stand out. We don’t just make clothes; we create a connection between the old soul of Algeria and the modern spirit of its youth. Our designs are authentic, thoughtfully crafted, and made to last — built for those who value identity over trend and meaning over mass production. When you wear ICOSIUM, you wear heritage, creativity, and confidence — because true style starts from within.",
reviews_title: "Customer Reviews", btn_write_review: "Write Review", review_form_title: "Share your experience",
        contact_title: "Contact", contact_message_title: "Contact us directly", contact_send: "Send",
        cart_title: "Your Cart", cart_total: "Total", checkout_title: "Checkout", 
        form_name: "Name", form_phone: "Phone", form_address: "Address", delivery_fee: "Delivery", form_confirm: "Confirm",
        alert_color: "Select color", alert_size: "Select size", alert_added: "Added to cart", alert_order_success: "Order placed!",
        colors: "Colors:", sizes: "Sizes:", search_placeholder: "Search..."
    }
};

// ✅ التعديل 1: تحميل اللغة المحفوظة أو استخدام الفرنسية كافتراضي
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

// --- 2. دوال السلة (localStorage) ---
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('icosium_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCountHeader();
    }
}

function saveCartToStorage() {
    localStorage.setItem('icosium_cart', JSON.stringify(cart));
    updateCartCountHeader();
}

function updateCartCountHeader() {
    const countEl = document.getElementById('cart-count');
    if(countEl) countEl.textContent = cart.length;
    const countElPage = document.getElementById('cart-count-page');
    if(countElPage) countElPage.textContent = cart.length;
}

function addToCart(item) {
    cart.push(item);
    saveCartToStorage();
    alert(translations[currentLanguage]?.alert_added || "Ajouté au panier");
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCartToStorage();
    if (window.location.pathname.includes('cart.html')) {
        renderCartPage();
    }
}

// --- 3. دالة ملء الولايات ---
function populateWilayas() {
    const wilayaSelect = document.getElementById('checkout-wilaya');
    if(!wilayaSelect) return;

    wilayaSelect.innerHTML = '<option value="" disabled selected>Choisir Wilaya</option>';

    wilayasData.forEach(wilaya => {
        const option = document.createElement('option');
        option.value = wilaya.price; 
        option.textContent = `${wilaya.id} - ${wilaya.name} (+${wilaya.price} DA)`;
        wilayaSelect.appendChild(option);
    });

    wilayaSelect.addEventListener('change', (e) => {
        const deliveryPrice = parseFloat(e.target.value) || 0;
        const feeDisplay = document.getElementById('delivery-fee-display');
        if(feeDisplay) feeDisplay.textContent = deliveryPrice;
        if (window.location.pathname.includes('cart.html')) {
            calcFinalTotalPage();
        }
    });
}

// --- 4. التحميل الأولي ---
async function loadInitialData() {
    await getCategories();
    await getProducts();
    await getReviews(); 
    setLanguage(currentLanguage);
    
    // ✅ التعديل 2: تطبيق الثيم المحفوظ عند التحميل
    const savedTheme = localStorage.getItem('icosium_theme') || 'light';
    applyTheme(savedTheme);
}

async function getCategories() {
    let { data: categories } = await supabaseClient.from('categories').select('*');
    if (!categories) return;

    const filterContainer = document.getElementById('categories-filter');
    const navDropdown = document.querySelector('.dropdown-content');
    
    if(filterContainer) filterContainer.innerHTML = `<button class="category-btn active" data-id="all">${translations[currentLanguage].category_all}</button>`;
    if(navDropdown) navDropdown.innerHTML = '';

    if(filterContainer && filterContainer.querySelector('[data-id="all"]')) {
        filterContainer.querySelector('[data-id="all"]').addEventListener('click', () => filterProducts('all'));
    }

    categories.forEach(cat => {
        const name = cat[`name_${currentLanguage}`] || cat.name;
        
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
                if (!window.location.pathname.includes('cart.html')) {
                    filterProducts(cat.id);
                    const section = document.getElementById('products-section');
                    if(section) section.scrollIntoView({behavior:'smooth'});
                } else {
                    window.location.href = 'index.html#products-section';
                }
                if (typeof closeMenu === 'function') closeMenu();
            });
            navDropdown.appendChild(link);
        }
    });
}

async function getProducts() {
    let { data: products } = await supabaseClient.from('products').select('*');
    if (products) { allProducts = products; renderProducts(allProducts); }
}

async function getReviews() {
    if (!document.querySelector('.reviews-container')) return;
    let { data: reviews } = await supabaseClient.from('reviews').select('*').eq('is_approved', true).order('created_at', {ascending: false});
    if (reviews && reviews.length > 0) renderReviews(reviews);
}

// --- 5. العرض (Render) ---
function renderProducts(products) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = '';
    if(!products.length) { grid.innerHTML = '<p style="text-align:center; width:100%;">Aucun produit.</p>'; return; }

    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const colorsHtml = Array.isArray(p.colors) ? p.colors.map(c => `<span class="color-dot" style="background:${c.replace(/"/g,'')}" title="${c}" data-val="${c.replace(/"/g,'')}"></span>`).join('') : '';
        const sizesHtml = Array.isArray(p.sizes) ? p.sizes.map(s => `<span class="size-box" data-val="${s.replace(/"/g,'')}">${s.replace(/"/g,'')}</span>`).join('') : '';

        card.innerHTML = `
            <img src="${p.image_url}" alt="${p.name}">
            <div class="product-details">
                <h3 class="product-name">${p.name}</h3>
                <div class="product-options">
                    ${colorsHtml ? `<div class="product-colors">${colorsHtml}</div>` : ''}
                    ${sizesHtml ? `<div class="product-sizes">${sizesHtml}</div>` : ''}
                </div>
                <p class="product-price">${p.price} DZD</p>
                <div class="product-actions">
                    <button class="add-to-cart-btn">Ajouter</button>
                    <button class="details-btn">Détails</button>
                </div>
            </div>
        `;
        addCardLogic(card, p);
        grid.appendChild(card);
    });
}

function renderReviews(reviews) {
    const container = document.querySelector('.reviews-container');
    if (!container) return;
    container.innerHTML = '';
    reviews.forEach(r => {
        let stars = '';
        for(let i=1; i<=5; i++) stars += i <= r.rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        container.innerHTML += `
            <div class="review-card">
                <div class="review-header">
                    <div><h4>${r.reviewer_name}</h4><small>${r.reviewer_location||''}</small></div>
                    <div class="review-stars">${stars}</div>
                </div>
                <p>"${r.review_text}"</p>
            </div>`;
    });
}

function addCardLogic(card, product) {
    let selColor=null, selSize=null;
    card.querySelectorAll('.color-dot').forEach(d => d.addEventListener('click', e => {
        card.querySelectorAll('.color-dot').forEach(x=>x.classList.remove('selected')); e.target.classList.add('selected'); selColor = e.target.dataset.val;
    }));
    card.querySelectorAll('.size-box').forEach(b => b.addEventListener('click', e => {
        card.querySelectorAll('.size-box').forEach(x=>x.classList.remove('selected')); e.target.classList.add('selected'); selSize = e.target.dataset.val;
    }));
    
    card.querySelector('.add-to-cart-btn').addEventListener('click', () => {
        if(product.colors?.length && !selColor) return alert(translations[currentLanguage].alert_color);
        if(product.sizes?.length && !selSize) return alert(translations[currentLanguage].alert_size);
        addToCart({ id: `${product.id}-${selColor}-${selSize}`, ...product, color: selColor, size: selSize, qty: 1 });
    });

    card.querySelector('.details-btn').addEventListener('click', () => openDetails(product));
}

function filterProducts(catId) {
    renderProducts(catId === 'all' ? allProducts : allProducts.filter(p => p.category_id == catId));
}

// --- 6. صفحة السلة (cart.html) ---
function renderCartPage() {
    const container = document.getElementById('cart-items-container-page');
    const totalEl = document.getElementById('cart-total-price-page');
    
    if (!container) return; 

    container.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:20px;">Votre panier est vide.</p>';
    } else {
        cart.forEach((item, i) => {
            total += item.price;
            container.innerHTML += `
                <div class="cart-item-row" style="display:flex; justify-content:space-between; align-items:center; padding:15px 0; border-bottom:1px solid #eee;">
                    <div class="cart-item-info">
                        <h4 style="margin:0;">${item.name}</h4>
                        <small style="color:#666;">Couleur: ${item.color || '-'} | Taille: ${item.size || '-'}</small>
                    </div>
                    <div style="display:flex; align-items:center; gap:15px;">
                        <span style="font-weight:bold; color:var(--color-primary);">${item.price} DA</span>
                        <i class="fas fa-trash" style="color:red; cursor:pointer;" onclick="removeFromCart(${i})"></i>
                    </div>
                </div>`;
        });
    }

    if(totalEl) totalEl.textContent = total;
    calcFinalTotalPage();
}

function calcFinalTotalPage() {
    const totalEl = document.getElementById('cart-total-price-page');
    const feeDisplay = document.getElementById('delivery-fee-display');
    const finalDisplay = document.getElementById('final-total-price');

    if(!totalEl || !feeDisplay || !finalDisplay) return;

    const cartTotal = parseFloat(totalEl.textContent) || 0;
    const deliveryFee = parseFloat(feeDisplay.textContent) || 0;

    finalDisplay.textContent = cartTotal + deliveryFee;
}

// --- 7. مودال التفاصيل ---
function openDetails(p) {
    const m = document.getElementById('product-details-modal');
    if(!m) return;

    document.getElementById('modal-product-image').src = p.image_url;
    document.getElementById('modal-product-name').textContent = p.name;
    document.getElementById('modal-product-desc').textContent = p.description || '-';
    document.getElementById('modal-product-price').textContent = p.price + ' DZD';
    
    const opts = document.getElementById('modal-product-options');
    let html = '';
    if(p.colors) html += `<div>${translations[currentLanguage].colors} ` + p.colors.map(c=>`<span class="color-dot" style="background:${c.replace(/"/g,'')}" data-val="${c.replace(/"/g,'')}"></span>`).join('') + '</div>';
    if(p.sizes) html += `<div>${translations[currentLanguage].sizes} ` + p.sizes.map(s=>`<span class="size-box" data-val="${s.replace(/"/g,'')}">${s.replace(/"/g,'')}</span>`).join('') + '</div>';
    opts.innerHTML = html;
    
    let selColor, selSize;
    opts.querySelectorAll('.color-dot').forEach(d=>d.addEventListener('click', e=>{opts.querySelectorAll('.color-dot').forEach(x=>x.classList.remove('selected')); e.target.classList.add('selected'); selColor=e.target.dataset.val;}));
    opts.querySelectorAll('.size-box').forEach(b=>b.addEventListener('click', e=>{opts.querySelectorAll('.size-box').forEach(x=>x.classList.remove('selected')); e.target.classList.add('selected'); selSize=e.target.dataset.val;}));
    
    const btn = document.getElementById('modal-add-to-cart-btn');
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', () => {
        if(p.colors?.length && !selColor) return alert(translations[currentLanguage].alert_color);
        if(p.sizes?.length && !selSize) return alert(translations[currentLanguage].alert_size);
        addToCart({ id: `${p.id}-${selColor}-${selSize}`, ...p, color: selColor, size: selSize, qty: 1 });
        m.style.display='none';
    });

    m.style.display = 'block';
}

// --- 8. دوال اللغة والثيم (المعدلة للحفظ) ---

function setLanguage(lang) {
    currentLanguage = lang;
    // ✅ حفظ اللغة في التخزين المحلي
    localStorage.setItem('icosium_lang', lang);

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    document.querySelectorAll('[data-key]').forEach(el => {
        const k = el.getAttribute('data-key');
        if(translations[lang][k]) el.textContent = translations[lang][k];
    });
    
    const search = document.getElementById('search-input');
    if(search) search.placeholder = translations[lang].search_placeholder;
    
    // تحديث القائمة المنسدلة للغة لتعكس القيمة الحالية
    const langSelect = document.getElementById('language-switcher');
    if (langSelect) langSelect.value = lang;

    getCategories();
}

// دالة تطبيق الثيم
function applyTheme(theme) {
    const icon = document.querySelector('#dark-mode-toggle i');
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        if(icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
    } else {
        document.body.classList.remove('dark-mode');
        if(icon) { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
    }
}

// تبديل الثيم وحفظه
function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    const newTheme = isDark ? 'dark' : 'light';
    localStorage.setItem('icosium_theme', newTheme); // حفظ
    applyTheme(newTheme); // تحديث الأيقونة
}

// --- 9. تشغيل عند التحميل ---
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. تحميل البيانات
    loadInitialData();
    
    // 2. تحميل السلة
    loadCartFromStorage();

    // 3. ملء الولايات
    populateWilayas(); 

    // 4. زر السلة
  // 3. إدارة زر السلة (Redirect)
    const cartBtn = document.getElementById('cart-button');
    if (cartBtn) {
        // استنساخ الزر لإزالة أي مستمعين قدامى (بدون إضافة عناصر جديدة)
        const newCartBtn = cartBtn.cloneNode(true);
        cartBtn.parentNode.replaceChild(newCartBtn, cartBtn);
        
        // إضافة حدث النقر فقط
        newCartBtn.addEventListener('click', () => {
            window.location.href = 'cart.html';
        });
    }

    // 5. زر الوضع الداكن (ربطه بالدالة الجديدة)
    const darkModeBtn = document.getElementById('dark-mode-toggle');
    if (darkModeBtn) {
        // إزالة المستمعين القدامى
        const newDarkModeBtn = darkModeBtn.cloneNode(true);
        darkModeBtn.parentNode.replaceChild(newDarkModeBtn, darkModeBtn);
        newDarkModeBtn.addEventListener('click', toggleTheme);
    }

    // 6. قائمة اللغة (ربطها بالدالة الجديدة)
    const langSwitcher = document.getElementById('language-switcher');
    if (langSwitcher) {
        langSwitcher.addEventListener('change', e => setLanguage(e.target.value));
    }

    // 7. صفحة السلة
    if (window.location.pathname.includes('cart.html')) {
        renderCartPage(); 

        const formPage = document.getElementById('checkout-form-page');
        if (formPage) {
            formPage.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (cart.length === 0) return alert('Votre panier est vide !');

                const submitBtn = document.getElementById('checkout-submit-btn');
                submitBtn.textContent = "Envoi en cours...";
                submitBtn.disabled = true;

                const wilayaSelect = document.getElementById('checkout-wilaya');
                const wilayaName = wilayaSelect.options[wilayaSelect.selectedIndex].text;

                const orderData = {
                    customer_name: document.getElementById('checkout-name').value,
                    customer_phone: document.getElementById('checkout-phone').value,
                    customer_address: `${wilayaName} - ${document.getElementById('checkout-address').value}`,
                    items: cart,
                    total_price: parseFloat(document.getElementById('final-total-price').textContent),
                    delivery_fee: parseFloat(document.getElementById('delivery-fee-display').textContent),
                    status: 'Pending'
                };

                const { error } = await supabaseClient.from('orders').insert(orderData);

                if (error) {
                    console.error(error);
                    alert("Erreur lors de la commande.");
                    submitBtn.textContent = "Confirmer la commande";
                    submitBtn.disabled = false;
                } else {
                    alert("Commande réussie ! Merci.");
                    cart = []; 
                    saveCartToStorage(); 
                    window.location.href = 'index.html'; 
                }
            });
        }
    }

    // 8. النماذج الأخرى
    const contactF = document.getElementById('contact-form');
    if(contactF) {
        contactF.addEventListener('submit', async e => {
            e.preventDefault();
            const data = {
                name: document.getElementById('contact-name').value,
                email: document.getElementById('contact-email').value,
                message: document.getElementById('contact-message').value
            };
            const { error } = await supabaseClient.from('ContactMessages').insert(data);
            if(!error) { alert('Message envoyé!'); contactF.reset(); }
        });
    }

    const stars = document.querySelectorAll('.star-input');
    let currentRating = 0;
    if(stars.length > 0) {
        stars.forEach(s => s.addEventListener('click', () => {
            currentRating = s.dataset.value;
            document.getElementById('rating-value').value = currentRating;
            document.getElementById('rating-text').textContent = `${currentRating}/5`;
            stars.forEach(st => st.classList.toggle('selected', st.dataset.value <= currentRating));
            stars.forEach(st => st.querySelector('i').className = st.dataset.value <= currentRating ? 'fas fa-star' : 'far fa-star');
        }));
    }

    const reviewForm = document.getElementById('add-review-form');
    if(reviewForm) {
        reviewForm.addEventListener('submit', async e => {
            e.preventDefault();
            if(!currentRating) return alert('Notez SVP');
            const data = {
                reviewer_name: document.getElementById('review-name').value,
                reviewer_location: document.getElementById('review-location').value,
                review_text: document.getElementById('review-text').value,
                rating: currentRating, is_approved: true
            };
            const {error} = await supabaseClient.from('reviews').insert(data);
            if(!error) { 
                alert('Merci pour votre avis!'); 
                document.getElementById('review-modal').style.display='none'; 
                getReviews(); 
            }
        });
    }

    // 9. المودالات
    const opens = { 'profile-button': 'profile-modal', 'open-review-modal-btn': 'review-modal' };
    Object.keys(opens).forEach(id => {
        const btn = document.getElementById(id);
        if(btn) btn.addEventListener('click', () => document.getElementById(opens[id]).style.display='block');
    });
    document.querySelectorAll('.close-btn').forEach(b => b.addEventListener('click', e => e.target.closest('.modal').style.display='none'));
    window.onclick = e => { if(e.target.classList.contains('modal')) e.target.style.display='none'; };

    // 10. موبايل ميني
    const nav = document.getElementById('main-nav');
    const overlay = document.getElementById('nav-overlay');
    const burgerBtn = document.getElementById('burger-menu-btn');
    const closeNavBtn = document.getElementById('close-nav-btn');

    if(burgerBtn) burgerBtn.addEventListener('click', () => { nav.classList.add('nav-active'); overlay.classList.add('overlay-active'); });
    function closeMenu() { if(nav) nav.classList.remove('nav-active'); if(overlay) overlay.classList.remove('overlay-active'); }
    if(closeNavBtn) closeNavBtn.addEventListener('click', closeMenu);
    if(overlay) overlay.addEventListener('click', closeMenu);

    // زر الاستكشاف
    const scrollBtn = document.getElementById('scroll-to-products');
    if(scrollBtn) scrollBtn.addEventListener('click', () => document.getElementById('products-section').scrollIntoView({behavior:'smooth'}));
});