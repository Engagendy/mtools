/**
 * Business Card Design Tool - Professional Konva.js Implementation
 * Advanced business card designer with individual element control
 */

// Business card format configurations
const businessCardFormats = {
    standard: {
        name: 'Business Card Standard',
        width: 1050,
        height: 600,
        display: '89×51 mm (1050×600 px)'
    },
    us: {
        name: 'US Business Card',
        width: 1020,
        height: 612,
        display: '3.5×2 inch (1020×612 px)'
    },
    european: {
        name: 'European Business Card',
        width: 1063,
        height: 638,
        display: '90×54 mm (1063×638 px)'
    },
    square: {
        name: 'Square Business Card',
        width: 800,
        height: 800,
        display: '70×70 mm (800×800 px)'
    }
};

// Global variables for business card designer
let bcCurrentFormat = 'standard';
let bcStage, bcBackgroundLayer, bcDesignLayer, bcTransformer;
let bcSelectedNode = null;
let bcIsInitialized = false;
let bcIsInitializing = false;

// Background management
let bcCurrentBackgroundType = 'gradient';
let bcBackgroundImage = null;
let bcBackgroundImageNode = null;

// Design elements storage
let bcDesignElements = {
    companyName: null,
    personName: null,
    jobTitle: null,
    email: null,
    phone: null,
    website: null,
    address: null,
    logo: null
};

/**
 * Initialize Business Card Canvas
 */
function initializeBusinessCardCanvas() {
    if (bcIsInitialized) {
        console.log('✅ Business card canvas already initialized');
        return;
    }
    
    if (bcIsInitializing) {
        console.log('⏳ Business card initialization in progress');
        return;
    }
    
    bcIsInitializing = true;
    console.log('🎨 Starting business card canvas initialization');
    
    // Check if Konva is loaded
    if (typeof Konva === 'undefined') {
        console.warn('❌ Konva not loaded yet, waiting...');
        bcIsInitializing = false;
        setTimeout(initializeBusinessCardCanvas, 100);
        return;
    }
    
    const format = businessCardFormats[bcCurrentFormat];
    const container = document.getElementById('bcKonvaContainer');
    
    if (!container) {
        console.warn('❌ Business card container not found');
        bcIsInitializing = false;
        setTimeout(initializeBusinessCardCanvas, 100);
        return;
    }
    
    // Clear existing canvas
    if (bcStage) {
        bcStage.destroy();
    }

    // Calculate display size
    const maxDisplayWidth = 500;
    const maxDisplayHeight = 350;
    const scale = Math.min(maxDisplayWidth / format.width, maxDisplayHeight / format.height);
    
    const displayWidth = format.width * scale;
    const displayHeight = format.height * scale;

    // Create Konva stage
    bcStage = new Konva.Stage({
        container: 'bcKonvaContainer',
        width: displayWidth,
        height: displayHeight,
        scaleX: scale,
        scaleY: scale
    });

    const pixelRatio = window.devicePixelRatio || 2;

    // Create layers
    bcBackgroundLayer = new Konva.Layer({
        imageSmoothingEnabled: true,
        listening: false
    });
    bcDesignLayer = new Konva.Layer({
        imageSmoothingEnabled: true,
        clearBeforeDraw: true,
        listening: true
    });

    bcStage.add(bcBackgroundLayer);
    bcStage.add(bcDesignLayer);
    
    bcBackgroundLayer.canvas.setPixelRatio(pixelRatio);
    bcDesignLayer.canvas.setPixelRatio(pixelRatio);

    // Create transformer
    bcTransformer = new Konva.Transformer({
        rotateEnabled: true,
        borderStroke: '#28a745',
        borderStrokeWidth: 2,
        anchorStroke: '#28a745',
        anchorStrokeWidth: 2,
        anchorFill: '#ffffff',
        anchorSize: 8
    });
    bcDesignLayer.add(bcTransformer);

    // Selection handling
    bcStage.on('click tap', function (e) {
        if (e.target === bcStage) {
            bcTransformer.nodes([]);
            bcSelectedNode = null;
            updateBusinessCardSelectionInfo();
            return;
        }

        if (e.target.hasName('bc-design-element')) {
            bcTransformer.nodes([e.target]);
            bcSelectedNode = e.target;
            updateBusinessCardSelectionInfo();
        } else {
            bcTransformer.nodes([]);
            bcSelectedNode = null;
            updateBusinessCardSelectionInfo();
        }
    });

    // Double-click editing
    bcStage.on('dblclick dbltap', function (e) {
        if (e.target.hasName('bc-design-element') && e.target.className === 'Text') {
            editBusinessCardTextElement(e.target);
        }
    });

    console.log('✅ Business card canvas initialized successfully');
    
    createBusinessCardBackground();
    createBusinessCardElements();
    
    bcIsInitialized = true;
    bcIsInitializing = false;
}

