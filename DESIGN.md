# Design System Specification: The Living Archive

## 1. Overview & Creative North Star
**Creative North Star: "The Living Curator"**

This design system rejects the "SaaS-template" aesthetic in favor of a high-end editorial experience. It is designed to feel like a premium digital monograph—authoritative, archival, yet pulsing with life. We achieve this by breaking the traditional rigid grid with intentional asymmetry, expansive negative space, and a "layered paper" approach to depth. 

The goal is to move beyond functional UI into a brand experience where the interface recedes to let the content (the "Archive") breathe. We prioritize high-contrast typography and tonal shifts over lines and shadows to establish a sophisticated, trustworthy presence.

---

## 2. Colors
Our palette is rooted in a deep, scholarly emerald, supported by a spectrum of "living neutrals" that mimic the textures of fine archival paper.

### Color Strategy
*   **Primary (#0f5238):** Reserved for high-impact brand moments and primary actions. It represents the "living" aspect of the NGO—growth and vitality.
*   **Tonal Surfaces:** We use a "warm-cool" neutral spectrum (`surface` to `surface-container-highest`) to create a sense of physical environment.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section content. Boundaries must be defined solely through:
1.  **Background Shifts:** Use `surface-container-low` for a section sitting on a `surface` background.
2.  **Negative Space:** Use the Spacing Scale (specifically scales 12, 16, and 20) to create "invisible" boundaries.
3.  **Tonal Transitions:** A subtle shift from `surface` to `surface-variant` is sufficient for the human eye to perceive a container.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked sheets. 
*   **Base Layer:** `surface` (#f8faf6).
*   **Secondary Content Blocks:** `surface-container-low` (#f2f4f0).
*   **Interactive Cards/Modules:** `surface-container-lowest` (#ffffff) to provide a "lifted" feel against the slightly darker background.

### The "Glass & Signature" Rule
For floating navigation or overlay modals, use **Glassmorphism**. Apply a backdrop-blur (12px-20px) to a semi-transparent `surface` color. This ensures the editorial content "bleeds" through the interface, maintaining a sense of continuity. For hero CTAs, utilize a subtle linear gradient from `primary` (#0f5238) to `primary-container` (#2d6a4f) to add "soul" and dimension.

---

## 3. Typography
The system uses a high-contrast pairing: **Newsreader** (Serif) for authority and storytelling, and **Manrope** (Sans-Serif) for modern clarity.

*   **Display (Newsreader):** Use `display-lg` (3.5rem) with tight letter-spacing for hero headlines. This is our "Editorial Voice."
*   **Headlines (Newsreader):** `headline-lg` through `headline-sm`. These should feel like book titles—authoritative and bold.
*   **Body (Manrope):** `body-lg` (1rem) is the workhorse. Manrope’s geometric yet warm construction ensures legibility in long-form archival text.
*   **Labels (Manrope):** `label-md` and `label-sm` are used for metadata and utility text. Always use uppercase with a 0.05em letter-spacing for a "curated" feel.

---

## 4. Elevation & Depth
We eschew traditional Material shadows for **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by "stacking." A `surface-container-highest` element placed on a `surface` background creates a natural visual recession without a single shadow.
*   **Ambient Shadows:** If a floating element (like a mobile FAB or a dropdown) requires a shadow, it must be an "Ambient Glow": 
    *   **Blur:** 32px-64px.
    *   **Opacity:** 4%-6%.
    *   **Color:** Use `on-surface` (#191c1a) rather than pure black to keep the light "natural."
*   **The Ghost Border Fallback:** If a border is required for accessibility (e.g., input fields), use the `outline-variant` (#bfc9c1) at 20% opacity. **Never use 100% opaque borders.**

---

## 5. Components

### Buttons
*   **Primary:** `primary` background, `on-primary` text. Use `DEFAULT` (8px) rounded corners.
*   **Secondary:** `secondary-container` background with `on-secondary-container` text. No border.
*   **Tertiary/Editorial Link:** `on-surface` text with a 2px underline in `primary-fixed-dim`, offset by 4px.

### Cards & Lists
*   **The "No-Divider" Rule:** Forbid 1px dividers. Separate list items using `spacing-4` or `spacing-5`.
*   **Asymmetric Cards:** When displaying archival photos, use a mix of `DEFAULT` (8px) and `lg` (16px) corner radii on different cards to create a "scrapbook" editorial rhythm.

### Input Fields
*   **Style:** `surface-container-lowest` background with a "Ghost Border" (outline-variant @ 20%).
*   **Focus State:** The border transitions to `primary` (100% opacity) with a subtle 2px thickness.

### Archival Chips
*   **Selection Chips:** Use `secondary-fixed` for the background. They should feel like small "tags" found in a physical archive.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical margins. A hero image that is slightly offset from the text creates a professional magazine feel.
*   **Do** lean into white space. If you think there is enough space, add 20% more.
*   **Do** use "Glassmorphism" for sticky headers to maintain the visibility of the "Archive" beneath.

### Don’t:
*   **Don’t** use heavy dropshadows. It makes the "Archive" feel like a cheap app rather than a premium institution.
*   **Don’t** use 1px lines to separate sections. Use color blocks or space.
*   **Don’t** center-align long-form body text. Keep it flush-left to maintain the editorial "spine."
*   **Don’t** use pure black (#000000). Use `on-surface` (#191c1a) for a softer, high-end ink-on-paper look.