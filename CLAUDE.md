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
- 6 Fächer (`AREAS`): Buchstaben (Kl. 1–2), Zahlen, Rechnen, Schreiben, „Was ist das?“ (sprechen), Deutsch. 138 Lektionen, Verteilung Kl.1: 40, Kl.2: 27, Kl.3: 19, Kl.4: 17, Kl.5: 17, Kl.6: 18.
- Textaufgaben (1.5, Wunsch: „Paul hat 8 Äpfel, 2 fallen runter …“): `sachTask(klasse, max)` mit Kindernamen (`KIDS`, er/sie) und Dingen (`DING`: Einzahl/Mehrzahl/Dativ, „weg“-Satz). Lektionen `r_text1` (bis 10, mit Bildchen), `r_text1b` (bis 20), `r_text2`–`r_text6` (Klasse 2: mal/geteilt, Geld, Beine; 3: Rückgeld, Autos mit Rest; 4: große Zahlen, kg, km; 5: Kino, Temperatur, Fläche, Bruchteil; 6: Rabatt, Euro mit Komma, Durchschnitt, Bruchteil, Verbrauch).
- `U(id, fach, klasse, icon, name, gen)` – `gen()` erzeugt bei jedem Start neue Aufgaben. Neue Lektion = eine `U(...)`-Zeile.
- Aufgaben-Arten: `choice` (antippen, `ot` = big/emoji/word, 2 Versuche, bei 2 Antworten 1), `num` (Ziffernblock + 🎤 Zahl sagen, `neg`/`dec` für Minus-/Komma-Taste), `speak` (Spracherkennung, `fb` = Ersatz-Auswahl für „Lieber antippen“ oder Browser ohne Spracherkennung), `trace` (nachspuren), `write` (frei schreiben, Erkennung), `type` (Diktat).
- Falsch beim ersten Versuch → Aufgabe kommt am Ende der Runde nochmal (max. 5).

## Schreiben mit dem Finger (glyphs.js)
- `GLY`: Druckschrift A–Z, Ä Ö Ü, a–z, ä ö ü ß, 0–9 als SVG-Striche in Schreibreihenfolge. Lineatur: Oberlinie 10, Mittellinie 40, Grundlinie 70, Unterlinie 92.
- Vorlage zeigt grüne Startpunkte mit Nummer und Richtungspfeil; „Zeig mir“ malt die Striche vor.
- Nachspuren-Prüfung `traceScore`: Abdeckung der Mittellinie ≥ 72 % und Tinte auf der Vorlage ≥ 68 %; Sterne nach Genauigkeit.
- Frei schreiben `recognize`: Form-Vergleich (Abstandskarten) mit allen Zeichen der Menge; richtig, wenn Ziel Platz 1 ist oder Platz 2 und höchstens 15 % schlechter. `ALT` = Kinder-Schreibweisen (1 als Strich, 7 mit Querstrich, 4 geschlossen). Test mit verzerrten Vorlagen: ca. 95–100 % je Zeichen.

## Sprache
- Vorlese-Figuren (1.1–1.2.1: Lumi, Mäuschen, Robo, Fee, Männer-Figuren …) hat der Nutzer in 1.3 wieder ganz entfernen lassen – nur noch Lumi (normale Handy-Stimme, Tonhöhe 1,05). Alte Einstellungen `style`/`vmap` werden beim Laden gelöscht. Grund: Chrome auf Android bietet meist nur eine (weibliche) deutsche Stimme, Tonhöhe allein klang nicht überzeugend.
- Lösung vorlesen: `solutionSpeech(t)` (1.1: bei Schreib-Aufgaben wurde „undefined“ vorgelesen, weil die Lösung dort in `t.g` steht, nicht in `t.a`).
- Was beim Start einer Aufgabe vorgelesen wird: `introSpeech(t)` – Hör-Aufgaben erst Frage, dann das Gehörte; in Klasse 1–2 werden Wort-Antworten mitgelesen („… Haus, Maus oder Hose?“). Jede Aufgabe mit Zeichen/Abkürzungen hat ein eigenes `say` (z. B. Einheiten über `unitSay`: „8 Meter sind wie viele Zentimeter?“, römische Zahlen buchstabiert, Fälle mit Satz). Prüfung 1.3: alle Lektionen durchlaufen, angezeigt vs. vorgelesen verglichen (keine Emoji, keine Zeichen wie · = + / ( ) im Vorlesetext).
- Vorlesen: `say()` mit deutscher Handy-Stimme (`de-DE`, Google bevorzugt), `speechText()` macht Rechenzeichen, Brüche (¾ → „drei Viertel“), Minus, Hochzahlen, Klammern sprechbar, entfernt Emoji und schreibt GROSSBUCHSTABEN-Wörter klein (sonst buchstabiert die Stimme sie). Einstellung „Aufgaben automatisch vorlesen“ (Standard an, wichtig für Kl. 1).
- Spracherkennung: `webDict()` (Chrome, `de-DE`, ein Satz pro Aufnahme, 3 Alternativen). `speechMatch` ignoriert Füllwörter (der/die/das/ein/ist …) und erlaubt kleine Abweichungen. `parseSpokenNum` versteht Ziffern und Zahlwörter („dreihundertvierundzwanzig“, „minus drei“, „zwei Komma fünf“).

