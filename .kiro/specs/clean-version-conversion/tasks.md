# Task List

## Task 1: Update assets.js with Free-to-Use Image URLs

**id**: update-assets-urls
**status**: not_started
**optional**: false

Replace all image imports in `d:\MediSync\frontend\src\assets\assets.js` with direct Unsplash/Pexels URLs:
- header_img, about_image, contact_image, appointment_img
- profile_pic, group_profiles
- doc1-doc15 (doctor images - 15 replacements)
- Remove .png imports, keep .svg and .PNG logo imports as-is

Use URLs from CLEAN_VERSION_GUIDE.md. Ensure all URLs are accessible (HTTP 200 response).

**Sub-tasks**:
- Update image URLs in assets.js export object
- Verify URLs are working (no 404 errors)
- Update specialityData with correct image references
- Update doctors array with new image URLs

---

## Task 2: Remove Commented Code from Frontend Components

**id**: clean-frontend-components
**status**: not_started
**optional**: false
**depends-on**: update-assets-urls

Remove all commented code blocks, debug statements, and TODO comments from:
- d:\MediSync\frontend\src\pages\MyAppointment.jsx
- d:\MediSync\frontend\src\components\WalletComponent.jsx
- d:\MediSync\frontend\src\components\PrescriptionViewer.jsx
- All other frontend components

**Sub-tasks**:
- Scan for commented code blocks
- Remove console.log statements
- Remove TODO/FIXME comments
- Keep code clean and production-ready

---

## Task 3: Remove Commented Code from Backend Controllers

**id**: clean-backend-controllers
**status**: not_started
**optional**: false
**depends-on**: update-assets-urls

Remove debug statements and commented code from backend:
- d:\MediSync\backend\controllers\*.js (all controller files)
- d:\MediSync\backend\routes\*.js (all route files)
- Keep error handling and logging that's in use

**Sub-tasks**:
- Remove commented routes
- Clean up debug logs
- Remove unused imports
- Standardize error handling

---

## Task 4: Verify Images Load and Document Changes

**id**: verify-images-final
**status**: not_started
**optional**: false
**depends-on**: clean-frontend-components, clean-backend-controllers

Final verification and cleanup:
- Test that all image URLs load correctly (no 404s)
- Verify components display images properly
- Document all URL replacements made
- Update README with image attribution

**Sub-tasks**:
- Verify header images load on home page
- Test doctor profile images in doctor list
- Test appointment images in appointment pages
- Confirm wallet and prescription illustrations display
- Add attribution note to README.md
- Document completion
