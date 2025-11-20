// Enhanced Discount Offer Tool - Professional Discount/Promotion Design Tool using Konva.js
let discountStage = null;
let discountBackgroundLayer = null;
let discountDesignLayer = null;
let discountTransformer = null;
let discountSelectedElement = null;
let discountCanvasInitialized = false;
let currentDiscountFormat = { width: 500, height: 700 }; // Vertical card format

// Discount card data structure
let discountCardData = {
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
        textColor: '#ffffff',
        discountColor: '#FF0000',
        logoImage: null,
        qrImages: [null, null, null, null],
        backgroundImage: null,
        showLogo: false,
        logoWidth: 60,
        logoHeight: 60
    }
};

// Initialize Discount Tool
function initializeDiscountTool() {
    if (discountCanvasInitialized) {
        console.log('Discount tool already initialized');
        return;
    }

    console.log('Initializing Enhanced Discount Offer Tool...');

    const container = document.getElementById('discount-canvas');
    if (!container) {
        console.error('Discount canvas container not found');
        return;
    }

    // Calculate display size while maintaining aspect ratio
    const containerWidth = container.clientWidth || 500;
    const maxDisplayWidth = Math.min(containerWidth, 500);
    const aspectRatio = currentDiscountFormat.width / currentDiscountFormat.height;

    let displayWidth = maxDisplayWidth;
    let displayHeight = maxDisplayWidth / aspectRatio;

    // Create Konva Stage
    discountStage = new Konva.Stage({
        container: 'discount-canvas',
        width: displayWidth,
        height: displayHeight,
        scaleX: displayWidth / currentDiscountFormat.width,
        scaleY: displayHeight / currentDiscountFormat.height,
        pixelRatio: window.devicePixelRatio || 2
    });

    // Create layers
    discountBackgroundLayer = new Konva.Layer();
    discountDesignLayer = new Konva.Layer();

    // Create transformer for interactive elements
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

    // Add click handler for element selection
    discountStage.on('click tap', (e) => {
        if (e.target === discountStage) {
            discountTransformer.nodes([]);
            discountSelectedElement = null;
            discountDesignLayer.draw();
            return;
        }

        if (e.target.getLayer() === discountBackgroundLayer) {
            discountTransformer.nodes([]);
            discountSelectedElement = null;
            discountDesignLayer.draw();
            return;
        }

        if (e.target.getLayer() === discountDesignLayer && e.target !== discountTransformer) {
            discountTransformer.nodes([e.target]);
            discountSelectedElement = e.target;
            discountDesignLayer.draw();

            // Auto-switch to design tab if available
            if (typeof switchBusinessCardTab === 'function') {
                switchBusinessCardTab('design');
            }
        }
    });

    // Add double-click handler for text editing
    discountStage.on('dblclick', (e) => {
        if (e.target.getClassName() === 'Text') {
            showDiscountTextEditor(e.target);
        }
    });

    // Add background
    const background = new Konva.Rect({
        x: 0,
        y: 0,
        width: currentDiscountFormat.width,
        height: currentDiscountFormat.height,
        fill: discountCardData.design.backgroundColor
    });
    discountBackgroundLayer.add(background);

    // Create initial design
    createDiscountCardDesign();

    // Setup event handlers
    setupDiscountEventHandlers();

    discountCanvasInitialized = true;
    console.log('Enhanced Discount Offer Tool initialized successfully');
}

// Text Editor for inline editing
let currentEditingText = null;

function showDiscountTextEditor(textNode) {
    currentEditingText = textNode;

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
    currentEditingText = null;
}

