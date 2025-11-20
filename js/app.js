/**
 * Marketing Tools Suite - Main Application
 * Professional modular JavaScript architecture
 */

class MarketingToolsApp {
    constructor() {
        this.currentTool = 'home';
        this.toolsLoaded = new Set();
        this.toolInstances = new Map();
        this.isLoading = false;

        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.setupEventListeners();
        this.setupNavigation();
        this.setupHashRouting();

        // Handle initial route from hash
        this.handleHashChange();

        // Ensure loading overlay is hidden on init
        this.hideLoading();
    }

    /**
     * Setup hash-based routing
     */
    setupHashRouting() {
        // Listen for hash changes
        window.addEventListener('hashchange', () => {
            this.handleHashChange();
        });
    }

    /**
     * Handle hash change events
     */
    async handleHashChange() {
        const hash = window.location.hash.substring(1); // Remove the '#'

        if (!hash || hash === '') {
            this.showHome(false);
        } else if (hash === 'business-card' || hash === 'discount-offer' || hash === 'social-media' || hash === 'qr-generator') {
            await this.showTool(hash, false);
        } else {
            // Unknown hash, go to home
            this.showHome(false);
        }
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        mobileMenuBtn?.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn?.contains(e.target) && !mobileMenu?.contains(e.target)) {
                mobileMenu?.classList.add('hidden');
            }
        });

        // Handle browser navigation
        // Note: Using hash-based routing instead of popstate
        // The hashchange event is handled in setupHashRouting()

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'h':
                        e.preventDefault();
                        this.showHome();
                        break;
                    case '1':
                        e.preventDefault();
                        this.showTool('business-card');
                        break;
                    case '2':
                        e.preventDefault();
                        this.showTool('discount-offer');
                        break;
                    case '3':
                        e.preventDefault();
                        this.showTool('social-media');
                        break;
                    case '4':
                        e.preventDefault();
                        this.showTool('qr-generator');
                        break;
                }
            }
        });
    }

    /**
     * Setup navigation styles
     */
    setupNavigation() {
        const style = document.createElement('style');
        style.textContent = `
            .nav-link {
                @apply flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-200;
            }
            
            .nav-link.active {
                @apply text-primary-600 bg-primary-50;
            }
            
            .mobile-nav-link {
                @apply px-4 py-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors duration-200;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Show home section
     */
    showHome(updateHistory = true) {
        if (this.currentTool === 'home') return;

        this.currentTool = 'home';

        // Hide all tool sections
        document.querySelectorAll('.tool-section').forEach(section => {
            section.classList.add('hidden');
        });

        // Show home section
        const homeSection = document.getElementById('home-section');
        const footer = document.getElementById('main-footer');

        if (homeSection) homeSection.classList.remove('hidden');
        if (footer) footer.style.display = 'block';

        // Update navigation
        this.updateNavigation('home');

        // Update URL and title (using hash-based routing)
        if (updateHistory) {
            window.location.hash = '';
        }
        document.title = 'Marketing Tools Suite | Create Professional Marketing Materials';

        // Close mobile menu
        document.getElementById('mobile-menu')?.classList.add('hidden');
    }

    /**
     * Show specific tool
     */
    async showTool(toolName, updateHistory = true) {
        console.log(`showTool called with: ${toolName}, updateHistory: ${updateHistory}`);

        if (this.currentTool === toolName) {
            console.log('Tool already active, skipping');
            return;
        }

        if (this.isLoading) {
            console.log('Already loading, skipping');
            return;
        }

        this.currentTool = toolName;
        this.showLoading();

        try {
            console.log('Starting tool switch...');

            // Hide home and footer
            const homeSection = document.getElementById('home-section');
            const footer = document.getElementById('main-footer');

            if (homeSection) {
                homeSection.classList.add('hidden');
                console.log('Home section hidden');
            }
            if (footer) {
                footer.style.display = 'none';
                console.log('Footer hidden');
            }

            // Hide all tool sections
            document.querySelectorAll('.tool-section').forEach(section => {
                section.classList.add('hidden');
            });
            console.log('All tool sections hidden');

            // Clean up old tool scripts to prevent conflicts
            this.cleanupOldToolScripts(toolName);

            // Show target tool section
            const toolSection = document.getElementById(`${toolName}-section`);
            if (toolSection) {
                toolSection.classList.remove('hidden');
                console.log(`Tool section ${toolName} shown`);
            } else {
                console.error(`Tool section not found: ${toolName}-section`);
            }

            // Load tool if not already loaded
            if (!this.toolsLoaded.has(toolName)) {
                console.log(`Tool ${toolName} not loaded yet, loading...`);

                // Add timeout to prevent infinite loading
                const loadPromise = this.loadTool(toolName);
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('Tool loading timeout')), 10000); // 10 second timeout
                });

                await Promise.race([loadPromise, timeoutPromise]);
            } else {
                console.log(`Tool ${toolName} already loaded, refreshing...`);

                // Tool already loaded, but refresh it
                if (toolName === 'business-card' && window.initBusinessCardToolIfNeeded) {
                    setTimeout(() => {
                        window.initBusinessCardToolIfNeeded();
                    }, 100);
                }
            }

            // Update navigation
            this.updateNavigation(toolName);

            // Update URL and title (using hash-based routing for refresh compatibility)
            if (updateHistory) {
                const titles = {
                    'business-card': 'Business Card Designer | Marketing Tools Suite',
                    'discount-offer': 'Discount Offer Creator | Marketing Tools Suite',
                    'social-media': 'Social Media Designer | Marketing Tools Suite'
                };

                window.location.hash = toolName;
                document.title = titles[toolName];
                console.log('Hash and title updated to:', window.location.hash);
            }

            // Close mobile menu
            document.getElementById('mobile-menu')?.classList.add('hidden');

            console.log(`Tool ${toolName} loaded and shown successfully`);

        } catch (error) {
            console.error('Error in showTool:', error);
            this.showNotification(window.i18n?.t('notification.tool_error') || 'Failed to load tool. Please try again.', 'error');

            // Fallback to home on error
            setTimeout(() => {
                this.showHome();
            }, 2000);

        } finally {
            console.log('Hiding loading spinner');
            this.hideLoading();
        }
    }

    /**
     * Get inline tool content for GitHub Pages deployment
     */
    async getInlineToolContent(toolName) {
        // Handle async tools separately
        if (toolName === 'discount-offer') {
            return await this.getDiscountOfferToolContent();
        }

        if (toolName === 'qr-generator') {
            return await this.getQRGeneratorToolContent();
        }

        const toolContent = {
            'social-media': this.getSocialMediaToolContent(),
            'business-card': this.getBusinessCardToolContent()
        };

        return toolContent[toolName] || null;
    }

    /**
     * Enhanced Social Media Tool Content
     */
    getSocialMediaToolContent() {
        return `<!-- Professional Libraries -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="https://unpkg.com/bidi-js@1.0.3/dist/bidi.min.js"></script>
<script src="https://unpkg.com/opentype.js@1.3.4/dist/opentype.min.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&family=Inter:wght@300;400;600;700&family=Cairo:wght@200;300;400;600;700;900&family=Rubik:wght@300;400;500;600;700;800&family=Tajawal:wght@200;300;400;500;700;800&family=Amiri:wght@400;700&family=Lato:wght@300;400;700;900&family=Open+Sans:wght@300;400;600;700;800&family=Roboto:wght@300;400;500;700;900&family=Poppins:wght@300;400;500;600;700;800&family=Montserrat:wght@300;400;500;600;700;800&family=Source+Sans+Pro:wght@300;400;600;700&display=swap" rel="stylesheet">

<!-- Tool Script -->
<script src="js/social-media-tool.js"></script>

<style>
    .social-media-tool {
        font-family: 'Almarai', sans-serif;
        direction: rtl;
        padding: 20px;
    }

    .social-media-tool * {
        box-sizing: border-box;
    }

    .social-media-tool .main-container {
        max-width: 1400px;
        margin: 0 auto;
    }

    .social-media-tool .platforms-selector {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;
        margin-bottom: 30px;
    }

    .social-media-tool .platform-btn {
        padding: 15px;
        border: 3px solid #667eea;
        background: rgba(102, 126, 234, 0.1);
        color: #667eea;
        border-radius: 12px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 700;
        transition: all 0.3s;
        text-align: center;
    }

    .social-media-tool .platform-btn:hover {
        background: rgba(102, 126, 234, 0.2);
        transform: translateY(-2px);
    }

    .social-media-tool .platform-btn.active {
        background: #667eea;
        color: white;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .social-media-tool .content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }

    .social-media-tool .editor-panel {
        background: white;
        border-radius: 15px;
        padding: 25px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        max-height: 80vh;
        overflow-y: auto;
    }

    .social-media-tool .panel-title {
        font-size: 20px;
        font-weight: 900;
        color: #667eea;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .social-media-tool .section-group {
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 2px solid #f0f0f0;
    }

    .social-media-tool .section-title {
        font-size: 13px;
        font-weight: 700;
        color: #667eea;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .social-media-tool .form-group {
        margin-bottom: 15px;
    }

    .social-media-tool .form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: 600;
        color: #333;
        font-size: 12px;
    }

    .social-media-tool .form-group input,
    .social-media-tool .form-group select,
    .social-media-tool .form-group textarea {
        width: 100%;
        padding: 10px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        font-size: 12px;
        transition: border-color 0.3s;
        font-family: 'Almarai', sans-serif;
    }

    .social-media-tool .form-group input:focus,
    .social-media-tool .form-group select:focus,
    .social-media-tool .form-group textarea:focus {
        outline: none;
        border-color: #667eea;
    }

    .social-media-tool .color-input {
        width: 50px !important;
        height: 40px;
        padding: 0;
        border: none;
        border-radius: 8px;
        cursor: pointer;
    }

    .social-media-tool .btn {
        padding: 10px 15px;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
        transition: background 0.3s;
        font-family: 'Almarai', sans-serif;
    }

    .social-media-tool .btn:hover {
        background: #5a6fd8;
    }

    .social-media-tool .btn-success {
        background: #28a745;
    }

    .social-media-tool .btn-success:hover {
        background: #218838;
    }

    .social-media-tool .btn-danger {
        background: #dc3545;
    }

    .social-media-tool .btn-danger:hover {
        background: #c82333;
    }

    .social-media-tool .btn-warning {
        background: #ffc107;
        color: #000;
    }

    .social-media-tool .btn-warning:hover {
        background: #e0a800;
    }

    .social-media-tool .buttons-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-bottom: 15px;
    }

    .social-media-tool .viewer-panel {
        background: white;
        border-radius: 15px;
        padding: 25px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        text-align: center;
    }

    .social-media-tool .platform-info {
        margin-bottom: 20px;
        padding: 15px;
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        border-radius: 10px;
        text-align: center;
    }

    .social-media-tool .platform-name {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 5px;
    }

    .social-media-tool .platform-dimensions {
        font-size: 12px;
        opacity: 0.9;
    }

    .social-media-tool #konvaContainer {
        margin: 20px auto;
        border: 3px solid #667eea;
        border-radius: 15px;
        background: #f9f9f9;
        padding: 20px;
        box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1);
    }

    .social-media-tool .export-section {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 10px;
        margin-top: 20px;
    }

    .social-media-tool .selection-info {
        background: #f8f9fa;
        padding: 10px;
        border-radius: 8px;
        margin-bottom: 15px;
        font-size: 12px;
        border-left: 4px solid #667eea;
    }

    .social-media-tool #textFormattingPanel {
        background: #e8f2ff;
        padding: 15px;
        border-radius: 10px;
        margin-bottom: 15px;
        display: none;
    }

    .social-media-tool #textFormattingPanel h4 {
        color: #667eea;
        font-size: 14px;
        margin-bottom: 10px;
        font-weight: 700;
    }

    .social-media-tool .text-formatting-buttons {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-bottom: 10px;
    }

    .social-media-tool .text-formatting-buttons .btn {
        padding: 8px;
        font-size: 11px;
    }

    .social-media-tool .font-controls {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 10px;
        margin-top: 10px;
    }

    .social-media-tool .background-toggle {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-bottom: 15px;
    }

    .social-media-tool .background-toggle button {
        padding: 8px;
        font-size: 11px;
    }

    .social-media-tool .background-toggle button.active {
        background: #667eea;
        color: white;
    }

    .social-media-tool .image-controls {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        margin-top: 10px;
    }

    .social-media-tool .image-controls input {
        padding: 5px;
        font-size: 11px;
    }

    @media (max-width: 768px) {
        .social-media-tool .content {
            grid-template-columns: 1fr;
        }
        
        .social-media-tool .platforms-selector {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        }
        
        .social-media-tool .export-section {
            grid-template-columns: 1fr;
        }
    }