/**
 * Create Business Card Background
 */
function createBusinessCardBackground() {
    if (!bcBackgroundLayer) return;
    
    const format = businessCardFormats[bcCurrentFormat];
    bcBackgroundLayer.destroyChildren();

    if (bcCurrentBackgroundType === 'image' && bcBackgroundImage) {
        const bgImageX = parseFloat(document.getElementById('bcBgImageX')?.value || 0);
        const bgImageY = parseFloat(document.getElementById('bcBgImageY')?.value || 0);
        const bgImageScale = parseFloat(document.getElementById('bcBgImageScale')?.value || 100) / 100;

        bcBackgroundImageNode = new Konva.Image({
            x: (format.width * bgImageX) / 100,
            y: (format.height * bgImageY) / 100,
            image: bcBackgroundImage,
            width: format.width * bgImageScale,
            height: format.height * bgImageScale,
            listening: false
        });

        bcBackgroundLayer.add(bcBackgroundImageNode);
    } else {
        const bgColor1 = document.getElementById('bcBgColor1')?.value || '#f8f9fa';
        const bgColor2 = document.getElementById('bcBgColor2')?.value || '#e9ecef';

        const background = new Konva.Rect({
            x: 0,
            y: 0,
            width: format.width,
            height: format.height,
            fillLinearGradientStartPoint: { x: 0, y: 0 },
            fillLinearGradientEndPoint: { x: format.width, y: format.height },
            fillLinearGradientColorStops: [0, bgColor1, 1, bgColor2]
        });

        bcBackgroundLayer.add(background);
    }

    bcBackgroundLayer.draw();
}

/**
 * Create Business Card Elements
 */
