// ---------------------------------------------------
// ملف script.js الكامل والنهائي (النسخة 2.0)
// ---------------------------------------------------

// --- الخطوة 0: إعداد Supabase ---
const { createClient } = supabase;
// مفاتيحك الحالية
const SUPABASE_URL = 'https://vhrvdkaqlrwplkdgwwkl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZocnZka2FxbHJ3cGxrZGd3d2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzOTUyMTAsImV4cCI6MjA3ODk3MTIxMH0.mNAn3qo48y46FDkDOqUVt1xwN2smFMZL1lBNbT0OkTA';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log('Supabase client is ready!');

// --- الخطوة 1: الترجمة (Multi-Language) ---
const translations = {
    ar: {
        about_title: "عن ICOSIUM",
        about_history_text: "في عام 140 قبل الميلاد، أسس الفينيقيون 'إيكوزيم' على ساحل شمال إفريقيا — القلب القديم لما يعرف اليوم بالجزائر العاصمة. مرت قرون، وقامت إمبراطوريات وسقطت. ومع ذلك، فإن روح إيكوزيم لا تزال حية. من تلك الطاقة الخالدة، ولدت ICOSIUM كعلامة تجارية جزائرية عصرية تمزج بين التراث والأناقة المعاصرة. نحن نجلب روح الماضي إلى عالم اليوم — ونصمم ملابس تعبر عن الهوية والإبداع والهدف. مهمتنا هي إعادة تعريف الموضة المحلية لجيل جديد يقدر الأصالة والشجاعة. ICOSIUM ليست مجرد علامة تجارية، إنها حركة وجسر بين الروح القديمة والحياة العصرية.",
        about_why_title: "لماذا تختار ICOSIUM؟",
        about_why_text: "لأن ما ترتديه يجب أن يحمل معنى. في ICOSIUM، كل قطعة تحكي قصة — قصة أرض وثقافة وجيل لا يخشى التميز. نحن لا نصنع الملابس فحسب؛ بل نخلق صلة بين روح الجزائر العريقة والروح الحديثة لشبابها. تصاميمنا أصيلة، ومصممة بعناية لتدوم — صُنعت لأولئك الذين يقدرون الهوية على الموضة العابرة، والمعنى على الإنتاج الضخم. عندما ترتدي ICOSIUM، فأنت ترتدي التراث والإبداع والثقة — لأن الأناقة الحقيقية تبدأ من الداخل.",
        nav_home: "الرئيسية",
        nav_about: "من نحن",
        nav_contact: "اتصل بنا",
        products_title: "منتجاتنا",
        category_all: "كل الفئات",
        about_title: "عن ICOSIUM STORE",
        about_text: "نحن في إيكوزيوم نؤمن بقوة التصميم البسيط والعصري. نقدم لكم قمصان بجودة عالية وتصاميم فريدة تعبر عنكم.",
        contact_title: "اتصل بنا",
        contact_name: "الاسم:",
        contact_email: "البريد الإلكتروني:",
        contact_message: "رسالتك:",
        contact_send: "إرسال",
        cart_title: "سلة مشترياتك",
        cart_total: "الإجمالي:",
        checkout_title: "إتمام الطلب (الدفع عند الاستلام)",
        form_name: "الاسم الكامل:",
        form_phone: "رقم الهاتف:",
        form_address: "العنوان (الشارع/الحي):",
        delivery_fee: "سعر التوصيل:",
        form_confirm: "تأكيد الطلب",
        profile_login: "تسجيل الدخول",
        alert_color: "الرجاء اختيار اللون أولاً",
        alert_size: "الرجاء اختيار المقاس أولاً",
        alert_added_to_cart: "تمت إضافة المنتج للسلة!",
        alert_contact_success: "تم إرسال رسالتك بنجاح!",
        alert_contact_fail: "حدث خطأ، يرجى المحاولة لاحقاً.",
        alert_order_success: "تم إرسال طلبك بنجاح!",
        alert_order_fail: "فشل إرسال الطلب، يرجى التحقق من بياناتك.",
        search_placeholder: "ابحث عن منتج...",
        colors: "الألوان:",
        sizes: "المقاسات:"
    },
    fr: {
        about_title: "À propos d'ICOSIUM",
        about_history_text: "En 140 av. J.-C., les Phéniciens fondèrent Ikosim sur la côte nord-africaine — le cœur antique de l'actuelle Alger. Des siècles ont passé, des empires se sont élevés et effondrés. Pourtant, l'esprit d'Ikosim perdure. Née de cette énergie intemporelle, ICOSIUM est une marque algérienne moderne qui allie héritage et style contemporain. Nous transportons l'âme du passé dans le monde d'aujourd'hui, créant des vêtements qui expriment identité et créativité. ICOSIUM est plus qu'une marque. C'est un mouvement — un pont entre l'esprit ancien et la vie moderne.",
        about_why_title: "Pourquoi choisir ICOSIUM",
        about_why_text: "Parce que ce que vous portez doit avoir du sens. Chez ICOSIUM, chaque pièce raconte une histoire — celle d'une terre, d'une culture et d'une génération qui n'a pas peur de se démarquer. Nous créons un lien entre l'âme ancienne de l'Algérie et l'esprit moderne de sa jeunesse. Nos designs sont authentiques, pensés avec soin et faits pour durer — pour ceux qui privilégient l'identité sur la tendance et le sens sur la production de masse. Porter ICOSIUM, c'est porter l'héritage, la créativité et la confiance — car le vrai style vient de l'intérieur.",

        // ...
        nav_home: "Accueil",
        nav_about: "À propos",
        nav_contact: "Contact",
        products_title: "Nos Produits",
        category_all: "Toutes",
        about_title: "À propos d'ICOSIUM STORE",
        about_text: "Chez Icosium, nous croyons au design simple et moderne. Nous proposons des t-shirts de haute qualité avec des designs uniques.",
        contact_title: "Contactez-nous",
        contact_name: "Nom:",
        contact_email: "Email:",
        contact_message: "Votre Message:",
        contact_send: "Envoyer",
        cart_title: "Votre Panier",
        cart_total: "Total:",
        checkout_title: "Finaliser (Paiement à la livraison)",
        form_name: "Nom complet:",
        form_phone: "Téléphone:",
        form_address: "Adresse (Rue/Cité):",
        delivery_fee: "Frais de livraison:",
        form_confirm: "Confirmer la commande",
        profile_login: "Connexion",
        alert_color: "Veuillez choisir une couleur",
        alert_size: "Veuillez choisir une taille",
        alert_added_to_cart: "Produit ajouté au panier!",
        alert_contact_success: "Votre message a été envoyé!",
        alert_contact_fail: "Erreur lors de l'envoi.",
        alert_order_success: "Votre commande a été envoyée!",
        alert_order_fail: "Échec de l'envoi de la commande.",
        search_placeholder: "Rechercher un produit...",
        colors: "Couleurs:",
        sizes: "Tailles:"
    },
    en: {
        about_title: "About ICOSIUM",
        about_history_text: "In 140 B.C.E., the Phoenicians founded Ikosim on the North African coast — the ancient heart of what is today Algiers. Centuries have passed. Empires have risen and fallen. Yet, the spirit of Ikosim still lives on. Born from that timeless energy, ICOSIUM is a modern Algerian casualwear brand that blends heritage with contemporary style. We bring the soul of the past into today’s world — crafting clothing that expresses identity, creativity, and purpose. ICOSIUM is more than a brand. It’s a movement — a bridge between ancient spirit and modern life.",
        about_why_title: "Why Choose ICOSIUM",
        about_why_text: "Because what you wear should mean something. At ICOSIUM, every piece tells a story — the story of a land, a culture, and a generation unafraid to stand out. We don’t just make clothes; we create a connection between the old soul of Algeria and the modern spirit of its youth. Our designs are authentic, thoughtfully crafted, and made to last — built for those who value identity over trend and meaning over mass production. When you wear ICOSIUM, you wear heritage, creativity, and confidence — because true style starts from within.",

        // ...
        nav_home: "Home",
        nav_about: "About",
        nav_contact: "Contact",
        products_title: "Our Products",
        category_all: "All",
        about_title: "About ICOSIUM STORE",
        about_text: "At Icosium, we believe in simple, modern design. We offer high-quality t-shirts with unique designs.",
        contact_title: "Contact Us",
        contact_name: "Name:",
        contact_email: "Email:",
        contact_message: "Your Message:",
        contact_send: "Send",
        cart_title: "Your Cart",
        cart_total: "Total:",
        checkout_title: "Checkout (Cash on Delivery)",
        form_name: "Full Name:",
        form_phone: "Phone Number:",
        form_address: "Address (Street/City):",
        delivery_fee: "Delivery Fee:",
        form_confirm: "Confirm Order",
        profile_login: "Login",
        alert_color: "Please select a color",
        alert_size: "Please select a size",
        alert_added_to_cart: "Product added to cart!",
        alert_contact_success: "Your message has been sent!",
        alert_contact_fail: "Error sending message.",
        alert_order_success: "Your order has been placed!",
        alert_order_fail: "Failed to place order.",
        search_placeholder: "Search for a product...",
        colors: "Colors:",
        sizes: "Sizes:"
    }
};

