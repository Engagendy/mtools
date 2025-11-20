// Enhanced Discount Offer Tool - Professional Implementation using Konva.js
let discountStage = null;
let discountResizeHandler = null; // handler for responsive resizing
let discountBackgroundLayer = null;
let discountDesignLayer = null;
let discountTransformer = null;
let discountCanvasInitialized = false;
let selectedDiscountElement = null;

// Discount card formats - multiple templates
const discountFormats = {
    'story': {
        name: 'Instagram Story',
        width: 500,
        height: 900,
        display: '1080×1920 px (9:16)'
    },
    'post': {
        name: 'Instagram Post',
        width: 700,
        height: 700,
        display: '1080×1080 px (1:1)'
    },
    'a4': {
        name: 'A4 Flyer',
        width: 600,
        height: 850,
        display: 'A4 (210×297 mm)'
    },
    'wide': {
        name: 'Wide Banner',
        width: 900,
        height: 500,
        display: '1920×1080 px (16:9)'
    }
};

// Current selected format
let currentDiscountFormat = 'story';

// Smart scaling configuration
// Base reference is 'story' format (500x900)
function getSmartScaleFactors(format) {
    const baseWidth = 500;
    const baseHeight = 900;

    const widthScale = format.width / baseWidth;
    const heightScale = format.height / baseHeight;

    // Use the smaller scale factor to ensure elements fit
    const minScale = Math.min(widthScale, heightScale);

    // For font scaling, use a slightly larger factor to maintain readability
    const fontScale = minScale * 1.1;

    return {
        width: widthScale,
        height: heightScale,
        font: fontScale,
        spacing: minScale,
        element: minScale // For square elements like logos/QR
    };
}

// Discount card data structure
let discountData = {
    storeName: 'Alalamy Sharjah',
    tagline: 'العالمي ملك السعادة ❤️',
    location: 'فرع الشارقة',
    mainTitle: 'عروض خصم متنوعة على جميع الإكسسوارات! 🎉',
    description: '• لحامل هذه البطاقة فقط\n• لا يجمع مع عروض أخرى\n• متوفر في فرع الشارقة فقط',
    categories: [
        { name: 'كفرات موبايل', discount: 30 },
        { name: 'شواحن وكابلات', discount: 25 },
        { name: 'ماوس ولوحات مفاتيح', discount: 20 },
        { name: 'سماعات وأكسسوارات', discount: 15 }
    ],
    expiryDate: '2025-12-31',
    phoneNumber: '',
    tiktokHandle: 'alalamy.sharjah',
    design: {
        backgroundColor: '#4F46E5',
        badgeColor: '#FF0000',
        textColor: '#ffffff',
        logoImage: null,
        logoWidth: 60,
        logoHeight: 60,
        qrImages: [null, null, null, null],
        backgroundImage: null
    }
};

// Function to switch discount format
window.selectDiscountFormat = function (formatKey) {
    console.log('Switching to format:', formatKey);

    currentDiscountFormat = formatKey;

    // Update active button styling
    document.querySelectorAll('.discount-format-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.discount-format-btn').classList.add('active');

    // Destroy existing stage and remove resize listener
    if (discountStage) {
        discountStage.destroy();
        discountStage = null;
        discountCanvasInitialized = false;
        if (discountResizeHandler) {
            window.removeEventListener('resize', discountResizeHandler);
            discountResizeHandler = null;
        }
    }

    // Reinitialize with new format
    initializeDiscountTool();
};

// Bidi-js instance
let bidiInstance = null;
function getBidi() {
    if (!bidiInstance && typeof bidi !== 'undefined') {
        bidiInstance = bidi();
    }
    return bidiInstance;
}

function processArabicText(text) {
    if (!text) return text;
    // Check if text contains Arabic
    const hasArabic = /[\u0600-\u06FF]/.test(text);
    if (!hasArabic) return text;

    const bidiFactory = getBidi();
    if (bidiFactory) {
        // Process each line separately to maintain paragraph structure
        return text.split('\n').map(line => {
            return bidiFactory.getReorderedString(line, 'rtl');
        }).join('\n');
    }
    return text;
}

