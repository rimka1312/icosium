/* ==========================================================================
   ERP ICOSIUM — نظام إدارة الإنتاج والتكاليف
   المطور: كريم — IT Technician & Developer
   النسخة: 2.0 | 2026
   ========================================================================== */

'use strict';

// ══════════════════════════════════════════════
// 1. تهيئة Supabase
// ══════════════════════════════════════════════
const { createClient } = supabase;
const SUPABASE_URL     = 'https://vhrvdkaqlrwplkdgwwkl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZocnZka2FxbHJ3cGxrZGd3d2tsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzOTUyMTAsImV4cCI6MjA3ODk3MTIxMH0.mNAn3qo48y46FDkDOqUVt1xwN2smFMZL1lBNbT0OkTA';
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ══════════════════════════════════════════════
// 2. متغيرات عامة
// ══════════════════════════════════════════════
let costChartInstance = null;
let allProjects       = [];
let sidebarOpen       = true;   // حالة الـ Sidebar

// ══════════════════════════════════════════════
// 3. التهيئة عند تحميل الصفحة
// ══════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {
    // التحقق من جلسة محفوظة
    const session = JSON.parse(localStorage.getItem('erp_session'));
    if (session) {
        hideLogin();
        initApp(session);
    }

    // بناء زر تبديل الـ Sidebar
    buildSidebarToggle();

    // إدارة الـ Sidebar على الشاشات الصغيرة
    handleResponsiveSidebar();

    // إغلاق الـ Sidebar عند الضغط على الخلفية (موبايل)
    document.getElementById('sidebar-overlay')?.addEventListener('click', closeSidebar);

    // تحديث أيقونة الثيم عند التحميل
    syncThemeIcon();
});

// ══════════════════════════════════════════════
// 4. بناء عناصر UI الإضافية
// ══════════════════════════════════════════════

/** زر فتح/إغلاق الـ Sidebar */
function buildSidebarToggle() {
    // زر التبديل في الـ Header
    const header = document.querySelector('.top-header');
    if (!header) return;

    const toggleBtn = document.createElement('button');
    toggleBtn.className   = 'icon-btn sidebar-toggle-btn';
    toggleBtn.title       = 'إخفاء/إظهار القائمة';
    toggleBtn.innerHTML   = '<i class="fas fa-bars"></i>';
    toggleBtn.onclick     = toggleSidebar;

    // إدراجه أول شيء في الـ Header
    header.insertBefore(toggleBtn, header.firstChild);

    // Overlay للموبايل
    const overlay = document.createElement('div');
    overlay.id        = 'sidebar-overlay';
    overlay.className = 'sidebar-overlay';
    overlay.onclick   = closeSidebar;
    document.body.appendChild(overlay);
}

/** إضافة CSS للـ Sidebar المتحرك في نفس الملف */
(function injectSidebarCSS() {
    const style = document.createElement('style');
    style.textContent = `
        /* ─── Sidebar Transition ─── */
        .sidebar {
            transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1),
                        width 0.32s cubic-bezier(0.4, 0, 0.2, 1),
                        opacity 0.32s ease;
            will-change: transform;
        }

        /* Desktop: Sidebar مخفي = ضغط إلى اليمين */
        .sidebar.sidebar-collapsed {
            transform: translateX(110%);
            width: 0 !important;
            opacity: 0;
            pointer-events: none;
            overflow: hidden;
        }

        #erp-app {
            transition: grid-template-columns 0.32s cubic-bezier(0.4, 0, 0.2, 1);
        }

        #erp-app.sidebar-hidden {
            grid-template-columns: 0 1fr;
        }

        /* ─── Sidebar Overlay (Mobile) ─── */
        .sidebar-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(5, 8, 16, 0.65);
            backdrop-filter: blur(4px);
            z-index: 150;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .sidebar-overlay.visible {
            display: block;
            opacity: 1;
        }

        /* ─── Mobile Sidebar ─── */
        @media (max-width: 700px) {
            .sidebar {
                position: fixed !important;
                right: -100% !important;
                top: 0 !important;
                height: 100vh !important;
                z-index: 200 !important;
                width: 260px !important;
                transform: none !important;
                opacity: 1 !important;
                pointer-events: auto !important;
                box-shadow: -8px 0 40px rgba(0,0,0,0.6);
            }
            .sidebar.sidebar-open-mobile {
                right: 0 !important;
            }
            .sidebar.sidebar-collapsed {
                transform: none !important;
                width: 260px !important;
                opacity: 1 !important;
            }
            #erp-app.sidebar-hidden {
                grid-template-columns: 1fr !important;
            }
        }

        /* ─── Nav Item ripple ─── */
        .nav-btn { overflow: hidden; position: relative; }
        .nav-btn .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(79, 123, 255, 0.25);
            transform: scale(0);
            animation: rippleAnim 0.5s linear;
            pointer-events: none;
        }
        @keyframes rippleAnim {
            to { transform: scale(4); opacity: 0; }
        }

        /* ─── Toast Notifications ─── */
        #toast-container {
            position: fixed;
            bottom: 24px;
            left: 24px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 9999;
        }

        .toast {
            display: flex;
            align-items: center;
            gap: 12px;
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 14px 18px;
            min-width: 280px;
            max-width: 360px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5);
            animation: toastIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
            font-family: 'Cairo', sans-serif;
            font-size: 13px;
            color: var(--text-primary);
        }

        .toast.removing {
            animation: toastOut 0.3s ease forwards;
        }

        @keyframes toastIn {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes toastOut {
            to { opacity: 0; transform: translateY(10px) scale(0.95); }
        }

        .toast-icon {
            width: 34px; height: 34px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            flex-shrink: 0;
        }

        .toast-success .toast-icon { background: rgba(34,211,160,0.15); color: #22d3a0; }
        .toast-error   .toast-icon { background: rgba(244,63,94,0.15);  color: #f43f5e; }
        .toast-info    .toast-icon { background: rgba(79,123,255,0.15);  color: #7da0ff; }
        .toast-warn    .toast-icon { background: rgba(245,158,11,0.15);  color: #f59e0b; }

        .toast-progress {
            position: absolute;
            bottom: 0; right: 0;
            height: 3px;
            border-radius: 0 0 10px 10px;
            background: var(--accent);
            animation: toastProgress var(--duration, 3s) linear forwards;
        }
        @keyframes toastProgress { to { width: 0; } }

        /* ─── Loading Skeleton ─── */
        .skeleton {
            background: linear-gradient(90deg,
                rgba(255,255,255,0.04) 25%,
                rgba(255,255,255,0.08) 50%,
                rgba(255,255,255,0.04) 75%);
            background-size: 200% 100%;
            animation: shimmer 1.4s infinite;
            border-radius: 6px;
        }
        @keyframes shimmer {
            0%   { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }

        /* ─── Status Badges from JS ─── */
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
        }
        .status-badge::before {
            content: '';
            width: 6px; height: 6px;
            border-radius: 50%;
            flex-shrink: 0;
        }
        .status-active  { background: rgba(34,211,160,0.1); color: #22d3a0; }
        .status-active::before  { background: #22d3a0; }
        .status-pending { background: rgba(245,158,11,0.1);  color: #f59e0b; }
        .status-pending::before { background: #f59e0b; }
        .status-done    { background: rgba(79,123,255,0.1);  color: #7da0ff; }
        .status-done::before    { background: #4f7bff; }

        /* ─── KPI number animation ─── */
        .kpi-details strong {
            transition: color 0.3s ease;
        }
    `;
    document.head.appendChild(style);

    // Toast container
    const tc = document.createElement('div');
    tc.id = 'toast-container';
    document.body.appendChild(tc);
})();


// ══════════════════════════════════════════════
// 5. نظام الـ Sidebar Toggle
// ══════════════════════════════════════════════

function toggleSidebar() {
    const isMobile = window.innerWidth <= 700;
    isMobile ? toggleSidebarMobile() : toggleSidebarDesktop();
}

function toggleSidebarDesktop() {
    const sidebar = document.querySelector('.sidebar');
    const app     = document.getElementById('erp-app');
    sidebarOpen   = !sidebarOpen;

    if (sidebarOpen) {
        sidebar.classList.remove('sidebar-collapsed');
        app.classList.remove('sidebar-hidden');
    } else {
        sidebar.classList.add('sidebar-collapsed');
        app.classList.add('sidebar-hidden');
    }

    // تحديث أيقونة الزر
    const icon = document.querySelector('.sidebar-toggle-btn i');
    if (icon) {
        icon.className = sidebarOpen ? 'fas fa-bars' : 'fas fa-indent';
    }
}

function toggleSidebarMobile() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const isOpen  = sidebar.classList.contains('sidebar-open-mobile');

    if (isOpen) {
        closeSidebar();
    } else {
        sidebar.classList.add('sidebar-open-mobile');
        overlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
    }
}

function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.remove('sidebar-open-mobile');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
}

function handleResponsiveSidebar() {
    const mediaQuery = window.matchMedia('(max-width: 700px)');

    function onChange(e) {
        if (!e.matches) {
            // عودة للـ Desktop: إعادة ضبط الـ Mobile classes
            document.querySelector('.sidebar')?.classList.remove('sidebar-open-mobile');
            document.getElementById('sidebar-overlay')?.classList.remove('visible');
            document.body.style.overflow = '';
        }
    }

    mediaQuery.addEventListener('change', onChange);
}


// ══════════════════════════════════════════════
// 6. نظام المصادقة (Login)
// ══════════════════════════════════════════════

async function doErpLogin(event) {
    event.preventDefault();

    const email  = document.getElementById('erp-email').value.trim();
    const pass   = document.getElementById('erp-pass').value.trim();
    const msgEl  = document.getElementById('login-msg');
    const btn    = event.target.querySelector('button[type="submit"]');

    // حالة التحميل
    setMsgState(msgEl, 'loading', '<i class="fas fa-spinner fa-spin"></i> جاري التحقق من الهوية...');
    btn.disabled = true;

    try {
        const { data, error } = await db
            .from('admins')
            .select('*')
            .eq('email', email)
            .eq('password', pass)
            .single();

        if (error || !data) {
            setMsgState(msgEl, 'error', '<i class="fas fa-exclamation-circle"></i> البريد الإلكتروني أو كلمة المرور غير صحيحة');
            // هزّ البطاقة
            document.querySelector('.login-card').style.animation = 'none';
            void document.querySelector('.login-card').offsetWidth;
            document.querySelector('.login-card').style.animation = 'shake 0.4s ease';
        } else {
            setMsgState(msgEl, 'success', '<i class="fas fa-check-circle"></i> تم التحقق بنجاح، جاري التحميل...');
            localStorage.setItem('erp_session', JSON.stringify(data));

            // تأخير بسيط للأنيماشن
            setTimeout(() => {
                hideLogin();
                initApp(data);
            }, 600);
        }
    } catch (err) {
        setMsgState(msgEl, 'error', '<i class="fas fa-wifi"></i> خطأ في الاتصال بالخادم');
        console.error('[Login Error]', err);
    } finally {
        btn.disabled = false;
    }
}

