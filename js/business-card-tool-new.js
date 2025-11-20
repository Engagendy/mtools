// Enhanced Bilingual Business Card Tool - Professional Business Card Designer using Konva.js
let businessCardStage = null;
let businessCardBackgroundLayer = null;
let businessCardDesignLayer = null;
let businessCardTransformer = null;
let businessCardCanvasInitialized = false;
let currentBusinessCardSide = 'english';
let selectedBusinessCardElement = null;

// Business Card Format
const businessCardFormat = {
    name: 'Standard Business Card',
    width: 1050,
    height: 600,
    display: '89×51 mm (1050×600 px)'
};

// Business card data structure for both sides
let businessCardData = {
    english: {
        shopName: 'ALALAMY',
        tagline: 'Sharjah, UAE',
        phone: '+971 XX XXX XXXX',
        email: 'info@alamia.ae',
        website: 'www.alamia-sharjah.ae',
        services: ['Mobile Phones', 'Laptops', 'Tablets', 'Buy', 'Sell', 'Trade-In']
    },
    arabic: {
        shopName: 'العالمى الشارقة',
        tagline: 'الإمارات العربية المتحدة',
        phone: '+971 XX XXX XXXX',
        email: 'info@alamia.ae',
        website: 'www.alamia-sharjah.ae',
        services: ['هواتف ذكية', 'أجهزة كمبيوتر', 'أجهزة لوحية', 'شراء', 'بيع', 'تبديل']
    },
    design: {
        backgroundColor: '#1a1a1a',
        textColor: '#ffffff',
        logoEmoji: '📱',
        logoImage: null,
        qrImage: null,
        qrLabel: 'SCAN ME'
    }
};

// Initialize Business Card Tool
function initializeBusinessCardTool() {
    if (businessCardCanvasInitialized) {
        return;
    }

    console.log('Initializing Business Card Tool...');

    const container = document.getElementById('business-card-canvas');
    if (!container) {
        console.error('Business card canvas container not found');
        return;
    }

    // Calculate display size while maintaining aspect ratio - Much larger for better quality
    const containerWidth = container.clientWidth || 800;
    const maxDisplayWidth = Math.min(containerWidth - 40, 900); // Increased size significantly
    const aspectRatio = businessCardFormat.width / businessCardFormat.height;

    let displayWidth = maxDisplayWidth;
    let displayHeight = maxDisplayWidth / aspectRatio;

    // Create Konva Stage with higher DPI
    businessCardStage = new Konva.Stage({
        container: 'business-card-canvas',
        width: displayWidth,
        height: displayHeight,
        scaleX: displayWidth / businessCardFormat.width,
        scaleY: displayHeight / businessCardFormat.height,
        // Enable high DPI rendering
        pixelRatio: window.devicePixelRatio || 2
    });

    // Create layers
    businessCardBackgroundLayer = new Konva.Layer();
    businessCardDesignLayer = new Konva.Layer();

    // Create transformer for interactive elements
    businessCardTransformer = new Konva.Transformer({
        keepRatio: false,
        enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right', 'top-center', 'bottom-center'],
        rotateEnabled: true,
        borderStroke: '#4F46E5',
        borderStrokeWidth: 2,
        anchorFill: '#4F46E5',
        anchorStroke: '#fff',
        anchorSize: 8,
        boundBoxFunc: (oldBox, newBox) => {
            // Limit resizing to canvas bounds
            newBox.width = Math.max(20, newBox.width);
            newBox.height = Math.max(20, newBox.height);
            return newBox;
        }
    });
    businessCardDesignLayer.add(businessCardTransformer);

    businessCardStage.add(businessCardBackgroundLayer);
    businessCardStage.add(businessCardDesignLayer);

    // Add click handler for element selection
    businessCardStage.on('click tap', (e) => {
        // If clicked on empty area, clear selection
        if (e.target === businessCardStage) {
            businessCardTransformer.nodes([]);
            selectedBusinessCardElement = null;
            hideTextEditor();
            businessCardDesignLayer.draw();
            return;
        }

        // Skip background layer elements
        if (e.target.getLayer() === businessCardBackgroundLayer) {
            businessCardTransformer.nodes([]);
            selectedBusinessCardElement = null;
            hideTextEditor();
            businessCardDesignLayer.draw();
            return;
        }

        // Select clicked element
        if (e.target.getLayer() === businessCardDesignLayer && e.target !== businessCardTransformer) {
            businessCardTransformer.nodes([e.target]);
            selectedBusinessCardElement = e.target;
            businessCardDesignLayer.draw();

            // Auto-switch to design tab when any element is selected
            if (typeof switchBusinessCardTab === 'function') {
                switchBusinessCardTab('design');
            }
        }
    });

    // Add double-click handler for text editing
    businessCardStage.on('dblclick', (e) => {
        if (e.target.getClassName() === 'Text') {
            showTextEditor(e.target);
        }
    });

    // Add keyboard shortcuts for element manipulation
    window.addEventListener('keydown', (e) => {
        if (!selectedBusinessCardElement || !businessCardCanvasInitialized) return;

        // Delete selected element
        if (e.key === 'Delete' || e.key === 'Backspace') {
            // Detach transformer first
            businessCardTransformer.nodes([]);
            // Remove element (not destroy)
            selectedBusinessCardElement.remove();
            selectedBusinessCardElement = null;
            businessCardDesignLayer.draw();
            e.preventDefault();
        }

        // Copy element
        if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
            const clone = selectedBusinessCardElement.clone({
                x: selectedBusinessCardElement.x() + 10,
                y: selectedBusinessCardElement.y() + 10
            });
            businessCardDesignLayer.add(clone);
            businessCardTransformer.nodes([clone]);
            selectedBusinessCardElement = clone;
            businessCardDesignLayer.draw();
            e.preventDefault();
        }

        // Arrow key movement
        const moveDistance = e.shiftKey ? 10 : 1;
        let moved = false;

        // Verify element is still valid before moving
        if (!selectedBusinessCardElement.isDestroyed && selectedBusinessCardElement.getLayer()) {
            switch (e.key) {
                case 'ArrowLeft':
                    selectedBusinessCardElement.x(selectedBusinessCardElement.x() - moveDistance);
                    moved = true;
                    break;
                case 'ArrowRight':
                    selectedBusinessCardElement.x(selectedBusinessCardElement.x() + moveDistance);
                    moved = true;
                    break;
                case 'ArrowUp':
                    selectedBusinessCardElement.y(selectedBusinessCardElement.y() - moveDistance);
                    moved = true;
                    break;
                case 'ArrowDown':
                    selectedBusinessCardElement.y(selectedBusinessCardElement.y() + moveDistance);
                    moved = true;
                    break;
            }
        }

        if (moved) {
            businessCardDesignLayer.draw();
            e.preventDefault();
        }
    });

    // Add background
    const background = new Konva.Rect({
        x: 0,
        y: 0,
        width: businessCardFormat.width,
        height: businessCardFormat.height,
        fill: businessCardData.design.backgroundColor
    });
    businessCardBackgroundLayer.add(background);

    // Create initial design
    createBusinessCardDesign('english');

    // Setup event handlers
    setupBusinessCardEventHandlers();

    // Populate form fields with default data
    populateFormFields();

    businessCardCanvasInitialized = true;
    console.log('Business Card Tool initialized successfully');

    // Update i18n for the tool
    if (window.i18n) {
        window.i18n.updatePageText();
    }
}