</style>

<div class="social-media-tool">
    <div class="main-container">
        <!-- Platform Selection -->
        <div class="platforms-selector">
            <button class="platform-btn active" onclick="selectPlatform('instagram')">
                <i class="fab fa-instagram"></i><br>Instagram<br>1080×1350
            </button>
            <button class="platform-btn" onclick="selectPlatform('instastory')">
                <i class="fab fa-instagram"></i><br>Story<br>1080×1920
            </button>
            <button class="platform-btn" onclick="selectPlatform('facebook')">
                <i class="fab fa-facebook"></i><br>Facebook<br>1200×1500
            </button>
            <button class="platform-btn" onclick="selectPlatform('twitter')">
                <i class="fab fa-twitter"></i><br>Twitter<br>1024×512
            </button>
        </div>

        <div class="content">
            <!-- Editor Panel -->
            <div class="editor-panel">
                <h2 class="panel-title">
                    <i class="fas fa-edit"></i>
                    محرر التصميم
                </h2>

                <!-- Store Information -->
                <div class="section-group">
                    <div class="section-title">
                        <i class="fas fa-store"></i> معلومات المتجر
                    </div>
                    <div class="form-group">
                        <label>اسم المتجر</label>
                        <input type="text" id="storeName" value="العالمي الشارقة" onchange="updateCanvas()">
                    </div>
                    <div class="form-group">
                        <label>الشعار (اختياري)</label>
                        <input type="text" id="tagline" placeholder="شعار المتجر" onchange="updateCanvas()">
                    </div>
                </div>

                <!-- Main Content -->
                <div class="section-group">
                    <div class="section-title">
                        <i class="fas fa-bullhorn"></i> المحتوى الرئيسي
                    </div>
                    <div class="form-group">
                        <label>العنوان الرئيسي</label>
                        <input type="text" id="mainTitle" value="خصومات هائلة على جميع الأقسام" onchange="updateCanvas()">
                    </div>
                    <div class="form-group">
                        <label>نص الشارة</label>
                        <input type="text" id="badgeText" value="خصم 50%" onchange="updateCanvas()">
                    </div>
                    <div class="form-group">
                        <label>العنوان الفرعي</label>
                        <input type="text" id="subtitle" value="اضغط الآن لعرض أفضل العروض" onchange="updateCanvas()">
                    </div>
                </div>

                <!-- Contact Information -->
                <div class="section-group">
                    <div class="section-title">
                        <i class="fas fa-phone"></i> معلومات الاتصال
                    </div>
                    <div class="form-group">
                        <label>رقم الهاتف (اختياري)</label>
                        <input type="tel" id="phoneNumber" placeholder="+971 50 123 4567" onchange="updateCanvas()">
                    </div>
                    <div class="form-group">
                        <label>حساب وسائل التواصل</label>
                        <input type="text" id="socialHandle" value="@alalamy.sharjah" placeholder="@username" onchange="updateCanvas()">
                    </div>
                </div>

                <!-- Categories -->
                <div class="section-group">
                    <div class="section-title">
                        <i class="fas fa-tags"></i> الفئات والخصومات
                    </div>
                    <div id="categoriesContainer">
                        <div class="category-item">
                            <div class="form-group">
                                <label>اسم الفئة</label>
                                <input type="text" class="category-name" value="أحذية" onchange="updateCanvas()">
                            </div>
                            <div class="form-group">
                                <label>نسبة الخصم (%)</label>
                                <input type="number" class="category-discount" value="30" min="0" max="100" onchange="updateCanvas()">
                            </div>
                        </div>
                    </div>
                    <button type="button" class="btn" onclick="addCategory()">إضافة فئة جديدة</button>
                </div>

                <!-- Design Tools -->
                <div class="section-group">
                    <div class="section-title">
                        <i class="fas fa-tools"></i> أدوات التصميم
                    </div>
                    
                    <!-- Selection Info -->
                    <div class="selection-info" id="selectionInfo">
                        اضغط على أي عنصر لتحديده والتحكم به
                    </div>

                    <!-- Text Formatting Panel -->
                    <div id="textFormattingPanel">
                        <h4><i class="fas fa-font"></i> تنسيق النص</h4>
                        <div class="text-formatting-buttons">
                            <button type="button" class="btn" onclick="makeTextBold()">
                                <i class="fas fa-bold"></i> عريض
                            </button>
                            <button type="button" class="btn" onclick="makeTextItalic()">
                                <i class="fas fa-italic"></i> مائل
                            </button>
                            <button type="button" class="btn" onclick="toggleTextDirection()">
                                <i class="fas fa-exchange-alt"></i> اتجاه
                            </button>
                            <button type="button" class="btn" onclick="alignTextLeft()">
                                <i class="fas fa-align-left"></i> يسار
                            </button>
                            <button type="button" class="btn" onclick="alignTextCenter()">
                                <i class="fas fa-align-center"></i> وسط
                            </button>
                            <button type="button" class="btn" onclick="alignTextRight()">
                                <i class="fas fa-align-right"></i> يمين
                            </button>
                        </div>
                        <div class="font-controls">
                            <select id="fontSelect" onchange="changeFontFamily()">
                                <option value="Almarai">Almarai (عربي)</option>
                                <option value="Cairo">Cairo (عربي)</option>
                                <option value="Tajawal">Tajawal (عربي)</option>
                                <option value="Amiri">Amiri (عربي)</option>
                                <option value="Inter">Inter (English)</option>
                                <option value="Roboto">Roboto (English)</option>
                                <option value="Poppins">Poppins (English)</option>
                            </select>
                            <input type="number" id="fontSizeInput" value="24" min="8" max="200" onchange="changeFontSize()" placeholder="حجم">
                        </div>
                    </div>

                    <!-- Design Action Buttons -->
                    <div class="buttons-grid">
                        <button type="button" class="btn" onclick="duplicateSelected()">
                            <i class="fas fa-copy"></i> نسخ
                        </button>
                        <button type="button" class="btn btn-danger" onclick="deleteSelected()">
                            <i class="fas fa-trash"></i> حذف
                        </button>
                        <button type="button" class="btn" onclick="bringToFront()">
                            <i class="fas fa-arrow-up"></i> للأمام
                        </button>
                        <button type="button" class="btn" onclick="sendToBack()">
                            <i class="fas fa-arrow-down"></i> للخلف
                        </button>
                        <button type="button" class="btn btn-warning" onclick="clearAll()">
                            <i class="fas fa-trash-alt"></i> مسح الكل
                        </button>
                        <button type="button" class="btn" onclick="resetPositions()">
                            <i class="fas fa-undo"></i> إعادة ترتيب
                        </button>
                    </div>
                </div>

                <!-- Colors -->
                <div class="section-group">
                    <div class="section-title">
                        <i class="fas fa-palette"></i> الألوان
                    </div>
                    <div class="form-group">
                        <label>لون النص الرئيسي</label>
                        <input type="color" id="textColor" class="color-input" value="#ffffff" onchange="updateCanvas()">
                    </div>
                    <div class="form-group">
                        <label>لون الشارة</label>
                        <input type="color" id="accentColor" class="color-input" value="#ff6b6b" onchange="updateCanvas()">
                    </div>
                </div>

                <!-- Background -->
                <div class="section-group">
                    <div class="section-title">
                        <i class="fas fa-image"></i> الخلفية
                    </div>
                    
                    <div class="background-toggle">
                        <button type="button" class="btn active" onclick="selectBackgroundType('gradient')">تدرج لوني</button>
                        <button type="button" class="btn" onclick="selectBackgroundType('image')">صورة خلفية</button>
                    </div>
                    
                    <div id="gradientControls">
                        <div class="form-group">
                            <label>اللون الأول</label>
                            <input type="color" id="bgColor1" class="color-input" value="#667eea" onchange="updateCanvas()">
                        </div>
                        <div class="form-group">
                            <label>اللون الثاني</label>
                            <input type="color" id="bgColor2" class="color-input" value="#764ba2" onchange="updateCanvas()">
                        </div>
                    </div>
                    
                    <div id="imageControls" style="display: none;">
                        <div class="form-group">
                            <label>رفع صورة خلفية</label>
                            <input type="file" id="backgroundImageUpload" accept="image/*" onchange="handleBackgroundImageUpload(event)">
                        </div>
                        <div class="image-controls">
                            <input type="range" id="bgImageX" min="-50" max="50" value="0" onchange="updateBackgroundImage()" title="موضع أفقي">
                            <input type="range" id="bgImageY" min="-50" max="50" value="0" onchange="updateBackgroundImage()" title="موضع رأسي">
                            <input type="range" id="bgImageScale" min="50" max="200" value="100" onchange="updateBackgroundImage()" title="الحجم">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Viewer Panel -->
            <div class="viewer-panel">
                <div class="platform-info">
                    <div class="platform-name" id="platformName">Instagram Square</div>
                    <div class="platform-dimensions" id="platformDimensions">1080 × 1080 pixels</div>
                </div>

                <div id="konvaContainer"></div>
                


                <div class="export-section">
                    <button type="button" class="btn btn-success" onclick="exportDesign('png', 2)">
                        <i class="fas fa-download"></i><br>تصدير عالي الجودة
                    </button>
                    <button type="button" class="btn btn-success" onclick="exportDesign('png', 1)">
                        <i class="fas fa-download"></i><br>تصدير جودة عادية
                    </button>
                    <button type="button" class="btn btn-success" onclick="exportDesign('jpg', 3)">
                        <i class="fas fa-download"></i><br>تصدير جودة فائقة
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