function setMsgState(el, type, html) {
    const colors = {
        loading: 'var(--accent-orange)',
        error:   'var(--accent-red)',
        success: 'var(--accent-green)',
        info:    'var(--accent-light)'
    };
    el.innerHTML  = html;
    el.style.color = colors[type] || colors.info;
}

function hideLogin() {
    const loginEl = document.getElementById('erp-login-screen');
    loginEl.style.opacity    = '0';
    loginEl.style.transition = 'opacity 0.4s ease';
    setTimeout(() => {
        loginEl.style.display = 'none';
        document.getElementById('erp-app').style.display = 'grid';
    }, 400);
}

function logoutErp() {
    showConfirm('هل تريد تسجيل الخروج من نظام ERP؟', () => {
        localStorage.removeItem('erp_session');
        location.reload();
    });
}

// إضافة أنيماشن Shake لبطاقة تسجيل الدخول
(function addShakeKeyframe() {
    const s = document.createElement('style');
    s.textContent = `@keyframes shake {
        0%,100%{transform:translateX(0) scale(1)}
        20%{transform:translateX(-8px)}
        40%{transform:translateX(8px)}
        60%{transform:translateX(-5px)}
        80%{transform:translateX(5px)}
    }`;
    document.head.appendChild(s);
})();


// ══════════════════════════════════════════════
// 7. تهيئة التطبيق
// ══════════════════════════════════════════════

async function initApp(user) {
    const nameEl = document.getElementById('current-user-name');
    if (nameEl) nameEl.textContent = user.name || 'مدير النظام';

    syncThemeIcon();
    addNavRippleEffect();

    // تحميل البيانات بالتوازي
    await Promise.all([
        loadMaterialsDropdown(),
        loadDashboardData()
    ]);

    // إظهار الـ Sidebar بأنيماشن
    animateSidebarIn();
}

function animateSidebarIn() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    sidebar.style.opacity   = '0';
    sidebar.style.transform = 'translateX(30px)';
    requestAnimationFrame(() => {
        sidebar.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.2, 0.64, 1)';
        sidebar.style.opacity    = '1';
        sidebar.style.transform  = 'translateX(0)';
        setTimeout(() => {
            sidebar.style.transition = '';
        }, 400);
    });
}


// ══════════════════════════════════════════════
// 8. التنقل بين اللوحات
// ══════════════════════════════════════════════

function showPanel(panelId) {
    // إخفاء اللوحة الحالية
    const currentPanel = document.querySelector('.erp-panel.active');
    if (currentPanel) {
        currentPanel.style.opacity   = '0';
        currentPanel.style.transform = 'translateY(8px)';
    }

    setTimeout(() => {
        // إخفاء الكل
        document.querySelectorAll('.erp-panel').forEach(p => {
            p.classList.remove('active');
            p.style.opacity   = '';
            p.style.transform = '';
        });

        // تفعيل اللوحة الجديدة
        const target = document.getElementById('panel-' + panelId);
        if (target) target.classList.add('active');

        // تحديث الـ Nav
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        const activeNav = document.getElementById('nav-' + panelId);
        if (activeNav) activeNav.classList.add('active');

        // على الموبايل — إغلاق الـ Sidebar بعد التنقل
        if (window.innerWidth <= 700) closeSidebar();

        // تحديث البيانات عند الضرورة
        if (panelId === 'dashboard') loadDashboardData();

    }, currentPanel ? 150 : 0);
}

/** تأثير Ripple على أزرار الـ Nav */
function addNavRippleEffect() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width  = ripple.style.height = size + 'px';
            ripple.style.right  = (e.clientX - rect.right  + size / 2) + 'px';
            ripple.style.top    = (e.clientY - rect.top  - size / 2) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 500);
        });
    });
}


// ══════════════════════════════════════════════
// 9. الوضع الليلي / النهاري
// ══════════════════════════════════════════════

function toggleTheme() {
    const html  = document.documentElement;
    const theme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', theme);
    localStorage.setItem('erp_theme', theme);
    syncThemeIcon();

    showToast(theme === 'dark' ? 'تم التبديل إلى الوضع الليلي' : 'تم التبديل إلى الوضع النهاري', 'info', 'fas fa-moon');
}

function syncThemeIcon() {
    const html  = document.documentElement;
    const theme = html.getAttribute('data-theme') || localStorage.getItem('erp_theme') || 'dark';

    // تطبيق الثيم المحفوظ عند أول تحميل
    html.setAttribute('data-theme', theme);

    const icon = document.getElementById('theme-icon');
    if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}


// ══════════════════════════════════════════════
// 10. لوحة القيادة — البيانات والرسم
// ══════════════════════════════════════════════

