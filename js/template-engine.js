/**
 * Lightweight Template Engine for Marketing Tools Suite
 * Pure JavaScript templating system - no build process required
 */

class TemplateEngine {
    constructor() {
        this.templates = new Map();
        this.components = new Map();
        this.globalData = {};
        this.helpers = new Map();
        
        this.init();
    }

    /**
     * Initialize template engine
     */
    init() {
        this.registerDefaultHelpers();
        this.registerDefaultComponents();
    }

    /**
     * Register a template
     */
    registerTemplate(name, template) {
        this.templates.set(name, template);
    }

    /**
     * Register a component
     */
    registerComponent(name, component) {
        this.components.set(name, component);
    }

    /**
     * Register a template helper
     */
    registerHelper(name, helper) {
        this.helpers.set(name, helper);
    }

    /**
     * Set global data available to all templates
     */
    setGlobalData(data) {
        this.globalData = { ...this.globalData, ...data };
    }

    /**
     * Render a template with data
     */
    render(template, data = {}) {
        const mergedData = { ...this.globalData, ...data };
        
        try {
            // Process template string
            let processed = this.processTemplate(template, mergedData);
            
            // Process components
            processed = this.processComponents(processed, mergedData);
            
            // Process helpers
            processed = this.processHelpers(processed, mergedData);
            
            return processed;
        } catch (error) {
            console.error('Template rendering error:', error);
            return `<div class="error">Template Error: ${error.message}</div>`;
        }
    }

