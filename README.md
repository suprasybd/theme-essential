# Suprasy Store Theme

A powerful and customizable e-commerce storefront theme for Suprasy merchants. This theme serves as a foundation for building your online store, featuring modern technologies like React, TypeScript, and TailwindCSS.

## 🛠️ Setup & Customization

### Before You Begin

1. Create your store at [Suprasy.com](https://suprasy.com)
2. Get your Store Key from your Suprasy dashboard
3. Have Node.js v16+ installed

### Quick Start

1. Use this theme as a template:

   ```bash
   git clone https://github.com/suprasybd/theme_url_here.git
   cd suprasy-store-theme
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure your environment:
   - Copy `.env.example` to `.env`
   - Add your Suprasy Store Key:
     ```
     VITE_STORE_KEY=YOUR_STORE_KEY_HERE
     ```

### Customization Guide

This theme is designed to be customized. Here's how you can make it your own:

- **Styling**: Modify `tailwind.config.js` to change colors, fonts, and other design tokens
- **Components**: All UI components are in `src/components` - extend or modify as needed
- **Layout**: Adjust page layouts in `src/layouts`
- **Features**: Add new features by creating new components and routes

### Development
