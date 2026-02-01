# Elvish Deployment Guide

This guide covers deploying Elvish for various use cases: CDN hosting, npm packages, and Ignition integration.

## Quick Start

### Option 1: CDN (Recommended for demos)

After publishing to npm, Elvish is automatically available via unpkg or jsDelivr:

```html
<!-- unpkg -->
<link rel="stylesheet" href="https://unpkg.com/elvish-css@1.0.0/dist/elvish.min.css">
<script src="https://unpkg.com/elvish-css@1.0.0/dist/elvish.iife.js"></script>

<!-- jsDelivr -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/elvish-css@1.0.0/dist/elvish.min.css">
<script src="https://cdn.jsdelivr.net/npm/elvish-css@1.0.0/dist/elvish.iife.js"></script>
```

### Option 2: Self-Hosted

1. Build the distribution files:
   ```bash
   npm install
   npm run build
   ```

2. Copy `dist/` to your web server or CDN.

3. Reference the files:
   ```html
   <link rel="stylesheet" href="/assets/elvish/elvish.min.css">
   <script src="/assets/elvish/elvish.iife.js"></script>
   ```

### Option 3: npm Package

```bash
npm install elvish-css
```

```javascript
// ES Modules
import 'elvish-css/css';
import { transition, transitionTheme } from 'elvish-css';

// Or import everything
import * as Elvish from 'elvish-css';
```

---

## Distribution Files

After building, the `dist/` folder contains:

| File | Size | Use Case |
|------|------|----------|
| `elvish.css` | ~15KB | Full CSS, readable |
| `elvish.min.css` | ~8KB | Production CSS |
| `elvish.esm.js` | ~25KB | ES Modules (bundlers) |
| `elvish.umd.js` | ~25KB | CommonJS/AMD/Node |
| `elvish.iife.js` | ~25KB | Script tag (auto-registers elements) |
| `elvish.d.ts` | ~3KB | TypeScript declarations |

### Which JS file to use?

- **`elvish.iife.js`** - For `<script>` tags. Auto-registers all custom elements. Exposes `window.Elvish`.
- **`elvish.esm.js`** - For ES Module imports. Tree-shakeable.
- **`elvish.umd.js`** - For CommonJS/AMD environments (Node.js, RequireJS).

---

## Ignition Integration

Elvish works with both **Ignition Perspective** (web-based) and **Ignition Vision** (Java Swing), though the approaches differ.

### Perspective (Recommended)

Perspective is web-based and fully supports custom elements and modern CSS.

#### Method 1: Gateway Webpage (Simplest)

1. **Upload files to Gateway:**
   - Go to **Config → System → Web Server → Web Files**
   - Upload `elvish.min.css` and `elvish.iife.js`
   - Files are served at: `http://gateway:8088/system/webdev/your-project/elvish.min.css`

2. **Add to Perspective session:**

   In your Perspective **Page Configuration** or **Session Props → Custom CSS**:
   
   ```css
   @import url('/system/webdev/your-project/elvish.min.css');
   ```

   In **Session Props → Scripts → Startup Script**:
   
   ```python
   # Load Elvish custom elements
   system.perspective.runJavaScriptAsync(
       """
       if (!window.Elvish) {
           const script = document.createElement('script');
           script.src = '/system/webdev/your-project/elvish.iife.js';
           document.head.appendChild(script);
       }
       """
   )
   ```

3. **Use in Embedded Views:**

   Create a **HTML component** or **Markdown component** with Elvish primitives:
   
   ```html
   <i-hath space="var(--s1)">
     <i-bau padding="var(--s0)">
       <h2>Dashboard Header</h2>
     </i-bau>
     <i-vircantie min="200px" space="var(--s1)">
       <div class="metric-card">Production: 1,234</div>
       <div class="metric-card">Quality: 98.5%</div>
       <div class="metric-card">Efficiency: 94.2%</div>
     </i-vircantie>
   </i-hath>
   ```

#### Method 2: Perspective Theme

1. Create a custom theme in **Designer → Project → Themes**
2. In the theme's `styles.css`, add:

   ```css
   /* Paste contents of elvish.min.css here */
   /* Or use @import if your gateway serves the file */
   ```

3. The theme applies to all sessions using it.

#### Method 3: WebDev Module

If you have the WebDev module, you can create proper endpoints:

1. Create a new WebDev resource
2. Add GET endpoints for `/elvish.css` and `/elvish.js`
3. Return the file contents with proper MIME types

```python
# In your WebDev resource
def doGet(request, session):
    import system
    css = system.file.readFileAsString("/path/to/elvish.min.css")
    return {'contentType': 'text/css', 'content': css}
```

### Vision (Limited)

Vision uses Java Swing, not a web browser. Custom elements don't work directly. However, you can:

