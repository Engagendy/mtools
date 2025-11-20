/**
 * Enhanced Social Media Design Tool - Comprehensive Konva.js Implementation
 * Based on standalone HTML version with all professional features
 */

// Platform configurations - Updated to match standalone version
const platforms = {
    instagram: {
        name: 'Instagram Feed',
        width: 1080,
        height: 1350,
        display: '1080 × 1350 px'
    },
    instastory: {
        name: 'Instagram Story',
        width: 1080,
        height: 1920,
        display: '1080 × 1920 px'
    },
    facebook: {
        name: 'Facebook',
        width: 1200,
        height: 1500,
        display: '1200 × 1500 px'
    },
    twitter: {
        name: 'Twitter',
        width: 1024,
        height: 512,
        display: '1024 × 512 px'
    }
};

// Global variables for the enhanced social media designer
let currentPlatform = 'instagram';
let stage, backgroundLayer, designLayer, transformer;
let selectedNode = null;
let isInitialized = false;
let isInitializing = false;

// Background management
let currentBackgroundType = 'gradient';
let backgroundImage = null;
let backgroundImageNode = null;

// Design elements storage
let designElements = {
    storeName: null,
    tagline: null,
    mainTitle: null,
    badgeText: null,
    badgeBg: null,
    subtitle: null,
    socialHandle: null,
    categories: [],
    phoneNumber: null
};

/**
 * Initialize Canvas with Professional Quality Settings
 */
function initializeCanvas() {
    if (isInitialized) {
        console.log('✅ Canvas already initialized, skipping');
        return;
    }

    if (isInitializing) {
        console.log('⏳ Canvas initialization in progress, skipping');
        return;
    }

    isInitializing = true;
    console.log('🎨 Starting enhanced canvas initialization');

    // Check if Konva is loaded
    if (typeof Konva === 'undefined') {
        console.warn('❌ Konva not loaded yet, waiting...');
        isInitializing = false;
        setTimeout(initializeCanvas, 100);
        return;
    }

    const platform = platforms[currentPlatform];
    const container = document.getElementById('konvaContainer');

    if (!container) {
        console.warn('❌ Container not found, waiting...');
        isInitializing = false;
        setTimeout(initializeCanvas, 100);
        return;
    }

    // Clear existing canvas
    if (stage) {
        stage.destroy();
    }

    // Calculate canvas display size with enhanced quality
    const maxDisplayWidth = 500;
    const maxDisplayHeight = 700;
    const scale = Math.min(maxDisplayWidth / platform.width, maxDisplayHeight / platform.height);

    const displayWidth = platform.width * scale;
    const displayHeight = platform.height * scale;

    // Create Konva stage with professional settings
    stage = new Konva.Stage({
        container: 'konvaContainer',
        width: displayWidth,
        height: displayHeight,
        scaleX: scale,
        scaleY: scale
    });

    // Improve canvas quality for better display
    const pixelRatio = window.devicePixelRatio || 2;

    // Create layers with high quality settings
    backgroundLayer = new Konva.Layer({
        imageSmoothingEnabled: true,
        listening: false // Background doesn't need events
    });
    designLayer = new Konva.Layer({
        imageSmoothingEnabled: true,
        clearBeforeDraw: true,
        listening: true // Updated from deprecated hitGraphEnabled
    });

    stage.add(backgroundLayer);
    stage.add(designLayer);

    // Apply pixel ratio to layers for sharp rendering
    backgroundLayer.canvas.setPixelRatio(pixelRatio);
    designLayer.canvas.setPixelRatio(pixelRatio);

    // Create transformer for selection
    transformer = new Konva.Transformer({
        rotateEnabled: false,
        borderStroke: '#667eea',
        borderStrokeWidth: 2,
        anchorStroke: '#667eea',
        anchorStrokeWidth: 2,
        anchorFill: '#ffffff',
        anchorSize: 8
    });
    designLayer.add(transformer);

    // Enhanced selection handling
    stage.on('click tap', function (e) {
        if (e.target === stage) {
            transformer.nodes([]);
            selectedNode = null;
            updateSelectionInfo();
            return;
        }

        if (e.target.hasName('design-element')) {
            transformer.nodes([e.target]);
            selectedNode = e.target;
            updateSelectionInfo();
        } else {
            transformer.nodes([]);
            selectedNode = null;
            updateSelectionInfo();
        }
    });

    // Double-click text editing functionality
    stage.on('dblclick dbltap', function (e) {
        if (e.target.hasName('design-element') && e.target.className === 'Text') {
            editTextElement(e.target);
        }
    });

    console.log('✅ Enhanced canvas initialized successfully');

    // Create initial design with all components
    createBackground();
    createDesignElements();
    updateCanvas();

    isInitialized = true;
    isInitializing = false;
}

/**
 * Create Background with Gradient or Image Support
 */