// Discount Tool Logic
function initializeDiscountTool() {
    if (discountCanvasInitialized) {
        console.log('Discount tool already initialized');
        return;
    }

    console.log('Initializing Discount Tool...');

    const container = document.getElementById('discount-canvas');
    if (!container) {
        console.error('Discount canvas container not found');
        return;
    }

    // Get current format
    const currentFormat = discountFormats[currentDiscountFormat];

    // Calculate display size for crystal clear rendering
    // Calculate display size for crystal clear rendering
    const parent = container.parentElement;
    const parentWidth = parent ? parent.clientWidth : (window.innerWidth < 768 ? window.innerWidth : window.innerWidth / 2);
    const availableWidth = parentWidth - 40; // Subtract padding (32px) + safety margin

    const aspectRatio = currentFormat.width / currentFormat.height;
    let displayWidth = Math.max(availableWidth, 300); // Ensure minimum width
    let displayHeight = displayWidth / aspectRatio;

    // Create Konva Stage with optimized pixel ratio
    discountStage = new Konva.Stage({
        container: 'discount-canvas',
        width: displayWidth,
        height: displayHeight,
        scaleX: displayWidth / currentFormat.width,
        scaleY: displayHeight / currentFormat.height,
        pixelRatio: window.devicePixelRatio || 1 // Use native pixel ratio for sharpest rendering
    });

    // Responsive resize handler
    discountResizeHandler = () => {
        const container = document.getElementById('discount-canvas');
        if (!container) return;

        const parent = container.parentElement;
        const parentWidth = parent ? parent.clientWidth : (window.innerWidth < 768 ? window.innerWidth : window.innerWidth / 2);
        const availableWidth = parentWidth - 40;

        const newDisplayWidth = Math.max(availableWidth, 300);
        const newDisplayHeight = newDisplayWidth / aspectRatio;

        // Update stage size and scaling
        discountStage.width(newDisplayWidth);
        discountStage.height(newDisplayHeight);
        discountStage.scale({
            x: newDisplayWidth / currentFormat.width,
            y: newDisplayHeight / currentFormat.height
        });
        // Re-render design to fit new size
        createDiscountDesign();
    };
    window.addEventListener('resize', discountResizeHandler);

    // Create layers
    discountBackgroundLayer = new Konva.Layer();
    discountDesignLayer = new Konva.Layer();

    // Create transformer
    discountTransformer = new Konva.Transformer({
        keepRatio: false,
        enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right', 'top-center', 'bottom-center'],
        rotateEnabled: true,
        borderStroke: '#4F46E5',
        borderStrokeWidth: 2,
        anchorFill: '#4F46E5',
        anchorStroke: '#fff',
        anchorSize: 8,
        boundBoxFunc: (oldBox, newBox) => {
            newBox.width = Math.max(20, newBox.width);
            newBox.height = Math.max(20, newBox.height);
            return newBox;
        }
    });
    discountDesignLayer.add(discountTransformer);

    discountStage.add(discountBackgroundLayer);
    discountStage.add(discountDesignLayer);

    // Click handler for selection
    discountStage.on('click tap', (e) => {
        if (e.target === discountStage) {
            discountTransformer.nodes([]);
            selectedDiscountElement = null;
            hideDiscountTextPanel();
            discountDesignLayer.draw();
            return;
        }

        if (e.target.getLayer() === discountBackgroundLayer) {
            discountTransformer.nodes([]);
            selectedDiscountElement = null;
            hideDiscountTextPanel();
            discountDesignLayer.draw();
            return;
        }

        if (e.target.getLayer() === discountDesignLayer && e.target !== discountTransformer) {
            discountTransformer.nodes([e.target]);
            selectedDiscountElement = e.target;
            discountDesignLayer.draw();

            // Show text panel if text is selected
            if (e.target.getClassName() === 'Text') {
                showDiscountTextPanel(e.target);
            }

            // Switch to design tab
            if (typeof switchDiscountTab === 'function') {
                switchDiscountTab('design');
            }
        }
    });

    // Double-click handler for text editing
    discountStage.on('dblclick', (e) => {
        if (e.target.getClassName() === 'Text') {
            showDiscountTextEditor(e.target);
        }
    });

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
        if (!selectedDiscountElement || !discountCanvasInitialized) return;

        // Delete
        if (e.key === 'Delete' || e.key === 'Backspace') {
            discountTransformer.nodes([]);
            selectedDiscountElement.remove();
            selectedDiscountElement = null;
            hideDiscountTextPanel();
            discountDesignLayer.draw();
            e.preventDefault();
        }

        // Copy (Ctrl/Cmd + D)
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            if (selectedDiscountElement) {
                const clone = selectedDiscountElement.clone({
                    x: selectedDiscountElement.x() + 10,
                    y: selectedDiscountElement.y() + 10
                });
                discountDesignLayer.add(clone);
                discountTransformer.nodes([clone]);
                selectedDiscountElement = clone;
                discountDesignLayer.draw();
            }
        }

        // Arrow keys
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            if (!selectedDiscountElement.isDestroyed && selectedDiscountElement.getLayer()) {
                const moveDistance = e.shiftKey ? 10 : 1;
                switch (e.key) {
                    case 'ArrowLeft':
                        selectedDiscountElement.x(selectedDiscountElement.x() - moveDistance);
                        break;
                    case 'ArrowRight':
                        selectedDiscountElement.x(selectedDiscountElement.x() + moveDistance);
                        break;
                    case 'ArrowUp':
                        selectedDiscountElement.y(selectedDiscountElement.y() - moveDistance);
                        break;
                    case 'ArrowDown':
                        selectedDiscountElement.y(selectedDiscountElement.y() + moveDistance);
                        break;
                }
                discountDesignLayer.draw();
                e.preventDefault();
            }
        }
    });

    // Create initial design
    createDiscountDesign();

    // Setup form handlers
    setupDiscountFormHandlers();

    // Setup text formatting handlers
    setupDiscountTextFormattingHandlers();

    discountCanvasInitialized = true;
    console.log('Discount Tool initialized successfully');
}

// Text editor (inline editing)
let currentEditingDiscountText = null;

function showDiscountTextEditor(textNode) {
    currentEditingDiscountText = textNode;

    const textPosition = textNode.getAbsolutePosition();
    const stageBox = discountStage.container().getBoundingClientRect();
    const scale = discountStage.scaleX();

    hideDiscountTextEditor();

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    const textarea = document.createElement('textarea');
    textarea.id = 'discount-text-editor-input';
    textarea.value = textNode.text();
    textarea.style.position = 'absolute';
    textarea.style.top = (stageBox.top + scrollTop + textPosition.y * scale) + 'px';
    textarea.style.left = (stageBox.left + scrollLeft + textPosition.x * scale) + 'px';
    textarea.style.width = (textNode.width() * scale) + 'px';
    textarea.style.fontSize = (textNode.fontSize() * scale) + 'px';
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.fontWeight = textNode.fontStyle() === 'bold' ? 'bold' : 'normal';
    textarea.style.color = textNode.fill();
    textarea.style.textAlign = textNode.align();
    textarea.style.padding = '5px';
    textarea.style.border = '2px solid #4F46E5';
    textarea.style.borderRadius = '4px';
    textarea.style.backgroundColor = 'white';
    textarea.style.zIndex = '1000';
    textarea.style.resize = 'none';
    textarea.style.overflow = 'hidden';
    textarea.style.lineHeight = '1.2';

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    textarea.addEventListener('input', () => {
        if (textNode && !textNode.isDestroyed && textNode.getLayer()) {
            textNode.text(textarea.value);
            discountDesignLayer.draw();
        }
    });

    textarea.addEventListener('blur', () => {
        hideDiscountTextEditor();
    });

    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideDiscountTextEditor();
        }
    });
}