async function loadDashboardData() {
    showSkeletonRows();

    try {
        const { data: projects, error } = await db
            .from('production_projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        allProjects = projects || [];
        renderProjectsTable(allProjects);
        computeAndUpdateKPIs(allProjects);

    } catch (err) {
        console.error('[Dashboard Error]', err);
        document.getElementById('projects-list').innerHTML = `
            <tr><td colspan="5" style="text-align:center;color:var(--accent-red);padding:24px;">
                <i class="fas fa-exclamation-triangle" style="margin-left:6px;"></i>
                خطأ في تحميل البيانات
            </td></tr>`;
    }
}

function showSkeletonRows() {
    const list = document.getElementById('projects-list');
    if (!list) return;
    let rows = '';
    for (let i = 0; i < 3; i++) {
        rows += `<tr>
            <td><div class="skeleton" style="height:14px;width:120px;"></div></td>
            <td><div class="skeleton" style="height:14px;width:50px;"></div></td>
            <td><div class="skeleton" style="height:14px;width:80px;"></div></td>
            <td><div class="skeleton" style="height:14px;width:80px;"></div></td>
            <td><div class="skeleton" style="height:22px;width:70px;border-radius:20px;"></div></td>
        </tr>`;
    }
    list.innerHTML = rows;
}

function renderProjectsTable(projects) {
    const list = document.getElementById('projects-list');
    if (!list) return;

    if (!projects.length) {
        list.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:40px;">
            <i class="fas fa-inbox" style="font-size:28px;display:block;margin-bottom:10px;opacity:0.3;"></i>
            لا توجد مشاريع إنتاج حالياً
        </td></tr>`;
        return;
    }

    list.innerHTML = projects.map((p, i) => {
        const tailorTotal   = p.tailoring_cost_per_unit * p.target_quantity;
        const projectTotal  = p.total_material_cost + tailorTotal + p.additional_costs;
        const costPerUnit   = projectTotal / p.target_quantity;
        const suggestedPrice = Math.round(costPerUnit * 1.45);

        const statusMap = {
            'in_progress': ['status-pending', 'قيد الإنجاز'],
            'completed':   ['status-done',    'مكتمل'],
            'active':      ['status-active',  'نشط']
        };
        const [statusClass, statusLabel] = statusMap[p.status] || ['status-pending', 'قيد الإنجاز'];

        // تأخير أنيماشن لكل صف
        const delay = i * 50;

        return `<tr style="animation: panelIn 0.3s ${delay}ms ease both; opacity:0;">
            <td><strong>${escapeHtml(p.product_name)}</strong></td>
            <td>${p.target_quantity.toLocaleString()}</td>
            <td style="color:var(--accent-red);font-weight:700;">${Math.round(costPerUnit).toLocaleString()} DA</td>
            <td style="color:var(--accent-green);font-weight:700;">${suggestedPrice.toLocaleString()} DA</td>
            <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
        </tr>`;
    }).join('');
}

function computeAndUpdateKPIs(projects) {
    let totalInvestment  = 0;
    let totalItems       = 0;
    let totalMatCost     = 0;
    let totalTailorCost  = 0;
    let totalExtraCost   = 0;
    let activeCount      = 0;

    projects.forEach(p => {
        const tailorTotal  = p.tailoring_cost_per_unit * p.target_quantity;
        const projectTotal = p.total_material_cost + tailorTotal + p.additional_costs;

        totalInvestment += projectTotal;
        totalItems      += p.target_quantity;
        totalMatCost    += p.total_material_cost;
        totalTailorCost += tailorTotal;
        totalExtraCost  += p.additional_costs;

        if (p.status !== 'completed') activeCount++;
    });

    const globalAvg = totalItems > 0 ? totalInvestment / totalItems : 0;

    animateCounter('total-investment', totalInvestment, ' DA');
    animateCounter('avg-cost', globalAvg, ' DA');
    animateCounterInt('active-projects', activeCount);
    // نواقص مخزون (يمكن ربطها بـ Supabase لاحقاً)
    document.getElementById('low-stock').textContent = '0 مواد';

    updateCostChart(totalMatCost, totalTailorCost, totalExtraCost);
}

/** تأثير عد الأرقام للـ KPI */
function animateCounter(elId, targetValue, suffix = '') {
    const el = document.getElementById(elId);
    if (!el) return;
    const start    = 0;
    const duration = 800;
    const startTime = performance.now();

    function update(now) {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current  = Math.round(start + (targetValue - start) * eased);
        el.textContent = current.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

function animateCounterInt(elId, targetValue) {
    animateCounter(elId, targetValue, '');
}


// ══════════════════════════════════════════════
// 11. رسم المخطط البياني
// ══════════════════════════════════════════════

function updateCostChart(materials, tailoring, extras) {
    const ctx = document.getElementById('costDistributionChart');
    if (!ctx) return;

    if (costChartInstance) costChartInstance.destroy();

    const isDark   = document.documentElement.getAttribute('data-theme') !== 'light';
    const textColor = isDark ? '#8b9fc9' : '#4a5c84';

    const totalData = materials + tailoring + extras;
    if (totalData === 0) {
        // رسم بياني فارغ
        ctx.closest('.chart-container').innerHTML = `
            <div style="text-align:center;color:var(--text-muted);">
                <i class="fas fa-chart-pie" style="font-size:40px;opacity:0.2;display:block;margin-bottom:8px;"></i>
                لا توجد بيانات كافية
            </div>`;
        return;
    }

    costChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['القماش والمواد', 'الخياطة والمصنع', 'الإكسسوارات والشحن'],
            datasets: [{
                data: [materials, tailoring, extras],
                backgroundColor: ['#4f7bff', '#22d3a0', '#f59e0b'],
                borderColor:     ['#4f7bff30', '#22d3a030', '#f59e0b30'],
                borderWidth: 3,
                hoverOffset: 8,
                hoverBorderColor: '#fff',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            animation: { animateScale: true, duration: 700, easing: 'easeOutQuart' },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { family: 'Cairo', size: 12, weight: '600' },
                        color: textColor,
                        padding: 16,
                        usePointStyle: true,
                        pointStyleWidth: 10
                    }
                },
                tooltip: {
                    rtl: true,
                    bodyFont:  { family: 'Cairo', size: 12 },
                    titleFont: { family: 'Cairo', size: 12 },
                    callbacks: {
                        label: ctx => ` ${ctx.parsed.toLocaleString()} DA (${((ctx.parsed / totalData) * 100).toFixed(1)}%)`
                    }
                }
            }
        }
    });
}


// ══════════════════════════════════════════════
// 12. مشاريع الإنتاج — إنشاء مشروع جديد
// ══════════════════════════════════════════════

async function createNewProject(event) {
    event.preventDefault();

    const name           = document.getElementById('p-name').value.trim();
    const qty            = parseInt(document.getElementById('p-qty').value); // يأتي من جدول المقاسات
    const materialId     = document.getElementById('p-material').value;
    const matQty         = parseFloat(document.getElementById('p-mat-qty').value);
    const tailorCost     = parseFloat(document.getElementById('p-tailor-cost').value);
    const accessoriesCost = parseFloat(document.getElementById('p-accessories-cost').value || 0);
    const extraCost      = parseFloat(document.getElementById('p-extra-cost').value || 0);

    // 1. تحقق من الحقول الأساسية والمقاسات
    if (!materialId) {
        showToast('يرجى اختيار القماش المستخدم', 'warn', 'fas fa-exclamation');
        document.getElementById('p-material').focus();
        return;
    }

    if (isNaN(qty) || qty < 1) {
        showToast('الرجاء إضافة مقاسات (Variants) للمشروع أولاً', 'warn', 'fas fa-tags');
        return;
    }

    // 2. 🛡️ جدار الحماية الذكي: فحص المخزون قبل أي شيء!
    const selectedOption = document.getElementById('p-material').selectedOptions[0];
    const unitPrice      = parseFloat(selectedOption.getAttribute('data-price') || 0);
    const currentStock   = parseFloat(selectedOption.getAttribute('data-stock') || 0);

    if (matQty > currentStock) {
        showToast(`عذراً! المخزن يحتوي على ${currentStock} فقط، وأنت تطلب ${matQty}. يرجى توفير القماش أولاً.`, 'error', 'fas fa-boxes');
        // تلوين حقل الكمية بالأحمر لتنبيه المستخدم أين الخطأ
        const matInput = document.getElementById('p-mat-qty');
        matInput.style.borderColor = 'var(--accent-red)';
        matInput.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.2)';
        setTimeout(() => { matInput.style.borderColor = ''; matInput.style.boxShadow = ''; }, 3000);
        return; // إيقاف العملية فوراً
    }

    // حساب ملخص التكاليف
    const totalMatCost   = unitPrice * matQty;
    const totalExtra     = accessoriesCost + extraCost;
    const tailorTotal   = tailorCost * qty;
    const projectTotal  = totalMatCost + tailorTotal + totalExtra;
    const costPerUnit   = projectTotal / qty;
    const suggestedPrice = Math.round(costPerUnit * 1.45);

    // عرض ملخص قبل الحفظ
    const confirmed = await showProjectSummary({
        name, qty, costPerUnit, projectTotal, suggestedPrice
    });

    if (!confirmed) return;

    const submitBtn = event.target.querySelector('button[type="submit"]');
    setButtonLoading(submitBtn, true);

    try {
        // 3. حفظ المشروع في قاعدة البيانات (مع المقاسات)
        const { error: insertErr } = await db.from('production_projects').insert([{
            product_name:            name,
            target_quantity:         qty,
            total_material_cost:     totalMatCost,
            tailoring_cost_per_unit: tailorCost,
            additional_costs:        totalExtra,
            status:                  'in_progress',
            variants:                projectVariants // من نظام الـ Size Matrix
        }]);

        if (insertErr) throw insertErr;

        // 4. 📉 الخصم الآلي من المخزون! (السحر هنا)
        const newStock = currentStock - matQty;
        const { error: updateErr } = await db.from('production_materials')
                                             .update({ stock_quantity: newStock })
                                             .eq('id', materialId);
        
        if (updateErr) throw updateErr;

        showToast(`تم إطلاق مشروع "${name}" وخصم ${matQty} من المخزون بنجاح!`, 'success', 'fas fa-rocket');
        
        // تنظيف الشاشة بعد النجاح
        document.getElementById('production-form').reset();
        projectVariants = []; 
        if(typeof renderVariants === 'function') renderVariants();
        document.getElementById('live-calc-box')?.remove();

        // تحديث القوائم في الخلفية لترى الأرقام الجديدة فوراً
        await loadMaterialsDropdown();
        if(typeof loadMaterialsTable === 'function') loadMaterialsTable();

        setTimeout(() => showPanel('dashboard'), 800);

    } catch (err) {
        console.error('[Create Project Error]', err);
        showToast('حدث خطأ أثناء حفظ المشروع: ' + err.message, 'error', 'fas fa-times-circle');
    } finally {
        setButtonLoading(submitBtn, false);
    }
}

/** ملخص المشروع قبل الحفظ */
function showProjectSummary({ name, qty, costPerUnit, projectTotal, suggestedPrice }) {
    return new Promise(resolve => {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay open';
        modal.innerHTML = `
            <div class="modal-content" style="max-width:420px;">
                <div class="modal-header">
                    <h3><i class="fas fa-calculator" style="color:var(--accent);margin-left:8px;"></i> ملخص التكاليف</h3>
                    <button class="close-btn" onclick="this.closest('.modal-overlay').remove(); resolve(false);">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body" style="gap:12px;">
                    <div style="background:var(--bg-input);border:1px solid var(--border);border-radius:10px;padding:16px;display:flex;flex-direction:column;gap:10px;">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span style="color:var(--text-muted);font-size:12px;">اسم المشروع</span>
                            <strong style="font-size:13px;">${escapeHtml(name)}</strong>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span style="color:var(--text-muted);font-size:12px;">الكمية المستهدفة</span>
                            <strong>${qty.toLocaleString()} قطعة</strong>
                        </div>
                        <hr style="border-color:var(--divider);">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span style="color:var(--text-muted);font-size:12px;">إجمالي رأس المال</span>
                            <strong style="color:var(--accent-red);">${Math.round(projectTotal).toLocaleString()} DA</strong>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span style="color:var(--text-muted);font-size:12px;">تكلفة القطعة الواحدة</span>
                            <strong style="color:var(--accent-orange);">${Math.round(costPerUnit).toLocaleString()} DA</strong>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span style="color:var(--text-muted);font-size:12px;">سعر البيع المقترح (45%+)</span>
                            <strong style="color:var(--accent-green);">${suggestedPrice.toLocaleString()} DA</strong>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-outline" id="summary-cancel"><i class="fas fa-times"></i> إلغاء</button>
                    <button class="btn-primary" id="summary-confirm"><i class="fas fa-check"></i> تأكيد وحفظ</button>
                </div>
            </div>`;

        document.body.appendChild(modal);

        document.getElementById('summary-confirm').onclick = () => { modal.remove(); resolve(true); };
        document.getElementById('summary-cancel').onclick  = () => { modal.remove(); resolve(false); };
    });
}


// ══════════════════════════════════════════════
// 13. إدارة المواد الخام
// ══════════════════════════════════════════════

async function loadMaterialsDropdown() {
    try {
        const { data, error } = await db.from('production_materials').select('*').order('name');
        if (error) throw error;

        const select = document.getElementById('p-material');
        if (!select) return;

        select.innerHTML = '<option value="">— اختر القماش الأساسي —</option>' +
            (data || []).map(m => {
                // إظهار تنبيه إذا نفد المخزون
                const stockText = m.stock_quantity > 0 ? `(متاح: ${m.stock_quantity} ${m.unit})` : '⚠️ (نفد من المخزن!)';
                
                // تخزين المخزون (data-stock) لكي نفحصه عند الحفظ
                return `<option value="${m.id}" data-price="${m.unit_price}" data-stock="${m.stock_quantity || 0}">
                    ${escapeHtml(m.name)} — ${m.unit_price.toLocaleString()} DA/${m.unit || 'متر'} ${stockText}
                </option>`;
            }).join('');

    } catch (err) {
        console.error('[Materials Dropdown Error]', err);
    }
}

function openMaterialModal() {
    ['new-mat-name', 'new-mat-price', 'new-mat-stock'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    document.getElementById('material-modal').classList.add('open');
    setTimeout(() => document.getElementById('new-mat-name')?.focus(), 100);
}

function closeMaterialModal() {
    document.getElementById('material-modal').classList.remove('open');
}

async function saveMaterial() {
    const name  = document.getElementById('new-mat-name')?.value.trim();
    const price = parseFloat(document.getElementById('new-mat-price')?.value);
    const unit  = document.getElementById('new-mat-unit')?.value || 'متر';
    const stock = parseFloat(document.getElementById('new-mat-stock')?.value || 0);

    if (!name || isNaN(price) || price <= 0) {
        showToast('يرجى إدخال اسم المادة وسعرها بشكل صحيح', 'warn', 'fas fa-exclamation');
        return;
    }

    const saveBtn = document.querySelector('#material-modal .btn-primary');
    setButtonLoading(saveBtn, true);

    try {
        const { error } = await db.from('production_materials').insert([{
            name,
            unit_price:    price,
            unit,
            stock_quantity: stock
        }]);

        if (error) throw error;

        showToast(`تم حفظ المادة "${name}" بنجاح`, 'success', 'fas fa-box');
        closeMaterialModal();
        await loadMaterialsDropdown();

    } catch (err) {
        console.error('[Save Material Error]', err);
        showToast('حدث خطأ أثناء حفظ المادة', 'error', 'fas fa-times-circle');
    } finally {
        setButtonLoading(saveBtn, false);
    }
}


// ══════════════════════════════════════════════
// 14. مكونات UI المساعدة
// ══════════════════════════════════════════════

/** Toast Notification */
// ══════════════════════════════════════════════
// دالة الإشعارات الذكية (Advanced Toast System)
// ══════════════════════════════════════════════
function showToast(message, type = 'success', icon = '') {
    // 1. إنشاء الحاوية إذا لم تكن موجودة (لتجميع الإشعارات)
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    // 2. تحديد الأيقونة الافتراضية بناءً على نوع الإشعار
    if (!icon) {
        if (type === 'success') icon = 'fas fa-check-circle';
        else if (type === 'error') icon = 'fas fa-times-circle';
        else if (type === 'warn') icon = 'fas fa-exclamation-triangle';
        else icon = 'fas fa-info-circle';
    }

    // تحديد لون شريط التقدم
    const progressColor = type === 'success' ? '#10b981' : (type === 'error' ? '#ef4444' : (type === 'warn' ? '#f59e0b' : '#4f7bff'));

    // 3. إنشاء عنصر الإشعار
    const toast = document.createElement('div');
    toast.className = `erp-toast ${type}`;
    
    toast.innerHTML = `
        <i class="${icon} toast-icon"></i>
        <span class="toast-msg">${message}</span>
        <div class="progress" style="color: ${progressColor};"></div>
    `;

    // 4. إضافة الإشعار للشاشة
    container.appendChild(toast);

    // 5. إخفاء الإشعار آلياً بعد 3 ثوانٍ وحذفه من الـ DOM
    setTimeout(() => {
        toast.classList.add('hide'); // تشغيل حركة الخروج
        toast.addEventListener('animationend', () => {
            toast.remove(); // تنظيف الـ HTML
        });
    }, 3000);
}

/** Dialog تأكيد مخصص */
function showConfirm(message, onConfirm) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay open';
    modal.innerHTML = `
        <div class="modal-content" style="max-width:360px;">
            <div class="modal-header">
                <h3><i class="fas fa-question-circle" style="color:var(--accent-orange);margin-left:8px;"></i> تأكيد</h3>
                <button class="close-btn" onclick="this.closest('.modal-overlay').remove()"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <p style="color:var(--text-secondary);text-align:center;line-height:1.9;">${message}</p>
            </div>
            <div class="modal-footer">
                <button class="btn-outline" onclick="this.closest('.modal-overlay').remove()">
                    <i class="fas fa-times"></i> لا
                </button>
                <button class="btn-primary" id="confirm-yes">
                    <i class="fas fa-check"></i> نعم
                </button>
            </div>
        </div>`;
    document.body.appendChild(modal);
    document.getElementById('confirm-yes').onclick = () => { modal.remove(); onConfirm(); };
}

/** حالة تحميل الأزرار */
function setButtonLoading(btn, loading) {
    if (!btn) return;
    if (loading) {
        btn._originalHTML = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحميل...';
    } else {
        btn.disabled = false;
        btn.innerHTML = btn._originalHTML || btn.innerHTML;
    }
}

/** Escape HTML لمنع XSS */
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
// ==========================================================================
// 15. الميزات الجديدة المضافة (المعاينة، جدول المواد، التقارير)
// ==========================================================================

// --- أ. المعاينة المباشرة (Calcule Voir) ---
function setupLiveCalculation() {
    const inputs = ['p-qty', 'p-material', 'p-mat-qty', 'p-tailor-cost', 'p-accessories-cost', 'p-extra-cost'];
    inputs.forEach(id => {
        document.getElementById(id)?.addEventListener('input', calculateLive);
    });
}

function calculateLive() {
    const qty = parseInt(document.getElementById('p-qty').value) || 0;
    const matQty = parseFloat(document.getElementById('p-mat-qty').value) || 0;
    const tailorCost = parseFloat(document.getElementById('p-tailor-cost').value) || 0;
    const accCost = parseFloat(document.getElementById('p-accessories-cost').value) || 0;
    const exCost = parseFloat(document.getElementById('p-extra-cost').value) || 0;
    
    const select = document.getElementById('p-material');
    const unitPrice = select.selectedIndex > 0 ? parseFloat(select.options[select.selectedIndex].getAttribute('data-price')) : 0;

    if (qty > 0) {
        const totalMatCost = unitPrice * matQty;
        const tailorTotal = tailorCost * qty;
        const projectTotal = totalMatCost + tailorTotal + accCost + exCost;
        const costPerUnit = projectTotal / qty;

        // إنشاء أو تحديث صندوق المعاينة الحية
        let liveBox = document.getElementById('live-calc-box');
        if(!liveBox) {
            liveBox = document.createElement('div');
            liveBox.id = 'live-calc-box';
            liveBox.style.cssText = "background:rgba(34,211,160,0.1); border:1px solid var(--accent-green); padding:15px; border-radius:10px; margin-bottom:20px; color:var(--text-primary); transition: all 0.3s ease;";
            const formActions = document.querySelector('.form-actions');
            if(formActions) formActions.insertAdjacentElement('beforebegin', liveBox);
        }
        
        liveBox.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong><i class="fas fa-calculator" style="color:var(--accent); margin-left:8px;"></i> المعاينة المباشرة:</strong>
                <span style="font-size:12px; color:var(--text-muted);">تتحدث تلقائياً</span>
            </div>
            <div style="margin-top:10px; display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px;">
                <span>إجمالي رأس المال: <strong style="color:var(--accent-red);">${Math.round(projectTotal).toLocaleString()} DA</strong></span>
                <span>تكلفة القطعة: <strong style="color:var(--accent-orange);">${Math.round(costPerUnit).toLocaleString()} DA</strong></span>
                <span>سعر البيع المقترح: <strong style="color:var(--accent-green);">${Math.round(costPerUnit * 1.45).toLocaleString()} DA</strong></span>
            </div>
        `;
    } else {
        document.getElementById('live-calc-box')?.remove();
    }
}

// تشغيل مراقب المعاينة المباشرة عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(setupLiveCalculation, 1000); // ننتظر قليلاً لضمان بناء الـ DOM
});


