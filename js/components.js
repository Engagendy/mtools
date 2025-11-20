/**
 * Reusable Components for Marketing Tools Suite
 * Unified component library using template engine
 */

class ComponentLibrary {
    constructor(templateEngine) {
        this.engine = templateEngine;
        this.init();
    }

    init() {
        this.registerToolComponents();
        this.registerUIComponents();
        this.registerFormComponents();
    }

    /**
     * Register tool-specific components
     */
    registerToolComponents() {
        // Tool Card Component
        this.engine.registerComponent('toolCard', `
            <div class="tool-card bg-white rounded-2xl p-8 shadow-2xl hover-lift cursor-pointer animate-fade-in"
                 onclick="showTool('{{tool}}')" style="animation-delay: {{delay}}s">
                <div class="text-center">
                    <div class="w-16 h-16 bg-gradient-to-r {{gradient}} rounded-full flex items-center justify-center mx-auto mb-6">
                        <i class="{{icon}} text-white text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-4">{{title}}</h3>
                    <p class="text-gray-600 mb-6">{{description}}</p>
                    
                    <div class="space-y-2 mb-8">
                        {{#each features}}
                            <div class="flex items-center justify-center space-x-2 text-sm text-green-600">
                                <i class="fas fa-check"></i>
                                <span>{{this}}</span>
                            </div>
                        {{/each}}
                    </div>
                    
                    <button class="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300">
                        {{buttonText}}
                    </button>
                </div>
            </div>
        `);

        // Tool Navigation Component
        this.engine.registerComponent('toolNav', `
            <nav class="glass-morphism fixed top-0 left-0 right-0 z-50 shadow-xl">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center h-16">
                        <button onclick="showHome()" class="flex items-center space-x-2 text-primary-600 hover:text-primary-800 transition-colors">
                            <i class="fas fa-tools text-xl"></i>
                            <span class="font-bold text-lg hidden sm:block">Marketing Tools</span>
                        </button>
                        
                        <div class="hidden md:flex space-x-8">
                            {{#each navItems}}
                                <button onclick="{{#if action}}{{action}}{{else}}showTool('{{tool}}'){{/if}}" 
                                        class="nav-link {{#if active}}active{{/if}}" data-tool="{{tool}}">
                                    <i class="{{icon}}"></i>
                                    <span>{{text}}</span>
                                </button>
                            {{/each}}
                        </div>
                        
                        <button class="md:hidden text-gray-600" id="mobile-menu-btn">
                            <i class="fas fa-bars text-xl"></i>
                        </button>
                    </div>
                </div>
            </nav>
        `);

        // Tool Header Component
        this.engine.registerComponent('toolHeader', `
            <div class="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-8">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button onclick="showHome()" class="mb-4 bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg inline-flex items-center space-x-2 transition-colors">
                        <i class="fas fa-arrow-left"></i>
                        <span>Back to Tools</span>
                    </button>
                    <h1 class="text-3xl sm:text-4xl font-bold mb-2">{{title}}</h1>
                    <p class="text-white/90 text-lg">{{subtitle}}</p>
                </div>
            </div>
        `);
    }

