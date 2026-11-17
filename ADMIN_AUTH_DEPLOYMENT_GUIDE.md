# ToolBox — Production Admin Authentication Deployment Guide

This guide explains how to configure, deploy, test, and maintain HTTP Basic Authentication for the ToolBox SEO Admin Dashboard (`/admin/seo`) and internal telemetry APIs (`/api/seo/*`).

---

## 1. Overview & Security Architecture

ToolBox protects all administrative routes at the Vercel Edge using Next.js Middleware:
* **Protected Routes**:
  - `/admin`
  - `/admin/seo`
  - `/admin/:path*` (all future admin sub-routes)
  - `/api/seo/:path*` (internal SEO telemetry endpoints, e.g. `/api/seo/gsc`)
* **Public Routes (Uninterrupted)**:
  - Homepage (`/`)
  - All 24 tools (`/tools/:category/:slug`)
  - All categories (`/category/:category`)
  - Educational guides (`/blog`, `/blog/:slug`)
  - Public APIs (`/api/health`)
* **Authentication Standard**: RFC 7617 HTTP Basic Authentication.
* **Fail-Closed Guarantee**: If `ADMIN_USERNAME` or `ADMIN_PASSWORD` are absent or empty on the server, all requests to protected paths receive `401 Unauthorized` by default. No anonymous access is ever permitted.

---

## 2. Generating Strong Credentials

Never use common words or short passwords. Generate cryptographically strong credentials using the terminal:

### Option A: Using OpenSSL (Recommended)
```bash
# Generate 16-character alphanumeric username
openssl rand -hex 8

# Generate 32-character high-entropy password (base64)
openssl rand -base64 24
```

### Option B: Using Node.js
```bash
node -e "console.log('Username: admin_' + require('crypto').randomBytes(6).toString('hex'))"
node -e "console.log('Password: ' + require('crypto').randomBytes(24).toString('base64url'))"
```

*Example Output*:
* `ADMIN_USERNAME`: `admin_7a9f4c01e2`
* `ADMIN_PASSWORD`: `K8v_mX9qW2zP5bY7rT1uL4oI0sE3dA6f`

---

## 3. Configuring Environment Variables in Vercel

Follow these steps in your Vercel project dashboard:

1. Log into your Vercel account: [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project: **`toolbox`** (or the project mapped to `https://toolbox-1llw.vercel.app`).
3. Click on **Settings** in the top navigation bar.
4. Select **Environment Variables** from the left sidebar.
5. Add the following two variables:

### Variable 1: `ADMIN_USERNAME`
* **Key**: `ADMIN_USERNAME`
* **Value**: Your generated username (e.g. `admin_7a9f4c01e2`)
* **Environments**: Select **Production** and **Preview** (and optionally Development).

### Variable 2: `ADMIN_PASSWORD`
* **Key**: `ADMIN_PASSWORD`
* **Value**: Your generated password (e.g. `K8v_mX9qW2zP5bY7rT1uL4oI0sE3dA6f`)
* **Environments**: Select **Production** and **Preview** (and optionally Development).
* **Sensitive**: Ensure the "Sensitive Environment Variable" toggle is checked so the value is hidden from project collaborators.

6. Click **Save** for both variables.

---

## 4. Triggering a Production Deployment

In Next.js and Vercel, **environment variable changes take effect on the next build/deployment**.

Once you approve pushing the commits to GitHub:
```bash
git push origin main
```
Vercel will automatically trigger a new production build incorporating `ADMIN_USERNAME` and `ADMIN_PASSWORD`.

*(If variables are updated later without git changes, go to **Deployments** > click the three dots `...` on the latest deployment > select **Redeploy**).*

---

## 5. How to Test Authentication in Production

### Test 1: Browser Challenge Verification
1. Open an Incognito / Private window in your web browser.
2. Navigate to: `https://toolbox-1llw.vercel.app/admin/seo`
3. **Expected Behavior**:
   * The browser immediately presents a native HTTP Basic Authentication login dialog box titled *"Sign in to ToolBox Admin"*.
   * Zero dashboard HTML, competitor metrics, or page components are visible in the background.
4. Click **Cancel**:
   * **Expected Result**: HTTP `401 Unauthorized`.
5. Enter correct username and password:
   * **Expected Result**: HTTP `200 OK`, dashboard unlocks with full functionality.

### Test 2: Terminal / cURL Verification
```bash
# Test A: Unauthenticated request must return 401
curl -I https://toolbox-1llw.vercel.app/admin/seo
# Expected header output:
# HTTP/2 401
# www-authenticate: Basic realm="ToolBox Admin", charset="UTF-8"

# Test B: Invalid credentials must return 401
curl -I -u wronguser:wrongpass https://toolbox-1llw.vercel.app/admin/seo
# Expected: HTTP/2 401

# Test C: Correct credentials must return 200
curl -I -u your_username:your_password https://toolbox-1llw.vercel.app/admin/seo
# Expected: HTTP/2 200

# Test D: Public routes remain completely unaffected
curl -I https://toolbox-1llw.vercel.app/tools/text/word-counter
# Expected: HTTP/2 200
```

---

## 6. How to Rotate Credentials

If an administrator leaves the project or credentials need periodic rotation:
1. Generate a new password using OpenSSL or Node.js.
2. In Vercel Project Settings > **Environment Variables**, edit `ADMIN_PASSWORD`.
3. Save the new value.
4. Go to **Deployments** > click the three dots `...` on the latest production deployment > click **Redeploy**.
5. Once redeployed (~45s), all existing browser sessions are immediately invalidated and require the new password.
