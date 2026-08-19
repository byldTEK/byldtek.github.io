'use client';

import { Component } from 'react';
import Script from 'next/script';
import SocialIcon from './SocialIcon';
import { sendContact } from './contact-api.mjs';

const COBALT = '#3D7BFF';
const MID = '#0B1320';
const EASE = 'cubic-bezier(.2,.8,.2,1)';
const CONTACT_API_URL = process.env.NEXT_PUBLIC_CONTACT_API_URL || '';
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

const EN = {
  navCapabilities: 'Capabilities', navApproach: 'Approach', navWork: 'Work', navExperience: 'Experience', navContact: 'Contact',
  langSwitch: 'عربي', langSwitchLong: 'عرض النسخة العربية', close: 'CLOSE',
  heroKicker: 'SOFTWARE ENGINEERING · AI & AUTOMATION · GLOBAL', heroLine1: 'We make', heroLine2: 'ideas work',
  heroBody: 'byldTEK is a software engineering company building AI and automation systems, web platforms, mobile applications, and the software infrastructure behind them.',
  heroPrimary: "Tell us what you're building", heroSecondary: 'Explore our work', scroll: 'SCROLL',
  capKicker: '01 · CAPABILITIES', capHeading: 'What are you trying to make work?',
  processKicker: '02 · HOW WE THINK & BUILD', workKicker: '03 · FEATURED WORK', bunyanName: 'Bunyan',
  workMeta: 'MOBILE APP', bunyanBody: 'A mobile platform for managing shared building finances, resident balances, payments, and expenses.',
  expKicker: '04 · EXPERIENCE', expTitle1: 'New name.', expTitle2: 'Proven experience',
  expLead: "byldTEK is new. The engineering experience behind it isn't.",
  expCopy: 'Years of professional software engineering experience across products and systems in different industries, technologies and markets — now brought together under one standard: make the technology work.',
  sector1: 'Government & public-sector systems', sector2: 'Fintech & business platforms', sector3: 'Commerce & marketplaces',
  sector4: 'Healthcare & education', sector5: 'Logistics & field operations', sector6: 'Enterprise software',
  standardKicker: 'OUR STANDARD', standardBody: "We don't just build what was asked. We work out what needs to be built — then engineer it properly",
  standardMeta: 'Different products. Different industries. Same requirement: it has to work.',
  contactKicker: '05 · START', contactTitle: "Tell us what you're building",
  contactBody: "Start with the problem, the opportunity, or the rough idea. We'll work out what needs to be built.",
  contactStep1: '1 — WHAT DOES IT INVOLVE? (PICK ANY)', contactStep2: '2 — THE IDEA, IN YOUR OWN WORDS',
  contactPlaceholder: 'A problem, an opportunity, or a rough idea — a sentence is enough to start.', contactButton: 'Start the conversation',
  contactEmailLabel: '3 — WHERE SHOULD WE REPLY?', contactEmailPlaceholder: 'you@company.com', contactSending: 'Sending…',
  contactSuccess: "Thanks — your message is on its way. We'll reply by email.",
  contactError: 'We could not send your message. Please try again or email hello@byldtek.com.',
  contactVerify: 'Please complete the verification before sending.',
  contactUnavailable: 'The form is not configured yet. Please email hello@byldtek.com.',
  footerTagline: 'SOFTWARE ENGINEERING · AI & AUTOMATION', footerSlogan: 'WE MAKE IDEAS WORK.',
  footerExplore: 'EXPLORE', footerConnect: 'CONNECT', privacy: 'Privacy', terms: 'Terms', rights: 'All rights reserved.',
  legalClose: 'CLOSE', lastUpdated: 'LAST UPDATED', legalContactTitle: 'Questions', legalContactBody: 'For privacy or website-related questions:',
  contactPrivacyPrefix: 'Information you send through the form, email, or WhatsApp is used to respond to your inquiry. See our', contactPrivacyTail: 'for details.',
  bunyanAlt1: 'Bunyan mobile app splash screen', bunyanAlt2: 'Bunyan resident balances screen', bunyanAlt3: 'Bunyan building account summary', bunyanAlt4: 'Bunyan payments and expenses ledger', bunyanAlt5: 'Bunyan payment entry screen',
};

const AR = {
  navCapabilities: 'ما نبنيه', navApproach: 'منهجنا', navWork: 'أعمالنا', navExperience: 'خبرتنا', navContact: 'تواصل',
  langSwitch: 'EN', langSwitchLong: 'View English version', close: 'إغلاق',
  heroKicker: 'هندسة البرمجيات · الذكاء الاصطناعي والأتمتة · عالميًا', heroLine1: 'نبني', heroLine2: 'أفكارًا تعمل',
  heroBody: 'byldTEK شركة هندسة برمجيات تبني أنظمة الذكاء الاصطناعي والأتمتة، ومنصات الويب، وتطبيقات الهاتف، والبنية البرمجية التي تشغّلها.',
  heroPrimary: 'حدّثنا عمّا تبنيه', heroSecondary: 'استكشف أعمالنا', scroll: 'مرّر',
  capKicker: '01 · ما نبنيه', capHeading: 'ما الذي تريد أن نبنيه معك؟',
  processKicker: '02 · كيف نفكّر ونبني', workKicker: '03 · عمل مختار', bunyanName: 'بنيان',
  workMeta: 'تطبيق هاتف', bunyanBody: 'منصة هاتف لإدارة المصروفات المشتركة للمباني، وأرصدة السكان، والمدفوعات، والمصروفات.',
  expKicker: '04 · الخبرة', expTitle1: 'اسم جديد.', expTitle2: 'خبرة تمتد لسنوات',
  expLead: 'byldTEK اسم جديد، لكن الخبرة الهندسية التي تقف وراءه ليست جديدة.',
  expCopy: 'سنوات من الخبرة المهنية في هندسة البرمجيات عبر منتجات وأنظمة وقطاعات وتقنيات وأسواق مختلفة — نجمعها اليوم تحت معيار واحد: أن تعمل التقنية كما يجب.',
  sector1: 'أنظمة حكومية وقطاع عام', sector2: 'التقنية المالية ومنصات الأعمال', sector3: 'التجارة والأسواق الرقمية',
  sector4: 'الرعاية الصحية والتعليم', sector5: 'الخدمات اللوجستية والعمليات الميدانية', sector6: 'برمجيات المؤسسات',
  standardKicker: 'معيارنا', standardBody: 'لا ننفّذ المطلوب فحسب. نحدّد ما يجب بناؤه، ثم نهندسه بالشكل الصحيح',
  standardMeta: 'منتجات مختلفة. قطاعات مختلفة. المعيار واحد: يجب أن تعمل.',
  contactKicker: '05 · ابدأ', contactTitle: 'حدّثنا عمّا تبنيه',
  contactBody: 'ابدأ بالمشكلة أو الفرصة أو الفكرة الأولية. سنساعدك على تحديد ما يجب بناؤه.',
  contactStep1: '1 — ماذا يتضمن المشروع؟ (اختر ما يناسب)', contactStep2: '2 — اشرح الفكرة بطريقتك',
  contactPlaceholder: 'مشكلة، فرصة، أو فكرة أولية — جملة واحدة تكفي للبدء.', contactButton: 'ابدأ المحادثة',
  contactEmailLabel: '3 — كيف نرد عليك؟', contactEmailPlaceholder: 'you@company.com', contactSending: 'جارٍ الإرسال…',
  contactSuccess: 'شكرًا — رسالتك في الطريق. سنرد عليك عبر البريد الإلكتروني.',
  contactError: 'تعذّر إرسال رسالتك. حاول مرة أخرى أو راسلنا على hello@byldtek.com.',
  contactVerify: 'أكمل خطوة التحقق قبل الإرسال.',
  contactUnavailable: 'نموذج التواصل غير مهيأ بعد. راسلنا على hello@byldtek.com.',
  footerTagline: 'هندسة برمجيات · ذكاء اصطناعي وأتمتة', footerSlogan: 'نبني أفكارًا تعمل.',
  footerExplore: 'استكشف', footerConnect: 'تواصل معنا', privacy: 'الخصوصية', terms: 'الشروط', rights: 'جميع الحقوق محفوظة.',
  legalClose: 'إغلاق', lastUpdated: 'آخر تحديث', legalContactTitle: 'استفسارات', legalContactBody: 'لأي استفسار متعلق بالخصوصية أو استخدام الموقع:',
  contactPrivacyPrefix: 'نستخدم المعلومات التي ترسلها عبر النموذج أو البريد أو واتساب للرد على استفسارك. راجع', contactPrivacyTail: 'للتفاصيل.',
  bunyanAlt1: 'شاشة بداية تطبيق بنيان', bunyanAlt2: 'شاشة أرصدة السكان في بنيان', bunyanAlt3: 'ملخص حساب العمارة في بنيان', bunyanAlt4: 'سجل المدفوعات والمصروفات في بنيان', bunyanAlt5: 'شاشة تسجيل دفعة في بنيان',
};