</script>`;
    }

    /**
     * Enhanced Bilingual Business Card Tool Content
     */
    getBusinessCardToolContent() {
        return `<!-- Professional Libraries -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="https://unpkg.com/bidi-js@1.0.3/dist/bidi.min.js"></script>

<!-- Tool Script -->
<script src="js/business-card-tool-new.js"></script>
<script>
// Initialize business card tool after script loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (window.initBusinessCardToolIfNeeded) {
            window.initBusinessCardToolIfNeeded();
        }
    }, 1000);
});
</script>

<!-- Bilingual Business Card Tool -->
<div class="min-h-screen bg-gray-50 font-almarai">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Tool Header -->
        <div class="text-center mb-8">
            <div class="flex items-center justify-center space-x-3 mb-4">
                <div class="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                    <i class="fas fa-id-card text-white text-xl"></i>
                </div>
                <h1 class="text-3xl font-bold text-gray-900" data-i18n="business_card.title">Business Card Designer</h1>
            </div>
            <p class="text-lg text-gray-600 max-w-3xl mx-auto" data-i18n="business_card.subtitle">Create professional business cards with bilingual support</p>
        </div>

        <!-- Tab Navigation -->
        <div class="flex justify-center mb-8">
            <nav class="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button id="tab-english" onclick="switchBusinessCardTab('english')" class="business-card-tab px-6 py-2 text-sm font-medium rounded-md transition-colors bg-white text-indigo-600 shadow-sm">
                    <span data-i18n="business_card.tabs.english">English Side</span>
                </button>
                <button id="tab-arabic" onclick="switchBusinessCardTab('arabic')" class="business-card-tab px-6 py-2 text-sm font-medium rounded-md transition-colors text-gray-500 hover:text-gray-700">
                    <span data-i18n="business_card.tabs.arabic">Arabic Side</span>
                </button>
                <button id="tab-design" onclick="switchBusinessCardTab('design')" class="business-card-tab px-6 py-2 text-sm font-medium rounded-md transition-colors text-gray-500 hover:text-gray-700">
                    <span data-i18n="business_card.tabs.design">Design</span>
                </button>
            </nav>
        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Form Panel -->
            <div class="bg-white rounded-xl shadow-lg p-6">
                <!-- English Tab Content -->
                <div id="english-content" class="tab-content">
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4" data-i18n="business_card.english.shop_details">👔 English Shop Details</h3>
                        
                        <div class="grid grid-cols-1 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2" data-i18n="business_card.english.shop_name">Shop Name (English)</label>
                                <input type="text" id="shop-name-en" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" data-i18n-placeholder="business_card.english.shop_name_placeholder" value="AL-ALAMIA">
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2" data-i18n="business_card.english.tagline">Tagline/Location</label>
                                <input type="text" id="tagline-en" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" data-i18n-placeholder="business_card.english.tagline_placeholder" value="Sharjah, UAE">
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2" data-i18n="business_card.english.phone">Phone Number</label>
                                    <input type="tel" id="phone-en" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" data-i18n-placeholder="business_card.english.phone_placeholder" value="+971 XX XXX XXXX">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2" data-i18n="business_card.english.email">Email</label>
                                    <input type="email" id="email-en" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" data-i18n-placeholder="business_card.english.email_placeholder" value="info@alamia.ae">
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2" data-i18n="business_card.english.website">Website</label>
                                <input type="url" id="website-en" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" data-i18n-placeholder="business_card.english.website_placeholder" value="www.alamia-sharjah.ae">
                            </div>
                        </div>
                    </div>

                    <!-- Services Section -->
                    <div class="mb-6">
                        <h4 class="text-md font-semibold text-gray-900 mb-3" data-i18n="business_card.english.services_title">📱 Services</h4>
                        <div id="services-en-list" class="space-y-2 mb-3">
                            <!-- Services will be dynamically added here -->
                        </div>
                        <div class="flex">
                            <input type="text" id="new-service-en" class="flex-1 px-3 py-2 border border-gray-300 rounded-s-md focus:ring-indigo-500 focus:border-indigo-500" data-i18n-placeholder="business_card.english.new_service_placeholder">
                            <button onclick="addServiceEn()" class="px-4 py-2 bg-indigo-600 text-white rounded-e-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500" data-i18n="business_card.english.add_service">+ Add Service</button>
                        </div>
                    </div>
                </div>

                <!-- Arabic Tab Content -->
                <div id="arabic-content" class="tab-content hidden">
                    <div class="mb-6">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4" data-i18n="business_card.arabic.shop_details">👔 تفاصيل المتجر العربية</h3>
                        
                        <div class="grid grid-cols-1 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2" data-i18n="business_card.arabic.shop_name">اسم المتجر (عربي)</label>
                                <input type="text" id="shop-name-ar" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" data-i18n-placeholder="business_card.arabic.shop_name_placeholder" value="العالمى الشارقة">
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2" data-i18n="business_card.arabic.tagline">الشعار/الموقع</label>
                                <input type="text" id="tagline-ar" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" data-i18n-placeholder="business_card.arabic.tagline_placeholder" value="الإمارات العربية المتحدة">
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2" data-i18n="business_card.arabic.phone">رقم الهاتف</label>
                                    <input type="tel" id="phone-ar" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" data-i18n-placeholder="business_card.arabic.phone_placeholder" value="+971 XX XXX XXXX">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2" data-i18n="business_card.arabic.email">البريد الإلكتروني</label>
                                    <input type="email" id="email-ar" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" data-i18n-placeholder="business_card.arabic.email_placeholder" value="info@alamia.ae">
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2" data-i18n="business_card.arabic.website">الموقع الإلكتروني</label>
                                <input type="url" id="website-ar" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" data-i18n-placeholder="business_card.arabic.website_placeholder" value="www.alamia-sharjah.ae">
                            </div>
                        </div>
                    </div>

                    <!-- Services Section -->
                    <div class="mb-6">
                        <h4 class="text-md font-semibold text-gray-900 mb-3" data-i18n="business_card.arabic.services_title">📱 الخدمات</h4>
                        <div id="services-ar-list" class="space-y-2 mb-3">
                            <!-- Services will be dynamically added here -->
                        </div>
                        <div class="flex">
                            <input type="text" id="new-service-ar" class="flex-1 px-3 py-2 border border-gray-300 rounded-s-md focus:ring-indigo-500 focus:border-indigo-500" data-i18n-placeholder="business_card.arabic.new_service_placeholder">
                            <button onclick="addServiceAr()" class="px-4 py-2 bg-indigo-600 text-white rounded-e-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500" data-i18n="business_card.arabic.add_service">+ إضافة خدمة</button>
                        </div>
                    </div>
                </div>

                <!-- Design Tab Content -->
                <div id="design-content" class="tab-content hidden">
                    <div class="space-y-6">
                        <!-- Colors Section -->
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-4" data-i18n="business_card.design.colors_title">🎨 Colors & Design</h3>
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2" data-i18n="business_card.design.bg_color">Background Color</label>
                                    <div class="flex gap-2">
                                        <input type="color" id="bg-color" value="#1a1a1a" class="w-16 h-10 border border-gray-300 rounded-md">
                                        <input type="text" id="bg-color-hex" value="#1a1a1a" class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="#1a1a1a">
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2" data-i18n="business_card.design.text_color">Text Color</label>
                                    <div class="flex gap-2">
                                        <input type="color" id="text-color" value="#ffffff" class="w-16 h-10 border border-gray-300 rounded-md">
                                        <input type="text" id="text-color-hex" value="#ffffff" class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" placeholder="#ffffff">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Text Formatting Section -->
                        <div id="text-formatting-panel" class="hidden">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">✏️ Edit Selected Element</h3>
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                                    <input type="range" id="text-font-size" min="12" max="72" value="24" class="w-full">
                                    <span id="font-size-value" class="text-sm text-gray-600">24px</span>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                                    <select id="text-font-family" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                                        <option value="Inter">Inter (Latin)</option>
                                        <option value="Almarai">Almarai (Arabic)</option>
                                        <option value="Arial">Arial</option>
                                        <option value="Georgia">Georgia</option>
                                        <option value="Times New Roman">Times New Roman</option>
                                        <option value="Courier New">Courier New</option>
                                        <option value="Verdana">Verdana</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Font Style</label>
                                    <div class="flex gap-2">
                                        <button id="text-bold" class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
                                            <i class="fas fa-bold"></i> Bold
                                        </button>
                                        <button id="text-italic" class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
                                            <i class="fas fa-italic"></i> Italic
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Text Alignment</label>
                                    <div class="flex gap-2">
                                        <button id="text-align-left" class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
                                            <i class="fas fa-align-left"></i> Left
                                        </button>
                                        <button id="text-align-center" class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
                                            <i class="fas fa-align-center"></i> Center
                                        </button>
                                        <button id="text-align-right" class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
                                            <i class="fas fa-align-right"></i> Right
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Text Direction</label>
                                    <div class="flex gap-2">
                                        <button id="text-direction-ltr" class="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
                                            <i class="fas fa-arrow-right"></i> LTR
                                        </button>
                                        <button id="text-direction-rtl" class="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
                                            <i class="fas fa-arrow-left"></i> RTL
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Actions</label>
                                    <div class="flex gap-2">
                                        <button id="element-copy" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                            <i class="fas fa-copy"></i> Copy
                                        </button>
                                        <button id="element-delete" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                                            <i class="fas fa-trash"></i> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Logo Section -->
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-4" data-i18n="business_card.design.logo_title">📍 Logo & Icon</h3>
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2" data-i18n="business_card.design.logo_label">Logo/Icon - Upload Image or Emoji</label>
                                    <input type="text" id="logo-emoji" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" data-i18n-placeholder="business_card.design.logo_placeholder" value="📱" maxlength="50">
                                </div>
                                <div class="flex items-center gap-4">
                                    <div class="w-16 h-16 bg-gray-100 border-2 border-gray-300 rounded-md flex items-center justify-center text-2xl overflow-hidden" id="logo-preview">📱</div>
                                    <div class="flex-1">
                                        <label class="block text-sm font-medium text-gray-700 mb-2" data-i18n="business_card.design.logo_help">Upload an image to replace emoji</label>
                                        <input type="file" id="logo-upload" accept="image/*" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- QR Code Section -->
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-4" data-i18n="business_card.design.qr_title">🔖 QR Code</h3>
                            <div class="space-y-4">
                                <div class="flex items-center gap-4">
                                    <div class="w-20 h-20 bg-gray-100 border-2 border-gray-300 rounded-md flex items-center justify-center text-xs text-gray-500 font-medium overflow-hidden" id="qr-preview">QR</div>
                                    <div class="flex-1">
                                        <label class="block text-sm font-medium text-gray-700 mb-2" data-i18n="business_card.design.qr_upload">QR Code - Upload Image</label>
                                        <input type="file" id="qr-upload" accept="image/*" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                                        <p class="text-xs text-gray-500 mt-1" data-i18n="business_card.design.qr_help">Upload your QR code image</p>
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2" data-i18n="business_card.design.qr_label">QR Text Label</label>
                                    <input type="text" id="qr-label" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" data-i18n-placeholder="business_card.design.qr_label_placeholder" value="SCAN ME">
                                </div>
                            </div>
                        </div>

                        <!-- Background Photo Section -->
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">🖼️ Background Photo</h3>
                            <div class="space-y-4">
                                <div class="flex items-center gap-4">
                                    <div class="w-20 h-12 bg-gray-100 border-2 border-gray-300 rounded-md flex items-center justify-center text-xs text-gray-500 font-medium overflow-hidden" id="bg-photo-preview">No Image</div>
                                    <div class="flex-1">
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Upload Background Image (Optional)</label>
                                        <input type="file" id="bg-photo-upload" accept="image/*" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                                        <p class="text-xs text-gray-500 mt-1">Upload a background image for your card</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Export Buttons -->
                        <div class="pt-6 border-t border-gray-200">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button onclick="exportBusinessCard('english')" class="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 font-medium">
                                    <i class="fas fa-download mr-2"></i>
                                    <span data-i18n="business_card.design.export_english">Export English</span>
                                </button>
                                <button onclick="exportBusinessCard('arabic')" class="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 font-medium">
                                    <i class="fas fa-download mr-2"></i>
                                    <span data-i18n="business_card.design.export_arabic">Export Arabic</span>
                                </button>
                                <button onclick="exportBusinessCard('both')" class="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 font-medium">
                                    <i class="fas fa-download mr-2"></i>
                                    <span>Export Both</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Preview Panel -->
            <div class="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
                <div class="text-center mb-6">
                    <h3 class="text-lg font-semibold text-gray-900" data-i18n="business_card.preview.title">Card Preview</h3>
                    <p class="text-sm text-gray-600" data-i18n="business_card.preview.description">Your business cards will appear below</p>
                </div>
                
                <!-- Canvas Container -->
                <div class="bg-gray-50 rounded-lg p-6 min-h-[400px] flex items-center justify-center">
                    <div id="business-card-canvas" class="bg-white rounded-lg shadow-lg border border-gray-200">
                        <!-- Konva canvas will be inserted here -->
                    </div>
                </div>
                
                <!-- Preview Controls -->
                <div class="mt-6 text-center">
                    <div class="flex justify-center gap-8">
                        <button onclick="previewBusinessCard('english')" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            <span data-i18n="business_card.tabs.english">English Side</span>
                        </button>
                        <button onclick="previewBusinessCard('arabic')" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            <span data-i18n="business_card.tabs.arabic">Arabic Side</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`;
    }
    /**
     * Enhanced Discount Offer Tool Content
     */
    getDiscountOfferToolContent() {
        return `<!-- Ensure proper charset and language support for Arabic -->
