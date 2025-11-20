/**
 * Unified Notification System for Marketing Tools Suite
 * Uses SweetAlert2 for consistent toast notifications across all tools
 */

(function () {
    'use strict';

    /**
     * Show a notification toast
     * @param {string} message - The message to display
     * @param {string} type - Type of notification: 'success', 'error', 'warning', 'info'
     * @param {number} duration - Duration in milliseconds (default: 3000)
     */
    function showNotification(message, type = 'success', duration = 3000) {
        // Check if SweetAlert2 is available
        if (typeof Swal === 'undefined') {
            console.warn('SweetAlert2 not loaded, falling back to console');
            console.log(`[${type.toUpperCase()}] ${message}`);
            return;
        }

        // Map type to SweetAlert2 icon
        const iconMap = {
            'success': 'success',
            'error': 'error',
            'warning': 'warning',
            'info': 'info'
        };

        const icon = iconMap[type] || 'info';

        // Create toast notification
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: duration,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
            customClass: {
                popup: 'colored-toast'
            }
        });

        Toast.fire({
            icon: icon,
            title: message
        });
    }

    /**
     * Show a confirmation dialog
     * @param {string} title - Dialog title
     * @param {string} text - Dialog text
     * @param {string} confirmButtonText - Confirm button text (default: 'Yes')
     * @param {string} cancelButtonText - Cancel button text (default: 'No')
     * @returns {Promise<boolean>} - True if confirmed, false if cancelled
     */
    async function showConfirmation(title, text, confirmButtonText = 'Yes', cancelButtonText = 'No') {
        if (typeof Swal === 'undefined') {
            return confirm(`${title}\n\n${text}`);
        }

        const result = await Swal.fire({
            title: title,
            text: text,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText
        });

        return result.isConfirmed;
    }

    /**
     * Show a loading notification
     * @param {string} message - Loading message
     */
    function showLoading(message = 'Loading...') {
        if (typeof Swal === 'undefined') {
            console.log(`[LOADING] ${message}`);
            return;
        }

        Swal.fire({
            title: message,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    }

    /**
     * Close any open notification
     */
    function closeNotification() {
        if (typeof Swal !== 'undefined') {
            Swal.close();
        }
    }

    // Export to window
    window.showNotification = showNotification;
    window.showConfirmation = showConfirmation;
    window.showLoading = showLoading;
    window.closeNotification = closeNotification;

    // Also create a namespace for better organization
    window.Notifications = {
        show: showNotification,
        confirm: showConfirmation,
        loading: showLoading,
        close: closeNotification
    };

    console.log('✅ Unified notification system loaded');
})();