// Create discount card design
function createDiscountCardDesign() {
    if (!discountDesignLayer) return;

    // Clear existing design (but keep the transformer)
    discountDesignLayer.getChildren((node) => node !== discountTransformer).forEach((node) => {
        node.remove();
    });

    if (discountTransformer) {
        discountTransformer.nodes([]);
    }
    discountSelectedElement = null;

    const data = discountCardData;
    const format = currentDiscountFormat;

    let yPos = 40;

    // Logo (if enabled and uploaded)
    if (data.design.showLogo && data.design.logoImage) {
        const logoImg = new Image();
        logoImg.onload = function() {
            const logoImage = new Konva.Image({
                x: (format.width - data.design.logoWidth) / 2,
                y: yPos,
                image: logoImg,
                width: data.design.logoWidth,
                height: data.design.logoHeight,
                draggable: true,
                name: 'logo'
            });
            discountDesignLayer.add(logoImage);
            discountDesignLayer.draw();
        };
        logoImg.src = data.design.logoImage;
        yPos += data.design.logoHeight + 15;
    }

    // Store Name
    const storeName = new Konva.Text({
        x: 30,
        y: yPos,
        text: data.storeName,
        fontSize: 32,
        fontFamily: 'Almarai, Arial, sans-serif',
        fontStyle: 'bold',
        fill: data.design.textColor,
        align: 'center',
        width: format.width - 60,
        draggable: true,
        name: 'storeName'
    });
    discountDesignLayer.add(storeName);
    yPos += 50;

    // Tagline
    const tagline = new Konva.Text({
        x: 30,
        y: yPos,
        text: data.tagline,
        fontSize: 15,
        fontFamily: 'Almarai',
        fontStyle: 'bold',
        fill: '#FFD700',
        align: 'center',
        width: format.width - 60,
        draggable: true,
        name: 'tagline'
    });
    discountDesignLayer.add(tagline);
    yPos += 30;

    // Location
    const location = new Konva.Text({
        x: 30,
        y: yPos,
        text: data.location,
        fontSize: 13,
        fontFamily: 'Almarai',
        fill: data.design.textColor,
        align: 'center',
        width: format.width - 60,
        opacity: 0.95,
        draggable: true,
        name: 'location'
    });
    discountDesignLayer.add(location);
    yPos += 35;

    // Main Title
    const mainTitle = new Konva.Text({
        x: 30,
        y: yPos,
        text: data.mainTitle,
        fontSize: 28,
        fontFamily: 'Almarai',
        fontStyle: 'bold',
        fill: data.design.textColor,
        align: 'center',
        width: format.width - 60,
        lineHeight: 1.3,
        draggable: true,
        name: 'mainTitle'
    });
    discountDesignLayer.add(mainTitle);
    yPos += 90;

    // Discount Badge
    const discounts = data.categories.map(c => c.discount);
    const minDiscount = Math.min(...discounts);
    const maxDiscount = Math.max(...discounts);

    const badgeGroup = new Konva.Group({
        x: (format.width - 200) / 2,
        y: yPos,
        draggable: true,
        name: 'badgeGroup'
    });

    const badgeRect = new Konva.Rect({
        x: 0,
        y: 0,
        width: 200,
        height: 50,
        fill: data.design.discountColor,
        cornerRadius: 25,
        shadowColor: 'black',
        shadowBlur: 15,
        shadowOpacity: 0.4
    });
    badgeGroup.add(badgeRect);

    const badgeText = new Konva.Text({
        x: 0,
        y: 12,
        text: `من ${minDiscount}% إلى ${maxDiscount}% خصم`,
        fontSize: 24,
        fontFamily: 'Almarai',
        fontStyle: 'bold',
        fill: '#ffffff',
        align: 'center',
        width: 200,
        name: 'badgeText'
    });
    badgeGroup.add(badgeText);

    discountDesignLayer.add(badgeGroup);
    yPos += 70;

    // Categories Grid
    const categoryStartY = yPos;
    const categoryWidth = (format.width - 90) / 2;
    const categoryHeight = 80;
    const gap = 12;

    data.categories.forEach((category, index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        const xPos = 30 + col * (categoryWidth + gap);
        const yPosCategory = categoryStartY + row * (categoryHeight + gap);

        const categoryGroup = new Konva.Group({
            x: xPos,
            y: yPosCategory,
            draggable: true,
            name: `category_${index}`
        });

        const categoryBg = new Konva.Rect({
            x: 0,
            y: 0,
            width: categoryWidth,
            height: categoryHeight,
            fill: 'rgba(255, 255, 255, 0.9)',
            cornerRadius: 10,
            name: 'categoryBg'
        });
        categoryGroup.add(categoryBg);

        const categoryName = new Konva.Text({
            x: 12,
            y: 15,
            text: category.name,
            fontSize: 12,
            fontFamily: 'Almarai',
            fontStyle: 'bold',
            fill: '#333',
            align: 'right',
            width: categoryWidth - 24,
            name: 'categoryName'
        });
        categoryGroup.add(categoryName);

        const discountBadge = new Konva.Group({
            x: (categoryWidth - 80) / 2,
            y: 45
        });

        const discountBadgeBg = new Konva.Rect({
            x: 0,
            y: 0,
            width: 80,
            height: 24,
            fill: data.design.discountColor,
            cornerRadius: 12
        });
        discountBadge.add(discountBadgeBg);

        const discountText = new Konva.Text({
            x: 0,
            y: 4,
            text: `${category.discount}% خصم`,
            fontSize: 11,
            fontFamily: 'Almarai',
            fontStyle: 'bold',
            fill: '#ffffff',
            align: 'center',
            width: 80
        });
        discountBadge.add(discountText);

        categoryGroup.add(discountBadge);
        discountDesignLayer.add(categoryGroup);
    });

    yPos = categoryStartY + (Math.ceil(data.categories.length / 2)) * (categoryHeight + gap) + 20;

    // Description
    const descriptionBg = new Konva.Rect({
        x: 30,
        y: yPos,
        width: format.width - 60,
        height: 100,
        fill: 'rgba(255, 255, 255, 0.95)',
        cornerRadius: 12,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOpacity: 0.1,
        name: 'descriptionBg',
        draggable: true
    });
    discountDesignLayer.add(descriptionBg);

    const descriptionTitle = new Konva.Text({
        x: 45,
        y: yPos + 15,
        text: '⚠️ الشروط والملاحظات:',
        fontSize: 13,
        fontFamily: 'Almarai',
        fontStyle: 'bold',
        fill: '#333',
        align: 'right',
        width: format.width - 90,
        draggable: true,
        name: 'descriptionTitle'
    });
    discountDesignLayer.add(descriptionTitle);

    const descriptionContent = new Konva.Text({
        x: 45,
        y: yPos + 40,
        text: data.description,
        fontSize: 13,
        fontFamily: 'Almarai',
        fill: '#333',
        align: 'right',
        width: format.width - 90,
        lineHeight: 1.8,
        draggable: true,
        name: 'descriptionContent'
    });
    discountDesignLayer.add(descriptionContent);

    yPos += 120;

    // QR Section
    const qrSectionBg = new Konva.Rect({
        x: 30,
        y: yPos,
        width: format.width - 60,
        height: 150,
        fill: 'white',
        cornerRadius: 12,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOpacity: 0.1,
        draggable: true,
        name: 'qrSectionBg'
    });
    discountDesignLayer.add(qrSectionBg);

    const qrText = new Konva.Text({
        x: 45,
        y: yPos + 15,
        text: 'تابعنا:',
        fontSize: 12,
        fontFamily: 'Almarai',
        fontStyle: 'bold',
        fill: '#333',
        align: 'right',
        width: format.width - 90,
        draggable: true,
        name: 'qrText'
    });
    discountDesignLayer.add(qrText);

    // QR Codes (4 slots)
    const qrSize = (format.width - 120) / 4;
    for (let i = 0; i < 4; i++) {
        const qrX = 45 + i * (qrSize + 10);
        const qrY = yPos + 40;

        if (data.design.qrImages[i]) {
            const qrImg = new Image();
            qrImg.onload = function() {
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
                fill: 'white',
                stroke: '#4F46E5',
                strokeWidth: 2,
                cornerRadius: 8,
                draggable: true,
                name: `qrPlaceholder_${i}`
            });
            discountDesignLayer.add(qrPlaceholder);

            const qrIcon = new Konva.Text({
                x: qrX,
                y: qrY + qrSize / 2 - 15,
                text: '📱',
                fontSize: 24,
                align: 'center',
                width: qrSize
            });
            discountDesignLayer.add(qrIcon);

            const qrLabel = new Konva.Text({
                x: qrX,
                y: qrY + qrSize / 2 + 10,
                text: `QR ${i + 1}`,
                fontSize: 9,
                fontFamily: 'Inter',
                fill: '#4F46E5',
                align: 'center',
                width: qrSize
            });
            discountDesignLayer.add(qrLabel);
        }
    }

    const socialText = new Konva.Text({
        x: 45,
        y: yPos + 120,
        text: `تابعنا على\n@${data.tiktokHandle}`,
        fontSize: 12,
        fontFamily: 'Almarai',
        fontStyle: 'bold',
        fill: '#333',
        align: 'center',
        width: format.width - 90,
        lineHeight: 1.5,
        draggable: true,
        name: 'socialText'
    });
    discountDesignLayer.add(socialText);

    yPos += 170;

    // Footer
    const footerBg = new Konva.Rect({
        x: 30,
        y: yPos,
        width: format.width - 60,
        height: 80,
        fill: 'rgba(255, 255, 255, 0.9)',
        cornerRadius: 12,
        draggable: true,
        name: 'footerBg'
    });
    discountDesignLayer.add(footerBg);

    // Expiry Date
    const dateObj = new Date(data.expiryDate);
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
                   'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    const arabicDate = `${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

    const expiryBadge = new Konva.Group({
        x: (format.width - 200) / 2,
        y: yPos + 12,
        draggable: true
    });

    const expiryBg = new Konva.Rect({
        x: 0,
        y: 0,
        width: 200,
        height: 30,
        fill: data.design.discountColor,
        cornerRadius: 15
    });
    expiryBadge.add(expiryBg);

    const expiryText = new Konva.Text({
        x: 0,
        y: 7,
        text: `صالح حتى ${arabicDate}`,
        fontSize: 12,
        fontFamily: 'Almarai',
        fontStyle: 'bold',
        fill: '#ffffff',
        align: 'center',
        width: 200
    });
    expiryBadge.add(expiryText);

    discountDesignLayer.add(expiryBadge);

    // Contact Info
    let contactText = '';
    if (data.phoneNumber) {
        contactText += `📞 ${data.phoneNumber}    `;
    }
    contactText += `📍 ${data.location}`;

    const contact = new Konva.Text({
        x: 45,
        y: yPos + 50,
        text: contactText,
        fontSize: 11,
        fontFamily: 'Almarai',
        fontStyle: 'bold',
        fill: '#333',
        align: 'center',
        width: format.width - 90,
        draggable: true,
        name: 'contact'
    });
    discountDesignLayer.add(contact);

    discountDesignLayer.draw();
}

