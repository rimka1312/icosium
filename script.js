// ---------------------------------------------------
// ملف script.js الصحيح (بعد إصلاح خطأ 'import')
// ---------------------------------------------------

// الخطوة 1: احصل على "createClient" من المتغير العالمي "supabase"
// (هذا المتغير "supabase" جاء من السكريبت الذي أضفناه في index.html)
const { createClient } = supabase;

// الخطوة 2: مفاتيحك الخاصة (استبدلها من حسابك)
const SUPABASE_URL = 'https://vhrvdkaqlrwplkdgwwkl.supabase.co'; // ⬅️ (هذا سيكون الرابط الخاص بك)
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZocnZka2FxbHJ3cGxrZGd3d2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzOTUyMTAsImV4cCI6MjA3ODk3MTIxMH0.mNAn3qo48y46FDkDOqUVt1xwN2smFMZL1lBNbT0OkTA'; // ⬅️ (هذا سيكون المفتاح الطويل الخاص بك)
// الخطوة 3: إنشاء "العميل" باسم جديد "supabaseClient"
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// لنختبره!
console.log('Supabase client is ready!', supabaseClient);


// --- دالة جلب وعرض المنتجات ---

async function getProducts() {
    console.log('Fetching products...');
    
    // الخطوة 4: استخدام اسم العميل الجديد "supabaseClient" هنا
    let { data: products, error } = await supabaseClient
        .from('products')
        .select('*');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    // وجدنا المنتجات!
    console.log('Products found:', products);

    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = ''; 

    for (let product of products) {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card'); 

      // ... (داخل دالة getProducts، داخل حلقة 'for') ...

// --- دوال مساعدة لإنشاء الخيارات ---

// دالة لإنشاء دوائر الألوان
function createColorOptions(colors) {
    if (!colors || colors.length === 0) return ''; // إذا لم تكن هناك ألوان، لا ترجع شيئاً

    let colorHtml = '<label class="options-label">الألوان:</label><div class="product-colors">';
    for (const color of colors) {
        // نستخدم "style" لوضع اللون مباشرة من قاعدة البيانات
        colorHtml += `<span class="color-dot" style="background-color: ${color};" title="${color}"></span>`;
    }
    colorHtml += '</div>';
    return colorHtml;
}

// دالة لإنشاء أزرار المقاسات
function createSizeOptions(sizes) {
    if (!sizes || sizes.length === 0) return ''; // إذا لم تكن هناك مقاسات

    let sizeHtml = '<label class="options-label">المقاسات:</label><div class="product-sizes">';
    for (const size of sizes) {
        sizeHtml += `<span class="size-box">${size}</span>`;
    }
    sizeHtml += '</div>';
    return sizeHtml;
}

// --- نهاية الدوال المساعدة ---


// ✅ الكود الجديد لـ innerHTML (يستخدم الدوال أعلاه)
productCard.innerHTML = `
    <img src="${product.image_url}" alt="${product.name}">
    <div class="product-details">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">${product.price} DZD</p>

        <div class="product-options">
            ${createColorOptions(product.colors)}
            ${createSizeOptions(product.sizes)}
        </div>

        <button class="add-to-cart-btn">أضف إلى السلة</button>
    </div>
`;
        
        productsGrid.appendChild(productCard);
    }
}

// أخيراً، قم بتشغيل الدالة فوراً عند فتح الصفحة
getProducts();