// --- ب. عرض جدول المواد الخام ---
async function loadMaterialsTable() {
    try {
        const { data, error } = await db.from('production_materials').select('*').order('created_at', { ascending: false });
        if(error) throw error;
        
        const container = document.getElementById('materials-list-container');
        if (!container) return;

        if (data && data.length > 0) {
            container.innerHTML = `
            <div class="card table-card" style="margin-top:20px;">
                <div class="table-responsive">
                    <table class="data-table">
                        <thead><tr><th>المادة / القماش</th><th>سعر الوحدة</th><th>المخزون المتاح</th><th>تاريخ الإضافة</th></tr></thead>
                        <tbody>
                            ${data.map(m => `
                            <tr>
                                <td><strong>${escapeHtml(m.name)}</strong></td>
                                <td style="color:var(--accent-green);font-weight:bold;">${m.unit_price.toLocaleString()} DA / ${m.unit}</td>
                                <td><span class="status-badge ${m.stock_quantity > 0 ? 'status-active' : 'status-pending'}">${m.stock_quantity || 0} ${m.unit}</span></td>
                                <td style="color:var(--text-muted);font-size:12px;">${new Date(m.created_at).toLocaleDateString('ar-DZ')}</td>
                            </tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            </div>`;
        } else {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-boxes"></i>
                    <p>لا توجد مواد خام حالياً. قم بإضافة الأقمشة والإكسسوارات لتبدأ.</p>
                </div>`;
        }
    } catch(err) {
        console.error("خطأ في جلب جدول المواد:", err);
    }
}


// --- ج. التقارير المالية والرسوم البيانية ---
let reportsChartInstance2 = null;

function initReports() {
    let totalInvested = 0;
    let expectedRevenue = 0;

    // حساب الأرباح من كل المشاريع
    allProjects.forEach(p => {
        const projectTotal = p.total_material_cost + (p.tailoring_cost_per_unit * p.target_quantity) + p.additional_costs;
        totalInvested += projectTotal;
        
        const costUnit = projectTotal / p.target_quantity;
        const suggestedPrice = Math.round(costUnit * 1.45); // ربح 45%
        expectedRevenue += (suggestedPrice * p.target_quantity);
    });

    const expectedProfit = expectedRevenue - totalInvested;

    // تحديث الواجهة
    const elInvested = document.getElementById('total-invested-report');
    const elProfit = document.getElementById('expected-profit');
    
    if(elInvested) elInvested.textContent = Math.round(totalInvested).toLocaleString() + ' DA';
    if(elProfit) elProfit.textContent = Math.round(expectedProfit).toLocaleString() + ' DA';

    // رسم المخطط البياني للنمو الشهري
    const ctx = document.getElementById('reportsChart');
    if (!ctx) return;
    
    if (reportsChartInstance2) reportsChartInstance2.destroy();
    
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const textColor = isDark ? '#8b9fc9' : '#4a5c84';
    const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

    reportsChartInstance2 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['الشهر 1', 'الشهر 2', 'الشهر 3', 'الشهر الحالي'],
            datasets: [
                { 
                    label: 'رأس المال المستثمر', 
                    data: [50000, 120000, 90000, totalInvested], 
                    backgroundColor: '#4f7bff',
                    borderRadius: 6
                },
                { 
                    label: 'الأرباح المتوقعة', 
                    data: [22000, 54000, 40000, expectedProfit], 
                    backgroundColor: '#22d3a0',
                    borderRadius: 6
                }
            ]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            plugins: { 
                legend: { labels: { color: textColor, font: { family: 'Cairo' } } },
                tooltip: { bodyFont: { family: 'Cairo' }, titleFont: { family: 'Cairo' }, rtl: true }
            }, 
            scales: { 
                y: { grid: { color: gridColor }, ticks: { color: textColor } }, 
                x: { grid: { display: false }, ticks: { color: textColor, font: { family: 'Cairo' } } } 
            } 
        }
    });
}

// ─── تعديل بسيط على الدوال الموجودة لتعمل بشكل مترابط ───

// عند التهيئة (initApp)، نطلب تحميل جدول المواد أيضاً
const originalInitApp = initApp;
initApp = async function(user) {
    await originalInitApp(user);
    await loadMaterialsTable();
};

// عند التبديل بين اللوحات، نقوم بتحديث البيانات
const originalShowPanel = showPanel;
showPanel = function(panelId) {
    originalShowPanel(panelId);
    if(panelId === 'materials') loadMaterialsTable();
    if(panelId === 'reports') setTimeout(initReports, 300); // ننتظر الانتقال ثم نرسم المخطط
};
// ==========================================================================
// 16. الترحيل الآلي للمتجر (Sync with E-commerce)
// ==========================================================================

let currentSyncProjectId = null;

