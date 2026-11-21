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
- Serie (1.11, Wunsch: mehr Lob, wenn mehrere hintereinander richtig): `SES.streak` zählt beim ersten Versuch richtige Antworten in Folge (falsch/zweiter Versuch → 0). `streakPraise(n)`: ab 2 eigenes Lob, ab 3 🔥 mit Bonus-Punkten (2/5/10/20), bei 3/5/7/10 Konfetti, ab 5 Fanfare, mit Namen des Kindes. Anzeige „🔥 n“ oben in der Übung, „Längste Serie“ im Ergebnis, `D().bestStreak` im Fortschritt. 1.12 (Wunsch: „Wow, du bist super / echt krass / du wirst immer besser, mach weiter so“ + Wow-Ton): Lob-Sätze zufällig je Stufe, `wowSound(lvl)` = synthetische „Wooow“-Stimme (Sägezahn durch Formant-Filter u→a→u) + ab 3 Klatschen + ab 5 Glitzer-Töne; nur bei „Töne“ an.

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

## Malen ab 1.8 (`src/paint.js`, `src/templates.js`)
- Wunsch: ca. 30 Ausmalbilder + ganzer Bildschirm; 1.9: insgesamt 100. `TPLS` = 100 Bilder in Kategorien `k` (`TPL_CATS`: Tiere 22, Fahrzeuge 9, Essen 7, Natur & Dinge 16, Mandalas 10 (erzeugt aus Blütenblatt-Ringen), Zahlen 1–10 (Ziffer + so viele Dinge), ABC 26 (hohler Groß-/Kleinbuchstabe aus `GLY`, Form ["g", Text, x, y, Höhe] → `tplGlyphs`, schwarzer dicker + weißer dünner Strich)). Auswahl mit Kategorie-Knöpfen. Eigene Strichzeichnungen (Blatt 300×400, Formen c/e/r/p/l/d, geschlossene Formen weiß gefüllt → verdeckte Linien verschwinden). Auswahl „🖍️ Ausmalbilder“ (Vorschau als SVG), „📄 Leeres Blatt“.
- Zeichnung `PDOC = {shapes, tpl, aspect}`: Blatt mit festem Seitenverhältnis (Handy-Höhe/Breite), Koordinaten 0…1 → keine Verzerrung zwischen normal und ganzem Bildschirm. Ebenen: `base` (Striche + Füllungen) → Linien des Ausmalbilds (`line`, darüber) → Stempel → Auswahlrahmen.
- Modi: 🖌️ Pinsel, 🪣 Füllen (Flood-Fill auf `base`, begrenzt durch Ausmalbild-Linien `lineMask` und durch andersfarbige Flächen; Linienrand wird mitgefärbt), 🧽 Schwamm, Stempel. „↩️“ entfernt den letzten Schritt (base wird neu aufgebaut).
- „⛶ Ganzer Bildschirm“ (`paintFull`, Ebene in der Zurück-Navigation, Vollbild-API): oben kompakte Leiste (✖ Klein, Modi, Größen, ↩️, 💾, Farben, Stempel), Malfläche füllt den Rest.
- 1.9.1: orangener Knopf „↩️ Rückgängig“ unten rechts auf der Malfläche (normal und ganzer Bildschirm), macht den letzten Schritt rückgängig.
- 1.10: runder Foto-Knopf 📷 unten links auf der Malfläche (`paint-photo` → `savePaint(true)`): speichert (seit 1.13.1 NUR in „Meine Bilder“, kein Download/keine Chrome-Nachfrage; aufs Handy nur über 💾 oben) (nur das Bild, ohne Knöpfe – `snapshot` nimmt nur die Mal-Ebenen), dazu Kamera-Geräusch „klick-klack“ (`shutter()`, Rauschen mit Web Audio, kein Ton-Datei) und weißer Blitz (Geräusch nur bei „Töne“ an).
- Speicherort: Eine Web-App kann auf Android keinen eigenen Ordner/kein Album anlegen – Bilder landen per Download in „Download“ (Name `Lern-App-Bild-…`), in Google Fotos unter Sammlungen → Auf diesem Gerät → Download. Dem Nutzer so erklärt (1.10).
- 1.13.2: In der normalen Ansicht ist die Malfläche (`canvas`) nur so breit wie das Blatt (in `size()` berechnet) – vorher ging sie über die ganze Breite mit grauen Rändern und `touch-action: none` verhinderte das Scrollen der Seite.
- Speichern speichert das Bild (ohne die Zeichnung zu löschen) in „Meine Bilder“ + Downloads.
- 1.13 Weitermalen (Wunsch: Bild unter „Meine Bilder“ antippen und weitermalen): Einträge `{id, img, doc}` (`doc` = Zeichnung mit gerundeten Koordinaten, `docForSave`); Antippen → `openPic` lädt `doc` (`PDOC.picId`); erneutes Speichern ersetzt den Eintrag statt neu anzufügen. Alte Einträge (nur Bild-Text) öffnen als Hintergrund `PDOC.bg`. `storePics` lässt bei vollem Speicher zuerst die Zeichnungen der ältesten Bilder weg. Vor dem Öffnen Nachfrage, wenn ungespeichert (`paintDirty`).
- 1.8.1: „💬 Schicken“ (WhatsApp) auf Wunsch des Nutzers komplett entfernt – klappte mit WhatsApp nicht; „Speichern reicht“. `exportPic` speichert nur noch (Download). Abschnitte oben zu Schicken/Teilen sind damit Geschichte.

## Arbeitsweise
- Testen mit Playwright/Chromium (vorinstalliert) über `python3 -m http.server`; alle Lektionen in einer Schleife generieren und prüfen (richtige Antwort in den Optionen, keine NaN/undefined).
- Inhalte (Wörter, Sätze, Diktate) in `data.js` ergänzen.
