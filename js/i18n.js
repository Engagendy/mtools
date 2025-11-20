/**
 * Fixed Internationalization (i18n) System
 * Bilingual support for English and Arabic
 */

class I18nSystem {
    constructor() {
        this.currentLanguage = 'en';
        this.translations = {};
        this.direction = 'ltr';
        this.debugLogged = false;

        this.init();
    }

    init() {
        this.loadTranslations();
        this.detectLanguage();
        this.setupLanguageToggle();
    }

    /**
     * Load all translations with proper nested structure
     */
    loadTranslations() {
        this.translations = {
            en: {
                nav: {
                    home: 'Home',
                    business_cards: 'Business Cards',
                    discount_offers: 'Discount Offers',
                    social_media: 'Social Media',
                    qr_generator: 'QR Codes',
                    language: 'العربية'
                },
                home: {
                    title: 'Marketing Tools Suite',
                    subtitle: 'Create professional marketing materials with our free, easy-to-use tools. Design business cards, discount offers, and social media content in minutes.'
                },
                business_card: {
                    title: 'Business Card Designer',
                    subtitle: 'Create professional business cards with bilingual support',
                    description: 'Create professional bilingual business cards with custom logos, colors, and contact information.',
                    features: {
                        bilingual: 'English & Arabic Support',
                        logo: 'Custom Logo Upload',
                        qr: 'QR Code Integration',
                        export: 'Print-Ready Export'
                    },
                    button: 'Start Designing',
                    tabs: {
                        english: 'English Side',
                        arabic: 'Arabic Side',
                        design: 'Design'
                    },
                    english: {
                        shop_details: '👔 English Shop Details',
                        shop_name: 'Shop Name (English)',
                        shop_name_placeholder: 'Enter shop name in English',
                        tagline: 'Tagline/Location',
                        tagline_placeholder: 'Enter tagline or location',
                        phone: 'Phone Number',
                        phone_placeholder: 'Enter phone number',
                        email: 'Email',
                        email_placeholder: 'Enter email address',
                        website: 'Website',
                        website_placeholder: 'Enter website URL',
                        services_title: '📱 Services',
                        new_service_placeholder: 'Add new service...',
                        add_service: '+ Add Service'
                    },
                    preview: {
                        title: 'Card Preview',
                        description: 'Your business cards will appear below'
                    },
                    arabic: {
                        shop_details: '👔 تفاصيل المتجر العربية',
                        shop_name: 'اسم المتجر (عربي)',
                        shop_name_placeholder: 'أدخل اسم المتجر بالعربية',
                        tagline: 'الشعار/الموقع',
                        tagline_placeholder: 'أدخل الشعار أو الموقع',
                        phone: 'رقم الهاتف',
                        phone_placeholder: 'أدخل رقم الهاتف',
                        email: 'البريد الإلكتروني',
                        email_placeholder: 'أدخل البريد الإلكتروني',
                        website: 'الموقع الإلكتروني',
                        website_placeholder: 'أدخل رابط الموقع',
                        services_title: '📱 الخدمات',
                        new_service_placeholder: 'إضافة خدمة جديدة...',
                        add_service: '+ إضافة خدمة'
                    },
                    design: {
                        colors_title: '🎨 Colors & Design',
                        bg_color: 'Background Color',
                        text_color: 'Text Color',
                        logo_title: '📍 Logo & Icon',
                        logo_label: 'Logo/Icon - Upload Image or Emoji',
                        logo_placeholder: '📱 (or upload below)',
                        logo_help: 'Upload an image to replace emoji',
                        qr_title: '🔖 QR Code',
                        qr_upload: 'QR Code - Upload Image',
                        qr_help: 'Upload your QR code image',
                        qr_label: 'QR Text Label',
                        qr_label_placeholder: 'SCAN ME',
                        print: '🖨️ Print',
                        download: '📥 Download',
                        color_settings: 'Color Settings',
                        assets: 'Logo & QR Code',
                        export_english: 'Export English Card',
                        export_arabic: 'Export Arabic Card'
                    },
                    services_en: 'Services',
                    services_ar: 'الخدمات'
                },
                discount_offer: {
                    title: 'Discount Offer Creator',
                    subtitle: 'Design attractive promotional materials and discount flyers',
                    description: 'Design attractive discount flyers and promotional materials for your business.',
                    features: {
                        editor: 'Drag & Drop Editor',
                        categories: 'Multiple Categories',
                        custom: 'Custom Colors & Images',
                        export: 'High Quality Export'
                    },
                    button: 'Create Offers',
                    format_selector: {
                        title: 'Select Template Format'
                    },
                    formats: {
                        story: 'Story',
                        post: 'Post',
                        a4: 'A4 Flyer',
                        wide: 'Banner'
                    },
                    tabs: {
                        content: 'Content',
                        design: 'Design',
                        export: 'Export'
                    },
                    content: {
                        store_info: '🏪 Store Information',
                        store_name: 'Store Name',
                        tagline: 'Tagline',
                        location: 'Location',
                        main_title: 'Main Title',
                        description: 'Description',
                        categories: '🏷️ Discount Categories',
                        contact: '📞 Contact Information',
                        expiry_date: 'Expiry Date',
                        phone: 'Phone Number',
                        tiktok: 'TikTok Handle'
                    },
                    design: {
                        text_formatting: 'Text Formatting',
                        font_size: 'Font Size',
                        font_family: 'Font Family',
                        alignment: 'Alignment',
                        copy: 'Copy',
                        delete: 'Delete',
                        colors: '🎨 Colors',
                        background_color: 'Background Color',
                        badge_color: 'Badge Color',
                        text_color: 'Text Color',
                        images: '🖼️ Images',
                        logo: 'Logo',
                        qr_codes: 'QR Codes (4 slots)',
                        background_image: 'Background Image',
                        bg_image_note: 'Will overlay background color'
                    },
                    export: {
                        title: '💾 Export Options',
                        description: 'Export your discount flyer as a high-quality PNG image.',
                        export_png: 'Export as PNG'
                    },
                    preview: {
                        title: 'Live Preview'
                    },
                    update_preview: 'Update Preview'
                },
                discount: {
                    editor: {
                        title: 'Offer Editor'
                    },
                    store: {
                        title: 'Store Information',
                        name: 'Store Name',
                        name_placeholder: 'Enter your store name',
                        tagline: 'Tagline or Promotional Text',
                        tagline_placeholder: 'Enter tagline or slogan',
                        location: 'Location/City',
                        location_placeholder: 'Enter location or city'
                    },
                    content: {
                        title: 'Titles and Description',
                        main_title: 'Main Offer Title',
                        main_title_placeholder: 'Enter the main offer title',
                        description: 'Terms and Notes',
                        description_placeholder: 'Enter terms, conditions, and notes'
                    },
                    logo: {
                        title: 'Logo and Background',
                        upload: 'Upload Company Logo',
                        upload_help: '📤 Choose a logo image (PNG/JPG) - will appear at the top of the offer',
                        width: 'Logo Width',
                        height: 'Logo Height',
                        show: 'Show Logo'
                    },
                    background: {
                        title: 'Background',
                        color: 'Color',
                        image: 'Image',
                        bg_color: 'Background Color',
                        bg_color_help: 'Choose your preferred background color',
                        bg_image: 'Background Image',
                        bg_image_help: '📤 Choose a background image (PNG/JPG)'
                    },
                    categories: {
                        title: 'Discounts and Categories',
                        category1: 'Category 1',
                        category2: 'Category 2',
                        category3: 'Category 3',
                        category4: 'Category 4',
                        name: 'Category Name',
                        percentage: 'Percentage (%)'
                    },
                    contact: {
                        title: 'Date and Contact',
                        expiry: 'Valid Until (Date)',
                        phone: 'Phone Number',
                        phone_placeholder: 'Enter phone number',
                        tiktok: 'TikTok Account @'
                    },
                    colors: {
                        title: 'Colors and Customization',
                        discount_color: 'Discount Color'
                    },
                    qr: {
                        title: 'QR Code Images (4 images)',
                        qr1: 'QR Code 1',
                        qr2: 'QR Code 2',
                        qr3: 'QR Code 3',
                        qr4: 'QR Code 4',
                        upload_help: '📤 Choose QR image'
                    },
                    actions: {
                        update: 'Update Preview',
                        export: 'Export as PNG'
                    }
                },
                social_media: {
                    title: 'Social Media Designer',
                    subtitle: 'Create content for Instagram, TikTok, Facebook, and more',
                    description: 'Create content perfectly sized for Instagram, TikTok, Facebook, and other platforms.',
                    features: {
                        platforms: 'Multi-Platform Support',
                        dimensions: 'Perfect Dimensions',
                        elements: 'Drag & Drop Elements',
                        export: 'Export for All Platforms'
                    },
                    button: 'Design Content',
                    editor_title: 'Content Editor',
                    store_info: 'Store Information',
                    store_name: 'Store Name',
                    store_name_placeholder: 'Enter your store name',
                    tagline: 'Tagline or Promotional Text',
                    tagline_placeholder: 'Enter tagline or slogan',
                    titles_content: 'Titles and Content',
                    main_title: 'Offer Title',
                    main_title_placeholder: 'Enter the main title for your offer',
                    subtitle: 'Additional Description',
                    subtitle_placeholder: 'Enter additional description',
                    categories_discounts: 'Categories and Discounts',
                    category: 'Category',
                    name: 'Name',
                    discount: 'Discount (%)',
                    contact_info: 'Contact Information',
                    phone_number: 'Phone Number (optional)',
                    phone_placeholder: 'Enter phone number',
                    social_handle: 'Social Media Handle',
                    social_placeholder: 'Enter social media handle',
                    logo: 'Logo',
                    upload_logo: 'Upload Logo',
                    logo_help: '📤 Choose a logo image (PNG/JPG)',
                    logo_width: 'Logo Size (Width)',
                    logo_height: 'Logo Size (Height)',
                    show_logo: 'Show Logo',
                    colors_background: 'Colors and Background',
                    bg_color: 'Background Color',
                    accent_color: 'Discount Color',
                    background_image: 'Background Image (optional)',
                    background_help: '📤 Choose an image to use as background (supports PNG/JPG)',
                    use_background_image: 'Use background image instead of color',
                    move_elements: 'Move Elements',
                    move_help: 'Click and drag elements to reposition them',
                    reset_positions: 'Reset Positions',
                    export_format: 'Export Format',
                    export_current_platform: 'Export for Current Platform'
                },
                qr_generator: {
                    title: 'QR Code Generator',
                    subtitle: 'Create branded QR codes for your business',
                    description: 'Create branded QR codes for promotions, coupons, and WhatsApp contact.',
                    features: {
                        whatsapp: 'WhatsApp Direct Link',
                        custom_url: 'Custom URLs & Links',
                        branding: 'Branded QR Design',
                        export: 'PNG Image Export'
                    },
                    button: 'Generate QR Codes',
                    tabs: {
                        content: 'Content',
                        design: 'Design',
                        export: 'Export'
                    },
                    content: {
                        qr_type: 'QR Code Type',
                        url: 'Website URL',
                        url_placeholder: 'https://yourwebsite.com',
                        whatsapp_number: 'WhatsApp Number',
                        whatsapp_placeholder: '+971501234567',
                        whatsapp_message: 'Pre-filled Message (optional)',
                        whatsapp_message_placeholder: 'Hello! I\'m interested in...',
                        text: 'Plain Text',
                        text_placeholder: 'Enter text here',
                        generate: 'Generate QR Code'
                    },
                    design: {
                        size: 'QR Code Size',
                        foreground_color: 'Foreground Color',
                        background_color: 'Background Color'
                    },
                    export: {
                        title: 'Export QR Code',
                        description: 'Download your QR code as PNG image',
                        download: 'Download PNG',
                        download_all: 'Download All QR Codes'
                    },
                    types: {
                        url: 'Website URL',
                        whatsapp: 'WhatsApp',
                        text: 'Plain Text'
                    },
                    preview: {
                        title: 'QR Codes Preview'
                    }
                },
                common: {
                    back: 'Back to Tools',
                    loading: 'Loading tool...',
                    error: 'An error occurred',
                    success: 'Success!',
                    github: 'GitHub',
                    contact: 'Contact',
                    about: 'About',
                    copyright: '© 2024 Marketing Tools Suite. Free and open-source marketing tools.',
                    made_with_love: 'Made with ❤️ for the community'
                },
                notification: {
                    tool_loaded: 'Tool loaded successfully!',
                    tool_error: 'Failed to load tool. Please try again.',
                    not_found: 'Tool not found!'
                }
            },
            ar: {
                nav: {
                    home: 'الرئيسية',
                    business_cards: 'بطاقات الأعمال',
                    discount_offers: 'عروض الخصم',
                    social_media: 'وسائل التواصل',
                    qr_generator: 'رموز QR',
                    language: 'English'
                },
                home: {
                    title: 'مجموعة أدوات التسويق',
                    subtitle: 'اصنع مواد تسويقية احترافية باستخدام أدواتنا المجانية وسهلة الاستخدام. صمم بطاقات أعمال وعروض خصم ومحتوى وسائل التواصل في دقائق.'
                },
                business_card: {
                    title: 'مصمم بطاقات الأعمال',
                    subtitle: 'اصنع بطاقات أعمال احترافية بدعم ثنائي اللغة',
                    description: 'اصنع بطاقات أعمال احترافية ثنائية اللغة مع شعارات مخصصة وألوان ومعلومات اتصال.',
                    features: {
                        bilingual: 'دعم العربية والإنجليزية',
                        logo: 'رفع شعار مخصص',
                        qr: 'دمج رمز QR',
                        export: 'تصدير جاهز للطباعة'
                    },
                    button: 'ابدأ التصميم',
                    tabs: {
                        english: 'الجانب الإنجليزي',
                        arabic: 'الجانب العربي',
                        design: 'التصميم'
                    },
                    english: {
                        shop_details: '👔 تفاصيل المتجر الإنجليزية',
                        shop_name: 'اسم المتجر (إنجليزي)',
                        shop_name_placeholder: 'أدخل اسم المتجر بالإنجليزية',
                        tagline: 'الشعار/الموقع',
                        tagline_placeholder: 'أدخل الشعار أو الموقع',
                        phone: 'رقم الهاتف',
                        phone_placeholder: 'أدخل رقم الهاتف',
                        email: 'البريد الإلكتروني',
                        email_placeholder: 'أدخل البريد الإلكتروني',
                        website: 'الموقع الإلكتروني',
                        website_placeholder: 'أدخل رابط الموقع',
                        services_title: '📱 الخدمات',
                        new_service_placeholder: 'إضافة خدمة جديدة...',
                        add_service: '+ إضافة خدمة'
                    },
                    arabic: {
                        shop_details: '👔 تفاصيل المتجر العربية',
                        shop_name: 'اسم المتجر (عربي)',
                        shop_name_placeholder: 'أدخل اسم المتجر بالعربية',
                        tagline: 'الشعار/الموقع',
                        tagline_placeholder: 'أدخل الشعار أو الموقع',
                        phone: 'رقم الهاتف',
                        phone_placeholder: 'أدخل رقم الهاتف',
                        email: 'البريد الإلكتروني',
                        email_placeholder: 'أدخل البريد الإلكتروني',
                        website: 'الموقع الإلكتروني',
                        website_placeholder: 'أدخل رابط الموقع',
                        services_title: '📱 الخدمات',
                        new_service_placeholder: 'إضافة خدمة جديدة...',
                        add_service: '+ إضافة خدمة'
                    },
                    design: {
                        colors_title: '🎨 الألوان والتصميم',
                        bg_color: 'لون الخلفية',
                        text_color: 'لون النص',
                        logo_title: '📍 الشعار والأيقونة',
                        logo_label: 'الشعار/الأيقونة - رفع صورة أو رمز تعبيري',
                        logo_placeholder: '📱 (أو ارفع أدناه)',
                        logo_help: 'ارفع صورة لاستبدال الرمز التعبيري',
                        qr_title: '🔖 رمز الاستجابة السريعة',
                        qr_upload: 'رمز QR - رفع صورة',
                        qr_help: 'ارفع صورة رمز QR الخاص بك',
                        qr_label: 'تسمية نص QR',
                        qr_label_placeholder: 'امسحني',
                        print: '🖨️ طباعة',
                        download: '📥 تحميل',
                        color_settings: 'إعدادات الألوان',
                        assets: 'الشعار ورمز QR',
                        export_english: 'تصدير البطاقة الإنجليزية',
                        export_arabic: 'تصدير البطاقة العربية'
                    },
                    preview: {
                        title: 'معاينة البطاقة',
                        description: 'ستظهر بطاقات الأعمال أدناه'
                    },
                    services_en: 'Services',
                    services_ar: 'الخدمات'
                },
                discount_offer: {
                    title: 'منشئ عروض الخصم',
                    subtitle: 'صمم مواد ترويجية جذابة ومنشورات خصم',
                    description: 'صمّم منشورات خصم جذابة ومواد ترويجية لعملك بسرعة ودقة وأناقة واحترافية عالية.',
                    features: {
                        editor: 'محرر السحب والإفلات',
                        categories: 'فئات متعددة',
                        custom: 'ألوان وصور مخصصة',
                        export: 'تصدير عالي الجودة'
                    },
                    button: 'إنشاء العروض',
                    format_selector: {
                        title: 'اختر تنسيق القالب'
                    },
                    formats: {
                        story: 'قصة',
                        post: 'منشور',
                        a4: 'منشور A4',
                        wide: 'بانر عريض'
                    },
                    tabs: {
                        content: 'المحتوى',
                        design: 'التصميم',
                        export: 'التصدير'
                    },
                    content: {
                        store_info: '🏪 معلومات المتجر',
                        store_name: 'اسم المتجر',
                        tagline: 'الشعار',
                        location: 'الموقع',
                        main_title: 'العنوان الرئيسي',
                        description: 'الوصف',
                        categories: '🏷️ فئات الخصم',
                        contact: '📞 معلومات الاتصال',
                        expiry_date: 'تاريخ الانتهاء',
                        phone: 'رقم الهاتف',
                        tiktok: 'حساب تيك توك'
                    },
                    design: {
                        text_formatting: 'تنسيق النص',
                        font_size: 'حجم الخط',
                        font_family: 'نوع الخط',
                        alignment: 'المحاذاة',
                        copy: 'نسخ',
                        delete: 'حذف',
                        colors: '🎨 الألوان',
                        background_color: 'لون الخلفية',
                        badge_color: 'لون الشارة',
                        text_color: 'لون النص',
                        images: '🖼️ الصور',
                        logo: 'الشعار',
                        qr_codes: 'رموز QR (4 خانات)',
                        background_image: 'صورة الخلفية',
                        bg_image_note: 'سيتم وضعها فوق لون الخلفية'
                    },
                    export: {
                        title: '💾 خيارات التصدير',
                        description: 'صدّر منشور الخصم الخاص بك كصورة PNG عالية الجودة.',
                        export_png: 'تصدير كـ PNG'
                    },
                    preview: {
                        title: 'معاينة مباشرة'
                    },
                    update_preview: 'تحديث المعاينة'
                },
                discount: {
                    editor: {
                        title: 'محرر العرض'
                    },
                    store: {
                        title: 'معلومات المتجر',
                        name: 'اسم المتجر',
                        name_placeholder: 'أدخل اسم متجرك',
                        tagline: 'الشعار أو النص الترويجي',
                        tagline_placeholder: 'أدخل الشعار أو الجملة الترويجية',
                        location: 'المكان/المدينة',
                        location_placeholder: 'أدخل المكان أو المدينة'
                    },
                    content: {
                        title: 'العناوين والوصف',
                        main_title: 'عنوان العرض الرئيسي',
                        main_title_placeholder: 'أدخل عنوان العرض الرئيسي',
                        description: 'الشروط والملاحظات',
                        description_placeholder: 'أدخل الشروط والأحكام والملاحظات'
                    },
                    logo: {
                        title: 'الشعار والخلفية',
                        upload: 'رفع شعار الشركة',
                        upload_help: '📤 اختر صورة للشعار (PNG/JPG) - سيظهر في أعلى العرض',
                        width: 'عرض الشعار',
                        height: 'ارتفاع الشعار',
                        show: 'إظهار الشعار'
                    },
                    background: {
                        title: 'الخلفية',
                        color: 'لون',
                        image: 'صورة',
                        bg_color: 'لون الخلفية',
                        bg_color_help: 'اختر لون الخلفية المفضل',
                        bg_image: 'صورة الخلفية',
                        bg_image_help: '📤 اختر صورة للخلفية (PNG/JPG)'
                    },
                    categories: {
                        title: 'الخصومات والفئات',
                        category1: 'الفئة 1',
                        category2: 'الفئة 2',
                        category3: 'الفئة 3',
                        category4: 'الفئة 4',
                        name: 'اسم الفئة',
                        percentage: 'النسبة (%)'
                    },
                    contact: {
                        title: 'التاريخ والاتصال',
                        expiry: 'صالح حتى (التاريخ)',
                        phone: 'رقم الهاتف',
                        phone_placeholder: 'أدخل رقم الهاتف',
                        tiktok: 'حساب TikTok @'
                    },
                    colors: {
                        title: 'الألوان والتخصيص',
                        discount_color: 'لون الخصم'
                    },
                    qr: {
                        title: 'صور رمز QR (4 صور)',
                        qr1: 'رمز QR 1',
                        qr2: 'رمز QR 2',
                        qr3: 'رمز QR 3',
                        qr4: 'رمز QR 4',
                        upload_help: '📤 اختر صورة QR'
                    },
                    actions: {
                        update: 'تحديث المعاينة',
                        export: 'تصدير كـ PNG'
                    }
                },
                social_media: {
                    title: 'مصمم وسائل التواصل',
                    subtitle: 'اصنع محتوى لإنستغرام وتيك توك وفيسبوك وأكثر',
                    description: 'اصنع محتوى مثالي الأبعاد لإنستغرام وتيك توك وفيسبوك ومنصات أخرى.',
                    features: {
                        platforms: 'دعم منصات متعددة',
                        dimensions: 'أبعاد مثالية',
                        elements: 'عناصر سحب وإفلات',
                        export: 'تصدير لجميع المنصات'
                    },
                    button: 'تصميم المحتوى',
                    editor_title: 'محرر المحتوى',
                    store_info: 'معلومات المتجر',
                    store_name: 'اسم المتجر',
                    store_name_placeholder: 'أدخل اسم متجرك',
                    tagline: 'الشعار أو النص الترويجي',
                    tagline_placeholder: 'أدخل الشعار أو الجملة الترويجية',
                    titles_content: 'العناوين والمحتوى',
                    main_title: 'عنوان العرض',
                    main_title_placeholder: 'أدخل العنوان الرئيسي لعرضك',
                    subtitle: 'الوصف الإضافي',
                    subtitle_placeholder: 'أدخل وصف إضافي',
                    categories_discounts: 'الفئات والخصومات',
                    category: 'الفئة',
                    name: 'اسم',
                    discount: 'خصم (%)',
                    contact_info: 'معلومات الاتصال',
                    phone_number: 'رقم الهاتف (اختياري)',
                    phone_placeholder: 'أدخل رقم الهاتف',
                    social_handle: 'حساب وسائل التواصل',
                    social_placeholder: 'أدخل حساب وسائل التواصل',
                    logo: 'الشعار',
                    upload_logo: 'رفع الشعار',
                    logo_help: '📤 اختر صورة للشعار (PNG/JPG)',
                    logo_width: 'حجم الشعار (العرض)',
                    logo_height: 'حجم الشعار (الارتفاع)',
                    show_logo: 'إظهار الشعار',
                    colors_background: 'الألوان والخلفية',
                    bg_color: 'لون الخلفية',
                    accent_color: 'لون الخصم',
                    background_image: 'صورة الخلفية (اختياري)',
                    background_help: '📤 اختر صورة لاستخدامها كخلفية (يدعم PNG/JPG)',
                    use_background_image: 'استخدام صورة الخلفية بدلاً من اللون',
                    move_elements: 'حرّك العناصر',
                    move_help: 'انقر واسحب العناصر لإعادة ترتيبها',
                    reset_positions: 'إعادة تعيين المواضع',
                    export_format: 'تنسيق التصدير',
                    export_current_platform: 'تصدير للمنصة الحالية'
                },
                qr_generator: {
                    title: 'منشئ رموز QR',
                    subtitle: 'اصنع رموز QR مخصصة لعملك',
                    description: 'اصنع رموز QR مخصصة للعروض الترويجية والكوبونات والتواصل عبر واتساب.',
                    features: {
                        whatsapp: 'رابط واتساب مباشر',
                        custom_url: 'روابط وعناوين مخصصة',
                        branding: 'تصميم QR مخصص',
                        export: 'تصدير صورة PNG'
                    },
                    button: 'إنشاء رموز QR',
                    tabs: {
                        content: 'المحتوى',
                        design: 'التصميم',
                        export: 'التصدير'
                    },
                    content: {
                        qr_type: 'نوع رمز QR',
                        url: 'رابط الموقع',
                        url_placeholder: 'https://موقعك.com',
                        whatsapp_number: 'رقم واتساب',
                        whatsapp_placeholder: '+971501234567',
                        whatsapp_message: 'رسالة مسبقة (اختياري)',
                        whatsapp_message_placeholder: 'مرحباً! أنا مهتم بـ...',
                        text: 'نص عادي',
                        text_placeholder: 'أدخل النص هنا',
                        generate: 'إنشاء رمز QR'
                    },
                    design: {
                        size: 'حجم رمز QR',
                        foreground_color: 'لون المقدمة',
                        background_color: 'لون الخلفية'
                    },
                    export: {
                        title: 'تصدير رمز QR',
                        description: 'حمّل رمز QR كصورة PNG',
                        download: 'تحميل PNG',
                        download_all: 'تحميل جميع رموز QR'
                    },
                    types: {
                        url: 'رابط الموقع',
                        whatsapp: 'واتساب',
                        text: 'نص عادي'
                    },
                    preview: {
                        title: 'معاينة رموز QR'
                    }
                },
                common: {
                    back: 'العودة للأدوات',
                    loading: 'جاري تحميل الأداة...',
                    error: 'حدث خطأ',
                    success: 'نجح!',
                    github: 'جيت هب',
                    contact: 'اتصل بنا',
                    about: 'حول',
                    copyright: '© 2024 مجموعة أدوات التسويق. أدوات تسويق مجانية ومفتوحة المصدر.',
                    made_with_love: 'صُنع بـ ❤️ للمجتمع'
                },
                notification: {
                    tool_loaded: 'تم تحميل الأداة بنجاح!',
                    tool_error: 'فشل في تحميل الأداة. حاول مرة أخرى.',
                    not_found: 'الأداة غير موجودة!'
                }
            }
        };
    }

