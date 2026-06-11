# It-asset-inventory

A browser-based IT asset inventory dashboard built with plain HTML, CSS and JavaScript. No frameworks, no backend, no build steps — just open `index.html` and it works.

I built this to practice front-end development while making something that's actually useful in an IT support context. Asset tracking is one of those things a lot of small IT teams do in spreadsheets, so I wanted to see what a simple web version would look like.

## Features

- Dashboard with asset counts by status (Active, In Repair, Retired)
- Table view with filtering by type and status, and live search
- Add new assets with a form
- Edit and delete existing assets
- Data persists in localStorage so nothing is lost on refresh
- Comes with sample data so it looks useful straight away

## How to use

Just open `index.html` in a browser. No installation or server needed.

## Screenshots

Dashboard view showing asset summary stats and recent additions. The assets table supports filtering by type and status, with a search bar that filters across name, user, location and asset ID.

## Notes

Data is stored in the browser's localStorage. Clearing browser data will reset the inventory. This is a front-end only tool — there's no server or database behind it.

## Author

Onah Joshua — [GitHub](https://github.com/chibs3529)