## Malen und Fenster (1.4)
- Keine `confirm()`-Fenster mehr (die zeigten „http://onkelstuka-droid.github.io“, Nutzer wollte seinen Namen dort nicht sehen) – stattdessen eigenes Fenster `ask(text, ja, nein, bild)` → Promise.
- Malen (1.5, Nutzer fand die Knöpfe unter der Malfläche nicht): oben drei große Knöpfe „💾 Speichern“ (in „Meine Bilder“, max. 12, `lernapp_bilder_<id>`, UND als PNG in „Downloads“ über `exportPic`), „💬 Schicken“ (Teilen-Menü, z. B. WhatsApp), „🧽 Neu“. Galerie-Bilder: 📥 speichern, 💬 verschicken, ✖ löschen. 1.5.1 (Schicken gab Fehler am Handy): Bild-Datei wird synchron aus der Data-URL gebaut (`picFile`), damit `navigator.share` noch direkt nach dem Tippen läuft (vorher `await fetch` → Android verweigert); Teilen nur mit `files` + `text` (ohne `title`); bei Fehler zweiter Versuch über Frage-Fenster „Jetzt schicken“, sonst Download + Hinweis mit Fehlername. „💬 Teilen“ (1.4.1, Wunsch: Bild per WhatsApp an die Oma/Mutter) = Teilen-Menü mit Bild + Text „Schau mal, was ich gemalt habe!“. Einen Ordner direkt anlegen kann eine Web-App auf Android nicht.
- Einstellungen → „App weitergeben“ (`shareApp`): Link teilen. App ist kostenlos, ohne Anmeldung; jedes Handy hat eigenen Fortschritt (nur localStorage).

- 1.6: WhatsApp meldete „Teilen fehlgeschlagen“, wenn Bild + Text geteilt wurden → nur noch das Bild (JPEG) teilen. Malen hat Modi `PNT.mode` = pen | erase | stamp: „🧽 Schwamm“ radiert mit weißer Farbe (Breite = Pinselgröße · 2,5), 4 Größen; „🗑️ Neu“ löscht alles. `paintSync()` markiert die Knöpfe.
- 1.7: WhatsApp meldete trotzdem „Teilen fehlgeschlagen“ (Ursache am Gerät nicht prüfbar) → Teilen jetzt mit leerem `title` und verkleinertem JPEG (`PAINT.snapshot`, max. 1280 px); danach Hinweis „sonst 💾 Speichern und in WhatsApp über 📎 anhängen“. Stempel: Größe `s` je Stempel; im Stempel-Modus Stempel antippen = auswählen (gestrichelter Rahmen, nicht im gespeicherten Bild), mit einem Finger verschieben, mit zwei Fingern größer/kleiner ziehen, ➕/➖-Knöpfe. Fehler behoben: nach Stempeln hat der Pinsel weiter gestempelt (Abfrage jetzt `PNT.mode === "stamp"`).

## Arbeitsweise
- Testen mit Playwright/Chromium (vorinstalliert) über `python3 -m http.server`; alle Lektionen in einer Schleife generieren und prüfen (richtige Antwort in den Optionen, keine NaN/undefined).
- Inhalte (Wörter, Sätze, Diktate) in `data.js` ergänzen.