function createBusinessCardElements() {
    const format = businessCardFormats[bcCurrentFormat];
    const textColor = document.getElementById('bcTextColor')?.value || '#333333';
    const accentColor = document.getElementById('bcAccentColor')?.value || '#007bff';

    // Clear design layer (except transformer)
    const childrenToRemove = bcDesignLayer.children.filter(child => child !== bcTransformer);
    childrenToRemove.forEach(child => child.destroy());
    
    // Reset design elements
    bcDesignElements = {
        companyName: null, personName: null, jobTitle: null,
        email: null, phone: null, website: null, address: null, logo: null
    };

    // Font sizing
    const baseScale = Math.min(format.width / 1050, format.height / 600);
    const fontSizes = {
        company: Math.round(36 * baseScale),
        name: Math.round(28 * baseScale),
        title: Math.round(20 * baseScale),
        contact: Math.round(16 * baseScale)
    };

    // Layout positioning
    const layout = {
        leftMargin: format.width * 0.08,
        rightMargin: format.width * 0.92,
        topMargin: format.height * 0.1,
        bottomMargin: format.height * 0.9,
        centerX: format.width * 0.5,
        centerY: format.height * 0.5
    };

    // Get form values
    const companyName = document.getElementById('bcCompanyName')?.value || 'شركة الأعمال المتطورة';
    const personName = document.getElementById('bcPersonName')?.value || 'أحمد محمد العلي';
    const jobTitle = document.getElementById('bcJobTitle')?.value || 'مدير التطوير';
    const email = document.getElementById('bcEmail')?.value || 'ahmed@company.com';
    const phone = document.getElementById('bcPhone')?.value || '+971 50 123 4567';
    const website = document.getElementById('bcWebsite')?.value || 'www.company.com';
    const address = document.getElementById('bcAddress')?.value || 'دبي، الإمارات العربية المتحدة';

    // Company name (top center, prominent)
    bcDesignElements.companyName = new Konva.Text({
        x: layout.centerX,
        y: layout.topMargin,
        text: companyName,
        fontSize: fontSizes.company,
        fontFamily: 'Almarai',
        fontStyle: 'bold',
        fill: accentColor,
        align: 'center',
        verticalAlign: 'top',
        draggable: true,
        name: 'bc-design-element company-name'
    });
    bcDesignElements.companyName.offsetX(bcDesignElements.companyName.width() / 2);

    // Person name (below company)
    bcDesignElements.personName = new Konva.Text({
        x: layout.centerX,
        y: layout.topMargin + fontSizes.company + 20,
        text: personName,
        fontSize: fontSizes.name,
        fontFamily: 'Almarai',
        fontStyle: 'bold',
        fill: textColor,
        align: 'center',
        verticalAlign: 'top',
        draggable: true,
        name: 'bc-design-element person-name'
    });
    bcDesignElements.personName.offsetX(bcDesignElements.personName.width() / 2);

    // Job title (below name)
    bcDesignElements.jobTitle = new Konva.Text({
        x: layout.centerX,
        y: layout.topMargin + fontSizes.company + fontSizes.name + 40,
        text: jobTitle,
        fontSize: fontSizes.title,
        fontFamily: 'Almarai',
        fill: accentColor,
        align: 'center',
        verticalAlign: 'top',
        draggable: true,
        name: 'bc-design-element job-title'
    });
    bcDesignElements.jobTitle.offsetX(bcDesignElements.jobTitle.width() / 2);

    // Contact information (bottom section)
    const contactY = format.height * 0.65;
    const contactSpacing = fontSizes.contact + 8;

    // Email
    bcDesignElements.email = new Konva.Text({
        x: layout.leftMargin,
        y: contactY,
        text: `📧 ${email}`,
        fontSize: fontSizes.contact,
        fontFamily: 'Almarai',
        fill: textColor,
        draggable: true,
        name: 'bc-design-element email'
    });

    // Phone
    bcDesignElements.phone = new Konva.Text({
        x: layout.leftMargin,
        y: contactY + contactSpacing,
        text: `📱 ${phone}`,
        fontSize: fontSizes.contact,
        fontFamily: 'Almarai',
        fill: textColor,
        draggable: true,
        name: 'bc-design-element phone'
    });

    // Website
    bcDesignElements.website = new Konva.Text({
        x: layout.leftMargin,
        y: contactY + contactSpacing * 2,
        text: `🌐 ${website}`,
        fontSize: fontSizes.contact,
        fontFamily: 'Almarai',
        fill: textColor,
        draggable: true,
        name: 'bc-design-element website'
    });

    // Address
    bcDesignElements.address = new Konva.Text({
        x: layout.leftMargin,
        y: contactY + contactSpacing * 3,
        text: `📍 ${address}`,
        fontSize: fontSizes.contact,
        fontFamily: 'Almarai',
        fill: textColor,
        width: format.width * 0.85,
        draggable: true,
        name: 'bc-design-element address'
    });

    // Add decorative line
    const decorativeLine = new Konva.Line({
        points: [layout.leftMargin, contactY - 15, layout.rightMargin - layout.leftMargin, contactY - 15],
        stroke: accentColor,
        strokeWidth: 3,
        lineCap: 'round',
        draggable: true,
        name: 'bc-design-element decorative-line'
    });

    // Add elements to layer
    bcDesignLayer.add(decorativeLine);
    Object.entries(bcDesignElements).forEach(([key, element]) => {
        if (element) {
            bcDesignLayer.add(element);
        }
    });

    bcDesignLayer.draw();
}

/**
 * Update Business Card Canvas
 */
function updateBusinessCardCanvas() {
    if (!bcStage) return;
    createBusinessCardBackground();
    createBusinessCardElements();
}

/**
 * Select Business Card Format
 */
function selectBusinessCardFormat(format) {
    console.log('🔄 selectBusinessCardFormat called with:', format);
    
    if (!format || !businessCardFormats[format]) {
        console.error('❌ Invalid format:', format);
        showBusinessCardNotification('❌ تنسيق غير صالح', 'error');
        return;
    }
    
    bcCurrentFormat = format;
    
    // Update UI
    document.querySelectorAll('.bc-format-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.closest('.bc-format-btn').classList.add('active');
    }
    
    const formatNameEl = document.getElementById('bcFormatName');
    const formatDimensionsEl = document.getElementById('bcFormatDimensions');
    
    if (formatNameEl) formatNameEl.textContent = businessCardFormats[format].name;
    if (formatDimensionsEl) formatDimensionsEl.textContent = businessCardFormats[format].display;
    
    initializeBusinessCardCanvas();
}