// Setup event handlers
function setupDiscountEventHandlers() {
    // Form input handlers will be added here
    console.log('Discount event handlers setup complete');
}

// Update discount from form inputs
window.updateDiscountFromForm = function() {
    if (!discountCanvasInitialized) return;

    // Update data from form
    discountCardData.storeName = document.getElementById('discount-store-name')?.value || discountCardData.storeName;
    discountCardData.tagline = document.getElementById('discount-tagline')?.value || discountCardData.tagline;
    discountCardData.location = document.getElementById('discount-location')?.value || discountCardData.location;
    discountCardData.mainTitle = document.getElementById('discount-main-title')?.value || discountCardData.mainTitle;
    discountCardData.description = document.getElementById('discount-description')?.value || discountCardData.description;

    // Update categories
    for (let i = 0; i < 4; i++) {
        const catName = document.getElementById(`discount-category${i + 1}`)?.value;
        const catPercent = document.getElementById(`discount-percent${i + 1}`)?.value;
        if (catName !== undefined) discountCardData.categories[i].name = catName;
        if (catPercent !== undefined) discountCardData.categories[i].discount = parseInt(catPercent);
    }

    discountCardData.expiryDate = document.getElementById('discount-expiry-date')?.value || discountCardData.expiryDate;
    discountCardData.phoneNumber = document.getElementById('discount-phone-number')?.value || '';
    discountCardData.tiktokHandle = document.getElementById('discount-tiktok-handle')?.value || discountCardData.tiktokHandle;

    // Update colors
    const bgColor = document.getElementById('discount-bg-color')?.value;
    if (bgColor) {
        discountCardData.design.backgroundColor = bgColor;
        const background = discountBackgroundLayer.findOne('Rect');
        if (background) {
            background.fill(bgColor);
            discountBackgroundLayer.draw();
        }
    }

    const discountColor = document.getElementById('discount-discount-color')?.value;
    if (discountColor) {
        discountCardData.design.discountColor = discountColor;
    }

    // Recreate design
    createDiscountCardDesign();

    if (window.showNotification) {
        window.showNotification('✅ تم تحديث المعاينة', 'success');
    }
};

