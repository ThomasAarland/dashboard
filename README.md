# Eiendomsdashboard

Dette repoet viser et UX-utkast til et eiendomsdashboard bygget med Vue 3, TypeScript og Vite. Appen etterligner et «bento»-oppsett hvor hver flis henter data fra en delt mock-tjeneste, og viser hvordan en bruker kan søke opp eiendommer og få ulike informasjonsblokker presentert etter valg.

## Tech-stack og mappeoversikt

- `src/pages/Dashboard.vue` – hovedsiden som organiserer alle fliser rad for rad.
- `src/components/bento/*` – generiske byggeklosser for fliser og grid.
- `src/components/dashboard/*` – alle dashbord-spesifikke fliser (søk, kart, eiere, osv.).
- `src/widgets/*` – gjenbrukbare presentasjonskomponenter (lister, KPI-kort, aktivitetslogg).
- `src/composables/useDashboard.ts` – laster og eksponerer mock-data.
- `src/services/dashboardService.ts` – typed modell + mock-API for eiendomsdata.
- `src/styles/main.css` – globale farger, typografi og knappestiler.

## Layout og rader

Dashboardet er delt i tydelige rader slik at designet enkelt kan justeres:

1. **Tilgang og søk** – `AccessSearchTile` viser status og lar deg velge eiendom.
2. **Tomt, areal og identifikasjon** – kombinasjon av KPI- og tekstfliser.
3. **Eiere** – hovedeiere, øvrige eiere og et KPI-kort for antall eiere deler raden 37.5 / 37.5 / 25 %.
4. **Bygninger og beliggenhet** – viser bygninger samt adresseinformasjon.
5. **Kart** – reservert helrad for fremtidig kartintegrasjon.
6. **Pant, aktivitet og servitutter** – juridiske opplysninger med aktivitetstidslinje i midten.

## Dataflyt

1. `useDashboard` kalles av `Dashboard.vue` og trigger `fetchDashboardData()` ved mount.
2. Tjenesten returnerer mock-data som er typed via `PropertyDashboardData` og tilhørende modeller.
3. `Dashboard.vue` splitter datastrukturene i flere `computed`-felt som mates inn i de respektive flisene.
4. `AccessSearchTile` emiterer `property-selected` når en eiendom velges. Siden lagrer valget og kaller `reload()` for å simulere oppslag.

## Kom i gang

```bash
npm install
npm run dev
# eller
npm run build && npm run preview
```

Mock-data og layout kan endres ved å oppdatere tjenestene og/eller justere grid-radene i `Dashboard.vue`. Kommentarene i kildekoden peker på hvordan fliser er bygget opp og hvordan data flyter mellom komponenter.