function createBackground() {
    if (!backgroundLayer) return;

    const platform = platforms[currentPlatform];
    backgroundLayer.destroyChildren();

    if (currentBackgroundType === 'image' && backgroundImage) {
        // Create image background with positioning controls
        const bgImageX = parseFloat(document.getElementById('bgImageX')?.value || 0);
        const bgImageY = parseFloat(document.getElementById('bgImageY')?.value || 0);
        const bgImageScale = parseFloat(document.getElementById('bgImageScale')?.value || 100) / 100;

        backgroundImageNode = new Konva.Image({
            x: (platform.width * bgImageX) / 100,
            y: (platform.height * bgImageY) / 100,
            image: backgroundImage,
            width: platform.width * bgImageScale,
            height: platform.height * bgImageScale,
            listening: false
        });

        backgroundLayer.add(backgroundImageNode);
    } else {
        // Create professional gradient background
        const bgColor1 = document.getElementById('bgColor1')?.value || '#007BFF';
        const bgColor2 = document.getElementById('bgColor2')?.value || '#0056b3';

        const background = new Konva.Rect({
            x: 0,
            y: 0,
            width: platform.width,
            height: platform.height,
            fillLinearGradientStartPoint: { x: 0, y: 0 },
            fillLinearGradientEndPoint: { x: platform.width, y: platform.height },
            fillLinearGradientColorStops: [0, bgColor1, 0.5, bgColor2, 1, '#ffffff']
        });

        backgroundLayer.add(background);
    }

    backgroundLayer.draw();
}

/**
 * Create Comprehensive Design Elements
 */
function createDesignElements() {
    const platform = platforms[currentPlatform];
    const isHorizontal = platform.width > platform.height;
    const textColor = document.getElementById('textColor')?.value || '#ffffff';

    // Clear design layer (except transformer)
    const childrenToRemove = designLayer.children.filter(child => child !== transformer);
    childrenToRemove.forEach(child => child.destroy());

    // Reset design elements storage
    designElements = {
        storeName: null, tagline: null, mainTitle: null, badgeText: null,
        badgeBg: null, subtitle: null, socialHandle: null, categories: [], phoneNumber: null
    };

    // Professional font sizing based on platform
    const baseScale = Math.min(platform.width / 1080, platform.height / 1350);
    let fontSizes;

    if (isHorizontal) {
        fontSizes = {
            logo: Math.round(32 * baseScale),
            title: Math.round(40 * baseScale),
            badge: Math.round(28 * baseScale),
            text: Math.round(24 * baseScale),
            category: Math.round(18 * baseScale)
        };
    } else {
        fontSizes = {
            logo: Math.round(48 * baseScale),
            title: Math.round(64 * baseScale),
            badge: Math.round(36 * baseScale),
            text: Math.round(28 * baseScale),
            category: Math.round(22 * baseScale)
        };
    }

    // Professional positioning
    const spacing = {
        top: platform.height * 0.06,
        logoToTagline: platform.height * 0.05,
        titleY: isHorizontal ? platform.height * 0.25 : platform.height * 0.18,
        badgeY: isHorizontal ? platform.height * 0.45 : platform.height * 0.32,
        categoriesY: isHorizontal ? platform.height * 0.65 : platform.height * 0.45,
        subtitleY: platform.height * 0.85,
        socialY: platform.height * 0.92
    };

    // Store name with professional typography
    const storeName = document.getElementById('storeName')?.value || 'Alalamy Sharjah';
    designElements.storeName = new Konva.Text({
        x: platform.width / 2,
        y: spacing.top,
        text: storeName,
        fontSize: fontSizes.logo,
        fontFamily: 'Almarai',
        fontStyle: 'bold',
        fill: textColor,
        align: 'center',
        verticalAlign: 'middle',
        draggable: true,
        name: 'design-element',
        letterSpacing: 1,
        lineHeight: 1.2,
        textBaseline: 'middle',
        perfectDrawEnabled: false
    });
    designElements.storeName.offsetX(designElements.storeName.width() / 2);

    // Auto-detect and set direction for store name
    const storeNameDirection = analyzeTextDirection(storeName);
    designElements.storeName.setAttr('direction', storeNameDirection);

    // Tagline
    const tagline = document.getElementById('tagline')?.value || 'العالمي ملك السعادة ❤️';
    if (tagline.trim()) {
        designElements.tagline = new Konva.Text({
            x: platform.width / 2,
            y: spacing.top + spacing.logoToTagline,
            text: tagline,
            fontSize: fontSizes.text,
            fontFamily: 'Almarai',
            fill: textColor,
            align: 'center',
            verticalAlign: 'middle',
            draggable: true,
            name: 'design-element'
        });
        designElements.tagline.offsetX(designElements.tagline.width() / 2);
    }

    // Main title
    const mainTitle = document.getElementById('mainTitle')?.value || 'عروض خصم متنوعة على جميع الإكسسوارات! 🎉';
    designElements.mainTitle = new Konva.Text({
        x: platform.width / 2,
        y: spacing.titleY,
        text: mainTitle,
        fontSize: fontSizes.title,
        fontFamily: 'Almarai',
        fontStyle: 'bold',
        fill: textColor,
        align: 'center',
        verticalAlign: 'middle',
        width: platform.width * 0.9,
        draggable: true,
        name: 'design-element',
        shadowColor: 'rgba(0,0,0,0.3)',
        shadowBlur: 4,
        shadowOffset: { x: 2, y: 2 }
    });
    designElements.mainTitle.offsetX(designElements.mainTitle.width() / 2);

    // Badge elements (individual control)
    const badgeText = document.getElementById('badgeText')?.value || 'من 15% إلى 30%';
    const accentColor = document.getElementById('accentColor')?.value || '#FF0000';

    const badgeWidth = platform.width * 0.28;
    const badgeHeight = platform.height * 0.05;
    const badgeX = platform.width / 2 - badgeWidth / 2;

    // Badge background - individually selectable
    designElements.badgeBg = new Konva.Rect({
        x: badgeX,
        y: spacing.badgeY - badgeHeight / 2,
        width: badgeWidth,
        height: badgeHeight,
        fill: accentColor,
        cornerRadius: badgeHeight / 2,
        shadowColor: 'rgba(0,0,0,0.4)',
        shadowBlur: 8,
        shadowOffset: { x: 0, y: 4 },
        draggable: true,
        name: 'design-element badge-bg',
        id: 'main-badge-bg'
    });

    // Badge text - individually selectable
    designElements.badgeText = new Konva.Text({
        x: badgeX,
        y: spacing.badgeY - badgeHeight / 2,
        width: badgeWidth,
        height: badgeHeight,
        text: badgeText,
        fontSize: fontSizes.badge,
        fontFamily: 'Almarai',
        fontStyle: 'bold',
        fill: '#ffffff',
        align: 'center',
        verticalAlign: 'middle',
        draggable: true,
        name: 'design-element badge-text',
        id: 'main-badge-text'
    });

    // Categories grid with individual control
    createCategoriesGrid(isHorizontal, fontSizes, spacing, platform, accentColor, baseScale);

    // Subtitle
    const subtitle = document.getElementById('subtitle')?.value || 'اضغط الآن لعرض أفضل العروض';
    designElements.subtitle = new Konva.Text({
        x: platform.width / 2,
        y: spacing.subtitleY,
        text: subtitle,
        fontSize: fontSizes.text,
        fontFamily: 'Almarai',
        fill: textColor,
        align: 'center',
        verticalAlign: 'middle',
        width: platform.width * 0.85,
        draggable: true,
        name: 'design-element'
    });
    designElements.subtitle.offsetX(designElements.subtitle.width() / 2);

    // Phone number (if provided)
    const phoneNumber = document.getElementById('phoneNumber')?.value?.trim();
    if (phoneNumber) {
        designElements.phoneNumber = new Konva.Text({
            x: platform.width / 2,
            y: spacing.socialY - (fontSizes.text * 1.5),
            text: phoneNumber,
            fontSize: fontSizes.text,
            fontFamily: 'Almarai',
            fill: textColor,
            align: 'center',
            verticalAlign: 'middle',
            draggable: true,
            name: 'design-element phone-number',
            id: 'phone-number-text'
        });
        designElements.phoneNumber.offsetX(designElements.phoneNumber.width() / 2);
    }

    // Social handle
    const socialHandle = document.getElementById('socialHandle')?.value || '@alalamy.sharjah';
    designElements.socialHandle = new Konva.Text({
        x: platform.width / 2,
        y: spacing.socialY,
        text: socialHandle,
        fontSize: fontSizes.text,
        fontFamily: 'Almarai',
        fontStyle: 'bold',
        fill: textColor,
        align: 'center',
        verticalAlign: 'middle',
        draggable: true,
        name: 'design-element'
    });
    designElements.socialHandle.offsetX(designElements.socialHandle.width() / 2);

    // Add elements in proper layering order
    addElementsToLayer();
    designLayer.draw();
}

