---
description: Manual testing workflow for the User Onboarding feature
---

# User Onboarding Manual Testing Workflow

Since automated browser testing has limitations in this environment, follow these steps to manually verify the User Onboarding feature.

## 1. Landing Page Onboarding

1. **Clear LocalStorage (Simulate New User):**
   - Open your browser's Developer Tools (F12).
   - Go to the **Application** or **Storage** tab.
   - Select **Local Storage**.
   - Delete the key `form2x-onboarding-completed`.
   - Reload the page (`/`).

2. **Verify Automatic Trigger:**
   - After the page loads, wait for approximately 1 second.
   - **Pass Condition:** The onboarding tour should automatically start, highlighting the "Welcome to Form2X!" section.

3. **Verify Tour Navigation:**
   - Click "Next" through all steps.
   - **Pass Condition:** The tour should correctly highlight:
     - Hero Section
     - Features Section
     - Form2Resume Card
     - Form2Research Card
     - Theme Toggle

4. **Verify Persistence:**
   - Finish the tour or click "Done".
   - Reload the page.
   - **Pass Condition:** The tour should **NOT** start automatically.

5. **Verify Manual Trigger:**
   - Click the "Take Tour" floating button in the bottom right.
   - **Pass Condition:** The tour should restart from the beginning.

## 2. Resume Builder Onboarding

1. **Navigate to Resume Builder:**
   - Go to `/resume`.

2. **Verify Floating Button:**
   - Look for the floating help button in the bottom right.
   - **Pass Condition:** The button should say "Resume Help".

3. **Verify Tour Content:**
   - Click "Resume Help".
   - **Pass Condition:** A tour specific to the Resume Builder should start.
   - Verify it highlights:
     - Header (Import/Export controls)
     - Tabs (Content/Layout/Styles)
     - Content Editor
     - Preview Pane
     - Export Button

## 3. Research Paper Builder Onboarding

1. **Navigate to Research Paper Builder:**
   - Go to `/research`.

2. **Verify Floating Button:**
   - Look for the floating help button in the bottom right.
   - **Pass Condition:** The button should say "Research Help".

3. **Verify Tour Content:**
   - Click "Research Help".
   - **Pass Condition:** A tour specific to the Research Paper Builder should start.
   - Verify it highlights:
     - Header
     - Tabs
     - Front Matter
     - Sections
     - References
     - Preview Pane

## 4. Theme Compatibility

1. **Switch Themes:**
   - Toggle between Light and Dark mode using the theme button.
   - Trigger any tour.
   - **Pass Condition:** The tour popovers should look good and be readable in both modes (Glassmorphism effect adapts).