let currentLanguage = 'ar';

function setLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.placeholder = translations[lang].search_placeholder || "ابحث...";
    }
    
    // تحديث نصوص الخيارات
    document.querySelectorAll('.options-label-color').forEach(l => l.textContent = translations[lang].colors);
    document.querySelectorAll('.options-label-size').forEach(l => l.textContent = translations[lang].sizes);
}

// --- الخطوة 2: البيانات والمتغيرات ---
let allProducts = [];
let cart = [];

// بيانات الولايات
const wilayasData = [
    { id: 1, name: "Adrar", price: 900 },
    { id: 16, name: "Alger", price: 400 },
    { id: 25, name: "Constantine", price: 600 },
    { id: 31, name: "Oran", price: 600 },
    { id: 9, name: "Blida", price: 500 },
    { id: 15, name: "Tizi Ouzou", price: 600 },
    { id: 99, name: "Autre Wilaya", price: 800 } 
];

// العناصر
const productsGrid = document.getElementById('products-grid');
const categoriesContainer = document.getElementById('categories-filter');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalPriceEl = document.getElementById('cart-total-price');
const cartCountEl = document.getElementById('cart-count');
const wilayaSelect = document.getElementById('checkout-wilaya');
const deliveryFeeDisplay = document.getElementById('delivery-fee-display');
const finalTotalDisplay = document.getElementById('final-total-price');