/**
 * Create Categories Grid with Individual Element Control
 */
function createCategoriesGrid(isHorizontal, fontSizes, spacing, platform, accentColor, baseScale) {
    designElements.categories = [];

    const categoryData = [
        {
            name: document.getElementById('category1')?.value || 'كفرات موبايل',
            discount: document.getElementById('discount1')?.value || '30'
        },
        {
            name: document.getElementById('category2')?.value || 'شواحن وكابلات',
            discount: document.getElementById('discount2')?.value || '25'
        },
        {
            name: document.getElementById('category3')?.value || 'ماوس ولوحات',
            discount: document.getElementById('discount3')?.value || '20'
        },
        {
            name: document.getElementById('category4')?.value || 'سماعات',
            discount: document.getElementById('discount4')?.value || '15'
        }
    ];

    const categoryWidth = isHorizontal ? (platform.width * 0.85) / 4 : (platform.width * 0.85) / 2;
    const categoryHeight = platform.height * 0.08;
    const gap = platform.width * 0.02;

    categoryData.forEach((data, index) => {
        const col = isHorizontal ? index : index % 2;
        const row = isHorizontal ? 0 : Math.floor(index / 2);

        const x = (platform.width * 0.075) + col * (categoryWidth + gap);
        const y = spacing.categoriesY + row * (categoryHeight + gap);

        const discountBadgeWidth = categoryWidth * 0.3;
        const discountBadgeHeight = categoryHeight * 0.25;

        // Category background - individually selectable
        const categoryRect = new Konva.Rect({
            x: x,
            y: y,
            width: categoryWidth,
            height: categoryHeight,
            fill: 'rgba(255, 255, 255, 0.9)',
            cornerRadius: categoryHeight * 0.125,
            shadowColor: 'rgba(0,0,0,0.2)',
            shadowBlur: 4 * baseScale,
            shadowOffset: { x: 0, y: 2 * baseScale },
            draggable: true,
            name: 'design-element category-bg',
            id: `category-bg-${index + 1}`
        });

        // Discount background - individually selectable
        const discountRect = new Konva.Rect({
            x: x + categoryWidth / 2 - discountBadgeWidth / 2,
            y: y + categoryHeight - discountBadgeHeight - categoryHeight * 0.1,
            width: discountBadgeWidth,
            height: discountBadgeHeight,
            fill: accentColor,
            cornerRadius: discountBadgeHeight / 2,
            shadowColor: 'rgba(0,0,0,0.3)',
            shadowBlur: 3 * baseScale,
            shadowOffset: { x: 0, y: 2 * baseScale },
            draggable: true,
            name: 'design-element discount-bg',
            id: `discount-bg-${index + 1}`
        });

        // Category name - individually selectable
        const categoryName = new Konva.Text({
            x: x,
            y: y + categoryHeight * 0.05,
            width: categoryWidth,
            height: categoryHeight * 0.6,
            text: data.name,
            fontSize: fontSizes.category,
            fontFamily: 'Almarai',
            fontStyle: 'bold',
            fill: '#333',
            align: 'center',
            verticalAlign: 'middle',
            draggable: true,
            name: 'design-element category-name',
            id: `category-name-${index + 1}`
        });

        // Discount text - individually selectable
        const discountText = new Konva.Text({
            x: x + categoryWidth / 2 - discountBadgeWidth / 2,
            y: y + categoryHeight - discountBadgeHeight - categoryHeight * 0.1,
            width: discountBadgeWidth,
            height: discountBadgeHeight,
            text: data.discount + '%',
            fontSize: Math.max(fontSizes.category * 0.8, 10),
            fontFamily: 'Almarai',
            fontStyle: 'bold',
            fill: '#ffffff',
            align: 'center',
            verticalAlign: 'middle',
            draggable: true,
            name: 'design-element discount-text',
            id: `discount-text-${index + 1}`
        });

        // Store individual elements for proper layering
        designElements.categories.push(categoryRect, discountRect, categoryName, discountText);
    });
}