/**
 * Business Card Text Editing
 */
function editBusinessCardTextElement(textNode) {
    if (!textNode || textNode.className !== 'Text') return;

    const nodePos = textNode.absolutePosition();
    const stageBox = bcStage.container().getBoundingClientRect();
    const scale = bcStage.scaleX();
    
    const input = document.createElement('input');
    input.type = 'text';
    input.value = textNode.text().replace(/^[\📧📱🌐📍]\s/, ''); // Remove emoji prefix
    input.style.position = 'absolute';
    input.style.left = (stageBox.left + nodePos.x * scale) + 'px';
    input.style.top = (stageBox.top + nodePos.y * scale) + 'px';
    input.style.width = Math.max(200, textNode.width() * scale) + 'px';
    input.style.fontSize = (textNode.fontSize() * scale) + 'px';
    input.style.fontFamily = textNode.fontFamily();
    input.style.color = textNode.fill();
    input.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    input.style.border = '2px solid #28a745';
    input.style.borderRadius = '4px';
    input.style.padding = '4px 8px';
    input.style.zIndex = '1000';

    textNode.visible(false);
    bcDesignLayer.batchDraw();

    document.body.appendChild(input);
    input.focus();
    input.select();

    function finishEdit() {
        const newText = input.value.trim();
        if (newText !== '') {
            // Re-add emoji prefix based on element type
            let finalText = newText;
            if (textNode.hasName('email')) finalText = `📧 ${newText}`;
            else if (textNode.hasName('phone')) finalText = `📱 ${newText}`;
            else if (textNode.hasName('website')) finalText = `🌐 ${newText}`;
            else if (textNode.hasName('address')) finalText = `📍 ${newText}`;
            
            textNode.text(finalText);
        }
        textNode.visible(true);
        bcDesignLayer.batchDraw();
        document.body.removeChild(input);
        
        showBusinessCardNotification('تم تحديث النص بنجاح');
    }

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') finishEdit();
        if (e.key === 'Escape') {
            textNode.visible(true);
            bcDesignLayer.batchDraw();
            document.body.removeChild(input);
        }
    });

    input.addEventListener('blur', finishEdit);
}

/**
 * Business Card Design Tools
 */
function getSelectedBusinessCardNode() {
    const transformerNodes = bcTransformer.nodes();
    let targetNode = null;

    if (transformerNodes.length > 0) {
        targetNode = transformerNodes[0];
    } else if (bcSelectedNode) {
        targetNode = bcSelectedNode;
    }

    return targetNode;
}

function duplicateSelectedBusinessCard() {
    const targetNode = getSelectedBusinessCardNode();
    if (!targetNode) {
        showBusinessCardNotification('❌ يرجى تحديد عنصر أولاً', 'error');
        return;
    }

    const clone = targetNode.clone();
    clone.x(clone.x() + 20);
    clone.y(clone.y() + 20);
    
    if (clone.hasName('bc-design-element')) {
        const originalId = clone.id();
        if (originalId) {
            clone.id(originalId + '-copy-' + Date.now());
        }
    }
    
    bcDesignLayer.add(clone);
    bcTransformer.nodes([clone]);
    bcSelectedNode = clone;
    
    bcDesignLayer.draw();
    updateBusinessCardSelectionInfo();
    showBusinessCardNotification('✅ تم نسخ العنصر بنجاح');
}

function deleteSelectedBusinessCard() {
    const targetNode = getSelectedBusinessCardNode();
    if (!targetNode) {
        showBusinessCardNotification('❌ يرجى تحديد عنصر أولاً', 'error');
        return;
    }

    targetNode.destroy();
    bcTransformer.nodes([]);
    bcSelectedNode = null;
    
    bcDesignLayer.draw();
    updateBusinessCardSelectionInfo();
    showBusinessCardNotification('✅ تم حذف العنصر');
}

function bringToFrontBusinessCard() {
    const targetNode = getSelectedBusinessCardNode();
    if (!targetNode) {
        showBusinessCardNotification('❌ يرجى تحديد عنصر أولاً', 'error');
        return;
    }

    targetNode.moveToTop();
    bcTransformer.moveToTop();
    
    bcDesignLayer.draw();
    showBusinessCardNotification('✅ تم نقل العنصر للأمام');
}