// --- الخطوة 3: التحميل الأولي ---
async function loadInitialData() {
    await getCategories();
    await getProducts();
    await getReviews();
    populateWilayas();
    setLanguage('ar');
}

// --- الخطوة 4: جلب البيانات ---
async function getCategories() {
    let { data: categories, error } = await supabaseClient.from('categories').select('*');
    if (error) { console.error('Error fetching categories:', error); return; }

    if (categories) {
        categories.forEach(category => {
            const btn = document.createElement('button');
            btn.className = 'category-btn';
            btn.dataset.categoryId = category.id;
            btn.textContent = category[`name_ar`] || category.name;
            btn.addEventListener('click', () => {
                filterProducts(category.id);
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
            categoriesContainer.appendChild(btn);
        });
    }
}

async function getProducts() {
    let { data: products, error } = await supabaseClient.from('products').select('*');
    if (error) { console.error('Error fetching products:', error); return; }
    
    if (products) {
        allProducts = products;
        renderProducts(allProducts);
    }
}

// --- الخطوة 5: عرض المنتجات (Render) ---
function renderProducts(productsToRender) {
    productsGrid.innerHTML = '';

    if (!productsToRender || productsToRender.length === 0) {
        productsGrid.innerHTML = '<p style="text-align:center; width:100%;">لا توجد منتجات حالياً.</p>';
        return;
    }

    for (let product of productsToRender) {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.productId = product.id;

        // دوال مساعدة (آمنة للمصفوفات)
        function createColorOptions(colors) {
            if (!Array.isArray(colors) || colors.length === 0) return '';
            let html = `<label class="options-label options-label-color">${translations[currentLanguage].colors || 'الألوان:'}</label><div class="product-colors">`;
            html += colors.map(color => {
                const c = color.replace(/"/g, '');
                return `<span class="color-dot" style="background-color: ${c};" title="${c}"></span>`;
            }).join('');
            return html + '</div>';
        }

        function createSizeOptions(sizes) {
            if (!Array.isArray(sizes) || sizes.length === 0) return '';
            let html = `<label class="options-label options-label-size">${translations[currentLanguage].sizes || 'المقاسات:'}</label><div class="product-sizes">`;
            html += sizes.map(size => {
                const s = size.replace(/"/g, '');
                return `<span class="size-box">${s}</span>`;
            }).join('');
            return html + '</div>';
        }

        // HTML البطاقة
        productCard.innerHTML = `
            <img src="${product.image_url}" alt="${product.name}">
            <div class="product-details">
                <h3 class="product-name">${product.name}</h3>
                
                <div class="product-options">
                    ${createColorOptions(product.colors)}
                    ${createSizeOptions(product.sizes)}
                </div>

                <p class="product-price">${product.price} DZD</p>

                <div class="product-actions">
                    <button class="add-to-cart-btn" data-key="add_to_cart">أضف للسلة</button>
                    <button class="details-btn">تفاصيل</button>
                </div>
            </div>
        `;

        // إضافة التفاعل (للبطاقة والزرين)
        addCardLogic(productCard, product);

        productsGrid.appendChild(productCard);
    }
    setLanguage(currentLanguage);
}

function filterProducts(categoryId) {
    if (categoryId === 'all') {
        renderProducts(allProducts);
    } else {
        const filtered = allProducts.filter(p => p.category_id == categoryId);
        renderProducts(filtered);
    }
}

// --- الخطوة 6: منطق التفاعل مع البطاقة ---
function addCardLogic(productCard, product) {
    const colorDots = productCard.querySelectorAll('.color-dot');
    const sizeBoxes = productCard.querySelectorAll('.size-box');
    const cartButton = productCard.querySelector('.add-to-cart-btn');
    const detailsButton = productCard.querySelector('.details-btn'); // زر التفاصيل

    let selectedColor = null;
    let selectedSize = null;

    // اختيار اللون
    colorDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            colorDots.forEach(d => d.classList.remove('selected'));
            e.target.classList.add('selected');
            selectedColor = e.target.title;
        });
    });

    // اختيار المقاس
    sizeBoxes.forEach(box => {
        box.addEventListener('click', (e) => {
            sizeBoxes.forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
            selectedSize = e.target.textContent;
        });
    });

    // زر الإضافة للسلة
    cartButton.addEventListener('click', () => {
        const needsColor = Array.isArray(product.colors) && product.colors.length > 0;
        const needsSize = Array.isArray(product.sizes) && product.sizes.length > 0;

        if (needsColor && !selectedColor) { alert(translations[currentLanguage].alert_color); return; }
        if (needsSize && !selectedSize) { alert(translations[currentLanguage].alert_size); return; }

        const cartItem = {
            id: `${product.id}-${selectedColor}-${selectedSize}`,
            name: product.name,
            price: product.price,
            color: selectedColor,
            size: selectedSize,
            quantity: 1
        };
        addToCart(cartItem);
        alert(translations[currentLanguage].alert_added_to_cart);
    });

    // زر التفاصيل (يفتح النافذة)
    if (detailsButton) {
        detailsButton.addEventListener('click', () => {
            openProductModal(product);
        });
    }
}