/**
 * Add Elements to Layer in Correct Order
 */
function addElementsToLayer() {
    // 1. Add badge background first
    if (designElements.badgeBg) designLayer.add(designElements.badgeBg);

    // 2. Add category backgrounds and discount backgrounds
    if (designElements.categories && designElements.categories.length > 0) {
        designElements.categories.forEach(category => {
            if (category.hasName && (category.hasName('category-bg') || category.hasName('discount-bg'))) {
                designLayer.add(category);
            }
        });
    }

    // 3. Add all text elements
    Object.entries(designElements).forEach(([key, element]) => {
        if (element && key !== 'categories' && key !== 'badgeBg') {
            designLayer.add(element);
        }
    });

    // 4. Add category text elements last
    if (designElements.categories && designElements.categories.length > 0) {
        designElements.categories.forEach(category => {
            if (category.hasName && (category.hasName('category-name') || category.hasName('discount-text'))) {
                designLayer.add(category);
            }
        });
    }
}

/**
 * Update Canvas
 */
function updateCanvas() {
    if (!stage) return;
    createBackground();
    createDesignElements();
}

/**
 * Select Platform
 */
function selectPlatform(platform) {
    console.log('🔄 selectPlatform called with:', platform);

    // Validate platform parameter
    if (!platform || !platforms[platform]) {
        console.error('❌ Invalid platform:', platform, 'Available platforms:', Object.keys(platforms));
        showNotification('❌ منصة غير صالحة', 'error');
        return;
    }

    currentPlatform = platform;
    console.log('✅ Platform set to:', currentPlatform);

    // Update UI
    document.querySelectorAll('.platform-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.closest('.platform-btn').classList.add('active');
    }

    const platformNameEl = document.getElementById('platformName');
    const platformDimensionsEl = document.getElementById('platformDimensions');

    if (platformNameEl) platformNameEl.textContent = platforms[platform].name;
    if (platformDimensionsEl) platformDimensionsEl.textContent = platforms[platform].display;

    initializeCanvas();
}

/**
 * Professional Text Editing
 */
function editTextElement(textNode) {
    if (!textNode || textNode.className !== 'Text') return;

    const nodePos = textNode.absolutePosition();
    const stageBox = stage.container().getBoundingClientRect();
    const scale = stage.scaleX();

    const input = document.createElement('input');
    input.type = 'text';
    input.value = textNode.text();
    input.style.position = 'absolute';
    input.style.left = (stageBox.left + nodePos.x * scale) + 'px';
    input.style.top = (stageBox.top + nodePos.y * scale) + 'px';
    input.style.width = (textNode.width() * scale) + 'px';
    input.style.fontSize = (textNode.fontSize() * scale) + 'px';
    input.style.fontFamily = textNode.fontFamily();
    input.style.color = textNode.fill();
    input.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    input.style.border = '2px solid #667eea';
    input.style.borderRadius = '4px';
    input.style.padding = '2px 4px';
    input.style.textAlign = textNode.align();
    input.style.zIndex = '1000';

    textNode.visible(false);
    designLayer.batchDraw();

    document.body.appendChild(input);
    input.focus();
    input.select();

    function finishEdit() {
        const newText = input.value.trim();
        if (newText !== '') {
            textNode.text(newText);
        }
        textNode.visible(true);
        designLayer.batchDraw();
        document.body.removeChild(input);

        showNotification('تم تحديث النص بنجاح');
    }

    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') finishEdit();
        if (e.key === 'Escape') {
            textNode.visible(true);
            designLayer.batchDraw();
            document.body.removeChild(input);
        }
    });

    input.addEventListener('blur', finishEdit);
}

/**
 * Professional Notification System - Using unified notification system
 * The showNotification function is now provided by js/notifications.js
 */


/**
 * Enhanced Selection Detection for All Design Tools
 */
function getSelectedNode() {
    const transformerNodes = transformer.nodes();
    let targetNode = null;

    if (transformerNodes.length > 0) {
        targetNode = transformerNodes[0];
    } else if (selectedNode) {
        targetNode = selectedNode;
    }

    return targetNode;
}