// Text Editor for inline editing
let currentEditingText = null;

function showTextEditor(textNode) {
    currentEditingText = textNode;

    // Create overlay editor
    const textPosition = textNode.getAbsolutePosition();
    const stageBox = businessCardStage.container().getBoundingClientRect();
    const scale = businessCardStage.scaleX();

    // Remove existing editor if any
    hideTextEditor();

    // Calculate position accounting for scroll
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    // Create textarea
    const textarea = document.createElement('textarea');
    textarea.id = 'text-editor-input';
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

    // Update text on input
    textarea.addEventListener('input', () => {
        if (textNode && !textNode.isDestroyed && textNode.getLayer()) {
            textNode.text(textarea.value);
            businessCardDesignLayer.draw();
        }
    });

    // Close on blur or Enter
    textarea.addEventListener('blur', () => {
        hideTextEditor();
    });

    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideTextEditor();
        }
    });
}

function hideTextEditor() {
    const editor = document.getElementById('text-editor-input');
    if (editor) {
        editor.remove();
    }
    currentEditingText = null;
}

// Tab switching functionality
window.switchBusinessCardTab = function (tab) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });

    // Remove active class from all tabs
    document.querySelectorAll('.business-card-tab').forEach(tabBtn => {
        tabBtn.classList.remove('bg-white', 'text-indigo-600', 'shadow-sm');
        tabBtn.classList.add('text-gray-500', 'hover:text-gray-700');
    });

    // Show selected tab content
    const tabContent = document.getElementById(`${tab}-content`);
    if (tabContent) {
        tabContent.classList.remove('hidden');
    }

    // Activate selected tab
    const activeTab = document.getElementById(`tab-${tab}`);
    if (activeTab) {
        activeTab.classList.remove('text-gray-500', 'hover:text-gray-700');
        activeTab.classList.add('bg-white', 'text-indigo-600', 'shadow-sm');
    }

    // Update preview if switching to english or arabic
    if (tab === 'english' || tab === 'arabic') {
        currentBusinessCardSide = tab;
        updateBusinessCardPreview();
    }
};

// Add service functions
window.addServiceEn = function () {
    const input = document.getElementById('new-service-en');
    const service = input.value.trim();
    if (service) {
        businessCardData.english.services.push(service);
        input.value = '';
        updateServicesDisplay('en');
        updateBusinessCardPreview();
    }
};

window.addServiceAr = function () {
    const input = document.getElementById('new-service-ar');
    const service = input.value.trim();
    if (service) {
        businessCardData.arabic.services.push(service);
        input.value = '';
        updateServicesDisplay('ar');
        updateBusinessCardPreview();
    }
};

// Remove service functions
window.removeServiceEn = function (index) {
    businessCardData.english.services.splice(index, 1);
    updateServicesDisplay('en');
    updateBusinessCardPreview();
};

window.removeServiceAr = function (index) {
    businessCardData.arabic.services.splice(index, 1);
    updateServicesDisplay('ar');
    updateBusinessCardPreview();
};

// Update services display
function updateServicesDisplay(lang) {
    const container = document.getElementById(`services-${lang}-list`);
    if (!container) return;

    const services = businessCardData[lang === 'en' ? 'english' : 'arabic'].services;

    container.innerHTML = services.map((service, index) => `
        <div class="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
            <span class="text-sm text-gray-700">${service}</span>
            <button onclick="removeService${lang === 'en' ? 'En' : 'Ar'}(${index})" class="text-red-500 hover:text-red-700">
                <i class="fas fa-times text-xs"></i>
            </button>
        </div>
    `).join('');
}

