# HartvaleLegal website

A static, dependency-free site. Open the site root in a browser to preview it.

## Structure

```
hartvalelegal/
├── index.html            Public homepage structure
├── admin/index.html      Static content studio at `/admin/`
├── README.md
└── assets/
    ├── css/styles.css    All styling (tokens, base, layout, components, sections, responsive)
    └── js/site-content.js Shared default content model
    ├── js/content.js     Homepage content renderer
    ├── js/admin.js       Local admin, editor, import/export and URL key controls
    └── js/main.js        Mobile menu, footer year, enquiry form
```

## Admin studio

Open `/admin/` on the deployed GitHub Pages site. On first use, create a strong local admin password with at least 12 characters, uppercase and lowercase letters, a number, and a symbol. After signing in, use **Change password** in the admin header whenever you need to rotate it. The studio edits the full homepage content model, including headings, navigation, practice areas, testimonials, people, contact details, images, lead/contact URLs, every navigation and practice button destination, form destination and legal links.

This is intentionally GitHub-only and dependency-free. Changes are saved in the current browser's local storage. Use **Download GitHub file** to export an updated `site-content.js`, then replace `assets/js/site-content.js` in the repository and commit it to publish the changes to every visitor. Use **Export JSON** as a backup or to move edits between browsers.

There is no database or third-party admin service. Passwords are stored locally as salted PBKDF2-SHA-256 records with 210,000 iterations. GitHub Pages cannot provide a secure server-side login or shared database by itself, so this browser gate is not a substitute for GitHub repository permissions. Keep the repository private, protect the GitHub account with 2FA, and use GitHub access control for real administrator security.

## Before going live

1. **Enquiry form.** The form is wired for Formspree. Open `/admin/`, go to **URL key and destinations**, and replace `https://formspree.io/f/YOUR_FORM_ID` with the full endpoint from your Formspree account. The success thank-you note and error note are editable in **Contact and enquiry**. GitHub Pages itself cannot receive or store form submissions.
2. **Regulatory details.** In the footer, replace the placeholder company number (`OC000000`) and SRA number (`000000`), and confirm the Law Society of Scotland wording for the Edinburgh office.
3. **Legal links.** Privacy notice, Complaints procedure and Accessibility currently point to `#`. Link them to real pages.
4. **Images.** Photos load from Unsplash and are placeholders. Save real photography into `assets/img/` and update the `src` attributes.
5. **Contact details.** Address, phone and email appear in the page and in the JSON-LD block in `<head>`. Update both.
6. **People and client comments.** Names, roles, email addresses and the client comments are illustrative. Replace them with genuine, approved testimonials before publishing, and check they meet SRA rules on client comments.

## Editing tips

- Colours and fonts live in the `:root` block at the top of `styles.css`.
- Layout changes at 960px (tablet and mobile) and 600px (small phones).
- The hero photograph is designed to bleed to the right edge of the screen on desktop.
- **Responsive layout.** `index.html` uses a responsive viewport and the existing mobile styles in `styles.css`.
