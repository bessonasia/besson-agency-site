const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const lerp = (a, b, t) => a + (b - a) * t;

const I18N = {
  ru: {
	    navAbout: "Об агентстве",
	    navWork: "Проекты",
	    navNews: "Новости",
	    navVacancies: "Вакансии",
	    navContact: "Контакты",
    estimate30: "Смета за 30 минут",
    ctaStart: "Начать проект",
    ctaStartAria: "Начать проект - перейти к блоку Как мы работаем",
    project: "Проект",
    projectMeta: "Креатив / Event",
    langAria: "Язык сайта",
    menuOpen: "Открыть меню",
    burgerOpen: "Открыть меню",
    aboutText: "Мы создаем яркие концепции для мероприятий и бренд-активаций, организуем маркетинговые и корпоративные события. Производим POS материалы, реализуем BTL-проекты и усиливаем бренды через продуманные коммуникации.",
	    resourcesKicker: "Преимущества и",
	    resourcesTitle: "Ресурсы",
	    resourcesAria: "Ресурсы агентства",
	    resourcesUpTo: "до",
	    resourcesSincePrefix: "С",
	    resourcesSinceAfter: "года",
	    resourcesSinceText: "обслуживаем крупный международный бизнес",
	    resourcesLegalOffices: "Офиса в ЕВРАЗИИ\n(Россия, Казахстан, Узбекистан)",
	    resourcesLegalOfficesMain: "ОФИСА",
	    resourcesLegalOfficesRegion: "В ЕВРАЗИИ",
	    resourcesLegalOfficesCountries: "(Россия, Казахстан, Узбекистан)",
	    resourcesAccountManagers: "Аккаунт менеджеров с опытом работы от пяти лет с международным бизнесом",
	    resourcesCredit: "Кредитуем проекты на срок до 60 календарных дней",
	    resourcesMechanics: "Креативных промо механик",
	    resourcesAnnualProjects: "Ежегодных проектов",
	    resourcesPromoters: "Опытных промоутеров в базе",
	    resourcesRepresentatives: "Региональных представителей в крупных городах Центральной Азии",
	    resourcesHappyClients: "Благодарных клиентов",
    globeTitle: "Одно окно в Евразию",
    globeSub: "Три офиса обслуживания",
    clientsKicker: "Наши клиенты",
    clientsTitle: "Компании, которые нам доверяют",
    clientsAria: "Логотипы клиентов",
    reviewsKicker: "Видео отзывы",
    reviewsTitle: "Клиенты о нас",
    reviewsLead: "Коротко. По делу. Без рекламной пены.",
    reviewsOpen: "Открыть видео-отзыв",
    reviewsTabs: "Выбор отзыва",
    reviewLead0: "Съемки, логистика, дисциплина. Без суеты.",
    reviewQuote0: "\"Команда держит процесс: спокойно, точно, вовремя.\"",
    reviewMeta0: "Brand Manager - Nestle",
    reviewLead1: "Премиальная подача и контроль деталей.",
    reviewQuote1: "\"Редкий уровень ответственности и вкуса.\"",
    reviewMeta1: "Marketing Lead - Beiersdorf",
    reviewLead2: "Когда важно без нервов и хаоса.",
    reviewQuote2: "\"Сильная режиссура процесса: все под контролем.\"",
    reviewMeta2: "Head of Trade - METRO",
    teamAria: "Команда Besson Agency",
    teamKicker: "КОМАНДА",
    teamTitle: "Люди, которые делают результат",
    teamControls: "Навигация по карточкам команды",
    teamPrev: "Предыдущий сотрудник",
    teamNext: "Следующий сотрудник",
    teamList: "Список сотрудников",
    teamPager: "Пагинация по сотрудникам",
    teamShow: "Показать сотрудника",
    portraitAlt: "Портрет сотрудника",
    roleFounder: "Основатель / Генеральный директор",
    roleBranch: "Директор филиала",
    roleManaging: "Управляющий директор",
    roleAccountant: "Главный бухгалтер",
    roleAccount: "Аккаунт менеджер",
    roleArtDirector: "Арт директор",
    roleDesigner: "Старший дизайнер",
    cityMoscow: "Москва",
    cityTashkent: "Ташкент",
    cityAlmaty: "Алматы",
    officeWord: "офис",
    countryRussia: "Россия",
    countryUzbekistan: "Узбекистан",
    countryKazakhstan: "Казахстан",
    howKicker: "Процесс · 5 этапов",
    howTitle: "Как мы работаем",
    howStage: "Этап",
    how01: "Бриф",
    how01Text: "Собираем вводные, изучаем цели, ограничения и критерии успеха",
    how02: "Концепция",
    how02Text: "Ищем идею и создаем концепцию, которая удержит внимание",
    how03: "Подготовка",
    how03Text: "Смета, команда, график работ, контроль рисков и качества",
    how04: "Реализация",
    how04Text: "Контролируем процессы в день Х: тайминг, риски, качество",
    how05: "Отчет",
    how05Text: "Финализация, отчетные документы, NPS и обратная связь для улучшения",
    projectStartKicker: "Финальный шаг",
    projectStartTitle: "Готовы начать проект?",
    projectStartButton: "К форме",
    projectStartArrowAria: "Прокрутить к форме",
    contactTitle: "Начать проект",
    contactSub: "Короткая заявка в 4 шага. Документы - по желанию.",
    formAria: "Форма начала проекта",
    stepsAria: "Шаги",
    nameLabel: "Имя",
    namePlaceholder: "Ваше имя",
    nameHint: "Как к вам обращаться?",
    emailHint: "Туда пришлем уточнения и тайминг.",
    phoneLabel: "Телефон",
    phoneHint: "Выберите страну и введите номер.",
    countrySearch: "Страна или код",
    close: "Закрыть",
    docsLabel: "Бриф или тендерные документы",
    docsHint: "PDF / DOCX / ZIP до 50MB",
    attach: "Прикрепить",
    noDocs: "Документов нет",
    docsStepHint: "К заявке можно прикрепить бриф или тендерные документы",
    docsNotice: "К заявке можно прикрепить бриф или тендерные документы",
    continue: "Продолжить",
    submit: "Отправить",
    back: "Назад",
    success: "Уже собираем Ваш проект",
    statusSending: "Отправляем заявку...",
    statusUploading: "Загружаем документ...",
    statusEmail: "Отправляем заявку на почту...",
    statusUploadServer: "Документ можно загрузить только через сайт на сервере. Откройте сайт через домен или localhost с PHP.",
    statusUploadFail: "Не удалось загрузить документ на сервер.",
    statusNoLink: "Сервер загрузки не вернул ссылку на документ.",
    statusSendError: "Ошибка отправки. Проверьте соединение и повторите.",
    fileTooLarge: "Слишком большой файл. Максимум 50MB",
	    officesTitle: "Наши офисы",
	    officesSub: "Россия · Казахстан · Узбекистан",
	    workSwitchKicker: "Реализованные проекты",
	    newsKicker: "Новости",
	    newsTitle: "Новости агентства",
	    newsAll: "Смотреть все",
	    newsSave: "Сохранить новость",
	    newsClose: "Закрыть новость",
	    newsTime0: "15 мин назад",
	    newsTime1: "41 мин назад",
	    newsTime2: "1 час назад",
	    newsTime3: "2 часа назад",
	    newsTime4: "3 часа назад",
	    newsTime5: "5 часов назад",
	    newsTitle0: "Новый формат бренд-активаций для торговых сетей",
	    newsTitle1: "Промо-команды в регионах: скорость запуска и контроль качества",
	    newsTitle2: "Как мы собираем event-производство под ключ",
	    newsTitle3: "Как бриф превращается в рабочую механику проекта",
	    newsTitle4: "Почему тайминг решает качество большого события",
	    newsTitle5: "Региональная команда как преимущество для бренда",
	    newsText0: "Коротко показываем, как BTL и event-механики соединяются в цельный маршрут клиента: от первой идеи до отчета после проекта.",
	    newsText1: "Региональная сеть помогает запускать промо быстро и держать единый стандарт качества в городах Центральной Азии.",
	    newsText2: "Команда, смета, площадка, логистика и режиссура процесса собираются в одну производственную систему без лишнего шума.",
	    newsText3: "Рассказываем, как вводные клиента превращаются в сценарий, смету, команду и понятный план запуска.",
	    newsText4: "В больших событиях качество держится на темпе, логистике, сценарии и управлении рисками в реальном времени.",
	    newsText5: "Локальные команды помогают брендам быстрее запускать активности и сохранять единый стандарт в разных городах.",
	    workFilterAria: "Фильтр проектов",
	    workEvent: "EVENT",
	    workBtl: "BTL",
	    projectEventMeta: "Event / Production",
	    projectBtlMeta: "BTL / Activation",
    officeOpen: "Открыто",
    officeHint: "Нажмите, чтобы раскрыть",
    officeMap: "Карта",
    writeTo: "Написать в",
    contactPill: "СВЯЗАТЬСЯ",
    contactsModalKicker: "Контакты",
    contactsModalTitleTop: "Связаться",
    contactsModalTitleBottom: "с нами",
    contactsForContractors: "Для партнеров",
    contactsForClients: "Для клиентов",
    requisites: "Реквизиты филиала",
    reqMoscow: "Реквизиты московского юридического лица: карточку компании отправим по запросу на почту клиента.",
    reqAlmaty: "Реквизиты юридического лица в Алматы: карточку компании отправим по запросу на почту клиента.",
    reqTashkent: "Реквизиты юридического лица в Ташкенте: карточку компании отправим по запросу на почту клиента.",
    modalClose: "Закрыть форму",
    legalAria: "Согласия",
    personalConsentPrefix: "Согласен на обработку персональных данных по",
    personalConsentDoc: "согласию",
    personalConsentMiddle: "и ознакомлен с",
    privacyPolicy: "политикой конфиденциальности",
    marketingConsentPrefix: "Согласен получать рекламные и информационные сообщения по отдельному согласию.",
    marketingConsentMore: "Подробнее",
    personalConsentRequired: "Подтвердите согласие на обработку персональных данных.",
    cookieTitle: "Cookies",
    cookieText: "Мы используем cookies для работы сайта и аналитики. Подробнее - в",
    cookieAnd: "и",
    cookiePolicy: "политике cookies",
    cookieAccept: "Принять",
    cookieReject: "Отклонить",
  },
	  en: {
	    navAbout: "About",
	    navWork: "Projects",
	    navNews: "News",
	    navVacancies: "Vacancies",
	    navContact: "Contacts",
    estimate30: "Estimate in 30 min",
    ctaStart: "Start project",
    ctaStartAria: "Start project - go to How we work",
    project: "Project",
    projectMeta: "Creative / Event",
    langAria: "Site language",
    menuOpen: "Open menu",
    burgerOpen: "Open menu",
    aboutText: "We create vivid concepts for events and brand activations, organize marketing and corporate experiences, produce POS materials, deliver BTL projects, and strengthen brands through thoughtful communications.",
	    resourcesKicker: "Advantages and",
	    resourcesTitle: "Resources",
	    resourcesAria: "Agency resources",
	    resourcesUpTo: "up to",
	    resourcesSincePrefix: "Since",
	    resourcesSinceAfter: "",
	    resourcesSinceText: "serving major international business",
	    resourcesLegalOffices: "Offices in EURASIA\n(Russia, Kazakhstan, Uzbekistan)",
	    resourcesLegalOfficesMain: "OFFICES",
	    resourcesLegalOfficesRegion: "IN EURASIA",
	    resourcesLegalOfficesCountries: "(Russia, Kazakhstan, Uzbekistan)",
	    resourcesAccountManagers: "Account managers with 5+ years of experience with international business",
	    resourcesCredit: "We can credit projects for up to 60 calendar days",
    resourcesMechanics: "Creative promo mechanics",
    resourcesAnnualProjects: "Annual projects",
    resourcesPromoters: "Experienced promoters in the database",
    resourcesRepresentatives: "Regional representatives in major Central Asian cities",
    resourcesHappyClients: "Grateful clients",
    globeTitle: "One window to Eurasia",
    globeSub: "Three service offices",
    clientsKicker: "Our clients",
    clientsTitle: "Companies that trust us",
    clientsAria: "Client logos",
    reviewsKicker: "Video testimonials",
    reviewsTitle: "Clients about us",
    reviewsLead: "Short. Clear. No marketing noise.",
    reviewsOpen: "Open video testimonial",
    reviewsTabs: "Choose testimonial",
    reviewLead0: "Production, logistics, discipline. No fuss.",
    reviewQuote0: "\"The team keeps the process calm, precise, and on time.\"",
    reviewMeta0: "Brand Manager - Nestle",
    reviewLead1: "Premium delivery and attention to detail.",
    reviewQuote1: "\"A rare level of responsibility and taste.\"",
    reviewMeta1: "Marketing Lead - Beiersdorf",
    reviewLead2: "When it matters to avoid stress and chaos.",
    reviewQuote2: "\"Strong direction of the process: everything is under control.\"",
    reviewMeta2: "Head of Trade - METRO",
    teamAria: "Besson Agency team",
    teamKicker: "TEAM",
    teamTitle: "People who deliver results",
    teamControls: "Team card navigation",
    teamPrev: "Previous team member",
    teamNext: "Next team member",
    teamList: "Team members list",
    teamPager: "Team pagination",
    teamShow: "Show team member",
    portraitAlt: "Team member portrait",
    roleFounder: "Founder / CEO",
    roleBranch: "Branch Director",
    roleManaging: "Managing Director",
    roleAccountant: "Chief Accountant",
    roleAccount: "Account Manager",
    roleArtDirector: "Art Director",
    roleDesigner: "Senior Designer",
    cityMoscow: "Moscow",
    cityTashkent: "Tashkent",
    cityAlmaty: "Almaty",
    officeWord: "Office",
    countryRussia: "Russia",
    countryUzbekistan: "Uzbekistan",
    countryKazakhstan: "Kazakhstan",
    howKicker: "Process · 5 stages",
    howTitle: "How we work",
    howStage: "Stage",
    how01: "Brief",
    how01Text: "We collect inputs and study goals, constraints, and success criteria",
    how02: "Concept",
    how02Text: "We find the idea and create a concept that holds attention",
    how03: "Preparation",
    how03Text: "Budget, team, work schedule, risk and quality control",
    how04: "Delivery",
    how04Text: "We control processes on day X: timing, risks, quality",
    how05: "Report",
    how05Text: "Finalization, reporting documents, NPS and feedback for improvement",
    projectStartKicker: "Final step",
    projectStartTitle: "Ready to start a project?",
    projectStartButton: "To the form",
    projectStartArrowAria: "Scroll to the form",
    contactTitle: "Start a project",
    contactSub: "A short 4-step request. Documents are optional.",
    formAria: "Start project form",
    stepsAria: "Steps",
    nameLabel: "Name",
    namePlaceholder: "Your name",
    nameHint: "How should we address you?",
    emailHint: "We will send clarifications and timing there.",
    phoneLabel: "Phone",
    phoneHint: "Choose a country and enter your number.",
    countrySearch: "Country or code",
    close: "Close",
    docsLabel: "Brief or tender documents",
    docsHint: "PDF / DOCX / ZIP up to 50MB",
    attach: "Attach",
    noDocs: "No documents",
    docsStepHint: "You can attach a brief or tender documents to the request",
    docsNotice: "You can attach a brief or tender documents to the request",
    continue: "Continue",
    submit: "Submit",
    back: "Back",
    success: "We are already assembling your project",
    statusSending: "Sending request...",
    statusUploading: "Uploading document...",
    statusEmail: "Sending request to email...",
    statusUploadServer: "Documents can be uploaded only through the server version of the site. Open the site via the domain or localhost with PHP.",
    statusUploadFail: "Could not upload the document to the server.",
    statusNoLink: "The upload server did not return a document link.",
    statusSendError: "Sending failed. Check the connection and try again.",
    fileTooLarge: "File is too large. Maximum 50MB",
	    officesTitle: "Our offices",
	    officesSub: "Russia · Kazakhstan · Uzbekistan",
	    workSwitchKicker: "Completed projects",
	    newsKicker: "News",
	    newsTitle: "Agency news",
	    newsAll: "View all",
	    newsSave: "Save news",
	    newsClose: "Close news",
	    newsTime0: "15 min ago",
	    newsTime1: "41 min ago",
	    newsTime2: "1 hour ago",
	    newsTime3: "2 hours ago",
	    newsTime4: "3 hours ago",
	    newsTime5: "5 hours ago",
	    newsTitle0: "A new format for retail brand activations",
	    newsTitle1: "Promo teams in regions: launch speed and quality control",
	    newsTitle2: "How we build turnkey event production",
	    newsTitle3: "How a brief becomes a working project mechanic",
	    newsTitle4: "Why timing defines the quality of a large event",
	    newsTitle5: "Regional teams as an advantage for the brand",
	    newsText0: "A short look at how BTL and event mechanics become one client journey: from first idea to post-project reporting.",
	    newsText1: "A regional network helps launch promo projects quickly while keeping one quality standard across Central Asian cities.",
	    newsText2: "Team, budget, venue, logistics and production direction come together in one clear operating system.",
	    newsText3: "We show how client inputs become a scenario, budget, team, and a clear launch plan.",
	    newsText4: "Large events depend on pace, logistics, scenario discipline, and real-time risk management.",
	    newsText5: "Local teams help brands launch faster while keeping one standard across cities.",
	    workFilterAria: "Project filter",
	    workEvent: "EVENT",
	    workBtl: "BTL",
	    projectEventMeta: "Event / Production",
	    projectBtlMeta: "BTL / Activation",
    officeOpen: "Open",
    officeHint: "Click to expand",
    officeMap: "Map",
    writeTo: "Message via",
    contactPill: "CONTACT",
    contactsModalKicker: "Contacts",
    contactsModalTitleTop: "Contact",
    contactsModalTitleBottom: "us",
    contactsForContractors: "For partners",
    contactsForClients: "For clients",
    requisites: "Branch details",
    reqMoscow: "Moscow legal entity details: we will send the company card by request.",
    reqAlmaty: "Almaty legal entity details: we will send the company card by request.",
    reqTashkent: "Tashkent legal entity details: we will send the company card by request.",
    modalClose: "Close form",
    legalAria: "Consents",
    personalConsentPrefix: "I consent to personal data processing under the",
    personalConsentDoc: "consent document",
    personalConsentMiddle: "and have read the",
    privacyPolicy: "privacy policy",
    marketingConsentPrefix: "I agree to receive marketing and informational messages under a separate consent.",
    marketingConsentMore: "Details",
    personalConsentRequired: "Please confirm consent to personal data processing.",
    cookieTitle: "Cookies",
    cookieText: "We use cookies for site operation and analytics. Learn more in the",
    cookieAnd: "and",
    cookiePolicy: "cookie policy",
    cookieAccept: "Accept",
    cookieReject: "Reject",
  },
	  uz: {
	    navAbout: "Agentlik haqida",
	    navWork: "Loyihalar",
	    navNews: "Yangiliklar",
	    navVacancies: "Vakansiyalar",
	    navContact: "Kontaktlar",
    estimate30: "30 daqiqada smeta",
    ctaStart: "Loyihani boshlash",
    ctaStartAria: "Loyihani boshlash - Ish jarayoni bo‘limiga o‘tish",
    project: "Loyiha",
    projectMeta: "Kreativ / Event",
    langAria: "Sayt tili",
    menuOpen: "Menyuni ochish",
    burgerOpen: "Menyuni ochish",
    aboutText: "Biz tadbirlar va brend aktivatsiyalari uchun yorqin konsepsiyalar yaratamiz, marketing va korporativ tadbirlarni tashkil qilamiz. POS materiallarni ishlab chiqaramiz, BTL-loyihalarni amalga oshiramiz va puxta kommunikatsiyalar orqali brendlarni kuchaytiramiz.",
	    resourcesKicker: "Afzalliklar",
	    resourcesTitle: "Resurslar",
	    resourcesAria: "Agentlik resurslari",
	    resourcesUpTo: "gacha",
	    resourcesSincePrefix: "",
	    resourcesSinceAfter: "yildan beri",
	    resourcesSinceText: "yirik xalqaro biznesga xizmat qilamiz",
	    resourcesLegalOffices: "YEVROSIYODAGI ofislar\n(Rossiya, Qozog‘iston, O‘zbekiston)",
	    resourcesLegalOfficesMain: "OFISLAR",
	    resourcesLegalOfficesRegion: "YEVROSIYODA",
	    resourcesLegalOfficesCountries: "(Rossiya, Qozog‘iston, O‘zbekiston)",
	    resourcesAccountManagers: "Xalqaro biznes bilan 5+ yillik tajribaga ega akkaunt menejerlar",
	    resourcesCredit: "Loyihalarni 60 kalendar kungacha moliyalashtiramiz",
    resourcesMechanics: "Kreativ promo mexanikalar",
    resourcesAnnualProjects: "Yillik loyihalar",
    resourcesPromoters: "Bazadagi tajribali promouterlar",
    resourcesRepresentatives: "Markaziy Osiyoning yirik shaharlaridagi regional vakillar",
    resourcesHappyClients: "Minnatdor mijozlar",
    globeTitle: "Yevrosiyoga yagona oyna",
    globeSub: "Uchta xizmat ko‘rsatish ofisi",
    clientsKicker: "Mijozlarimiz",
    clientsTitle: "Bizga ishonadigan kompaniyalar",
    clientsAria: "Mijozlar logotiplari",
    reviewsKicker: "Video fikrlar",
    reviewsTitle: "Mijozlar biz haqimizda",
    reviewsLead: "Qisqa. Aniq. Reklama shovqinisiz.",
    reviewsOpen: "Video fikrni ochish",
    reviewsTabs: "Fikrni tanlash",
    reviewLead0: "Suratga olish, logistika, intizom. Ortiqcha shoshilmasdan.",
    reviewQuote0: "\"Jamoa jarayonni xotirjam, aniq va vaqtida olib boradi.\"",
    reviewMeta0: "Brand Manager - Nestle",
    reviewLead1: "Premium taqdimot va detallarga e'tibor.",
    reviewQuote1: "\"Mas'uliyat va didning noyob darajasi.\"",
    reviewMeta1: "Marketing Lead - Beiersdorf",
    reviewLead2: "Asabiylik va tartibsizliksiz ishlash muhim bo‘lganda.",
    reviewQuote2: "\"Jarayon kuchli boshqariladi: hammasi nazorat ostida.\"",
    reviewMeta2: "Head of Trade - METRO",
    teamAria: "Besson Agency jamoasi",
    teamKicker: "JAMOA",
    teamTitle: "Natija yaratadigan insonlar",
    teamControls: "Jamoa kartalari navigatsiyasi",
    teamPrev: "Oldingi xodim",
    teamNext: "Keyingi xodim",
    teamList: "Xodimlar ro‘yxati",
    teamPager: "Xodimlar paginatsiyasi",
    teamShow: "Xodimni ko‘rsatish",
    portraitAlt: "Xodim portreti",
    roleFounder: "Asoschi / Bosh direktor",
    roleBranch: "Filial direktori",
    roleManaging: "Boshqaruvchi direktor",
    roleAccountant: "Bosh buxgalter",
    roleAccount: "Akkount menejer",
    roleArtDirector: "Art direktor",
    roleDesigner: "Katta dizayner",
    cityMoscow: "Moskva",
    cityTashkent: "Toshkent",
    cityAlmaty: "Olmaota",
    officeWord: "Ofis",
    countryRussia: "Rossiya",
    countryUzbekistan: "O‘zbekiston",
    countryKazakhstan: "Qozog‘iston",
    howKicker: "Jarayon · 5 bosqich",
    howTitle: "Biz qanday ishlaymiz",
    howStage: "Bosqich",
    how01: "Brif",
    how01Text: "Kirish ma'lumotlarini yig‘amiz, maqsadlar, cheklovlar va muvaffaqiyat mezonlarini o‘rganamiz",
    how02: "Konsepsiya",
    how02Text: "G‘oyani izlaymiz va e'tiborni ushlab turadigan konsepsiya yaratamiz",
    how03: "Tayyorgarlik",
    how03Text: "Smeta, jamoa, ish grafigi, risk va sifat nazorati",
    how04: "Amalga oshirish",
    how04Text: "Kun X jarayonlarini nazorat qilamiz: timing, risklar, sifat",
    how05: "Hisobot",
    how05Text: "Yakunlash, hisobot hujjatlari, NPS va yaxshilash uchun fikr-mulohaza",
    projectStartKicker: "Yakuniy qadam",
    projectStartTitle: "Loyihani boshlashga tayyormisiz?",
    projectStartButton: "Formaga",
    projectStartArrowAria: "Formaga o‘tish",
    contactTitle: "Loyihani boshlash",
    contactSub: "4 bosqichli qisqa ariza. Hujjatlar ixtiyoriy.",
    formAria: "Loyihani boshlash formasi",
    stepsAria: "Bosqichlar",
    nameLabel: "Ism",
    namePlaceholder: "Ismingiz",
    nameHint: "Sizga qanday murojaat qilaylik?",
    emailHint: "Aniqlashtirish va muddatlarni shu yerga yuboramiz.",
    phoneLabel: "Telefon",
    phoneHint: "Mamlakatni tanlang va raqamingizni kiriting.",
    countrySearch: "Mamlakat yoki kod",
    close: "Yopish",
    docsLabel: "Brif yoki tender hujjatlari",
    docsHint: "PDF / DOCX / ZIP 50MB gacha",
    attach: "Biriktirish",
    noDocs: "Hujjatlar yo‘q",
    docsStepHint: "Arizaga brif yoki tender hujjatlarini biriktirish mumkin",
    docsNotice: "Arizaga brif yoki tender hujjatlarini biriktirish mumkin",
    continue: "Davom etish",
    submit: "Yuborish",
    back: "Orqaga",
    success: "Loyihangizni allaqachon yig‘moqdamiz",
    statusSending: "Ariza yuborilmoqda...",
    statusUploading: "Hujjat yuklanmoqda...",
    statusEmail: "Ariza pochtaga yuborilmoqda...",
    statusUploadServer: "Hujjatni faqat saytning server versiyasi orqali yuklash mumkin. Saytni domen orqali yoki PHP bilan localhostda oching.",
    statusUploadFail: "Hujjatni serverga yuklab bo‘lmadi.",
    statusNoLink: "Yuklash serveri hujjat havolasini qaytarmadi.",
    statusSendError: "Yuborishda xatolik. Ulanishni tekshirib, qayta urinib ko‘ring.",
    fileTooLarge: "Fayl juda katta. Maksimum 50MB",
	    officesTitle: "Bizning ofislar",
	    officesSub: "Rossiya · Qozog‘iston · O‘zbekiston",
	    workSwitchKicker: "Amalga oshirilgan loyihalar",
	    newsKicker: "Yangiliklar",
	    newsTitle: "Agentlik yangiliklari",
	    newsAll: "Hammasini ko‘rish",
	    newsSave: "Yangilikni saqlash",
	    newsClose: "Yangilikni yopish",
	    newsTime0: "15 daqiqa oldin",
	    newsTime1: "41 daqiqa oldin",
	    newsTime2: "1 soat oldin",
	    newsTime3: "2 soat oldin",
	    newsTime4: "3 soat oldin",
	    newsTime5: "5 soat oldin",
	    newsTitle0: "Savdo tarmoqlari uchun yangi brend-aktivatsiya formati",
	    newsTitle1: "Hududiy promo-jamoalar: tez ishga tushirish va sifat nazorati",
	    newsTitle2: "Event ishlab chiqarishni qanday to‘liq yig‘amiz",
	    newsTitle3: "Brif qanday qilib ishchi loyiha mexanikasiga aylanadi",
	    newsTitle4: "Nega timing katta tadbir sifatini belgilaydi",
	    newsTitle5: "Hududiy jamoa brend uchun ustunlik sifatida",
	    newsText0: "BTL va event mexanikalarini bir mijoz yo‘nalishiga qanday birlashtirishimiz haqida qisqa sharh.",
	    newsText1: "Hududiy tarmoq Markaziy Osiyo shaharlarida loyihalarni tez boshlash va yagona sifat standartini saqlashga yordam beradi.",
	    newsText2: "Jamoa, smeta, maydon, logistika va jarayon rejissurasi bitta aniq tizimga yig‘iladi.",
	    newsText3: "Mijoz kiritmalari ssenariy, smeta, jamoa va aniq ishga tushirish rejasiga qanday aylanishini ko‘rsatamiz.",
	    newsText4: "Katta tadbirlar temp, logistika, ssenariy intizomi va risklarni real vaqtda boshqarishga tayanadi.",
	    newsText5: "Mahalliy jamoalar brendlarga tezroq start berish va shaharlarda yagona standartni ushlashga yordam beradi.",
	    workFilterAria: "Loyihalar filtri",
	    workEvent: "EVENT",
	    workBtl: "BTL",
	    projectEventMeta: "Event / Production",
	    projectBtlMeta: "BTL / Activation",
    officeOpen: "Ochiq",
    officeHint: "Ochish uchun bosing",
    officeMap: "Xarita",
    writeTo: "Yozish",
    contactPill: "BOG‘LANISH",
    contactsModalKicker: "Kontaktlar",
    contactsModalTitleTop: "Bog‘lanish",
    contactsModalTitleBottom: "biz bilan",
    contactsForContractors: "Hamkorlar uchun",
    contactsForClients: "Mijozlar uchun",
    requisites: "Filial rekvizitlari",
    reqMoscow: "Moskva yuridik shaxsi rekvizitlari: kompaniya kartasini so‘rov bo‘yicha yuboramiz.",
    reqAlmaty: "Almati yuridik shaxsi rekvizitlari: kompaniya kartasini so‘rov bo‘yicha yuboramiz.",
    reqTashkent: "Toshkent yuridik shaxsi rekvizitlari: kompaniya kartasini so‘rov bo‘yicha yuboramiz.",
    modalClose: "Formani yopish",
    legalAria: "Roziliklar",
    personalConsentPrefix: "Shaxsiy ma'lumotlarni qayta ishlashga",
    personalConsentDoc: "rozilik hujjati",
    personalConsentMiddle: "asosida roziman va",
    privacyPolicy: "maxfiylik siyosati",
    marketingConsentPrefix: "Alohida rozilik asosida marketing va axborot xabarlarini olishga roziman.",
    marketingConsentMore: "Batafsil",
    personalConsentRequired: "Shaxsiy ma'lumotlarni qayta ishlashga rozilikni tasdiqlang.",
    cookieTitle: "Cookies",
    cookieText: "Sayt ishlashi va analitika uchun cookies ishlatamiz. Batafsil:",
    cookieAnd: "va",
    cookiePolicy: "cookies siyosati",
    cookieAccept: "Qabul qilish",
    cookieReject: "Rad etish",
  },
	  kz: {
	    navAbout: "Агенттік туралы",
	    navWork: "Жобалар",
	    navNews: "Жаңалықтар",
	    navVacancies: "Вакансиялар",
	    navContact: "Байланыс",
    estimate30: "30 минутта смета",
    ctaStart: "Жобаны бастау",
    ctaStartAria: "Жобаны бастау - Қалай жұмыс істейміз бөліміне өту",
    project: "Жоба",
    projectMeta: "Креатив / Event",
    langAria: "Сайт тілі",
    menuOpen: "Мәзірді ашу",
    burgerOpen: "Мәзірді ашу",
    aboutText: "Біз іс-шаралар мен бренд-активациялар үшін жарқын концепциялар жасаймыз, маркетингтік және корпоративтік оқиғаларды ұйымдастырамыз. POS материалдарын өндіреміз, BTL-жобаларды іске асырып, ойластырылған коммуникациялар арқылы брендтерді күшейтеміз.",
	    resourcesKicker: "Артықшылықтар",
	    resourcesTitle: "Ресурстар",
	    resourcesAria: "Агенттік ресурстары",
	    resourcesUpTo: "дейін",
	    resourcesSincePrefix: "",
	    resourcesSinceAfter: "жылдан бері",
	    resourcesSinceText: "ірі халықаралық бизнеске қызмет көрсетеміз",
	    resourcesLegalOffices: "ЕУРАЗИЯДАҒЫ кеңселер\n(Ресей, Қазақстан, Өзбекстан)",
	    resourcesLegalOfficesMain: "КЕҢСЕЛЕР",
	    resourcesLegalOfficesRegion: "ЕУРАЗИЯДА",
	    resourcesLegalOfficesCountries: "(Ресей, Қазақстан, Өзбекстан)",
	    resourcesAccountManagers: "Халықаралық бизнеспен 5+ жыл тәжірибесі бар аккаунт менеджерлер",
	    resourcesCredit: "Жобаларды 60 күнтізбелік күнге дейін қаржыландырамыз",
    resourcesMechanics: "Креативті промо механикалар",
    resourcesAnnualProjects: "Жыл сайынғы жобалар",
    resourcesPromoters: "Базадағы тәжірибелі промоутерлер",
    resourcesRepresentatives: "Орталық Азияның ірі қалаларындағы өңірлік өкілдер",
    resourcesHappyClients: "Ризашылық білдірген клиенттер",
    globeTitle: "Еуразияға бір терезе",
    globeSub: "Үш қызмет көрсету кеңсесі",
    clientsKicker: "Біздің клиенттер",
    clientsTitle: "Бізге сенетін компаниялар",
    clientsAria: "Клиенттер логотиптері",
    reviewsKicker: "Видео пікірлер",
    reviewsTitle: "Клиенттер біз туралы",
    reviewsLead: "Қысқа. Нақты. Артық жарнамасыз.",
    reviewsOpen: "Видео пікірді ашу",
    reviewsTabs: "Пікірді таңдау",
    reviewLead0: "Түсірілім, логистика, тәртіп. Артық әбігерсіз.",
    reviewQuote0: "\"Команда процесті сабырлы, дәл және уақытында ұстайды.\"",
    reviewMeta0: "Brand Manager - Nestle",
    reviewLead1: "Премиум ұсыну және детальдарға бақылау.",
    reviewQuote1: "\"Жауапкершілік пен талғамның сирек деңгейі.\"",
    reviewMeta1: "Marketing Lead - Beiersdorf",
    reviewLead2: "Жүйке мен хаоссыз жұмыс істеу маңызды болғанда.",
    reviewQuote2: "\"Процесті мықты басқару: бәрі бақылауда.\"",
    reviewMeta2: "Head of Trade - METRO",
    teamAria: "Besson Agency командасы",
    teamKicker: "КОМАНДА",
    teamTitle: "Нәтиже жасайтын адамдар",
    teamControls: "Команда карточкаларының навигациясы",
    teamPrev: "Алдыңғы қызметкер",
    teamNext: "Келесі қызметкер",
    teamList: "Қызметкерлер тізімі",
    teamPager: "Қызметкерлер пагинациясы",
    teamShow: "Қызметкерді көрсету",
    portraitAlt: "Қызметкер портреті",
    roleFounder: "Құрылтайшы / Бас директор",
    roleBranch: "Филиал директоры",
    roleManaging: "Басқарушы директор",
    roleAccountant: "Бас бухгалтер",
    roleAccount: "Аккаунт менеджер",
    roleArtDirector: "Арт директор",
    roleDesigner: "Аға дизайнер",
    cityMoscow: "Мәскеу",
    cityTashkent: "Ташкент",
    cityAlmaty: "Алматы",
    officeWord: "Кеңсе",
    countryRussia: "Ресей",
    countryUzbekistan: "Өзбекстан",
    countryKazakhstan: "Қазақстан",
    howKicker: "Процесс · 5 кезең",
    howTitle: "Қалай жұмыс істейміз",
    howStage: "Кезең",
    how01: "Бриф",
    how01Text: "Кіріс деректерін жинап, мақсаттарды, шектеулерді және табыс критерийлерін зерттейміз",
    how02: "Концепция",
    how02Text: "Идея іздеп, назарды ұстайтын концепция жасаймыз",
    how03: "Дайындық",
    how03Text: "Смета, команда, жұмыс кестесі, тәуекел және сапа бақылауы",
    how04: "Іске асыру",
    how04Text: "Күн X процестерін бақылаймыз: тайминг, тәуекелдер, сапа",
    how05: "Есеп",
    how05Text: "Қорытындылау, есеп құжаттары, NPS және жақсарту үшін кері байланыс",
    projectStartKicker: "Соңғы қадам",
    projectStartTitle: "Жобаны бастауға дайынсыз ба?",
    projectStartButton: "Формаға",
    projectStartArrowAria: "Формаға өту",
    contactTitle: "Жобаны бастау",
    contactSub: "4 қадамнан тұратын қысқа өтінім. Құжаттар міндетті емес.",
    formAria: "Жобаны бастау формасы",
    stepsAria: "Қадамдар",
    nameLabel: "Аты-жөні",
    namePlaceholder: "Атыңыз",
    nameHint: "Сізге қалай хабарласайық?",
    emailHint: "Нақтылау мен мерзімдерді сол жерге жібереміз.",
    phoneLabel: "Телефон",
    phoneHint: "Елді таңдап, нөміріңізді енгізіңіз.",
    countrySearch: "Ел немесе код",
    close: "Жабу",
    docsLabel: "Бриф немесе тендерлік құжаттар",
    docsHint: "PDF / DOCX / ZIP 50MB дейін",
    attach: "Тіркеу",
    noDocs: "Құжаттар жоқ",
    docsStepHint: "Өтінімге бриф немесе тендерлік құжаттарды тіркеуге болады",
    docsNotice: "Өтінімге бриф немесе тендерлік құжаттарды тіркеуге болады",
    continue: "Жалғастыру",
    submit: "Жіберу",
    back: "Артқа",
    success: "Жобаңызды қазірдің өзінде жинап жатырмыз",
    statusSending: "Өтінім жіберілуде...",
    statusUploading: "Құжат жүктелуде...",
    statusEmail: "Өтінім поштаға жіберілуде...",
    statusUploadServer: "Құжатты тек сайттың серверлік нұсқасы арқылы жүктеуге болады. Сайтты домен арқылы немесе PHP бар localhost-та ашыңыз.",
    statusUploadFail: "Құжатты серверге жүктеу мүмкін болмады.",
    statusNoLink: "Жүктеу сервері құжат сілтемесін қайтармады.",
    statusSendError: "Жіберу қатесі. Қосылымды тексеріп, қайта көріңіз.",
    fileTooLarge: "Файл тым үлкен. Максимум 50MB",
	    officesTitle: "Біздің кеңселер",
	    officesSub: "Ресей · Қазақстан · Өзбекстан",
	    workSwitchKicker: "Іске асқан жобалар",
	    newsKicker: "Жаңалықтар",
	    newsTitle: "Агенттік жаңалықтары",
	    newsAll: "Барлығын көру",
	    newsSave: "Жаңалықты сақтау",
	    newsClose: "Жаңалықты жабу",
	    newsTime0: "15 минут бұрын",
	    newsTime1: "41 минут бұрын",
	    newsTime2: "1 сағат бұрын",
	    newsTime3: "2 сағат бұрын",
	    newsTime4: "3 сағат бұрын",
	    newsTime5: "5 сағат бұрын",
	    newsTitle0: "Сауда желілері үшін бренд-активацияның жаңа форматы",
	    newsTitle1: "Өңірлік промо-командалар: жылдам іске қосу және сапа бақылауы",
	    newsTitle2: "Event өндірісін толық қалай жинаймыз",
	    newsTitle3: "Бриф қалай жұмыс істейтін жоба механикасына айналады",
	    newsTitle4: "Неліктен тайминг үлкен оқиғаның сапасын анықтайды",
	    newsTitle5: "Өңірлік команда бренд үшін артықшылық ретінде",
	    newsText0: "BTL және event механикаларын бір клиенттік маршрутқа қалай біріктіретініміз туралы қысқа шолу.",
	    newsText1: "Өңірлік желі Орталық Азия қалаларында жобаларды жылдам бастап, бір сапа стандартын ұстауға көмектеседі.",
	    newsText2: "Команда, смета, алаң, логистика және процесті режиссуралау бір нақты жүйеге жиналады.",
	    newsText3: "Клиенттің кіріс деректері сценарийге, сметаға, командаға және нақты іске қосу жоспарына қалай айналатынын көрсетеміз.",
	    newsText4: "Үлкен оқиғалар қарқынға, логистикаға, сценарий тәртібіне және тәуекелдерді нақты уақытта басқаруға сүйенеді.",
	    newsText5: "Жергілікті командалар брендтерге тезірек бастауға және қалаларда бір стандартты сақтауға көмектеседі.",
	    workFilterAria: "Жобалар сүзгісі",
	    workEvent: "EVENT",
	    workBtl: "BTL",
	    projectEventMeta: "Event / Production",
	    projectBtlMeta: "BTL / Activation",
    officeOpen: "Ашық",
    officeHint: "Ашу үшін басыңыз",
    officeMap: "Карта",
    writeTo: "Жазу",
    contactPill: "БАЙЛАНЫСУ",
    contactsModalKicker: "Байланыс",
    contactsModalTitleTop: "Байланысу",
    contactsModalTitleBottom: "бізбен",
    contactsForContractors: "Серіктестер үшін",
    contactsForClients: "Клиенттер үшін",
    requisites: "Филиал деректемелері",
    reqMoscow: "Мәскеудегі заңды тұлға деректемелері: компания карточкасын сұрау бойынша жібереміз.",
    reqAlmaty: "Алматыдағы заңды тұлға деректемелері: компания карточкасын сұрау бойынша жібереміз.",
    reqTashkent: "Ташкенттегі заңды тұлға деректемелері: компания карточкасын сұрау бойынша жібереміз.",
    modalClose: "Форманы жабу",
    legalAria: "Келісімдер",
    personalConsentPrefix: "Жеке деректерді өңдеуге",
    personalConsentDoc: "келісім құжаты",
    personalConsentMiddle: "бойынша келісемін және",
    privacyPolicy: "құпиялылық саясатымен",
    marketingConsentPrefix: "Жеке келісім бойынша жарнамалық және ақпараттық хабарламалар алуға келісемін.",
    marketingConsentMore: "Толығырақ",
    personalConsentRequired: "Жеке деректерді өңдеуге келісімді растаңыз.",
    cookieTitle: "Cookies",
    cookieText: "Сайт жұмысы және аналитика үшін cookies пайдаланамыз. Толығырақ:",
    cookieAnd: "және",
    cookiePolicy: "cookies саясатында",
    cookieAccept: "Қабылдау",
    cookieReject: "Бас тарту",
  },
};

