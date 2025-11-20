/**
 * Debug utilities for Marketing Tools Suite
 */

window.debugTools = {
    // Test if files are accessible
    async testFileAccess() {
        console.log('Skipping file access test - templates are inlined');
    },

    // Test tool loading
    async testToolLoading() {
        if (window.app) {
            console.log('Testing tool loading...');
            try {
                await window.app.loadTool('business-card');
                console.log('✅ Business card tool loaded successfully');
            } catch (error) {
                console.error('❌ Business card tool failed:', error);
            }
        } else {
            console.error('App not initialized yet');
        }
    },

    // Show debug info
    showInfo() {
        console.log('=== Debug Info ===');
        console.log('App:', window.app);
        console.log('Template Engine:', window.templateEngine);
        console.log('i18n:', window.i18n);
        console.log('Current Tool:', window.app?.currentTool);
        console.log('Tools Loaded:', Array.from(window.app?.toolsLoaded || []));
        console.log('Is Loading:', window.app?.isLoading);
    },

    // Test unified translation system
    testTranslations() {
        console.log('=== Translation System Test ===');
        if (!window.i18n) {
            console.error('❌ i18n system not available');
            return;
        }

        const testKeys = [
            'nav.home',
            'business_card.title',
            'business_card.tabs.english',
            'discount.store.name',
            'social_media.title'
        ];

        console.log('🔍 Testing English (en) translations:');
        window.i18n.setLanguage('en');
        testKeys.forEach(key => {
            const translation = window.i18n.t(key);
            console.log(`  ${key}: "${translation}"`);
        });

        console.log('🔍 Testing Arabic (ar) translations:');
        window.i18n.setLanguage('ar');
        testKeys.forEach(key => {
            const translation = window.i18n.t(key);
            console.log(`  ${key}: "${translation}"`);
        });

        console.log('✅ Translation test completed');
    },

    // Test template loading
    async testTemplateSystem() {
        console.log('=== Template System Test ===');

        // Wait for app to be available
        let attempts = 0;
        while (!window.app && attempts < 10) {
            console.log(`🔄 Waiting for app... (attempt ${attempts + 1})`);
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
        }

        if (!window.app) {
            console.error('❌ App not available after waiting');
            return;
        }

        console.log('✅ App found! Testing template loading...');

        const tools = ['business-card', 'discount-offer', 'social-media'];

        for (const tool of tools) {
            try {
                console.log(`🔄 Testing ${tool} template loading...`);
                await window.app.showTool(tool);
                console.log(`✅ ${tool} loaded successfully`);

                // Wait a moment
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`❌ ${tool} failed to load:`, error);
            }
        }

        // Return to home
        window.app.showHome();
        console.log('✅ Template system test completed');
    }
};

// Auto-run tests when loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.debugTools.testFileAccess();

        // Quick comprehensive system test
        if (window.i18n && window.app) {
            console.log('🧪 Running quick system test...');
            window.debugTools.testTranslations();
        }
    }, 1000);
});

// Add global test function
window.runFullTest = async function () {
    console.log('🧪 === FULL SYSTEM TEST ===');

    // Test 1: File access
    await window.debugTools.testFileAccess();

    // Test 2: Translation system
    window.debugTools.testTranslations();

    // Test 3: Template loading
    await window.debugTools.testTemplateSystem();

    console.log('✅ === FULL TEST COMPLETED ===');
};

// Quick status check
window.checkStatus = function () {
    console.log('📊 === SYSTEM STATUS ===');
    console.log('App available:', !!window.app);
    console.log('i18n available:', !!window.i18n);
    console.log('Template engine available:', !!window.templateEngine);
    console.log('Current language:', window.i18n?.getCurrentLanguage() || 'unknown');
    console.log('Current tool:', window.app?.currentTool || 'none');
    console.log('Tools loaded:', Array.from(window.app?.toolsLoaded || []));
    console.log('Is loading:', window.app?.isLoading || false);
    console.log('✅ Status check completed');
};