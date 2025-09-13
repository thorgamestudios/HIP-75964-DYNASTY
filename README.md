# HIP-76954-DYNASTY

Nástěnka s informacemi o frakci **HIP 76954 DYNASTY**. Otevřete `index.html` a klikněte na tlačítko **Přehled**. Stránka se připojí k [EliteBGS API](https://elitebgs.app/) a zobrazí seznam všech systémů, kde je tato frakce přítomna. Každý systém je zobrazen v tlačítku se jménem a barevně označeným procentem vlivu frakce.

U každého systému je zelené tlačítko **+** pro přidání mezi oblíbené na hlavní stránce. Kliknutím na název systému se zobrazí detailní informace ve stejném okně.

## Spuštění

Aby fungovalo načítání dat z API, je potřeba stránku spouštět z webového serveru a nikoli přímo z `file://`.
Nejjednodušší možnost je v kořenovém adresáři projektu spustit například vestavěný Python server:

```bash
python -m http.server 8000
```

Stránku pak otevřete v prohlížeči na adrese [http://localhost:8000/index.html](http://localhost:8000/index.html).
Pokud API odmítá CORS pro váš původ, zvažte hostování přes HTTPS nebo použití vlastního proxy serveru.

## Přihlášení

Před zobrazením stránky je vyžadováno přihlášení pomocí [Firebase Authentication](https://firebase.google.com/). Konfigurace projektu pro `hip-75964-dynasty` je již vložena v souboru `index.html`. Nově registrovaní uživatelé se ukládají do kolekce `users` ve službě Firestore.

## Lokální data

Pro demonstraci je v repozitáři přiložena minimální sada souborů `*.json` (např. `systemsPopulated.json`, `stations.json` atd.).
Pokud jsou tyto soubory uložené vedle `index.html`, stránka načte a zobrazí doplňující informace v sekci *Lokální data*.

Pro reálné použití nahraďte tyto ukázkové soubory aktuálními datovými dumpy z [EDSM](https://www.edsm.net/) nebo jiného zdroje.