// Populate form fields with default data
function populateFormFields() {
    // Populate English fields
    const shopNameEn = document.getElementById('shop-name-en');
    const taglineEn = document.getElementById('tagline-en');
    const phoneEn = document.getElementById('phone-en');
    const emailEn = document.getElementById('email-en');
    const websiteEn = document.getElementById('website-en');

    if (shopNameEn) shopNameEn.value = businessCardData.english.shopName;
    if (taglineEn) taglineEn.value = businessCardData.english.tagline;
    if (phoneEn) phoneEn.value = businessCardData.english.phone;
    if (emailEn) emailEn.value = businessCardData.english.email;
    if (websiteEn) websiteEn.value = businessCardData.english.website;

    // Populate Arabic fields
    const shopNameAr = document.getElementById('shop-name-ar');
    const taglineAr = document.getElementById('tagline-ar');
    const phoneAr = document.getElementById('phone-ar');
    const emailAr = document.getElementById('email-ar');
    const websiteAr = document.getElementById('website-ar');

    if (shopNameAr) shopNameAr.value = businessCardData.arabic.shopName;
    if (taglineAr) taglineAr.value = businessCardData.arabic.tagline;
    if (phoneAr) phoneAr.value = businessCardData.arabic.phone;
    if (emailAr) emailAr.value = businessCardData.arabic.email;
    if (websiteAr) websiteAr.value = businessCardData.arabic.website;

    // Update services display
    updateServicesDisplay('en');
    updateServicesDisplay('ar');

    // Update the preview with initial data
    updateBusinessCardPreview();
}

