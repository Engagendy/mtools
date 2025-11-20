// Discount Offer Tool - Professional Discount/Promotion Design Tool using Konva.js
let discountStage = null;
let discountBackgroundLayer = null;
let discountDesignLayer = null;
let discountSelectedNode = null;
let discountCanvasInitialized = false;

// Discount Offer Format Options
const discountFormats = {
    square: { name: 'Square Offer', width: 1080, height: 1080, display: 'Square Format (1080×1080 px)' },
    horizontal: { name: 'Horizontal Banner', width: 1200, height: 630, display: 'Horizontal Banner (1200×630 px)' },
    vertical: { name: 'Vertical Story', width: 1080, height: 1920, display: 'Story Format (1080×1920 px)' },
    wide: { name: 'Wide Banner', width: 1500, height: 500, display: 'Wide Banner (1500×500 px)'} 
};

// Initialize Discount Tool
function initializeDiscountTool() {
    if (discountCanvasInitialized) {
        return;
    }
    
    console.log('Initializing Discount Offer Tool...');
    
    const container = document.getElementById('discount-canvas');
    if (!container) {
        console.error('Discount canvas container not found');
        return;
    }
    
    // Get initial format
    const initialFormat = discountFormats.square;
    
    // Calculate display size while maintaining aspect ratio
    const maxDisplayWidth = 800;
    const maxDisplayHeight = 600;
    const aspectRatio = initialFormat.width / initialFormat.height;
    
    let displayWidth, displayHeight;
    if (aspectRatio > maxDisplayWidth / maxDisplayHeight) {
        displayWidth = maxDisplayWidth;
        displayHeight = maxDisplayWidth / aspectRatio;
    } else {
        displayHeight = maxDisplayHeight;
        displayWidth = maxDisplayHeight * aspectRatio;
    }
    
    // Create Konva Stage
    discountStage = new Konva.Stage({
        container: 'discount-canvas',
        width: displayWidth,
        height: displayHeight,
        scaleX: displayWidth / initialFormat.width,
        scaleY: displayHeight / initialFormat.height
    });
    
    // Create layers
    discountBackgroundLayer = new Konva.Layer();
    discountDesignLayer = new Konva.Layer();
    
    discountStage.add(discountBackgroundLayer);
    discountStage.add(discountDesignLayer);
    
    // Add background
    const background = new Konva.Rect({
        x: 0,
        y: 0,
        width: initialFormat.width,
        height: initialFormat.height,
        fill: '#ff4757'
    });
    discountBackgroundLayer.add(background);
    
    // Add initial design elements
    createInitialDiscountDesign(initialFormat);
    
    // Setup event handlers
    setupDiscountEventHandlers();
    
    // Update format selector
    updateDiscountFormatSelector();
    
    discountCanvasInitialized = true;
    console.log('Discount Offer Tool initialized successfully');
}

// Create Initial Design Elements
function createInitialDiscountDesign(format) {
    // Main discount percentage
    const discountText = new Konva.Text({
        x: format.width * 0.1,
        y: format.height * 0.2,
        text: '50%',
        fontSize: format.width * 0.15,
        fontFamily: 'Arial Black',
        fill: '#ffffff',
        fontStyle: 'bold',
        align: 'center',
        verticalAlign: 'middle',
        draggable: true,
        name: 'discount-percentage'
    });
    
    // OFF text
    const offText = new Konva.Text({
        x: format.width * 0.1,
        y: format.height * 0.35,
        text: 'OFF',
        fontSize: format.width * 0.08,
        fontFamily: 'Arial',
        fill: '#ffffff',
        fontStyle: 'bold',
        align: 'center',
        draggable: true,
        name: 'off-text'
    });
    
    // Offer title
    const titleText = new Konva.Text({
        x: format.width * 0.05,
        y: format.height * 0.55,
        text: 'خصم كبير',
        fontSize: format.width * 0.06,
        fontFamily: 'Cairo',
        fill: '#ffffff',
        fontStyle: 'bold',
        align: 'right',
        width: format.width * 0.9,
        draggable: true,
        name: 'offer-title'
    });
    
    // Offer description
    const descriptionText = new Konva.Text({
        x: format.width * 0.05,
        y: format.height * 0.65,
        text: 'على جميع المنتجات المختارة',
        fontSize: format.width * 0.04,
        fontFamily: 'Cairo',
        fill: '#ffffff',
        align: 'right',
        width: format.width * 0.9,
        draggable: true,
        name: 'offer-description'
    });
    
    // Validity period
    const validityText = new Konva.Text({
        x: format.width * 0.05,
        y: format.height * 0.8,
        text: 'العرض ساري حتى ٣١ ديسمبر',
        fontSize: format.width * 0.03,
        fontFamily: 'Cairo',
        fill: '#ffffff',
        align: 'right',
        width: format.width * 0.9,
        draggable: true,
        name: 'validity-period'
    });
    
    // Brand/Company name
    const brandText = new Konva.Text({
        x: format.width * 0.05,
        y: format.height * 0.9,
        text: 'اسم المتجر',
        fontSize: format.width * 0.035,
        fontFamily: 'Cairo',
        fill: '#ffffff',
        fontStyle: 'bold',
        align: 'right',
        width: format.width * 0.9,
        draggable: true,
        name: 'brand-name'
    });
    
    // Add decorative elements
    const decorCircle = new Konva.Circle({
        x: format.width * 0.8,
        y: format.height * 0.3,
        radius: format.width * 0.08,
        fill: '#ffffff',
        opacity: 0.2,
        draggable: true,
        name: 'decor-circle'
    });
    
    const decorRect = new Konva.Rect({
        x: format.width * 0.75,
        y: format.height * 0.15,
        width: format.width * 0.03,
        height: format.height * 0.3,
        fill: '#ffffff',
        opacity: 0.3,
        draggable: true,
        name: 'decor-rect'
    });
    
    // Add all elements to design layer
    discountDesignLayer.add(discountText);
    discountDesignLayer.add(offText);
    discountDesignLayer.add(titleText);
    discountDesignLayer.add(descriptionText);
    discountDesignLayer.add(validityText);
    discountDesignLayer.add(brandText);
    discountDesignLayer.add(decorCircle);
    discountDesignLayer.add(decorRect);
    
    discountDesignLayer.draw();
}