/**
 * Design Tools Functions
 */
function duplicateSelected() {
    const targetNode = getSelectedNode();
    if (!targetNode) {
        showNotification('❌ يرجى تحديد عنصر أولاً - اضغط على أي عنصر في التصميم', 'error');
        return;
    }

    const clone = targetNode.clone();
    clone.x(clone.x() + 20);
    clone.y(clone.y() + 20);

    if (clone.hasName('design-element')) {
        const originalId = clone.id();
        if (originalId) {
            clone.id(originalId + '-copy-' + Date.now());
        }
    }

    designLayer.add(clone);
    transformer.nodes([clone]);
    selectedNode = clone;

    designLayer.draw();
    updateSelectionInfo();
    showNotification('✅ تم نسخ العنصر بنجاح');
}

function deleteSelected() {
    const targetNode = getSelectedNode();
    if (!targetNode) {
        showNotification('❌ يرجى تحديد عنصر أولاً - اضغط على أي عنصر في التصميم', 'error');
        return;
    }

    targetNode.destroy();
    transformer.nodes([]);
    selectedNode = null;

    designLayer.draw();
    updateSelectionInfo();
    showNotification('✅ تم حذف العنصر');
}

function bringToFront() {
    const targetNode = getSelectedNode();
    if (!targetNode) {
        showNotification('❌ يرجى تحديد عنصر أولاً - اضغط على أي عنصر في التصميم', 'error');
        return;
    }

    targetNode.moveToTop();
    transformer.moveToTop();

    designLayer.draw();
    showNotification('✅ تم نقل العنصر للأمام');
}

function sendToBack() {
    const targetNode = getSelectedNode();
    if (!targetNode) {
        showNotification('❌ يرجى تحديد عنصر أولاً - اضغط على أي عنصر في التصميم', 'error');
        return;
    }

    targetNode.moveToBottom();
    designLayer.draw();
    showNotification('✅ تم نقل العنصر للخلف');
}

function clearAll() {
    if (confirm('هل أنت متأكد من مسح جميع العناصر؟')) {
        designLayer.children.forEach(child => {
            if (child !== transformer) {
                child.destroy();
            }
        });

        transformer.nodes([]);
        selectedNode = null;

        designLayer.draw();
        updateSelectionInfo();
        showNotification('✅ تم مسح جميع العناصر');
    }
}

function resetPositions() {
    createDesignElements();
    transformer.nodes([]);
    selectedNode = null;
    updateSelectionInfo();
    showNotification('✅ تم إعادة تعيين المواضع');
}

/**
 * Enhanced Selection Info with Comprehensive Element Detection
 */
function updateSelectionInfo() {
    const infoElement = document.getElementById('selectionInfo');
    const textFormattingPanel = document.getElementById('textFormattingPanel');

    if (!selectedNode) {
        if (infoElement) infoElement.innerHTML = 'اضغط على أي عنصر لتحديده والتحكم به';
        if (textFormattingPanel) textFormattingPanel.style.display = 'none';
        return;
    }

    let elementType = '';
    let elementDesc = '';
    let isTextElement = false;

    // Enhanced element type detection
    if (selectedNode.hasName('category-bg')) {
        elementType = '🟪 خلفية فئة';
        elementDesc = selectedNode.id().replace('category-bg-', 'الفئة ');
    } else if (selectedNode.hasName('category-name')) {
        elementType = '📝 اسم فئة';
        elementDesc = selectedNode.id().replace('category-name-', 'الفئة ') + ': ' + selectedNode.text();
        isTextElement = true;
    } else if (selectedNode.hasName('discount-bg')) {
        elementType = '🔴 خلفية خصم';
        elementDesc = selectedNode.id().replace('discount-bg-', 'خصم الفئة ');
    } else if (selectedNode.hasName('discount-text')) {
        elementType = '💯 نص خصم';
        elementDesc = selectedNode.id().replace('discount-text-', 'خصم الفئة ') + ': ' + selectedNode.text();
        isTextElement = true;
    } else if (selectedNode.hasName('badge-bg')) {
        elementType = '🏷️ خلفية شارة';
        elementDesc = 'شارة الخصم الرئيسية';
    } else if (selectedNode.hasName('badge-text')) {
        elementType = '🏷️ نص شارة';
        elementDesc = 'نص: ' + selectedNode.text();
        isTextElement = true;
    } else if (selectedNode.hasName('phone-number')) {
        elementType = '📞 رقم هاتف';
        elementDesc = 'رقم: ' + selectedNode.text();
        isTextElement = true;
    } else if (selectedNode.className === 'Text' || selectedNode.constructor.name === 'Text') {
        elementType = '📖 نص';
        elementDesc = selectedNode.text().substring(0, 30) + (selectedNode.text().length > 30 ? '...' : '');
        isTextElement = true;

        // More specific text type detection
        const textContent = selectedNode.text();
        if (textContent.includes('@')) {
            elementType = '📱 حساب وسائل التواصل';
        } else if (textContent.includes('اضغط') || textContent.includes('عرض')) {
            elementType = '📢 نص إعلاني';
        } else if (textContent.includes('%')) {
            elementType = '💯 نص خصم';
        } else if (/\d/.test(textContent) && (textContent.includes('+') || textContent.includes('05') || textContent.includes('06'))) {
            elementType = '📞 رقم هاتف';
        }
    } else {
        elementType = '🎨 عنصر';
        elementDesc = 'عنصر تصميم';
    }

    if (infoElement) {
        infoElement.innerHTML = `<strong>${elementType}</strong><br><small>${elementDesc}</small>`;
        infoElement.style.color = '#667eea';
    }

    // Show/hide text formatting panel
    if (textFormattingPanel) {
        if (isTextElement) {
            textFormattingPanel.style.display = 'block';
            updateTextFormattingButtons();
        } else {
            textFormattingPanel.style.display = 'none';
        }
    }
}