<meta charset="UTF-8">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

<style>
    /* Use Almarai font for Arabic support */
    *:not(.fa):not(.fas):not(.far):not(.fab):not(.fa-solid):not(.fa-regular):not(.fa-brands) {
        font-family: 'Almarai', Arial, sans-serif !important;
    }

    .form-group {
        margin-bottom: 12px;
    }

    label {
        display: block;
        font-size: 12px;
        font-weight: 600;
        color: #555;
        margin-bottom: 5px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    input[type="text"],
    input[type="email"],
    input[type="tel"],
    input[type="url"],
    input[type="color"],
    input[type="number"],
    input[type="date"],
    textarea,
    select {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-family: inherit;
        font-size: 13px;
        transition: border-color 0.3s;
    }

    input[type="text"]:focus,
    input[type="email"]:focus,
    input[type="tel"]:focus,
    input[type="url"]:focus,
    input[type="number"]:focus,
    input[type="date"]:focus,
    textarea:focus,
    select:focus {
        outline: none;
        border-color: #1a1a1a;
        background-color: #fafafa;
    }

    input[type="color"] {
        width: 50px;
        height: 40px;
        padding: 2px;
        cursor: pointer;
    }

    input[type="file"] {
        padding: 8px;
        border: 2px dashed #ddd;
        border-radius: 5px;
        cursor: pointer;
    }

    textarea {
        resize: vertical;
        min-height: 60px;
    }

    /* Tab functionality - match business card style */
    .discount-tab-content {
        display: none;
    }

    .discount-tab-content.active {
        display: block;
    }

    .tab-button.active {
        background: white !important;
        color: #1f2937 !important;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
    }

    /* Text formatting panel */
    #discount-text-formatting-panel {
        background: #f8f9fa;
        border: 2px solid #4F46E5;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 20px;
    }

    #discount-text-formatting-panel.hidden {
        display: none;
    }

    .formatting-controls {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        align-items: center;
        margin-top: 10px;
    }

    .formatting-controls label {
        display: flex;
        flex-direction: column;
        gap: 5px;
        text-transform: none;
    }



    .btn-primary,
    .btn-success,
    .btn-danger {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s;
        font-size: 13px;
    }

    .btn-primary {
        background: #4F46E5;
        color: white;
        width: 100%;
        margin-top: 15px;
    }

    .btn-primary:hover {
        background: #4338ca;
    }

    .btn-success {
        background: #1a1a1a;
        color: white;
        width: 100%;
        margin-top: 10px;
    }

    .btn-success:hover {
        background: #333;
    }

    .btn-danger {
        background: #ff4444;
        color: white;
    }

    .btn-danger:hover {
        background: #dd0000;
    }

    .canvas-container {
        width: 100%;
        background: #f5f5f5;
        border-radius: 10px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 800px;
        border: 1px solid #ddd;
    }

    .section-title {
        font-size: 14px;
        font-weight: 700;
        color: #333;
        margin-bottom: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .category-row {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 10px;
        margin-bottom: 10px;
    }

    .qr-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        margin-bottom: 10px;
    }

    @media (max-width: 768px) {

        .category-row,
        .qr-row {
            grid-template-columns: 1fr;
        }
    }

    /* Format selector buttons */
    .discount-format-btn {
        padding: 12px 16px;
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid #ddd;
        color: #333;
        border-radius: 8px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 600;
        transition: all 0.3s;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
    }

    .discount-format-btn:hover {
        background: #f5f5f5;
        border-color: #4F46E5;
    }

    .discount-format-btn.active {
        background: #4F46E5;
        color: white;
        border-color: #4F46E5;
        box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
    }

    .discount-format-btn .format-name {
        font-size: 14px;
        font-weight: 700;
    }

    .discount-format-btn .format-size {
    font-size: 11px;
    opacity: 0.8;
}