let currentLang = "ru";
const tr = (key) => {
  if (I18N[currentLang] && Object.prototype.hasOwnProperty.call(I18N[currentLang], key)) return I18N[currentLang][key];
  if (Object.prototype.hasOwnProperty.call(I18N.ru, key)) return I18N.ru[key];
  return key;
};

const setTextAll = (selector, value) => qsa(selector).forEach((el) => { el.textContent = value; });
const setAttrAll = (selector, attr, value) => qsa(selector).forEach((el) => el.setAttribute(attr, value));
const formatResourceNumber = (value, plain = false) => plain ? String(Math.round(value)) : new Intl.NumberFormat(currentLang === "en" ? "en-US" : "ru-RU", {
  maximumFractionDigits: 0,
}).format(Math.round(value));

function applyTranslations(lang = currentLang) {
  currentLang = I18N[lang] ? lang : "ru";
  document.documentElement.lang = currentLang;
  try { localStorage.setItem("besson_lang", currentLang); } catch (_) {}

  qsa(".lang__btn").forEach((btn) => {
    const active = btn.dataset.lang === currentLang;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
  setTextAll("#langCurrent", currentLang.toUpperCase());

	  setTextAll('[data-nav-about]', tr("navAbout"));
	  setTextAll('[data-nav-work]', tr("navWork"));
	  setTextAll('[data-nav-news]', tr("navNews"));
	  setTextAll('[data-nav-vacancies]', tr("navVacancies"));
	  setTextAll('[data-nav-contact]', tr("navContact"));
  setTextAll("#navEstimateBtn", tr("estimate30"));
  setTextAll(".cta-float-left__label", tr("ctaStart"));
  setAttrAll("#startProjectHowBtn", "aria-label", tr("ctaStartAria"));
  setAttrAll(".lang", "aria-label", tr("langAria"));
  setAttrAll("#desktopMenuTrigger", "aria-label", tr("menuOpen"));
  setAttrAll(".burger", "aria-label", tr("burgerOpen"));

	  setTextAll(".stage__title", tr("aboutText"));
	  setTextAll("#resourcesKicker", tr("resourcesKicker"));
	  setTextAll("#resourcesTitle", tr("resourcesTitle"));
	  setAttrAll(".resources__grid", "aria-label", tr("resourcesAria"));
  qsa("[data-resource-card]").forEach((card) => {
    const prefix = qs(".resource-card__prefix", card);
    const suffix = qs(".resource-card__suffix", card);
    const value = qs("[data-count]", card);
    const preText = qs("[data-resource-prefix-text]", card);
    const afterText = qs("[data-resource-after-text]", card);
    const prefixKey = card.dataset.prefixKey;
    if (prefix) prefix.textContent = prefixKey ? tr(prefixKey) : "";
    if (preText) preText.textContent = tr(preText.dataset.resourcePrefixText);
    if (afterText) afterText.textContent = tr(afterText.dataset.resourceAfterText);
    if (suffix) suffix.textContent = card.dataset.suffix || "";
    if (value && card.dataset.counted === "1") value.textContent = formatResourceNumber(Number(card.dataset.target || 0), card.dataset.format === "plain");
    qsa("[data-resource-text]", card).forEach((el) => { el.textContent = tr(el.dataset.resourceText); });
  });
	  setAttrAll(".work-switch", "aria-label", tr("workFilterAria"));
	  setTextAll("#workSwitchKicker", tr("workSwitchKicker"));
	  setTextAll('[data-work-filter="event"]', tr("workEvent"));
	  setTextAll('[data-work-filter="btl"]', tr("workBtl"));
	  if (typeof window.updateProjectTiles === "function") window.updateProjectTiles();
	  setTextAll("#clientsKicker", tr("clientsKicker"));
  setTextAll("#clientsTitle", tr("clientsTitle"));
  setAttrAll(".logo-marquee", "aria-label", tr("clientsAria"));

  setTextAll(".reviews__kicker", tr("reviewsKicker"));
  setTextAll(".reviews__title", tr("reviewsTitle"));
  if (typeof window.applyReview === "function") window.applyReview(typeof window.getReviewActive === "function" ? window.getReviewActive() : 0);
  else setTextAll("#rvLead", tr("reviewsLead"));
  setAttrAll("#rvOpen", "aria-label", tr("reviewsOpen"));
  setAttrAll(".reviews__tabs", "aria-label", tr("reviewsTabs"));

  setAttrAll("#team", "aria-label", tr("teamAria"));
  setTextAll(".team__kicker", tr("teamKicker"));
  setTextAll(".team__title", tr("teamTitle"));
  setAttrAll(".team__controls", "aria-label", tr("teamControls"));
  setAttrAll("[data-team-prev]", "aria-label", tr("teamPrev"));
  setAttrAll("[data-team-next]", "aria-label", tr("teamNext"));
  setAttrAll("#teamRail", "aria-label", tr("teamList"));
  setAttrAll("#teamDots", "aria-label", tr("teamPager"));
  qsa(".team-dot").forEach((dot, index) => dot.setAttribute("aria-label", `${tr("teamShow")} ${index + 1}`));
  qsa(".team-card__media img").forEach((img) => img.setAttribute("alt", tr("portraitAlt")));

  const roleKeys = ["roleFounder", "roleBranch", "roleManaging", "roleAccountant", "roleAccount", "roleAccount", "roleAccount", "roleAccount", "roleAccount", "roleAccount", "roleDesigner"];
  const cityKeys = ["cityMoscow", "cityTashkent", "cityAlmaty", "cityAlmaty", "cityMoscow", "cityMoscow", "cityAlmaty", "cityAlmaty", "cityTashkent", "cityTashkent", "cityAlmaty"];
  const countryKeys = ["countryRussia", "countryUzbekistan", "countryKazakhstan", "countryKazakhstan", "countryRussia", "countryRussia", "countryKazakhstan", "countryKazakhstan", "countryUzbekistan", "countryUzbekistan", "countryKazakhstan"];
  qsa("#team .team-card").forEach((card, index) => {
    const role = qs(".team-card__role", card);
    if (role) role.textContent = tr(roleKeys[index] || "roleAccount");
    const meta = qsa(".team-card__meta span", card).filter((span) => !span.classList.contains("team-card__dot"));
    if (meta[0]) meta[0].textContent = tr(cityKeys[index] || "cityMoscow");
    if (meta[1]) meta[1].textContent = tr(countryKeys[index] || "countryRussia");
  });
  qsa("#team .team-member-row").forEach((row, index) => {
    const role = qs(".team-member-row__role", row);
    if (role) role.textContent = tr(row.dataset.roleKey || roleKeys[index] || "roleAccount");
  });
  qsa("#team .team-side-photo").forEach((photo) => {
    const img = qs("img", photo);
    const name = qs("figcaption strong", photo);
    const role = qs("figcaption span", photo);
    if (img && name) img.setAttribute("alt", name.textContent.trim());
    if (role && role.dataset.teamSideRole) role.textContent = tr(role.dataset.teamSideRole);
  });

  setTextAll(".howpath__kicker", tr("howKicker"));
  setTextAll("#howpathTitle", tr("howTitle"));
  setTextAll("#globeTitle", tr("globeTitle"));
  setTextAll("#globeSub", tr("globeSub"));
  const howItems = qsa(".howpath__item");
  howItems.forEach((item, index) => {
    const no = String(index + 1).padStart(2, "0");
    const titleKey = `how${no}`;
    const textKey = `how${no}Text`;
    item.dataset.name = tr(titleKey);
    const tag = qs(".howpath__plateTag", item);
    const h = qs(".howpath__h", item);
    const p = qs(".howpath__p", item);
    if (tag) tag.textContent = tr("howStage");
    if (h) h.textContent = tr(titleKey);
    if (p) p.textContent = tr(textKey);
    if (item.classList.contains("is-active")) {
      const railName = qs("#howRailName");
      if (railName) railName.textContent = tr(titleKey);
    }
  });

  setTextAll("#projectStartKicker", tr("projectStartKicker"));
  setTextAll("#projectStartTitle", tr("projectStartTitle"));
  setTextAll("#projectStartButton", tr("projectStartButton"));
  setAttrAll(".project-start__arrow", "aria-label", tr("projectStartArrowAria"));

  setTextAll("#contactTitle", tr("contactTitle"));
  setTextAll("#contact .contact__sub", tr("contactSub"));
  setAttrAll("#contact .msf", "aria-label", tr("formAria"));
  setAttrAll("#msfSteps", "aria-label", tr("stepsAria"));
  setAttrAll("#msfCcSearch", "placeholder", tr("countrySearch"));
  setAttrAll("#msfCcClose", "aria-label", tr("close"));
  setTextAll("#contact .msf__docsLabel", tr("docsLabel"));
  const docsHint = qs("#msfDocsHint");
  const docsFile = qs("#msfFile");
  if (docsHint && !(docsFile?.files && docsFile.files[0])) docsHint.textContent = tr("docsHint");
  setTextAll("#contact .msf__attachTx", tr("attach"));
  setTextAll("#contact .msf__nodocsTx", tr("noDocs"));
  setTextAll("#contact .msf__field--docs > .msf__hint", tr("docsStepHint"));
  setTextAll("#msfDocsNotice", tr("docsNotice"));
  setAttrAll("#msfClose", "aria-label", tr("modalClose"));
  setAttrAll(".msf-legal", "aria-label", tr("legalAria"));
  const personalConsentText = qs("#msfConsentPd")?.closest(".msf-legal__row")?.querySelector(".msf-legal__text");
  if (personalConsentText) {
    personalConsentText.innerHTML = `${tr("personalConsentPrefix")} <a href="personal-data-consent.html" target="_blank" rel="noopener">${tr("personalConsentDoc")}</a> ${tr("personalConsentMiddle")} <a href="privacy.html" target="_blank" rel="noopener">${tr("privacyPolicy")}</a>.`;
  }
  const marketingConsentText = qs("#msfConsentMarketing")?.closest(".msf-legal__row")?.querySelector(".msf-legal__text");
  if (marketingConsentText) {
    marketingConsentText.innerHTML = `${tr("marketingConsentPrefix")} <a href="marketing-consent.html" target="_blank" rel="noopener">${tr("marketingConsentMore")}</a>`;
  }
  setTextAll("#msfBack", tr("back"));
  setTextAll("#contactSuccessText", tr("success"));
  if (typeof window.renderContactStep === "function") window.renderContactStep();

	  setTextAll("#officesTitle", tr("officesTitle"));
	  setTextAll(".offices-cards__sub", tr("officesSub"));
	  if (typeof window.renderOfficeCards === "function") window.renderOfficeCards();

	  setTextAll("#newsKicker", tr("newsKicker"));
	  setTextAll("#newsTitle", tr("newsTitle"));
	  setTextAll("#newsAll", tr("newsAll"));
	  setAttrAll(".news-card__save", "aria-label", tr("newsSave"));
	  setAttrAll(".news-modal__close", "aria-label", tr("newsClose"));
	  if (typeof window.renderNewsCards === "function") window.renderNewsCards();

	  setTextAll(".contact-pill__label", tr("contactPill"));
  setAttrAll("#contactPill", "aria-label", tr("contactPill"));
  setAttrAll('.contact-pill__icon[href*="whatsapp"]', "aria-label", `${tr("writeTo")} WhatsApp`);
  setAttrAll('.contact-pill__icon[href*="t.me"]', "aria-label", `${tr("writeTo")} Telegram`);
  setTextAll("#contactsModalKicker", tr("contactsModalKicker"));
  const contactsTitle = qs("#contactsModalTitle");
  if (contactsTitle) contactsTitle.innerHTML = `<span>${tr("contactsModalTitleTop")}</span><span>${tr("contactsModalTitleBottom")}</span>`;
  setAttrAll(".contacts-modal__close", "aria-label", tr("close"));
  const contactMailLabels = qsa(".contacts-modal__mail span");
  if (contactMailLabels[0]) contactMailLabels[0].textContent = tr("contactsForContractors");
  if (contactMailLabels[1]) contactMailLabels[1].textContent = tr("contactsForClients");
  setTextAll(".contacts-office__details", tr("requisites"));
  const reqMoscow = qs('[data-req-panel="moscow"]');
  const reqAlmaty = qs('[data-req-panel="almaty"]');
  const reqTashkent = qs('[data-req-panel="tashkent"]');
  if (reqMoscow) reqMoscow.textContent = tr("reqMoscow");
  if (reqAlmaty) reqAlmaty.textContent = tr("reqAlmaty");
  if (reqTashkent) reqTashkent.textContent = tr("reqTashkent");
  setTextAll(".cookie-banner__text strong", tr("cookieTitle"));
  const cookieText = qs(".cookie-banner__text span");
  if (cookieText) cookieText.innerHTML = `${tr("cookieText")} <a href="privacy.html" target="_blank" rel="noopener">${tr("privacyPolicy")}</a> ${tr("cookieAnd")} <a href="cookie-policy.html" target="_blank" rel="noopener">${tr("cookiePolicy")}</a>.`;
  setTextAll("#cookieAccept", tr("cookieAccept"));
  setTextAll("#cookieReject", tr("cookieReject"));
}

function initLanguageSwitch() {
  let initial = "ru";
  try { initial = localStorage.getItem("besson_lang") || "ru"; } catch (_) {}
  if (!I18N[initial]) initial = "ru";

  qsa(".lang__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyTranslations(btn.dataset.lang || "ru");
      const desktopLang = btn.closest(".lang--desktop");
      if (desktopLang) {
        desktopLang.classList.remove("is-open");
        qs("#langTrigger", desktopLang)?.setAttribute("aria-expanded", "false");
        const menu = qs("#langMenu", desktopLang);
        if (menu) menu.hidden = true;
      }
    });
  });

  applyTranslations(initial);
}