    /**
     * Register UI components
     */
    registerUIComponents() {
        // Section Component
        this.engine.registerComponent('section', `
            <section class="{{#if class}}{{class}}{{else}}py-8{{/if}}">
                {{#if title}}
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">{{title}}</h2>
                        {{#if subtitle}}
                            <p class="text-gray-600">{{subtitle}}</p>
                        {{/if}}
                    </div>
                {{/if}}
                <div class="{{#if containerClass}}{{containerClass}}{{else}}max-w-7xl mx-auto px-4 sm:px-6 lg:px-8{{/if}}">
                    {{content}}
                </div>
            </section>
        `);

        // Grid Component
        this.engine.registerComponent('grid', `
            <div class="grid {{#if cols}}grid-cols-{{cols}}{{else}}grid-cols-1 md:grid-cols-2 lg:grid-cols-3{{/if}} {{#if gap}}gap-{{gap}}{{else}}gap-6{{/if}}">
                {{content}}
            </div>
        `);

        // Modal Component
        this.engine.registerComponent('modal', `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 {{#unless show}}hidden{{/unless}}" id="{{id}}">
                <div class="bg-white rounded-lg max-w-{{#if size}}{{size}}{{else}}md{{/if}} w-full mx-4 max-h-screen overflow-auto">
                    {{#if title}}
                        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 class="text-lg font-semibold text-gray-800">{{title}}</h3>
                            <button onclick="this.closest('.modal').classList.add('hidden')" class="text-gray-400 hover:text-gray-600">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    {{/if}}
                    <div class="px-6 py-4">
                        {{content}}
                    </div>
                    {{#if footer}}
                        <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-2">
                            {{footer}}
                        </div>
                    {{/if}}
                </div>
            </div>
        `);

        // Tabs Component
        this.engine.registerComponent('tabs', `
            <div class="tabs-container" data-tabs="{{id}}">
                <div class="border-b border-gray-200">
                    <nav class="flex space-x-8">
                        {{#each tabs}}
                            <button class="tab-button py-2 px-1 border-b-2 font-medium text-sm {{#if active}}border-primary-500 text-primary-600{{else}}border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300{{/if}}"
                                    data-tab="{{id}}" onclick="switchTab('{{../id}}', '{{id}}')">
                                {{#if icon}}<i class="{{icon}} mr-2"></i>{{/if}}
                                {{title}}
                            </button>
                        {{/each}}
                    </nav>
                </div>
                <div class="tab-content mt-6">
                    {{#each tabs}}
                        <div class="tab-panel {{#unless active}}hidden{{/unless}}" data-panel="{{id}}">
                            {{content}}
                        </div>
                    {{/each}}
                </div>
            </div>
        `);

        // Accordion Component
        this.engine.registerComponent('accordion', `
            <div class="accordion space-y-2" data-accordion="{{id}}">
                {{#each items}}
                    <div class="accordion-item border border-gray-200 rounded-lg">
                        <button class="accordion-header w-full px-4 py-3 text-left font-medium text-gray-800 hover:bg-gray-50 focus:outline-none flex justify-between items-center"
                                onclick="toggleAccordion('{{../id}}', {{@index}})">
                            <span>{{title}}</span>
                            <i class="fas fa-chevron-down transition-transform duration-200"></i>
                        </button>
                        <div class="accordion-content hidden px-4 py-3 border-t border-gray-200">
                            {{content}}
                        </div>
                    </div>
                {{/each}}
            </div>
        `);
    }

    /**
     * Register form components
     */
    registerFormComponents() {
        // Form Group Component
        this.engine.registerComponent('formGroup', `
            <div class="form-group mb-4">
                {{#if label}}
                    <label class="block text-sm font-medium text-gray-700 mb-2" {{#if for}}for="{{for}}"{{/if}}>
                        {{label}}
                        {{#if required}}<span class="text-red-500">*</span>{{/if}}
                    </label>
                {{/if}}
                {{content}}
                {{#if help}}
                    <small class="text-gray-500 text-xs mt-1 block">{{help}}</small>
                {{/if}}
                {{#if error}}
                    <div class="text-red-500 text-xs mt-1">{{error}}</div>
                {{/if}}
            </div>
        `);

        // Input Field Component
        this.engine.registerComponent('inputField', `
            {{> formGroup label=label required=required help=help error=error for=id content=(concat 
                '<input type="' (or type 'text') '" '
                'class="' (or class 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500') '" '
                (if placeholder 'placeholder="' placeholder '"' '')
                (if value 'value="' value '"' '')
                (if id 'id="' id '"' '')
                (if name 'name="' name '"' '')
                (if required 'required' '')
                (if disabled 'disabled' '')
                (if readonly 'readonly' '')
                '>'
            )}}
        `);

        // Textarea Component
        this.engine.registerComponent('textareaField', `
            {{> formGroup label=label required=required help=help error=error for=id content=(concat
                '<textarea '
                'class="' (or class 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500') '" '
                (if placeholder 'placeholder="' placeholder '"' '')
                (if id 'id="' id '"' '')
                (if name 'name="' name '"' '')
                (if rows 'rows="' rows '"' 'rows="4"')
                (if required 'required' '')
                (if disabled 'disabled' '')
                (if readonly 'readonly' '')
                '>' (or value '') '</textarea>'
            )}}
        `);

        // Select Component
        this.engine.registerComponent('selectField', `
            {{> formGroup label=label required=required help=help error=error for=id content=(concat
                '<select '
                'class="' (or class 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500') '" '
                (if id 'id="' id '"' '')
                (if name 'name="' name '"' '')
                (if required 'required' '')
                (if disabled 'disabled' '')
                '>'
                (if placeholder '<option value="">' placeholder '</option>' '')
                (join options)
                '</select>'
            )}}
        `);

        // Color Picker Component
        this.engine.registerComponent('colorPicker', `
            <div class="color-picker flex items-center space-x-3">
                {{#if label}}
                    <label class="text-sm font-medium text-gray-700">{{label}}</label>
                {{/if}}
                <input type="color" 
                       class="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                       {{#if value}}value="{{value}}"{{/if}}
                       {{#if id}}id="{{id}}"{{/if}}
                       {{#if name}}name="{{name}}"{{/if}}
                       {{#if onchange}}onchange="{{onchange}}"{{/if}}>
                {{#if showHex}}
                    <input type="text" 
                           class="w-24 px-2 py-1 text-xs border border-gray-300 rounded"
                           {{#if value}}value="{{value}}"{{/if}}
                           placeholder="#000000">
                {{/if}}
            </div>
        `);

        // Range Slider Component
        this.engine.registerComponent('rangeSlider', `
            <div class="range-slider">
                {{#if label}}
                    <label class="block text-sm font-medium text-gray-700 mb-2">{{label}}</label>
                {{/if}}
                <div class="flex items-center space-x-3">
                    <input type="range" 
                           class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                           {{#if min}}min="{{min}}"{{/if}}
                           {{#if max}}max="{{max}}"{{/if}}
                           {{#if step}}step="{{step}}"{{/if}}
                           {{#if value}}value="{{value}}"{{/if}}
                           {{#if id}}id="{{id}}"{{/if}}
                           {{#if name}}name="{{name}}"{{/if}}
                           {{#if oninput}}oninput="{{oninput}}"{{/if}}>
                    {{#if showValue}}
                        <span class="text-sm text-gray-600 min-w-12" id="{{id}}-value">{{value}}</span>
                    {{/if}}
                    {{#if unit}}
                        <span class="text-sm text-gray-600">{{unit}}</span>
                    {{/if}}
                </div>
            </div>
        `);

        // File Upload Component
        this.engine.registerComponent('fileUpload', `
            <div class="file-upload">
                {{#if label}}
                    <label class="block text-sm font-medium text-gray-700 mb-2">{{label}}</label>
                {{/if}}
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                    <i class="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-3"></i>
                    <p class="text-gray-600 mb-2">{{#if placeholder}}{{placeholder}}{{else}}Drop files here or click to browse{{/if}}</p>
                    <input type="file" 
                           class="hidden"
                           {{#if accept}}accept="{{accept}}"{{/if}}
                           {{#if multiple}}multiple{{/if}}
                           {{#if id}}id="{{id}}"{{/if}}
                           {{#if name}}name="{{name}}"{{/if}}
                           {{#if onchange}}onchange="{{onchange}}"{{/if}}>
                    <button type="button" class="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 transition-colors"
                            onclick="this.parentElement.querySelector('input').click()">
                        Choose Files
                    </button>
                </div>
                {{#if help}}
                    <small class="text-gray-500 text-xs mt-2 block">{{help}}</small>
                {{/if}}
            </div>
        `);
    }