const LEGAL_EN = {
  privacy: {
    title: 'Privacy Policy', updated: '19 August 2026',
    intro: "This policy explains how byldTEK collects and uses personal data when you visit this website or contact us through it, by email, or by WhatsApp. byldTEK works with clients worldwide, so this policy is written around data-protection principles that are broadly recognised internationally rather than tied to any single country's law.",
    sections: [
      { title: '1. Who we are', body: 'byldTEK is an independent software engineering practice serving clients worldwide. byldTEK is not currently registered as a formal corporate entity in any jurisdiction; this section will be updated with registration details once that is in place. For any privacy question or request, contact us at hello@byldtek.com.' },
      { title: '2. Information you send us', body: 'When you contact byldTEK through the website, email, or WhatsApp, we receive the information you choose to provide. This may include your name, contact details, company information, project requirements, and the contents of your message.' },
      { title: '3. Website and technical data', body: 'Our hosting and security providers may create basic technical logs needed to deliver and protect the website, such as IP address, browser or device information, request times, and error or security events.\n\nThe current site does not intentionally use advertising, behavioural-tracking, profiling, or cross-site analytics cookies. It may use limited browser storage for interface preferences such as your selected language and short-lived session behaviour. There is no advertising or analytics cookie preference panel on the current website.' },
      { title: '4. How we use your information, and on what basis', body: "We use information you send us to respond to your inquiry, understand and assess a potential project, communicate with you, provide services if you later engage us, protect the website, maintain appropriate business records, and comply with applicable legal obligations. Where required, we rely on your consent (for example, when you submit the contact form or message us on WhatsApp) or on our legitimate interest in responding to business inquiries and operating the website. You can withdraw consent at any time — see section 7. We do not sell your inquiry information or use it for unrelated behavioural advertising." },
      { title: '5. Services and external channels', body: 'We may rely on service providers for website hosting, email, infrastructure, security, and business communications. If you choose to contact us through WhatsApp, your message is also handled through WhatsApp/Meta under its own terms and privacy practices. Social-media links on this website are ordinary outbound links; the current site does not intentionally embed social-media tracking widgets.' },
      { title: '6. Retention and security', body: 'We keep inquiry and business correspondence for as long as reasonably needed to respond, follow up, maintain business records, resolve disputes, or meet legal requirements. We use reasonable technical and organisational safeguards, but no online service can guarantee absolute security.' },
      { title: '7. Your privacy rights', body: "Common to most privacy laws worldwide (including frameworks such as the EU's GDPR), you may have the right to: know what personal data we hold about you and why; access a copy of it; request correction of inaccurate data; request erasure or restriction of your data; object to certain processing; and withdraw consent at any time, without affecting processing carried out before the withdrawal. Which of these rights apply to you, and how to exercise them, depends on where you're located. To ask about any of this, contact us at hello@byldtek.com." },
    ],
  },
  terms: {
    title: 'Terms of Use', updated: '19 August 2026',
    intro: 'These terms apply to your use of the public byldTEK website at byldtek.com. They do not replace the separate agreement used when byldTEK accepts a client project.',
    sections: [
      { title: '1. What this website is for', body: 'This website presents byldTEK, our capabilities, approach, and selected work, and gives visitors ways to contact us about potential projects. Website content is informational and does not by itself constitute a quotation, proposal, guarantee, or binding offer to provide services.' },
      { title: '2. Project inquiries', body: 'Sending a message through the website, email, or WhatsApp starts a conversation only. It does not automatically create a client relationship, confidentiality obligation, exclusivity arrangement, project acceptance, price commitment, or delivery commitment. Those terms apply only when agreed separately in writing.' },
      { title: '3. Website content and intellectual property', body: 'The byldTEK name, brand identity, website design, copy, original graphics, and other original website materials are owned by or licensed to byldTEK unless stated otherwise. You may browse the site and share links to it, but you may not commercially reproduce or republish substantial parts of the website without permission.' },
      { title: '4. Products, portfolio, and third-party material', body: 'Product names, trademarks, screenshots, platform names, and third-party materials remain the property of their respective owners. Portfolio content is provided to describe work and context; it does not transfer any rights in client, product, or third-party assets.' },
      { title: '5. External links and communication services', body: 'Links to WhatsApp, social networks, or other external websites take you to services operated by third parties. Their availability, content, security, terms, and privacy practices are controlled by those providers, not by this website.' },
      { title: '6. Website availability and changes', body: 'We may update, add, remove, or change website content and features. We aim to keep the site accurate and available, but we do not promise uninterrupted access or that every public page will always be complete or error-free. Nothing in these terms limits rights or liabilities that cannot lawfully be limited.' },
      { title: '7. Governing law', body: 'byldTEK is not currently registered as a formal corporate entity in a specific jurisdiction. Until registration is complete, these terms are intended to be interpreted in good faith, and any disagreement will first be handled through direct communication between the parties. This section will be updated with a specific governing law once byldTEK completes registration.' },
    ],
  },
};