function initLanguageDropdown() {
  const root = qs("#langSwitch.lang--desktop");
  if (!root) return;
  const trigger = qs("#langTrigger", root);
  const menu = qs("#langMenu", root);
  if (!trigger || !menu) return;

  const setOpen = (open) => {
    root.classList.toggle("is-open", open);
    trigger.setAttribute("aria-expanded", open ? "true" : "false");
    menu.hidden = !open;
  };

  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    setOpen(menu.hidden);
  });
  document.addEventListener("click", (event) => {
    if (!root.classList.contains("is-open") || event.target.closest("#langSwitch")) return;
    setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
}

function initEstimateOpeners() {
  qsa("[data-estimate-open]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.projectModalBound === "1") return;
      if (typeof window.openProjectForm === "function") window.openProjectForm();
    });
  });
}

function initYear() {
  const yearEl = qs("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function initLogo() {
  const logoText = qs("#logoText");
  if (!logoText) return;

  const text = (logoText.getAttribute("aria-label") || logoText.textContent || "Besson Agency").trim();
  logoText.innerHTML = text
    .split("")
    .map((ch) => ch === " " ? '<span data-space="true">&nbsp;</span>' : `<span>${ch}</span>`)
    .join("");

  const spans = qsa("span", logoText);
  if (!matchMedia("(hover:hover) and (pointer:fine)").matches) return;

  spans.forEach((span) => {
    if (span.dataset.space === "true") return;
    span.addEventListener("mouseenter", () => {
      span.style.transform = "translateY(-6px) scale(1.06)";
    });
    span.addEventListener("mouseleave", () => {
      span.style.transform = "translateY(0) scale(1)";
    });
  });
}

function initWordSwap() {
  const swapEl = qs("#swap");
  if (!swapEl) return;

  const words = ["Event.", "Creative.", "BTL.", "POSM."];
  let i = 0;
  setInterval(() => {
    i = (i + 1) % words.length;
    swapEl.textContent = words[i];
  }, 2500);
}

function initHeroReveal() {
  const hero = qs(".hero");
  const heroReveal = qs(".hero__reveal");
  const heroScroll = qs(".hero__scroll");
  if (!hero || !heroReveal) return;
  const heroContent = qs(".hero__content", hero);

  const update = () => {
    const heroHeight = hero.offsetHeight || window.innerHeight;
    const progress = Math.max(0, Math.min((window.scrollY || 0) / heroHeight, 1));
    const offset = (1 - progress) * (heroHeight * 0.45);
    heroReveal.style.transform = `translateY(${offset}px)`;
    if (heroScroll) heroScroll.style.opacity = String(Math.max(0, 1 - progress * 1.4));

    if (heroContent) {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      if (isMobile) {
        const live = hero.classList.contains("hero--video-live");
        const baseScale = live ? 0.48 : 1;
        const p = Math.max(0, Math.min((window.scrollY || 0) / (heroHeight * 0.72), 1));
        const scale = baseScale + (1.28 - baseScale) * p;
        const opacity = Math.max(0, 0.96 - p * 1.18);
        heroContent.style.transform = `translate3d(0,0,0) scale(${scale.toFixed(3)})`;
        heroContent.style.opacity = String(opacity.toFixed(3));
        heroContent.style.filter = p > 0.55 ? `blur(${((p - 0.55) * 10).toFixed(2)}px)` : "none";
      } else {
        heroContent.style.transform = "";
        heroContent.style.opacity = "";
        heroContent.style.filter = "";
      }
    }
  };

  update();
  window.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
  window.addEventListener("resize", update, { passive: true });
  window.addEventListener("hero-video-live", update);
}

function initHeroVideo() {
  const hero = qs("#top.hero");
  const video = qs("#heroPortfolioVideo");
  if (!hero || !video) return;

  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const introDelay = prefersReduced ? 350 : 3200;
  const fallbackSrc = video.dataset.fallbackSrc || "";
  let revealed = false;
  let ready = video.readyState >= 2;
  let introDone = false;
  let fallbackTried = false;

  const reveal = () => {
    if (!introDone) return;
    if (!ready && video.readyState < 2) return;
    if (revealed) return;
    revealed = true;
    hero.classList.add("hero--video-live");
    window.dispatchEvent(new Event("hero-video-live"));
  };

  const play = () => {
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    const playback = video.play();
    if (playback && typeof playback.catch === "function") playback.catch(() => {});
  };

  const markReady = () => {
    ready = true;
    play();
    reveal();
  };

  const tryFallback = () => {
    if (ready || fallbackTried || !fallbackSrc) return;
    fallbackTried = true;
    video.src = fallbackSrc;
    video.load();
    play();
  };

  video.addEventListener("loadedmetadata", markReady, { once: true });
  video.addEventListener("loadeddata", markReady, { once: true });
  video.addEventListener("canplay", markReady, { once: true });
  video.addEventListener("playing", () => hero.classList.add("hero--video-playing"), { once: true });
  video.addEventListener("error", () => {
    if (!revealed) hero.classList.remove("hero--video-live");
  });

  play();
  window.setTimeout(tryFallback, 1800);
  window.setTimeout(() => {
    introDone = true;
    play();
    if (ready || video.readyState >= 2) {
      ready = true;
      reveal();
    } else {
      video.addEventListener("loadeddata", markReady, { once: true });
    }
  }, introDelay);

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) play();
  });
}

