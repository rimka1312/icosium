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
        .from('Products')
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

        productCard.innerHTML = `
            <h3>${product.name}</h3>
            <p>${product.price} DZD</p>
        `;
        
        productsGrid.appendChild(productCard);
    }
}

// أخيراً، قم بتشغيل الدالة فوراً عند فتح الصفحة
getProducts();