const LEGAL_AR = {
  privacy: {
    title: 'سياسة الخصوصية', updated: '19 أغسطس 2026',
    intro: 'توضح هذه السياسة كيف تجمع byldTEK البيانات الشخصية وتستخدمها عند زيارتك لهذا الموقع أو تواصلك معنا من خلاله أو عبر البريد الإلكتروني أو واتساب. تعمل byldTEK مع عملاء حول العالم، لذا صيغت هذه السياسة بناءً على مبادئ حماية بيانات معترف بها دوليًا بشكل عام، وليست مرتبطة بقانون دولة واحدة بعينها.',
    sections: [
      { title: '1. من نحن', body: 'byldTEK ممارسة مستقلة لهندسة البرمجيات تخدم عملاء حول العالم. لم يتم حتى الآن تسجيل byldTEK ككيان تجاري رسمي في أي دولة؛ وسيتم تحديث هذا القسم ببيانات التسجيل فور توفرها. لأي استفسار أو طلب متعلق بالخصوصية، تواصل معنا على hello@byldtek.com.' },
      { title: '2. المعلومات التي ترسلها إلينا', body: 'عندما تتواصل مع byldTEK من خلال الموقع أو البريد الإلكتروني أو واتساب، نستلم المعلومات التي تختار إرسالها. وقد تشمل اسمك وبيانات التواصل وبيانات الشركة ومتطلبات المشروع ومحتوى رسالتك.' },
      { title: '3. بيانات الموقع والبيانات التقنية', body: 'قد ينشئ مزودو الاستضافة والأمان سجلات تقنية أساسية لازمة لتقديم الموقع وحمايته، مثل عنوان IP ومعلومات المتصفح أو الجهاز وأوقات الطلبات وأحداث الأخطاء أو الأمان.\n\nلا يستخدم الموقع الحالي عمدًا ملفات ارتباط للإعلانات أو التتبع السلوكي أو إنشاء الملفات التعريفية أو التحليلات عبر المواقع. وقد يستخدم تخزينًا محدودًا في المتصفح لتفضيلات الواجهة مثل اللغة التي اخترتها وبعض سلوك الجلسة قصير المدى. لذلك لا توجد في النسخة الحالية لوحة لتفضيلات ملفات ارتباط الإعلانات أو التحليلات.' },
      { title: '4. كيف نستخدم معلوماتك وعلى أي أساس قانوني', body: 'نستخدم المعلومات التي ترسلها للرد على استفسارك وفهم المشروع المحتمل وتقييمه والتواصل معك وتقديم الخدمات إذا تعاقدت معنا لاحقًا، وكذلك لحماية الموقع وحفظ السجلات التجارية المناسبة والوفاء بالالتزامات القانونية المطبقة. وحيثما يلزم، نعتمد على موافقتك (مثلاً عند إرسال نموذج التواصل أو مراسلتنا عبر واتساب) أو على مصلحتنا المشروعة في الرد على استفسارات الأعمال وتشغيل الموقع. يمكنك سحب موافقتك في أي وقت — راجع القسم 7. لا نبيع بيانات استفساراتك ولا نستخدمها لإعلانات سلوكية غير مرتبطة.' },
      { title: '5. الخدمات وقنوات التواصل الخارجية', body: 'قد نعتمد على مزودي خدمات للاستضافة والبريد الإلكتروني والبنية التحتية والأمان واتصالات الأعمال. وإذا اخترت التواصل معنا عبر واتساب، تتم معالجة رسالتك أيضًا من خلال WhatsApp/Meta وفق شروطها وممارسات الخصوصية الخاصة بها. روابط الشبكات الاجتماعية في الموقع روابط خارجية عادية، ولا يضم الموقع الحالي عمدًا أدوات تتبع اجتماعي مضمّنة.' },
      { title: '6. الاحتفاظ والأمان', body: 'نحتفظ بالاستفسارات والمراسلات التجارية للمدة المعقولة اللازمة للرد والمتابعة وحفظ سجلات العمل وحل النزاعات أو الوفاء بالمتطلبات القانونية. نستخدم إجراءات تقنية وتنظيمية معقولة، لكن لا يمكن لأي خدمة عبر الإنترنت ضمان الأمان الكامل.' },
      { title: '7. حقوقك المتعلقة بالخصوصية', body: 'بحسب معظم قوانين الخصوصية حول العالم (بما في ذلك أطر مثل اللائحة الأوروبية العامة لحماية البيانات GDPR)، قد يكون لك الحق في: معرفة البيانات الشخصية التي نحتفظ بها عنك وسبب ذلك؛ الحصول على نسخة منها؛ طلب تصحيح البيانات غير الدقيقة؛ طلب حذف بياناتك أو تقييد معالجتها؛ الاعتراض على بعض عمليات المعالجة؛ وسحب موافقتك في أي وقت دون أن يؤثر ذلك على المعالجة التي تمت قبل السحب. وتختلف الحقوق المطبقة وكيفية ممارستها بحسب موقعك. لأي استفسار حول ذلك، تواصل معنا على hello@byldtek.com.' },
    ],
  },
  terms: {
    title: 'شروط استخدام الموقع', updated: '19 أغسطس 2026',
    intro: 'تنطبق هذه الشروط على استخدامك لموقع byldTEK العام على byldtek.com. وهي لا تستبدل الاتفاقية المنفصلة التي تُستخدم عند قبول byldTEK لمشروع عميل.',
    sections: [
      { title: '1. الغرض من الموقع', body: 'يعرض هذا الموقع byldTEK وما نبنيه ومنهجنا وبعض الأعمال المختارة، ويوفر طرقًا للتواصل معنا بشأن مشاريع محتملة. محتوى الموقع تعريفي ولا يُعد بمفرده عرض سعر أو مقترحًا أو ضمانًا أو عرضًا ملزمًا لتقديم خدمات.' },
      { title: '2. الاستفسار عن مشروع', body: 'إرسال رسالة عبر الموقع أو البريد الإلكتروني أو واتساب يبدأ محادثة فقط. ولا ينشئ تلقائيًا علاقة عميل أو التزامًا بالسرية أو الحصرية أو قبول المشروع أو التزامًا بسعر أو موعد تسليم. تصبح هذه الأمور ملزمة فقط عندما يتم الاتفاق عليها كتابةً بشكل منفصل.' },
      { title: '3. محتوى الموقع والملكية الفكرية', body: 'اسم byldTEK وهوية العلامة وتصميم الموقع والنصوص والرسومات الأصلية وغيرها من المواد الأصلية في الموقع مملوكة لـ byldTEK أو مرخصة لها ما لم يُذكر خلاف ذلك. يمكنك تصفح الموقع ومشاركة روابطه، لكن لا يجوز إعادة نشر أو استغلال أجزاء جوهرية منه تجاريًا دون إذن.' },
      { title: '4. المنتجات والأعمال ومواد الأطراف الأخرى', body: 'تظل أسماء المنتجات والعلامات التجارية ولقطات الشاشة وأسماء المنصات ومواد الأطراف الأخرى ملكًا لأصحابها. تُعرض مواد الأعمال لوصف المشروع والسياق ولا تمنح أي حقوق في أصول العملاء أو المنتجات أو الأطراف الأخرى.' },
      { title: '5. الروابط وخدمات التواصل الخارجية', body: 'تنقلك روابط واتساب والشبكات الاجتماعية أو المواقع الخارجية الأخرى إلى خدمات تديرها جهات خارجية. ويتحكم مقدمو تلك الخدمات في توافرها ومحتواها وأمانها وشروطها وممارسات الخصوصية الخاصة بها.' },
      { title: '6. توافر الموقع والتغييرات', body: 'قد نقوم بتحديث محتوى الموقع وميزاته أو إضافتها أو إزالتها. نسعى إلى إبقاء الموقع دقيقًا ومتاحًا، لكننا لا نضمن الوصول دون انقطاع أو أن تكون كل صفحة عامة مكتملة وخالية من الأخطاء في جميع الأوقات. ولا تحد هذه الشروط من أي حقوق أو مسؤوليات لا يجوز تقييدها قانونًا.' },
      { title: '7. القانون الحاكم', body: 'لم يتم حتى الآن تسجيل byldTEK ككيان تجاري رسمي في دولة محددة. وإلى حين اكتمال التسجيل الرسمي، يُقصد بهذه الشروط أن تُفسَّر بحسن نية، وتتم معالجة أي خلاف عبر التواصل المباشر بين الطرفين أولًا. سيتم تحديث هذا القسم بقانون حاكم محدد بعد اكتمال تسجيل byldTEK.' },
    ],
  },
};

const CAPDATA_EN = [
  { name: 'AI & Automation', desc: 'AI agents, workflow automation, intelligent processes and integrations.',
    blocks: [[-6,46,40,1,2],[46,46,28,1,2],[18,46,6,6,0],[40,43,7,7,1],[74,20,1,32,2],[62,74,14,1,2]], dot: [76,43.8] },
  { name: 'Web Platforms', desc: 'Web applications, SaaS products, dashboards, portals and websites.',
    blocks: [[10,12,64,46,1],[22,26,64,46,1],[34,40,52,34,0],[10,88,96,1,2],[34,12,1,76,2],[70,20,10,4,0]], dot: [80,68] },
  { name: 'Mobile Apps', desc: 'Native and cross-platform mobile products for iOS and Android.',
    blocks: [[38,6,24,94,1],[38,6,24,10,0],[-4,30,42,1,2],[62,64,46,1,2],[44,24,12,2,0],[44,32,8,2,0]], dot: [56,84] },
  { name: 'Backend & Systems', desc: 'APIs, cloud services, databases, integrations and system architecture.',
    blocks: [[-8,58,44,50,0],[46,64,18,18,1],[46,14,18,18,0],[72,14,18,18,1],[55,32,1,32,2],[64,23,26,1,2]], dot: [78,70] },
  { name: 'Product Engineering', desc: 'From product definition and architecture through development, deployment and iteration.',
    blocks: [[14,10,72,80,1],[14,10,72,12,0],[26,34,20,20,0],[58,34,1,56,2],[26,66,20,2,0],[58,58,20,20,1]], dot: [64,64] },
];
const CAPDATA_AR = [
  { name: 'الذكاء الاصطناعي والأتمتة', desc: 'وكلاء ذكاء اصطناعي، أتمتة سير العمل، عمليات ذكية، وتكاملات.', blocks: CAPDATA_EN[0].blocks, dot: CAPDATA_EN[0].dot },
  { name: 'منصات الويب', desc: 'تطبيقات ويب، منتجات SaaS، لوحات تحكم، بوابات، ومواقع.', blocks: CAPDATA_EN[1].blocks, dot: CAPDATA_EN[1].dot },
  { name: 'تطبيقات الهاتف', desc: 'تطبيقات أصلية ومتعددة المنصات لنظامي iOS وAndroid.', blocks: CAPDATA_EN[2].blocks, dot: CAPDATA_EN[2].dot },
  { name: 'الأنظمة والبنية الخلفية', desc: 'واجهات API، خدمات سحابية، قواعد بيانات، تكاملات، وهندسة الأنظمة.', blocks: CAPDATA_EN[3].blocks, dot: CAPDATA_EN[3].dot },
  { name: 'هندسة المنتجات الرقمية', desc: 'من تعريف المنتج وهندسته إلى التطوير والنشر والتحسين المستمر.', blocks: CAPDATA_EN[4].blocks, dot: CAPDATA_EN[4].dot },
];