function initNav() {
  const nav = qs("#siteNav");
  const burger = qs(".burger");
  const mobileMenu = qs("#mobileMenu");
  const themeSections = qsa("section[data-theme]");
  if (!nav) return;

  let currentTheme = "dark";
  let lastScrollY = window.scrollY || 0;
  let menuOpen = false;
  let ticking = false;

  const setMobileMenuState = (open) => {
    if (!burger || !mobileMenu) return;
    menuOpen = open;
    burger.classList.toggle("burger--active", open);
    mobileMenu.classList.toggle("mobile-menu--open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.classList.toggle("nav-lock", open);
    nav.classList.toggle("nav--menu-open", open);
    if (open) nav.classList.remove("nav--hidden");
  };

  if (burger && mobileMenu) {
    burger.addEventListener("click", () => setMobileMenuState(!menuOpen));
    qsa("a", mobileMenu).forEach((a) => {
      a.addEventListener("click", () => setMobileMenuState(false));
    });
  }

  const updateTheme = () => {
    if (!themeSections.length) return;
    const markerY = (nav.offsetHeight || 76) + 2;
    let theme = "dark";

    for (const section of themeSections) {
      const rect = section.getBoundingClientRect();
      if (rect.bottom <= 0) continue;
      if (rect.top <= markerY && rect.bottom >= markerY) {
        theme = section.dataset.theme || "dark";
        break;
      }
    }

    if (theme !== currentTheme) {
      currentTheme = theme;
      nav.classList.toggle("nav--on-light", theme === "light");
    }
  };

  const handleScroll = () => {
    const currentY = window.scrollY || 0;
    const diff = currentY - lastScrollY;

    if (!menuOpen && Math.abs(diff) > 6) {
      if (currentY > 80 && diff > 0) nav.classList.add("nav--hidden");
      if (diff < 0) nav.classList.remove("nav--hidden");
      lastScrollY = currentY;
    } else if (menuOpen) {
      nav.classList.remove("nav--hidden");
      lastScrollY = currentY;
    }

    updateTheme();
  };

  updateTheme();
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      handleScroll();
      ticking = false;
    });
  }, { passive: true });
  window.addEventListener("resize", updateTheme, { passive: true });
}