function hideDiscountTextEditor() {
    const editor = document.getElementById('discount-text-editor-input');
    if (editor) {
        editor.remove();
    }
    currentEditingDiscountText = null;
}

// Show/hide text formatting panel
function showDiscountTextPanel(textNode) {
    const panel = document.getElementById('discount-text-formatting-panel');
    if (!panel) return;

    panel.style.display = 'block';

    // Update control values
    const fontSizeSlider = document.getElementById('discount-text-font-size');
    const fontSizeValue = document.getElementById('discount-font-size-value');
    const fontFamilySelect = document.getElementById('discount-text-font-family');

    if (fontSizeSlider && fontSizeValue) {
        fontSizeSlider.value = textNode.fontSize();
        fontSizeValue.textContent = textNode.fontSize() + 'px';
    }

    if (fontFamilySelect) {
        fontFamilySelect.value = textNode.fontFamily() || 'Almarai';
    }
}

function hideDiscountTextPanel() {
    const panel = document.getElementById('discount-text-formatting-panel');
    if (panel) {
        panel.style.display = 'none';
    }
}

// Create discount design
function createDiscountDesign() {
    if (!discountDesignLayer) return;

    // Clear existing design (keep transformer)
    discountDesignLayer.getChildren((node) => node !== discountTransformer).forEach((node) => {
        node.remove();
    });

    if (discountTransformer) {
        discountTransformer.nodes([]);
    }
    selectedDiscountElement = null;

    const data = discountData;
    const format = discountFormats[currentDiscountFormat];
    // Initial scale based on format dimensions
    let scale = getSmartScaleFactors(format);

    // Background
    discountBackgroundLayer.destroyChildren();

    if (data.design.backgroundImage) {
        const bgImg = new Image();
        bgImg.onload = function () {
            const bgImage = new Konva.Image({
                x: 0,
                y: 0,
                image: bgImg,
                width: format.width,
                height: format.height
            });
            discountBackgroundLayer.add(bgImage);
            discountBackgroundLayer.draw();
        };
        bgImg.src = data.design.backgroundImage;
    }

    const background = new Konva.Rect({
        x: 0,
        y: 0,
        width: format.width,
        height: format.height,
        fill: data.design.backgroundImage ? 'rgba(79, 70, 229, 0.8)' : data.design.backgroundColor
    });
    discountBackgroundLayer.add(background);
    discountBackgroundLayer.draw();

    // --- ROBUST LAYOUT ENGINE ---

    // 1. Define margins and safe area
    const baseMargin = 30;
    const basePadding = 10;

    // Helper to measure text height accurately
    const measureText = (text, fontSize, fontFamily, fontStyle, maxWidth) => {
        const t = new Konva.Text({
            text: text,
            fontSize: fontSize,
            fontFamily: fontFamily,
            fontStyle: fontStyle,
            width: maxWidth,
            lineHeight: 1.3
        });
        return t.height();
    };

    // 2. MEASURE PHASE: Calculate total required height with initial scale
    let margin = Math.round(baseMargin * scale.spacing);
    let padding = Math.round(basePadding * scale.spacing);
    let safeWidth = format.width - (margin * 2);

    // Calculate heights of all dynamic text elements
    const storeNameHeight = measureText(data.storeName, Math.round(32 * scale.font), 'Almarai, Arial', 'bold', safeWidth);
    const taglineHeight = measureText(data.tagline, Math.round(15 * scale.font), 'Almarai', 'bold', safeWidth);
    const locationHeight = measureText(data.location, Math.round(13 * scale.font), 'Almarai', 'normal', safeWidth);
    const mainTitleHeight = measureText(data.mainTitle, Math.round(24 * scale.font), 'Almarai', 'bold', safeWidth);
    const descriptionHeight = measureText(data.description, Math.round(11 * scale.font), 'Almarai', 'normal', safeWidth - (padding * 2));

    // Fixed/Calculated Section Heights
    const logoHeight = data.design.logoImage ? Math.round(data.design.logoHeight * scale.element) + Math.round(20 * scale.spacing) : 0;
    const headerGap = Math.round(10 * scale.spacing);
    const sectionGap = Math.round(25 * scale.spacing); // Gap between major sections

    const headerTotalHeight = logoHeight + storeNameHeight + headerGap + taglineHeight + headerGap + locationHeight + headerGap + mainTitleHeight;

    const badgeHeight = Math.round(50 * scale.spacing);

    // Categories
    const categoryRowHeight = Math.round(70 * scale.spacing);
    const categoryGap = Math.round(12 * scale.spacing);
    const categoriesTotalHeight = (Math.ceil(data.categories.length / 2) * categoryRowHeight) +
        ((Math.ceil(data.categories.length / 2) - 1) * categoryGap);

    const termsTotalHeight = descriptionHeight + Math.round(45 * scale.spacing); // + title and padding
    const qrSectionHeight = Math.round(120 * scale.spacing);
    const footerHeight = Math.round(60 * scale.spacing);
    const socialHeight = Math.round(20 * scale.spacing);

    // Total Content Height Calculation
    const totalRequiredHeight = margin + // Top margin
        headerTotalHeight + sectionGap +
        badgeHeight + sectionGap +
        categoriesTotalHeight + sectionGap +
        termsTotalHeight + sectionGap +
        qrSectionHeight + sectionGap +
        socialHeight + sectionGap +
        footerHeight +
        margin; // Bottom margin

    // 3. FIT CALCULATION: Determine Fit Ratio
    const availableHeight = format.height;
    let fitRatio = 1.0;

    if (totalRequiredHeight > availableHeight) {
        fitRatio = availableHeight / totalRequiredHeight;
        // Cap the scaling to prevent text becoming microscopic
        fitRatio = Math.max(fitRatio, 0.65);
        console.log(`Content too tall (${totalRequiredHeight}px > ${availableHeight}px). Scaling down by ${fitRatio.toFixed(2)}`);
    }

    // 4. APPLY SCALING
    // Update scale factors with fitRatio
    scale.font *= fitRatio;
    scale.spacing *= fitRatio;
    scale.element *= fitRatio; // Scale logos and QRs too

    // Re-calculate dimensions with new scale
    margin = Math.round(baseMargin * scale.spacing);
    padding = Math.round(basePadding * scale.spacing);
    safeWidth = format.width - (margin * 2);

    // --- RENDER PHASE ---
    let currentY = margin;

    // Helper to add element and advance Y
    const addElement = (element, gapAfter = 0) => {
        discountDesignLayer.add(element);
        currentY += element.height() + Math.round(gapAfter * scale.spacing);
    };

    // 1. Header
    if (data.design.logoImage) {
        const logoImg = new Image();
        logoImg.onload = function () {
            const logoWidth = Math.round(data.design.logoWidth * scale.element);
            const logoHeight = Math.round(data.design.logoHeight * scale.element);
            const logo = new Konva.Image({
                x: (format.width - logoWidth) / 2,
                y: margin, // Logo always at top margin
                image: logoImg,
                width: logoWidth,
                height: logoHeight,
                draggable: true,
                name: 'logo'
            });
            discountDesignLayer.add(logo);
            discountDesignLayer.draw();
        };
        logoImg.src = data.design.logoImage;
        currentY += Math.round(data.design.logoHeight * scale.element) + Math.round(20 * scale.spacing);
    }

    const storeName = new Konva.Text({
        x: margin,
        y: currentY,
        text: data.storeName,
        fontSize: Math.round(32 * scale.font),
        fontFamily: 'Almarai, Arial',
        fontStyle: 'bold',
        fill: '#ffffff',
        align: 'center',
        width: safeWidth,
        draggable: true,
        name: 'storeName'
    });
    addElement(storeName, 10);

    const tagline = new Konva.Text({
        x: margin,
        y: currentY,
        text: data.tagline,
        fontSize: Math.round(15 * scale.font),
        fontFamily: 'Almarai',
        fontStyle: 'bold',
        fill: '#FFD700',
        align: 'center',
        width: safeWidth,
        draggable: true,
        name: 'tagline'
    });
    addElement(tagline, 10);

    const location = new Konva.Text({
        x: margin,
        y: currentY,
        text: data.location,
        fontSize: Math.round(13 * scale.font),
        fontFamily: 'Almarai',
        fill: '#ffffff',
        align: 'center',
        width: safeWidth,
        draggable: true,
        name: 'location'
    });
    addElement(location, 15);

    const mainTitle = new Konva.Text({
        x: margin,
        y: currentY,
        text: data.mainTitle,
        fontSize: Math.round(24 * scale.font),
        fontFamily: 'Almarai',
        fontStyle: 'bold',
        fill: '#ffffff',
        align: 'center',
        width: safeWidth,
        lineHeight: 1.3,
        draggable: true,
        name: 'mainTitle'
    });
    addElement(mainTitle, 25);

    // 2. Badge
    const discounts = data.categories.map(c => c.discount);
    const minDiscount = Math.min(...discounts);
    const maxDiscount = Math.max(...discounts);
    const badgeWidth = Math.round(200 * scale.width * fitRatio); // Apply fitRatio to width too for consistency
    const scaledBadgeHeight = Math.round(50 * scale.spacing);

    const badgeGroup = new Konva.Group({
        x: (format.width - badgeWidth) / 2,
        y: currentY,
        draggable: true,
        name: 'badgeGroup'
    });

    const badgeRect = new Konva.Rect({
        x: 0,
        y: 0,
        width: badgeWidth,
        height: scaledBadgeHeight,
        fill: data.design.badgeColor,
        cornerRadius: scaledBadgeHeight / 2,
        shadowColor: 'black',
        shadowBlur: Math.round(15 * scale.spacing),
        shadowOpacity: 0.4
    });
    badgeGroup.add(badgeRect);

    const badgeText = new Konva.Text({
        x: 0,
        y: scaledBadgeHeight / 2 - Math.round(10 * scale.font),
        text: processArabicText(`من ${minDiscount}% إلى ${maxDiscount}% خصم`),
        fontSize: Math.round(20 * scale.font),
        fontFamily: 'Almarai',
        fontStyle: 'bold',
        fill: '#ffffff',
        align: 'center',
        width: badgeWidth,
        name: 'badgeText'
    });
    badgeGroup.add(badgeText);
    discountDesignLayer.add(badgeGroup);

    currentY += scaledBadgeHeight + Math.round(25 * scale.spacing);

    // 3. Categories
    const scaledCategoryGap = Math.round(12 * scale.spacing);
    const scaledCategoryRowHeight = Math.round(70 * scale.spacing);

    // Determine columns based on format
    let categoryCols = 2;
    if (currentDiscountFormat === 'wide') {
        categoryCols = 4;
    }

    const categoryWidth = Math.round((safeWidth - (categoryCols - 1) * scaledCategoryGap) / categoryCols);

    data.categories.forEach((category, index) => {
        const col = index % categoryCols;
        const row = Math.floor(index / categoryCols);
        const xPos = margin + col * (categoryWidth + scaledCategoryGap);
        const yPosCategory = currentY + row * (scaledCategoryRowHeight + scaledCategoryGap);

        const catGroup = new Konva.Group({
            x: xPos,
            y: yPosCategory,
            draggable: true,
            name: `category_${index}`
        });

        const catBg = new Konva.Rect({
            x: 0,
            y: 0,
            width: categoryWidth,
            height: scaledCategoryRowHeight,
            fill: 'rgba(255, 255, 255, 0.9)',
            cornerRadius: Math.round(10 * scale.spacing)
        });
        catGroup.add(catBg);

        const catName = new Konva.Text({
            x: padding,
            y: Math.round(12 * scale.spacing),
            text: processArabicText(category.name),
            fontSize: Math.round(12 * scale.font),
            fontFamily: 'Almarai',
            fontStyle: 'bold',
            fill: '#333',
            align: 'right',
            width: categoryWidth - (padding * 2)
        });
        catGroup.add(catName);

        const catBadgeWidth = Math.round(70 * scale.width * fitRatio);
        const catBadgeHeight = Math.round(22 * scale.spacing);

        const discountBadgeGroup = new Konva.Group({
            x: (categoryWidth - catBadgeWidth) / 2,
            y: Math.round(40 * scale.spacing)
        });

        const discountBadgeBg = new Konva.Rect({
            x: 0,
            y: 0,
            width: catBadgeWidth,
            height: catBadgeHeight,
            fill: data.design.badgeColor,
            cornerRadius: catBadgeHeight / 2
        });
        discountBadgeGroup.add(discountBadgeBg);

        const discountText = new Konva.Text({
            x: 0,
            y: catBadgeHeight / 2 - Math.round(6 * scale.font),
            text: processArabicText(`${category.discount}% خصم`),
            fontSize: Math.round(11 * scale.font),
            fontFamily: 'Almarai',
            fontStyle: 'bold',
            fill: '#ffffff',
            align: 'center',
            width: catBadgeWidth
        });
        discountBadgeGroup.add(discountText);

        catGroup.add(discountBadgeGroup);
        discountDesignLayer.add(catGroup);
    });

    const categoriesHeight = (Math.ceil(data.categories.length / categoryCols) * (scaledCategoryRowHeight + scaledCategoryGap));
    currentY += categoriesHeight + Math.round(20 * scale.spacing);

    // 4. Terms
    // Recalculate description height with final scale
    const finalDescHeight = measureText(data.description, Math.round(11 * scale.font), 'Almarai', 'normal', safeWidth - (padding * 2));
    const termsBoxHeight = finalDescHeight + Math.round(45 * scale.spacing);

    const descBg = new Konva.Rect({
        x: margin,
        y: currentY,
        width: safeWidth,
        height: termsBoxHeight,
        fill: 'rgba(255, 255, 255, 0.95)',
        cornerRadius: Math.round(12 * scale.spacing),
        draggable: true,
        name: 'descriptionBg'
    });
    discountDesignLayer.add(descBg);

    const descTitle = new Konva.Text({
        x: margin + padding,
        y: currentY + Math.round(12 * scale.spacing),
        text: processArabicText('⚠️ الشروط والملاحظات:'),
        fontSize: Math.round(12 * scale.font),
        fontFamily: 'Almarai',
        fontStyle: 'bold',
        fill: '#333',
        align: 'right',
        width: safeWidth - (padding * 2),
        draggable: true,
        name: 'descriptionTitle'
    });
    discountDesignLayer.add(descTitle);

    const descContent = new Konva.Text({
        x: margin + padding,
        y: currentY + Math.round(35 * scale.spacing),
        text: processArabicText(data.description),
        fontSize: Math.round(11 * scale.font),
        fontFamily: 'Almarai',
        fill: '#333',
        align: 'right',
        width: safeWidth - (padding * 2),
        lineHeight: 1.6,
        draggable: true,
        name: 'descriptionContent'
    });
    discountDesignLayer.add(descContent);

    currentY += termsBoxHeight + Math.round(20 * scale.spacing);

    // 5. QR Section
    const smallGap = Math.round(8 * scale.spacing);
    let qrSize = Math.round((safeWidth - (smallGap * 5)) / 4);

    // Cap QR size to prevent them from being too huge on wide formats
    // 150 units scaled provides a good balance
    const maxQrSize = Math.round(150 * scale.spacing);
    if (qrSize > maxQrSize) {
        qrSize = maxQrSize;
    }

    // Dynamic height calculation: Top padding (30) + QR Size + Bottom padding (20)
    const qrSectionRealHeight = Math.round(30 * scale.spacing) + qrSize + Math.round(20 * scale.spacing);

    const qrSectionBg = new Konva.Rect({
        x: margin,
        y: currentY,
        width: safeWidth,
        height: qrSectionRealHeight,
        fill: 'white',
        cornerRadius: Math.round(12 * scale.spacing),
        draggable: true,
        name: 'qrSectionBg'
    });
    discountDesignLayer.add(qrSectionBg);

    const qrText = new Konva.Text({
        x: margin + padding,
        y: currentY + Math.round(10 * scale.spacing),
        text: 'تابعنا:',
        fontSize: Math.round(11 * scale.font),
        fontFamily: 'Almarai',
        fontStyle: 'bold',
        fill: '#333',
        align: 'center',
        width: safeWidth - (padding * 2),
        draggable: true,
        name: 'qrText'
    });
    discountDesignLayer.add(qrText);

    // Calculate centered starting position
    const totalQrWidth = (4 * qrSize) + (3 * smallGap);
    const startQrX = margin + (safeWidth - totalQrWidth) / 2;

    for (let i = 0; i < 4; i++) {
        const qrX = startQrX + i * (qrSize + smallGap);
        const qrY = currentY + Math.round(30 * scale.spacing);

        if (data.design.qrImages[i]) {
            const qrImg = new Image();
            qrImg.onload = function () {
                const qrImage = new Konva.Image({
                    x: qrX,
                    y: qrY,
                    image: qrImg,
                    width: qrSize,
                    height: qrSize,
                    cornerRadius: 6,
                    draggable: true,
                    name: `qr_${i}`
                });
                discountDesignLayer.add(qrImage);
                discountDesignLayer.draw();
            };
            qrImg.src = data.design.qrImages[i];
        } else {
            const qrPlaceholder = new Konva.Rect({
                x: qrX,
                y: qrY,
                width: qrSize,
                height: qrSize,
                stroke: '#4F46E5',
                strokeWidth: Math.max(1, Math.round(2 * scale.spacing)),
                cornerRadius: Math.round(6 * scale.spacing),
                fill: 'white',
                draggable: true,
                name: `qrPlaceholder_${i}`
            });
            discountDesignLayer.add(qrPlaceholder);

            const qrIcon = new Konva.Text({
                x: qrX,
                y: qrY + qrSize / 2 - Math.round(12 * scale.font),
                text: '📱',
                fontSize: Math.round(20 * scale.font),
                align: 'center',
                width: qrSize
            });
            discountDesignLayer.add(qrIcon);

            const qrLabel = new Konva.Text({
                x: qrX,
                y: qrY + qrSize / 2 + Math.round(8 * scale.font),
                text: `QR ${i + 1}`,
                fontSize: Math.round(8 * scale.font),
                fontFamily: 'Inter',
                fill: '#4F46E5',
                align: 'center',
                width: qrSize
            });
            discountDesignLayer.add(qrLabel);
        }
    }

    currentY += qrSectionRealHeight + Math.round(15 * scale.spacing);

    // 6. Footer & Social
    const socialText = new Konva.Text({
        x: margin + padding,
        y: currentY,
        text: `تابعنا على @${data.tiktokHandle}`,
        fontSize: Math.round(11 * scale.font),
        fontFamily: 'Almarai',
        fontStyle: 'bold',
        fill: '#FF0000',
        align: 'center',
        width: safeWidth - (padding * 2),
        draggable: true,
        name: 'socialText'
    });
    addElement(socialText, 15);

    const scaledFooterHeight = Math.round(60 * scale.spacing);
    // Ensure footer fits
    if (currentY + scaledFooterHeight > format.height - margin) {
        currentY = format.height - margin - scaledFooterHeight;
    }

    const footerBg = new Konva.Rect({
        x: margin,
        y: currentY,
        width: safeWidth,
        height: scaledFooterHeight,
        fill: 'rgba(255, 255, 255, 0.9)',
        cornerRadius: Math.round(12 * scale.spacing),
        draggable: true,
        name: 'footerBg'
    });
    discountDesignLayer.add(footerBg);

    const dateObj = new Date(data.expiryDate);
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const arabicDate = `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

    const expiryWidth = Math.round(180 * scale.width * fitRatio);
    const expiryHeight = Math.round(26 * scale.spacing);

    const expiryGroup = new Konva.Group({
        x: (format.width - expiryWidth) / 2,
        y: currentY + Math.round(10 * scale.spacing),
        draggable: true
    });

    const expiryBg = new Konva.Rect({
        x: 0,
        y: 0,
        width: expiryWidth,
        height: expiryHeight,
        fill: '#FF0000',
        cornerRadius: expiryHeight / 2
    });
    expiryGroup.add(expiryBg);

    const expiryText = new Konva.Text({
        x: 0,
        y: expiryHeight / 2 - Math.round(6 * scale.font),
        text: `ينتهي في: ${arabicDate}`,
        fontSize: Math.round(11 * scale.font),
        fontFamily: 'Almarai',
        fontStyle: 'bold',
        fill: '#ffffff',
        align: 'center',
        width: expiryWidth
    });
    expiryGroup.add(expiryText);
    discountDesignLayer.add(expiryGroup);

    const phoneText = new Konva.Text({
        x: margin,
        y: currentY + Math.round(40 * scale.spacing),
        text: `للتواصل: ${data.phoneNumber}`,
        fontSize: Math.round(12 * scale.font),
        fontFamily: 'Almarai',
        fontStyle: 'bold',
        fill: '#333',
        align: 'center',
        width: safeWidth,
        draggable: true,
        name: 'phoneText'
    });
    discountDesignLayer.add(phoneText);

    discountDesignLayer.draw();
}


// Setup form handlers
function setupDiscountFormHandlers() {
    // All text inputs
    const inputs = [
        'discount-store-name', 'discount-tagline', 'discount-location',
        'discount-main-title', 'discount-description',
        'discount-cat1-name', 'discount-cat1-percent',
        'discount-cat2-name', 'discount-cat2-percent',
        'discount-cat3-name', 'discount-cat3-percent',
        'discount-cat4-name', 'discount-cat4-percent',
        'discount-expiry-date', 'discount-phone', 'discount-tiktok'
    ];

    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('change', updateDiscountPreview);
            input.addEventListener('input', updateDiscountPreview);
        }
    });

    // Color inputs
    const bgColor = document.getElementById('discount-bg-color');
    if (bgColor) {
        bgColor.addEventListener('change', updateDiscountPreview);
        bgColor.addEventListener('input', updateDiscountPreview);
    }

    const badgeColor = document.getElementById('discount-badge-color');
    if (badgeColor) {
        badgeColor.addEventListener('change', updateDiscountPreview);
        badgeColor.addEventListener('input', updateDiscountPreview);
    }

    // Logo upload
    const logoUpload = document.getElementById('discount-logo-upload');
    if (logoUpload) {
        logoUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (event) {
                discountData.design.logoImage = event.target.result;
                createDiscountDesign();
                if (window.showNotification) {
                    window.showNotification('✅ Logo uploaded successfully', 'success');
                }
            };
            reader.readAsDataURL(file);
        });
    }

    // Logo size
    const logoWidth = document.getElementById('discount-logo-width');
    const logoWidthValue = document.getElementById('discount-logo-width-value');
    if (logoWidth) {
        logoWidth.addEventListener('input', (e) => {
            discountData.design.logoWidth = parseInt(e.target.value);
            if (logoWidthValue) logoWidthValue.textContent = e.target.value + 'px';
            if (discountData.design.logoImage) {
                createDiscountDesign();
            }
        });
    }

    const logoHeight = document.getElementById('discount-logo-height');
    const logoHeightValue = document.getElementById('discount-logo-height-value');
    if (logoHeight) {
        logoHeight.addEventListener('input', (e) => {
            discountData.design.logoHeight = parseInt(e.target.value);
            if (logoHeightValue) logoHeightValue.textContent = e.target.value + 'px';
            if (discountData.design.logoImage) {
                createDiscountDesign();
            }
        });
    }

    // QR uploads
    for (let i = 1; i <= 4; i++) {
        const qrUpload = document.getElementById(`discount-qr${i}-upload`);
        if (qrUpload) {
            qrUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = function (event) {
                    discountData.design.qrImages[i - 1] = event.target.result;
                    createDiscountDesign();
                    if (window.showNotification) {
                        window.showNotification(`✅ QR Code ${i} uploaded`, 'success');
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    }

    // Background image upload
    const bgImageUpload = document.getElementById('discount-bg-image-upload');
    if (bgImageUpload) {
        bgImageUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (event) {
                discountData.design.backgroundImage = event.target.result;
                createDiscountDesign();
                if (window.showNotification) {
                    window.showNotification('✅ Background image uploaded', 'success');
                }
            };
            reader.readAsDataURL(file);
        });
    }
}

// Setup text formatting handlers
function setupDiscountTextFormattingHandlers() {
    const fontSizeSlider = document.getElementById('discount-text-font-size');
    const fontSizeValue = document.getElementById('discount-font-size-value');
    const fontFamilySelect = document.getElementById('discount-text-font-family');
    const alignLeftBtn = document.getElementById('discount-text-align-left');
    const alignCenterBtn = document.getElementById('discount-text-align-center');
    const alignRightBtn = document.getElementById('discount-text-align-right');
    const copyBtn = document.getElementById('discount-element-copy');
    const deleteBtn = document.getElementById('discount-element-delete');

    // Font size
    if (fontSizeSlider && fontSizeValue) {
        fontSizeSlider.addEventListener('input', function () {
            fontSizeValue.textContent = this.value + 'px';
            if (selectedDiscountElement &&
                !selectedDiscountElement.isDestroyed &&
                selectedDiscountElement.getLayer() &&
                selectedDiscountElement.getClassName() === 'Text') {
                selectedDiscountElement.fontSize(parseInt(this.value));
                discountDesignLayer.draw();
            }
        });
    }

    // Font family
    if (fontFamilySelect) {
        fontFamilySelect.addEventListener('change', function () {
            if (selectedDiscountElement &&
                !selectedDiscountElement.isDestroyed &&
                selectedDiscountElement.getLayer() &&
                selectedDiscountElement.getClassName() === 'Text') {
                selectedDiscountElement.fontFamily(this.value);
                discountDesignLayer.draw();
            }
        });
    }

    // Alignment
    if (alignLeftBtn) {
        alignLeftBtn.addEventListener('click', () => {
            if (selectedDiscountElement &&
                !selectedDiscountElement.isDestroyed &&
                selectedDiscountElement.getLayer() &&
                selectedDiscountElement.getClassName() === 'Text') {
                selectedDiscountElement.align('left');
                discountDesignLayer.draw();
            }
        });
    }

    if (alignCenterBtn) {
        alignCenterBtn.addEventListener('click', () => {
            if (selectedDiscountElement &&
                !selectedDiscountElement.isDestroyed &&
                selectedDiscountElement.getLayer() &&
                selectedDiscountElement.getClassName() === 'Text') {
                selectedDiscountElement.align('center');
                discountDesignLayer.draw();
            }
        });
    }

    if (alignRightBtn) {
        alignRightBtn.addEventListener('click', () => {
            if (selectedDiscountElement &&
                !selectedDiscountElement.isDestroyed &&
                selectedDiscountElement.getLayer() &&
                selectedDiscountElement.getClassName() === 'Text') {
                selectedDiscountElement.align('right');
                discountDesignLayer.draw();
            }
        });
    }

    // Copy
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (selectedDiscountElement &&
                !selectedDiscountElement.isDestroyed &&
                selectedDiscountElement.getLayer()) {
                const clone = selectedDiscountElement.clone({
                    x: selectedDiscountElement.x() + 10,
                    y: selectedDiscountElement.y() + 10
                });
                discountDesignLayer.add(clone);
                discountTransformer.nodes([clone]);
                selectedDiscountElement = clone;
                discountDesignLayer.draw();
            }
        });
    }

    // Delete
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (selectedDiscountElement &&
                !selectedDiscountElement.isDestroyed &&
                selectedDiscountElement.getLayer()) {
                discountTransformer.nodes([]);
                selectedDiscountElement.remove();
                selectedDiscountElement = null;
                hideDiscountTextPanel();
                discountDesignLayer.draw();
            }
        });
    }
}

// Update preview from form
window.updateDiscountPreview = function () {
    if (!discountCanvasInitialized) return;

    // Update data from form
    discountData.storeName = document.getElementById('discount-store-name')?.value || discountData.storeName;
    discountData.tagline = document.getElementById('discount-tagline')?.value || discountData.tagline;
    discountData.location = document.getElementById('discount-location')?.value || discountData.location;
    discountData.mainTitle = document.getElementById('discount-main-title')?.value || discountData.mainTitle;
    discountData.description = document.getElementById('discount-description')?.value || discountData.description;

    // Categories
    for (let i = 0; i < 4; i++) {
        const name = document.getElementById(`discount-cat${i + 1}-name`)?.value;
        const percent = document.getElementById(`discount-cat${i + 1}-percent`)?.value;
        if (name !== undefined) discountData.categories[i].name = name;
        if (percent !== undefined) discountData.categories[i].discount = parseInt(percent);
    }

    discountData.expiryDate = document.getElementById('discount-expiry-date')?.value || discountData.expiryDate;
    discountData.phoneNumber = document.getElementById('discount-phone')?.value || '';
    discountData.tiktokHandle = document.getElementById('discount-tiktok')?.value || discountData.tiktokHandle;

    // Colors
    const bgColor = document.getElementById('discount-bg-color')?.value;
    if (bgColor) {
        discountData.design.backgroundColor = bgColor;
    }

    const badgeColor = document.getElementById('discount-badge-color')?.value;
    if (badgeColor) {
        discountData.design.badgeColor = badgeColor;
    }

    // Recreate design
    createDiscountDesign();

    if (window.showNotification) {
        window.showNotification('✅ Preview updated', 'success');
    }
};

// Tab switching
window.switchDiscountTab = function (tabName) {
    console.log('Switching to tab:', tabName);

    // Hide all tab contents
    document.querySelectorAll('.discount-tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Remove active from all tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
        btn.classList.remove('bg-white');
        btn.classList.remove('text-gray-900');
        btn.classList.remove('shadow-sm');
        btn.classList.add('text-gray-600');
    });

    // Show selected tab content
    const tabContent = document.getElementById(`discount-tab-${tabName}`);
    if (tabContent) {
        tabContent.classList.add('active');
        console.log('Tab content shown:', tabName);
    } else {
        console.error('Tab content not found:', `discount-tab-${tabName}`);
    }

    // Highlight active button
    event.target.classList.add('active');
    event.target.classList.add('bg-white');
    event.target.classList.add('text-gray-900');
    event.target.classList.add('shadow-sm');
    event.target.classList.remove('text-gray-600');
};

// Export
window.exportDiscountFlyer = function () {
    if (!discountStage) {
        if (window.showNotification) {
            window.showNotification('❌ No design to export', 'error');
        }
        return;
    }

    const dataURL = discountStage.toDataURL({
        mimeType: 'image/png',
        quality: 1.0,
        pixelRatio: 3
    });

    const link = document.createElement('a');
    const storeName = discountData.storeName || 'discount';
    link.download = `${storeName}-discount-flyer.png`;
    link.href = dataURL;
    link.click();

    if (window.showNotification) {
        window.showNotification('✅ Discount flyer exported successfully!', 'success');
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    console.log('Discount Tool: DOM loaded');

    // Apply i18n translations if available
    if (typeof window.i18n !== 'undefined' && window.i18n.updatePageTranslations) {
        setTimeout(() => {
            window.i18n.updatePageTranslations();
            console.log('Discount Tool: i18n applied');
        }, 100);
    }

    setTimeout(() => {
        const canvas = document.getElementById('discount-canvas');
        if (canvas && !discountCanvasInitialized) {
            console.log('Discount Tool: Initializing...');
            if (typeof Konva !== 'undefined') {
                initializeDiscountTool();
            }
        }
    }, 500);
});

window.initDiscountToolIfNeeded = function () {
    // Apply i18n translations
    if (typeof window.i18n !== 'undefined' && window.i18n.updatePageTranslations) {
        window.i18n.updatePageTranslations();
    }

    const canvas = document.getElementById('discount-canvas');
    if (canvas && !discountCanvasInitialized) {
        if (typeof Konva !== 'undefined') {
            initializeDiscountTool();
        }
    } else if (canvas && discountCanvasInitialized) {
        createDiscountDesign();
    }
};

console.log('Discount Tool NEW loaded successfully');