// Handle logo upload
window.handleDiscountLogoUpload = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        discountCardData.design.logoImage = e.target.result;
        discountCardData.design.showLogo = true;
        document.getElementById('discount-show-logo').checked = true;
        createDiscountCardDesign();
        if (window.showNotification) {
            window.showNotification('✅ تم رفع الشعار بنجاح', 'success');
        }
    };
    reader.readAsDataURL(file);
};

// Handle QR upload
window.handleDiscountQRUpload = function(index, event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        discountCardData.design.qrImages[index - 1] = e.target.result;
        createDiscountCardDesign();
        if (window.showNotification) {
            window.showNotification(`✅ تم رفع QR Code ${index}`, 'success');
        }
    };
    reader.readAsDataURL(file);
};

// Handle background upload
window.handleDiscountBackgroundUpload = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        discountCardData.design.backgroundImage = e.target.result;

        const imageObj = new Image();
        imageObj.onload = function() {
            discountBackgroundLayer.destroyChildren();

            const bgImage = new Konva.Image({
                x: 0,
                y: 0,
                image: imageObj,
                width: currentDiscountFormat.width,
                height: currentDiscountFormat.height
            });
            discountBackgroundLayer.add(bgImage);
            discountBackgroundLayer.draw();

            if (window.showNotification) {
                window.showNotification('✅ تم رفع صورة الخلفية', 'success');
            }
        };
        imageObj.src = e.target.result;
    };
    reader.readAsDataURL(file);
};