function initDesktopMenu() {
  const menu = qs("#desktopMenu");
  const trigger = menu ? qs("#desktopMenuTrigger", menu) : null;
  const panel = menu ? qs("#desktopMenuPanel", menu) : null;
  if (!menu || !trigger || !panel) return;

  const setOpen = (open) => {
    menu.classList.toggle("is-open", open);
    trigger.setAttribute("aria-expanded", open ? "true" : "false");
    panel.setAttribute("aria-hidden", open ? "false" : "true");
  };

  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    setOpen(!menu.classList.contains("is-open"));
  });

  qsa(".desktop-menu__item", menu).forEach((item) => {
    item.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("click", (event) => {
    if (!menu.classList.contains("is-open") || event.target.closest("#desktopMenu")) return;
    setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
}

function initContactPill() {
  const pill = qs("#contactPill");
  if (!pill) return;

  const interlude = qs(".interlude");
  const themeSections = qsa("section[data-theme]");
  let open = false;
  let raf = 0;

  const setOpen = (value) => {
    open = value;
    pill.classList.toggle("contact-pill--open", open);
    pill.setAttribute("aria-expanded", open ? "true" : "false");
    const icons = qs(".contact-pill__icons", pill);
    if (icons) icons.setAttribute("aria-hidden", open ? "false" : "true");
  };

  const getThemeAt = (markerY) => {
    let theme = "light";
    for (const section of themeSections) {
      const rect = section.getBoundingClientRect();
      if (rect.bottom <= 0) continue;
      if (rect.top <= markerY && rect.bottom >= markerY) {
        theme = section.dataset.theme || "light";
        break;
      }
    }
    return theme;
  };

  const shouldShow = () => {
    const vh = window.innerHeight || document.documentElement.clientHeight || 0;
    if (!interlude) return (window.scrollY || 0) > vh * 0.9;
    return interlude.getBoundingClientRect().top <= vh * 0.65;
  };

  const update = () => {
    raf = 0;
    const visible = shouldShow();
    pill.classList.toggle("contact-pill--visible", visible);
    if (!visible && open) setOpen(false);
    pill.classList.toggle("contact-pill--on-dark", getThemeAt((window.innerHeight || 0) * 0.5) === "dark");
  };

  const request = () => {
    if (raf) return;
    raf = requestAnimationFrame(update);
  };

  pill.addEventListener("click", (event) => {
    if (event.target.closest(".contact-pill__icon")) return;
    event.stopPropagation();
    setOpen(!open);
  });

  pill.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(!open);
    }
    if (event.key === "Escape") setOpen(false);
  });

  document.addEventListener("click", (event) => {
    if (!open || event.target.closest("#contactPill")) return;
    setOpen(false);
  });

  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request, { passive: true });
  request();
}

function initContactsModal() {
  const modal = qs("#contactsModal");
  if (!modal) return;

  const openers = qsa("[data-contact-open]");
  const closeEls = qsa("[data-contacts-close]", modal);
  const reqButtons = qsa("[data-requisites]", modal);

  const openModal = () => {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("contacts-lock");

    const burger = qs(".burger");
    const mobileMenu = qs("#mobileMenu");
    const nav = qs("#siteNav");
    burger?.classList.remove("burger--active");
    burger?.setAttribute("aria-expanded", "false");
    mobileMenu?.classList.remove("mobile-menu--open");
    mobileMenu?.setAttribute("aria-hidden", "true");
    nav?.classList.remove("nav--menu-open");
    document.body.classList.remove("nav-lock");
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("contacts-lock");
  };

  openers.forEach((opener) => {
    opener.addEventListener("click", (event) => {
      event.preventDefault();
      openModal();
    });
  });

  closeEls.forEach((el) => el.addEventListener("click", closeModal));
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });

  reqButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.requisites;
      const panel = qs(`[data-req-panel="${id}"]`, modal);
      if (!panel) return;
      panel.hidden = !panel.hidden;
      button.classList.toggle("is-active", !panel.hidden);
    });
  });
}

function initCursor() {
  const dot = qs("#cursorDot");
  const ring = qs("#cursorRing");
  if (!dot || !ring || !matchMedia("(hover:hover) and (pointer:fine)").matches) return;

  let dx = innerWidth / 2;
  let dy = innerHeight / 2;
  let rx = dx;
  let ry = dy;
  let tx = dx;
  let ty = dy;

  window.addEventListener("mousemove", (event) => {
    tx = event.clientX;
    ty = event.clientY;
    dot.style.opacity = "1";
    ring.style.opacity = "1";
  }, { passive: true });

  const loop = () => {
    dx = lerp(dx, tx, 0.35);
    dy = lerp(dy, ty, 0.35);
    rx = lerp(rx, tx, 0.12);
    ry = lerp(ry, ty, 0.12);
    dot.style.transform = `translate(${dx}px,${dy}px)`;
    ring.style.transform = `translate(${rx}px,${ry}px)`;
    requestAnimationFrame(loop);
  };
  loop();

  const hoverSel = "a,button,[role='button'],.link,.tile,input,textarea,select,label,summary";
  document.addEventListener("pointerover", (event) => {
    if (event.pointerType !== "mouse") return;
    if (event.target.closest(hoverSel)) ring.classList.add("cursor--hover");
  });
  document.addEventListener("pointerout", (event) => {
    if (event.pointerType !== "mouse") return;
    if (!event.relatedTarget || !event.relatedTarget.closest(hoverSel)) ring.classList.remove("cursor--hover");
  });
  window.addEventListener("mouseout", (event) => {
    if (!event.relatedTarget) {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    }
  });
}

function initWorkReveal() {
  const wall = qs("#wall");
  if (!wall) return;

  const tiles = qsa(".tile", wall);
  if (!tiles.length) return;

  const assignStagger = () => {
    const rows = new Map();
    tiles.forEach((el) => {
      const top = el.offsetTop;
      if (!rows.has(top)) rows.set(top, []);
      rows.get(top).push(el);
    });

    Array.from(rows.keys()).sort((a, b) => a - b).forEach((top, rowIndex) => {
      rows.get(top).sort((a, b) => a.offsetLeft - b.offsetLeft).forEach((el, colIndex) => {
        el.style.setProperty("--reveal-delay", `${rowIndex * 110 + colIndex * 70}ms`);
      });
    });
  };

  assignStagger();
  window.addEventListener("resize", () => requestAnimationFrame(assignStagger), { passive: true });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-in", entry.isIntersecting);
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -12% 0px" });

  tiles.forEach((el) => io.observe(el));
}

let currentProjectMode = "event";
const projectTitle = (mode, index) => {
  const names = {
    event: ["Launch Event", "Corporate Forum", "Brand Show", "Gala Dinner", "Dealer Day", "Expo Stand", "Festival Zone", "Press Event", "Team Building", "Road Show", "Conference", "Showreel Case"],
    btl: ["Retail Promo", "Sampling Wave", "Trade Marketing", "Merch Audit", "Shopper Route", "POSM Rollout", "Promo Team", "In-store Demo", "Lead Generation", "Regional Promo", "Brand Activation", "Field Force"],
  };
  return names[mode]?.[index] || `${tr("project")} ${index + 1}`;
};
const projectImage = (mode, index) => {
  const text = encodeURIComponent(`${mode.toUpperCase()} Project ${index + 1}`);
  const tint = mode === "event" ? "161616" : "101418";
  return `https://via.placeholder.com/1600x900/${tint}/ffffff?text=${text}`;
};

function updateProjectTiles() {
  const mode = currentProjectMode || "event";
  qsa("#workGrid .tile").forEach((tile, index) => {
    const title = projectTitle(mode, index);
    const image = qs("img", tile);
    const strong = qs("strong", tile);
    const small = qs("small", tile);
    if (image) {
      image.src = projectImage(mode, index);
      image.alt = title;
    }
    if (strong) strong.textContent = title;
    if (small) small.textContent = mode === "event" ? tr("projectEventMeta") : tr("projectBtlMeta");
  });
}
window.updateProjectTiles = updateProjectTiles;

function initWorkFilter() {
  const buttons = qsa("[data-work-filter]");
  if (!buttons.length) return;

  const setMode = (mode) => {
    currentProjectMode = mode === "btl" ? "btl" : "event";
    buttons.forEach((btn) => {
      const active = btn.dataset.workFilter === currentProjectMode;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
    updateProjectTiles();
  };

  buttons.forEach((btn) => btn.addEventListener("click", () => setMode(btn.dataset.workFilter)));
  setMode("event");
}

function initResources() {
  const section = qs("#resources");
  if (!section) return;

  const cards = qsa("[data-resource-card]", section);
  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const paintValue = (card, value) => {
    const output = qs("[data-count]", card);
    if (output) output.textContent = formatResourceNumber(value, card.dataset.format === "plain");
  };

  const countCard = (card) => {
    const target = Number(card.dataset.target || 0);
    if (!target || card.dataset.counted === "1") return;

    if (prefersReduced) {
      paintValue(card, target);
      card.dataset.counted = "1";
      return;
    }

	    const duration = target === 3 ? 3185 : (target > 1000 ? 2450 : 1775);
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      paintValue(card, target * eased);
      if (t < 1) requestAnimationFrame(tick);
      else {
        paintValue(card, target);
        card.dataset.counted = "1";
      }
    };

    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        section.classList.remove("is-in");
        cards.forEach((card) => {
          card.dataset.counted = "0";
          paintValue(card, 0);
        });
        return;
      }
      section.classList.add("is-in");
      cards.forEach(countCard);
    });
  }, { threshold: 0.01, rootMargin: "0px 0px 0px 0px" });

  io.observe(section);
}

function initReviews() {
  const root = qs("#reviews");
  if (!root) return;

  const tabs = qsa(".reviews__tab", root);
  const open = qs("#rvOpen");
  const lead = qs("#rvLead");
  const quote = qs("#rvQuote");
  const meta = qs("#rvMeta");
  const modal = qs("#rvModal");
  const frame = qs("#rvFrame");
  if (!tabs.length || !open || !lead || !quote || !meta || !modal || !frame) return;

  const videos = ["", "", ""];
  let active = 2;

  const apply = (index) => {
    active = index;
    tabs.forEach((button, i) => button.classList.toggle("is-active", i === index));
    lead.textContent = tr(`reviewLead${index}`);
    quote.textContent = tr(`reviewQuote${index}`);
    meta.textContent = tr(`reviewMeta${index}`);
  };
  window.applyReview = apply;
  window.getReviewActive = () => active;

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    frame.innerHTML = "";
    document.body.classList.remove("reviews-lock");
  };

  const openModal = () => {
    const video = videos[active];
    if (!video) return;

    frame.innerHTML = "";
    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(video)) {
      const el = document.createElement("video");
      el.src = video;
      el.controls = true;
      el.playsInline = true;
      el.autoplay = true;
      frame.appendChild(el);
    } else {
      const iframe = document.createElement("iframe");
      iframe.src = video;
      iframe.allow = "autoplay; encrypted-media; picture-in-picture";
      iframe.allowFullscreen = true;
      frame.appendChild(iframe);
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("reviews-lock");
  };

  tabs.forEach((button) => {
    button.addEventListener("click", () => apply(Number(button.dataset.rvTab || 0)));
  });
  open.addEventListener("click", openModal);
  qsa("[data-rv-close]", modal).forEach((el) => el.addEventListener("click", closeModal));
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });

  root.classList.add("rv-ready");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle("is-inview", entry.isIntersecting));
  }, { threshold: 0.15, rootMargin: "0px 0px -12% 0px" });
  qsa("[data-rv]", root).forEach((el) => io.observe(el));

  apply(active);
}

function initTeam() {
  const root = qs("#team");
  const showcase = qs("#teamShowcase", root);
  if (!root || !showcase) return;

  const items = qsa("[data-team-member]", showcase);
  const setActive = (id) => {
    showcase.classList.toggle("has-active", !!id);
    items.forEach((item) => item.classList.toggle("is-active", !!id && item.dataset.teamMember === id));
  };

  items.forEach((item) => {
    const activate = () => setActive(item.dataset.teamMember);
    item.addEventListener("mouseenter", activate);
    item.addEventListener("focus", activate);
    item.addEventListener("mouseleave", () => setActive(null));
    item.addEventListener("blur", () => setActive(null));
  });

  qsa(".team-member-row__social a", showcase).forEach((link) => {
    link.addEventListener("click", (event) => event.stopPropagation());
  });

  const revealNodes = qsa(".team__kicker, .team__title, .team-photo-card, .team-side-photo, .team-member-row", root);
  revealNodes.forEach((el, index) => {
    el.classList.add("reveal");
    el.style.setProperty("--td", `${Math.min(0.06 + index * 0.06, 0.72)}s`);
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle("is-inview", entry.isIntersecting));
  }, { threshold: 0.22, rootMargin: "0px 0px -10% 0px" });
  revealNodes.forEach((el) => io.observe(el));
}

function initHowPath() {
  const root = qs(".howpath");
  if (!root) return;

  const railNo = qs("#howRailNo", root);
  const railName = qs("#howRailName", root);
  const items = qsa(".howpath__item", root);
  if (!railNo || !railName || !items.length) return;

  const setActive = (el) => {
    items.forEach((item) => item.classList.toggle("is-active", item === el));
    railNo.textContent = el.dataset.no || "01";
    railName.textContent = el.dataset.name || "";
  };

  items.forEach((el) => {
    el.addEventListener("mouseenter", () => setActive(el));
    el.addEventListener("focus", () => setActive(el));
    el.addEventListener("click", () => setActive(el));
  });

  const activeIo = new IntersectionObserver((entries) => {
    const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible?.target) setActive(visible.target);
  }, { threshold: [0.35, 0.55, 0.75], rootMargin: "-10% 0px -55% 0px" });
  items.forEach((el) => activeIo.observe(el));

  const revealTargets = qsa(".howpath__head, .howpath__item", root);
  revealTargets.forEach((el, index) => {
    el.classList.add("how-reveal");
    el.style.setProperty("--d", `${Math.min(index * 70, 420)}ms`);
  });

  const resetOut = () => {
    root.classList.add("is-reset");
    root.classList.remove("is-in");
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("is-reset")));
  };

  const setIn = () => {
    root.classList.remove("is-reset", "is-in");
    requestAnimationFrame(() => root.classList.add("is-in"));
  };

  const revealIo = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.isIntersecting ? setIn() : resetOut());
  }, { threshold: 0.18, rootMargin: "0px 0px -12% 0px" });
  revealIo.observe(root);
}

function initProjectStart() {
  const section = qs("#projectStart");
  if (!section) return;
  const curtain = qs("#projectCurtain");
  const contact = qs("#contact");

  const setIn = (isIn) => section.classList.toggle("is-in", isIn);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => setIn(entry.isIntersecting));
  }, { threshold: 0.24, rootMargin: "0px 0px -10% 0px" });

  io.observe(section);

  const rect = section.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight || 0;
  setIn(rect.top < vh * 0.82 && rect.bottom > vh * 0.18);

  if (curtain && contact) {
    qs(".project-start__arrow", section)?.addEventListener("click", () => {
      contact.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    const formIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => curtain.classList.toggle("is-form-in", entry.isIntersecting));
    }, { threshold: 0.22, rootMargin: "-18% 0px -18% 0px" });
    formIo.observe(contact);
  }
}