const STAGES_EN = [
  { num: '01', name: 'Understand', desc: 'We start with the real problem, not assumptions.',
    pos: [[8,12,30,7,-14,.5],[70,8,7,26,10,.5],[16,64,22,7,8,.5],[62,58,7,20,-12,.5],[44,38,9,9,20,0]] },
  { num: '02', name: 'Structure', desc: 'We turn ambiguity into requirements and a plan.',
    pos: [[14,20,44,7,0,.75],[14,36,7,40,0,.75],[14,84,32,7,0,.75],[64,36,7,32,0,.75],[76,20,9,9,0,0]] },
  { num: '03', name: 'Engineer', desc: 'We design, build, integrate and test rigorously.',
    pos: [[16,16,62,10,0,1],[16,16,10,62,0,1],[16,68,38,10,0,1],[68,16,10,42,0,1],[84,72,10,10,0,.35]] },
  { num: '04', name: 'Resolve', desc: 'We deliver systems that work in the real world.',
    pos: [[18,14,64,17,0,1],[18,14,17,64,0,1],[18,61,37,17,0,1],[65,14,17,37,0,1],[63.5,59.5,18.5,18.5,0,1]] },
];
const STAGES_AR = [
  { num: '01', name: 'نفهم', desc: 'نبدأ بالمشكلة الحقيقية، لا بالافتراضات.', pos: STAGES_EN[0].pos },
  { num: '02', name: 'نُهيكل', desc: 'نحوّل الغموض إلى متطلبات وخطة واضحة.', pos: STAGES_EN[1].pos },
  { num: '03', name: 'نُهندس', desc: 'نصمّم ونبني وندمج ونختبر بدقة.', pos: STAGES_EN[2].pos },
  { num: '04', name: 'نُنجز', desc: 'نسلّم أنظمة تعمل بكفاءة في العالم الحقيقي.', pos: STAGES_EN[3].pos },
];