    /**
     * Process template variables and expressions
     */
    processTemplate(template, data) {
        // Handle variable interpolation {{ variable }}
        template = template.replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
            try {
                return this.evaluateExpression(expression.trim(), data) || '';
            } catch (error) {
                console.warn(`Template variable error: ${expression}`, error);
                return '';
            }
        });

        // Handle conditional blocks {{#if condition}}...{{/if}}
        template = template.replace(/\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, content) => {
            try {
                const result = this.evaluateExpression(condition.trim(), data);
                return result ? this.processTemplate(content, data) : '';
            } catch (error) {
                console.warn(`Template condition error: ${condition}`, error);
                return '';
            }
        });

        // Handle else blocks {{#if condition}}...{{else}}...{{/if}}
        template = template.replace(/\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{else\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, ifContent, elseContent) => {
            try {
                const result = this.evaluateExpression(condition.trim(), data);
                return result ? this.processTemplate(ifContent, data) : this.processTemplate(elseContent, data);
            } catch (error) {
                console.warn(`Template condition error: ${condition}`, error);
                return '';
            }
        });

        // Handle loops {{#each array}}...{{/each}}
        template = template.replace(/\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, arrayPath, content) => {
            try {
                const array = this.getNestedProperty(data, arrayPath.trim());
                if (!Array.isArray(array)) return '';
                
                return array.map((item, index) => {
                    const itemData = { 
                        ...data, 
                        this: item, 
                        '@index': index, 
                        '@first': index === 0, 
                        '@last': index === array.length - 1 
                    };
                    return this.processTemplate(content, itemData);
                }).join('');
            } catch (error) {
                console.warn(`Template loop error: ${arrayPath}`, error);
                return '';
            }
        });

        return template;
    }

    /**
     * Process component includes {{> componentName data}}
     */
    processComponents(template, data) {
        return template.replace(/\{\{>\s*(\w+)(?:\s+([^}]+))?\}\}/g, (match, componentName, params) => {
            const component = this.components.get(componentName);
            if (!component) {
                console.warn(`Component "${componentName}" not found`);
                return match;
            }

            // Parse parameters
            let componentData = { ...data };
            if (params) {
                try {
                    const paramData = this.parseParameters(params, data);
                    componentData = { ...componentData, ...paramData };
                } catch (error) {
                    console.error('Error parsing component parameters:', error);
                }
            }

            return this.render(component, componentData);
        });
    }

    /**
     * Process template helpers {{helperName params}}
     */
    processHelpers(template, data) {
        return template.replace(/\{\{(\w+)\s+([^}]+)\}\}/g, (match, helperName, params) => {
            const helper = this.helpers.get(helperName);
            if (!helper) return match;

            try {
                const args = this.parseHelperParameters(params, data);
                return helper(...args);
            } catch (error) {
                console.error(`Error in helper "${helperName}":`, error);
                return match;
            }
        });
    }

    /**
     * Evaluate JavaScript expressions safely
     */
    evaluateExpression(expression, data) {
        try {
            // Simple variable access
            if (/^[\w.@]+$/.test(expression)) {
                return this.getNestedProperty(data, expression);
            }

            // More complex expressions - create safe evaluation context
            const context = this.createSafeContext(data);
            const func = new Function(...Object.keys(context), `return ${expression}`);
            return func(...Object.values(context));
        } catch (error) {
            console.warn(`Error evaluating expression "${expression}":`, error);
            return '';
        }
    }

    /**
     * Get nested property safely
     */
    getNestedProperty(obj, path) {
        if (path === 'this') return obj.this || obj;
        if (path.startsWith('@')) return obj[path];
        
        return path.split('.').reduce((current, prop) => {
            return current && current[prop] !== undefined ? current[prop] : undefined;
        }, obj);
    }

    /**
     * Create safe evaluation context
     */
    createSafeContext(data) {
        // Create a safe context with common utilities
        return {
            ...data,
            Math: Math,
            String: String,
            Number: Number,
            Boolean: Boolean,
            Array: Array,
            Object: Object,
            Date: Date,
            JSON: JSON
        };
    }

    /**
     * Parse component parameters
     */
    parseParameters(params, data) {
        const result = {};
        
        // Simple key=value parsing
        const pairs = params.match(/(\w+)=("[^"]*"|'[^']*'|\S+)/g);
        if (pairs) {
            pairs.forEach(pair => {
                const [key, value] = pair.split('=');
                result[key] = this.parseValue(value, data);
            });
        }

        return result;
    }

    /**
     * Parse helper parameters
     */
    parseHelperParameters(params, data) {
        // Split by spaces, respecting quotes
        const args = [];
        const regex = /("([^"\\]|\\.)*"|'([^'\\]|\\.)*'|\S+)/g;
        let match;
        
        while ((match = regex.exec(params)) !== null) {
            args.push(this.parseValue(match[1], data));
        }
        
        return args;
    }

    /**
     * Parse individual values
     */
    parseValue(value, data) {
        // Remove quotes
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            return value.slice(1, -1);
        }
        
        // Number
        if (/^\d+(\.\d+)?$/.test(value)) {
            return parseFloat(value);
        }
        
        // Boolean
        if (value === 'true') return true;
        if (value === 'false') return false;
        if (value === 'null') return null;
        if (value === 'undefined') return undefined;
        
        // Variable reference
        return this.getNestedProperty(data, value);
    }

    /**
     * Register default helpers
     */
    registerDefaultHelpers() {
        // Equality helper
        this.registerHelper('eq', (a, b) => a === b);
        
        // Inequality helper
        this.registerHelper('ne', (a, b) => a !== b);
        
        // Greater than helper
        this.registerHelper('gt', (a, b) => a > b);
        
        // Less than helper
        this.registerHelper('lt', (a, b) => a < b);
        
        // Logical AND
        this.registerHelper('and', (...args) => args.slice(0, -1).every(Boolean));
        
        // Logical OR
        this.registerHelper('or', (...args) => args.slice(0, -1).some(Boolean));
        
        // String formatting
        this.registerHelper('format', (template, ...args) => {
            return template.replace(/\{(\d+)\}/g, (match, index) => {
                return args[index] !== undefined ? args[index] : match;
            });
        });
        
        // Date formatting
        this.registerHelper('formatDate', (date, format = 'YYYY-MM-DD') => {
            if (!date) return '';
            const d = new Date(date);
            if (isNaN(d.getTime())) return date;
            
            return format
                .replace('YYYY', d.getFullYear())
                .replace('MM', String(d.getMonth() + 1).padStart(2, '0'))
                .replace('DD', String(d.getDate()).padStart(2, '0'));
        });
        
        // JSON stringify
        this.registerHelper('json', (obj) => JSON.stringify(obj));
        
        // Uppercase
        this.registerHelper('upper', (str) => String(str).toUpperCase());
        
        // Lowercase
        this.registerHelper('lower', (str) => String(str).toLowerCase());
        
        // Capitalize
        this.registerHelper('capitalize', (str) => {
            const s = String(str);
            return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
        });
    }

    /**
     * Register default components
     */
    registerDefaultComponents() {
        // Button component
        this.registerComponent('button', `
            <button class="{{#if class}}{{class}}{{else}}btn btn-primary{{/if}}" 
                    {{#if onclick}}onclick="{{onclick}}"{{/if}}
                    {{#if disabled}}disabled{{/if}}>
                {{#if icon}}<i class="{{icon}}"></i>{{/if}}
                {{text}}
            </button>
        `);

        // Card component
        this.registerComponent('card', `
            <div class="{{#if class}}{{class}}{{else}}bg-white rounded-lg shadow-md p-6{{/if}}">
                {{#if title}}
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">{{title}}</h3>
                {{/if}}
                {{content}}
            </div>
        `);

        // Input component
        this.registerComponent('input', `
            <div class="form-group">
                {{#if label}}
                    <label class="block text-sm font-medium text-gray-700 mb-2">{{label}}</label>
                {{/if}}
                <input type="{{#if type}}{{type}}{{else}}text{{/if}}" 
                       class="{{#if class}}{{class}}{{else}}w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500{{/if}}"
                       {{#if placeholder}}placeholder="{{placeholder}}"{{/if}}
                       {{#if value}}value="{{value}}"{{/if}}
                       {{#if id}}id="{{id}}"{{/if}}
                       {{#if name}}name="{{name}}"{{/if}}
                       {{#if required}}required{{/if}}
                       {{#if disabled}}disabled{{/if}}>
                {{#if help}}
                    <small class="text-gray-500 text-xs mt-1 block">{{help}}</small>
                {{/if}}
            </div>
        `);

        // Alert component
        this.registerComponent('alert', `
            <div class="{{#if type}}alert-{{type}}{{else}}alert-info{{/if}} p-4 rounded-md mb-4">
                {{#if icon}}<i class="{{icon}} mr-2"></i>{{/if}}
                {{message}}
                {{#if dismissible}}
                    <button class="ml-auto" onclick="this.parentElement.style.display='none'">
                        <i class="fas fa-times"></i>
                    </button>
                {{/if}}
            </div>
        `);

        // Loading component
        this.registerComponent('loading', `
            <div class="flex items-center justify-center {{#if class}}{{class}}{{else}}py-8{{/if}}">
                <div class="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
                {{#if text}}
                    <span class="ml-3 text-gray-600">{{text}}</span>
                {{/if}}
            </div>
        `);
    }

    /**
     * Load template from URL
     */
    async loadTemplate(name, url) {
        try {
            const response = await fetch(url);
            const template = await response.text();
            this.registerTemplate(name, template);
            return template;
        } catch (error) {
            console.error(`Error loading template from ${url}:`, error);
            throw error;
        }
    }

    /**
     * Load template from DOM element
     */
    loadTemplateFromDOM(name, selector) {
        const element = document.querySelector(selector);
        if (!element) {
            throw new Error(`Template element "${selector}" not found`);
        }
        
        const template = element.innerHTML;
        this.registerTemplate(name, template);
        return template;
    }

    /**
     * Render template by name
     */
    renderTemplate(name, data = {}) {
        const template = this.templates.get(name);
        if (!template) {
            throw new Error(`Template "${name}" not found`);
        }
        return this.render(template, data);
    }

    /**
     * Render to DOM element
     */
    renderToElement(template, data, selector) {
        const element = document.querySelector(selector);
        if (!element) {
            throw new Error(`Element "${selector}" not found`);
        }
        
        const html = this.render(template, data);
        element.innerHTML = html;
    }

    /**
     * Clear all templates and components
     */
    clear() {
        this.templates.clear();
        this.components.clear();
        this.helpers.clear();
        this.registerDefaultHelpers();
        this.registerDefaultComponents();
    }
}

// Export for use
window.TemplateEngine = TemplateEngine;

// Create default instance
window.templateEngine = new TemplateEngine();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TemplateEngine;
}