// تعديل دالة رسم جدول المشاريع لتشمل زر "ترحيل للمتجر"
const originalRenderProjectsTable = renderProjectsTable;
renderProjectsTable = function(projects) {
    const list = document.getElementById('projects-list');
    if (!list) return;

    if (!projects.length) {
        list.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:40px;">لا توجد مشاريع</td></tr>`;
        return;
    }

    list.innerHTML = projects.map((p, i) => {
        const tailorTotal   = p.tailoring_cost_per_unit * p.target_quantity;
        const projectTotal  = p.total_material_cost + tailorTotal + p.additional_costs;
        const costPerUnit   = projectTotal / p.target_quantity;
        const suggestedPrice = Math.round(costPerUnit * 1.45);

        // إذا اكتمل المشروع ولم يتم ترحيله، نظهر زر الترحيل
        let actionBtn = `<span class="status-badge status-pending">قيد الإنجاز</span>`;
        
        if(p.status === 'completed' || p.status === 'in_progress') { // يمكن تعديلها لـ completed فقط لاحقاً
             if(p.is_synced) {
                 actionBtn = `<span class="status-badge status-active"><i class="fas fa-check-circle" style="margin-left:4px;"></i>في المتجر</span>`;
             } else {
                 // زر الترحيل السحري
                 actionBtn = `<button class="btn-primary" style="padding:6px 12px; font-size:11px; background:#3b82f6;" 
                                onclick="openSyncModal('${p.id}', '${escapeHtml(p.product_name)}', ${suggestedPrice}, ${p.target_quantity})">
                                <i class="fas fa-store"></i> ترحيل للبيع
                              </button>`;
             }
        }

        return `<tr style="animation: panelIn 0.3s ${i * 50}ms ease both;">
            <td><strong>${escapeHtml(p.product_name)}</strong></td>
            <td>${p.target_quantity}</td>
            <td style="color:var(--accent-red);font-weight:700;">${Math.round(costPerUnit).toLocaleString()} DA</td>
            <td style="color:var(--accent-green);font-weight:700;">${suggestedPrice.toLocaleString()} DA</td>
            <td>${actionBtn}</td>
        </tr>`;
    }).join('');
};


// فتح نافذة الترحيل وجلب أقسام المتجر
async function openSyncModal(projectId, productName, suggestedPrice, stock) {
    currentSyncProjectId = projectId;
    document.getElementById('sync-prod-name').value = productName;
    document.getElementById('sync-prod-price').value = suggestedPrice;
    document.getElementById('sync-prod-stock').value = stock;

    // جلب الأقسام من جدول categories (الخاص بالمتجر admin.html)
    const { data: categories } = await db.from('categories').select('*');
    const catSelect = document.getElementById('sync-prod-cat');
    if (categories && catSelect) {
        catSelect.innerHTML = '<option value="">— اختر القسم —</option>' + 
            categories.map(c => `<option value="${c.id}">${c.name_ar || c.name_fr}</option>`).join('');
    }

    document.getElementById('modal-sync-store').classList.add('open');
}

// تنفيذ الترحيل وإدخال المنتج في قاعدة بيانات المتجر
async function confirmSyncToStore() {
    const name = document.getElementById('sync-prod-name').value.trim();
    const price = parseFloat(document.getElementById('sync-prod-price').value);
    const stock = parseInt(document.getElementById('sync-prod-stock').value);
    const catId = document.getElementById('sync-prod-cat').value;

    if(!name || isNaN(price)) {
        showToast('يرجى التأكد من الاسم والسعر', 'warn', 'fas fa-exclamation-triangle');
        return;
    }

    try {
        // 1. إنشاء المنتج في جدول المنتجات (الخاص بالمتجر)
        const { error: insertErr } = await db.from('products').insert([{
            name: name,
            price: price,
            stock: stock,
            category_id: catId || null,
            is_deleted: false,
            is_featured: false,
            description: "منتج جديد من مصنع إيكوزيوم"
        }]);

        if(insertErr) throw insertErr;

        // 2. تحديث حالة المشروع في الـ ERP إلى (تم الترحيل)
        await db.from('production_projects').update({ is_synced: true }).eq('id', currentSyncProjectId);

        showToast('تم ترحيل المنتج بنجاح! هو الآن متاح في المتجر.', 'success', 'fas fa-check');
        document.getElementById('modal-sync-store').classList.remove('open');
        
        // تحديث الجدول
        loadDashboardData();

    } catch (err) {
        console.error("خطأ الترحيل:", err);
        showToast('حدث خطأ أثناء الترحيل للمتجر', 'error');
    }
}
// ==========================================================================
// 17. نظام المقاسات والألوان (Size & Color Builder)
// ==========================================================================

let projectVariants = [];

function addVariant() {
    const color = document.getElementById('var-color').value.trim();
    const size = document.getElementById('var-size').value;
    const qty = parseInt(document.getElementById('var-qty').value);

    if (!color || isNaN(qty) || qty < 1) {
        showToast('يرجى إدخال اللون والكمية بشكل صحيح', 'warn');
        return;
    }

    // إضافة المقاس للجدول
    projectVariants.push({ color, size, qty });
    renderVariants();

    // تفريغ حقل الكمية فقط (نترك اللون لتسهيل إدخال مقاسات متعددة لنفس اللون)
    document.getElementById('var-qty').value = '';
    document.getElementById('var-size').focus();
}

function removeVariant(index) {
    projectVariants.splice(index, 1);
    renderVariants();
}

function renderVariants() {
    const tbody = document.getElementById('variants-list');
    let totalQty = 0;

    if (projectVariants.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">لم يتم إضافة مقاسات بعد</td></tr>';
    } else {
        tbody.innerHTML = projectVariants.map((v, i) => {
            totalQty += v.qty;
            return `<tr>
                <td><strong>${escapeHtml(v.color)}</strong></td>
                <td><span class="status-badge status-active" style="padding:2px 8px;">${v.size}</span></td>
                <td>${v.qty}</td>
                <td>
                    <button type="button" onclick="removeVariant(${i})" style="background:transparent; border:none; color:var(--accent-red); cursor:pointer;">
                        <i class="fas fa-times-circle"></i>
                    </button>
                </td>
            </tr>`;
        }).join('');
    }

    // تحديث الإجمالي في الشاشة وفي الحقل المخفي
    document.getElementById('total-variants-qty').textContent = totalQty;
    const hiddenQtyInput = document.getElementById('p-qty');
    if (hiddenQtyInput) {
        hiddenQtyInput.value = totalQty;
        // تشغيل حدث (Input) لكي يتحدث المربع الأخضر الخاص بالحساب المباشر فوراً!
        hiddenQtyInput.dispatchEvent(new Event('input'));
    }
}
// ==========================================================================
// 18. إدارة حسابات الموردين والديون (Supplier Debts & Cashflow)
// ==========================================================================

function openSupplierModal() {
    const modal = document.getElementById('modal-add-supplier');
    
    // فحص ذكي: إذا لم يجد النافذة في HTML سيخبرك!
    if (!modal) {
        alert("⚠️ خطأ تقني: المتصفح لا يعثر على كود نافذة 'إضافة مورد' في ملف HTML. تأكد من لصق كود الـ Modal في المكان الصحيح.");
        return;
    }

    // تفريغ الحقول وفتح النافذة
    const nameInput = document.getElementById('sup-name');
    const phoneInput = document.getElementById('sup-phone');
    
    if(nameInput) nameInput.value = '';
    if(phoneInput) phoneInput.value = '';
    
    modal.classList.add('open');
}

async function saveNewSupplier() {
    const name = document.getElementById('sup-name').value.trim();
    const type = document.getElementById('sup-type').value;
    const phone = document.getElementById('sup-phone').value.trim();

    if (!name) return showToast('يرجى إدخال اسم المورد', 'warn');

    const { error } = await db.from('suppliers').insert([{ name, type, phone }]);
    
    if (!error) {
        showToast('تم إضافة المورد بنجاح', 'success');
        document.getElementById('modal-add-supplier').classList.remove('open');
        loadSuppliersData();
    } else {
        showToast('خطأ أثناء الإضافة', 'error');
    }
}

async function loadSuppliersData() {
    try {
        // جلب الموردين
        const { data: suppliers, error: err1 } = await db.from('suppliers').select('*').order('created_at', { ascending: false });
        // جلب كل المعاملات المالية
        const { data: transactions, error: err2 } = await db.from('supplier_transactions').select('*');

        if (err1 || err2) throw err1 || err2;

        const list = document.getElementById('suppliers-list');
        let totalGlobalDebt = 0;
        let totalGlobalPaid = 0;

        if (!suppliers || suppliers.length === 0) {
            list.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--text-muted);">لا يوجد موردون مسجلون بعد.</td></tr>';
            
            document.getElementById('total-all-debts').textContent = '0 DA';
            document.getElementById('total-all-paid').textContent = '0 DA';
            document.getElementById('total-all-balance').textContent = '0 DA';
            return;
        }

        list.innerHTML = suppliers.map(sup => {
            // حساب ديون ودفعات هذا المورد تحديداً
            const supTxs = transactions.filter(t => t.supplier_id === sup.id);
            const totalDebt = supTxs.filter(t => t.transaction_type === 'debt').reduce((sum, t) => sum + t.amount, 0);
            const totalPaid = supTxs.filter(t => t.transaction_type === 'payment').reduce((sum, t) => sum + t.amount, 0);
            const balance = totalDebt - totalPaid; // الباقي في ذمتنا

            // إضافتها للمجموع العام للمصنع
            totalGlobalDebt += totalDebt;
            totalGlobalPaid += totalPaid;

            // تحديد لون الباقي (أحمر إذا كان علينا دين، أخضر إذا كنا خالصين)
            const balanceColor = balance > 0 ? 'var(--accent-red)' : (balance < 0 ? 'var(--accent-green)' : 'var(--text-muted)');
            const balanceText = balance > 0 ? `${balance.toLocaleString()} DA` : (balance < 0 ? `تجاوز دفع: ${Math.abs(balance).toLocaleString()}` : '0 DA');

            return `<tr>
                <td><strong>${escapeHtml(sup.name)}</strong><br><small style="color:var(--text-muted);">${escapeHtml(sup.phone || 'بدون رقم')}</small></td>
                <td><span class="status-badge" style="background:var(--bg-deep); color:var(--text-primary); border:1px solid var(--border);">${sup.type}</span></td>
                <td style="color:var(--text-primary); font-weight:bold;">${totalDebt.toLocaleString()}</td>
                <td style="color:var(--accent-green); font-weight:bold;">${totalPaid.toLocaleString()}</td>
                <td style="color:${balanceColor}; font-weight:bold;">${balanceText}</td>
                <td>
                    <button class="btn-outline" style="padding:5px 10px; font-size:11px;" onclick="openTransactionModal(${sup.id}, '${escapeHtml(sup.name)}')">
                        <i class="fas fa-plus-circle"></i> إضافة عملية
                    </button>
                </td>
            </tr>`;
        }).join('');

        // تحديث الإحصائيات العلوية
        document.getElementById('total-all-debts').textContent = totalGlobalDebt.toLocaleString() + ' DA';
        document.getElementById('total-all-paid').textContent = totalGlobalPaid.toLocaleString() + ' DA';
        document.getElementById('total-all-balance').textContent = Math.max(0, totalGlobalDebt - totalGlobalPaid).toLocaleString() + ' DA';

    } catch (err) {
        console.error("خطأ في جلب بيانات الموردين:", err);
    }
}