1. **Use the HTML Viewer component** to render Elvish layouts
2. **Create styled PDF reports** that use Elvish CSS for layout
3. **Embed a browser component** (third-party) for full web support

---

## Self-Hosted CDN Setup

### Using nginx

```nginx
server {
    listen 80;
    server_name cdn.yourcompany.com;
    
    location /elvish/ {
        alias /var/www/elvish/dist/;
        
        # CORS headers for cross-origin usage
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, OPTIONS';
        
        # Cache headers
        add_header Cache-Control "public, max-age=31536000, immutable";
        
        # Correct MIME types
        types {
            text/css css;
            application/javascript js;
        }
    }
}
```

Usage:
```html
<link rel="stylesheet" href="https://cdn.yourcompany.com/elvish/elvish.min.css">
<script src="https://cdn.yourcompany.com/elvish/elvish.iife.js"></script>
```

### Using S3 + CloudFront

1. Create S3 bucket with public access
2. Upload `dist/` contents
3. Create CloudFront distribution
4. Set proper CORS and cache headers

---

## Framework Integration

### Vanilla HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="https://unpkg.com/elvish-css/dist/elvish.min.css">
</head>
<body>
  <i-enedh max="80ch" gutters="var(--s1)">
    <i-hath space="var(--s2)">
      <h1>Hello Elvish!</h1>
      <p>Intrinsic layouts are magical.</p>
    </i-hath>
  </i-enedh>
  
  <script src="https://unpkg.com/elvish-css/dist/elvish.iife.js"></script>
</body>
</html>
```

### React / Next.js

```bash
npm install elvish-css
```

```jsx
// _app.js or layout.js
import 'elvish-css/dist/elvish.css';
import 'elvish-css'; // Registers custom elements

export default function App({ children }) {
  return (
    <i-enedh max="80ch">
      <i-hath space="var(--s2)">
        {children}
      </i-hath>
    </i-enedh>
  );
}
```

**Note:** React requires custom elements to be declared:

```typescript
// types/elvish.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    'i-hath': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { space?: string }, HTMLElement>;
    'i-enedh': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { max?: string; gutters?: string }, HTMLElement>;
    // ... add others as needed
  }
}
```

### Astro

```astro
---
// Layout.astro
import 'elvish-css/dist/elvish.css';
---

<html>
<head>
  <script src="https://unpkg.com/elvish-css/dist/elvish.iife.js" is:inline></script>
</head>
<body>
  <i-enedh max="80ch">
    <slot />
  </i-enedh>
</body>
</html>
```

### Datastar

Elvish works seamlessly with Datastar since both use custom elements:

```html
<i-hath space="var(--s1)">
  <i-vircantie min="200px" data-signals="{items: []}">
    <template data-for="items">
      <i-bau padding="var(--s0)">
        <span data-text="$item.name"></span>
      </i-bau>
    </template>
  </i-vircantie>
</i-hath>
```

---

## Publishing to npm

1. Update version in `package.json`
2. Build:
   ```bash
   npm run build
   ```
3. Login to npm:
   ```bash
   npm login
   ```
4. Publish:
   ```bash
   npm publish
   ```

The package will be available at:
- npm: `https://www.npmjs.com/package/elvish-css`
- unpkg: `https://unpkg.com/elvish-css/`
- jsDelivr: `https://cdn.jsdelivr.net/npm/elvish-css/`

---

## Version Strategy

- **Major (X.0.0):** Breaking changes to element names or behavior
- **Minor (0.X.0):** New primitives, features, or CSS custom properties
- **Patch (0.0.X):** Bug fixes, documentation updates

---

## Subresource Integrity (SRI)

For production, generate SRI hashes:

```bash
cat dist/elvish.min.css | openssl dgst -sha384 -binary | openssl base64 -A
cat dist/elvish.iife.js | openssl dgst -sha384 -binary | openssl base64 -A
```

Usage:
```html
<link rel="stylesheet" 
      href="https://unpkg.com/elvish-css@1.0.0/dist/elvish.min.css"
      integrity="sha384-HASH_HERE"
      crossorigin="anonymous">
```

---

## Troubleshooting

### Custom elements not rendering

1. Check if JS loaded: `console.log(window.Elvish)`
2. Ensure CSS is loaded before content
3. Check for duplicate registrations

### View Transitions not working

1. Verify browser support: Chrome 111+, Safari 18+, Firefox 144+
2. Check `document.startViewTransition` exists
3. Ensure DOM changes happen inside the callback

### Ignition-specific issues

1. **CSS not loading:** Check file paths are accessible from gateway
2. **Elements not working:** Ensure JS loads before using elements
3. **Styles conflicting:** Elvish uses CSS custom properties—check for overrides

---

## Support

- GitHub Issues: [Report bugs or request features]
- Documentation: [README.md](./README.md)

*Mae govannen!* 🧝