/* Alignment Buttons */
.btn-align {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    color: #374151;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-align:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
}

.btn-align.active {
    background: #4f46e5;
    color: #ffffff;
    border-color: #4f46e5;
}

.btn-align i {
    font-size: 14px;
    pointer-events: none; /* Ensure click hits button */
}
</style>

<!-- Discount Offer Tool - Clean Layout matching Business Card -->
<div class="grid grid-cols-1 gap-6 min-h-[70vh]">
    <!-- FORMAT SELECTOR -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-layer-group"></i>
            <span data-i18n="discount_offer.format_selector.title">Select Template Format</span>
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button class="discount-format-btn active" onclick="selectDiscountFormat('story')">
                <i class="fas fa-mobile-alt" style="font-size: 20px;"></i>
                <span class="format-name" data-i18n="discount_offer.formats.story">Story</span>
                <span class="format-size">9:16</span>
            </button>
            <button class="discount-format-btn" onclick="selectDiscountFormat('post')">
                <i class="fas fa-square" style="font-size: 20px;"></i>
                <span class="format-name" data-i18n="discount_offer.formats.post">Post</span>
                <span class="format-size">1:1</span>
            </button>
            <button class="discount-format-btn" onclick="selectDiscountFormat('a4')">
                <i class="fas fa-file-alt" style="font-size: 20px;"></i>
                <span class="format-name" data-i18n="discount_offer.formats.a4">A4 Flyer</span>
                <span class="format-size">A4</span>
            </button>
            <button class="discount-format-btn" onclick="selectDiscountFormat('wide')">
                <i class="fas fa-panorama" style="font-size: 20px;"></i>
                <span class="format-name" data-i18n="discount_offer.formats.wide">Banner</span>
                <span class="format-size">16:9</span>
            </button>
        </div>
    </div>

    <!-- EDITOR AND PREVIEW -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- LEFT PANEL: TABS & FORMS (1/3) -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
            <!-- Tab Navigation -->
            <div class="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
                <button
                    class="tab-button active flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 bg-white text-gray-900 shadow-sm"
                    onclick="switchDiscountTab('content')" data-i18n="discount_offer.tabs.content">Content</button>
                <button
                    class="tab-button flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 text-gray-600 hover:text-gray-900"
                    onclick="switchDiscountTab('design')" data-i18n="discount_offer.tabs.design">Design</button>
                <button
                    class="tab-button flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 text-gray-600 hover:text-gray-900"
                    onclick="switchDiscountTab('export')" data-i18n="discount_offer.tabs.export">Export</button>
            </div>

            <!-- CONTENT TAB -->
            <div id="discount-tab-content" class="discount-tab-content active">
                <div class="space-y-6">
                    <div class="text-sm font-semibold text-gray-700 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200"
                        data-i18n="discount_offer.content.store_info">🏪 Store Information</div>

                    <div class="space-y-4">
                        <div class="form-group">
                            <label data-i18n="discount_offer.content.store_name">Store Name</label>
                            <input type="text" id="discount-store-name" placeholder="Alalamy Sharjah"
                                value="Alalamy Sharjah">
                        </div>

                        <div class="form-group">
                            <label data-i18n="discount_offer.content.tagline">Tagline</label>
                            <input type="text" id="discount-tagline" placeholder="العالمي ملك السعادة ❤️"
                                value="العالمي ملك السعادة ❤️" style="text-align: right;">
                        </div>

                        <div class="form-group">
                            <label data-i18n="discount_offer.content.location">Location</label>
                            <input type="text" id="discount-location" placeholder="فرع الشارقة" value="فرع الشارقة"
                                style="text-align: right;">
                        </div>

                        <div class="form-group">
                            <label data-i18n="discount_offer.content.main_title">Main Title</label>
                            <textarea id="discount-main-title" rows="2"
                                style="text-align: right;">عروض خصم متنوعة على جميع الإكسسوارات! 🎉</textarea>
                        </div>

                        <div class="form-group">
                            <label data-i18n="discount_offer.content.description">Description</label>
                            <textarea id="discount-description" rows="4" style="text-align: right;">• لحامل هذه البطاقة فقط
