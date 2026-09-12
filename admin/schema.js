// Dashboard schema: maps every editable text key to a plain-language label,
// grouped by site section so a non-technical editor knows exactly what they change.
// Field = [key, label] ; long text is detected automatically from the key suffix.
(function () {
  const SERVICES = [
    ['sea', 'شحن بحري من مصر إلى الضفة'], ['land', 'شحن بري من مصر إلى الضفة'], ['gaza', 'شحن من مصر إلى غزة'],
    ['wbgaza', 'شحن من الضفة إلى غزة'], ['customs', 'التخليص الجمركي'], ['storage', 'التخزين'],
    ['factories', 'توفير مصانع وموردين في مصر'], ['internal', 'النقل الداخلي'], ['packing', 'التجميع والتغليف'],
    ['tracking', 'متابعة الشحنة والتأمين'],
  ];
  const ROUTES = [[1, 'مصر ← الضفة الغربية'], [2, 'مصر ← غزة'], [3, 'الضفة الغربية ← غزة'], [4, 'نقل داخلي في فلسطين']];
  const AR_NUM = ['', 'الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة', 'السادسة'];

  const serviceGroups = SERVICES.map(([k, name]) => ({
    title: 'خدمة: ' + name,
    fields: [
      [`svc.${k}.title`, 'اسم الخدمة'],
      [`svc.${k}.desc`, 'وصف الخدمة'],
      [`svc.${k}.p1`, 'الميزة الأولى'], [`svc.${k}.p2`, 'الميزة الثانية'], [`svc.${k}.p3`, 'الميزة الثالثة'],
    ],
  }));

  window.ADMIN_SCHEMA = {
    settings: {
      id: 'settings', icon: '📞', title: 'بيانات التواصل', link: '/contact',
      desc: 'أرقام واتساب والهاتف ورابط فيسبوك. تتحدث كل الأزرار والروابط في الموقع تلقائيًا.',
      fields: [
        { key: 'wa_eg', label: 'رقم واتساب فرع مصر', hint: 'اكتبه كما تريد أن يظهر للزائر، مثل: +20 10 8064 4096', def: '+20 10 8064 4096' },
        { key: 'wa_ps', label: 'رقم واتساب فرع الضفة', hint: 'مثل: +970 59 582 5254', def: '+970 59 582 5254' },
        { key: 'phone_eg', label: 'رقم هاتف فرع مصر', hint: 'يظهر في صفحة التواصل ويُستخدم لزر الاتصال', def: '+20 10 8064 4096' },
        { key: 'facebook', label: 'رابط صفحة فيسبوك', hint: 'انسخ الرابط كاملًا من المتصفح', def: 'https://www.facebook.com/profile.php?id=61567014985312' },
      ],
    },
    sections: [
      {
        id: 'slider', icon: '🖼️', title: 'السلايدر الرئيسي', link: '/',
        desc: 'الصور المتحركة أعلى الصفحة الرئيسية. كل شريحة لها شارة صغيرة وعنوان ونص وزر.',
        groups: [1, 2, 3, 4].map(n => ({
          title: `الشريحة ${AR_NUM[n]}`,
          fields: [[`slide${n}.tag`, 'الشارة الصغيرة فوق العنوان'], [`slide${n}.title`, 'العنوان الكبير'], [`slide${n}.text`, 'النص التوضيحي'], [`slide${n}.cta`, 'نص الزر']],
        })),
      },
      {
        id: 'intro', icon: '🏢', title: 'مقدمة الشركة', link: '/',
        desc: 'الفقرة التعريفية التي تظهر مباشرة تحت السلايدر.',
        groups: [{ title: 'المقدمة', fields: [['intro.tag', 'السطر الصغير فوق العنوان'], ['intro.title', 'عنوان المقدمة'], ['intro.text', 'نص المقدمة']] }],
      },
      {
        id: 'routes', icon: '🗺️', title: 'خطوط الشحن', link: '/#routes',
        desc: 'بطاقات المسارات الأربعة في الصفحة الرئيسية.',
        groups: [
          { title: 'عنوان القسم', fields: [['routes.title', 'عنوان القسم'], ['routes.lead', 'الوصف تحت العنوان'], ['route.hint', 'الجملة الصغيرة أسفل البطاقات']] },
          ...ROUTES.map(([n, name]) => ({
            title: 'المسار: ' + name,
            fields: [
              [`route.${n}.from`, 'نقطة الانطلاق (على الخط)'], [`route.${n}.to`, 'نقطة الوصول (على الخط)'],
              [`route.${n}.title`, 'عنوان البطاقة'], [`route.${n}.text`, 'وصف المسار'],
              [`route.${n}.c1`, 'الميزة الأولى (شريحة صغيرة)'], [`route.${n}.c2`, 'الميزة الثانية'], [`route.${n}.c3`, 'الميزة الثالثة'],
            ],
          })),
        ],
      },
      {
        id: 'services', icon: '🚢', title: 'الخدمات', link: '/#services',
        desc: 'قسم الخدمات في الصفحة الرئيسية وصفحة الخدمات. النصوص مشتركة بين الصفحتين.',
        groups: [
          { title: 'عنوان القسم', fields: [['services.title', 'عنوان القسم'], ['services.lead', 'الوصف تحت العنوان'], ['svc.hint', 'الجملة الصغيرة أسفل القسم'], ['svc.cta', 'نص زر واتساب داخل كل خدمة'], ['services.all', 'نص زر «كل الخدمات»']] },
          ...serviceGroups,
        ],
      },
      {
        id: 'goods', icon: '📦', title: 'ماذا نشحن', link: '/',
        desc: 'قائمة أنواع البضائع التي تظهر كشرائح صغيرة.',
        groups: [
          { title: 'عنوان القسم', fields: [['goods.title', 'عنوان القسم'], ['goods.lead', 'الوصف تحت العنوان']] },
          { title: 'أنواع البضائع', fields: Array.from({ length: 14 }, (_, i) => [`goods.${i + 1}`, `النوع ${i + 1}`]) },
        ],
      },
      {
        id: 'how', icon: '🧭', title: 'خطوات الشحن', link: '/',
        desc: 'الخطوات الست من طلب العرض حتى التسليم.',
        groups: [
          { title: 'عنوان القسم', fields: [['how.title', 'عنوان القسم'], ['how.lead', 'الوصف تحت العنوان']] },
          ...[1, 2, 3, 4, 5, 6].map(n => ({ title: `الخطوة ${AR_NUM[n]}`, fields: [[`how.s${n}.title`, 'عنوان الخطوة'], [`how.s${n}.text`, 'شرح الخطوة']] })),
        ],
      },
      {
        id: 'trust', icon: '🏅', title: 'لماذا الأماني', link: '/',
        desc: 'المميزات الست التي تعرض سبب اختيار الشركة.',
        groups: [
          { title: 'عنوان القسم', fields: [['trust.title', 'عنوان القسم']] },
          ...[1, 2, 3, 4, 5, 6].map(n => ({ title: `الميزة ${AR_NUM[n]}`, fields: [[`trust.${n}.title`, 'عنوان الميزة'], [`trust.${n}.text`, 'شرح الميزة']] })),
        ],
      },
      {
        id: 'cta', icon: '💬', title: 'دعوة للتواصل', link: '/',
        desc: 'القسم الأخير في الرئيسية مع زرّي واتساب.',
        groups: [{ title: 'دعوة للتواصل', fields: [['cta.title', 'العنوان'], ['cta.lead', 'النص'], ['cta.eg', 'نص زر واتساب مصر'], ['cta.ps', 'نص زر واتساب الضفة']] }],
      },
      {
        id: 'spage', icon: '📄', title: 'صفحة الخدمات', link: '/services',
        desc: 'رأس صفحة الخدمات والتنبيه وزر واتساب. بطاقات الخدمات نفسها تُعدّل من قسم «الخدمات».',
        groups: [
          { title: 'رأس الصفحة', fields: [['spage.tag', 'السطر الصغير فوق العنوان'], ['spage.title', 'عنوان الصفحة'], ['spage.text', 'النص تحت العنوان']] },
          { title: 'التنبيه والزر', fields: [['spage.note', 'نص التنبيه (الصندوق البرتقالي)'], ['spage.cta', 'نص زر واتساب']] },
        ],
      },
      {
        id: 'faq', icon: '❓', title: 'الأسئلة الشائعة', link: '/services',
        desc: 'الأسئلة والإجابات أسفل صفحة الخدمات.',
        groups: [
          { title: 'عنوان القسم', fields: [['faq.title', 'عنوان القسم']] },
          ...[1, 2, 3, 4].map(n => ({ title: `السؤال ${AR_NUM[n]}`, fields: [[`faq.${n}.q`, 'السؤال'], [`faq.${n}.a`, 'الإجابة']] })),
        ],
      },
      {
        id: 'contact', icon: '📍', title: 'صفحة التواصل', link: '/contact',
        desc: 'عناوين البطاقات والنصوص في صفحة التواصل. الأرقام نفسها تُعدّل من «بيانات التواصل».',
        groups: [
          { title: 'رأس الصفحة', fields: [['contact.tag', 'السطر الصغير فوق العنوان'], ['contact.title', 'عنوان الصفحة'], ['contact.text', 'النص تحت العنوان']] },
          { title: 'بطاقات التواصل', fields: [['contact.wa.eg', 'عنوان بطاقة واتساب مصر'], ['contact.wa.ps', 'عنوان بطاقة واتساب الضفة'], ['contact.phone', 'عنوان بطاقة الهاتف'], ['contact.fb', 'عنوان بطاقة فيسبوك']] },
          { title: 'العناوين وساعات العمل', fields: [['contact.addr.title', 'عنوان بطاقة مكتب القاهرة'], ['contact.addr.text', 'عنوان مكتب القاهرة بالتفصيل'], ['contact.store.title', 'عنوان بطاقة مخزن الضفة'], ['contact.store.text', 'عنوان المخزن بالتفصيل'], ['contact.hours.title', 'عنوان بطاقة ساعات العمل'], ['contact.hours.text', 'نص ساعات العمل']] },
          { title: 'صندوق «أرسل تفاصيل شحنتك»', fields: [['contact.cta.title', 'العنوان'], ['contact.cta.lead', 'النص'], ['contact.cta.btn', 'نص الزر']] },
        ],
      },
      {
        id: 'nav', icon: '🔝', title: 'القائمة العلوية', link: '/',
        desc: 'أسماء الروابط في شريط التنقل أعلى كل صفحة.',
        groups: [{ title: 'روابط القائمة', fields: [['nav.home', 'الرئيسية'], ['nav.routes', 'خطوط الشحن'], ['nav.services', 'خدماتنا'], ['nav.contact', 'تواصل معنا'], ['nav.whatsapp', 'زر واتساب']] }],
      },
      {
        id: 'footer', icon: '🔻', title: 'أسفل الصفحة (التذييل)', link: '/',
        desc: 'النصوص في الشريط الكحلي أسفل كل صفحة.',
        groups: [
          { title: 'عن الشركة', fields: [['footer.about.title', 'اسم الشركة'], ['footer.about.text', 'وصف قصير']] },
          { title: 'العناوين والروابط', fields: [['footer.links', 'عنوان عمود الروابط'], ['footer.contact', 'عنوان عمود التواصل'], ['footer.wa.eg', 'تسمية واتساب مصر'], ['footer.wa.ps', 'تسمية واتساب الضفة'], ['footer.address', 'العنوان'], ['footer.copy', 'سطر الحقوق']] },
        ],
      },
      {
        id: 'e404', icon: '🧭', title: 'صفحة «غير موجود»', link: '/404.html',
        desc: 'الصفحة التي تظهر عند فتح رابط خاطئ.',
        groups: [{ title: 'النصوص', fields: [['e404.title', 'العنوان'], ['e404.text', 'النص'], ['e404.home', 'نص زر العودة']] }],
      },
    ],
  };
})();