function initOfficeCards() {
  const cards = qsa(".office-card");
  if (!cards.length) return;

  const canTilt = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const svgIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"></polygon><line x1="9" y1="3" x2="9" y2="18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></line><line x1="15" y1="6" x2="15" y2="21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></line></svg>';
  const messengerIcon = (messenger) => messenger === "whatsapp"
    ? '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 4.2A11.6 11.6 0 0 0 6 21.7L4.8 27.2l5.6-1.4A11.6 11.6 0 1 0 16 4.2Z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 10.8c.3-.5.6-.6 1-.5l1 .3c.2.1.4.3.4.5l-.1 1.1c0 .2-.1.4-.3.5l-.4.4c.7 1.2 1.7 2.2 3 2.9l.4-.4c.1-.2.3-.3.5-.3l1.1-.1c.2 0 .4.2.5.4l.3 1c.1.4 0 .8-.6 1.1-.7.3-1.7.2-2.6-.2-1.7-.7-3.6-2.5-4.3-4.2-.4-1-.4-1.9.1-2.5Z" fill="currentColor"/></svg>'
    : '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M27.4 5.3 4.7 14c-1 .4-1 1.2-.1 1.5l5.8 1.8 2.2 7c.3.8.5 1.1 1.1 1.1.5 0 .8-.2 1.1-.7l2.5-4 5.9 4.3c1 .6 1.8.3 2.1-1l3.8-17.9c.4-1.5-.6-2.2-1.7-1.8Z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M13.3 23.8 14 18.5l9.1-8.9-11.6 7.3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const officeKeyMap = {
    "Москва": ["cityMoscow", "countryRussia"],
    "Алматы": ["cityAlmaty", "countryKazakhstan"],
    "Ташкент": ["cityTashkent", "countryUzbekistan"],
  };

  const closeAll = (except) => {
    cards.forEach((card) => {
      if (except && card === except) return;
      card.classList.remove("is-expanded");
      qs(".office-card__btn", card)?.setAttribute("aria-expanded", "false");
    });
  };

  const render = () => {
    cards.forEach((card) => {
      const wasExpanded = card.classList.contains("is-expanded");
      card.classList.remove("has-yandex-map", "has-map-fallback");
    const city = card.dataset.city || "";
    const country = card.dataset.country || "";
    const address = card.dataset.address || "";
    const coords = card.dataset.coords || "";
    const phone = card.dataset.phone || "";
    const displayPhone = phone.replace(/\s*-\s*/g, "-");
    const messenger = (card.dataset.messenger || "telegram").toLowerCase();
    const link = card.dataset.link || "#";
    const actionText = messenger === "whatsapp" ? "WhatsApp" : "Telegram";
    const pinMap = {
      "Москва": ["56%", "46%"],
      "Алматы": ["48%", "54%"],
      "Ташкент": ["58%", "50%"],
    };
    const [pinX, pinY] = pinMap[city] || ["50%", "50%"];
      const [cityKey, countryKey] = officeKeyMap[city] || [];
      const cityLabel = cityKey ? tr(cityKey) : city;
      const countryLabel = countryKey ? tr(countryKey) : country;
    const coordParts = coords.split(",").map((part) => part.trim());
    const lat = coordParts[0] || "";
    const lon = coordParts[1] || "";
      const yandexSrc = lon && lat
        ? `https://static-maps.yandex.ru/1.x/?lang=ru_RU&ll=${encodeURIComponent(`${lon},${lat}`)}&z=16&l=map&size=650,360&pt=${encodeURIComponent(`${lon},${lat},pm2rdm`)}`
      : "";

    card.innerHTML = `
      <button class="office-card__btn" type="button" aria-expanded="false">
        <div class="office-card__frame">
          <div class="office-card__bg">
            <div class="office-card__gridPattern"></div>
              <div class="office-card__fallbackMap" aria-hidden="true">
                <span class="office-card__fallbackRoad r1"></span>
                <span class="office-card__fallbackRoad r2"></span>
                <span class="office-card__fallbackRoad r3"></span>
                <span class="office-card__fallbackRoad r4"></span>
              </div>
              ${yandexSrc ? `<img class="office-card__yandex-img" src="${yandexSrc}" alt="${tr("officeMap")}: ${city}" loading="lazy">` : ""}
            <div class="office-card__pin" style="--pin-x:${pinX};--pin-y:${pinY}"><span class="office-card__pinDot"></span></div>
            <div class="office-card__shade"></div>
          </div>
          <div class="office-card__content">
            <div class="office-card__top">
              <span class="office-card__icon" aria-hidden="true">${svgIcon}</span>
                <span class="office-card__status"><span class="office-card__dot" aria-hidden="true"></span><span class="office-card__statusText">${tr("officeOpen")}</span></span>
            </div>
            <div class="office-card__bottom">
                <h3 class="office-card__name">${cityLabel}, ${countryLabel}</h3>
              <p class="office-card__addr">${address}</p>
              <p class="office-card__coords">${coords}</p>
              <div class="office-card__contacts" aria-hidden="false">
                <p class="office-card__phone">${displayPhone}</p>
                <div class="office-card__actions">
                    <a class="office-action is-${messenger}" href="${link}" target="_blank" rel="noopener noreferrer" aria-label="${tr("writeTo")} ${actionText}">
                    <span class="office-action__ic" aria-hidden="true">${messengerIcon(messenger)}</span>
                    <span class="office-action__tx">${actionText}</span>
                  </a>
                </div>
              </div>
              <div class="office-card__underline" aria-hidden="true"></div>
            </div>
          </div>
        </div>
          <span class="office-card__hint" aria-hidden="true">${tr("officeHint")}</span>
      </button>
    `;

    const button = qs(".office-card__btn", card);
    const frame = qs(".office-card__frame", card);
    if (!button || !frame) return;
      const mapImg = qs(".office-card__yandex-img", card);
      if (mapImg) {
        mapImg.addEventListener("load", () => card.classList.add("has-yandex-map"), { once: true });
        mapImg.addEventListener("error", () => card.classList.add("has-map-fallback"), { once: true });
      }
      if (wasExpanded) {
        card.classList.add("is-expanded");
        button.setAttribute("aria-expanded", "true");
      }

    let lastToggleAt = 0;
    const toggle = (event) => {
      const now = performance.now();
      if (now - lastToggleAt < 260) return;
      if (event.target.closest(".office-action")) return;
      lastToggleAt = now;
      const isOpen = card.classList.contains("is-expanded");
      if (isOpen) {
        card.classList.remove("is-expanded");
        button.setAttribute("aria-expanded", "false");
      } else {
        closeAll(card);
        card.classList.add("is-expanded");
        button.setAttribute("aria-expanded", "true");
      }
    };

    button.addEventListener("click", toggle);
    button.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggle(event);
    });

    if (!canTilt) return;

    let raf = 0;
    button.addEventListener("mousemove", (event) => {
      const rect = frame.getBoundingClientRect();
      const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        frame.style.setProperty("--rx", `${(-dy * 7).toFixed(2)}deg`);
        frame.style.setProperty("--ry", `${(dx * 7).toFixed(2)}deg`);
      });
    });
    button.addEventListener("mouseleave", () => {
      cancelAnimationFrame(raf);
      frame.style.setProperty("--rx", "0deg");
      frame.style.setProperty("--ry", "0deg");
    });
  });
  };

  window.renderOfficeCards = render;
  render();

  document.addEventListener("click", (event) => {
    if (event.target.closest(".office-card")) return;
    closeAll(null);
  });
}

function initNews() {
  const root = qs("#news");
  const modal = qs("#newsModal");
  if (!root || !modal) return;

  const cards = qsa("[data-news-card]", root);
  const grid = qs("#newsGrid", root);
  const image = qs("#newsModalImage", modal);
  const meta = qs("#newsModalMeta", modal);
  const title = qs("#newsModalTitle", modal);
  const text = qs("#newsModalText", modal);

  const getData = (index) => ({
    title: tr(`newsTitle${index}`),
    time: tr(`newsTime${index}`),
    text: tr(`newsText${index}`),
  });

  const render = () => {
    cards.forEach((card, index) => {
      const data = getData(index);
      const h = qs(".news-card__body h3", card);
      const time = qs(".news-card__meta span:last-child", card);
      const save = qs(".news-card__save", card);
      if (h) h.textContent = data.title;
      if (time) time.textContent = data.time;
      if (save) save.setAttribute("aria-label", tr("newsSave"));
    });
  };
  window.renderNewsCards = render;

  const open = (card) => {
    const index = Number(card.dataset.newsCard || 0);
    const data = getData(index);
    const img = qs("img", card);
    if (image && img) {
      image.src = img.src;
      image.alt = img.alt || data.title;
    }
    if (meta) {
      const category = qs(".news-card__meta span:first-child", card)?.textContent || "";
      meta.textContent = `${category} · ${data.time}`;
    }
    if (title) title.textContent = data.title;
    if (text) {
      text.innerHTML = "";
      [data.text, tr("newsText2")].forEach((paragraph) => {
        const p = document.createElement("p");
        p.textContent = paragraph;
        text.appendChild(p);
      });
    }
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("news-lock");
  };

  const close = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("news-lock");
  };

  cards.forEach((card) => {
    card.addEventListener("click", (event) => {
      const save = event.target.closest(".news-card__save");
      if (save) {
        save.classList.toggle("is-active");
        return;
      }
      open(card);
    });
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      open(card);
    });
  });
  qsa("[data-news-close]", modal).forEach((el) => el.addEventListener("click", close));
  qs("[data-news-prev]", root)?.addEventListener("click", () => {
    if (!grid) return;
    grid.scrollBy({ left: -Math.max(280, grid.clientWidth * 0.72), behavior: "smooth" });
  });
  qs("[data-news-next]", root)?.addEventListener("click", () => {
    if (!grid) return;
    grid.scrollBy({ left: Math.max(280, grid.clientWidth * 0.72), behavior: "smooth" });
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) close();
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => root.classList.toggle("is-in", entry.isIntersecting));
  }, { threshold: 0.16, rootMargin: "0px 0px -14% 0px" });
  io.observe(root);
  render();
}

function initProjectModal() {
  const scrim = qs("#projectModalScrim");
  const formWrap = qs("#contact .msf");
  const closeBtn = qs("#msfClose");
  if (!scrim || !formWrap) return;

  const open = () => {
    const contact = qs("#contact");
    const success = qs("#contactSuccess");
    const card = qs("#msfCard");
    contact?.classList.remove("is-success");
    if (success) {
      success.hidden = true;
      success.classList.remove("is-on");
    }
    if (typeof window.resetProjectContactForm === "function") window.resetProjectContactForm();
    scrim.hidden = false;
    document.body.classList.add("project-modal-open");
    if (card) card.scrollTop = 0;
    window.setTimeout(() => {
      const first = qs("#msfTextInput");
      if (first && !first.closest("[hidden]")) first.focus({ preventScroll: true });
    }, 80);
  };

  const close = () => {
    document.body.classList.remove("project-modal-open");
    scrim.hidden = true;
  };

  scrim.addEventListener("click", close);
  closeBtn?.addEventListener("click", close);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("project-modal-open")) close();
  });

  window.openProjectForm = open;
  window.closeProjectForm = close;
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("#startProjectHowBtn, [data-estimate-open]");
    if (!trigger) return;
    event.preventDefault();
    event.stopPropagation();
    open();
  }, true);
  qsa("#startProjectHowBtn, [data-estimate-open]").forEach((button) => {
    if (button.dataset.projectModalBound === "1") return;
    button.dataset.projectModalBound = "1";
    button.addEventListener("click", open);
  });
}

