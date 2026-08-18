# EnergyCalc UK — Complete Static Website

This package is designed to replace the current development folder as one clean version.

## What is included
- Homepage
- 11 working calculator pages
- Shared responsive CSS
- Shared calculator JavaScript
- 3 supporting guides
- About, Privacy, Disclaimer and Contact pages
- robots.txt
- sitemap-template.xml

## Calculator pages
- Washing Machine Running Cost Calculator UK
- Tumble Dryer Running Cost Calculator UK
- Dishwasher Running Cost Calculator UK
- Kettle Running Cost Calculator UK
- Oven Running Cost Calculator UK
- Microwave Running Cost Calculator UK
- Air Fryer Electricity Cost Calculator UK
- Electric Heater Running Cost Calculator UK
- Gaming PC Electricity Cost Calculator UK
- Appliance Running Cost Calculator UK
- EV Charging Cost Calculator UK

## Current default electricity rate
26.11p/kWh, based on Ofgem's average Direct Debit electricity unit rate for 1 July–30 September 2026.

## Test locally
Open `index.html` in a browser. All calculators use relative paths and should work from `file://`.
For a more production-like test, use VS Code Live Server or run:
`python3 -m http.server 8000`

Then open:
`http://localhost:8000/`

## Before publishing
1. Buy/choose the final domain.
2. Replace `hello@YOUR-DOMAIN.co.uk` in contact.html.
3. Replace `YOUR-DOMAIN.co.uk` inside sitemap-template.xml.
4. Rename sitemap-template.xml to sitemap.xml.
5. Add `Sitemap: https://YOUR-DOMAIN.co.uk/sitemap.xml` to robots.txt.
6. Add canonical URLs after the final domain is known.
7. Connect Google Search Console after deployment.
8. Add analytics/AdSense only after privacy/consent setup is appropriate.
9. Re-check the Ofgem default rate every price-cap period.

## Important
Do not mix these files into the broken folder one by one. Keep this package as a separate clean folder first, test it, then replace the old project only after you are satisfied.
