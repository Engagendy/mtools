// QR Code Generator Tool
let currentQRType = 'url';
let generatedQRCodes = [];
let qrSettings = {
    size: 256,
    foregroundColor: '#000000',
    backgroundColor: '#ffffff'
};

// Tab switching
window.switchQRTab = function (tabName) {
    console.log('Switching to QR tab:', tabName);

    // Hide all tab contents
    document.querySelectorAll('.qr-tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Remove active from all tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active', 'bg-white', 'text-gray-900', 'shadow-sm');
        btn.classList.add('text-gray-600');
    });

    // Show selected tab content
    const tabContent = document.getElementById(`qr-tab-${tabName}`);
    if (tabContent) {
        tabContent.classList.add('active');
    }

    // Highlight active button
    if (event && event.target) {
        const button = event.target.closest('.tab-button');
        if (button) {
            button.classList.add('active', 'bg-white', 'text-gray-900', 'shadow-sm');
            button.classList.remove('text-gray-600');
        }
    }
};

// QR Type selection
window.selectQRType = function (type) {
    currentQRType = type;

    // Update button states
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const selectedBtn = document.getElementById(`type-${type}`);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }

    // Show/hide appropriate input groups
    document.getElementById('url-input-group').style.display = type === 'url' ? 'block' : 'none';
    document.getElementById('whatsapp-input-group').style.display = type === 'whatsapp' ? 'block' : 'none';
    document.getElementById('text-input-group').style.display = type === 'text' ? 'block' : 'none';
};

// Generate QR Code
window.generateQRCode = function () {
    let qrData = '';
    let label = '';

    // Get data based on type
    if (currentQRType === 'url') {
        const url = document.getElementById('qr-url').value.trim();
        if (!url) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing URL',
                text: 'Please enter a website URL',
                confirmButtonColor: '#9333ea'
            });
            return;
        }
        qrData = url;
        label = 'Website URL';
    } else if (currentQRType === 'whatsapp') {
        const number = document.getElementById('qr-whatsapp-number').value.trim();
        if (!number) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Number',
                text: 'Please enter a WhatsApp number',
                confirmButtonColor: '#9333ea'
            });
            return;
        }
        const message = document.getElementById('qr-whatsapp-message').value.trim();
        // Clean phone number (remove spaces, dashes, etc.)
        const cleanNumber = number.replace(/[^0-9+]/g, '');
        qrData = `https://wa.me/${cleanNumber}${message ? '?text=' + encodeURIComponent(message) : ''}`;
        label = 'WhatsApp Link';
    } else if (currentQRType === 'text') {
        const text = document.getElementById('qr-text').value.trim();
        if (!text) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Text',
                text: 'Please enter some text',
                confirmButtonColor: '#9333ea'
            });
            return;
        }
        qrData = text;
        label = 'Plain Text';
    }

    // Create QR code
    createQRCode(qrData, label);

    // Show success message
    Swal.fire({
        icon: 'success',
        title: 'QR Code Generated!',
        text: 'Your QR code has been created successfully',
        timer: 2000,
        showConfirmButton: false
    });
};

// Create and display QR code
function createQRCode(data, label) {
    const qrId = 'qr-' + Date.now();
    const container = document.getElementById('qr-preview-container');

    // Clear empty state if this is first QR
    if (generatedQRCodes.length === 0) {
        container.innerHTML = '<div class="qr-display-grid"></div>';
    }

    const grid = container.querySelector('.qr-display-grid');

    // Create QR card
    const qrCard = document.createElement('div');
    qrCard.className = 'qr-card';
    qrCard.id = qrId;

    const qrCanvas = document.createElement('div');
    qrCanvas.className = 'qr-canvas';
    qrCard.appendChild(qrCanvas);

    const qrLabel = document.createElement('div');
    qrLabel.className = 'qr-label';
    qrLabel.textContent = label;
    qrCard.appendChild(qrLabel);

    grid.appendChild(qrCard);

    // Generate QR code using QRCode.js
    try {
        const qrcode = new QRCode(qrCanvas, {
            text: data,
            width: qrSettings.size,
            height: qrSettings.size,
            colorDark: qrSettings.foregroundColor,
            colorLight: qrSettings.backgroundColor,
            correctLevel: QRCode.CorrectLevel.H
        });

        // Store QR code info
        generatedQRCodes.push({
            id: qrId,
            data: data,
            label: label,
            qrcode: qrcode
        });

        // Update export buttons
        updateExportButtons();
    } catch (error) {
        console.error('Error generating QR code:', error);
        Swal.fire({
            icon: 'error',
            title: 'Generation Failed',
            text: 'Failed to generate QR code. Please try again.',
            confirmButtonColor: '#9333ea'
        });
    }
}