• لا يجمع مع عروض أخرى
• متوفر في فرع الشارقة فقط</textarea>
                        </div>
                    </div>

                    <div class="text-sm font-semibold text-gray-700 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200"
                        data-i18n="discount_offer.content.categories">🏷️ Discount Categories</div>

                    <div class="space-y-3">
                        <div class="category-row">
                            <input type="text" id="discount-cat1-name" placeholder="Category 1" value="كفرات موبايل"
                                style="text-align: right;">
                            <input type="number" id="discount-cat1-percent" placeholder="%" value="30" min="0"
                                max="100">
                        </div>
                        <div class="category-row">
                            <input type="text" id="discount-cat2-name" placeholder="Category 2" value="شواحن وكابلات"
                                style="text-align: right;">
                            <input type="number" id="discount-cat2-percent" placeholder="%" value="25" min="0"
                                max="100">
                        </div>
                        <div class="category-row">
                            <input type="text" id="discount-cat3-name" placeholder="Category 3"
                                value="ماوس ولوحات مفاتيح" style="text-align: right;">
                            <input type="number" id="discount-cat3-percent" placeholder="%" value="20" min="0"
                                max="100">
                        </div>
                        <div class="category-row">
                            <input type="text" id="discount-cat4-name" placeholder="Category 4"
                                value="سماعات وأكسسوارات" style="text-align: right;">
                            <input type="number" id="discount-cat4-percent" placeholder="%" value="15" min="0"
                                max="100">
                        </div>
                    </div>

                    <div class="text-sm font-semibold text-gray-700 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200"
                        data-i18n="discount_offer.content.contact">📞 Contact Information</div>

                    <div class="space-y-4">
                        <div class="form-group">
                            <label data-i18n="discount_offer.content.expiry_date">Expiry Date</label>
                            <input type="date" id="discount-expiry-date" value="2025-12-31">
                        </div>

                        <div class="form-group">
                            <label data-i18n="discount_offer.content.phone">Phone Number</label>
                            <input type="tel" id="discount-phone" placeholder="+971 XX XXX XXXX">
                        </div>

                        <div class="form-group">
                            <label data-i18n="discount_offer.content.tiktok">TikTok Handle</label>
                            <input type="text" id="discount-tiktok" placeholder="@alalamy.sharjah"
                                value="alalamy.sharjah">
                        </div>
                    </div>
                </div>
            </div>

            <!-- DESIGN TAB -->
            <div id="discount-tab-design" class="discount-tab-content">
                <div class="space-y-6">
                    <!-- Text Formatting Panel (shown when text is selected) -->
                    <div id="discount-text-formatting-panel" class="hidden">
                        <div class="section-title">
                            <i class="fas fa-font"></i> <span data-i18n="discount_offer.design.text_formatting">Text
                                Formatting</span>
                        </div>
                        <div class="formatting-controls">
                            <label>
                                <span data-i18n="discount_offer.design.font_size">Font Size</span>
                                <input type="range" id="discount-text-font-size" min="12" max="72" value="24"
                                    style="width: 120px;">
                                <span id="discount-font-size-value">24px</span>
                            </label>

                            <label>
                                <span data-i18n="discount_offer.design.font_family">Font Family</span>
                                <select id="discount-text-font-family" style="width: 150px;">
                                    <option value="Almarai">Almarai</option>
                                    <option value="Cairo">Cairo</option>
                                    <option value="Tajawal">Tajawal</option>
                                    <option value="Arial">Arial</option>
                                </select>
                            </label>

                            <div>
                                <label data-i18n="discount_offer.design.alignment">Alignment</label>
                                <div style="display: flex; gap: 5px; margin-top: 5px;">
                                    <button class="btn-align" id="discount-text-align-left" data-align="left"><i
                                            class="fas fa-align-left"></i></button>
                                    <button class="btn-align" id="discount-text-align-center" data-align="center"><i
                                            class="fas fa-align-center"></i></button>
                                    <button class="btn-align" id="discount-text-align-right" data-align="right"><i
                                            class="fas fa-align-right"></i></button>
                                </div>
                            </div>

                            <button class="btn-primary" id="discount-element-copy" style="width: auto; margin-top: 0;">
                                <i class="fas fa-copy"></i> <span data-i18n="discount_offer.design.copy">Copy</span>
                            </button>

                            <button class="btn-danger" id="discount-element-delete" style="width: auto;">
                                <i class="fas fa-trash"></i> <span
                                    data-i18n="discount_offer.design.delete">Delete</span>
                            </button>
                        </div>
                    </div>

                    <div class="text-sm font-semibold text-gray-700 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200"
                        data-i18n="discount_offer.design.colors">🎨 Colors</div>

                    <div class="space-y-4">
                        <div class="form-group">
                            <label data-i18n="discount_offer.design.background_color">Background Color</label>
                            <input type="color" id="discount-bg-color" value="#4F46E5">
                        </div>

                        <div class="form-group">
                            <label data-i18n="discount_offer.design.badge_color">Badge Color</label>
                            <input type="color" id="discount-badge-color" value="#FF0000">
                        </div>

                        <div class="form-group">
                            <label data-i18n="discount_offer.design.text_color">Text Color</label>
                            <input type="color" id="discount-text-color" value="#ffffff">
                        </div>
                    </div>

                    <div class="text-sm font-semibold text-gray-700 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200"
                        data-i18n="discount_offer.design.images">🖼️ Images</div>

                    <div class="space-y-4">
                        <div class="form-group">
                            <label data-i18n="discount_offer.design.logo">Logo</label>
                            <input type="file" id="discount-logo-upload" accept="image/*">
                        </div>

                        <div class="form-group">
                            <label data-i18n="discount_offer.design.qr_codes">QR Codes (4 slots)</label>
                            <div class="space-y-2">
                                <input type="file" id="discount-qr1-upload" accept="image/*" placeholder="QR 1">
                                <input type="file" id="discount-qr2-upload" accept="image/*" placeholder="QR 2">
                                <input type="file" id="discount-qr3-upload" accept="image/*" placeholder="QR 3">
                                <input type="file" id="discount-qr4-upload" accept="image/*" placeholder="QR 4">
                            </div>
                        </div>

                        <div class="form-group">
                            <label data-i18n="discount_offer.design.background_image">Background Image</label>
                            <input type="file" id="discount-bg-image-upload" accept="image/*">
                            <small data-i18n="discount_offer.design.bg_image_note">Will overlay background color</small>
                        </div>
                    </div>
                </div>
            </div>

            <!-- EXPORT TAB -->
            <div id="discount-tab-export" class="discount-tab-content">
                <div class="space-y-6">
                    <div class="text-sm font-semibold text-gray-700 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200"
                        data-i18n="discount_offer.export.title">💾 Export Options</div>

                    <p style="color: #666; margin-bottom: 20px;" data-i18n="discount_offer.export.description">
                        Export your discount flyer as a high-quality PNG image.
                    </p>

                    <button class="btn-success" onclick="exportDiscountFlyer()">
                        <i class="fas fa-image"></i> <span data-i18n="discount_offer.export.export_png">Export as
                            PNG</span>
                    </button>
                </div>
            </div>

            <!-- Update Button (always visible) -->
            <button class="btn-primary" onclick="updateDiscountPreview()">
                <i class="fas fa-sync-alt"></i> <span data-i18n="discount_offer.update_preview">Update Preview</span>
            </button>
        </div>

        <!-- RIGHT PANEL: CANVAS PREVIEW (2/3) -->
        <div class="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
            <div class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fas fa-eye"></i>
                <span data-i18n="discount_offer.preview.title">Live Preview</span>
            </div>
            <div class="canvas-container">
                <div id="discount-canvas"></div>
            </div>
        </div>
    </div>
</div>

<script src="js/discount-tool-new.js"></script>`;
    }

    /**
     * Get QR Generator Tool Content
     */
    getQRGeneratorToolContent() {
        return `<!-- QR Code Generator Tool -->
<meta charset="UTF-8">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

<style>
    *:not(.fa):not(.fas):not(.far):not(.fab):not(.fa-solid):not(.fa-regular):not(.fa-brands) {
        font-family: 'Almarai', Arial, sans-serif !important;
    }

    .form-group {
        margin-bottom: 16px;
    }

    label {
        display: block;
        font-size: 13px;
        font-weight: 600;
        color: #555;
        margin-bottom: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    input[type="text"],
    input[type="tel"],
    input[type="url"],
    input[type="color"],
    input[type="number"],
    textarea,
    select {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-family: inherit;
        font-size: 14px;
        transition: border-color 0.3s;
    }

    input:focus,
    textarea:focus,
    select:focus {
        outline: none;
        border-color: #9333ea;
        background-color: #fafafa;
    }

    input[type="color"] {
        width: 80px;
        height: 40px;
        padding: 2px;
        cursor: pointer;
    }

    input[type="range"] {
        width: 100%;
        accent-color: #9333ea;
    }

    textarea {
        resize: vertical;
        min-height: 80px;
    }

    .qr-tab-content {
        display: none;
    }

    .qr-tab-content.active {
        display: block;
    }

    .tab-button.active {
        background: white !important;
        color: #1f2937 !important;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
    }

    .btn-primary {
        width: 100%;
        padding: 12px 20px;
        background: #9333ea;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.3s;
        margin-top: 16px;
    }

    .btn-primary:hover {
        background: #7e22ce;
    }

    .btn-success {
        background: #10b981;
        color: white;
        padding: 12px 24px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.3s;
        width: 100%;
        margin-top: 12px;
    }

    .btn-success:hover {
        background: #059669;
    }

    .qr-display-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-top: 20px;
    }

    .qr-card {
        background: white;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        transition: all 0.3s;
    }

    .qr-card:hover {
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        border-color: #9333ea;
    }

    .qr-canvas {
        margin: 10px 0;
        display: inline-block;
    }

    .qr-label {
        font-size: 12px;
        font-weight: 600;
        color: #666;
        margin-top: 10px;
    }

    .type-selector {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        margin-bottom: 20px;
    }

    .type-btn {
        padding: 12px;
        background: #f3f4f6;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        font-size: 13px;
        transition: all 0.3s;
        text-align: center;
    }

    .type-btn:hover {
        background: #e5e7eb;
    }

    .type-btn.active {
        background: #9333ea;
        color: white;
        border-color: #9333ea;
    }

    .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #9ca3af;
    }

    .empty-state i {
        font-size: 48px;
        margin-bottom: 16px;
    }
</style>