// --- الخطوة 7: السلة والولايات ---
function addToCart(item) {
    const existingItem = cart.find(i => i.id === item.id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push(item);
    }
    updateCartUI();
}

function removeFromCart(itemId) {
    cart = cart.filter(i => i.id !== itemId);
    updateCartUI();
}

function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;

    cart.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <div class="cart-item-details">
                <strong>${item.name}</strong>
                <small>(${(item.color || '-')}, ${(item.size || '-')}) - ${item.price} DA x ${item.quantity}</small>
            </div>
            <span class="cart-item-remove" data-id="${item.id}">&times;</span>
        `;
        cartItemsContainer.appendChild(itemEl);
        totalPrice += item.price * item.quantity;
    });

    cartTotalPriceEl.textContent = totalPrice;
    cartCountEl.textContent = cart.length;

    // تحديث السعر النهائي مع التوصيل (إذا تم اختيار ولاية)
    const currentDelivery = parseFloat(wilayaSelect ? wilayaSelect.value : 0) || 0;
    if(finalTotalDisplay) finalTotalDisplay.textContent = totalPrice + currentDelivery;

    // مستمعو الحذف
    cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => removeFromCart(e.target.dataset.id));
    });
}

function populateWilayas() {
    if(!wilayaSelect) return;
    wilayasData.forEach(wilaya => {
        const option = document.createElement('option');
        option.value = wilaya.price;
        option.textContent = `${wilaya.id} - ${wilaya.name} (+${wilaya.price} DA)`;
        wilayaSelect.appendChild(option);
    });

    wilayaSelect.addEventListener('change', (e) => {
        const deliveryPrice = parseFloat(e.target.value) || 0;
        const cartTotal = parseFloat(cartTotalPriceEl.textContent) || 0;
        deliveryFeeDisplay.textContent = deliveryPrice;
        finalTotalDisplay.textContent = cartTotal + deliveryPrice;
    });
}

// --- الخطوة 8: نافذة التفاصيل (Modal Logic) ---
function openProductModal(product) {
    const modal = document.getElementById('product-details-modal');
    
    document.getElementById('modal-product-image').src = product.image_url;
    document.getElementById('modal-product-name').textContent = product.name;
    document.getElementById('modal-product-desc').textContent = product.description || "وصف المنتج غير متوفر.";
    document.getElementById('modal-product-price').textContent = `${product.price} DZD`;

    const optionsContainer = document.getElementById('modal-product-options');
    let selectedModalColor = null;
    let selectedModalSize = null;

    // بناء الخيارات داخل النافذة
    let html = '<div class="product-options">';
    if (Array.isArray(product.colors) && product.colors.length > 0) {
        html += `<label class="options-label">${translations[currentLanguage].colors}:</label><div class="product-colors">`;
        product.colors.forEach(color => {
             const c = color.replace(/"/g, '');
             html += `<span class="color-dot" style="background-color: ${c};" title="${c}" data-color="${c}"></span>`;
        });
        html += '</div>';
    }
    if (Array.isArray(product.sizes) && product.sizes.length > 0) {
        html += `<label class="options-label">${translations[currentLanguage].sizes}:</label><div class="product-sizes">`;
        product.sizes.forEach(size => {
             const s = size.replace(/"/g, '');
             html += `<span class="size-box" data-size="${s}">${s}</span>`;
        });
        html += '</div>';
    }
    html += '</div>';
    optionsContainer.innerHTML = html;

    // تفعيل الخيارات داخل النافذة
    const modalColorDots = optionsContainer.querySelectorAll('.color-dot');
    const modalSizeBoxes = optionsContainer.querySelectorAll('.size-box');

    modalColorDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            modalColorDots.forEach(d => d.classList.remove('selected'));
            e.target.classList.add('selected');
            selectedModalColor = e.target.dataset.color;
        });
    });

    modalSizeBoxes.forEach(box => {
        box.addEventListener('click', (e) => {
            modalSizeBoxes.forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
            selectedModalSize = e.target.dataset.size;
        });
    });

    // زر الإضافة في النافذة
    const modalAddBtn = document.getElementById('modal-add-to-cart-btn');
    const newBtn = modalAddBtn.cloneNode(true);
    modalAddBtn.parentNode.replaceChild(newBtn, modalAddBtn);
    
    newBtn.addEventListener('click', () => {
        const needsColor = Array.isArray(product.colors) && product.colors.length > 0;
        const needsSize = Array.isArray(product.sizes) && product.sizes.length > 0;

        if (needsColor && !selectedModalColor) { alert(translations[currentLanguage].alert_color); return; }
        if (needsSize && !selectedModalSize) { alert(translations[currentLanguage].alert_size); return; }

        const cartItem = {
            id: `${product.id}-${selectedModalColor}-${selectedModalSize}`,
            name: product.name,
            price: product.price,
            color: selectedModalColor,
            size: selectedModalSize,
            quantity: 1
        };
        addToCart(cartItem);
        alert(translations[currentLanguage].alert_added_to_cart);
        modal.style.display = 'none';
    });

    modal.style.display = 'block';
}

// إغلاق نافذة التفاصيل
document.getElementById('close-product-details').addEventListener('click', () => {
    document.getElementById('product-details-modal').style.display = 'none';
});

// --- الخطوة 9: النماذج والأحداث العامة ---

const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');
const checkoutForm = document.getElementById('checkout-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const message = document.getElementById('contact-message').value;

        const { error } = await supabaseClient.from('ContactMessages').insert({ name, email, message });
        if (error) {
            contactStatus.textContent = translations[currentLanguage].alert_contact_fail;
            contactStatus.style.color = 'red';
        } else {
            contactStatus.textContent = translations[currentLanguage].alert_contact_success;
            contactStatus.style.color = 'green';
            contactForm.reset();
        }
    });
}

if (checkoutForm) {
    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (cart.length === 0) { alert('سلتك فارغة!'); return; }
        if (!wilayaSelect.value) { alert('يرجى اختيار الولاية'); return; }

        const selectedWilayaName = wilayaSelect.options[wilayaSelect.selectedIndex].text;
        
        const orderData = {
            customer_name: document.getElementById('checkout-name').value,
            customer_phone: document.getElementById('checkout-phone').value,
            customer_address: `${selectedWilayaName} - ${document.getElementById('checkout-address').value}`,
            items: cart,
            total_price: parseFloat(finalTotalDisplay.textContent),
            delivery_fee: parseFloat(deliveryFeeDisplay.textContent),
            status: 'Pending'
        };

        const { error } = await supabaseClient.from('orders').insert(orderData);
        if (error) {
            console.error('Order Error:', error);
            alert(translations[currentLanguage].alert_order_fail);
        } else {
            alert(translations[currentLanguage].alert_order_success);
            cart = [];
            updateCartUI();
            document.getElementById('cart-modal').style.display = 'none';
            checkoutForm.reset();
        }
    });
}

// أزرار التحكم العامة
document.getElementById('language-switcher').addEventListener('change', (e) => setLanguage(e.target.value));

document.getElementById('dark-mode-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = document.querySelector('#dark-mode-toggle i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon'); icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun'); icon.classList.add('fa-moon');
    }
});

// النوافذ المنبثقة
const cartModal = document.getElementById('cart-modal');
const profileModal = document.getElementById('profile-modal');
const detailsModal = document.getElementById('product-details-modal');

document.getElementById('cart-button').addEventListener('click', () => cartModal.style.display = 'block');
document.getElementById('close-cart-modal').addEventListener('click', () => cartModal.style.display = 'none');
document.getElementById('profile-button').addEventListener('click', () => profileModal.style.display = 'block');
document.getElementById('close-profile-modal').addEventListener('click', () => profileModal.style.display = 'none');

// إغلاق عند النقر خارج النوافذ
window.onclick = function(event) {
    if (event.target == cartModal) cartModal.style.display = "none";
    if (event.target == profileModal) profileModal.style.display = "none";
    if (event.target == detailsModal) detailsModal.style.display = "none";
}

// زر التمرير (Explore)
const scrollToBtn = document.getElementById('scroll-to-products');
if(scrollToBtn) {
    scrollToBtn.addEventListener('click', () => {
        document.getElementById('products-section').scrollIntoView({ behavior: 'smooth' });
    });
}

const allCategoryButton = document.querySelector('.category-btn[data-category-id="all"]');
if (allCategoryButton) {
    allCategoryButton.addEventListener('click', () => {
        filterProducts('all');
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        allCategoryButton.classList.add('active');
    });
}
// ====================================
//  منطق القائمة الجانبية (Burger Menu)
// ====================================

const burgerBtn = document.getElementById('burger-menu-btn');
const mainNav = document.getElementById('main-nav');
const closeNavBtn = document.getElementById('close-nav-btn');
const navOverlay = document.getElementById('nav-overlay');
const navLinks = document.querySelectorAll('.main-nav a');

function toggleMenu() {
    mainNav.classList.toggle('nav-active');
    navOverlay.classList.toggle('overlay-active');
}

function closeMenu() {
    mainNav.classList.remove('nav-active');
    navOverlay.classList.remove('overlay-active');
}

// فتح القائمة عند الضغط على البرغر
if (burgerBtn) {
    burgerBtn.addEventListener('click', toggleMenu);
}

// إغلاق القائمة عند الضغط على X
if (closeNavBtn) {
    closeNavBtn.addEventListener('click', closeMenu);
}

// إغلاق القائمة عند الضغط على الخلفية المعتمة
if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
}

// إغلاق القائمة تلقائياً عند الضغط على أي رابط (للانتقال للقسم)
navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});
// --- دالة جلب الآراء (Reviews) ---
async function getReviews() {
    // جلب الآراء من Supabase
    let { data: reviews, error } = await supabaseClient
        .from('reviews')
        .select('*')
        .eq('is_approved', true) // جلب الآراء الموافق عليها فقط
        .order('created_at', { ascending: false }); // الأحدث أولاً

    if (error) {
        console.error('Error fetching reviews:', error);
        return; // في حال الخطأ، اترك الآراء التجريبية كما هي
    }

    // المنطق الذكي:
    // إذا وجدنا آراء حقيقية في قاعدة البيانات
    if (reviews && reviews.length > 0) {
        const reviewsContainer = document.querySelector('.reviews-container');
        reviewsContainer.innerHTML = ''; // 🧹 امسح الآراء التجريبية (HTML)

        // أضف الآراء الحقيقية
        reviews.forEach(review => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card';
            
            // دالة لرسم النجوم
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= review.rating) {
                    starsHtml += '<i class="fas fa-star"></i>'; // نجمة ممتلئة
                } else {
                    starsHtml += '<i class="far fa-star"></i>'; // نجمة فارغة
                }
            }

            reviewCard.innerHTML = `
                <div class="review-header">
                    <div class="reviewer-info">
                        <h4>${review.reviewer_name}</h4>
                        <span class="review-date">${review.reviewer_location || ''}</span>
                    </div>
                    <div class="review-stars">
                        ${starsHtml}
                    </div>
                </div>
                <p class="review-text">"${review.review_text}"</p>
                <i class="fas fa-quote-left quote-icon"></i>
            `;
            
            reviewsContainer.appendChild(reviewCard);
        });
    } 
    // else { ... لا تفعل شيئاً، اترك الآراء التجريبية تظهر ... }
}

// =========================================
//  منطق إضافة رأي جديد (Add Review Logic)
// =========================================

const reviewModal = document.getElementById('review-modal');
const openReviewBtn = document.getElementById('open-review-modal-btn');
const closeReviewBtn = document.getElementById('close-review-modal');
const reviewForm = document.getElementById('add-review-form');
const starsInputs = document.querySelectorAll('.star-input');
const ratingValueInput = document.getElementById('rating-value');
const ratingText = document.getElementById('rating-text');

let currentRating = 0;

// 1. فتح وإغلاق المودال
if (openReviewBtn) openReviewBtn.addEventListener('click', () => reviewModal.style.display = 'block');
if (closeReviewBtn) closeReviewBtn.addEventListener('click', () => reviewModal.style.display = 'none');

// 2. منطق تفاعل النجوم
starsInputs.forEach(star => {
    // عند التمرير (Hover)
    star.addEventListener('mouseover', () => {
        const value = parseInt(star.dataset.value);
        highlightStars(value);
    });

    // عند إبعاد الفأرة (العودة للقيمة المختارة)
    star.addEventListener('mouseout', () => {
        highlightStars(currentRating);
    });

    // عند الضغط (Click) - حفظ القيمة
    star.addEventListener('click', () => {
        currentRating = parseInt(star.dataset.value);
        ratingValueInput.value = currentRating;
        ratingText.textContent = `${currentRating}/5`;
        highlightStars(currentRating);
        
        // تغيير الأيقونة إلى ممتلئة
        starsInputs.forEach((s, index) => {
            const icon = s.querySelector('i');
            if (index < currentRating) {
                icon.classList.remove('far');
                icon.classList.add('fas');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
            }
        });
    });
});

function highlightStars(count) {
    starsInputs.forEach((star, index) => {
        if (index < count) {
            star.classList.add('hovered');
        } else {
            star.classList.remove('hovered');
        }
    });
}

// 3. إرسال الرأي إلى Supabase
if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (currentRating === 0) {
            alert(translations[currentLanguage].alert_select_rating || "الرجاء اختيار التقييم");
            return;
        }

        const reviewerName = document.getElementById('review-name').value;
        const reviewerLoc = document.getElementById('review-location').value;
        const reviewBody = document.getElementById('review-text').value;

        const { error } = await supabaseClient.from('reviews').insert({
            reviewer_name: reviewerName,
            reviewer_location: reviewerLoc,
            rating: currentRating,
            review_text: reviewBody,
            is_approved: true // ننشرها مباشرة (أو false إذا أردت مراجعتها)
        });

        if (error) {
            console.error('Error submitting review:', error);
            alert("حدث خطأ أثناء الإرسال.");
        } else {
            alert("شكراً لك! تم نشر رأيك بنجاح.");
            reviewForm.reset();
            currentRating = 0;
            highlightStars(0);
            ratingText.textContent = "0/5";
            reviewModal.style.display = 'none';
            
            // تحديث قائمة الآراء فوراً
            getReviews(); 
        }
    });
}
// --- الخطوة الأخيرة: التشغيل ---
document.addEventListener('DOMContentLoaded', loadInitialData);