// --- 0. Config Supabase ---
const { createClient } = supabase;
const SUPABASE_URL = 'https://vhrvdkaqlrwplkdgwwkl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZocnZka2FxbHJ3cGxrZGd3d2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzOTUyMTAsImV4cCI6MjA3ODk3MTIxMH0.mNAn3qo48y46FDkDOqUVt1xwN2smFMZL1lBNbT0OkTA';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// قائمة الموصلين
const livreursList = [
    { id: 'L01', name: 'Ahmed (Alger)' },
    { id: 'L02', name: 'Karim (Oran)' },
    { id: 'L03', name: 'Yacine (Moto)' }
];

// --- 1. إدارة تسجيل الدخول (Login) ---
document.addEventListener('DOMContentLoaded', () => {
    checkSession(); // التحقق هل الآدمن مسجل دخول؟
    
    // زر الوضع الليلي
    const savedTheme = localStorage.getItem('admin_theme');
    if(savedTheme === 'dark') document.body.classList.add('dark-mode');
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    // حفظ المنتج (Save) مع رفع الصورة
document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // زر الحفظ (لتغيير النص أثناء الرفع)
    const saveBtn = document.querySelector('.save-btn');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = "Enregistrement...";
    saveBtn.disabled = true;

    const id = document.getElementById('prod-id').value;
    const fileInput = document.getElementById('prod-image-file');
    let imageUrl = document.getElementById('prod-image-url').value; // الرابط القديم افتراضياً

    // 1. التحقق هل تم اختيار ملف جديد؟
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const uploadedUrl = await uploadImage(file); // استدعاء دالة الرفع
        if (uploadedUrl) {
            imageUrl = uploadedUrl; // تحديث الرابط بالجديد
        } else {
            saveBtn.textContent = originalText;
            saveBtn.disabled = false;
            return; // توقف إذا فشل الرفع
        }
    }

    // تحويل النصوص لمصفوفات
    const colorsArr = document.getElementById('prod-colors').value.split(',').map(s => s.trim()).filter(s => s);
    const sizesArr = document.getElementById('prod-sizes').value.split(',').map(s => s.trim()).filter(s => s);

    const productData = {
        name: document.getElementById('prod-name').value,
        price: document.getElementById('prod-price').value,
        stock: document.getElementById('prod-stock').value,
        image_url: imageUrl, // ✅ استخدام الرابط (سواء القديم أو الجديد المرفوع)
        colors: colorsArr,
        sizes: sizesArr,
        category_id: 1
    };

    let error;
    if (id) {
        // Update
        ({ error } = await supabaseClient.from('products').update(productData).eq('id', id));
    } else {
        // Insert
        ({ error } = await supabaseClient.from('products').insert(productData));
    }

    // إعادة الزر لحالته الطبيعية
    saveBtn.textContent = originalText;
    saveBtn.disabled = false;

    if (!error) {
        alert('Produit enregistré !');
        closeProductModal();
        loadStock();
        loadDashboardStats();
    } else {
        console.error(error);
        alert('Erreur lors de l\'enregistrement');
    }
});
});

// التحقق من الجلسة
function checkSession() {
    const isAdmin = localStorage.getItem('icosium_admin_logged');
    if (isAdmin) {
        showAdminPanel();
    } else {
        document.getElementById('login-section').style.display = 'flex';
        document.getElementById('admin-dashboard').style.display = 'none';
    }
}

// عملية تسجيل الدخول
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    const errorMsg = document.getElementById('login-error');

    // التحقق من قاعدة البيانات
    let { data: admins, error } = await supabaseClient
        .from('admins')
        .select('*')
        .eq('email', email)
        .eq('password', password); // (ملاحظة: في التطبيق الحقيقي استخدم التشفير)

    if (admins && admins.length > 0) {
        // نجاح الدخول
        localStorage.setItem('icosium_admin_logged', 'true');
        localStorage.setItem('admin_name', admins[0].name);
        showAdminPanel();
    } else {
        // فشل الدخول
        errorMsg.style.display = 'block';
    }
});

