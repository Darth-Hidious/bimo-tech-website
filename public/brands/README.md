# Brand Logos

Drop your brand SVG files here!

## How to Add a Brand Logo:

1. **Save your SVG file** to this folder (`public/brands/`)
   - Example: `bosch.svg`, `siemens.svg`, etc.

2. **Add the filename** to the `brandLogos` array in `src/app/[lang]/page.tsx`:
   ```typescript
   const brandLogos = [
     { name: 'Bosch', filename: 'bosch.svg' },
     { name: 'Your Company', filename: 'your-company.svg' }, // Add this line
   ];
   ```

3. **That's it!** The carousel will automatically load and display your SVG.

## SVG Tips:
- Use `fill="currentColor"` in your SVG for automatic white coloring
- Recommended viewBox: `0 0 200 60` or similar landscape ratio
- Keep file sizes small for fast loading
