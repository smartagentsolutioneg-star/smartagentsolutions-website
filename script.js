const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'فتح القائمة');
  nav.classList.remove('open');
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
  nav.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu(); menu.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.navigation')) closeMenu();
});
document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => {
  document.querySelector('#service').value = link.dataset.service;
}));
const pageService = {
  'accounting.html': 'الخدمات المحاسبية', 'erp.html': 'أنظمة ERP المتكاملة',
  'odoo.html': 'حلول Odoo', 'sap.html': 'حلول SAP'
}[window.location.pathname.split('/').pop()];
if (pageService) document.querySelector('#service').value = pageService;
document.querySelector('#year').textContent = new Date().getFullYear();
const industries = {
  trade: ['من طلب العميل إلى تحصيل المستحقات.', 'ربط المبيعات والمشتريات والمخزون والحسابات لمتابعة حركة الأصناف والأرصدة عبر دورة تجارية واضحة.', ['متابعة المخزون والمستودعات', 'حسابات العملاء والموردين', 'تقارير المبيعات والربحية']],
  industry: ['رؤية تربط المواد والإنتاج والتكلفة.', 'مناقشة احتياجات تدفق المواد وأوامر الإنتاج وربطها بالمخزون والتكاليف، مع تحديد الوحدات اللازمة وفق طبيعة المصنع.', ['المواد الخام والمنتج النهائي', 'دورة أوامر الإنتاج', 'متابعة التكاليف والهدر']],
  services: ['كل مشروع، من التعاقد إلى التحصيل.', 'تنظيم بيانات المشروعات والمصروفات والفوترة لمتابعة الالتزامات وإظهار الصورة المالية لكل مشروع وفق نطاق التطبيق.', ['المشروعات والمصروفات', 'الفوترة والتحصيل', 'تقارير تكلفة المشروع']],
  retail: ['فروع متعددة، وصورة موحّدة.', 'مناقشة احتياجات ربط الفروع والمخزون والمبيعات والحسابات لتسهيل متابعة الحركة والأداء وتحديد متطلبات التكامل.', ['المبيعات والفروع', 'التحويلات بين المستودعات', 'متابعة أداء الفروع']]
};
const tabs = [...document.querySelectorAll('[data-industry]')];
function activateIndustry(tab) {
  tabs.forEach(item => {
    item.setAttribute('aria-selected', String(item === tab));
    item.tabIndex = item === tab ? 0 : -1;
  });
  const [title, description, items] = industries[tab.dataset.industry];
  document.querySelector('#industry-title').textContent = title;
  document.querySelector('#industry-desc').textContent = description;
  document.querySelector('#industry-panel').setAttribute('aria-labelledby', tab.id);
  document.querySelector('#industry-list').replaceChildren(...items.map(text => {
    const li = document.createElement('li'); li.textContent = text; return li;
  }));
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateIndustry(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowUp' || event.key === 'ArrowRight') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); activateIndustry(tabs[next]); tabs[next].focus(); }
  });
});
document.querySelector('#contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const subject = `استفسار عن ${data.get('service')} — ${data.get('company') || data.get('name')}`;
  const body = `مرحبًا SmartAgaentsoluations،\n\nالاسم: ${data.get('name')}\nالشركة: ${data.get('company') || 'لم تذكر'}\nالبريد الإلكتروني: ${data.get('email')}\nالخدمة: ${data.get('service')}\n\n${data.get('message')}\n\nشكرًا لكم.`;
  const status = document.querySelector('#form-status');
  const whatsapp = event.submitter?.value !== 'email';
  if (whatsapp) {
    window.open(`https://wa.me/966565284539?text=${encodeURIComponent(body)}`, '_blank', 'noopener,noreferrer');
  } else {
    window.location.href = `mailto:smartagentsolutioneg@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  status.hidden = false;
  status.textContent = whatsapp
    ? 'تم تجهيز رسالتك لفتحها في واتساب. راجعها ثم اضغط إرسال. إذا لم تفتح النافذة، استخدم رابط واتساب المباشر الموضح بجانب النموذج.'
    : 'تم تجهيز رسالتك لفتحها في تطبيق البريد. راجعها ثم أرسلها. إذا لم يفتح التطبيق، استخدم عنوان البريد الموضح بجانب النموذج.';
});
