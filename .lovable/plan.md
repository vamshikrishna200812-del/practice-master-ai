

## Plan: Add Custom Logo Across the Website

The uploaded logo image will replace the current Brain icon + gradient square used as the brand logo throughout the app.

### Changes

1. **Copy logo to project assets**
   - Copy `user-uploads://logo.jpeg` to `src/assets/logo.jpeg`

2. **Update DashboardLayout.tsx** (sidebar + mobile header)
   - Replace the `Brain` icon inside the gradient `div` with an `<img>` tag using the logo, styled as a rounded 8x8 image in both:
     - Desktop sidebar header (line ~200)
     - Mobile header (line ~256)

3. **Update Home.tsx** (landing page footer)
   - Replace the Brain icon + text branding with the logo image (line ~263)

4. **Update Auth.tsx** (login/signup page)
   - Add the logo image above or replacing the current text heading

5. **Update PromoSection.tsx** (promo page)
   - Replace the animated Brain icon logo with the actual logo image

6. **Update CertificateVerify.tsx**
   - Replace the Brain icon in the verification header with the logo

7. **Update index.html**
   - Copy logo to `public/logo.jpeg` and set it as the favicon/og:image

All instances will use the same pattern: `import logo from "@/assets/logo.jpeg"` and render as a rounded image maintaining aspect ratio.