// Create business card design
function createBusinessCardDesign(side) {
    if (!businessCardDesignLayer) return;

    // Clear existing design (but keep the transformer)
    businessCardDesignLayer.getChildren((node) => node !== businessCardTransformer).forEach((node) => {
        node.remove();
    });

    // Clear transformer selection
    if (businessCardTransformer) {
        businessCardTransformer.nodes([]);
    }
    selectedBusinessCardElement = null;

    const data = businessCardData[side];
    const isArabic = side === 'arabic';

    // Force canvas container direction to match card side, not page language
    const canvasContainer = document.getElementById('business-card-canvas');
    if (canvasContainer) {
        canvasContainer.setAttribute('dir', isArabic ? 'rtl' : 'ltr');
        canvasContainer.style.direction = isArabic ? 'rtl' : 'ltr';
    }

    // Also set direction on the actual canvas element
    const canvasElement = businessCardStage.container().querySelector('canvas');
    if (canvasElement) {
        canvasElement.setAttribute('dir', isArabic ? 'rtl' : 'ltr');
        canvasElement.style.direction = isArabic ? 'rtl' : 'ltr';
    }

    // Background Image (if uploaded) - Clear existing background images first
    businessCardBackgroundLayer.find('Image').forEach(img => img.remove());

    if (businessCardData.design.backgroundImage) {
        const imageObj = new Image();
        imageObj.onload = function () {
            const bgImage = new Konva.Image({
                x: 0,
                y: 0,
                image: imageObj,
                width: businessCardFormat.width,
                height: businessCardFormat.height,
                opacity: 0.4, // Slightly more visible
                name: 'backgroundImage'
            });
            businessCardBackgroundLayer.add(bgImage);
            businessCardBackgroundLayer.draw();
        };
        imageObj.onerror = function () {
            console.error('Failed to load background image');
        };
        imageObj.src = businessCardData.design.backgroundImage;
    }

    // Logo/Icon
    if (businessCardData.design.logoImage) {
        const imageObj = new Image();
        imageObj.onload = function () {
            const logoImage = new Konva.Image({
                x: isArabic ? businessCardFormat.width - 90 : 30,
                y: 30,
                image: imageObj,
                width: 70, // Increased from 50
                height: 70, // Increased from 50
                cornerRadius: 10,
                draggable: true,
                name: 'logo'
            });
            businessCardDesignLayer.add(logoImage);
            businessCardDesignLayer.draw();
        };
        imageObj.onerror = function () {
            console.error('Failed to load logo image');
            // Show emoji fallback if image fails
            if (businessCardData.design.logoEmoji) {
                createLogoEmoji(isArabic);
            }
        };
        imageObj.src = businessCardData.design.logoImage;
    } else if (businessCardData.design.logoEmoji) {
        createLogoEmoji(isArabic);
    }

    // Helper function to create logo emoji
    function createLogoEmoji(isArabic) {
        const logoText = new Konva.Text({
            x: isArabic ? businessCardFormat.width - 100 : 30,
            y: 30,
            text: businessCardData.design.logoEmoji,
            fontSize: 60, // Increased from 40
            fill: businessCardData.design.textColor,
            align: 'left',
            draggable: true,
            name: 'logoText'
        });
        businessCardDesignLayer.add(logoText);
    }

    // Shop Name
    if (data.shopName) {
        const LRM = '\u200E';
        const RLM = '\u200F';
        const shopNameContent = isArabic ? `${RLM}${data.shopName}` : `${LRM}${data.shopName}`;

        const shopNameText = new Konva.Text({
            x: isArabic ? 30 : 100,
            y: 40,
            text: shopNameContent,
            fontSize: 48, // Increased from 32
            fontFamily: isArabic ? 'Almarai, Arial, sans-serif' : 'Inter, Arial, sans-serif',
            fontStyle: 'bold',
            fill: businessCardData.design.textColor,
            align: isArabic ? 'right' : 'left',
            width: isArabic ? businessCardFormat.width - 140 : businessCardFormat.width - 150,
            // Enhanced text quality
            perfectDrawEnabled: false,
            shadowEnabled: false,
            draggable: true,
            name: 'shopName'
        });
        businessCardDesignLayer.add(shopNameText);
    }

    // Tagline
    if (data.tagline) {
        const LRM = '\u200E';
        const RLM = '\u200F';
        const taglineContent = isArabic ? `${RLM}${data.tagline}` : `${LRM}${data.tagline}`;

        const taglineText = new Konva.Text({
            x: isArabic ? 30 : 100,
            y: 120, // Moved down due to larger shop name
            text: taglineContent,
            fontSize: 24, // Increased from 16
            fontFamily: isArabic ? 'Almarai' : 'Inter',
            fill: businessCardData.design.textColor,
            align: isArabic ? 'right' : 'left',
            width: isArabic ? businessCardFormat.width - 140 : businessCardFormat.width - 150,
            draggable: true,
            name: 'tagline'
        });
        businessCardDesignLayer.add(taglineText);
    }

    // Contact Information
    let yPos = 200; // Increased spacing
    const contacts = [
        { icon: '📞', text: data.phone },
        { icon: '📧', text: data.email },
        { icon: '🌐', text: data.website }
    ];

    contacts.forEach(contact => {
        if (contact.text) {
            // Use Unicode directional markers to force correct rendering
            const LRM = '\u200E'; // Left-to-Right Mark
            const RLM = '\u200F'; // Right-to-Left Mark

            // For phone numbers, always keep LTR even in Arabic
            const isPhoneNumber = contact.icon === '📞';
            let textContent;

            if (isArabic) {
                // In Arabic: icon comes BEFORE text, but phone stays LTR
                if (isPhoneNumber) {
                    textContent = `${contact.icon} ${LRM}${contact.text}`;
                } else {
                    textContent = `${contact.icon} ${RLM}${contact.text}`;
                }
            } else {
                textContent = `${LRM}${contact.icon} ${contact.text}`;
            }

            const contactText = new Konva.Text({
                x: isArabic ? 30 : 30,
                y: yPos,
                text: textContent,
                fontSize: 20,
                fontFamily: isArabic ? 'Almarai' : 'Inter',
                fill: businessCardData.design.textColor,
                align: isArabic ? 'right' : 'left',
                width: isArabic ? businessCardFormat.width - 60 : businessCardFormat.width - 200,
                wrap: 'none',
                draggable: true,
                name: `contact_${contact.icon}`
            });
            businessCardDesignLayer.add(contactText);
            yPos += 35;
        }
    });

    // Services
    if (data.services.length > 0) {
        // Use Unicode directional markers for proper punctuation
        const LRM = '\u200E';
        const RLM = '\u200F';
        const servicesText = isArabic ? `${RLM}الخدمات:` : `${LRM}Services:`;

        const servicesTitle = new Konva.Text({
            x: 30,
            y: yPos + 30, // Increased spacing
            text: servicesText,
            fontSize: 22, // Increased from 16
            fontFamily: isArabic ? 'Almarai' : 'Inter',
            fontStyle: 'bold',
            fill: businessCardData.design.textColor,
            align: isArabic ? 'right' : 'left',
            width: isArabic ? businessCardFormat.width - 60 : undefined,
            draggable: true,
            name: 'servicesTitle'
        });
        businessCardDesignLayer.add(servicesTitle);

        yPos += 60; // Increased spacing
        data.services.slice(0, 3).forEach((service, index) => {
            const LRM = '\u200E';
            const RLM = '\u200F';
            const serviceContent = isArabic ? `${RLM}${service}` : `${LRM}${service}`;

            // Create a group for each service with box
            const serviceGroup = new Konva.Group({
                x: isArabic ? businessCardFormat.width - 200 : 30,
                y: yPos,
                draggable: true,
                name: `serviceGroup_${index}`
            });

            // Service box background
            const serviceBox = new Konva.Rect({
                x: 0,
                y: 0,
                width: 160,
                height: 32,
                fill: 'rgba(255,255,255,0.1)',
                stroke: businessCardData.design.textColor,
                strokeWidth: 1,
                cornerRadius: 6,
                name: 'serviceBox'
            });
            serviceGroup.add(serviceBox);

            // Service text
            const serviceText = new Konva.Text({
                x: 10,
                y: 8,
                text: serviceContent,
                fontSize: 16,
                fontFamily: isArabic ? 'Almarai' : 'Inter',
                fill: businessCardData.design.textColor,
                align: isArabic ? 'right' : 'left',
                width: 140,
                name: 'serviceText'
            });
            serviceGroup.add(serviceText);

            businessCardDesignLayer.add(serviceGroup);
            yPos += 40; // Increased spacing between service boxes
        });
    }

    // QR Code (if available)
    if (businessCardData.design.qrImage) {
        const imageObj = new Image();
        imageObj.onload = function () {
            const qrX = isArabic ? 30 : businessCardFormat.width - 150;
            const qrImage = new Konva.Image({
                x: qrX, // Left for Arabic, Right for English
                y: businessCardFormat.height - 150,
                image: imageObj,
                width: 120,
                height: 120,
                cornerRadius: 6,
                draggable: true,
                name: 'qrCode'
            });
            businessCardDesignLayer.add(qrImage);

            // QR Label below the QR code
            if (businessCardData.design.qrLabel) {
                const qrLabelText = new Konva.Text({
                    x: qrX,
                    y: businessCardFormat.height - 25,
                    text: businessCardData.design.qrLabel,
                    fontSize: 14,
                    fontFamily: 'Inter',
                    fill: businessCardData.design.textColor,
                    align: 'center',
                    width: 120,
                    draggable: true,
                    name: 'qrLabel'
                });
                businessCardDesignLayer.add(qrLabelText);
            }

            businessCardDesignLayer.draw();
        };
        imageObj.onerror = function () {
            console.error('Failed to load QR image');
            // Show placeholder if image fails
            createQRPlaceholder();
        };
        imageObj.src = businessCardData.design.qrImage;
    } else if (businessCardData.design.qrLabel) {
        createQRPlaceholder();
    }

    // Helper function to create QR placeholder
    function createQRPlaceholder() {
        const qrX = isArabic ? 30 : businessCardFormat.width - 150;

        // QR placeholder box
        const qrBox = new Konva.Rect({
            x: qrX, // Left for Arabic, Right for English
            y: businessCardFormat.height - 150,
            width: 120,
            height: 120,
            fill: 'rgba(255,255,255,0.9)',
            stroke: businessCardData.design.textColor,
            strokeWidth: 2,
            cornerRadius: 6,
            draggable: true,
            name: 'qrPlaceholder'
        });
        businessCardDesignLayer.add(qrBox);

        const qrText = new Konva.Text({
            x: qrX,
            y: businessCardFormat.height - 90,
            text: 'QR',
            fontSize: 20,
            fontFamily: 'Inter',
            fontStyle: 'bold',
            fill: businessCardData.design.textColor,
            align: 'center',
            width: 120,
            draggable: true,
            name: 'qrText'
        });
        businessCardDesignLayer.add(qrText);

        if (businessCardData.design.qrLabel) {
            const qrLabelText = new Konva.Text({
                x: qrX,
                y: businessCardFormat.height - 25,
                text: businessCardData.design.qrLabel,
                fontSize: 14,
                fontFamily: 'Inter',
                fill: businessCardData.design.textColor,
                align: 'center',
                width: 120,
                draggable: true,
                name: 'qrLabelPlaceholder'
            });
            businessCardDesignLayer.add(qrLabelText);
        }
    }

    businessCardDesignLayer.draw();
}

