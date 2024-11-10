# Suprasy Store Theme

A powerful and customizable e-commerce storefront theme for Suprasy merchants. This theme serves as a foundation for building your online store, featuring modern technologies like React, TypeScript, and TailwindCSS.

## 🛠️ Setup & Customization

### Before You Begin

1. Create your store at [Suprasy.com](https://suprasy.com). You can create a store for free.
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

   - In`.env.development`
   - Add your Suprasy Store Key:
   - And update api urls to production urls
     ```
     VITE_API_URL=https://api.suprasy.com
      VITE_RENDER_URL=https://render.suprasy.com
      VITE_STORE_KEY=STORE_KEY_GOES_HERE
     ```

4. Start development server:
   ```bash
   npm start
   # or using make command
   make
   ```

### Customization Guide

This theme is designed to be customized. Here's how you can make it your own:

- **Styling**: Modify `tailwind.config.js` to change colors, fonts, and other design tokens
- **Components**: All UI components are in `src/components` - extend or modify as needed
- **Layout**: Adjust page layouts in `src/layouts`
- **Features**: Add new features by creating new components and routes

### Deployment

You can deploy your theme frontend to any hosting provider or static site hosting service. We recommend using Cloudflare Pages for free hosting with these benefits:

- Zero configuration deployment
- Automatic builds and deployments
- Free SSL certificates
- Global CDN distribution
- Unlimited bandwidth

### Development