/**
 * Professional Text Direction Analysis
 */
function analyzeTextDirection(text) {
    if (!text) return 'ltr';

    // Use BiDi library for professional direction detection
    if (typeof Bidi !== 'undefined') {
        try {
            const direction = Bidi.getDirection(text);
            return direction;
        } catch (error) {
            console.warn('BiDi analysis failed, using fallback');
        }
    }

    // Fallback: Basic Arabic character detection
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return arabicRegex.test(text) ? 'rtl' : 'ltr';
}

/**
 * Text Formatting Functions with Professional BiDi Support
 */
function setTextDirection(direction) {
    const transformerNodes = transformer.nodes();
    let textNode = getSelectedTextNode();

    if (!textNode) {
        showNotification('❌ يرجى تحديد عنصر نص أولاً - اضغط على أي نص في التصميم', 'error');
        return;
    }

    const text = textNode.text();

    try {
        if (typeof Bidi !== 'undefined') {
            let processedText = text;

            if (direction === 'rtl') {
                processedText = Bidi(text, { dir: 'rtl' });
            } else {
                processedText = Bidi(text, { dir: 'ltr' });
            }

            textNode.text(processedText);
        }

        textNode.setAttr('direction', direction);

        if (direction === 'rtl') {
            textNode.align('right');
        } else {
            textNode.align('left');
        }

    } catch (error) {
        console.warn('BiDi library not fully loaded, using basic direction:', error);
        textNode.setAttr('direction', direction);
    }

    designLayer.draw();
    selectedNode = textNode;
    updateTextFormattingButtons();
    showNotification(`✅ تم تغيير اتجاه النص إلى ${direction.toUpperCase()} باستخدام مكتبة محترفة`);
}

function setTextAlign(align) {
    let textNode = getSelectedTextNode();
    if (!textNode) {
        showNotification('❌ يرجى تحديد عنصر نص أولاً', 'error');
        return;
    }

    textNode.align(align);
    designLayer.draw();
    selectedNode = textNode;
    updateTextFormattingButtons();

    const alignText = align === 'left' ? 'اليسار' : align === 'center' ? 'الوسط' : 'اليمين';
    showNotification(`✅ تم محاذاة النص إلى ${alignText}`);
}

function adjustFontSize(change) {
    let textNode = getSelectedTextNode();
    if (!textNode) {
        showNotification('❌ يرجى تحديد عنصر نص أولاً', 'error');
        return;
    }

    const currentSize = textNode.fontSize();
    const newSize = Math.max(8, Math.min(120, currentSize + change));
    const optimalLineHeight = newSize * 1.2;

    textNode.fontSize(newSize);
    textNode.lineHeight(optimalLineHeight / newSize);

    designLayer.draw();
    selectedNode = textNode;
    updateTextFormattingButtons();

    showNotification(`✅ تم تغيير حجم الخط إلى ${newSize}px مع ضبط احترافي للمسافات`);
}

function autoDetectDirection() {
    let textNode = getSelectedTextNode();
    if (!textNode) {
        showNotification('❌ يرجى تحديد عنصر نص أولاً', 'error');
        return;
    }

    const text = textNode.text();
    const detectedDirection = analyzeTextDirection(text);

    selectedNode = textNode;
    setTextDirection(detectedDirection);
    showNotification(`🤖 تم اكتشاف الاتجاه تلقائياً: ${detectedDirection.toUpperCase()}`);
}

function changeFontFamily() {
    let textNode = getSelectedTextNode();
    if (!textNode) {
        showNotification('❌ يرجى تحديد عنصر نص أولاً', 'error');
        return;
    }

    const fontFamilySelect = document.getElementById('fontFamilySelect');
    const selectedFont = fontFamilySelect?.value || 'Almarai';

    textNode.fontFamily(selectedFont);
    designLayer.draw();
    selectedNode = textNode;

    const fontNames = {
        'Almarai': 'الماريا', 'Cairo': 'القاهرة', 'Tajawal': 'تجوال',
        'Amiri': 'أميري', 'Rubik': 'روبيك', 'Inter': 'إنتر',
        'Lato': 'لاتو', 'Open Sans': 'أوبن سانز', 'Roboto': 'روبوتو',
        'Poppins': 'بوبينز', 'Montserrat': 'مونتسيرات', 'Source Sans Pro': 'سورس سانز برو'
    };

    const displayName = fontNames[selectedFont] || selectedFont;
    showNotification(`✅ تم تغيير الخط إلى ${displayName}`);
}

function getSelectedTextNode() {
    const transformerNodes = transformer.nodes();
    let textNode = null;

    if (transformerNodes.length > 0) {
        const currentNode = transformerNodes[0];
        if (currentNode.getClassName() === 'Text' || currentNode.constructor.name === 'Text') {
            textNode = currentNode;
        }
    }

    if (!textNode && selectedNode && (selectedNode.getClassName() === 'Text' || selectedNode.constructor.name === 'Text')) {
        textNode = selectedNode;
    }

    return textNode;
}