// فتح نافذة المعاملات (دين أو دفعة)
function openTransactionModal(supId, supName) {
    document.getElementById('tx-supplier-id').value = supId;
    document.getElementById('tx-supplier-name').textContent = `العملية للمورد: ${supName}`;
    document.getElementById('tx-amount').value = '';
    document.getElementById('tx-note').value = '';
    document.getElementById('modal-transaction').classList.add('open');
}

// حفظ المعاملة المالية
async function saveTransaction() {
    const supId = document.getElementById('tx-supplier-id').value;
    const type = document.getElementById('tx-type').value;
    const amount = parseFloat(document.getElementById('tx-amount').value);
    const note = document.getElementById('tx-note').value.trim();

    if (!amount || amount <= 0) return showToast('يرجى إدخال مبلغ صحيح', 'warn');

    const { error } = await db.from('supplier_transactions').insert([{
        supplier_id: supId,
        transaction_type: type,
        amount: amount,
        note: note
    }]);

    if (!error) {
        showToast(type === 'payment' ? 'تم تسجيل الدفعة بنجاح' : 'تم تسجيل الدين بنجاح', 'success');
        document.getElementById('modal-transaction').classList.remove('open');
        loadSuppliersData(); // تحديث الجدول والأرقام فوراً
    } else {
        showToast('حدث خطأ أثناء تسجيل العملية', 'error');
    }
}

// ─── ربط تحميل الموردين مع التبديل بين اللوحات ───
const originalShowPanelSup = showPanel;
showPanel = function(panelId) {
    originalShowPanelSup(panelId);
    if(panelId === 'suppliers') {
        loadSuppliersData();
    }
};
// ==========================================================================
// 19. إدارة الجودة وإعادة حساب التكاليف (Quality Control)
// ==========================================================================

// فتح نافذة الجودة
function openQualityControlModal(projectId, projectName, targetQty) {
    document.getElementById('qc-project-id').value = projectId;
    document.getElementById('qc-project-name').textContent = `المنتج: ${projectName}`;
    document.getElementById('qc-target-qty').value = targetQty;
    document.getElementById('qc-defective-qty').value = 0;
    document.getElementById('qc-usable-qty').value = targetQty; // افتراضياً كل القطع سليمة
    
    document.getElementById('modal-quality-control').classList.add('open');
}

// حساب آلي للقطع السليمة عند إدخال التوالف
function calculateUsableQty() {
    const target = parseInt(document.getElementById('qc-target-qty').value) || 0;
    const defective = parseInt(document.getElementById('qc-defective-qty').value) || 0;
    
    if(defective > target) {
        showToast('لا يمكن أن تكون التوالف أكبر من الكمية الكلية!', 'warn');
        document.getElementById('qc-defective-qty').value = 0;
        document.getElementById('qc-usable-qty').value = target;
        return;
    }
    
    document.getElementById('qc-usable-qty').value = target - defective;
}

// حفظ فحص الجودة وإنهاء المشروع
async function confirmQualityControl() {
    const projectId = document.getElementById('qc-project-id').value;
    const defective = parseInt(document.getElementById('qc-defective-qty').value) || 0;
    const usable = parseInt(document.getElementById('qc-usable-qty').value) || 0;

    if (usable === 0) {
        return showToast('لا يمكن أن تكون كل القطع تالفة لترحيل المشروع!', 'error');
    }

    try {
        const { error } = await db.from('production_projects').update({
            status: 'completed',
            defective_quantity: defective,
            usable_quantity: usable
        }).eq('id', projectId);

        if (error) throw error;

        showToast('تم إنهاء المشروع وإعادة حساب التكاليف بنجاح', 'success');
        document.getElementById('modal-quality-control').classList.remove('open');
        
        // تحديث لوحة القيادة لترى الأرقام الجديدة
        loadDashboardData();

    } catch (err) {
        console.error("خطأ في فحص الجودة:", err);
        showToast('حدث خطأ أثناء حفظ التعديلات', 'error');
    }
}

// ─── تحديث جذري لدالة لوحة القيادة (Dashboard) لتدعم حسابات الجودة ───
// نقوم بإعادة تعريف الدالة لتعرض الزر الجديد وتحسب التكلفة بناءً على (القطع السليمة)

loadDashboardData = async function() {
    try {
        const { data: projects, error } = await db.from('production_projects').select('*').order('created_at', { ascending: false });
        if (error) throw error;

        allProjects = projects || [];
        
        let totalInvestment = 0;
        let totalItems = 0; // سنحسب القطع السليمة فقط
        let totalMat = 0, totalTailor = 0, totalEx = 0;

        const list = document.getElementById('projects-list');
        list.innerHTML = '';

        if(allProjects.length === 0) {
            list.innerHTML = '<tr><td colspan="5" style="text-align:center;">لا توجد مشاريع إنتاج حالياً.</td></tr>';
        }

        allProjects.forEach(p => {
            const tailorTotal = p.tailoring_cost_per_unit * p.target_quantity;
            const projectTotalCost = p.total_material_cost + tailorTotal + p.additional_costs;
            
            // 💡 السر هنا: إذا اكتمل المشروع نستخدم الكمية السليمة، وإذا كان قيد الإنجاز نستخدم المستهدفة
            const effectiveQuantity = (p.status === 'completed' && p.usable_quantity > 0) ? p.usable_quantity : p.target_quantity;
            
            const costPerUnit = projectTotalCost / effectiveQuantity;
            const suggestedPrice = Math.round(costPerUnit * 1.45);

            totalInvestment += projectTotalCost;
            totalItems += effectiveQuantity;
            totalMat += p.total_material_cost;
            totalTailor += tailorTotal;
            totalEx += p.additional_costs;

            // تحديد شكل زر الإجراء أو الترحيل
            let actionHtml = '';
            if (p.status === 'in_progress') {
                actionHtml = `<button class="btn-outline" style="padding:6px 12px; font-size:11px; border-color:var(--accent-orange); color:var(--accent-orange);" 
                              onclick="openQualityControlModal('${p.id}', '${escapeHtml(p.product_name)}', ${p.target_quantity})">
                              <i class="fas fa-check-double"></i> فحص وإنهاء
                              </button>`;
            } else if (p.status === 'completed') {
                if (p.is_synced) {
                    actionHtml = `<span class="status-badge status-active"><i class="fas fa-store"></i> في المتجر</span>`;
                } else {
                    // زر الترحيل (الذي صنعناه سابقاً) يظهر فقط بعد فحص الجودة!
                    actionHtml = `<button class="btn-primary" style="padding:6px 12px; font-size:11px;" 
                                  onclick="openSyncModal('${p.id}', '${escapeHtml(p.product_name)}', ${suggestedPrice}, ${effectiveQuantity})">
                                  <i class="fas fa-paper-plane"></i> ترحيل للبيع
                                  </button>`;
                }
                actionHtml += `<button class="btn-outline" style="padding:6px 10px; font-size:11px; margin-right:6px;" 
                              onclick="openBarcodeModal('${p.id}')" title="طباعة الباركود">
                              <i class="fas fa-barcode"></i>
                              </button>`;
            }

            // عرض حالة القطع التالفة تحت اسم المنتج إن وجدت
            const defectsInfo = (p.status === 'completed' && p.defective_quantity > 0) 
                ? `<br><small style="color:var(--accent-red); font-size:10px;">${p.defective_quantity} قطع تالفة (مُعوّضة)</small>` 
                : '';

            list.innerHTML += `
                <tr>
                    <td><strong>${escapeHtml(p.product_name)}</strong>${defectsInfo}</td>
                    <td>${effectiveQuantity} <small style="color:var(--text-muted);">${p.status === 'completed' ? '(سليمة)' : ''}</small></td>
                    <td style="color: #ef4444; font-weight: bold;">${Math.round(costPerUnit).toLocaleString()} DA</td>
                    <td style="color: #10b981; font-weight: bold;">${suggestedPrice.toLocaleString()} DA</td>
                    <td>${actionHtml}</td>
                </tr>
            `;
        });

        document.getElementById('total-investment').textContent = Math.round(totalInvestment).toLocaleString() + ' DA';
        document.getElementById('active-projects').textContent = allProjects.filter(p => p.status === 'in_progress').length;
        
        const globalAvg = totalItems > 0 ? (totalInvestment / totalItems) : 0;
        document.getElementById('avg-cost').textContent = Math.round(globalAvg).toLocaleString() + ' DA';

        if(typeof updateCostChart === 'function') {
            updateCostChart(totalMat, totalTailor, totalEx);
        }

    } catch (err) {
        console.error("خطأ في جلب بيانات لوحة القيادة:", err);
    }
};
// ==========================================================================
// 20. نظام الإشعارات الذكية (أيقونة الجرس) Smart Alerts
// ==========================================================================

function toggleNotifications() {
    document.getElementById('notif-dropdown').classList.toggle('show');
}

function closeNotifications() {
    document.getElementById('notif-dropdown').classList.remove('show');
}

// إغلاق القائمة عند النقر في أي مكان خارجها
document.addEventListener('click', function(event) {
    const wrapper = document.querySelector('.notif-wrapper');
    if (wrapper && !wrapper.contains(event.target)) {
        closeNotifications();
    }
});

// دالة لتوليد التنبيهات (مثل نقص القماش من المخزن)
async function checkSmartAlerts() {
    try {
        const list = document.getElementById('notif-list');
        const badge = document.getElementById('notif-badge');
        if (!list || !badge) return;

        let alerts = [];

        // 1. مراقبة نواقص المخزون: جلب الأقمشة التي كميتها أقل من أو تساوي 20
        const { data: lowStockMaterials, error } = await db.from('production_materials')
                                                         .select('*')
                                                         .lte('stock_quantity', 20);

        if (lowStockMaterials && lowStockMaterials.length > 0) {
            lowStockMaterials.forEach(m => {
                alerts.push(`
                    <div class="notif-item">
                        <div class="icon" style="background:rgba(239,68,68,0.1); color:var(--accent-red);"><i class="fas fa-exclamation-triangle"></i></div>
                        <div class="content">
                            <p>نقص في المخزون: ${escapeHtml(m.name)}</p>
                            <span>الكمية المتبقية: <strong style="color:var(--accent-red);">${m.stock_quantity} ${m.unit}</strong> فقط!</span>
                        </div>
                    </div>
                `);
            });
        }

        // تحديث الواجهة وتغيير الرقم فوق الجرس
        if (alerts.length > 0) {
            list.innerHTML = alerts.join('');
            badge.textContent = alerts.length;
            badge.style.display = 'flex'; // إظهار الدائرة الحمراء بالأرقام
            
            // تحديث بطاقة الـ KPI في لوحة القيادة إن وجدت
            const lowStockKpi = document.getElementById('low-stock');
            if (lowStockKpi) lowStockKpi.textContent = `${alerts.length} مواد`;
            
        } else {
            list.innerHTML = `
                <div class="notif-empty">
                    <i class="fas fa-check-circle" style="font-size:30px; color:var(--accent-green); margin-bottom:15px; display:block;"></i>
                    كل شيء ممتاز!<br>لا توجد نواقص في المخزن حالياً.
                </div>`;
            badge.style.display = 'none'; // إخفاء الدائرة الحمراء
            
            const lowStockKpi = document.getElementById('low-stock');
            if (lowStockKpi) lowStockKpi.textContent = `0 مواد`;
        }

    } catch (err) {
        console.error("خطأ في جلب إشعارات الجرس:", err);
    }
}