// Export discount offer
window.exportDiscountOffer = function() {
    if (!discountStage) {
        if (window.showNotification) {
            window.showNotification('❌ لا يوجد تصميم للتصدير', 'error');
        }
        return;
    }

    const dataURL = discountStage.toDataURL({
        mimeType: 'image/png',
        quality: 1.0,
        pixelRatio: 3
    });

    const link = document.createElement('a');
    const storeName = discountCardData.storeName || 'discount';
    link.download = `${storeName}-discount-flyer.png`;
    link.href = dataURL;
    link.click();

    if (window.showNotification) {
        window.showNotification('✅ تم تصدير الصورة بنجاح!', 'success');
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Discount Tool: DOM loaded, checking for discount tool...');

    setTimeout(() => {
        const discountCanvas = document.getElementById('discount-canvas');
        if (discountCanvas && !discountCanvasInitialized) {
            console.log('Discount Tool: Canvas found, initializing...');
            if (typeof Konva !== 'undefined') {
                initializeDiscountTool();
            } else {
                console.log('Discount Tool: Konva not available');
            }
        }
    }, 500);
});

// Initialize when tool is switched
window.addEventListener('toolChanged', function(e) {
    if (e.detail && e.detail.tool === 'discount-offer') {
        setTimeout(() => {
            if (!discountCanvasInitialized) {
                console.log('Discount Tool: Initializing after tool switch...');
                initializeDiscountTool();
            }
        }, 500);
    }
});

// Alternative initialization
window.initDiscountToolIfNeeded = function() {
    console.log('Discount Tool: Manual initialization called...');
    const discountCanvas = document.getElementById('discount-canvas');

    if (discountCanvas && !discountCanvasInitialized) {
        console.log('Discount Tool: Canvas found, initializing...');
        if (typeof Konva !== 'undefined') {
            initializeDiscountTool();
        } else {
            console.log('Discount Tool: Konva not available');
        }
    } else if (discountCanvas && discountCanvasInitialized) {
        console.log('Discount Tool: Already initialized, refreshing...');
        createDiscountCardDesign();
    }
};

console.log('Enhanced Discount Offer Tool loaded successfully');