// Setup event handlers
function setupBusinessCardEventHandlers() {
    // Form input handlers
    setupFormHandlers();

    // File upload handlers
    setupFileHandlers();

    // Text formatting handlers
    setupTextFormattingHandlers();
}

function setupFormHandlers() {
    // English form inputs
    ['shop-name-en', 'tagline-en', 'phone-en', 'email-en', 'website-en'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', updateBusinessCardData);
        }
    });

    // Arabic form inputs
    ['shop-name-ar', 'tagline-ar', 'phone-ar', 'email-ar', 'website-ar'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', updateBusinessCardData);
        }
    });

    // Design inputs
    ['bg-color', 'text-color', 'logo-emoji', 'qr-label'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', updateBusinessCardData);
        }
    });

    // Color sync handlers - sync between color picker and hex input
    const bgColorPicker = document.getElementById('bg-color');
    const bgColorHex = document.getElementById('bg-color-hex');
    const textColorPicker = document.getElementById('text-color');
    const textColorHex = document.getElementById('text-color-hex');

    if (bgColorPicker && bgColorHex) {
        bgColorPicker.addEventListener('input', function () {
            bgColorHex.value = this.value;
            updateBusinessCardData();
        });
        bgColorHex.addEventListener('input', function () {
            if (/^#[0-9A-F]{6}$/i.test(this.value)) {
                bgColorPicker.value = this.value;
                updateBusinessCardData();
            }
        });
    }

    if (textColorPicker && textColorHex) {
        textColorPicker.addEventListener('input', function () {
            textColorHex.value = this.value;
            updateBusinessCardData();
        });
        textColorHex.addEventListener('input', function () {
            if (/^#[0-9A-F]{6}$/i.test(this.value)) {
                textColorPicker.value = this.value;
                updateBusinessCardData();
            }
        });
    }

    // Logo emoji preview update
    const logoEmojiInput = document.getElementById('logo-emoji');
    const logoPreview = document.getElementById('logo-preview');
    if (logoEmojiInput && logoPreview) {
        logoEmojiInput.addEventListener('input', function () {
            logoPreview.textContent = this.value || '📱';
            updateBusinessCardData();
        });
    }

    // Enter key handlers for service inputs
    const serviceInputs = ['new-service-en', 'new-service-ar'];
    serviceInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    if (id === 'new-service-en') {
                        addServiceEn();
                    } else {
                        addServiceAr();
                    }
                }
            });
        }
    });
}

