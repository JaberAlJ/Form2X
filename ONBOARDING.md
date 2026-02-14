# User Onboarding Feature

## Overview

The Form2X application now includes a guided onboarding tour for first-time visitors using [driver.js](https://driverjs.com/). The tour automatically starts when a user visits the landing page for the first time and provides an interactive walkthrough of the key features.

## Features

### 🎯 Automatic Tour Trigger

- The onboarding tour automatically starts 1 second after the page loads for first-time visitors
- Uses localStorage to track whether a user has completed the tour
- Won't show again once completed (unless localStorage is cleared)

### 📍 Tour Steps

The tour includes 6 steps that highlight:

1. **Welcome Section** - Introduction to Form2X and its purpose
2. **Features Section** - Highlights ATS optimization and LaTeX engine support
3. **Form2Resume Card** - Explains the resume builder tool
4. **Form2Research Card** - Explains the research paper generator tool
5. **Theme Toggle** - Shows how to switch between light/dark modes
6. **Final Step** - Completion message with reminder about auto-save

### 🎨 Custom Styling

- Matches Form2X's design system with glassmorphism effects
- Full support for both light and dark themes
- Smooth animations and transitions
- Premium look with backdrop blur and custom shadows

### 💾 Persistence

- Uses localStorage key: `form2x-onboarding-completed`
- Automatically set to `true` when the tour is completed or closed
- Prevents the tour from showing again on subsequent visits

## Implementation Details

### Files Created/Modified

#### 1. `hooks/use-onboarding.ts`

Custom React hook that manages the onboarding state and tour configuration:

- Checks localStorage for completion status
- Configures driver.js with tour steps
- Provides `startOnboarding()` and `resetOnboarding()` functions
- Handles tour completion and localStorage updates

#### 2. `app/driver-custom.css`

Custom CSS styles for driver.js that:

- Override default driver.js styles
- Match Form2X's color palette and design system
- Support both light and dark themes
- Add glassmorphism effects and smooth animations

#### 3. `app/page.tsx` (Modified)

Landing page updated to:

- Import and use the `useOnboarding` hook
- Add unique IDs to key elements for tour targeting
- Automatically trigger the tour for first-time visitors
- Delay tour start by 1 second to ensure all elements are rendered

### Element IDs for Tour

The following IDs were added to the landing page:

- `#hero-section` - Main hero/welcome section
- `#features-section` - Feature badges (ATS Optimized, LaTeX Engine)
- `#form2resume-card` - Resume builder card
- `#form2research-card` - Research paper builder card
- `#theme-toggle` - Theme toggle button

## Testing the Feature

### Manual Testing

1. **First-time visitor experience:**

   ```bash
   # Clear localStorage in browser DevTools
   localStorage.clear()
   # Refresh the page
   # The tour should start automatically after 1 second
   ```

2. **Test tour navigation:**

   - Click "Next" to progress through steps
   - Click "Previous" to go back
   - Click "Close" or the X button to exit early
   - Complete the tour to see the final message

3. **Test persistence:**

   - Complete the tour
   - Refresh the page
   - Tour should NOT start again
   - Check localStorage: `localStorage.getItem('form2x-onboarding-completed')` should return `"true"`

4. **Test theme compatibility:**

   - Start the tour in light mode
   - Navigate through a few steps
   - Toggle to dark mode
   - Verify popover styles update correctly
   - Continue the tour

### Programmatic Testing

You can manually trigger the tour from the browser console:

```javascript
// In browser DevTools console:
// First, clear the completion flag
localStorage.removeItem('form2x-onboarding-completed')
// Then refresh the page, and the tour will start automatically
```

## Customization

### Adding New Steps

To add new tour steps, edit `hooks/use-onboarding.ts`:

```typescript
steps: [
  // ... existing steps
  {
    element: '#new-element-id',
    popover: {
      title: 'New Feature',
      description: 'Description of the new feature',
      side: 'bottom', // top, right, bottom, left
      align: 'center', // start, center, end
    },
  },
]
```

### Modifying Styles

To customize the tour appearance, edit `app/driver-custom.css`:

- Update colors to match your theme
- Adjust spacing and sizing
- Modify animations and transitions

### Changing Behavior

To modify when the tour triggers, edit `app/page.tsx`:

```typescript
// Change the delay (currently 1000ms)
const timer = setTimeout(() => {
  startOnboarding();
}, 2000); // 2 seconds instead of 1
```

## Dependencies

- **driver.js**: ^1.3.1 - Lightweight, vanilla JavaScript library for creating guided tours
- No additional dependencies required

## Browser Compatibility

The onboarding feature works in all modern browsers that support:

- ES6+ JavaScript
- CSS backdrop-filter
- localStorage API

## Future Enhancements

Potential improvements for the onboarding feature:

- [ ] Add onboarding tours for individual tools (Form2Resume, Form2Research)
- [ ] Allow users to restart the tour from a help menu
- [ ] Add analytics to track tour completion rates
- [ ] Create different tours for different user types
- [ ] Add video tutorials or GIF demonstrations in tour steps
- [ ] Implement progressive disclosure (show advanced features after basic tour)

## Troubleshooting

### Tour doesn't start automatically

1. Check browser console for errors
2. Verify localStorage is not disabled
3. Clear localStorage and refresh: `localStorage.clear()`
4. Check that all element IDs exist in the DOM

### Styles look incorrect

1. Verify `driver-custom.css` is imported correctly
2. Check for CSS conflicts with existing styles
3. Ensure theme provider is working correctly

### Tour appears but elements aren't highlighted

1. Verify element IDs match between the tour config and HTML
2. Check that elements are visible and not hidden by CSS
3. Ensure elements are rendered before the tour starts (increase delay if needed)

## Resources

- [driver.js Documentation](https://driverjs.com/)
- [driver.js GitHub](https://github.com/kamranahmedse/driver.js)
- [Form2X Repository](https://github.com/JaberAlJ/Form2X)