<!-- QR Generator Tool -->
<div class="grid grid-cols-1 gap-6 min-h-[70vh]">
    <!-- Editor and Preview -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- LEFT PANEL: TABS & FORMS (1/3) -->
        <div class="bg-white rounded-lg border border-gray-200 p-6">
            <!-- Tab Navigation -->
            <div class="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
                <button
                    class="tab-button active flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 bg-white text-gray-900 shadow-sm"
                    onclick="switchQRTab('content')" data-i18n="qr_generator.tabs.content">Content</button>
                <button
                    class="tab-button flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 text-gray-600 hover:text-gray-900"
                    onclick="switchQRTab('design')" data-i18n="qr_generator.tabs.design">Design</button>
                <button
                    class="tab-button flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 text-gray-600 hover:text-gray-900"
                    onclick="switchQRTab('export')" data-i18n="qr_generator.tabs.export">Export</button>
            </div>

            <!-- CONTENT TAB -->
            <div id="qr-tab-content" class="qr-tab-content active">
                <div class="space-y-6">
                    <div class="text-sm font-semibold text-gray-700 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200"
                        data-i18n="qr_generator.content.qr_type">QR Code Type</div>

                    <!-- Type Selector -->
                    <div class="type-selector">
                        <button class="type-btn active" onclick="selectQRType('url')" id="type-url">
                            <i class="fas fa-link"></i><br>
                            <span data-i18n="qr_generator.types.url">URL</span>
                        </button>
                        <button class="type-btn" onclick="selectQRType('whatsapp')" id="type-whatsapp">
                            <i class="fab fa-whatsapp"></i><br>
                            <span data-i18n="qr_generator.types.whatsapp">WhatsApp</span>
                        </button>
                        <button class="type-btn" onclick="selectQRType('text')" id="type-text">
                            <i class="fas fa-text"></i><br>
                            <span data-i18n="qr_generator.types.text">Text</span>
                        </button>
                    </div>

                    <!-- URL Input -->
                    <div id="url-input-group" class="form-group">
                        <label data-i18n="qr_generator.content.url">Website URL</label>
                        <input type="url" id="qr-url" placeholder="https://yourwebsite.com"
                            data-i18n-placeholder="qr_generator.content.url_placeholder">
                    </div>

                    <!-- WhatsApp Input -->
                    <div id="whatsapp-input-group" class="form-group" style="display: none;">
                        <label data-i18n="qr_generator.content.whatsapp_number">WhatsApp Number</label>
                        <input type="tel" id="qr-whatsapp-number" placeholder="+971501234567"
                            data-i18n-placeholder="qr_generator.content.whatsapp_placeholder">

                        <label style="margin-top: 12px;" data-i18n="qr_generator.content.whatsapp_message">Pre-filled
                            Message</label>
                        <textarea id="qr-whatsapp-message" rows="3" placeholder="Hello! I'm interested in..."
                            data-i18n-placeholder="qr_generator.content.whatsapp_message_placeholder"></textarea>
                    </div>

                    <!-- Text Input -->
                    <div id="text-input-group" class="form-group" style="display: none;">
                        <label data-i18n="qr_generator.content.text">Plain Text</label>
                        <textarea id="qr-text" rows="4" placeholder="Enter text here"
                            data-i18n-placeholder="qr_generator.content.text_placeholder"></textarea>
                    </div>

                    <button class="btn-primary" onclick="generateQRCode()">
                        <i class="fas fa-qrcode"></i> <span data-i18n="qr_generator.content.generate">Generate QR
                            Code</span>
                    </button>
                </div>
            </div>

            <!-- DESIGN TAB -->
            <div id="qr-tab-design" class="qr-tab-content">
                <div class="space-y-6">
                    <div
                        class="text-sm font-semibold text-gray-700 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                        🎨 <span data-i18n="qr_generator.design.size">Design Settings</span></div>

                    <div class="form-group">
                        <label data-i18n="qr_generator.design.size">QR Code Size</label>
                        <input type="range" id="qr-size" min="128" max="512" value="256" step="32">
                        <div class="text-center text-sm text-gray-600 mt-2">
                            <span id="qr-size-value">256px</span>
                        </div>
                    </div>

                    <div class="form-group">
                        <label data-i18n="qr_generator.design.foreground_color">Foreground Color</label>
                        <input type="color" id="qr-fg-color" value="#000000">
                    </div>

                    <div class="form-group">
                        <label data-i18n="qr_generator.design.background_color">Background Color</label>
                        <input type="color" id="qr-bg-color" value="#ffffff">
                    </div>
                </div>
            </div>

            <!-- EXPORT TAB -->
            <div id="qr-tab-export" class="qr-tab-content">
                <div class="space-y-6">
                    <div class="text-sm font-semibold text-gray-700 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200"
                        data-i18n="qr_generator.export.title">💾 Export Options</div>

                    <p style="color: #666; margin-bottom: 20px;" data-i18n="qr_generator.export.description">
                        Download your QR code as PNG image
                    </p>

                    <div id="export-buttons">
                        <!-- Export buttons will be added here dynamically -->
                    </div>
                </div>
            </div>
        </div>

        <!-- RIGHT PANEL: QR PREVIEW (2/3) -->
        <div class="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
            <div class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fas fa-qrcode"></i>
                <span data-i18n="qr_generator.preview.title">QR Codes Preview</span>
            </div>
            <div id="qr-preview-container" class="min-h-[400px]">
                <div class="empty-state">
                    <i class="fas fa-qrcode"></i>
                    <p class="text-lg font-semibold">Generate your first QR code</p>
                    <p class="text-sm">Fill in the content on the left and click Generate</p>
                </div>
            </div>
        </div>
    </div>
</div>