function initFloatingCta() {
  const btn = qs("#startProjectHowBtn");
  if (!btn) return;

  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mqMobile = matchMedia("(max-width: 720px)");
  const state = { tx: 0, ty: 0, cx: 0, cy: 0, near: false, radius: 170, strength: 0.35, raf: null };

  function setVars(x, y) {
    btn.style.setProperty("--mx", `${x.toFixed(2)}px`);
    btn.style.setProperty("--my", `${y.toFixed(2)}px`);
  }
  function tick() {
    state.cx += (state.tx - state.cx) * 0.12;
    state.cy += (state.ty - state.cy) * 0.12;
    setVars(state.cx, state.cy);
    if (Math.abs(state.tx - state.cx) < 0.15 && Math.abs(state.ty - state.cy) < 0.15) {
      state.raf = null;
      return;
    }
    state.raf = requestAnimationFrame(tick);
  }
  function setTarget(x, y, immediate = false) {
    state.tx = x;
    state.ty = y;
    if (immediate) {
      state.cx = x;
      state.cy = y;
      setVars(x, y);
      if (state.raf) cancelAnimationFrame(state.raf);
      state.raf = null;
      return;
    }
    if (!state.raf) state.raf = requestAnimationFrame(tick);
  }
  function setHidden(hidden) {
    btn.classList.toggle("is-hidden", hidden);
    if (hidden) {
      btn.classList.remove("is-near");
      state.near = false;
      setTarget(0, 0, true);
    }
  }

  const onScroll = () => setHidden((window.scrollY || 0) > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (!prefersReduced) {
    window.addEventListener("pointermove", (event) => {
      if (btn.classList.contains("is-hidden") || mqMobile.matches || (event.pointerType && event.pointerType !== "mouse")) return;
      const rect = btn.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const dist = Math.hypot(dx, dy);
      const near = dist < state.radius;
      if (near !== state.near) {
        state.near = near;
        btn.classList.toggle("is-near", near);
      }
      if (!near) {
        setTarget(0, 0);
        return;
      }
      const t = 1 - Math.max(0, Math.min(1, dist / state.radius));
      const scale = state.strength * (0.35 + 0.65 * t);
      setTarget(Math.max(-34, Math.min(34, dx * scale)), Math.max(-34, Math.min(34, dy * scale)));
    }, { passive: true });
  }

  btn.addEventListener("click", () => {
    if (btn.dataset.projectModalBound !== "1" && typeof window.openProjectForm === "function") window.openProjectForm();
    setHidden(false);
  });
}

function initCookieBanner() {
  const banner = qs("#cookieBanner");
  const accept = qs("#cookieAccept");
  const reject = qs("#cookieReject");
  if (!banner || !accept || !reject) return;

  const key = "besson_cookie_choice_v5";
  let choice = "";
  try { choice = localStorage.getItem(key) || ""; } catch (_) {}
  banner.classList.toggle("is-hidden", Boolean(choice));

  const setChoice = (value) => {
    try { localStorage.setItem(key, value); } catch (_) {}
    banner.classList.add("is-hidden");
  };

  accept.addEventListener("click", () => setChoice("accepted"));
  reject.addEventListener("click", () => setChoice("rejected"));
}

function initContactForm() {
  const contact = qs("#contact");
  const form = qs("#msfForm");
  const successWrap = qs("#contactSuccess");
  if (!contact || !form || !successWrap) return;

  const countries = [
    { iso: "RU", name: "Россия", dial: "7", flag: "RU", placeholder: "(999) 999-99-99", max: 10, groups: [3, 3, 2, 2] },
    { iso: "KZ", name: "Казахстан", dial: "7", flag: "KZ", placeholder: "(999) 999-99-99", max: 10, groups: [3, 3, 2, 2] },
    { iso: "UZ", name: "Узбекистан", dial: "998", flag: "UZ", placeholder: "(99) 999-99-99", max: 9, groups: [2, 3, 2, 2] },
    { iso: "US", name: "United States", dial: "1", flag: "US", placeholder: "(999) 999-9999", max: 10, groups: [3, 3, 4] },
    { iso: "DE", name: "Deutschland", dial: "49", flag: "DE", placeholder: "151 23456789", max: 11, groups: [3, 8] },
    { iso: "GB", name: "United Kingdom", dial: "44", flag: "GB", placeholder: "20 1234 5678", max: 10, groups: [2, 4, 4] },
  ];

  const el = {
    steps: qsa(".msf-step", qs("#msfSteps")),
    line01: qs("#msfLine01"),
    line12: qs("#msfLine12"),
    line23: qs("#msfLine23"),
    bar: qs("#msfBar"),
    label: qs("#msfLabel"),
    count: qs("#msfCount"),
    fieldText: qs("#msfFieldText"),
    fieldPhone: qs("#msfFieldPhone"),
    fieldDocs: qs("#msfFieldDocs"),
    text: qs("#msfTextInput"),
    hint: qs("#msfHint"),
    ccBtn: qs("#msfCcBtn"),
    ccFlag: qs("#msfCcFlag"),
    ccCode: qs("#msfCcCode"),
    ccMenu: qs("#msfCcMenu"),
    ccSearch: qs("#msfCcSearch"),
    ccList: qs("#msfCcList"),
    ccClose: qs("#msfCcClose"),
    phone: qs("#msfPhoneInput"),
    file: qs("#msfFile"),
    docsHint: qs("#msfDocsHint"),
    noDocs: qs("#msfNoDocs"),
    consentPd: qs("#msfConsentPd"),
    consentMarketing: qs("#msfConsentMarketing"),
    cta: qs("#msfCta"),
    ctaLabel: qs("#msfCtaLabel"),
    back: qs("#msfBack"),
    status: qs("#msfStatus"),
    hMessage: qs("#msf_message_h"),
    hName: qs("#msf_name_h"),
    hEmail: qs("#msf_email_h"),
    hPhone: qs("#msf_phone_h"),
    hPhoneE164: qs("#msf_phone_e164_h"),
    hPhoneCountry: qs("#msf_phone_country_h"),
    hPhoneDial: qs("#msf_phone_dial_h"),
    hNoDocs: qs("#msf_no_docs_h"),
    hDocUrl: qs("#msf_doc_url"),
    hDocName: qs("#msf_doc_name"),
    hDocSize: qs("#msf_doc_size"),
    hDocType: qs("#msf_doc_type"),
    hPersonalConsent: qs("#msf_personal_consent_h"),
    hMarketingConsent: qs("#msf_marketing_consent_h"),
  };

  if (!el.label || !el.count || !el.bar || !el.cta || !el.back || !el.status || !el.text || !el.phone || !el.file || !el.noDocs || !el.consentPd) return;

  const steps = [
    { labelKey: "nameLabel", type: "text", placeholderKey: "namePlaceholder", hintKey: "nameHint" },
    { label: "Email", type: "email", placeholder: "you@example.com", hintKey: "emailHint" },
    { labelKey: "phoneLabel", type: "phone", hintKey: "phoneHint" },
    { labelKey: "docsLabel", type: "docs", hintKey: "docsStepHint" },
  ];

  let current = 0;
  let busy = false;
  const data = { name: "", email: "" };
  let selected = countries[0];
  let phoneDigits = "";

  el.consentPd.checked = false;
  if (el.consentMarketing) el.consentMarketing.checked = false;

  const digitsOnly = (value) => (value || "").replace(/\D/g, "");
  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const formatPhone = (digits, country = selected) => {
    const clipped = digits.slice(0, country.max);
    const parts = [];
    let index = 0;
    country.groups.forEach((size) => {
      const chunk = clipped.slice(index, index + size);
      if (chunk) parts.push(chunk);
      index += size;
    });
    if (country.groups.length === 4) {
      let out = "";
      if (parts[0]) out += `(${parts[0]}`;
      if (parts[0]?.length === country.groups[0]) out += ")";
      if (parts[1]) out += ` ${parts[1]}`;
      if (parts[2]) out += `-${parts[2]}`;
      if (parts[3]) out += `-${parts[3]}`;
      return out;
    }
    return parts.join(" ");
  };
  const e164 = () => phoneDigits ? `+${selected.dial}${phoneDigits}` : "";
  const phoneDisplay = () => phoneDigits ? `+${selected.dial} ${formatPhone(phoneDigits)}`.trim() : "";

	  const syncHidden = () => {
	    if (el.hName) el.hName.value = data.name.trim();
    if (el.hEmail) el.hEmail.value = data.email.trim();
    if (el.hPhoneCountry) el.hPhoneCountry.value = selected.iso;
    if (el.hPhoneDial) el.hPhoneDial.value = `+${selected.dial}`;
    if (el.hPhoneE164) el.hPhoneE164.value = e164();
    if (el.hPhone) el.hPhone.value = phoneDisplay();
    if (el.hNoDocs) el.hNoDocs.value = el.noDocs.checked ? "1" : "0";
    if (el.hPersonalConsent) el.hPersonalConsent.value = el.consentPd.checked ? "yes" : "no";
    if (el.hMarketingConsent) el.hMarketingConsent.value = el.consentMarketing?.checked ? "yes" : "no";
    if (el.hMessage) {
      el.hMessage.value = [
        `Имя: ${data.name.trim()}`,
        `Email: ${data.email.trim()}`,
        `Телефон: ${phoneDisplay() || "-"}`,
        `Документов нет: ${el.noDocs.checked ? "Да" : "Нет"}`,
        `Согласие на обработку ПДн: ${el.consentPd.checked ? "Да" : "Нет"}`,
        `Согласие на рекламную рассылку: ${el.consentMarketing?.checked ? "Да" : "Нет"}`,
        el.hDocUrl?.value ? `Документ: ${el.hDocUrl.value}` : "",
      ].filter(Boolean).join("\n");
	    }
	  };

	  const resetLegalChecks = () => {
	    el.consentPd.checked = false;
	    if (el.consentMarketing) el.consentMarketing.checked = false;
	    syncHidden();
	  };

	  const isValidStep = () => {
	    if (current === 0) return data.name.trim().length >= 2;
	    if (current === 1) return isEmail(data.email.trim());
	    if (current === 2) return phoneDigits.length === selected.max;
	    if (current === 3) return (Boolean(el.file.files?.[0]) || el.noDocs.checked) && el.consentPd.checked;
	    return false;
	  };

	  window.addEventListener("pageshow", () => {
	    resetLegalChecks();
	    el.cta.disabled = busy || !isValidStep();
	  }, { once: true });

  const setBusy = (value) => {
    busy = value;
    el.cta.classList.toggle("is-busy", busy);
    el.cta.disabled = busy || !isValidStep();
    el.back.disabled = busy;
  };

  const countryLabel = (country) => {
    const map = { RU: "countryRussia", KZ: "countryKazakhstan", UZ: "countryUzbekistan" };
    return map[country.iso] ? tr(map[country.iso]) : country.name;
  };

  const renderCountries = (query = "") => {
    const q = query.trim().toLowerCase();
    const list = countries.filter((country) => {
      const name = countryLabel(country).toLowerCase();
      return !q || name.includes(q) || country.name.toLowerCase().includes(q) || country.iso.toLowerCase().includes(q) || (`+${country.dial}`).includes(q);
    });
    el.ccList.innerHTML = list.map((country) => `
      <button type="button" class="msf-cc__item ${country.iso === selected.iso ? "is-active" : ""}" role="option" data-iso="${country.iso}">
        <span class="msf-cc__itemLeft"><span class="msf-cc__itemFlag" aria-hidden="true">${country.flag}</span><span class="msf-cc__itemName">${countryLabel(country)}</span></span>
        <span class="msf-cc__itemCode">+${country.dial}</span>
      </button>
    `).join("");
  };

  const setCountry = (iso) => {
    selected = countries.find((country) => country.iso === iso) || selected;
    phoneDigits = phoneDigits.slice(0, selected.max);
    if (el.ccFlag) el.ccFlag.textContent = selected.flag;
    if (el.ccCode) el.ccCode.textContent = `+${selected.dial}`;
    el.phone.placeholder = selected.placeholder;
    el.phone.value = formatPhone(phoneDigits);
    syncHidden();
    el.cta.disabled = busy || !isValidStep();
  };

  const openCountries = () => {
    el.ccMenu.hidden = false;
    el.ccBtn.setAttribute("aria-expanded", "true");
    renderCountries(el.ccSearch?.value || "");
    requestAnimationFrame(() => el.ccSearch?.focus({ preventScroll: true }));
  };
  const closeCountries = () => {
    el.ccMenu.hidden = true;
    el.ccBtn.setAttribute("aria-expanded", "false");
    if (el.ccSearch) el.ccSearch.value = "";
    requestAnimationFrame(() => el.phone.focus({ preventScroll: true }));
  };

  const setLines = () => {
    if (el.line01) el.line01.style.transform = `scaleX(${current >= 1 ? 1 : 0})`;
    if (el.line12) el.line12.style.transform = `scaleX(${current >= 2 ? 1 : 0})`;
    if (el.line23) el.line23.style.transform = `scaleX(${current >= 3 ? 1 : 0})`;
  };

  const renderStep = () => {
    const step = steps[current];
    el.label.textContent = step.labelKey ? tr(step.labelKey) : step.label;
    el.count.textContent = `${current + 1}/${steps.length}`;
    el.steps.forEach((button, index) => {
      button.classList.toggle("is-active", index === current);
      button.classList.toggle("is-done", index < current);
      button.toggleAttribute("disabled", index > current);
      if (index === current) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
    el.bar.style.width = `${((current + 1) / steps.length) * 100}%`;
    setLines();

    el.fieldText.hidden = !(current === 0 || current === 1);
    el.fieldPhone.hidden = current !== 2;
    el.fieldDocs.hidden = current !== 3;

    if (current === 0 || current === 1) {
      el.text.type = current === 1 ? "email" : "text";
      el.text.placeholder = step.placeholderKey ? tr(step.placeholderKey) : step.placeholder;
      el.text.value = current === 0 ? data.name : data.email;
      if (el.hint) el.hint.textContent = step.hintKey ? tr(step.hintKey) : (step.hint || "");
      el.ctaLabel.textContent = tr("continue");
      requestAnimationFrame(() => el.text.focus({ preventScroll: true }));
    }
    if (current === 2) {
      el.phone.placeholder = selected.placeholder;
      el.phone.value = formatPhone(phoneDigits);
      el.ctaLabel.textContent = tr("continue");
      requestAnimationFrame(() => el.phone.focus({ preventScroll: true }));
    }
    if (current === 3) el.ctaLabel.textContent = tr("submit");
    el.back.hidden = current === 0;
    syncHidden();
    el.cta.disabled = busy || !isValidStep();
  };
  window.renderContactStep = renderStep;

  el.text.addEventListener("input", () => {
    if (current === 0) data.name = el.text.value;
    if (current === 1) data.email = el.text.value;
    syncHidden();
    el.cta.disabled = busy || !isValidStep();
  });
  el.text.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !el.cta.disabled) {
      event.preventDefault();
      el.cta.click();
    }
  });
  el.phone.addEventListener("input", () => {
    phoneDigits = digitsOnly(el.phone.value).slice(0, selected.max);
    el.phone.value = formatPhone(phoneDigits);
    syncHidden();
    el.cta.disabled = busy || !isValidStep();
  });
  el.phone.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !el.cta.disabled) {
      event.preventDefault();
      el.cta.click();
    }
  });

  el.ccBtn.addEventListener("click", openCountries);
  el.ccClose?.addEventListener("click", closeCountries);
  el.ccMenu.addEventListener("click", (event) => {
    if (event.target === el.ccMenu) closeCountries();
  });
  el.ccSearch?.addEventListener("input", () => renderCountries(el.ccSearch.value));
  el.ccList.addEventListener("click", (event) => {
    const button = event.target.closest(".msf-cc__item");
    if (!button) return;
    setCountry(button.dataset.iso);
    closeCountries();
  });

  el.file.addEventListener("change", () => {
    const file = el.file.files?.[0];
    if (file && file.size > 50 * 1024 * 1024) {
      el.file.value = "";
      if (el.docsHint) el.docsHint.textContent = tr("fileTooLarge");
    } else if (file) {
      if (el.docsHint) el.docsHint.textContent = file.name;
      el.noDocs.checked = false;
    } else if (el.docsHint) {
      el.docsHint.textContent = tr("docsHint");
    }
    syncHidden();
    el.cta.disabled = busy || !isValidStep();
  });
  el.noDocs.addEventListener("change", () => {
    if (el.noDocs.checked) {
      el.file.value = "";
      if (el.docsHint) el.docsHint.textContent = tr("docsHint");
      [el.hDocUrl, el.hDocName, el.hDocSize, el.hDocType].forEach((field) => { if (field) field.value = ""; });
    }
    syncHidden();
    el.cta.disabled = busy || !isValidStep();
  });
  [el.consentPd, el.consentMarketing].filter(Boolean).forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      syncHidden();
      el.status.textContent = "";
      el.cta.disabled = busy || !isValidStep();
    });
  });
  el.back.addEventListener("click", () => {
    if (busy) return;
    current = Math.max(0, current - 1);
    renderStep();
  });

  const uploadDocument = async (file) => {
    if (window.location.protocol === "file:") {
      throw new Error(tr("statusUploadServer"));
    }

    const endpoint = form.dataset.uploadEndpoint || "/api/upload-doc.php";
    const uploadData = new FormData();
    uploadData.append("file", file, file.name);
    uploadData.append("lead_name", data.name.trim());
    uploadData.append("lead_email", data.email.trim());
    uploadData.append("lead_phone", phoneDisplay());

    const response = await fetch(endpoint, {
      method: "POST",
      body: uploadData,
      headers: { Accept: "application/json" },
    });
    const text = await response.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch (_) {
      json = null;
    }

    if (!response.ok) {
      throw new Error(json?.error || tr("statusUploadFail"));
    }

    const url = json?.url || json?.doc_url || json?.file_url || text.trim();
    if (!url || !/^https?:\/\/|^\//.test(url)) {
      throw new Error(tr("statusNoLink"));
    }

    return {
      url,
      name: json?.name || json?.doc_name || file.name,
      size: json?.size || json?.doc_size || file.size,
      type: json?.type || json?.doc_type || file.type || "",
    };
  };

  const sendToWeb3Forms = async () => {
    syncHidden();
    const fd = new FormData(form);
    fd.delete("attachment");
    const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: fd, headers: { Accept: "application/json" } });
    const json = await response.json().catch(() => ({}));
    if (!response.ok || json.success !== true) throw new Error(json.message || tr("statusSendError"));
    return json;
  };

  const showSuccess = () => {
    contact.classList.add("is-success");
    successWrap.hidden = false;
    requestAnimationFrame(() => successWrap.classList.add("is-on"));
  };

  el.cta.addEventListener("click", async () => {
    if (busy || !isValidStep()) return;
    if (current < 3) {
      if (current === 0) data.name = el.text.value;
      if (current === 1) data.email = el.text.value;
      current += 1;
      renderStep();
      return;
    }

    setBusy(true);
    el.status.textContent = el.file.files?.[0] && !el.noDocs.checked ? tr("statusUploading") : tr("statusSending");
    try {
      const file = el.file.files?.[0];
      if (file && !el.noDocs.checked) {
        const uploaded = await uploadDocument(file);
        if (el.hDocUrl) el.hDocUrl.value = uploaded.url;
        if (el.hDocName) el.hDocName.value = uploaded.name;
        if (el.hDocSize) el.hDocSize.value = String(uploaded.size);
        if (el.hDocType) el.hDocType.value = uploaded.type || "";
        syncHidden();
      }
      el.status.textContent = tr("statusEmail");
      await new Promise((resolve) => setTimeout(resolve, 420));
      await sendToWeb3Forms();
      el.status.textContent = "";
      setBusy(false);
      showSuccess();
    } catch (error) {
      setBusy(false);
      el.status.textContent = error?.message || tr("statusSendError");
    }
  });

  successWrap.hidden = true;
  successWrap.classList.remove("is-on");
  renderCountries();
  setCountry("RU");
  renderStep();

  window.resetProjectContactForm = () => {
    current = 0;
    busy = false;
    data.name = "";
    data.email = "";
    phoneDigits = "";
    form.reset();
    el.consentPd.checked = false;
    if (el.consentMarketing) el.consentMarketing.checked = false;
    if (el.docsHint) el.docsHint.textContent = tr("docsHint");
    if (el.status) el.status.textContent = "";
    [el.hDocUrl, el.hDocName, el.hDocSize, el.hDocType].forEach((field) => { if (field) field.value = ""; });
    contact.classList.remove("is-success");
    successWrap.hidden = true;
    successWrap.classList.remove("is-on");
    setCountry("RU");
    renderStep();
  };
}