function sendToBackBusinessCard() {
    const targetNode = getSelectedBusinessCardNode();
    if (!targetNode) {
        showBusinessCardNotification('❌ يرجى تحديد عنصر أولاً', 'error');
        return;
    }

    targetNode.moveToBottom();
    bcDesignLayer.draw();
    showBusinessCardNotification('✅ تم نقل العنصر للخلف');
}

function clearAllBusinessCard() {
    if (confirm('هل أنت متأكد من مسح جميع العناصر؟')) {
        bcDesignLayer.children.forEach(child => {
            if (child !== bcTransformer) {
                child.destroy();
            }
        });
        
        bcTransformer.nodes([]);
        bcSelectedNode = null;
        
        bcDesignLayer.draw();
        updateBusinessCardSelectionInfo();
        showBusinessCardNotification('✅ تم مسح جميع العناصر');
    }
}

function resetBusinessCardPositions() {
    createBusinessCardElements();
    bcTransformer.nodes([]);
    bcSelectedNode = null;
    updateBusinessCardSelectionInfo();
    showBusinessCardNotification('✅ تم إعادة تعيين المواضع');
}

/**
 * Business Card Selection Info
 */
function updateBusinessCardSelectionInfo() {
    const infoElement = document.getElementById('bcSelectionInfo');
    const textFormattingPanel = document.getElementById('bcTextFormattingPanel');
    
    if (!bcSelectedNode) {
        if (infoElement) infoElement.innerHTML = 'اضغط على أي عنصر لتحديده والتحكم به';
        if (textFormattingPanel) textFormattingPanel.style.display = 'none';
        return;
    }

    let elementType = '';
    let elementDesc = '';
    let isTextElement = false;
    
    if (bcSelectedNode.hasName('company-name')) {
        elementType = '🏢 اسم الشركة';
        elementDesc = bcSelectedNode.text();
        isTextElement = true;
    } else if (bcSelectedNode.hasName('person-name')) {
        elementType = '👤 الاسم الشخصي';
        elementDesc = bcSelectedNode.text();
        isTextElement = true;
    } else if (bcSelectedNode.hasName('job-title')) {
        elementType = '💼 المسمى الوظيفي';
        elementDesc = bcSelectedNode.text();
        isTextElement = true;
    } else if (bcSelectedNode.hasName('email')) {
        elementType = '📧 البريد الإلكتروني';
        elementDesc = bcSelectedNode.text();
        isTextElement = true;
    } else if (bcSelectedNode.hasName('phone')) {
        elementType = '📱 رقم الهاتف';
        elementDesc = bcSelectedNode.text();
        isTextElement = true;
    } else if (bcSelectedNode.hasName('website')) {
        elementType = '🌐 الموقع الإلكتروني';
        elementDesc = bcSelectedNode.text();
        isTextElement = true;
    } else if (bcSelectedNode.hasName('address')) {
        elementType = '📍 العنوان';
        elementDesc = bcSelectedNode.text();
        isTextElement = true;
    } else if (bcSelectedNode.hasName('decorative-line')) {
        elementType = '➖ خط زخرفي';
        elementDesc = 'عنصر تزييني';
    } else {
        elementType = '🎨 عنصر';
        elementDesc = 'عنصر تصميم';
    }
    
    if (infoElement) {
        infoElement.innerHTML = `<strong>${elementType}</strong><br><small>${elementDesc}</small>`;
        infoElement.style.color = '#28a745';
    }
    
    if (textFormattingPanel) {
        textFormattingPanel.style.display = isTextElement ? 'block' : 'none';
    }
}

/**
 * Business Card Background Management
 */
function selectBusinessCardBackgroundType(type) {
    bcCurrentBackgroundType = type;
    
    const gradientBtn = document.getElementById('bcGradientBgBtn');
    const imageBtn = document.getElementById('bcImageBgBtn');
    const gradientControls = document.getElementById('bcGradientControls');
    const imageControls = document.getElementById('bcImageControls');
    
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
    
    createBusinessCardBackground();
    showBusinessCardNotification(`✅ تم تغيير نوع الخلفية إلى ${type === 'gradient' ? 'تدرج لوني' : 'صورة'}`);
}