const GUIDES = [
  [[-10, 30, 120, 1], [52, -10, 1, 120], [10, 78, 80, 1]],
  [[14, 12, 72, 1], [14, 12, 1, 76], [64, 30, 1, 50]],
  [[16, 10, 68, 1], [80, 16, 1, 68], [-10, 88, 120, 1]],
  [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
];

const BUNYAN_SHOTS = [
  { cls: 'bunyan-shot-1', src: '/bunyan/shot-1.webp', altKey: 'bunyanAlt1' },
  { cls: 'bunyan-shot-2', src: '/bunyan/shot-2.webp', altKey: 'bunyanAlt2' },
  { cls: 'bunyan-shot-3', src: '/bunyan/shot-3.webp', altKey: 'bunyanAlt3' },
  { cls: 'bunyan-shot-4', src: '/bunyan/shot-4.webp', altKey: 'bunyanAlt4' },
  { cls: 'bunyan-shot-5', src: '/bunyan/shot-5.webp', altKey: 'bunyanAlt5' },
];

const LogoMark = ({ ink = '#FFFFFF', size = 24 }) => (
  <svg viewBox="14 8 100 100" width={size} height={size}>
    <rect x="24" y="18" width="80" height="22" fill={ink} />
    <rect x="24" y="18" width="22" height="80" fill={ink} />
    <rect x="24" y="76" width="46" height="22" fill={ink} />
    <path d="M82,18 L104,18 L104,49 L89,64 L82,64 Z" fill={ink} />
    <rect x="81" y="75" width="23" height="23" fill="#3D7BFF" />
  </svg>
);

export default class HomeClient extends Component {
  state = { cap: 0, stage: 0, heroP: 0, scrolled: false, workP: 0, showIntro: true, chips: [], vp: 'd', menuOpen: false, lang: this.props.initialLang || 'en', legalOpen: null, contactStatus: 'idle', contactMessage: '', turnstileToken: '' };

  componentDidMount() {
    try {
      if (sessionStorage.getItem('byldtek-intro-seen')) this.setState({ showIntro: false });
      else sessionStorage.setItem('byldtek-intro-seen', '1');
    } catch (e) {}
    // <html lang/dir> is now set correctly server-side by the route's own root
    // layout (app/(en)/layout.js vs app/(ar)/ar/layout.js) — no client patch
    // needed here. (A prior version patched it in this effect instead; that
    // caused a real hydration mismatch on every /ar/ load, which corrupted
    // scroll-state tracking in dev mode.)

    this.rm = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.onScroll = () => {
      if (this.raf) return;
      this.raf = requestAnimationFrame(() => {
        this.raf = null;
        const vh = window.innerHeight;
        const next = {};
        next.scrolled = window.scrollY > 40;
        if (this.hero) {
          const r = this.hero.getBoundingClientRect();
          next.heroP = Math.round(Math.min(1, Math.max(0, -r.top / (vh * 0.9))) * 50) / 50;
        }
        if (this.proc) {
          const r = this.proc.getBoundingClientRect();
          const p = Math.min(1, Math.max(0, -r.top / (r.height - vh)));
          next.stage = Math.min(3, Math.floor(p * 4));
        }
        if (this.work) {
          const r = this.work.getBoundingClientRect();
          next.workP = Math.round(Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.7))) * 50) / 50;
        }
        if (this.capEl) {
          const r = this.capEl.getBoundingClientRect();
          const p = Math.min(1, Math.max(0, -r.top / (r.height - vh)));
          next.cap = Math.min(4, Math.floor(p * 5));
        }
        if (next.scrolled !== this.state.scrolled || next.heroP !== this.state.heroP || next.stage !== this.state.stage || next.workP !== this.state.workP || next.cap !== this.state.cap) this.setState(next);
      });
    };
    this.onResize = () => {
      const w = window.innerWidth;
      const vp = w < 760 ? 'm' : w < 1100 ? 't' : 'd';
      if (vp !== this.state.vp) this.setState({ vp });
    };
    window.addEventListener('resize', this.onResize);
    this.onResize();
    window.addEventListener('scroll', this.onScroll, { passive: true });
    this.onScroll();

    this.onKeyDown = (e) => {
      if (!this.state.legalOpen) return;
      if (e.key === 'Escape') { this.closeLegal(); return; }
      if (e.key === 'Tab') this.trapLegalFocus(e);
    };
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.legalOpen !== this.state.legalOpen) {
      if (this.state.legalOpen) {
        // Opening: remember what had focus so we can give it back, then move
        // focus into the panel — a modal that opens without moving focus
        // strands keyboard/screen-reader users on whatever they clicked.
        this.legalTrigger = document.activeElement;
        if (this.legalCloseEl) this.legalCloseEl.focus();
      } else if (this.legalTrigger) {
        this.legalTrigger.focus();
        this.legalTrigger = null;
      }
    }
  }

  trapLegalFocus(e) {
    if (!this.legalPanelEl) return;
    const focusable = this.legalPanelEl.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.onKeyDown);
    if (this.raf) cancelAnimationFrame(this.raf);
    if (this.turnstileWidgetId !== undefined && window.turnstile) {
      window.turnstile.remove(this.turnstileWidgetId);
    }
  }

  // The lang switch is a real <a href="/"|"/ar/"> now (see render) — this just
  // remembers the choice for next time; the browser handles the actual navigation.
  rememberLang = (nextLang) => {
    try { localStorage.setItem('byldtek-lang', nextLang); } catch (e) {}
  };

  toggleMenu = () => this.setState((s) => ({ menuOpen: !s.menuOpen }));
  toggleChip = (i) => this.setState((s) => ({ chips: s.chips.includes(i) ? s.chips.filter((x) => x !== i) : s.chips.concat(i) }));
  openPrivacy = () => this.setState({ legalOpen: 'privacy', menuOpen: false });
  openTerms = () => this.setState({ legalOpen: 'terms', menuOpen: false });
  closeLegal = () => this.setState({ legalOpen: null });
  stopLegalClick = (e) => e.stopPropagation();

  renderTurnstile = () => {
    if (
      !TURNSTILE_SITE_KEY ||
      !this.turnstileEl ||
      !window.turnstile ||
      this.turnstileWidgetId !== undefined
    ) return;

    this.turnstileWidgetId = window.turnstile.render(this.turnstileEl, {
      sitekey: TURNSTILE_SITE_KEY,
      theme: 'dark',
      language: this.state.lang,
      callback: (token) => this.setState({ turnstileToken: token }),
      'expired-callback': () => this.setState({ turnstileToken: '' }),
      'error-callback': () => this.setState({ turnstileToken: '' }),
    });
  };

  resetTurnstile = () => {
    if (this.turnstileWidgetId !== undefined && window.turnstile) {
      window.turnstile.reset(this.turnstileWidgetId);
    }
    this.setState({ turnstileToken: '' });
  };

  submitContact = async (e) => {
    e.preventDefault();
    const { lang, chips, turnstileToken } = this.state;
    const isAr = lang === 'ar';
    const chipNames = (isAr
      ? ['الذكاء الاصطناعي والأتمتة', 'منصة ويب', 'تطبيق هاتف', 'الأنظمة والبنية الخلفية', 'لست متأكدًا بعد']
      : ['AI & Automation', 'Web Platform', 'Mobile App', 'Backend & Systems', 'Not sure yet']);
    const copy = isAr ? AR : EN;

    if (!CONTACT_API_URL || !TURNSTILE_SITE_KEY) {
      this.setState({ contactStatus: 'error', contactMessage: copy.contactUnavailable });
      return;
    }
    if (!turnstileToken) {
      this.setState({ contactStatus: 'error', contactMessage: copy.contactVerify });
      return;
    }

    this.setState({ contactStatus: 'submitting', contactMessage: '' });
    try {
      await sendContact({
        endpoint: CONTACT_API_URL,
        payload: {
          email: this.emailRef.value.trim(),
          language: lang,
          message: this.ideaRef.value.trim(),
          services: chips.map((i) => chipNames[i]),
          turnstileToken,
          website: this.websiteRef ? this.websiteRef.value : '',
        },
      });
      this.emailRef.value = '';
      this.ideaRef.value = '';
      if (this.websiteRef) this.websiteRef.value = '';
      this.setState({ chips: [], contactStatus: 'success', contactMessage: copy.contactSuccess });
      this.resetTurnstile();
    } catch {
      this.setState({ contactStatus: 'error', contactMessage: copy.contactError });
      this.resetTurnstile();
    }
  };

  render() {
    const { cap, stage, heroP, scrolled, workP, vp, menuOpen, showIntro, legalOpen, chips, lang, contactStatus, contactMessage } = this.state;
    const rm = this.rm || false;
    const isAr = lang === 'ar';
    const dir = isAr ? 'rtl' : 'ltr';
    const homeHref = isAr ? '/ar/' : '/';
    const otherLangHref = isAr ? '/' : '/ar/';
    const otherLang = isAr ? 'en' : 'ar';
    const copy = isAr ? AR : EN;
    const CAPDATA = isAr ? CAPDATA_AR : CAPDATA_EN;
    const STAGES = isAr ? STAGES_AR : STAGES_EN;
    const legalDocs = isAr ? LEGAL_AR : LEGAL_EN;
    const legalDoc = legalDocs[legalOpen || 'privacy'];
    const mob = vp === 'm';
    const compactNav = vp !== 'd';
    const navDark = !scrolled;
    const navInk = navDark ? '#FFFFFF' : MID;
    const navBorder = navDark ? '#2A3650' : '#C9D3DC';

    const hp = rm ? 1 : heroP;
    const g = (a, b) => a + (b - a) * hp;
    const heroBlocks = [
      { position: 'absolute', left: '56%', top: '6%', width: '52%', height: '74%', border: '1.5px solid #243252', transform: `rotate(${g(6, 0)}deg)`, opacity: 0.9 },
      { position: 'absolute', left: 0, top: '72%', width: g(22, 40) + '%', height: '1px', background: '#243252' },
      { position: 'absolute', right: 0, top: '72%', width: g(30, 48) + '%', height: '1px', background: '#243252' },
      { position: 'absolute', left: '74%', top: g(-14, 0) + '%', width: '1px', height: '58%', background: '#243252' },
      { position: 'absolute', left: '63%', top: '30%', width: g(15, 19) + '%', height: '4.5%', background: '#22304E', transform: `rotate(${g(-9, 0)}deg)` },
      { position: 'absolute', left: '84%', top: '52%', width: '9%', height: '15%', background: '#1A2540', clipPath: 'polygon(0 0,100% 0,100% 62%,40% 100%,0 100%)', transform: `rotate(${g(12, 0)}deg)`, opacity: 0.9 },
      { position: 'absolute', left: g(48, 44) + '%', top: g(80, 84) + '%', width: '3.4%', height: '5.6%', border: '1.5px solid #243252', transform: `rotate(${g(-18, 0)}deg)` },
      { position: 'absolute', left: g(70, 40) + '%', top: g(24, 52) + '%', width: '1.4%', height: '2.3%', background: COBALT, opacity: Math.max(0, 1 - Math.max(0, hp - 0.15) * 3.2) },
    ];
    const heroDotStyle = { display: 'inline-block', width: '0.13em', height: '0.13em', background: COBALT, marginInlineStart: '0.08em', opacity: rm ? 1 : Math.min(1, Math.max(0, (hp - 0.2) * 3.5)) };
    // The field is composed with physical left/top percentages, so it doesn't
    // follow `dir` on its own — mirror the whole composition for RTL instead of
    // reworking every block's coordinates.
    const heroBaseTransform = mob ? 'translateX(18%) scale(1.35)' : 'none';
    const heroFieldStyle = {
      position: 'absolute', inset: 0, opacity: (mob ? 0.45 : 1) * (1 - hp * 0.4),
      transform: isAr ? `scaleX(-1) ${heroBaseTransform === 'none' ? '' : heroBaseTransform}`.trim() : heroBaseTransform,
      // A full mirror needs to pivot on the composition's own center, not the
      // right edge (which is only correct for the LTR mobile translate+scale).
      transformOrigin: isAr ? 'center' : 'right center',
    };

    const cd = CAPDATA[rm ? 4 : cap];
    const capBlocks = cd.blocks
      .map((b, i) => ({
        position: 'absolute', left: b[0] + '%', top: b[1] + '%', width: b[2] + '%', height: b[3] + '%',
        background: b[4] === 0 ? '#2A3A5E' : b[4] === 2 ? '#22304E' : 'transparent',
        border: b[4] === 1 ? '1.5px solid #2A3A5E' : 'none',
        transition: rm ? 'none' : `all .7s ${EASE} ${i * 40}ms`,
      }))
      .concat([{ position: 'absolute', left: cd.dot[0] + '%', top: cd.dot[1] + '%', width: '4.5%', height: '4.5%', background: COBALT, transition: rm ? 'none' : `all .7s ${EASE} 280ms` }]);

    const st = STAGES[rm ? 3 : stage];
    const procBlocks = st.pos.map((p, i) => ({
      position: 'absolute', left: p[0] + '%', top: p[1] + '%', width: p[2] + '%', height: p[3] + '%',
      background: i === 4 ? COBALT : '#FFFFFF',
      opacity: i === 4 ? (p[5] === 0 ? 0 : 1) : Math.max(p[5], 0.4),
      transform: `rotate(${p[4]}deg)`,
      clipPath: i === 3 && stage === 3 ? 'polygon(0 0,100% 0,100% 67%,32% 100%,0 100%)' : 'none',
      transition: rm ? 'none' : `all .9s ${EASE}`,
    }));
    const gset = GUIDES[rm ? 3 : stage];
    const procLines = gset.map((p) => ({
      position: 'absolute', left: p[0] + '%', top: p[1] + '%', width: p[2] + '%', height: p[3] + '%',
      background: 'rgba(255,255,255,0.14)', opacity: (rm ? 3 : stage) === 3 ? 0 : 1,
      transition: rm ? 'none' : `all .9s ${EASE}`,
    }));

    const wp = rm ? 1 : workP;
    const wf = Math.min(1, Math.max(0, (wp - 0.25) * 1.8));
    const workHeadStyle = { opacity: Math.min(1, wp * 1.6), transform: `translateY(${(1 - Math.min(1, wp * 1.6)) * 30}px)` };
    const workFrameStyle = { opacity: wf, transform: `translateY(${(1 - wf) * 50}px) scale(${0.93 + wf * 0.07})`, transformOrigin: '30% 20%' };

    const chipNames = isAr
      ? ['الذكاء الاصطناعي والأتمتة', 'منصة ويب', 'تطبيق هاتف', 'الأنظمة والبنية الخلفية', 'لست متأكدًا بعد']
      : ['AI & Automation', 'Web Platform', 'Mobile App', 'Backend & Systems', 'Not sure yet'];
    const chipSummary = chips.length
      ? (isAr ? 'تم اختيار ' + chips.length : chips.length + ' SELECTED')
      : (isAr ? 'لم تختر شيئًا — لا مشكلة' : "NOTHING SELECTED — THAT'S FINE TOO");

    const navStyle = { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: scrolled ? 'rgba(241,244,247,0.92)' : 'transparent', backdropFilter: scrolled ? 'blur(10px)' : 'none', borderBottom: scrolled ? '1px solid #E2E8EE' : '1px solid transparent', transition: `all .35s ${EASE}` };
    const navInnerStyle = { maxWidth: '1360px', margin: '0 auto', padding: mob ? '0 24px' : '0 40px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '28px' };
    const navLinksStyle = { display: compactNav ? 'none' : 'flex', alignItems: 'center', gap: '24px', fontSize: '13px', fontWeight: 600, color: navInk, whiteSpace: 'nowrap' };
    const menuBtnStyle = { display: compactNav ? 'flex' : 'none', flexDirection: 'column', gap: '6px', alignItems: 'flex-end', padding: '12px 0 12px 20px', cursor: 'pointer' };
    const heroCtaStyle = { display: 'flex', flexDirection: mob ? 'column' : 'row', gap: '14px', marginTop: '40px', maxWidth: mob ? '340px' : 'none', animation: 'bt-rise .8s 2.15s cubic-bezier(.2,.8,.2,1) both' };
    const capSectionStyle = { height: mob ? '265vh' : '500vh', background: '#F1F4F7', position: 'relative' };
    const capStickyStyle = { position: 'sticky', top: 0, height: mob ? '100svh' : '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: '1360px', margin: '0 auto', padding: mob ? '84px 24px 26px' : '0 40px' };
    const capHeadingStyle = { fontSize: mob ? 'clamp(25px,7.3vw,34px)' : 'clamp(26px,4.4vh,44px)', fontWeight: 800, letterSpacing: '-0.02em', margin: mob ? '10px 0 22px' : '14px 0 clamp(16px,4.5vh,60px)', maxWidth: mob ? '330px' : '640px', lineHeight: mob ? 1.08 : 1.15 };
    const capGridStyle = { display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gridTemplateRows: mob ? 'auto auto' : 'auto', gap: mob ? '20px' : '80px', alignItems: 'center', minHeight: mob ? 'min(68svh,560px)' : 'auto' };
    const capCopyWrapStyle = mob ? { position: 'relative', minHeight: '118px', display: 'flex', alignItems: 'center' } : { display: 'flex', flexDirection: 'column' };
    const capCanvasWrapStyle = mob ? { width: '100%', maxWidth: 'min(82vw,340px)', justifySelf: 'center', alignSelf: 'center' } : { maxWidth: 'min(460px,48vh)', width: '100%', justifySelf: 'end' };
    const capCanvasStyle = { position: 'relative', width: '100%', aspectRatio: '1', background: MID, borderRadius: mob ? '6px' : '4px', overflow: 'hidden', boxShadow: mob ? '0 18px 48px rgba(13,20,36,0.12)' : 'none' };
    const capProgressStyle = { display: mob ? 'flex' : 'none', gap: '6px', marginTop: '14px', width: '100%' };
    const procSectionStyle = { height: mob ? '300vh' : '420vh', background: MID, position: 'relative' };
    const procGridStyle = { maxWidth: '1360px', margin: '0 auto', padding: mob ? '0 24px' : '0 40px', width: '100%', display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1fr', gap: mob ? '36px' : '80px', alignItems: 'center' };
    const contactGridStyle = { maxWidth: '1360px', margin: '0 auto', padding: mob ? '0 24px' : '0 40px', display: 'grid', gridTemplateColumns: mob ? '1fr' : '1fr 1.2fr', gap: mob ? '44px' : '80px' };

    return (
      <div dir={dir} lang={lang} style={{ fontFamily: isAr ? "var(--font-ibm-plex-sans-arabic), 'Noto Sans Arabic', Tahoma, Arial, sans-serif" : "var(--font-manrope), sans-serif", color: '#0B1320', direction: dir }}>
        {showIntro && !rm && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#0B1320', display: 'grid', placeItems: 'center', pointerEvents: 'none', animation: 'bt-intro-out 2s cubic-bezier(.2,.8,.2,1) forwards' }}>
            <svg viewBox="14 8 100 100" width={96} height={96}>
              <rect x="82" y="18" width="22" height="46" fill="#FFFFFF" style={{ clipPath: 'polygon(0 0,100% 0,100% 67%,32% 100%,0 100%)', animation: 'bt-in-1 2s cubic-bezier(.2,.8,.2,1) both' }} />
              <rect x="24" y="18" width="80" height="22" fill="#FFFFFF" style={{ animation: 'bt-in-2 2s cubic-bezier(.2,.8,.2,1) both' }} />
              <rect x="24" y="18" width="22" height="80" fill="#FFFFFF" style={{ animation: 'bt-in-3 2s cubic-bezier(.2,.8,.2,1) both' }} />
              <rect x="24" y="76" width="46" height="22" fill="#FFFFFF" style={{ animation: 'bt-in-4 2s cubic-bezier(.2,.8,.2,1) both' }} />
              <rect x="81" y="75" width="23" height="23" fill="#3D7BFF" style={{ animation: 'bt-in-5 2s cubic-bezier(.2,.8,.2,1) both', transformBox: 'fill-box', transformOrigin: 'center' }} />
            </svg>
          </div>
        )}

        <header>
          <nav style={navStyle}>
            <div style={navInnerStyle}>
              <a href={homeHref} style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '0 0 auto' }} aria-label="byldTEK">
                <LogoMark ink={navInk} size={24} />
                <span style={{ fontSize: '16px', color: navInk }}><span style={{ fontWeight: 400 }}>byld</span><span style={{ fontWeight: 800 }}>TEK</span></span>
              </a>
              <div style={navLinksStyle}>
                <a href="#capabilities">{copy.navCapabilities}</a>
                <a href="#about">{copy.navApproach}</a>
                <a href="#work">{copy.navWork}</a>
                <a href="#experience">{copy.navExperience}</a>
                <span style={{ width: '1px', height: '20px', background: navBorder, opacity: 0.75 }} />
                <a href={otherLangHref} hrefLang={otherLang} onClick={() => this.rememberLang(otherLang)} className="mono lang-switch" style={{ fontSize: '11px' }}>{copy.langSwitch}</a>
                <a className="nav-contact" href="#contact">{copy.navContact}</a>
              </div>
              <button
                type="button"
                onClick={this.toggleMenu}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={isAr ? 'القائمة' : 'Menu'}
                style={{ ...menuBtnStyle, background: 'none', border: 'none' }}
              >
                <div style={{ width: '22px', height: '2px', background: navInk }} />
                <div style={{ width: '14px', height: '2px', background: navInk }} />
              </button>
            </div>
          </nav>
        </header>

        {menuOpen && (
          <div id="mobile-menu" style={{ position: 'fixed', inset: 0, zIndex: 60, background: '#0B1320', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px', direction: dir }}>
            <button type="button" onClick={this.toggleMenu} aria-label={copy.close} className="mono" style={{ position: 'absolute', top: '24px', insetInlineEnd: '24px', fontSize: '12px', color: '#9BA6BC', padding: '12px', cursor: 'pointer', background: 'none', border: 'none' }}>{copy.close} ✕</button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <a href="#capabilities" onClick={this.toggleMenu} style={{ fontSize: '40px', fontWeight: 800, color: '#fff' }}>{copy.navCapabilities}</a>
              <a href="#about" onClick={this.toggleMenu} style={{ fontSize: '40px', fontWeight: 800, color: '#fff' }}>{copy.navApproach}</a>
              <a href="#work" onClick={this.toggleMenu} style={{ fontSize: '40px', fontWeight: 800, color: '#fff' }}>{copy.navWork}</a>
              <a href="#experience" onClick={this.toggleMenu} style={{ fontSize: '40px', fontWeight: 800, color: '#fff' }}>{copy.navExperience}</a>
              <a href="#contact" onClick={this.toggleMenu} style={{ fontSize: '40px', fontWeight: 800, color: '#fff' }}>{copy.navContact}<span style={{ display: 'inline-block', width: '0.14em', height: '0.14em', background: '#3D7BFF', marginInlineStart: '0.1em' }} /></a>
            </div>
            <a href={otherLangHref} hrefLang={otherLang} onClick={() => this.rememberLang(otherLang)} className="mono lang-switch" style={{ fontSize: '12px', color: '#9BA6BC', marginTop: '40px', alignSelf: 'flex-start' }}>{copy.langSwitchLong}</a>
          </div>
        )}

        <main>
        {/* HERO */}
        <section ref={(el) => { this.hero = el; }} style={{ minHeight: '100vh', background: '#0B1320', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
          <div style={heroFieldStyle}>
            {heroBlocks.map((st, i) => <div key={i} style={st} />)}
          </div>
          <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '120px 40px 80px', position: 'relative', width: '100%' }}>
            <div className="mono" style={{ fontSize: '11px', letterSpacing: '0.24em', color: '#8290A6', animation: 'bt-rise .8s 1.7s cubic-bezier(.2,.8,.2,1) both' }}>{copy.heroKicker}</div>
            <h1 style={{ fontSize: 'clamp(48px,7.2vw,104px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', lineHeight: 0.98, margin: '26px 0 0', maxWidth: '900px', animation: 'bt-rise .8s 1.85s cubic-bezier(.2,.8,.2,1) both' }}>
              {copy.heroLine1}<br />{copy.heroLine2}<span style={heroDotStyle} />
            </h1>
            <p style={{ fontSize: '18px', lineHeight: 1.65, color: '#9BA6BC', maxWidth: '520px', margin: '30px 0 0', animation: 'bt-rise .8s 2s cubic-bezier(.2,.8,.2,1) both' }}>{copy.heroBody}</p>
            <div style={heroCtaStyle}>
              <a href="#contact" style={{ background: '#3D7BFF', color: '#fff', fontSize: '14.5px', fontWeight: 700, padding: '15px 26px', borderRadius: '3px', textAlign: 'center' }}>{copy.contactTitle}</a>
              <a className="resolve-link" href="#work" style={{ border: '1px solid #2A3650', color: '#fff', fontSize: '14.5px', fontWeight: 600, padding: '15px 26px', borderRadius: '3px', textAlign: 'center' }}>{copy.heroSecondary}</a>
            </div>
          </div>
          <div className="mono" style={{ position: 'absolute', bottom: '26px', left: '40px', fontSize: '10px', letterSpacing: '0.22em', color: '#8290A6' }}>{copy.scroll}</div>
        </section>

        {/* CAPABILITIES */}
        <section id="capabilities" ref={(el) => { this.capEl = el; }} style={capSectionStyle}>
          <div style={capStickyStyle}>
            <div className="mono" style={{ fontSize: '11px', letterSpacing: '0.24em', color: '#5C6B78' }}>{copy.capKicker}</div>
            <h2 style={capHeadingStyle}>{copy.capHeading}</h2>
            <div style={capGridStyle}>
              <div style={capCopyWrapStyle}>
                {CAPDATA.map((c, i) => {
                  const active = i === cap;
                  const rowStyle = mob
                    ? { position: active ? 'relative' : 'absolute', inset: active ? 'auto' : '0 auto auto 0', width: '100%', padding: 0, borderBottom: 'none', background: 'transparent', opacity: active ? 1 : 0, transform: active ? 'translateY(0)' : 'translateY(14px)', pointerEvents: active ? 'auto' : 'none', transition: rm ? 'none' : `opacity .32s ${EASE}, transform .42s ${EASE}` }
                    : { padding: 'clamp(8px, 2.2vh, 22px) 0', borderBottom: '1px solid #DDE4EA', background: 'transparent' };
                  const descStyle = mob
                    ? { fontSize: '13.5px', color: '#5C6B78', lineHeight: 1.55, maxWidth: '330px', marginTop: '8px' }
                    : { fontSize: '13px', color: '#5C6B78', lineHeight: 1.6, maxWidth: '380px', overflow: 'hidden', maxHeight: active ? '60px' : '0px', opacity: active ? 1 : 0, marginTop: active ? '8px' : '0px', transition: rm ? 'none' : 'all .4s ' + EASE };
                  return (
                    <div key={i} style={rowStyle}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '18px' }}>
                        <span className="mono" style={{ fontSize: '11px', color: active ? '#2456C4' : '#8C9AA6' }}>{'0' + (i + 1)}</span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: mob ? 'clamp(25px,7.2vw,34px)' : active ? 'clamp(20px,3.2vh,30px)' : 'clamp(15px,2.4vh,22px)', fontWeight: 800, letterSpacing: '-0.02em', color: active ? MID : '#7A8894', transition: `all .35s ${EASE}` }}>{c.name}</div>
                          <div style={descStyle}>{c.desc}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={capCanvasWrapStyle}>
                <div style={capCanvasStyle}>
                  {capBlocks.map((st, i) => <div key={i} style={st} />)}
                </div>
                <div style={capProgressStyle}>
                  {CAPDATA.map((_, i) => (
                    <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i <= cap ? COBALT : '#CBD4DD', opacity: i === cap ? 1 : i < cap ? 0.55 : 1, transition: rm ? 'none' : `all .35s ${EASE}` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW WE THINK & BUILD */}
        <section id="about" ref={(el) => { this.proc = el; }} style={procSectionStyle}>
          <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
            <div style={procGridStyle}>
              <div>
                <div className="mono" style={{ fontSize: '11px', letterSpacing: '0.24em', color: '#8290A6' }}>{copy.processKicker}</div>
                <div className="mono" style={{ fontSize: '12px', letterSpacing: '0.2em', color: '#3D7BFF', margin: '34px 0 0' }}>{st.num}</div>
                <h2 style={{ fontSize: '56px', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', margin: '10px 0 0', transition: 'opacity .4s' }}>{st.name}</h2>
                <p style={{ fontSize: '16.5px', lineHeight: 1.65, color: '#9BA6BC', maxWidth: '400px', margin: '20px 0 0' }}>{st.desc}</p>
                <div style={{ display: 'flex', gap: '6px', marginTop: '44px' }}>
                  {STAGES.map((_, i) => (
                    <div key={i} style={{ width: i === (rm ? 3 : stage) ? '28px' : '10px', height: '4px', background: i <= (rm ? 3 : stage) ? COBALT : '#2A3650', transition: 'all .4s ' + EASE }} />
                  ))}
                </div>
              </div>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1', maxWidth: '520px', justifySelf: 'end' }}>
                {procLines.map((ln, i) => <div key={i} style={ln} />)}
                {procBlocks.map((b, i) => <div key={i} style={b} />)}
              </div>
            </div>
          </div>
        </section>

        {/* BUNYAN REVEAL */}
        <section id="work" ref={(el) => { this.work = el; }} style={{ background: '#F1F4F7', padding: '130px 0 118px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 40px' }}>
            <div style={workHeadStyle}>
              <div className="mono" style={{ fontSize: '11px', letterSpacing: '0.24em', color: '#5C6B78' }}>{copy.workKicker}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginTop: '18px' }}>
                <h2 style={{ fontSize: '64px', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>{copy.bunyanName}</h2>
              </div>
              <div className="mono" style={{ fontSize: '10.5px', letterSpacing: '0.14em', color: '#5C6B78', margin: '14px 0 0' }}>
                {copy.workMeta} · <span style={{ color: '#2456C4' }}>BETA</span>
              </div>
              <p style={{ fontSize: '18px', lineHeight: 1.6, color: '#5C6B78', maxWidth: '620px', margin: '18px 0 0' }}>{copy.bunyanBody}</p>
            </div>

            <div style={workFrameStyle} className="bunyan-showcase">
              <div className="bunyan-stage-line" />
              <div className="bunyan-gallery" aria-label={copy.bunyanName}>
                {BUNYAN_SHOTS.map((shot, i) => (
                  <figure key={i} className={`bunyan-shot ${shot.cls}`}>
                    <div className="bunyan-shot-index mono">{'0' + (i + 1)}</div>
                    <img src={shot.src} alt={copy[shot.altKey]} loading="lazy" />
                  </figure>
                ))}
              </div>
              <div className="bunyan-meta">
                <span className="mono bunyan-meta-left">{copy.workMeta} · REAL PRODUCT</span>
                <div className="bunyan-meta-right">
                  <span className="mono">BETA</span>
                  <div className="bunyan-resolution" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience" className="v2-exp">
          <div className="v2-exp-inner">
            <div className="v2-exp-grid">
              <div>
                <div className="mono v2-exp-kicker">{copy.expKicker}</div>
                <h2 className="v2-exp-title">{copy.expTitle1}<br />{copy.expTitle2}<span className="v2-res-point" /></h2>
              </div>
              <div>
                <p className="v2-exp-lead">{copy.expLead}</p>
                <p className="v2-exp-copy">{copy.expCopy}</p>
                <div className="v2-sectors">
                  <div className="v2-sector"><span>{copy.sector1}</span></div>
                  <div className="v2-sector"><span>{copy.sector2}</span></div>
                  <div className="v2-sector"><span>{copy.sector3}</span></div>
                  <div className="v2-sector"><span>{copy.sector4}</span></div>
                  <div className="v2-sector"><span>{copy.sector5}</span></div>
                  <div className="v2-sector"><span>{copy.sector6}</span></div>
                </div>
              </div>
            </div>

            <div className="v2-belief">
              <div>
                <div className="mono v2-exp-kicker">{copy.standardKicker}</div>
              </div>
              <div>
                <p className="v2-belief-copy">{copy.standardBody}<span className="v2-res-point" /></p>
                <p className="v2-belief-meta">{copy.standardMeta}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ background: '#0B1320', padding: '130px 0' }}>
          <div style={contactGridStyle}>
            <div>
              <div className="mono" style={{ fontSize: '11px', letterSpacing: '0.24em', color: '#8290A6' }}>{copy.contactKicker}</div>
              <h2 style={{ fontSize: '52px', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.05, margin: '20px 0 0' }}>{copy.contactTitle}<span style={{ display: 'inline-block', width: '0.14em', height: '0.14em', background: '#3D7BFF', marginInlineStart: '0.08em' }} /></h2>
              <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#9BA6BC', maxWidth: '400px', margin: '22px 0 0' }}>{copy.contactBody}</p>
              <div className="v2-contact-channels mono">
                <a href="mailto:hello@byldtek.com">hello@byldtek.com</a>
                <a className="v2-whatsapp" href="https://wa.me/201037022482" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp +20 103 702 2482">
                  <SocialIcon name="whatsapp" />
                  <span>+20 103 702 2482</span>
                </a>
              </div>
            </div>
            <form onSubmit={this.submitContact} aria-busy={contactStatus === 'submitting'}>
              <div className="mono" style={{ fontSize: '10px', letterSpacing: '0.16em', color: '#8290A6', marginBottom: '14px' }}>{copy.contactStep1}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {chipNames.map((name, i) => {
                  const on = chips.includes(i);
                  return (
                    <button
                      key={i}
                      type="button"
                      aria-pressed={on}
                      onClick={() => this.toggleChip(i)}
                      className="mono"
                      style={{ fontSize: '11.5px', letterSpacing: isAr ? '0' : '0.06em', padding: '11px 16px', borderRadius: '3px', cursor: 'pointer', userSelect: 'none', border: on ? '1px solid #3D7BFF' : '1px solid #2A3650', color: on ? '#FFFFFF' : '#9BA6BC', background: on ? 'rgba(61,123,255,0.12)' : 'transparent', transition: rm ? 'none' : 'all .25s ' + EASE }}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
              <div className="mono" style={{ fontSize: '10px', letterSpacing: '0.16em', color: '#8290A6', margin: '30px 0 14px' }}>{copy.contactStep2}</div>
              <textarea
                ref={(el) => { this.ideaRef = el; }}
                name="message"
                required
                minLength={10}
                maxLength={5000}
                placeholder={copy.contactPlaceholder}
                style={{ width: '100%', background: '#142330', border: '1px solid #2A3650', borderRadius: '4px', padding: '18px 20px', minHeight: '110px', fontSize: '14px', color: '#E7ECF2', fontFamily: 'inherit', resize: 'vertical' }}
              />
              <label htmlFor="contact-email" className="mono" style={{ display: 'block', fontSize: '10px', letterSpacing: '0.16em', color: '#8290A6', margin: '24px 0 14px' }}>{copy.contactEmailLabel}</label>
              <input
                id="contact-email"
                ref={(el) => { this.emailRef = el; }}
                type="email"
                required
                name="email"
                autoComplete="email"
                dir="ltr"
                placeholder={copy.contactEmailPlaceholder}
                style={{ width: '100%', background: '#142330', border: '1px solid #2A3650', borderRadius: '4px', padding: '15px 20px', fontSize: '14px', color: '#E7ECF2', fontFamily: 'inherit' }}
              />
              <label className="sr-only" aria-hidden="true">
                Website
                <input ref={(el) => { this.websiteRef = el; }} name="website" tabIndex="-1" autoComplete="off" />
              </label>
              {TURNSTILE_SITE_KEY && (
                <div ref={(el) => { this.turnstileEl = el; }} style={{ marginTop: '20px' }} />
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '24px' }}>
                <button type="submit" disabled={contactStatus === 'submitting'} style={{ background: '#3D7BFF', color: '#fff', fontSize: '14.5px', fontWeight: 700, padding: '15px 28px', borderRadius: '3px', cursor: contactStatus === 'submitting' ? 'wait' : 'pointer', border: 'none', opacity: contactStatus === 'submitting' ? 0.7 : 1 }}>{contactStatus === 'submitting' ? copy.contactSending : copy.contactButton}</button>
                <span className="mono" style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#8290A6' }}>{chipSummary}</span>
              </div>
              <p role="status" aria-live="polite" className={`v2-contact-status ${contactStatus}`}>{contactMessage}</p>
              <p className="v2-privacy-note">{copy.contactPrivacyPrefix} <button type="button" onClick={this.openPrivacy}>{copy.privacy}</button> {copy.contactPrivacyTail}</p>
            </form>
          </div>
        </section>
        </main>

        <footer className="v2-footer">
          <div className="v2-footer-inner">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <LogoMark ink="#FFFFFF" size={24} />
                <span style={{ fontSize: '16px' }}><span style={{ fontWeight: 400 }}>byld</span><span style={{ fontWeight: 800 }}>TEK</span></span>
              </div>
              <div className="mono" style={{ fontSize: '9px', letterSpacing: '0.16em', color: '#8290A6', marginTop: '16px' }}>{copy.footerTagline}</div>
              <a href="mailto:hello@byldtek.com" className="resolve-link mono" style={{ display: 'inline-block', marginTop: '24px', color: '#B5C0D0', fontSize: '11px' }}>hello@byldtek.com</a>
            </div>

            <div>
              <div className="mono v2-footer-group-title">{copy.footerExplore}</div>
              <div className="v2-footer-nav mono">
                <a className="resolve-link" href="#capabilities">{copy.navCapabilities}</a>
                <a className="resolve-link" href="#about">{copy.navApproach}</a>
                <a className="resolve-link" href="#work">{copy.navWork}</a>
                <a className="resolve-link" href="#experience">{copy.navExperience}</a>
                <a className="resolve-link" href="#contact">{copy.navContact}</a>
              </div>
            </div>

            <div>
              <div className="mono v2-footer-group-title">{copy.footerConnect}</div>
              <div className="v2-social-grid mono">
                <a href="https://www.linkedin.com/company/byldtek/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn"><SocialIcon name="linkedin" /><span className="sr-only">LinkedIn</span></a>
                <a href="https://github.com/byldtek" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub"><SocialIcon name="github" /><span className="sr-only">GitHub</span></a>
                <a href="https://x.com/byldtek" target="_blank" rel="noopener noreferrer" aria-label="X" title="X"><SocialIcon name="x" /><span className="sr-only">X</span></a>
                <a href="https://www.instagram.com/byldtek/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram"><SocialIcon name="instagram" /><span className="sr-only">Instagram</span></a>
                <a href="https://www.facebook.com/byldtek" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook"><SocialIcon name="facebook" /><span className="sr-only">Facebook</span></a>
                <a href="https://www.threads.net/@byldtek" target="_blank" rel="noopener noreferrer" aria-label="Threads" title="Threads"><SocialIcon name="threads" /><span className="sr-only">Threads</span></a>
                <a href="https://www.youtube.com/@byldtek" target="_blank" rel="noopener noreferrer" aria-label="YouTube" title="YouTube"><SocialIcon name="youtube" /><span className="sr-only">YouTube</span></a>
                <a href="https://www.tiktok.com/@byldtek" target="_blank" rel="noopener noreferrer" aria-label="TikTok" title="TikTok"><SocialIcon name="tiktok" /><span className="sr-only">TikTok</span></a>
                <a href="https://wa.me/201037022482" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="WhatsApp"><SocialIcon name="whatsapp" /><span className="sr-only">WhatsApp</span></a>
              </div>
              <div className="v2-legal-links mono">
                <button type="button" onClick={this.openPrivacy}>{copy.privacy}</button>
                <button type="button" onClick={this.openTerms}>{copy.terms}</button>
              </div>
            </div>
          </div>
          <div className="v2-footer-bottom mono">
            <span>© 2026 byldTEK. {copy.rights}</span>
            <span>{copy.footerSlogan}</span>
          </div>
        </footer>

        {TURNSTILE_SITE_KEY && (
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            strategy="afterInteractive"
            onReady={this.renderTurnstile}
            onError={() => this.setState({ contactStatus: 'error', contactMessage: copy.contactUnavailable })}
          />
        )}

        {legalOpen && (
          <div className="v2-legal-backdrop" onClick={this.closeLegal} role="presentation">
            <div ref={(el) => { this.legalPanelEl = el; }} className="v2-legal-panel" onClick={this.stopLegalClick} role="dialog" aria-modal="true" aria-label={legalDoc.title}>
              <div className="v2-legal-head">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <LogoMark ink="#0B1320" size={20} />
                  <span style={{ fontSize: '14px' }}><span style={{ fontWeight: 400 }}>byld</span><span style={{ fontWeight: 800 }}>TEK</span></span>
                </div>
                <button ref={(el) => { this.legalCloseEl = el; }} className="mono v2-legal-close" onClick={this.closeLegal}>{copy.legalClose} ✕</button>
              </div>
              <div className="v2-legal-body">
                <div className="mono v2-legal-meta">{copy.lastUpdated} · {legalDoc.updated}</div>
                <h2 className="v2-legal-title">{legalDoc.title}<span className="v2-res-point" /></h2>
                <p className="v2-legal-intro">{legalDoc.intro}</p>
                {legalDoc.sections.map((sec, i) => (
                  <section key={i} className="v2-legal-section">
                    <h3>{sec.title}</h3>
                    <p>{sec.body}</p>
                  </section>
                ))}
                <div className="v2-legal-section">
                  <h3>{copy.legalContactTitle}</h3>
                  <p>{copy.legalContactBody} hello@byldtek.com</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
