# HIP-76954-DYNASTY

Nástěnka s informacemi o frakci **HIP 76954 DYNASTY**. Otevřete `index.html` a klikněte na tlačítko **Přehled**. Stránka se připojí k [EliteBGS API](https://elitebgs.app/) a zobrazí seznam všech systémů, kde je tato frakce přítomna. Každý systém je zobrazen v tlačítku se jménem a barevně označeným procentem vlivu frakce. Pokud není API dostupné, stránka se pokusí načíst lokální soubory `systemsPopulated.json`, `stations.json` apod., takže přehled lze zobrazit i offline.

U každého systému je zelené tlačítko **+** pro přidání mezi oblíbené na hlavní stránce. Kliknutím na název systému se zobrazí detailní informace ve stejném okně.

## Přihlášení

Před zobrazením stránky je vyžadováno přihlášení pomocí [Firebase Authentication](https://firebase.google.com/). Konfigurace projektu pro `hip-75964-dynasty` je již vložena v souboru `index.html`. Nově registrovaní uživatelé se ukládají do kolekce `users` ve službě Firestore.

## Lokální data

Pro demonstraci je v repozitáři přiložena minimální sada souborů `*.json` (např. `systemsPopulated.json`, `stations.json` atd.). Pokud jsou tyto soubory uložené vedle `index.html`, stránka načte a zobrazí doplňující informace v sekci *Lokální data* a zároveň umožní fungování přehledu i bez připojení k internetu. Bez těchto souborů se přehled při výpadku API nezobrazí.

Pro reálné použití nahraďte tyto ukázkové soubory aktuálními datovými dumpy z [EDSM](https://www.edsm.net/) nebo jiného zdroje.