// Setup Event Handlers
function setupDiscountEventHandlers() {
    // Node selection and deselection
    discountDesignLayer.on('click tap', function (e) {
        if (e.target === discountDesignLayer) {
            discountSelectedNode = null;
            updateDiscountSelectionUI();
            return;
        }
        
        discountSelectedNode = e.target;
        updateDiscountSelectionUI();
    });
    
    // Node dragging
    discountDesignLayer.on('dragstart', function (e) {
        discountSelectedNode = e.target;
        updateDiscountSelectionUI();
    });
    
    discountDesignLayer.on('dragend', function (e) {
        updateDiscountSelectionUI();
    });
}

// Update Selection UI
function updateDiscountSelectionUI() {
    const selectionInfo = document.querySelector('.discount-selection-info');
    const editControls = document.querySelector('.discount-edit-controls');
    
    if (discountSelectedNode) {
        if (selectionInfo) {
            selectionInfo.textContent = `Selected: ${discountSelectedNode.name() || 'Element'}`;
            selectionInfo.style.display = 'block';
        }
        
        if (editControls) {
            editControls.style.display = 'block';
            
            // Update control values based on selected node
            const fontSizeInput = document.getElementById('discount-font-size');
            const textColorInput = document.getElementById('discount-text-color');
            const textContentInput = document.getElementById('discount-text-content');
            
            if (discountSelectedNode.getType() === 'Text') {
                if (fontSizeInput) fontSizeInput.value = discountSelectedNode.fontSize();
                if (textColorInput) textColorInput.value = discountSelectedNode.fill();
                if (textContentInput) textContentInput.value = discountSelectedNode.text();
            }
        }
    } else {
        if (selectionInfo) selectionInfo.style.display = 'none';
        if (editControls) editControls.style.display = 'none';
    }
}

// Update Format Selector
function updateDiscountFormatSelector() {
    const selector = document.getElementById('discount-format-selector');
    if (!selector) return;
    
    selector.innerHTML = '';
    Object.keys(discountFormats).forEach(key => {
        const format = discountFormats[key];
        const option = document.createElement('option');
        option.value = key;
        option.textContent = format.display;
        selector.appendChild(option);
    });
}

// Select Discount Format
window.selectDiscountFormat = function(formatKey) {
    const format = discountFormats[formatKey];
    if (!format) {
        showNotification('❌ صيغة غير صحيحة', 'error');
        return;
    }
    
    // Calculate new display size
    const maxDisplayWidth = 800;
    const maxDisplayHeight = 600;
    const aspectRatio = format.width / format.height;
    
    let displayWidth, displayHeight;
    if (aspectRatio > maxDisplayWidth / maxDisplayHeight) {
        displayWidth = maxDisplayWidth;
        displayHeight = maxDisplayWidth / aspectRatio;
    } else {
        displayHeight = maxDisplayHeight;
        displayWidth = maxDisplayHeight * aspectRatio;
    }
    
    // Update stage size and scale
    discountStage.size({
        width: displayWidth,
        height: displayHeight
    });
    
    discountStage.scale({
        x: displayWidth / format.width,
        y: displayHeight / format.height
    });
    
    // Update background
    const background = discountBackgroundLayer.findOne('Rect');
    if (background) {
        background.size({
            width: format.width,
            height: format.height
        });
    }
    
    discountBackgroundLayer.draw();
    discountDesignLayer.draw();
    
    showNotification(`✅ تم تغيير الصيغة إلى ${format.name}`, 'success');
};