// ─── ربط المراقبة الذكية لتعمل عند تحميل النظام ───
const originalInitAppAlerts = initApp;
initApp = async function(user) {
    await originalInitAppAlerts(user);
    await checkSmartAlerts(); // فحص المخزون والديون فور الدخول
};
// ==========================================================================
// 21. نظام توليد وطباعة الباركود (Barcode Generator)
// ==========================================================================

function openBarcodeModal(projectId) {
    const project = allProjects.find(p => p.id == projectId);
    if (!project) return;

    const previewContainer = document.getElementById('barcode-preview');
    const printArea = document.getElementById('print-area');
    previewContainer.innerHTML = '';
    printArea.innerHTML = '';

    let labelsHtml = '';
    
    // إذا كان المشروع يحتوي على مقاسات وألوان مفصلة
    if (project.variants && project.variants.length > 0) {
        project.variants.forEach((v) => {
            for (let i = 0; i < v.qty; i++) {
                // صناعة كود فريد: ID المشروع + المقاس + أول حرفين من اللون
                const colorCode = v.color.substring(0,2).toUpperCase();
                const barcodeValue = `IC-${project.id}-${v.size}-${colorCode}`;
                labelsHtml += createLabelHTML(project.product_name, v.size, v.color, barcodeValue);
            }
        });
    } else {
        // إذا كان مشروعاً قديماً بدون تفاصيل مقاسات
        const qty = (project.status === 'completed' && project.usable_quantity > 0) ? project.usable_quantity : project.target_quantity;
        for (let i = 0; i < qty; i++) {
            const barcodeValue = `IC-${project.id}-GEN`;
            labelsHtml += createLabelHTML(project.product_name, 'STD', 'N/A', barcodeValue);
        }
    }

    previewContainer.innerHTML = labelsHtml;
    printArea.innerHTML = labelsHtml;

    // تفعيل مكتبة JsBarcode لتحويل الأكواد إلى خطوط باركود حقيقية
    JsBarcode(".barcode").init();

    document.getElementById('modal-barcode').classList.add('open');
}

// تصميم الملصق الواحد
function createLabelHTML(name, size, color, barcodeVal) {
    return `
        <div class="label-box">
            <div class="label-brand">ICOSIUM</div>
            <div class="label-details">${escapeHtml(name)} | ${size} | ${escapeHtml(color)}</div>
            <svg class="barcode"
                jsbarcode-format="CODE128"
                jsbarcode-value="${barcodeVal}"
                jsbarcode-textmargin="0"
                jsbarcode-height="25"
                jsbarcode-width="1.2"
                jsbarcode-displayvalue="true"
                jsbarcode-fontsize="10">
            </svg>
        </div>
    `;
}

function printBarcodes() {
    window.print();
}
// ==========================================================================
// 22. نظام التوصيل والسكانير للمرتجعات (Delivery & Returns)
// ==========================================================================
// ==========================================================================
// 22. نظام التوصيل المربوط آلياً مع المتجر الإلكتروني (Auto-Sync)
// ==========================================================================

// ─── 1. جلب الطلبيات آلياً من متجر ICOSIUM ───
async function loadDeliveriesData() {
    try {
        // نطلب من قاعدة البيانات جلب الطلبيات من جدول المتجر (orders)
        // شرط: أن تكون الحالة إما 'في الطريق'، 'مستلمة'، أو 'مرتجعة'
        const { data, error } = await db.from('orders')
            .select('*')
            .in('status', ['en_route', 'En cours de livrée', 'livraison', 'delivered', 'returned']) // ضع هنا الحالات التي تستخدمها في متجرك
            .order('created_at', { ascending: false });

        if (error) throw error;

        const list = document.getElementById('deliveries-list');
        if (!data || data.length === 0) {
            list.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">لا توجد طرود مشحونة حالياً من المتجر.</td></tr>';
            return;
        }

        list.innerHTML = data.map(order => {
            let statusBadge = '';
            let actionBtn = '';
            
            // تحديد الحالة بناءً على ما يكتبه الأدمن في المتجر
            if (order.status === 'en_route' || order.status === 'En cours de livrée' || order.status === 'livraison') {
                statusBadge = '<span class="status-badge status-pending"><i class="fas fa-truck"></i> في الطريق</span>';
                actionBtn = `<button class="btn-outline" style="padding:5px 10px; font-size:11px; border-color:var(--accent-green); color:var(--accent-green);" onclick="markOrderDelivered(${order.id})"><i class="fas fa-check"></i> تم الاستلام</button>`;
            } else if (order.status === 'delivered') {
                statusBadge = '<span class="status-badge status-active"><i class="fas fa-check-double"></i> مستلم (تم الدفع)</span>';
            } else if (order.status === 'returned') {
                statusBadge = '<span class="status-badge" style="background:rgba(239,68,68,0.1); color:var(--accent-red);"><i class="fas fa-undo"></i> مرتجع (روتور)</span>';
            }

            // الاعتماد على أعمدة المتجر (تأكد أن أسماء الأعمدة تطابق جدول orders لديك)
            const customerName = order.full_name || order.customer_name || 'زبون المتجر';
            const wilaya = order.wilaya || order.address || 'غير محدد';
            const totalPrice = order.total_price || order.total_amount || 0;
            const orderIdCode = `CMD-${order.id}`; // كود الطلبية الذي سنستعمله في السكانير

            return `<tr>
                <td><strong>${escapeHtml(customerName)}</strong><br><small style="color:var(--text-muted);">${escapeHtml(wilaya)}</small></td>
                <td style="font-family:monospace; color:var(--accent-light); font-weight:bold;">${orderIdCode}</td>
                <td style="font-weight:bold;">${totalPrice.toLocaleString()} DA</td>
                <td>${statusBadge}</td>
                <td>${actionBtn}</td>
            </tr>`;
        }).join('');
    } catch (err) {
        console.error("خطأ في جلب بيانات التوصيل من المتجر:", err);
    }
}

// ─── 2. سكانير الروتور (يقرأ كود الطلبية بدلاً من القطعة) ───
async function handleBarcodeScan(event) {
    if (event.key === 'Enter') {
        const barcodeInput = document.getElementById('barcode-scanner-input');
        let barcode = barcodeInput.value.trim().toUpperCase(); // مثال: سكان لورقة ياليدين أو كود CMD-15
        barcodeInput.value = ''; 
        
        if (!barcode) return;

        showToast(`جاري البحث عن الطلبية: ${barcode}...`, 'info', 'fas fa-spinner fa-spin');

        // استخراج رقم الطلبية إذا كان الباركود يبدأ بـ CMD-
        let orderIdToFind = barcode;
        if(barcode.startsWith('CMD-')) {
            orderIdToFind = barcode.replace('CMD-', '');
        }

        try {
            // البحث عن الطلبية في جدول المتجر
            const { data: order, error: orderErr } = await db.from('orders')
                .select('*')
                .eq('id', orderIdToFind)
                .single();

            if (orderErr || !order) {
                showToast('لم يتم العثور على طلبية بهذا الكود في المتجر!', 'error', 'fas fa-exclamation-circle');
                return;
            }

            if (order.status === 'returned') {
                return showToast('هذه الطلبية مسجلة كمرتجع مسبقاً!', 'warn');
            }

            // تحديث حالة الطلبية في المتجر إلى "مرتجع"
            const { error: updateErr } = await db.from('orders').update({ status: 'returned' }).eq('id', order.id);
            if (updateErr) throw updateErr;

            showToast(`تم تسجيل الروتور للطلبية CMD-${order.id} آلياً في المتجر والـ ERP!`, 'success', 'fas fa-undo-alt');
            
            // تحديث الجدول
            loadDeliveriesData();

        } catch (err) {
            console.error("خطأ في معالجة الباركود:", err);
            showToast('حدث خطأ أثناء معالجة المرتجع', 'error');
        }
    }
}

// ─── 3. تأكيد الاستلام ───
async function markOrderDelivered(orderId) {
    // تحديث الحالة في جدول المتجر الأصلي
    const { error } = await db.from('orders').update({ status: 'delivered' }).eq('id', orderId);
    if (!error) {
        showToast('تم تسليم الطرد! الأرباح محصلة وتحدثت في المتجر.', 'success');
        loadDeliveriesData();
    }
}


// ─── ربط التبويب ───
const originalShowPanelDelivery = showPanel;
showPanel = function(panelId) {
    originalShowPanelDelivery(panelId);
    if(panelId === 'delivery') {
        loadDeliveriesData();
        // التركيز آلياً على حقل السكانير ليكون جاهزاً
        setTimeout(() => document.getElementById('barcode-scanner-input')?.focus(), 100);
    }
};
// ─── فتح نافذة شحن طلبية ───
function openNewOrderModal() {
    const modal = document.getElementById('modal-new-order');
    if (!modal) return alert("كود النافذة غير موجود في HTML!");
    
    // تفريغ الحقول القديمة
    document.getElementById('order-customer').value = '';
    document.getElementById('order-tracking').value = '';
    document.getElementById('order-barcode').value = '';
    document.getElementById('order-price').value = '';
    
    modal.classList.add('open');
    // وضع التركيز تلقائياً على حقل اسم الزبون
    setTimeout(() => document.getElementById('order-customer').focus(), 100);
}