function updateTextFormattingButtons() {
    let textNode = getSelectedTextNode();
    if (!textNode) return;

    // Update direction buttons
    const rtlBtn = document.getElementById('rtlBtn');
    const ltrBtn = document.getElementById('ltrBtn');
    const direction = textNode.getAttr('direction') || 'rtl';

    if (rtlBtn) rtlBtn.classList.toggle('active', direction === 'rtl');
    if (ltrBtn) ltrBtn.classList.toggle('active', direction === 'ltr');

    // Update alignment buttons
    const leftBtn = document.getElementById('leftBtn');
    const centerBtn = document.getElementById('centerBtn');
    const rightBtn = document.getElementById('rightBtn');
    const align = textNode.align() || 'center';

    if (leftBtn) leftBtn.classList.toggle('active', align === 'left');
    if (centerBtn) centerBtn.classList.toggle('active', align === 'center');
    if (rightBtn) rightBtn.classList.toggle('active', align === 'right');

    // Update font size display
    const fontSizeDisplay = document.getElementById('fontSizeDisplay');
    if (fontSizeDisplay) fontSizeDisplay.textContent = Math.round(textNode.fontSize()) + 'px';

    // Update font family dropdown
    const fontFamilySelect = document.getElementById('fontFamilySelect');
    if (fontFamilySelect) fontFamilySelect.value = textNode.fontFamily() || 'Almarai';
}

/**
 * Background Type Selection
 */
function selectBackgroundType(type) {
    currentBackgroundType = type;

    const gradientBtn = document.getElementById('gradientBgBtn');
    const imageBtn = document.getElementById('imageBgBtn');
    const gradientControls = document.getElementById('gradientControls');
    const imageControls = document.getElementById('imageControls');

    if (type === 'gradient') {
        if (gradientBtn) gradientBtn.classList.add('active');
        if (imageBtn) imageBtn.classList.remove('active');
        if (gradientControls) gradientControls.style.display = 'block';
        if (imageControls) imageControls.style.display = 'none';
    } else {
        if (gradientBtn) gradientBtn.classList.remove('active');
        if (imageBtn) imageBtn.classList.add('active');
        if (gradientControls) gradientControls.style.display = 'none';
        if (imageControls) imageControls.style.display = 'block';
    }

    if (backgroundLayer) {
        createBackground();
        showNotification(`✅ تم تغيير نوع الخلفية إلى ${type === 'gradient' ? 'تدرج لوني' : 'صورة'}`);
    }
}

/**
 * Background Image Management
 */