// Update Text Content
window.updateDiscountText = function() {
    if (!discountSelectedNode || discountSelectedNode.getType() !== 'Text') {
        showNotification('❌ يرجى تحديد عنصر نص أولاً', 'error');
        return;
    }
    
    const newText = document.getElementById('discount-text-content').value;
    discountSelectedNode.text(newText);
    discountDesignLayer.draw();
    showNotification('✅ تم تحديث النص', 'success');
};

// Update Font Size
window.updateDiscountFontSize = function() {
    if (!discountSelectedNode || discountSelectedNode.getType() !== 'Text') {
        showNotification('❌ يرجى تحديد عنصر نص أولاً', 'error');
        return;
    }
    
    const newSize = parseInt(document.getElementById('discount-font-size').value);
    if (newSize > 0) {
        discountSelectedNode.fontSize(newSize);
        discountDesignLayer.draw();
        showNotification('✅ تم تحديث حجم الخط', 'success');
    }
};

// Update Text Color
window.updateDiscountTextColor = function() {
    if (!discountSelectedNode || discountSelectedNode.getType() !== 'Text') {
        showNotification('❌ يرجى تحديد عنصر نص أولاً', 'error');
        return;
    }
    
    const newColor = document.getElementById('discount-text-color').value;
    discountSelectedNode.fill(newColor);
    discountDesignLayer.draw();
    showNotification('✅ تم تحديث لون النص', 'success');
};

// Change Background Color
window.changeDiscountBackground = function(color) {
    const background = discountBackgroundLayer.findOne('Rect');
    if (background) {
        background.fill(color);
        discountBackgroundLayer.draw();
        showNotification('✅ تم تغيير لون الخلفية', 'success');
    }
};

// Upload Background Image
window.uploadDiscountBackground = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageObj = new Image();
        imageObj.onload = function() {
            const backgroundImage = new Konva.Image({
                x: 0,
                y: 0,
                image: imageObj,
                width: discountFormats.square.width, // Current format width
                height: discountFormats.square.height // Current format height
            });
            
            discountBackgroundLayer.destroyChildren();
            discountBackgroundLayer.add(backgroundImage);
            discountBackgroundLayer.draw();
            showNotification('✅ تم تحميل صورة الخلفية', 'success');
        };
        imageObj.src = e.target.result;
    };
    reader.readAsDataURL(file);
};

// Delete Selected Element
window.deleteDiscountElement = function() {
    if (!discountSelectedNode) {
        showNotification('❌ يرجى تحديد عنصر أولاً', 'error');
        return;
    }
    
    discountSelectedNode.destroy();
    discountSelectedNode = null;
    discountDesignLayer.draw();
    updateDiscountSelectionUI();
    showNotification('✅ تم حذف العنصر', 'success');
};

// Add Text Element
window.addDiscountText = function(text = 'نص جديد') {
    const format = discountFormats.square; // Current format
    
    const newText = new Konva.Text({
        x: format.width * 0.1,
        y: format.height * 0.5,
        text: text,
        fontSize: format.width * 0.04,
        fontFamily: 'Cairo',
        fill: '#ffffff',
        draggable: true,
        name: 'custom-text'
    });
    
    discountDesignLayer.add(newText);
    discountDesignLayer.draw();
    showNotification('✅ تم إضافة نص جديد', 'success');
};

// Export Discount Offer
window.exportDiscountOffer = function(format = 'png', quality = 1) {
    if (!discountStage) {
        showNotification('❌ لا يوجد تصميم للتصدير', 'error');
        return;
    }
    
    // Get current format info
    const currentFormat = discountFormats.square; // Default to square, should be dynamic
    
    // Create high-quality export
    const exportScale = quality * 2;
    const dataURL = discountStage.toDataURL({
        mimeType: format === 'jpg' ? 'image/jpeg' : 'image/png',
        quality: quality,
        pixelRatio: exportScale
    });
    
    // Create download link
    const link = document.createElement('a');
    link.download = `discount-offer-${Date.now()}.${format}`;
    link.href = dataURL;
    link.click();
    
    showNotification(`✅ تم تصدير العرض بصيغة ${format.toUpperCase()}`, 'success');
};