// Update export buttons
function updateExportButtons() {
    const exportContainer = document.getElementById('export-buttons');
    exportContainer.innerHTML = '';

    if (generatedQRCodes.length === 0) {
        exportContainer.innerHTML = '<p style="color: #9ca3af; text-align: center;">No QR codes generated yet</p>';
        return;
    }

    // Add individual export buttons
    generatedQRCodes.forEach((qr, index) => {
        const btn = document.createElement('button');
        btn.className = 'btn-success';
        btn.innerHTML = `<i class="fas fa-download"></i> Download ${qr.label}`;
        btn.onclick = () => downloadQRCode(qr.id, qr.label);
        exportContainer.appendChild(btn);
    });

    // Add "Download All" button if more than one QR code
    if (generatedQRCodes.length > 1) {
        const downloadAllBtn = document.createElement('button');
        downloadAllBtn.className = 'btn-success';
        downloadAllBtn.innerHTML = '<i class="fas fa-download"></i> <span data-i18n="qr_generator.export.download_all">Download All QR Codes</span>';
        downloadAllBtn.onclick = downloadAllQRCodes;
        downloadAllBtn.style.background = '#9333ea';
        exportContainer.appendChild(downloadAllBtn);
    }
}

// Download single QR code as PNG
function downloadQRCode(qrId, label) {
    const qrCard = document.getElementById(qrId);
    if (!qrCard) return;

    const canvas = qrCard.querySelector('canvas');
    if (!canvas) return;

    try {
        // Convert canvas to blob and download
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `qr-code-${label.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.png`;
            link.click();
            URL.revokeObjectURL(url);

            Swal.fire({
                icon: 'success',
                title: 'Downloaded!',
                text: 'QR code has been downloaded',
                timer: 1500,
                showConfirmButton: false
            });
        });
    } catch (error) {
        console.error('Error downloading QR code:', error);
        Swal.fire({
            icon: 'error',
            title: 'Download Failed',
            text: 'Failed to download QR code. Please try again.',
            confirmButtonColor: '#9333ea'
        });
    }
}

// Download all QR codes as separate PNG files
function downloadAllQRCodes() {
    let downloaded = 0;

    generatedQRCodes.forEach((qr, index) => {
        setTimeout(() => {
            downloadQRCode(qr.id, qr.label);
            downloaded++;

            if (downloaded === generatedQRCodes.length) {
                Swal.fire({
                    icon: 'success',
                    title: 'All Downloaded!',
                    text: `${downloaded} QR codes have been downloaded`,
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        }, index * 500); // Delay between downloads
    });
}

// Setup form handlers
function setupQRFormHandlers() {
    // Size slider
    const sizeSlider = document.getElementById('qr-size');
    const sizeValue = document.getElementById('qr-size-value');
    if (sizeSlider && sizeValue) {
        sizeSlider.addEventListener('input', (e) => {
            qrSettings.size = parseInt(e.target.value);
            sizeValue.textContent = qrSettings.size + 'px';
        });
    }

    // Color pickers
    const fgColorPicker = document.getElementById('qr-fg-color');
    const bgColorPicker = document.getElementById('qr-bg-color');

    if (fgColorPicker) {
        fgColorPicker.addEventListener('change', (e) => {
            qrSettings.foregroundColor = e.target.value;
        });
    }

    if (bgColorPicker) {
        bgColorPicker.addEventListener('change', (e) => {
            qrSettings.backgroundColor = e.target.value;
        });
    }

    // Enter key to generate
    const inputs = ['qr-url', 'qr-whatsapp-number', 'qr-text'];
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    generateQRCode();
                }
            });
        }
    });
}

// Initialize QR Generator
function initializeQRGenerator() {
    console.log('QR Generator: Initializing...');

    // Setup form handlers
    setupQRFormHandlers();

    // Apply i18n translations if available
    if (typeof window.i18n !== 'undefined' && window.i18n.updatePageText) {
        setTimeout(() => {
            window.i18n.updatePageText();
            console.log('QR Generator: i18n applied');
        }, 100);
    }

    console.log('QR Generator: Initialized successfully');
}

// Initialize on DOM load OR immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeQRGenerator);
} else {
    // DOM is already loaded, initialize immediately
    initializeQRGenerator();
}

// Also expose initialization function globally for manual initialization
window.initializeQRGenerator = initializeQRGenerator;

// Handle language changes
window.addEventListener('languageChanged', () => {
    if (typeof window.i18n !== 'undefined' && window.i18n.updatePageText) {
        setTimeout(() => {
            window.i18n.updatePageText();
        }, 50);
    }
});