    /**
     * Register component helper functions
     */
    registerHelpers() {
        // Concat helper for building strings
        this.engine.registerHelper('concat', (...args) => {
            return args.slice(0, -1).join('');
        });

        // Join array helper
        this.engine.registerHelper('join', (array, separator = '') => {
            return Array.isArray(array) ? array.join(separator) : '';
        });

        // If helper
        this.engine.registerHelper('if', (condition, truthyValue, falsyValue = '') => {
            return condition ? truthyValue : falsyValue;
        });

        // Or helper for default values
        this.engine.registerHelper('or', (...args) => {
            const values = args.slice(0, -1);
            return values.find(val => val !== undefined && val !== null && val !== '') || '';
        });
    }

    /**
     * Get component template
     */
    getComponent(name) {
        return this.engine.components.get(name);
    }

    /**
     * Render component with data
     */
    renderComponent(name, data = {}) {
        return this.engine.renderTemplate(name, data);
    }
}

// Global utility functions for UI interactions
window.switchTab = (containerId, tabId) => {
    const container = document.querySelector(`[data-tabs="${containerId}"]`);
    if (!container) return;

    // Update tab buttons
    container.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('border-primary-500', 'text-primary-600');
        btn.classList.add('border-transparent', 'text-gray-500');
    });
    
    const activeTab = container.querySelector(`[data-tab="${tabId}"]`);
    if (activeTab) {
        activeTab.classList.remove('border-transparent', 'text-gray-500');
        activeTab.classList.add('border-primary-500', 'text-primary-600');
    }

    // Update tab panels
    container.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.add('hidden');
    });
    
    const activePanel = container.querySelector(`[data-panel="${tabId}"]`);
    if (activePanel) {
        activePanel.classList.remove('hidden');
    }
};

window.toggleAccordion = (containerId, index) => {
    const container = document.querySelector(`[data-accordion="${containerId}"]`);
    if (!container) return;

    const items = container.querySelectorAll('.accordion-item');
    const item = items[index];
    if (!item) return;

    const content = item.querySelector('.accordion-content');
    const icon = item.querySelector('.accordion-header i');

    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
    } else {
        content.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
    }
};

// Initialize component library
window.addEventListener('DOMContentLoaded', () => {
    if (window.templateEngine) {
        window.componentLibrary = new ComponentLibrary(window.templateEngine);
    }
});

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComponentLibrary;
}