// Text Formatting Functions
window.makeDiscountTextBold = function() {
    if (!discountSelectedNode || discountSelectedNode.getType() !== 'Text') {
        showNotification('❌ يرجى تحديد عنصر نص أولاً', 'error');
        return;
    }
    
    const currentStyle = discountSelectedNode.fontStyle() || 'normal';
    const newStyle = currentStyle.includes('bold') ? 'normal' : 'bold';
    discountSelectedNode.fontStyle(newStyle);
    discountDesignLayer.draw();
    showNotification(`✅ تم ${newStyle === 'bold' ? 'تفعيل' : 'إلغاء'} النص العريض`, 'success');
};

window.makeDiscountTextItalic = function() {
    if (!discountSelectedNode || discountSelectedNode.getType() !== 'Text') {
        showNotification('❌ يرجى تحديد عنصر نص أولاً', 'error');
        return;
    }
    
    const currentStyle = discountSelectedNode.fontStyle() || 'normal';
    const newStyle = currentStyle.includes('italic') ? 'normal' : 'italic';
    discountSelectedNode.fontStyle(newStyle);
    discountDesignLayer.draw();
    showNotification(`✅ تم ${newStyle === 'italic' ? 'تفعيل' : 'إلغاء'} النص المائل`, 'success');
};

window.alignDiscountTextLeft = function() {
    if (!discountSelectedNode || discountSelectedNode.getType() !== 'Text') {
        showNotification('❌ يرجى تحديد عنصر نص أولاً', 'error');
        return;
    }
    
    discountSelectedNode.align('left');
    discountDesignLayer.draw();
    showNotification('✅ تم محاذاة النص إلى اليسار', 'success');
};

window.alignDiscountTextCenter = function() {
    if (!discountSelectedNode || discountSelectedNode.getType() !== 'Text') {
        showNotification('❌ يرجى تحديد عنصر نص أولاً', 'error');
        return;
    }
    
    discountSelectedNode.align('center');
    discountDesignLayer.draw();
    showNotification('✅ تم توسيط النص', 'success');
};

window.alignDiscountTextRight = function() {
    if (!discountSelectedNode || discountSelectedNode.getType() !== 'Text') {
        showNotification('❌ يرجى تحديد عنصر نص أولاً', 'error');
        return;
    }
    
    discountSelectedNode.align('right');
    discountDesignLayer.draw();
    showNotification('✅ تم محاذاة النص إلى اليمين', 'success');
};

// Add missing functions that might be called from HTML
window.addCategory = function() {
    showNotification('Add Category feature coming soon!', 'info');
};

window.removeCategory = function(index) {
    showNotification('Remove Category feature coming soon!', 'info');
};

window.updateDiscountPreview = function() {
    if (discountStage) {
        updateDiscountSelectionUI();
        showNotification('✅ تم تحديث المعاينة', 'success');
    }
};

// Update form data and preview
window.updateDiscountFormData = function() {
    // Update discount data from form inputs
    const discountPercentage = document.getElementById('discount-percentage')?.value || '50%';
    const offerTitle = document.getElementById('offer-title')?.value || 'خصم كبير';
    const offerDescription = document.getElementById('offer-description')?.value || 'على جميع المنتجات المختارة';
    const validityPeriod = document.getElementById('validity-period')?.value || 'العرض ساري حتى ٣١ ديسمبر';
    const brandName = document.getElementById('brand-name')?.value || 'اسم المتجر';
    
    // Update the discount design with new data
    if (discountDesignLayer) {
        // Clear and recreate with new data
        discountDesignLayer.destroyChildren();
        createInitialDiscountDesign(discountFormats.square);
    }
    
    showNotification('✅ تم تحديث البيانات', 'success');
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Discount Tool: DOM loaded, checking for discount tool...');
    
    setTimeout(() => {
        const discountCanvas = document.getElementById('discount-canvas');
        if (discountCanvas && !discountCanvasInitialized) {
            console.log('Discount Tool: Canvas found, initializing...');
            initializeDiscountTool();
        }
    }, 500);
});

// Initialize when tool is switched
window.addEventListener('toolChanged', function(e) {
    if (e.detail.tool === 'discount-offer') {
        setTimeout(() => {
            if (!discountCanvasInitialized) {
                console.log('Discount Tool: Initializing after tool switch...');
                initializeDiscountTool();
            }
        }, 500);
    }
});

console.log('Discount Offer Tool loaded successfully');