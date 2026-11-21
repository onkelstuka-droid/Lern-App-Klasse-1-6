# Lern-App Klasse 1–6 – Projektübergabe für Claude

App-Link: https://onkelstuka-droid.github.io/Lern-App-Klasse-1-6/ (GitHub Pages aus `/ (root)` von `main`)
Nutzer: spricht Deutsch, Android-Handy (Pixel), kein Programmierer. Immer auf Deutsch antworten, einfach erklären, Schritte fürs Handy beschreiben.
Schwester-Projekte: Vokabelheft (github.com/onkelstuka-droid/Englisch) – von dort stammen Spracherkennung (`webDict`, `joinResults`, `dedupeWords`), Aufbau und Build.
Wünsche (21.11.2026): Kinder Klasse 1–6; Buchstaben, Zahlen, Rechnen; mit dem Finger Buchstaben/Zahlen schreiben und nachspuren; Bilder/Symbole benennen per Spracherkennung; übersichtlich und kindlich; Lernfortschritt sehen; Wiederholen; Malen (Nebensache); Stoff passend zur Klasse.

## Aufbau
- `src/` – Quellen: `body.html` (Grundgerüst), `style.css`, `data.js` (alle Inhalte/Wortlisten), `glyphs.js` (Schreibvorlagen + Prüfung), `units.js` (Aufgaben-Generatoren und Lektionen), `app.js` (Oberfläche, Speicher, Sprache).
- `build.py` – baut daraus eine einzige `index.html`, dazu `sw.js` (Offline-Cache `lernapp-<hash>`), `manifest.webmanifest`, `404.html`, `.nojekyll`; Icons nur wenn sie fehlen (Schrift `fonts/SPSans-Bold.ttf`, SIL OFL).
- Veröffentlichen: `python3 build.py`, committen, pushen, auf `main` bringen. Danach prüfen, ob „pages build and deployment“ erfolgreich war.
- Gleiche Herkunft (onkelstuka-droid.github.io) wie Vokabelheft und Schichtplaner → eigene Präfixe: localStorage `lernapp_v1` (alle Kinder) und `lernapp_bilder_<kindId>` (Bilder), Caches `lernapp-*` (der SW löscht nur diese).

## Speicher (`lernapp_v1`)
`{profiles:[{id,name,cls,av}], cur, set:{auto,sfx,voice,rate,goal}, data:{<id>:{xp, stars:{unit:0-3}, plays:{unit:{n,last}}, rev:{key:{b,d,n,w,t}}, hist:{"JJJJ-MM-TT":anzahl}, stk:[sticker], ok, all}}}`
- Mehrere Kinder (Profile) mit Name, Klasse 1–6, Tier-Bild.
- Wiederholen: jede Aufgabe mit `key` landet in `rev` (Kasten `b` 0–5, fällig am Tag `d`, Abstände 0/1/2/4/8/16 Tage, `t` = gespeicherte Aufgabe). „Wiederholen“ nimmt bis zu 12 fällige. Lektionen werden zusätzlich nach 1/3/7/14/30 Tagen als „mal wieder üben“ markiert.
- Sterne je Lektion: ≥90 % beim ersten Versuch = 3, ≥70 % = 2, sonst 1. Ab 2 Sternen ein neuer Sticker (48 Stück). Punkte: 10 erster Versuch, 5 zweiter. Level alle 150 Punkte. Tagesziel 10/15/20/30.
- Sicherung als JSON-Datei in den Einstellungen.

## Lektionen (units.js)
- 6 Fächer (`AREAS`): Buchstaben (Kl. 1–2), Zahlen, Rechnen, Schreiben, „Was ist das?“ (sprechen), Deutsch. 131 Lektionen, Verteilung Kl.1: 38, Kl.2: 26, Kl.3: 18, Kl.4: 16, Kl.5: 16, Kl.6: 17.
- `U(id, fach, klasse, icon, name, gen)` – `gen()` erzeugt bei jedem Start neue Aufgaben. Neue Lektion = eine `U(...)`-Zeile.
- Aufgaben-Arten: `choice` (antippen, `ot` = big/emoji/word, 2 Versuche, bei 2 Antworten 1), `num` (Ziffernblock + 🎤 Zahl sagen, `neg`/`dec` für Minus-/Komma-Taste), `speak` (Spracherkennung, `fb` = Ersatz-Auswahl für „Lieber antippen“ oder Browser ohne Spracherkennung), `trace` (nachspuren), `write` (frei schreiben, Erkennung), `type` (Diktat).
- Falsch beim ersten Versuch → Aufgabe kommt am Ende der Runde nochmal (max. 5).

## Schreiben mit dem Finger (glyphs.js)
- `GLY`: Druckschrift A–Z, Ä Ö Ü, a–z, ä ö ü ß, 0–9 als SVG-Striche in Schreibreihenfolge. Lineatur: Oberlinie 10, Mittellinie 40, Grundlinie 70, Unterlinie 92.
- Vorlage zeigt grüne Startpunkte mit Nummer und Richtungspfeil; „Zeig mir“ malt die Striche vor.
- Nachspuren-Prüfung `traceScore`: Abdeckung der Mittellinie ≥ 72 % und Tinte auf der Vorlage ≥ 68 %; Sterne nach Genauigkeit.
- Frei schreiben `recognize`: Form-Vergleich (Abstandskarten) mit allen Zeichen der Menge; richtig, wenn Ziel Platz 1 ist oder Platz 2 und höchstens 15 % schlechter. `ALT` = Kinder-Schreibweisen (1 als Strich, 7 mit Querstrich, 4 geschlossen). Test mit verzerrten Vorlagen: ca. 95–100 % je Zeichen.

## Sprache
- Vorlesen: `say()` mit deutscher Handy-Stimme (`de-DE`, Google bevorzugt), `speechText()` macht Rechenzeichen, Brüche (¾ → „drei Viertel“), Minus, Hochzahlen sprechbar. Einstellung „Aufgaben automatisch vorlesen“ (Standard an, wichtig für Kl. 1).
- Spracherkennung: `webDict()` (Chrome, `de-DE`, ein Satz pro Aufnahme, 3 Alternativen). `speechMatch` ignoriert Füllwörter (der/die/das/ein/ist …) und erlaubt kleine Abweichungen. `parseSpokenNum` versteht Ziffern und Zahlwörter („dreihundertvierundzwanzig“, „minus drei“, „zwei Komma fünf“).

## Arbeitsweise
- Testen mit Playwright/Chromium (vorinstalliert) über `python3 -m http.server`; alle Lektionen in einer Schleife generieren und prüfen (richtige Antwort in den Optionen, keine NaN/undefined).
- Inhalte (Wörter, Sätze, Diktate) in `data.js` ergänzen.