// إظهار لوحة التحكم
function showAdminPanel() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'flex';
    document.getElementById('admin-name-display').textContent = localStorage.getItem('admin_name') || 'Admin';
    
    // تحميل البيانات
    loadDashboardStats();
    loadOrders();
    loadStock();
}

// تسجيل الخروج
window.logout = () => {
    localStorage.removeItem('icosium_admin_logged');
    location.reload();
};

// --- 2. التنقل (Navigation) ---
window.showSection = (id) => {
    document.querySelectorAll('.view-section').forEach(el => el.style.display = 'none');
    document.getElementById(id + '-view').style.display = 'block';
    document.querySelectorAll('.sidebar-menu li').forEach(li => li.classList.remove('active'));
    event.currentTarget.classList.add('active');
};

// --- 3. لوحة القيادة (Dashboard) ---
async function loadDashboardStats() {
    let { data: orders } = await supabaseClient.from('orders').select('*');
    let { data: products } = await supabaseClient.from('products').select('id');

    if (orders) {
        document.getElementById('stat-total-orders').textContent = orders.length;
        document.getElementById('stat-revenue').textContent = orders.reduce((a, b) => a + (b.total_price || 0), 0).toLocaleString();
        const pending = orders.filter(o => o.status === 'Pending').length;
        document.getElementById('pending-count').textContent = pending;
    }
    if (products) {
        document.getElementById('stat-products').textContent = products.length;
    }
}

