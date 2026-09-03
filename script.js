// ---------------------------------------------------
// ملف script.js الشامل والمصحح (يعمل على index.html و cart.html)
// ---------------------------------------------------

const { createClient } = supabase;
const SUPABASE_URL = 'https://vhrvdkaqlrwplkdgwwkl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZocnZka2FxbHJ3cGxrZGd3d2tsIiwicm9sZSI6ImFub24iOjE3NjMzOTUyMTAsImV4cCI6MjA3ODk3MTIxMH0.mNAn3qo48y46FDkDOqUVt1xwN2smFMZL1lBNbT0OkTA';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const translations = {
    ar: {
        out_of_stock: "نفاذ الكمية",
        nav_home: "الرئيسية", nav_category: "الفئات", nav_trend: "الرائج", nav_about: "من نحن", nav_contact: "اتصل بنا",
        hero_title: "اكتشف مجموعتنا الجديدة", hero_subtitle: "تصميم عصري بجودة عالية",
        products_title: "منتجاتنا", category_all: "الكل",
        alert_color: "اختر اللون", alert_size: "اختر المقاس", alert_added: "تمت الإضافة للسلة", alert_order_success: "تم الطلب بنجاح!"
    },
    fr: {
        out_of_stock: "Rupture de stock",
        nav_home: "Accueil", nav_category: "Catégorie", nav_trend: "Tendance", nav_about: "À Propos", nav_contact: "Contact",
        hero_title: "Découvrez notre nouvelle collection", hero_subtitle: "Design moderne, qualité supérieure",
        products_title: "Nos Produits", category_all: "Tout",
        alert_color: "Choisir une couleur", alert_size: "Choisir une taille", alert_added: "Ajouté au panier", alert_order_success: "Commande envoyée!"
    },
    en: {
        out_of_stock: "Out of Stock",
        nav_home: "Home", nav_category: "Category", nav_trend: "Trend", nav_about: "About", nav_contact: "Contact",
        hero_title: "Discover our new collection", hero_subtitle: "Modern design, premium quality",
        products_title: "Our Products", category_all: "All",
        alert_color: "Select color", alert_size: "Select size", alert_added: "Added to cart", alert_order_success: "Order placed!"
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

// --- إدارة السلة وتخزينها محلياً ---
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
    // التأكد من جلب السلة الحالية أولاً
    loadCartFromStorage();
    
    // إضافة المنتج الجديد
    cart.push(item);
    
    // حفظ السلة في التخزين المحلي وتحديث عداد الهيدر
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

// --- التحقق من حالة Coming Soon ---
function checkIsComingSoon(product) {
    if (!product.is_coming_soon) return false;
    if (!product.available_at) return true;
    const now = new Date();
    const target = new Date(product.available_at);
    return target > now; 
}

// --- تعبئة قائمة الولايات في صفحة السلة ---
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
        calcFinalTotalPage();
    });
}