<script src="js/qr-generator.js"></script>
<script>
// Initialize QR generator after script loads
setTimeout(() => {
    if (window.initializeQRGenerator) {
        window.initializeQRGenerator();
        console.log('✅ QR Generator manually initialized');
    }
}, 100);
</script>
`;
    }

    /**
     * Load tool scripts sequentially to ensure dependencies
     */
    async loadToolScriptsSequentially(scripts, toolName) {
        const externalScripts = [];
        const inlineScripts = [];

        // Separate external and inline scripts
        scripts.forEach((script, index) => {
            console.log(`Script ${index + 1}:`, script.src || 'inline', script.src ? 'external' : 'inline');
            if (script.src) {
                externalScripts.push(script);
            } else {
                inlineScripts.push(script);
            }
        });

        console.log(`Found ${externalScripts.length} external scripts and ${inlineScripts.length} inline scripts`);

        // Load external scripts first, in order
        for (const script of externalScripts) {
            if (!document.querySelector(`script[src="${script.src}"]`)) {
                console.log(`Loading external script: ${script.src}`);
                await this.loadExternalScript(script.src);
            }
        }

        // Then execute inline scripts
        inlineScripts.forEach((script, index) => {
            try {
                console.log(`Executing inline script ${index + 1} for ${toolName}`);
                const scriptEl = document.createElement('script');
                scriptEl.setAttribute('data-tool', toolName);
                scriptEl.setAttribute('data-script-index', index);
                scriptEl.textContent = script.textContent;
                document.head.appendChild(scriptEl);
            } catch (error) {
                console.error(`Error executing inline script ${index + 1}:`, error);
            }
        });
    }

    /**
     * Load tool content dynamically
     */
    async loadTool(toolName) {
        console.log(`Starting to load tool: ${toolName}`);

        // Get inline tool content
        const html = await this.getInlineToolContent(toolName);
        if (!html) {
            console.error(`Tool ${toolName} not found in inline content`);
            throw new Error('Tool not found');
        }

        console.log(`Using inline content for ${toolName}, length: ${html.length}`);

        try {

            // Since templates are now self-contained fragments, just insert directly
            console.log(`Template content length: ${html.length}`);

            // Insert content
            const contentContainer = document.getElementById(`${toolName}-content`);
            if (!contentContainer) {
                console.error(`Content container not found: ${toolName}-content`);
                throw new Error('Content container not found');
            }

            contentContainer.innerHTML = html;
            console.log(`Template inserted into container`);

            // Parse and execute template scripts
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const scripts = tempDiv.querySelectorAll('script');

            console.log(`Found ${scripts.length} script tags in template`);

            // Load external scripts first, then inline scripts
            await this.loadToolScriptsSequentially(scripts, toolName);

            console.log('All scripts loaded successfully');

            // Auto-initialize tools after loading
            if (toolName === 'social-media') {
                console.log('🎯 Social media tool loaded. Auto-initializing...');
                setTimeout(() => {
                    if (window.initializeSocialMediaToolManually) {
                        console.log('🚀 Auto-triggering social media tool initialization');
                        window.initializeSocialMediaToolManually();
                    }
                }, 100);
            } else if (toolName === 'business-card') {
                console.log('🎯 Business card tool loaded. Auto-initializing...');
                setTimeout(() => {
                    if (window.initBusinessCardToolIfNeeded) {
                        console.log('🚀 Auto-triggering business card tool initialization');
                        window.initBusinessCardToolIfNeeded();
                    }
                }, 500);
            } else if (toolName === 'discount-offer') {
                console.log('🎯 Discount offer tool loaded. Auto-initializing...');
                setTimeout(() => {
                    if (typeof initializeDiscountTool === 'function') {
                        console.log('🚀 Auto-triggering discount offer tool initialization');
                        initializeDiscountTool();
                    }
                }, 500);
            }

            // Apply i18n translations after content is loaded
            if (window.i18n) {
                console.log('Applying i18n translations to tool content');
                window.i18n.updatePageText();
            }

            // Create tool namespace to avoid conflicts
            this.createToolNamespace(toolName);

            this.toolsLoaded.add(toolName);
            console.log(`Tool ${toolName} loaded successfully`);

        } catch (error) {
            console.error(`Error loading tool ${toolName}:`, error);
            throw error;
        }
    }

    /**
     * Load tool-specific styles
     */
    async loadToolStyles(doc, toolName) {
        const styles = doc.querySelectorAll('style');

        styles.forEach((style, index) => {
            const styleId = `style-${toolName}-${index}`;

            if (!document.getElementById(styleId)) {
                const newStyle = document.createElement('style');
                newStyle.id = styleId;
                newStyle.setAttribute('data-tool', toolName);

                // Scope styles to tool content to prevent conflicts
                let scopedCSS = style.textContent;

                // Basic CSS scoping - prefix selectors with tool container
                scopedCSS = this.scopeCSS(scopedCSS, `#${toolName}-content`);

                newStyle.textContent = scopedCSS;
                document.head.appendChild(newStyle);
            }
        });
    }

    /**
     * Load tool-specific scripts
     */
    async loadToolScripts(doc, toolName) {
        // Load external scripts first
        const externalScripts = Array.from(doc.querySelectorAll('script[src]'));

        for (const script of externalScripts) {
            if (!document.querySelector(`script[src="${script.src}"]`)) {
                await this.loadExternalScript(script.src);
            }
        }

        // Then load inline scripts
        const inlineScripts = doc.querySelectorAll('script:not([src])');

        inlineScripts.forEach((script, index) => {
            try {
                // Create tool-scoped execution context
                const toolScript = document.createElement('script');
                toolScript.setAttribute('data-tool', toolName);
                toolScript.setAttribute('data-script-index', index);

                // Wrap script in namespace
                const wrappedScript = `
                    (function() {
                        // Tool namespace
                        const TOOL_NAME = '${toolName}';
                        const TOOL_CONTAINER = document.getElementById('${toolName}-content');
                        
                        // Helper to scope element queries to this tool
                        const $ = (selector) => TOOL_CONTAINER.querySelector(selector);
                        const $$ = (selector) => TOOL_CONTAINER.querySelectorAll(selector);
                        
                        // Prevent global variable conflicts by creating local scope
                        ${script.textContent}
                    })();
                `;

                toolScript.textContent = wrappedScript;
                document.body.appendChild(toolScript);

            } catch (error) {
                console.warn(`Error executing script for ${toolName}:`, error);
            }
        });
    }

    /**
     * Load external script
     */
    loadExternalScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Create tool namespace to prevent conflicts
     */
    createToolNamespace(toolName) {
        // Create tool-specific namespace
        if (!window.MarketingTools) {
            window.MarketingTools = {};
        }

        if (!window.MarketingTools[toolName]) {
            window.MarketingTools[toolName] = {
                container: document.getElementById(`${toolName}-content`),
                name: toolName,
                $: (selector) => document.getElementById(`${toolName}-content`).querySelector(selector),
                $$: (selector) => document.getElementById(`${toolName}-content`).querySelectorAll(selector)
            };
        }
    }

    /**
     * Basic CSS scoping
     */
    scopeCSS(css, scope) {
        // Simple scoping - this could be enhanced with a proper CSS parser
        const lines = css.split('\n');
        let scopedCSS = '';
        let inMediaQuery = false;

        for (let line of lines) {
            const trimmed = line.trim();

            // Skip empty lines and comments
            if (!trimmed || trimmed.startsWith('/*') || trimmed.endsWith('*/')) {
                scopedCSS += line + '\n';
                continue;
            }

            // Handle media queries
            if (trimmed.startsWith('@media')) {
                inMediaQuery = true;
                scopedCSS += line + '\n';
                continue;
            }

            if (inMediaQuery && trimmed === '}') {
                inMediaQuery = false;
                scopedCSS += line + '\n';
                continue;
            }

            // Don't scope keyframes, media queries, or root-level rules
            if (trimmed.startsWith('@') || trimmed.startsWith(':root') || inMediaQuery) {
                scopedCSS += line + '\n';
                continue;
            }

            // Scope regular CSS rules
            if (trimmed.includes('{') && !trimmed.includes('@')) {
                const [selector, ...rest] = trimmed.split('{');
                const rules = rest.join('{');

                // Don't scope body, html, or universal selectors
                if (!selector.trim().match(/^(body|html|\*)(\s|$|,)/)) {
                    scopedCSS += `${scope} ${selector.trim()} {${rules}\n`;
                } else {
                    scopedCSS += line + '\n';
                }
            } else {
                scopedCSS += line + '\n';
            }
        }

        return scopedCSS;
    }

    /**
     * Update navigation active states
     */
    updateNavigation(activeTool) {
        // Update desktop navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.tool === activeTool) {
                link.classList.add('active');
            }
        });

        // Update mobile navigation
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.classList.remove('bg-primary-50', 'text-primary-600');
            if (link.dataset.tool === activeTool) {
                link.classList.add('bg-primary-50', 'text-primary-600');
            }
        });
    }

    /**
     * Show loading overlay
     */
    showLoading() {
        console.log('📍 SHOWING loading overlay');
        this.isLoading = true;
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            overlay.style.display = 'flex'; // Force display
            console.log('📍 Loading overlay VISIBLE');

            // Force hide after 3 seconds as safety backup (reduced time)
            setTimeout(() => {
                if (this.isLoading) {
                    console.log('🚨 FORCE hiding loading overlay after timeout');
                    this.hideLoading();
                }
            }, 3000);
        }
    }

    /**
     * Hide loading overlay
     */
    hideLoading() {
        console.log('📍 HIDING loading overlay');
        this.isLoading = false;
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
            overlay.style.display = 'none'; // Force hide
            console.log('📍 Loading overlay HIDDEN');
        }
    }

    /**
     * Show notification using unified notification system
     */
    showNotification(message, type = 'success') {
        // Use unified notification system
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }

    /**
     * Get tool instance
     */
    getToolInstance(toolName) {
        return this.toolInstances.get(toolName);
    }

    /**
     * Clean up scripts from other tools to prevent conflicts
     */
    cleanupOldToolScripts(currentTool) {
        // Don't clean up scripts from the tool we're about to load
        const allTools = ['business-card', 'discount-offer', 'social-media'];
        const otherTools = allTools.filter(tool => tool !== currentTool);

        otherTools.forEach(toolName => {
            // Only remove scripts from tools that might conflict
            document.querySelectorAll(`script[data-tool="${toolName}"]`).forEach(script => {
                console.log(`Removing conflicting script from ${toolName}`);
                script.remove();
            });
        });
    }

    /**
     * Clean up tool resources
     */
    cleanupTool(toolName) {
        // Remove tool-specific styles
        document.querySelectorAll(`style[data-tool="${toolName}"]`).forEach(style => {
            style.remove();
        });

        // Remove tool-specific scripts
        document.querySelectorAll(`script[data-tool="${toolName}"]`).forEach(script => {
            script.remove();
        });

        // Clear tool content
        const container = document.getElementById(`${toolName}-content`);
        if (container) {
            container.innerHTML = '';
        }

        // Remove from loaded tools
        this.toolsLoaded.delete(toolName);

        // Remove tool instance
        this.toolInstances.delete(toolName);

        // Clean up namespace
        if (window.MarketingTools?.[toolName]) {
            delete window.MarketingTools[toolName];
        }
    }
}

// Global functions for backward compatibility
let app;

window.showHome = (updateHistory = true) => {
    app?.showHome(updateHistory);
};

window.showTool = (toolName, updateHistory = true) => {
    app?.showTool(toolName, updateHistory);
};

window.showNotification = (message, type = 'success') => {
    app?.showNotification(message, type);
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app = new MarketingToolsApp();

    // Expose app instance globally for debugging
    window.app = app;
    window.MarketingToolsApp = app;

    console.log('✅ App initialized and available as window.app');
});

// Handle page reload/refresh
window.addEventListener('load', () => {
    // Check hash first, then path
    const hash = window.location.hash;
    const path = window.location.pathname;

    if (hash) {
        // Hash-based routing (e.g., #/business-card)
        const toolName = hash.replace('#/', '');
        if (['business-card', 'discount-offer', 'social-media'].includes(toolName)) {
            app?.showTool(toolName, false);
            return;
        }
    }

    if (path === '/' || path === '/index.html') {
        app?.showHome(false);
    } else {
        const toolName = path.replace('/', '');
        if (['business-card', 'discount-offer', 'social-media'].includes(toolName)) {
            app?.showTool(toolName, false);
        } else {
            app?.showHome(false);
        }
    }
});

// Handle hash changes
window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (hash) {
        const toolName = hash.replace('#/', '');
        if (['business-card', 'discount-offer', 'social-media'].includes(toolName)) {
            app?.showTool(toolName, false);
        } else {
            app?.showHome(false);
        }
    } else {
        app?.showHome(false);
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarketingToolsApp;
}