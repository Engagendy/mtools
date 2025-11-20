# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Marketing Tools Suite is a client-side web application for creating professional marketing materials. It's a single-page application (SPA) built with vanilla JavaScript that provides three main tools: Business Card Designer, Discount Offer Creator, and Social Media Designer.

## Development Commands

Since this is a pure client-side application, there are no build commands, tests, or linting configured. The application runs directly in the browser:

- **Development**: Open `index.html` in a browser or serve via local server
- **Deployment**: Static hosting (designed for GitHub Pages)

## Architecture Overview

### Core Application Structure

The application follows a modular, event-driven architecture:

**Main Application (`js/app.js`):**
- `MarketingToolsApp` class manages the overall application state
- Handles navigation between tools via `showHome()` and `showTool(toolName)`
- Dynamically loads tool content from `templates/` directory
- Manages loading states and tool lifecycle

**Template System (`js/template-engine.js`):**
- Custom lightweight templating engine supporting variables, conditionals, loops
- Component-based architecture with reusable UI components
- Handles dynamic content rendering without external frameworks

**Internationalization (`js/i18n.js`):**
- Bilingual support (English/Arabic) with RTL layout handling
- Complete translation system with nested key structure
- Language persistence via localStorage

**Component Library (`js/components.js`):**
- Reusable UI components (forms, modals, tabs, etc.)
- Built on top of the template engine
- Provides consistent styling and behavior

### Tool Architecture

Each tool is a self-contained HTML template with embedded styles and scripts:

- `templates/business_card.html` - Business card designer
- `templates/discount_offer.html` - Discount offer creator  
- `templates/social_media.html` - Social media content designer

Tools are loaded dynamically via fetch() and injected into designated containers. Each tool has its own isolated namespace to prevent conflicts.

### Styling and UI

- Uses **Tailwind CSS** via CDN for utility-first styling
- **Google Fonts**: Almarai (Arabic), Inter (English)
- **Font Awesome** icons via CDN
- Custom CSS variables for theming in tool templates
- Responsive design with mobile-first approach

### State Management

- No global state management framework
- Tool-specific state managed within individual tool scripts
- Language preference stored in localStorage
- URL-based routing for deep linking to specific tools

## Key Conventions

### File Organization

- `index.html` - Main application entry point
- `js/` - Core application modules
- `templates/` - Self-contained tool templates
- `css/style.css` - Global styles (minimal)

### Tool Development

When creating or modifying tools:

1. Each tool template contains all HTML, CSS, and JavaScript needed
2. Tools use the global template engine and i18n system
3. Tool scripts should be wrapped in namespace functions to avoid conflicts
4. Use data attributes for i18n: `data-i18n="key.path"`

### Deployment Considerations

- Application is designed for static hosting (GitHub Pages, Netlify)
- `.htaccess` provides client-side routing support for Apache servers
- `_redirects` file for Netlify deployment
- No backend dependencies or build process required

## Important Technical Details

### Dynamic Tool Loading

The `MarketingToolsApp.loadTool()` method:
- Fetches tool templates via fetch API
- Injects HTML content into tool containers
- Executes embedded scripts with tool-specific namespacing
- Applies i18n translations after content loads

### Script Execution Context

Tools scripts are wrapped in closures to prevent global variable conflicts:
```javascript
(function() {
    const TOOL_NAME = 'tool-name';
    const TOOL_CONTAINER = document.getElementById('tool-name-content');
    // Tool-specific code here
})();
```

### I18n Integration

- Translation keys follow nested structure: `business_card.design.colors_title`
- Elements with `data-i18n` attributes are automatically translated
- Template engine includes i18n helpers for dynamic content

This architecture enables rapid development of new marketing tools while maintaining clean separation of concerns and bilingual support throughout the application.