// --- عرض محتويات صفحة cart.html ---
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
            total += Number(item.price) || 0;
            container.innerHTML += `
                <div class="cart-item-row" style="display:flex; justify-content:space-between; align-items:center; padding:15px 0; border-bottom:1px solid #eee;">
                    <div class="cart-item-info">
                        <h4 style="margin:0;">${item.name}</h4>
                        <small style="color:#666;">Couleur: ${item.color || '-'} | Taille: ${item.size || '-'} | Qty: ${item.qty || 1}</small>
                    </div>
                    <div style="display:flex; align-items:center; gap:15px;">
                        <span style="font-weight:bold; color:var(--color-primary);">${item.price} DZD</span>
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

// --- جلب المنتجات في index.html ---
async function loadInitialData() {
    await getProducts();
}

async function getProducts() {
    let { data: products, error } = await supabaseClient
        .from('products')
        .select('*')
        .eq('is_deleted', false)
        .order('id', { ascending: false });

    if (error) {
        console.error("Error fetching products:", error);
        return;
    }

    allProducts = products || [];
    renderProducts(allProducts);
}

function renderProducts(products) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (!products || !products.length) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--color-text-muted);">Aucun produit disponible.</p>';
        return;
    }

    products.forEach(p => {
        const isOutOfStock = p.stock <= 0;
        const isComingSoon = checkIsComingSoon(p);
        
        const card = document.createElement('div');
        card.className = `product-card ${isOutOfStock ? 'out-of-stock' : ''} ${isComingSoon ? 'is-coming-soon' : ''}`;
        
        card.innerHTML = `
            ${isComingSoon ? '<span class="card-cs-tag">COMING SOON</span>' : ''}
            <img src="${p.image_url || 'images/logo3.png'}" class="${isComingSoon ? 'is-coming-soon-blur' : ''}" alt="${p.name}">
            <div class="product-details">
                <h3 class="product-name">${p.name}</h3>
                <p class="product-price">${isComingSoon ? 'Bientôt disponible' : p.price + ' DZD'}</p>
                <div class="product-actions">
                    <button class="details-btn">Détails</button>
                </div>
            </div>
        `;
        
        card.querySelector('.details-btn').addEventListener('click', () => openDetails(p));
        grid.appendChild(card);
    });
}

// --- تفاصيل المنتج (Modal) ---
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
            html += `<div class="modal-opts-group"><label>Couleurs</label><div class="product-colors" style="display:flex; gap:8px; flex-wrap:wrap;">` 
                + availableColors.map(c => `<span class="color-box" data-val="${c}" style="border:1.5px solid var(--color-border); padding:6px 14px; border-radius:8px; cursor:pointer; font-weight:600;">${c}</span>`).join('')
                + '</div></div>';
        }
        if (availableSizes.length > 0) {
            html += `<div class="modal-opts-group" style="margin-top:12px;"><label>Tailles</label><div class="product-sizes" style="display:flex; gap:8px; flex-wrap:wrap;">`
                + availableSizes.map(s => `<span class="size-box" data-val="${s}" style="border:1.5px solid var(--color-border); padding:6px 14px; border-radius:8px; cursor:pointer; font-weight:600;">${s}</span>`).join('')
                + '</div></div>';
        }

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
                if (availableColors.length > 0 && !selColor) return alert("Veuillez choisir une couleur");
                if (availableSizes.length > 0 && !selSize) return alert("Veuillez choisir une taille");
                
                const quantity = parseInt(qtyInput?.value, 10) || 1;
                addToCart({ 
                    id: `${p.id}-${selColor}-${selSize}`, 
                    ...p, 
                    color: selColor, 
                    size: selSize, 
                    qty: quantity,
                    price: p.price * quantity 
                });
                modal.style.display = 'none';
            });
        }
    }

    modal.style.display = 'block';
}

// --- التهيئة عند تحميل أي من الصفحات ---
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromStorage();
    
    if (window.location.pathname.includes('cart.html')) {
        populateWilayas();
        renderCartPage();

        // إرسال الطلب إلى جدول orders في Supabase
        const checkoutForm = document.getElementById('checkout-form-page');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (cart.length === 0) return alert('Votre panier est vide !');

                const submitBtn = document.getElementById('checkout-submit-btn');
                submitBtn.textContent = "Envoi en cours...";
                submitBtn.disabled = true;

                const wilayaSelect = document.getElementById('checkout-wilaya');
                const wilayaName = wilayaSelect.options[wilayaSelect.selectedIndex].text.split(' (+')[0];

                const orderData = {
                    customer_name: document.getElementById('checkout-name').value,
                    customer_phone: document.getElementById('checkout-phone').value,
                    customer_address: `${wilayaName} - ${document.getElementById('checkout-address').value}`,
                    items: cart,
                    total_price: parseFloat(document.getElementById('final-total-price').textContent),
                    delivery_fee: parseFloat(document.getElementById('delivery-fee-display').textContent) || 0,
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
    } else {
        loadInitialData();
    }

    // تفعيل زر السلة العلوي في الهيدر ليوجه لصفحة cart.html
    const cartButton = document.getElementById('cart-button');
    if (cartButton) {
        cartButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    }

 
    // إغلاق المودالز
    document.querySelectorAll('.close-btn').forEach(b => b.addEventListener('click', e => e.target.closest('.modal').style.display = 'none'));
    window.onclick = e => { if(e.target.classList.contains('modal')) e.target.style.display = 'none'; };
});