// ─── حفظ الطلبية الجديدة (وخصمها من الستوك آلياً) ───
async function saveNewOrder() {
    const customer = document.getElementById('order-customer').value.trim();
    const wilaya = document.getElementById('order-wilaya').value;
    const barcode = document.getElementById('order-barcode').value.trim();
    const price = parseFloat(document.getElementById('order-price').value);
    const deliveryFee = parseFloat(document.getElementById('order-delivery-fee').value) || 0;
    const tracking = document.getElementById('order-tracking').value.trim();

    if (!customer || !barcode || isNaN(price)) {
        return showToast('يرجى إدخال اسم الزبون، الباركود، والسعر!', 'warn');
    }

    try {
        // 1. خصم القطعة من المخزون (بناءً على الباركود)
        const parts = barcode.split('-');
        if (parts.length >= 3) {
            const projectId = parts[1];
            const size = parts[2];
            
            // جلب المشروع من القاعدة
            const { data: project } = await db.from('production_projects').select('variants').eq('id', projectId).single();
            
            if (project && project.variants) {
                let updatedVariants = project.variants;
                let foundAndDeducted = false;
                
                updatedVariants.forEach(v => {
                    if (v.size === size && v.qty > 0) {
                        v.qty -= 1; // خصم حبة واحدة لأننا شحناها!
                        foundAndDeducted = true;
                    }
                });
                
                if (!foundAndDeducted) {
                    return showToast(`عذراً، هذا المقاس (${size}) غير متوفر في الستوك أو نفدت كميته!`, 'error');
                }
                
                // تحديث الستوك في قاعدة البيانات
                await db.from('production_projects').update({ variants: updatedVariants }).eq('id', projectId);
            }
        }

        // 2. تسجيل الطلبية في جدول التوصيل
        const { error } = await db.from('delivery_orders').insert([{
            customer_name: customer,
            wilaya: wilaya,
            product_barcode: barcode,
            total_price: price,
            delivery_fee: deliveryFee,
            tracking_code: tracking,
            status: 'en_route' // في الطريق
        }]);

        if (error) throw error;

        showToast('تم شحن الطلبية وخصم القطعة من المخزون بنجاح!', 'success', 'fas fa-truck-fast');
        document.getElementById('modal-new-order').classList.remove('open');
        
        // تحديث جدول الطلبيات
        loadDeliveriesData();

    } catch (err) {
        console.error("خطأ في تسجيل الطلبية:", err);
        showToast('حدث خطأ أثناء حفظ الطلبية', 'error');
    }
}
// فتح نافذة إضافة وصفة
function openRecipeModal() {
    const modal = document.getElementById('modal-recipe');
    // ملء قائمة المواد الخام المتاحة
    const matSelect = document.getElementById('recipe-material-id');
    const allMaterials = document.querySelectorAll('#p-material option');
    matSelect.innerHTML = Array.from(allMaterials).map(opt => opt.outerHTML).join('');
    
    modal.classList.add('open');
}

// إغلاق النافذة
function closeRecipeModal() {
    document.getElementById('modal-recipe').classList.remove('open');
}

// حفظ الموديل الجديد في قاعدة البيانات
async function saveRecipe() {
    const name = document.getElementById('recipe-name').value.trim();
    const matId = document.getElementById('recipe-material-id').value;
    const fabric = parseFloat(document.getElementById('recipe-fabric').value);
    const tailor = parseFloat(document.getElementById('recipe-tailor').value);
    const acc = parseFloat(document.getElementById('recipe-acc').value) || 0;

    if (!name || !matId || isNaN(fabric) || isNaN(tailor)) {
        return showToast('يرجى ملء جميع الحقول الأساسية!', 'warn');
    }

    try {
        const { error } = await db.from('production_recipes').insert([{
            model_name: name,
            material_id: matId,
            fabric_consumption: fabric,
            tailoring_cost: tailor,
            accessories_cost: acc
        }]);

        if (error) throw error;

        showToast('تمت إضافة الموديل للكتالوج بنجاح!', 'success');
        closeRecipeModal();
        loadRecipes(); // تحديث القائمة
    } catch (err) {
        console.error("خطأ أثناء الحفظ:", err);
        showToast('حدث خطأ أثناء حفظ الموديل', 'error');
    }
}

// دالة حذف موديل من الكتالوج
async function deleteRecipe(id) {
    confirmAction("هل أنت متأكد من حذف هذا الموديل من الكتالوج؟", async () => {
        const { error } = await db.from('production_recipes').delete().eq('id', id);
        if (!error) {
            showToast('تم حذف الموديل', 'info');
            loadRecipes();
        }
    });
}
// ==========================================================================
// 24. نظام التقارير المالية المتقدم (Finance & Net Profit)
// ==========================================================================

let financeChart = null;

async function loadFinanceData() {
    try {
        // 1. جلب المبيعات المستلمة فقط (المال الحقيقي)
        const { data: deliveredOrders } = await db.from('orders').select('total_price').eq('status', 'delivered');
        const totalSales = deliveredOrders?.reduce((sum, o) => sum + (o.total_price || 0), 0) || 0;

        // 2. جلب تكاليف الإنتاج (كل ما تم صرفه على المشاريع)
        const { data: projects } = await db.from('production_projects').select('total_material_cost, tailoring_cost_per_unit, target_quantity, additional_costs');
        const totalProductionCost = projects?.reduce((sum, p) => {
            return sum + (p.total_material_cost + (p.tailoring_cost_per_unit * p.target_quantity) + p.additional_costs);
        }, 0) || 0;

        // 3. حساب خسائر المرتجعات (سعر الشحن المهدور)
        const { data: returnedOrders } = await db.from('orders').select('delivery_fee').eq('status', 'returned');
        const totalReturnLoss = returnedOrders?.reduce((sum, o) => sum + (o.delivery_fee || 600), 0) || 0;

        // 4. جلب ديون الموردين المتبقية
        const { data: txs } = await db.from('supplier_transactions').select('*');
        const totalDebtRaw = txs?.filter(t => t.transaction_type === 'debt').reduce((sum, t) => sum + t.amount, 0) || 0;
        const totalPaidRaw = txs?.filter(t => t.transaction_type === 'payment').reduce((sum, t) => sum + t.amount, 0) || 0;
        const currentDebts = totalDebtRaw - totalPaidRaw;

        // الحساب النهائي للربح الصافي
        const netProfit = totalSales - totalProductionCost - totalReturnLoss;

        // تحديث واجهة المستخدم
        document.getElementById('fin-total-sales').textContent = totalSales.toLocaleString() + ' DA';
        document.getElementById('fin-total-costs').textContent = totalProductionCost.toLocaleString() + ' DA';
        document.getElementById('fin-total-returned-loss').textContent = totalReturnLoss.toLocaleString() + ' DA';
        
        const profitEl = document.getElementById('fin-net-profit');
        profitEl.textContent = netProfit.toLocaleString() + ' DA';
        profitEl.style.color = netProfit >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';

        // ملخص الديون
        document.getElementById('fin-debt-summary').innerHTML = `
            <div style="text-align:center; padding:20px;">
                <p style="color:var(--text-muted);">ديون الموردين التي يجب سدادها:</p>
                <h2 style="color:var(--accent-orange); font-size:32px;">${currentDebts.toLocaleString()} DA</h2>
                <button class="btn-text" onclick="showPanel('suppliers')">انتقل لتسديد الديون →</button>
            </div>
        `;

        // تحديث الرسم البياني
        updateFinanceChart(totalProductionCost, totalReturnLoss, netProfit > 0 ? netProfit : 0);

    } catch (err) {
        console.error("خطأ في التقارير المالية:", err);
    }
}

function updateFinanceChart(costs, loss, profit) {
    const ctx = document.getElementById('financeChart').getContext('2d');
    
    if (financeChart) financeChart.destroy();

    financeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['تكاليف الإنتاج', 'خسائر المرتجعات', 'صافي الأرباح'],
            datasets: [{
                data: [costs, loss, profit],
                backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#8b949e', font: { family: 'Cairo' } } }
            }
        }
    });
}

// ربط الميزة بالتبديل
const originalShowPanelFinance = showPanel;
showPanel = function(panelId) {
    originalShowPanelFinance(panelId);
    if(panelId === 'finance') loadFinanceData();
};
// ==========================================================================
// 25. نظام التنبؤ بالإنتاج (Production Forecaster)
// ==========================================================================

let sizeChart = null;

async function runProductionForecaster() {
    try {
        // 1. جلب بيانات المنتجات من المشاريع المكتملة (المخزون الحالي)
        const { data: projects } = await db.from('production_projects').select('product_name, variants').eq('status', 'completed');
        
        // 2. جلب الطلبيات الناجحة (المبيعات)
        const { data: sales } = await db.from('orders').select('product_barcode').eq('status', 'delivered');

        if (!projects || projects.length === 0) {
            document.getElementById('ai-recommendation').innerHTML = "لا توجد بيانات كافية للتحليل بعد. أطلق بعض المشاريع أولاً!";
            return;
        }

        let sizeSales = { 'S': 0, 'M': 0, 'L': 0, 'XL': 0, 'XXL': 0 };
        let tableHtml = '';
        let urgentProduction = [];

        projects.forEach(p => {
            if (p.variants) {
                p.variants.forEach(v => {
                    // حساب كم مرة ظهر هذا الباركود في المبيعات
                    // الباركود المتوقع: IC-ID-SIZE-..
                    const barcodePattern = `IC-${p.product_name}-${v.size}`; 
                    const soldCount = sales?.filter(s => s.product_barcode && s.product_barcode.includes(`-${v.size}-`)).length || 0;
                    
                    sizeSales[v.size] += soldCount;

                    // تحديد الحالة (إذا كان الستوك أقل من 5 والطلب عالٍ)
                    let status = '<span class="status-badge status-active">مستقر</span>';
                    if (v.qty <= 5 && soldCount > 0) {
                        status = '<span class="status-badge" style="background:rgba(239,68,68,0.1); color:var(--accent-red);">يجب الإنتاج فوراً</span>';
                        urgentProduction.push(`${p.product_name} (${v.size})`);
                    }

                    tableHtml += `
                        <tr>
                            <td>${p.product_name}</td>
                            <td><strong>${v.size}</strong></td>
                            <td>${soldCount} قطعة</td>
                            <td>${v.qty} قطعة</td>
                            <td>${status}</td>
                        </tr>
                    `;
                });
            }
        });

        document.getElementById('forecast-table-body').innerHTML = tableHtml;

        // تحديث التوصية الذكية
        const recBox = document.getElementById('ai-recommendation');
        if (urgentProduction.length > 0) {
            recBox.innerHTML = `<span style="color:var(--accent-red)">🚨 تنبيه:</span> ركز على إنتاج <br> <strong>${urgentProduction[0]}</strong> <br> الطلب عليه مرتفع والمخزون ينفد!`;
        } else {
            recBox.innerHTML = "استمر في الإنتاج المتوازن. وتيرة المبيعات متوافقة مع المخزون حالياً.";
        }

        updateSizeChart(sizeSales);

    } catch (err) {
        console.error("خطأ في نظام التنبؤ:", err);
    }
}

function updateSizeChart(dataMap) {
    const ctx = document.getElementById('sizeDemandChart').getContext('2d');
    if (sizeChart) sizeChart.destroy();

    sizeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(dataMap),
            datasets: [{
                label: 'عدد القطع المباعة',
                data: Object.values(dataMap),
                backgroundColor: 'rgba(79, 123, 255, 0.6)',
                borderColor: '#4f7bff',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } },
                x: { grid: { display: false } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

// ربط الميزة بالتبديل
const originalShowPanelForecaster = showPanel;
showPanel = function(panelId) {
    originalShowPanelForecaster(panelId);
    if(panelId === 'forecaster') runProductionForecaster();
};