function initGlobeStrip() {
  const dome = qs("#globeDome");
  const canvas = qs("#globeCanvas");
  const label = qs("#globeLabel");
  if (!dome || !canvas || !window.THREE) return;

  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);
  const group = new THREE.Group();
  scene.add(group);

  const radius = 5.3;
  const wire = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(radius, 5)),
    new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 })
  );
  group.add(wire);
  group.position.y = -radius * 0.95;

  const cities = [
    { cityKey: "cityAlmaty", lat: 31, lon: 20, labelSide: "right" },
    { cityKey: "cityMoscow", lat: 60, lon: -5, labelSide: "right" },
    { cityKey: "cityTashkent", lat: 32, lon: -10, labelSide: "left" },
  ].map((city) => {
    const lat = THREE.MathUtils.degToRad(city.lat);
    const lon = THREE.MathUtils.degToRad(city.lon);
    const position = new THREE.Vector3(Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)).normalize().multiplyScalar(radius * 1.006);
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.025, 18, 18), new THREE.MeshBasicMaterial({ color: 0x000000, depthTest: false }));
    mesh.position.copy(position);
    group.add(mesh);
    return { ...city, mesh };
  });

  const routeGeometry = new THREE.BufferGeometry();
  const routeMaterial = new THREE.LineBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.72,
    depthTest: false,
    depthWrite: false
  });
  const routeLine = new THREE.Line(routeGeometry, routeMaterial);
  routeLine.renderOrder = 8;
  group.add(routeLine);

  const resize = () => {
    const width = dome.clientWidth || window.innerWidth;
    const height = dome.clientHeight || window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    const isMobile = matchMedia("(max-width:768px)").matches;
    const dist = Math.max((radius * (isMobile ? 1.08 : 0.92)) / Math.tan(hFov / 2), (radius * (isMobile ? 0.98 : 0.86)) / Math.tan(vFov / 2));
    camera.position.set(0, 1.15, dist + (isMobile ? 0.35 : 0.18));
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  };
  resize();
  new ResizeObserver(resize).observe(dome);

  let active = 0;
  let current = 0;
  let next = 1;
  let routeCount = 2;
  let phase = "draw";
  let phaseStart = performance.now();
  const DRAW_MS = prefersReduced ? 0 : 2050;
  const HOLD_MS = prefersReduced ? 2200 : 1900;

  const buildRoute = (fromIndex, toIndex) => {
    const from = cities[fromIndex].mesh.position.clone().normalize();
    const to = cities[toIndex].mesh.position.clone().normalize();
    const steps = 92;
    const points = [];

    let dot = THREE.MathUtils.clamp(from.dot(to), -1, 1);
    let angle = Math.acos(dot);
    const sinAngle = Math.sin(angle) || 1;

    for (let i = 0; i < steps; i += 1) {
      const t = i / (steps - 1);
      const a = Math.sin((1 - t) * angle) / sinAngle;
      const b = Math.sin(t * angle) / sinAngle;
      const p = from.clone().multiplyScalar(a).add(to.clone().multiplyScalar(b));
      const lift = 1.012 + Math.sin(Math.PI * t) * 0.055;
      points.push(p.normalize().multiplyScalar(radius * lift));
    }

    const positions = new Float32Array(points.length * 3);
    points.forEach((p, i) => {
      positions[i * 3] = p.x;
      positions[i * 3 + 1] = p.y;
      positions[i * 3 + 2] = p.z;
    });

    routeGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    routeGeometry.setDrawRange(0, 2);
    routeGeometry.attributes.position.needsUpdate = true;
    routeGeometry.computeBoundingSphere();
    return points.length;
  };

  const setActive = (index, showLabel) => {
    active = index;
    cities.forEach((city, cityIndex) => city.mesh.scale.setScalar(cityIndex === active ? 1.38 : 1));
    if (label) label.classList.toggle("globe-label--visible", !!showLabel);
  };

  routeCount = buildRoute(current, next);
  setActive(current, true);

  const updateLabel = (show) => {
    if (!label || !cities[active] || !show) return;
    const world = new THREE.Vector3();
    cities[active].mesh.getWorldPosition(world);
    world.project(camera);
    const isMobile = matchMedia("(max-width:768px)").matches;
    const rawX = (world.x * 0.5 + 0.5) * dome.clientWidth;
    const rawY = (-world.y * 0.5 + 0.5) * dome.clientHeight;
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    label.textContent = `${tr("officeWord")} ${tr(cities[active].cityKey)}`;
    const side = cities[active].labelSide || (isMobile && rawX > dome.clientWidth * 0.55 ? "left" : "right");
    const gap = isMobile ? 13 : 30;
    const labelW = isMobile ? 118 : 176;
    const labelH = isMobile ? 26 : 34;
    const minX = side === "left" ? labelW + gap + 12 : 18;
    const maxX = side === "right" ? dome.clientWidth - labelW - gap - 12 : dome.clientWidth - 18;
    const x = clamp(rawX, minX, maxX);
    const y = clamp(rawY - (isMobile ? 4 : 6), labelH + 14, dome.clientHeight - labelH - 18);
    label.classList.toggle("globe-label--side", side !== "top");
    label.classList.toggle("globe-label--top", side === "top");
    if (side !== "top") {
      label.style.setProperty("--globe-label-x", side === "left" ? `calc(-100% - ${gap}px)` : `${gap}px`);
      label.style.left = `${x}px`;
      label.style.top = `${y}px`;
    } else {
      label.style.setProperty("--globe-label-x", "-50%");
      label.style.left = `${clamp(rawX, labelW / 2 + 12, dome.clientWidth - labelW / 2 - 12)}px`;
      label.style.top = `${clamp(rawY - 18, labelH + 18, dome.clientHeight - labelH - 18)}px`;
    }
    label.classList.add("globe-label--visible");
  };

  const tick = (now) => {
    const t = now / 1000;
    if (!prefersReduced) {
      group.rotation.y = 0.22 * Math.sin(t * 0.45);
      group.rotation.x = 0.05 * Math.sin(t * 0.22);
    }
    const elapsed = now - phaseStart;
    if (phase === "draw") {
      const p = DRAW_MS ? Math.min(1, elapsed / DRAW_MS) : 1;
      const drawn = Math.max(2, Math.floor(routeCount * p));
      routeGeometry.setDrawRange(0, drawn);
      if (label) label.classList.remove("globe-label--visible");

      if (p >= 1) {
        setActive(next, true);
        phase = "hold";
        phaseStart = now;
      }
    } else if (elapsed > HOLD_MS) {
      current = next;
      next = (next + 1) % cities.length;
      routeCount = buildRoute(current, next);
      setActive(current, false);
      phase = "draw";
      phaseStart = now;
    }

    updateLabel(phase === "hold");
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function initGlobeDomeScroll() {
  const bridge = qs("#globeBridge");
  const dome = qs("#globeDome");
  if (!bridge || !dome) return;

  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  let current = null;
  let target = null;
  let raf = 0;

	  const compute = () => {
	    const rect = bridge.getBoundingClientRect();
	    const vh = window.innerHeight || document.documentElement.clientHeight || 0;
	    const p = easeOutCubic(clamp01((vh * 0.72 - rect.top) / (vh * 0.72 - vh * 0.14)));
	    const isMobile = matchMedia("(max-width:768px)").matches;
	    const from = isMobile ? -5 : -13;
	    const to = isMobile ? 8 : 2;
	    target = from + (to - from) * p;
	    if (current === null) current = target;
	  };

  const paint = () => {
    raf = 0;
    if (target === null) return;
    current = lerp(current, target, 0.14);
    dome.style.setProperty("--domeBottom", `${current.toFixed(3)}vh`);
    if (Math.abs(current - target) > 0.02) raf = requestAnimationFrame(paint);
  };

  const request = () => {
    compute();
    if (!raf) raf = requestAnimationFrame(paint);
  };

  request();
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request, { passive: true });
}

function initNebula() {
  const mount = qs("#nebulaBg");
  if (!mount || !window.THREE || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (mount.dataset.nebulaInit === "1") return;
  mount.dataset.nebulaInit = "1";

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const uniforms = { iTime: { value: 0 }, iResolution: { value: new THREE.Vector2(1, 1) } };
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: "varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,1.0);}",
    fragmentShader: `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;
      varying vec2 vUv;
      mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
      float map(vec3 p){
        p.xz*=rot(iTime*.18);p.xy*=rot(iTime*.11);
        vec3 q=p*2.0+iTime*.35;
        return length(p+vec3(sin(iTime*.25)))*log(length(p)+1.0)+sin(q.x+sin(q.z+sin(q.y)))*.5-1.0;
      }
      void main(){
        vec2 uv=(vUv*iResolution-.5*iResolution)/min(iResolution.x,iResolution.y);
        vec3 col=vec3(0.0);
        float d=2.5;
        for(int i=0;i<6;i++){
          vec3 p=vec3(0,0,5.)+normalize(vec3(uv,-1.))*d;
          float rz=map(p);
          float f=clamp((rz-map(p+.1))*.5,-.1,1.);
          vec3 base=vec3(.1,.25,.38)+vec3(1.25,.55,.9)*f;
          col=col*base+smoothstep(2.5,0.,rz)*.74*base;
          d+=min(rz,1.);
        }
        float dist=distance(vUv,vec2(.5));
        col*=smoothstep(.14,.58,dist);
        gl_FragColor=vec4(col,1.);
      }`
  });
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

  const resize = () => {
    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;
    renderer.setSize(width, height, false);
    uniforms.iResolution.value.set(width, height);
  };
  resize();
  window.addEventListener("resize", resize, { passive: true });

  const clock = new THREE.Clock();
  const tick = () => {
    uniforms.iTime.value = clock.getElapsedTime();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function initLogoMarquee() {
  const root = qs("#clients.clients--marquee .logo-marquee");
  if (!root || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const viewport = qs(".logo-marquee__viewport", root);
  const track = qs(".logo-marquee__track", root);
  const baseSet = qs(".logo-marquee__set", root);
  if (!viewport || !track || !baseSet) return;

  let distance = 0;
  let offset = 0;
  let speed = Number(root.dataset.speed || 80);
  let targetSpeed = speed;
  let last = 0;

  const build = () => {
    qsa(".logo-marquee__set", track).slice(1).forEach((node) => node.remove());
    track.appendChild(baseSet.cloneNode(true));
    while (track.scrollWidth < viewport.clientWidth * 2.2) track.appendChild(baseSet.cloneNode(true));
    distance = Math.max(320, Math.round(baseSet.getBoundingClientRect().width));
  };
  const apply = () => track.style.transform = `translate3d(${-distance + offset}px,0,0)`;

  const tick = (time) => {
    if (!last) last = time;
    const dt = Math.min(0.05, (time - last) / 1000);
    last = time;
    speed += (targetSpeed - speed) * (1 - Math.exp(-10 * dt));
    offset += speed * dt;
    if (offset >= distance) offset -= distance;
    apply();
    requestAnimationFrame(tick);
  };

  build();
  apply();
  requestAnimationFrame(tick);

  root.addEventListener("mouseenter", () => { targetSpeed = Number(root.dataset.speedHover || 32); });
  root.addEventListener("mouseleave", () => { targetSpeed = Number(root.dataset.speed || 80); });
  window.addEventListener("resize", () => requestAnimationFrame(() => { build(); apply(); }), { passive: true });
}

function initFooterPulse() {
  const socials = qsa("footer .footer-socials .social");
  const footer = qs("footer");
  const wrap = qs("footer .footer-socials");
  if (!socials.length || !footer || !wrap || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let enabled = false;
  let timer = 0;
  let last = -1;

  const stop = () => {
    enabled = false;
    clearTimeout(timer);
    socials.forEach((el) => el.classList.remove("is-pulse"));
  };
  const loop = () => {
    if (!enabled) return;
    let index = Math.floor(Math.random() * socials.length);
    if (index === last) index = (index + 1) % socials.length;
    last = index;
    const duration = 1600 + Math.floor(Math.random() * 2200);
	    const el = socials[index];
	    const x = socials.length > 1 ? (index / (socials.length - 1)) * 100 : 50;
	    wrap.style.setProperty("--footer-glow-x", `${x}%`);
	    el.style.setProperty("--pulse-dur", `${duration}ms`);
    el.classList.remove("is-pulse");
    void el.offsetWidth;
    el.classList.add("is-pulse");
    setTimeout(() => el.classList.remove("is-pulse"), duration + 40);
    timer = setTimeout(loop, 700 + Math.floor(Math.random() * 1400));
  };
  const start = () => {
    if (enabled) return;
    enabled = true;
    loop();
  };

  const io = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (entry?.isIntersecting && entry.intersectionRatio > 0.22) start();
    else stop();
	  }, { threshold: [0, 0.22, 0.6, 1], rootMargin: "0px 0px -12% 0px" });
	  io.observe(footer);
}

function initImageFallbacks() {
  const makeFallback = (label) => {
    const safe = String(label || "Besson Agency")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
        <defs>
          <radialGradient id="g" cx="35%" cy="20%" r="70%">
            <stop offset="0" stop-color="#303030"/>
            <stop offset=".55" stop-color="#111"/>
            <stop offset="1" stop-color="#050505"/>
          </radialGradient>
        </defs>
        <rect width="1600" height="900" fill="url(#g)"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
          fill="#f5f5f5" font-family="Arial, Helvetica, sans-serif" font-size="72"
          letter-spacing="10">${safe}</text>
      </svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };

  qsa("img").forEach((img) => {
    img.addEventListener("error", () => {
      if (img.dataset.fallbackApplied === "1") return;
      img.dataset.fallbackApplied = "1";
      img.src = makeFallback(img.alt || "Besson Agency");
    }, { once: true });
  });
}

function boot() {
  if (document.documentElement.dataset.booted === "1") return;
  document.documentElement.dataset.booted = "1";

  try {
    initYear();
    initLogo();
    initWordSwap();
    initHeroReveal();
    initHeroVideo();
    initNav();
    initDesktopMenu();
    initContactPill();
    initContactsModal();
	    initCursor();
	    initWorkReveal();
	    initWorkFilter();
	    initResources();
    initReviews();
    initTeam();
	    initHowPath();
    initProjectStart();
	    initOfficeCards();
    initNews();
	    initProjectModal();
    initFloatingCta();
    initEstimateOpeners();
    initCookieBanner();
    initContactForm();
    initGlobeStrip();
    initGlobeDomeScroll();
    initNebula();
    initLogoMarquee();
    initFooterPulse();
    initImageFallbacks();
    initLanguageDropdown();
    initLanguageSwitch();

    document.documentElement.classList.remove("no-js");
    document.documentElement.classList.add("js");
  } catch (error) {
    console.error("[BESSON] script crashed:", error);
    document.documentElement.classList.add("no-js");
    document.documentElement.classList.remove("js");
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
