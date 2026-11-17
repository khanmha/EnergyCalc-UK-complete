# EnergyCalc UK

A static website for estimating UK appliance electricity running costs and EV charging costs. Users can adjust their electricity unit rate and usage assumptions to compare estimated costs over time.

## Features

- Calculators for washing machines, tumble dryers, dishwashers, kettles, ovens, microwaves, air fryers, electric heaters, gaming PCs, general appliances and EV charging.
- Shared JavaScript calculation logic for energy per cycle, power and duration, weekly use and EV charging efficiency.
- Cost estimates per use, week, month and year, with additional outputs where appropriate.
- Input checks for missing, non-finite and out-of-range values.
- Responsive styling, supporting guides and informational pages.
- Static hosting without a server-side application or build step.

## Technologies

HTML, CSS and vanilla JavaScript.

## Run locally

Download or clone the repository, then run the following command from the project folder if Python 3 is installed:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/` in your browser. You can also open `index.html` directly, although a local HTTP server more closely resembles static hosting.

## How the estimates work

For an appliance with a power rating:

```text
Energy (kWh) = power (watts) / 1000 × duration (hours)
Cost (£) = energy (kWh) × electricity rate (p/kWh) / 100
```

For cycle-based appliances, the calculator uses the entered kWh per cycle. EV estimates use battery capacity, percentage added and charging efficiency.

Weekly-use models use 52 weeks per year; daily-use models use 365 days. Monthly figures are annual estimates divided by 12.

## Project structure

| Path | Purpose |
| --- | --- |
| `index.html` | Homepage |
| `calculators/` | Individual calculator pages |
| `js/calculator.js` | Shared calculations, validation and result rendering |
| `css/` | Shared styles |
| `guides/` | Supporting explanations and comparisons |
| `sitemap.xml`, `robots.txt` | Search discovery files |
| `CNAME` | Custom-domain configuration |

## Assumptions and limitations

Results are estimates based on user inputs, not measured consumption. Actual usage varies with appliance settings, operating cycles and charging losses. Standing charges and other bill components are not included in the energy calculation.

Default tariff values are dated assumptions rather than a live tariff feed. Enter the unit rate from your own electricity bill and review defaults when maintaining the site.

## Maintaining or deploying a copy

- Check that contact details, policy pages and any placeholders match the intended website.
- Review `CNAME`, canonical URLs, `sitemap.xml` and `robots.txt` for the deployment domain.
- Check calculator inputs and representative results before releasing changes.
- Review analytics, advertising and consent configuration for the deployment.

## Learning focus

Translating practical calculations into browser interfaces, sharing logic across multiple pages and explaining assumptions clearly to users. Further improvements include automated calculation tests and broader accessibility checks.