function handleBusinessCardBackgroundImage() {
    const fileInput = document.getElementById('bcBackgroundImageInput');
    const file = fileInput?.files[0];
    
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showBusinessCardNotification('❌ يرجى اختيار ملف صورة صالح', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            bcBackgroundImage = img;
            
            const previewImg = document.getElementById('bcBackgroundPreviewImg');
            const previewContainer = document.getElementById('bcBackgroundImagePreview');
            const positionControls = document.getElementById('bcImagePositionControls');
            
            if (previewImg) previewImg.src = e.target.result;
            if (previewContainer) previewContainer.style.display = 'block';
            if (positionControls) positionControls.style.display = 'block';
            
            createBusinessCardBackground();
            showBusinessCardNotification('✅ تم رفع الصورة بنجاح');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function updateBusinessCardBackgroundPosition() {
    if (bcCurrentBackgroundType === 'image' && bcBackgroundImage) {
        createBusinessCardBackground();
    }
}

/**
 * Business Card Export
 */
function exportBusinessCard(quality = 1) {
    const format = businessCardFormats[bcCurrentFormat];
    const exportFormat = document.querySelector('input[name="bcExportFormat"]:checked')?.value || 'png';
    const companyName = document.getElementById('bcCompanyName')?.value || 'business-card';

    bcTransformer.visible(false);
    
    const dataURL = bcStage.toDataURL({
        mimeType: exportFormat === 'jpg' ? 'image/jpeg' : 'image/png',
        quality: exportFormat === 'jpg' ? 0.95 : 1,
        pixelRatio: quality
    });

    bcTransformer.visible(true);
    bcDesignLayer.draw();

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = `${companyName}-business-card-${quality}x.${exportFormat}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const qualityText = quality === 1 ? 'عادية' : quality === 2 ? 'عالية' : 'فائقة';
    showBusinessCardNotification(`✅ تم تصدير بطاقة العمل بجودة ${qualityText}!`);
}

/**
 * Business Card Notifications
 */
function showBusinessCardNotification(message, type = 'success') {
    if (typeof Swal !== 'undefined') {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            customClass: { popup: 'colored-toast' }
        });

        if (type === 'error') {
            Toast.fire({
                icon: 'error',
                title: message,
                background: '#dc3545',
                color: '#fff'
            });
        } else {
            Toast.fire({
                icon: 'success',
                title: message,
                background: '#28a745',
                color: '#fff'
            });
        }
    } else {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 10000;
            padding: 12px 20px; border-radius: 8px; color: white;
            font-family: 'Almarai', sans-serif; font-weight: 600;
            background: ${type === 'error' ? '#dc3545' : '#28a745'};
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => document.body.removeChild(notification), 3000);
    }
}

/**
 * Initialize Business Card Tool
 */
function initializeBusinessCardTool() {
    if (bcIsInitialized || bcIsInitializing) {
        console.log('🔄 Business card tool already initialized or initializing');
        return;
    }
    
    console.log('🚀 Starting business card tool initialization');
    
    if (typeof Konva !== 'undefined' && document.getElementById('bcKonvaContainer')) {
        console.log('✅ Starting business card tool with Konva');
        selectBusinessCardBackgroundType('gradient');
        initializeBusinessCardCanvas();
    } else {
        console.log('❌ Requirements not met for business card initialization');
        bcIsInitializing = false;
    }
}

// Manual trigger function
window.initializeBusinessCardToolManually = function() {
    console.log('🔧 Manual business card initialization triggered');
    bcIsInitialized = false;
    bcIsInitializing = false;
    initializeBusinessCardTool();
};

// Make functions globally available
window.selectBusinessCardFormat = selectBusinessCardFormat;
window.updateBusinessCardCanvas = updateBusinessCardCanvas;
window.selectBusinessCardBackgroundType = selectBusinessCardBackgroundType;
window.handleBusinessCardBackgroundImage = handleBusinessCardBackgroundImage;
window.updateBusinessCardBackgroundPosition = updateBusinessCardBackgroundPosition;
window.duplicateSelectedBusinessCard = duplicateSelectedBusinessCard;
window.deleteSelectedBusinessCard = deleteSelectedBusinessCard;
window.bringToFrontBusinessCard = bringToFrontBusinessCard;
window.sendToBackBusinessCard = sendToBackBusinessCard;
window.clearAllBusinessCard = clearAllBusinessCard;
window.resetBusinessCardPositions = resetBusinessCardPositions;
window.exportBusinessCard = exportBusinessCard;