// --- 4. إدارة الطلبات (Orders) ---
async function loadOrders() {
    const tbody = document.getElementById('orders-table-body');
    tbody.innerHTML = '<tr><td colspan="7">Chargement...</td></tr>';

    let { data: orders } = await supabaseClient.from('orders').select('*').order('created_at', { ascending: false });

    tbody.innerHTML = '';
    if(orders) {
        orders.forEach(order => {
            let opts = `<option value="">Choisir...</option>`;
            livreursList.forEach(l => opts += `<option value="${l.id}" ${order.livreur_id === l.id ? 'selected' : ''}>${l.name}</option>`);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${order.id}</td>
                <td>${order.customer_name}<br><small>${order.customer_phone}</small></td>
                <td>${order.customer_address.split('-')[0]}</td>
                <td>${order.total_price} DA</td>
                <td><span class="badge" style="background:${getStatusColor(order.status)}">${order.status}</span></td>
                <td><select class="livreur-select" onchange="assignLivreur(${order.id}, this.value)">${opts}</select></td>
                <td>
                    <button class="action-btn delete" onclick="deleteOrder(${order.id})"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

function getStatusColor(status) {
    return status === 'Pending' ? '#f1c40f' : status === 'Shipped' ? '#3498db' : status === 'Delivered' ? '#2ecc71' : '#95a5a6';
}

window.assignLivreur = async (id, livId) => {
    if(!livId) return;
    await supabaseClient.from('orders').update({ livreur_id: livId, status: 'Shipped' }).eq('id', id);
    alert('Livreur assigné !');
    loadOrders();
};

window.deleteOrder = async (id) => {
    if(confirm('Supprimer cette commande ?')) {
        await supabaseClient.from('orders').delete().eq('id', id);
        loadOrders();
        loadDashboardStats();
    }
};

// --- 5. إدارة المخزون (Stock Management) - الجوهر الجديد ---
async function loadStock() {
    const tbody = document.getElementById('stock-table-body');
    tbody.innerHTML = '<tr><td colspan="5">Chargement...</td></tr>';

    let { data: products } = await supabaseClient.from('products').select('*').order('id');

    tbody.innerHTML = '';
    if(products) {
        products.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${p.image_url}" width="50" style="border-radius:5px;"></td>
                <td>${p.name}</td>
                <td>${p.price} DA</td>
                <td>${p.stock || 0}</td>
                <td>
                    <button class="action-btn edit" onclick='editProduct(${JSON.stringify(p)})'><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete" onclick="deleteProduct(${p.id})"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// إضافة/تعديل منتج (Modal)
const modal = document.getElementById('product-modal');
window.openProductModal = () => {
    document.getElementById('product-form').reset();
    document.getElementById('prod-id').value = '';
    document.getElementById('modal-title').textContent = 'Ajouter un Produit';
    modal.style.display = 'flex';
};

window.editProduct = (p) => {
    document.getElementById('prod-id').value = p.id;
    document.getElementById('prod-name').value = p.name;
    document.getElementById('prod-price').value = p.price;
    document.getElementById('prod-stock').value = p.stock;
    
    // التعامل مع الصورة
    document.getElementById('prod-image-url').value = p.image_url; // حفظ الرابط القديم
    const preview = document.getElementById('image-preview');
    if(p.image_url) {
        preview.src = p.image_url;
        preview.style.display = 'block';
    } else {
        preview.style.display = 'none';
    }
    
    // تصفير حقل الملف
    document.getElementById('prod-image-file').value = "";

    document.getElementById('prod-colors').value = p.colors ? p.colors.join(', ').replace(/"/g, '') : '';
    document.getElementById('prod-sizes').value = p.sizes ? p.sizes.join(', ').replace(/"/g, '') : '';
    
    document.getElementById('modal-title').textContent = 'Modifier le Produit';
    modal.style.display = 'flex';
};
window.closeProductModal = () => modal.style.display = 'none';

// حفظ المنتج (Save)
document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('prod-id').value;
    
    // تحويل النصوص لمصفوفات
    const colorsArr = document.getElementById('prod-colors').value.split(',').map(s => s.trim()).filter(s => s);
    const sizesArr = document.getElementById('prod-sizes').value.split(',').map(s => s.trim()).filter(s => s);

    const productData = {
        name: document.getElementById('prod-name').value,
        price: document.getElementById('prod-price').value,
        stock: document.getElementById('prod-stock').value,
        image_url: document.getElementById('prod-image').value,
        colors: colorsArr, // سيقوم Supabase بتحويلها تلقائياً
        sizes: sizesArr,
        category_id: 1 // افتراضي (يمكنك إضافة قائمة منسدلة للفئات)
    };

    let error;
    if (id) {
        // Update
        ({ error } = await supabaseClient.from('products').update(productData).eq('id', id));
    } else {
        // Insert
        ({ error } = await supabaseClient.from('products').insert(productData));
    }

    if (!error) {
        alert('Produit enregistré !');
        closeProductModal();
        loadStock();
        loadDashboardStats();
    } else {
        console.error(error);
        alert('Erreur lors de l\'enregistrement');
    }
});

window.deleteProduct = async (id) => {
    if(confirm('Supprimer ce produit ?')) {
        await supabaseClient.from('products').delete().eq('id', id);
        loadStock();
    }
};
// --- دالة مساعدة لرفع الصورة ---
async function uploadImage(file) {
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`; // اسم فريد
    
    // 1. الرفع إلى Supabase Storage
    const { data, error } = await supabaseClient
        .storage
        .from('product-images') // اسم الـ Bucket الذي أنشأته
        .upload(fileName, file);

    if (error) {
        console.error("Erreur upload:", error);
        alert("Erreur lors du téléchargement de l'image");
        return null;
    }

    // 2. الحصول على الرابط العام (Public URL)
    const { data: urlData } = supabaseClient
        .storage
        .from('product-images')
        .getPublicUrl(fileName);

    return urlData.publicUrl;
}
// معاينة الصورة عند اختيار ملف
document.getElementById('prod-image-file').addEventListener('change', function(e) {
    const preview = document.getElementById('image-preview');
    const file = e.target.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});
// --- 6. الوضع الليلي ---
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('admin_theme', theme);
}