function setupFileHandlers() {
    // Logo upload
    const logoUpload = document.getElementById('logo-upload');
    const logoPreview = document.getElementById('logo-preview');
    const logoEmojiInput = document.getElementById('logo-emoji');

    if (logoUpload) {
        logoUpload.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    // First update form data to preserve current state
                    updateBusinessCardData();

                    // Then set the image
                    businessCardData.design.logoImage = event.target.result;

                    // Update preview
                    if (logoPreview) {
                        logoPreview.innerHTML = `<img src="${event.target.result}" class="w-full h-full object-cover rounded">`;
                    }

                    // Clear emoji input when image is uploaded
                    if (logoEmojiInput) {
                        logoEmojiInput.value = '';
                        businessCardData.design.logoEmoji = '';
                    }

                    // Wait a moment for image to be processed, then update canvas
                    setTimeout(() => {
                        updateBusinessCardPreview();
                        showNotification('✅ تم رفع الشعار بنجاح', 'success');
                    }, 100);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // QR upload
    const qrUpload = document.getElementById('qr-upload');
    const qrPreview = document.getElementById('qr-preview');

    if (qrUpload) {
        qrUpload.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    // First update form data to preserve current state
                    updateBusinessCardData();

                    // Then set the QR image
                    businessCardData.design.qrImage = event.target.result;

                    // Update preview
                    if (qrPreview) {
                        qrPreview.innerHTML = `<img src="${event.target.result}" class="w-full h-full object-cover rounded">`;
                    }

                    // Wait a moment for image to be processed, then update canvas
                    setTimeout(() => {
                        updateBusinessCardPreview();
                        showNotification('✅ تم رفع رمز QR بنجاح', 'success');
                    }, 100);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Background photo upload
    const bgPhotoUpload = document.getElementById('bg-photo-upload');
    const bgPhotoPreview = document.getElementById('bg-photo-preview');

    if (bgPhotoUpload) {
        bgPhotoUpload.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    // First update form data to preserve current state
                    updateBusinessCardData();

                    // Then set the background image
                    businessCardData.design.backgroundImage = event.target.result;

                    // Update preview
                    if (bgPhotoPreview) {
                        bgPhotoPreview.innerHTML = `<img src="${event.target.result}" class="w-full h-full object-cover rounded">`;
                    }

                    // Wait a moment for image to be processed, then update canvas
                    setTimeout(() => {
                        updateBusinessCardPreview();
                        showNotification('✅ تم رفع صورة الخلفية بنجاح', 'success');
                    }, 100);
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// Setup text formatting handlers
function setupTextFormattingHandlers() {
    const fontSizeSlider = document.getElementById('text-font-size');
    const fontSizeValue = document.getElementById('font-size-value');
    const fontFamilySelect = document.getElementById('text-font-family');
    const boldButton = document.getElementById('text-bold');
    const italicButton = document.getElementById('text-italic');
    const alignLeftButton = document.getElementById('text-align-left');
    const alignCenterButton = document.getElementById('text-align-center');
    const alignRightButton = document.getElementById('text-align-right');
    const directionLtrButton = document.getElementById('text-direction-ltr');
    const directionRtlButton = document.getElementById('text-direction-rtl');
    const copyButton = document.getElementById('element-copy');
    const deleteButton = document.getElementById('element-delete');

    // Font size slider
    if (fontSizeSlider && fontSizeValue) {
        fontSizeSlider.addEventListener('input', function () {
            fontSizeValue.textContent = this.value + 'px';
            if (selectedBusinessCardElement &&
                !selectedBusinessCardElement.isDestroyed &&
                selectedBusinessCardElement.getLayer() &&
                selectedBusinessCardElement.getClassName() === 'Text') {
                selectedBusinessCardElement.fontSize(parseInt(this.value));
                businessCardDesignLayer.draw();
            }
        });
    }

    // Font family selector
    if (fontFamilySelect) {
        fontFamilySelect.addEventListener('change', function () {
            if (selectedBusinessCardElement &&
                !selectedBusinessCardElement.isDestroyed &&
                selectedBusinessCardElement.getLayer() &&
                selectedBusinessCardElement.getClassName() === 'Text') {
                selectedBusinessCardElement.fontFamily(this.value);
                businessCardDesignLayer.draw();
            }
        });
    }

    // Bold button
    if (boldButton) {
        boldButton.addEventListener('click', function () {
            if (selectedBusinessCardElement &&
                !selectedBusinessCardElement.isDestroyed &&
                selectedBusinessCardElement.getLayer() &&
                selectedBusinessCardElement.getClassName() === 'Text') {
                const current = selectedBusinessCardElement.fontStyle() || 'normal';
                selectedBusinessCardElement.fontStyle(current === 'bold' ? 'normal' : 'bold');
                this.classList.toggle('bg-indigo-100');
                businessCardDesignLayer.draw();
            }
        });
    }

    // Italic button
    if (italicButton) {
        italicButton.addEventListener('click', function () {
            if (selectedBusinessCardElement &&
                !selectedBusinessCardElement.isDestroyed &&
                selectedBusinessCardElement.getLayer() &&
                selectedBusinessCardElement.getClassName() === 'Text') {
                const current = selectedBusinessCardElement.fontStyle() || 'normal';
                selectedBusinessCardElement.fontStyle(current === 'italic' ? 'normal' : 'italic');
                this.classList.toggle('bg-indigo-100');
                businessCardDesignLayer.draw();
            }
        });
    }

    // Alignment buttons
    if (alignLeftButton) {
        alignLeftButton.addEventListener('click', function () {
            if (selectedBusinessCardElement &&
                !selectedBusinessCardElement.isDestroyed &&
                selectedBusinessCardElement.getLayer() &&
                selectedBusinessCardElement.getClassName() === 'Text') {
                selectedBusinessCardElement.align('left');
                updateAlignmentButtons('left');
                businessCardDesignLayer.draw();
            }
        });
    }

    if (alignCenterButton) {
        alignCenterButton.addEventListener('click', function () {
            if (selectedBusinessCardElement &&
                !selectedBusinessCardElement.isDestroyed &&
                selectedBusinessCardElement.getLayer() &&
                selectedBusinessCardElement.getClassName() === 'Text') {
                selectedBusinessCardElement.align('center');
                updateAlignmentButtons('center');
                businessCardDesignLayer.draw();
            }
        });
    }

    if (alignRightButton) {
        alignRightButton.addEventListener('click', function () {
            if (selectedBusinessCardElement &&
                !selectedBusinessCardElement.isDestroyed &&
                selectedBusinessCardElement.getLayer() &&
                selectedBusinessCardElement.getClassName() === 'Text') {
                selectedBusinessCardElement.align('right');
                updateAlignmentButtons('right');
                businessCardDesignLayer.draw();
            }
        });
    }

    // Text direction buttons
    if (directionLtrButton) {
        directionLtrButton.addEventListener('click', function () {
            if (selectedBusinessCardElement &&
                !selectedBusinessCardElement.isDestroyed &&
                selectedBusinessCardElement.getLayer() &&
                selectedBusinessCardElement.getClassName() === 'Text') {
                // Apply LTR marker
                const LRM = '\u200E';
                const currentText = selectedBusinessCardElement.text();
                // Remove any existing directional markers
                const cleanText = currentText.replace(/[\u200E\u200F]/g, '');
                selectedBusinessCardElement.text(`${LRM}${cleanText}`);
                updateDirectionButtons('ltr');
                businessCardDesignLayer.draw();
            }
        });
    }

    if (directionRtlButton) {
        directionRtlButton.addEventListener('click', function () {
            if (selectedBusinessCardElement &&
                !selectedBusinessCardElement.isDestroyed &&
                selectedBusinessCardElement.getLayer() &&
                selectedBusinessCardElement.getClassName() === 'Text') {
                // Apply RTL marker
                const RLM = '\u200F';
                const currentText = selectedBusinessCardElement.text();
                // Remove any existing directional markers
                const cleanText = currentText.replace(/[\u200E\u200F]/g, '');
                selectedBusinessCardElement.text(`${RLM}${cleanText}`);
                updateDirectionButtons('rtl');
                businessCardDesignLayer.draw();
            }
        });
    }

    // Copy button
    if (copyButton) {
        copyButton.addEventListener('click', function () {
            if (selectedBusinessCardElement &&
                !selectedBusinessCardElement.isDestroyed &&
                selectedBusinessCardElement.getLayer()) {
                const clone = selectedBusinessCardElement.clone({
                    x: selectedBusinessCardElement.x() + 10,
                    y: selectedBusinessCardElement.y() + 10
                });
                businessCardDesignLayer.add(clone);
                businessCardTransformer.nodes([clone]);
                selectedBusinessCardElement = clone;
                businessCardDesignLayer.draw();
            }
        });
    }

    // Delete button
    if (deleteButton) {
        deleteButton.addEventListener('click', function () {
            if (selectedBusinessCardElement &&
                !selectedBusinessCardElement.isDestroyed &&
                selectedBusinessCardElement.getLayer()) {
                // Detach transformer first
                businessCardTransformer.nodes([]);
                // Remove element
                selectedBusinessCardElement.remove();
                selectedBusinessCardElement = null;
                businessCardDesignLayer.draw();

                // Hide the formatting panel
                const panel = document.getElementById('text-formatting-panel');
                if (panel) {
                    panel.classList.add('hidden');
                }
            }
        });
    }

    // Helper function to update alignment button states
    function updateAlignmentButtons(activeAlign) {
        [alignLeftButton, alignCenterButton, alignRightButton].forEach(btn => {
            if (btn) btn.classList.remove('bg-indigo-100');
        });

        if (activeAlign === 'left' && alignLeftButton) {
            alignLeftButton.classList.add('bg-indigo-100');
        } else if (activeAlign === 'center' && alignCenterButton) {
            alignCenterButton.classList.add('bg-indigo-100');
        } else if (activeAlign === 'right' && alignRightButton) {
            alignRightButton.classList.add('bg-indigo-100');
        }
    }

    // Helper function to update direction button states
    function updateDirectionButtons(activeDirection) {
        [directionLtrButton, directionRtlButton].forEach(btn => {
            if (btn) btn.classList.remove('bg-indigo-100');
        });

        if (activeDirection === 'ltr' && directionLtrButton) {
            directionLtrButton.classList.add('bg-indigo-100');
        } else if (activeDirection === 'rtl' && directionRtlButton) {
            directionRtlButton.classList.add('bg-indigo-100');
        }
    }

    // Update panel when element is selected
    businessCardStage.on('click tap', (e) => {
        const panel = document.getElementById('text-formatting-panel');
        if (!panel) return;

        // Check if an element from design layer is selected (not background)
        const isDesignElement = e.target.getLayer() === businessCardDesignLayer &&
            e.target !== businessCardTransformer;

        if (isDesignElement) {
            // Switch to design tab to show controls
            if (typeof switchBusinessCardTab === 'function') {
                switchBusinessCardTab('design');
            }

            // Show panel for any design element
            panel.classList.remove('hidden');

            // If it's a text element, update text-specific controls
            if (e.target.getClassName() === 'Text') {
                // Update values
                if (fontSizeSlider && fontSizeValue) {
                    fontSizeSlider.value = e.target.fontSize();
                    fontSizeValue.textContent = e.target.fontSize() + 'px';
                }
                if (fontFamilySelect) {
                    fontFamilySelect.value = e.target.fontFamily() || 'Inter';
                }

                // Update alignment buttons
                const currentAlign = e.target.align() || 'left';
                updateAlignmentButtons(currentAlign);

                // Detect current text direction
                const currentText = e.target.text();
                const hasLRM = currentText.includes('\u200E');
                const hasRLM = currentText.includes('\u200F');
                if (hasLRM) {
                    updateDirectionButtons('ltr');
                } else if (hasRLM) {
                    updateDirectionButtons('rtl');
                } else {
                    // Default: no direction button highlighted
                    updateDirectionButtons(null);
                }
            }
        } else {
            // Hide panel when not selecting design elements
            panel.classList.add('hidden');
        }
    });
}

// Update business card data from form inputs
function updateBusinessCardData() {
    console.log('Updating business card data...');

    // English data
    businessCardData.english = {
        shopName: document.getElementById('shop-name-en')?.value || '',
        tagline: document.getElementById('tagline-en')?.value || '',
        phone: document.getElementById('phone-en')?.value || '',
        email: document.getElementById('email-en')?.value || '',
        website: document.getElementById('website-en')?.value || '',
        services: businessCardData.english.services || []
    };

    // Arabic data
    businessCardData.arabic = {
        shopName: document.getElementById('shop-name-ar')?.value || '',
        tagline: document.getElementById('tagline-ar')?.value || '',
        phone: document.getElementById('phone-ar')?.value || '',
        email: document.getElementById('email-ar')?.value || '',
        website: document.getElementById('website-ar')?.value || '',
        services: businessCardData.arabic.services || []
    };

    // Design data - prioritize hex input over color picker
    businessCardData.design.backgroundColor = document.getElementById('bg-color-hex')?.value || document.getElementById('bg-color')?.value || '#1a1a1a';
    businessCardData.design.textColor = document.getElementById('text-color-hex')?.value || document.getElementById('text-color')?.value || '#ffffff';
    businessCardData.design.logoEmoji = document.getElementById('logo-emoji')?.value || '📱';
    businessCardData.design.qrLabel = document.getElementById('qr-label')?.value || 'SCAN ME';

    console.log('Business card data updated:', businessCardData);
    updateBusinessCardPreview();
}

// Update business card preview
function updateBusinessCardPreview() {
    if (!businessCardStage) return;

    console.log('Updating business card preview for side:', currentBusinessCardSide);
    console.log('Current data:', businessCardData);

    // Update background color
    const background = businessCardBackgroundLayer.findOne('Rect');
    if (background) {
        background.fill(businessCardData.design.backgroundColor);
        businessCardBackgroundLayer.draw();
    }

    // Recreate design
    createBusinessCardDesign(currentBusinessCardSide);
}

// Preview specific side
window.previewBusinessCard = function (side) {
    currentBusinessCardSide = side;
    updateBusinessCardPreview();

    // Update active button style
    document.querySelectorAll('[onclick*="previewBusinessCard"]').forEach(btn => {
        btn.classList.remove('bg-indigo-100', 'text-indigo-700');
        btn.classList.add('bg-gray-100', 'text-gray-700');
    });

    event.target.classList.remove('bg-gray-100', 'text-gray-700');
    event.target.classList.add('bg-indigo-100', 'text-indigo-700');
};

// Export business card
window.exportBusinessCard = function (side, quality = 4) {
    if (!businessCardStage) {
        showNotification('❌ لا يوجد تصميم للتصدير', 'error');
        return;
    }

    // Temporarily switch to the requested side
    const originalSide = currentBusinessCardSide;
    currentBusinessCardSide = side;

    // Wait for images to load before exporting
    setTimeout(() => {
        createBusinessCardDesign(side);

        // Wait a bit more for canvas to render
        setTimeout(() => {
            // Create ultra high-quality export for printing
            const dataURL = businessCardStage.toDataURL({
                mimeType: 'image/png',
                quality: 1.0,
                pixelRatio: quality,  // 4x resolution for print quality
                width: businessCardFormat.width * quality,
                height: businessCardFormat.height * quality
            });

            // Create download link
            const link = document.createElement('a');
            link.download = `business-card-${side}-${Date.now()}.png`;
            link.href = dataURL;
            link.click();

            // Switch back to original side
            currentBusinessCardSide = originalSide;
            createBusinessCardDesign(originalSide);

            showNotification(`✅ تم تصدير البطاقة (${side}) بجودة عالية`, 'success');
        }, 500);
    }, 200);
};

// Export both sides
window.exportBothBusinessCards = function (quality = 4) {
    if (!businessCardStage) {
        showNotification('❌ لا يوجد تصميم للتصدير', 'error');
        return;
    }

    showNotification('📤 جاري تصدير البطاقتين بجودة عالية...', 'info');

    // Export English side first
    exportBusinessCard('english', quality);

    // Export Arabic side after a delay
    setTimeout(() => {
        exportBusinessCard('arabic', quality);
        showNotification('✅ تم تصدير البطاقتين بجودة عالية بنجاح', 'success');
    }, 1500);
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('Business Card Tool: DOM loaded, checking for tool presence...');

    // Check if we're on the business card tool
    setTimeout(() => {
        const businessCardCanvas = document.getElementById('business-card-canvas');
        if (businessCardCanvas && !businessCardCanvasInitialized) {
            console.log('Business Card Tool: Canvas found, initializing...');
            // Wait for Konva to be available
            if (typeof Konva !== 'undefined') {
                initializeBusinessCardTool();
            } else {
                console.log('Business Card Tool: Waiting for Konva...');
                // Wait for Konva to load
                const checkKonva = setInterval(() => {
                    if (typeof Konva !== 'undefined') {
                        clearInterval(checkKonva);
                        initializeBusinessCardTool();
                    }
                }, 100);
            }
        }
    }, 500);
});

// Initialize when switching to business card tool
window.addEventListener('toolChanged', function (e) {
    console.log('Business Card Tool: Tool changed to', e.detail.tool);
    if (e.detail.tool === 'business-card') {
        setTimeout(() => {
            if (!businessCardCanvasInitialized) {
                console.log('Business Card Tool: Initializing after tool switch...');
                initializeBusinessCardTool();
            }
        }, 500);
    }
});

// Alternative initialization for when the tool content is loaded dynamically
window.initBusinessCardToolIfNeeded = function () {
    console.log('Business Card Tool: Manual initialization called...');
    const businessCardCanvas = document.getElementById('business-card-canvas');

    if (businessCardCanvas && !businessCardCanvasInitialized) {
        console.log('Business Card Tool: Canvas found, initializing...');
        if (typeof Konva !== 'undefined') {
            initializeBusinessCardTool();
        } else {
            console.log('Business Card Tool: Konva not available');
        }
    } else if (businessCardCanvas && businessCardCanvasInitialized) {
        // Tool already initialized, but refresh form fields and services
        console.log('Business Card Tool: Already initialized, refreshing data...');

        // Ensure the current tab is visible
        if (typeof switchBusinessCardTab === 'function') {
            // Default to english if no side selected, or use current
            const side = currentBusinessCardSide === 'english' || currentBusinessCardSide === 'arabic' ? currentBusinessCardSide : 'english';
            switchBusinessCardTab(side);
        }

        // Force stage resize in case container size changed
        if (businessCardStage) {
            const container = document.getElementById('business-card-canvas');
            if (container) {
                const containerWidth = container.clientWidth || 800;
                const maxDisplayWidth = Math.min(containerWidth - 40, 900);
                const aspectRatio = businessCardFormat.width / businessCardFormat.height;

                const displayWidth = maxDisplayWidth;
                const displayHeight = maxDisplayWidth / aspectRatio;

                businessCardStage.width(displayWidth);
                businessCardStage.height(displayHeight);
                businessCardStage.scale({
                    x: displayWidth / businessCardFormat.width,
                    y: displayHeight / businessCardFormat.height
                });
                businessCardStage.draw();
            }
        }

        populateFormFields();
    }
};

console.log('Enhanced Business Card Tool loaded successfully');