function handleBackgroundImage() {
    const fileInput = document.getElementById('backgroundImageInput');
    const file = fileInput?.files[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showNotification('❌ يرجى اختيار ملف صورة صالح', 'error');
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        showNotification('❌ حجم الملف كبير جداً. يرجى اختيار صورة أقل من 5MB', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            backgroundImage = img;

            // Show preview and controls
            const previewImg = document.getElementById('backgroundPreviewImg');
            const previewContainer = document.getElementById('backgroundImagePreview');
            const positionControls = document.getElementById('imagePositionControls');

            if (previewImg) previewImg.src = e.target.result;
            if (previewContainer) previewContainer.style.display = 'block';
            if (positionControls) positionControls.style.display = 'block';

            // Reset position controls
            if (document.getElementById('bgImageX')) document.getElementById('bgImageX').value = 0;
            if (document.getElementById('bgImageY')) document.getElementById('bgImageY').value = 0;
            if (document.getElementById('bgImageScale')) document.getElementById('bgImageScale').value = 100;

            createBackground();
            showNotification('✅ تم رفع الصورة بنجاح! يمكنك تعديل موضعها الآن');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function updateBackgroundPosition() {
    if (currentBackgroundType === 'image' && backgroundImage && backgroundLayer) {
        createBackground();
    }
}

function resetBackgroundPosition() {
    if (document.getElementById('bgImageX')) document.getElementById('bgImageX').value = 0;
    if (document.getElementById('bgImageY')) document.getElementById('bgImageY').value = 0;
    if (document.getElementById('bgImageScale')) document.getElementById('bgImageScale').value = 100;
    updateBackgroundPosition();
    showNotification('✅ تم إعادة تعيين موضع الصورة');
}

function removeBackgroundImage() {
    backgroundImage = null;
    backgroundImageNode = null;

    const previewContainer = document.getElementById('backgroundImagePreview');
    const positionControls = document.getElementById('imagePositionControls');
    const fileInput = document.getElementById('backgroundImageInput');

    if (previewContainer) previewContainer.style.display = 'none';
    if (positionControls) positionControls.style.display = 'none';
    if (fileInput) fileInput.value = '';

    selectBackgroundType('gradient');
    showNotification('✅ تم حذف صورة الخلفية');
}

/**
 * Professional Export Functionality
 */
function exportFlyer(quality = 1) {
    const platform = platforms[currentPlatform];
    const format = document.querySelector('input[name="exportFormat"]:checked')?.value || 'png';
    const storeName = document.getElementById('storeName')?.value || 'flyer';

    // Hide transformer during export
    transformer.visible(false);

    // Export with professional quality
    const dataURL = stage.toDataURL({
        mimeType: format === 'jpg' ? 'image/jpeg' : 'image/png',
        quality: format === 'jpg' ? 0.95 : 1,
        pixelRatio: quality
    });

    transformer.visible(true);
    designLayer.draw();

    // Download
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `${storeName}-${currentPlatform}-${quality}x.${format}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const qualityText = quality === 1 ? 'عادية' : quality === 2 ? 'عالية' : 'فائقة';
    showNotification(`✅ تم تصدير العرض بجودة ${qualityText}!`);
}

/**
 * Initialize Tool
 */
function initializeSocialMediaTool() {
    if (isInitialized || isInitializing) {
        console.log('🔄 Tool already initialized or initializing');
        return;
    }

    console.log('🚀 Starting comprehensive social media tool initialization');

    if (typeof Konva !== 'undefined' && document.getElementById('konvaContainer')) {
        console.log('✅ Starting enhanced tool with all features');
        selectBackgroundType('gradient');
        initializeCanvas();
    } else {
        console.log('❌ Requirements not met for initialization');
        isInitializing = false;
    }
}

// Manual trigger function
window.initializeSocialMediaToolManually = function () {
    console.log('🔧 Manual comprehensive initialization triggered');
    isInitialized = false;
    isInitializing = false;
    initializeSocialMediaTool();
};

// Debug functions
window.debugKonva = function () {
    console.log('🔍 === COMPREHENSIVE KONVA DEBUG ===');
    console.log('Konva available:', typeof Konva !== 'undefined');
    console.log('Container exists:', !!document.getElementById('konvaContainer'));
    console.log('Current platform:', currentPlatform);
    console.log('Platform config:', platforms[currentPlatform]);
    console.log('Design elements:', designElements);
    console.log('Background type:', currentBackgroundType);
    console.log('Selected node:', selectedNode);
};

window.checkKonvaGlobally = function () {
    console.log('=== GLOBAL KONVA STATUS ===');
    console.log('typeof Konva:', typeof Konva);
    console.log('typeof window.Konva:', typeof window.Konva);
    console.log('Konva in window:', 'Konva' in window);

    if (typeof Konva !== 'undefined') {
        console.log('Konva.version:', Konva.version);
        console.log('Konva.Stage:', typeof Konva.Stage);
    }
};

// Make functions globally available
window.selectPlatform = selectPlatform;
window.updateCanvas = updateCanvas;
window.selectBackgroundType = selectBackgroundType;
window.handleBackgroundImage = handleBackgroundImage;
window.updateBackgroundPosition = updateBackgroundPosition;
window.resetBackgroundPosition = resetBackgroundPosition;
window.removeBackgroundImage = removeBackgroundImage;
window.duplicateSelected = duplicateSelected;
window.deleteSelected = deleteSelected;
window.bringToFront = bringToFront;
window.sendToBack = sendToBack;
window.clearAll = clearAll;
window.resetPositions = resetPositions;
window.setTextDirection = setTextDirection;
window.setTextAlign = setTextAlign;
window.adjustFontSize = adjustFontSize;
window.autoDetectDirection = autoDetectDirection;
window.changeFontFamily = changeFontFamily;
window.exportFlyer = exportFlyer;

// Additional text formatting functions for compatibility
window.makeTextBold = function () {
    let textNode = getSelectedTextNode();
    if (!textNode) {
        showNotification('❌ يرجى تحديد عنصر نص أولاً', 'error');
        return;
    }

    const currentStyle = textNode.fontStyle() || 'normal';
    const newStyle = currentStyle.includes('bold') ? 'normal' : 'bold';

    textNode.fontStyle(newStyle);
    designLayer.draw();
    selectedNode = textNode;

    showNotification(`✅ تم ${newStyle === 'bold' ? 'تفعيل' : 'إلغاء'} النص العريض`);
};

window.makeTextItalic = function () {
    let textNode = getSelectedTextNode();
    if (!textNode) {
        showNotification('❌ يرجى تحديد عنصر نص أولاً', 'error');
        return;
    }

    const currentStyle = textNode.fontStyle() || 'normal';
    const newStyle = currentStyle.includes('italic') ? 'normal' : 'italic';

    textNode.fontStyle(newStyle);
    designLayer.draw();
    selectedNode = textNode;

    showNotification(`✅ تم ${newStyle === 'italic' ? 'تفعيل' : 'إلغاء'} النص المائل`);
};

window.toggleTextDirection = function () {
    let textNode = getSelectedTextNode();
    if (!textNode) {
        showNotification('❌ يرجى تحديد عنصر نص أولاً', 'error');
        return;
    }

    const currentDirection = textNode.getAttr('direction') || 'rtl';
    const newDirection = currentDirection === 'rtl' ? 'ltr' : 'rtl';

    setTextDirection(newDirection);
};

window.alignTextLeft = function () {
    setTextAlign('left');
};

window.alignTextCenter = function () {
    setTextAlign('center');
};

window.alignTextRight = function () {
    setTextAlign('right');
};

window.changeFontSize = function () {
    let textNode = getSelectedTextNode();
    if (!textNode) {
        showNotification('❌ يرجى تحديد عنصر نص أولاً', 'error');
        return;
    }

    const fontSizeInput = document.getElementById('fontSizeInput');
    if (!fontSizeInput) return;

    const newSize = parseInt(fontSizeInput.value) || 24;
    const clampedSize = Math.max(8, Math.min(120, newSize));

    textNode.fontSize(clampedSize);
    textNode.lineHeight(clampedSize * 1.2 / clampedSize);

    designLayer.draw();
    selectedNode = textNode;
    updateTextFormattingButtons();

    showNotification(`✅ تم تغيير حجم الخط إلى ${clampedSize}px`);
};