    // ... rest of the class methods from the original file
    detectLanguage() {
        const saved = localStorage.getItem('marketing-tools-language');
        if (saved && ['en', 'ar'].includes(saved)) {
            this.setLanguage(saved);
            return;
        }
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        if (langParam && ['en', 'ar'].includes(langParam)) {
            this.setLanguage(langParam);
            return;
        }
        // Default to Arabic instead of browser detection
        this.setLanguage('ar');
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        this.direction = lang === 'ar' ? 'rtl' : 'ltr';

        document.documentElement.lang = lang;
        document.documentElement.dir = this.direction;
        document.body.classList.toggle('rtl', lang === 'ar');

        localStorage.setItem('marketing-tools-language', lang);
        this.updatePageText();
        this.updateFonts();

        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang, direction: this.direction }
        }));
    }

    t(key, fallback = '') {
        try {
            if (!this.debugLogged) {
                console.log('🔍 Translation debug - Current language:', this.currentLanguage);
                console.log('🔍 Available keys:', Object.keys(this.translations[this.currentLanguage] || {}));
                this.debugLogged = true;
            }

            const keys = key.split('.');
            let value = this.translations[this.currentLanguage];

            for (const k of keys) {
                if (value && typeof value === 'object') {
                    value = value[k];
                } else {
                    console.warn(`❌ Translation key not found: ${key} at ${k}`);
                    return fallback || key;
                }
            }

            if (value === undefined || value === null) {
                console.warn(`❌ Translation value empty for key: ${key}`);
                return fallback || key;
            }

            return value;
        } catch (error) {
            console.error(`❌ Translation error for key ${key}:`, error);
            return fallback || key;
        }
    }

    tArray(key) {
        const value = this.t(key);
        return Array.isArray(value) ? value : [];
    }

    toggleLanguage() {
        const newLang = this.currentLanguage === 'en' ? 'ar' : 'en';
        this.setLanguage(newLang);
    }

    updatePageText() {
        console.log(`🌐 Updating page text for language: ${this.currentLanguage}`);

        const i18nElements = document.querySelectorAll('[data-i18n]');
        console.log(`Found ${i18nElements.length} elements with data-i18n`);

        i18nElements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            element.textContent = translation;
        });

        document.querySelectorAll('[data-i18n-html]').forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            element.innerHTML = this.t(key);
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });

        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });
    }

    // Alias for updatePageText - for compatibility with tools
    updatePageTranslations() {
        this.updatePageText();
    }

    updateFonts() {
        // Always use Almarai as primary font for both languages
        document.body.style.fontFamily = "'Almarai', 'Inter', system-ui, sans-serif";

        // Set font weights appropriately for each language
        if (this.currentLanguage === 'ar') {
            document.body.style.fontWeight = '400';
            document.documentElement.style.setProperty('--font-weight-normal', '400');
            document.documentElement.style.setProperty('--font-weight-bold', '700');
        } else {
            document.body.style.fontWeight = '400';
            document.documentElement.style.setProperty('--font-weight-normal', '400');
            document.documentElement.style.setProperty('--font-weight-bold', '700');
        }
    }

    setupLanguageToggle() {
        let toggle = document.getElementById('language-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => {
                this.toggleLanguage();
            });
        }
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    isRTL() {
        return this.direction === 'rtl';
    }

    addToTemplateEngine(templateEngine) {
        if (!templateEngine) return;

        templateEngine.registerHelper('t', (key, fallback = '') => {
            return this.t(key, fallback);
        });

        templateEngine.registerHelper('tArray', (key) => {
            return this.tArray(key);
        });

        templateEngine.registerHelper('isRTL', () => {
            return this.isRTL();
        });

        templateEngine.registerHelper('currentLang', () => {
            return this.getCurrentLanguage();
        });
    }
}

// Create global instance
window.i18n = new I18nSystem();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18nSystem;
}