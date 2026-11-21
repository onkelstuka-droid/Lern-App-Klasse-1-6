/* ======================= INHALTE =======================
   Alles, was die Kinder lernen. Neue Wörter/Aufgaben einfach hier ergänzen.
   Trennzeichen: | zwischen Feldern, ; zwischen Auswahl-Möglichkeiten, , zwischen Alternativen. */

/* Anlaute: Buchstabe → Bilder, die damit anfangen */
const ANL = {
  A: "🐒 Affe,🍎 Apfel,🐜 Ameise,🍍 Ananas", B: "🍌 Banane,🌳 Baum,🐝 Biene,🐻 Bär,📖 Buch", C: "🤡 Clown,💻 Computer,🤠 Cowboy",
  D: "🦕 Dino,🐉 Drache,🐬 Delfin,🥫 Dose", E: "🦆 Ente,🐘 Elefant,🍓 Erdbeere,🌍 Erde", F: "🐟 Fisch,🦊 Fuchs,🐸 Frosch,🔥 Feuer,🚲 Fahrrad",
  G: "🦒 Giraffe,🥒 Gurke,🎁 Geschenk,🎸 Gitarre,👻 Gespenst", H: "🐕 Hund,🏠 Haus,🐇 Hase,🎩 Hut,❤️ Herz", I: "🦔 Igel,🏝️ Insel",
  J: "🧥 Jacke,🪀 Jojo,🐆 Jaguar", K: "🐈 Katze,🐄 Kuh,🧀 Käse,👑 Krone,🍰 Kuchen", L: "🦁 Löwe,🦙 Lama,🥄 Löffel,🚂 Lok",
  M: "🐁 Maus,🌙 Mond,🥕 Möhre,🌽 Mais,🥛 Milch", N: "👃 Nase,🍝 Nudeln,🦏 Nashorn,🥜 Nuss", O: "👵 Oma,👂 Ohr,🍊 Orange,🐙 Oktopus",
  P: "🐎 Pferd,🐧 Pinguin,🍄 Pilz,🍕 Pizza,🐼 Panda", Q: "🟩 Quadrat", R: "🚀 Rakete,🌈 Regenbogen,🤖 Roboter,🌹 Rose",
  S: "☀️ Sonne,🛋️ Sofa,🧦 Socke,🥗 Salat", T: "🐅 Tiger,🍅 Tomate,🧸 Teddy,🥁 Trommel", U: "🛸 Ufo,⏰ Uhr,🚇 U-Bahn",
  V: "🐦 Vogel,🌋 Vulkan,🏺 Vase", W: "🐋 Wal,☁️ Wolke,🐺 Wolf,🎲 Würfel", Y: "🧘 Yoga", Z: "🦓 Zebra,🍋 Zitrone,🚆 Zug,🦷 Zahn,⛺ Zelt"
};
const LETTER_GROUPS = ["AEIOU", "MLSN", "RTDH", "FWBP", "GKZJ", "CVQXY"];

/* Laute am Wortanfang (au, ei, eu, sch …) */
const LAUTE = "🚗 Auto|au,👁️ Auge|au,🍦 Eis|ei,🥚 Ei|ei,🦉 Eule|eu,💶 Euro|eu,🐑 Schaf|sch,✂️ Schere|sch,🐌 Schnecke|sch,⭐ Stern|st,🪑 Stuhl|st,🕷️ Spinne|sp,🪞 Spiegel|sp,🍳 Pfanne|pf,🩹 Pflaster|pf";

/* Umlaute und ß: Wort|fehlender Buchstabe|Bild */
const UML = "Bär|ä|🐻,Käse|ä|🧀,Löwe|ö|🦁,Löffel|ö|🥄,Tür|ü|🚪,Mütze|ü|🧢,Gemüse|ü|🥦,Brücke|ü|🌉,Fußball|ß|⚽,Straße|ß|🛣️,Füße|ß|🦶,Äpfel|Ä|🍎,Würfel|ü|🎲,Möhre|ö|🥕,Schlüssel|ü|🔑,Mäuse|ä|🐭,Bäume|ä|🌳,Schildkröte|ö|🐢,Blätter|ä|🍂";

/* Silben: Bild|Wort mit Silbenstrichen */
const SILB = "🍌|Ba-na-ne,🐘|E-le-fant,🐕|Hund,🏠|Haus,🐇|Ha-se,🍎|Ap-fel,🦒|Gi-raf-fe,🍅|To-ma-te,🚀|Ra-ke-te,🐟|Fisch,🦊|Fuchs,🌙|Mond,🐁|Maus,🥕|Möh-re,🦁|Lö-we,🐧|Pin-gu-in,🐙|Ok-to-pus,🦔|I-gel,🐝|Bie-ne,🌈|Re-gen-bo-gen,🤖|Ro-bo-ter,🍓|Erd-bee-re,🦓|Ze-bra,🍋|Zi-tro-ne,🐊|Kro-ko-dil,🦋|Schmet-ter-ling,🍉|Me-lo-ne,🎈|Luft-bal-lon,🐢|Schild-krö-te,🌻|Son-nen-blu-me,☀️|Son-ne,🚲|Fahr-rad,🧸|Ted-dy,🍕|Piz-za,🐸|Frosch,⭐|Stern,🐌|Schne-cke,🦉|Eu-le,🐄|Kuh,🐑|Schaf";

/* Reime: Paare (Bild Wort) */
const REIME = "🏠 Haus|🐁 Maus,🌹 Rose|👖 Hose,🐕 Hund|👄 Mund,🐈 Katze|🐾 Tatze,🐻 Bär|🌊 Meer,🐇 Hase|👃 Nase,🦔 Igel|🪞 Spiegel,🍞 Brot|⛵ Boot,🦵 Bein|🐷 Schwein,✋ Hand|🏖️ Sand,🐄 Kuh|👟 Schuh,🥚 Ei|🥣 Brei,💰 Geld|⛺ Zelt,🔔 Glocke|🧦 Socke";

/* Bilder-Wörter: Bild|Wort|Artikel|Mehrzahl|weitere richtige Antworten.  - = gibt es nicht */
const WORDS = {
  tiere: "🐶|Hund|der|Hunde|Hündchen,Welpe;🐱|Katze|die|Katzen|Kätzchen,Mieze,Kater;🐭|Maus|die|Mäuse|;🐰|Hase|der|Hasen|Kaninchen;🦊|Fuchs|der|Füchse|;🐻|Bär|der|Bären|Braunbär;🐼|Panda|der|Pandas|Pandabär;🐷|Schwein|das|Schweine|Ferkel;🐮|Kuh|die|Kühe|Rind;🐸|Frosch|der|Frösche|;🐵|Affe|der|Affen|;🐔|Huhn|das|Hühner|Henne;🐧|Pinguin|der|Pinguine|;🐦|Vogel|der|Vögel|;🐟|Fisch|der|Fische|;🐴|Pferd|das|Pferde|Pony;🦁|Löwe|der|Löwen|;🐘|Elefant|der|Elefanten|;🦒|Giraffe|die|Giraffen|;🐢|Schildkröte|die|Schildkröten|;🐝|Biene|die|Bienen|;🦋|Schmetterling|der|Schmetterlinge|;🐌|Schnecke|die|Schnecken|;🐑|Schaf|das|Schafe|;🦉|Eule|die|Eulen|;🦆|Ente|die|Enten|;🐍|Schlange|die|Schlangen|;🦓|Zebra|das|Zebras|;🐳|Wal|der|Wale|;🦔|Igel|der|Igel|",
  obst: "🍎|Apfel|der|Äpfel|;🍌|Banane|die|Bananen|;🍓|Erdbeere|die|Erdbeeren|;🍇|Trauben|die|-|Weintrauben,Traube;🍊|Orange|die|Orangen|Apfelsine,Mandarine;🍋|Zitrone|die|Zitronen|;🍐|Birne|die|Birnen|;🍒|Kirschen|die|-|Kirsche;🍉|Melone|die|Melonen|Wassermelone;🍍|Ananas|die|Ananas|;🥕|Möhre|die|Möhren|Karotte,Mohrrübe;🥒|Gurke|die|Gurken|;🍅|Tomate|die|Tomaten|;🌽|Mais|der|-|Maiskolben;🥦|Brokkoli|der|-|;🥔|Kartoffel|die|Kartoffeln|;🧅|Zwiebel|die|Zwiebeln|;🍄|Pilz|der|Pilze|;🥜|Erdnuss|die|Erdnüsse|Nuss;🍑|Pfirsich|der|Pfirsiche|",
  essen: "🍞|Brot|das|Brote|;🧀|Käse|der|-|;🥚|Ei|das|Eier|;🥛|Milch|die|-|;🍕|Pizza|die|Pizzen|;🍦|Eis|das|-|Eiscreme;🍰|Kuchen|der|Kuchen|Torte;🍪|Keks|der|Kekse|Plätzchen;🍝|Nudeln|die|-|Spaghetti,Nudel;🍫|Schokolade|die|-|;🥨|Brezel|die|Brezeln|;🍯|Honig|der|-|;🧃|Saft|der|Säfte|;🍭|Lutscher|der|Lutscher|Lolli;🍟|Pommes|die|-|Pommes frites;🥐|Croissant|das|Croissants|Hörnchen;🍔|Burger|der|Burger|Hamburger;🥞|Pfannkuchen|der|Pfannkuchen|Eierkuchen",
  fahr: "🚗|Auto|das|Autos|;🚌|Bus|der|Busse|;🚲|Fahrrad|das|Fahrräder|Rad;🚂|Zug|der|Züge|Lok,Eisenbahn,Lokomotive;✈️|Flugzeug|das|Flugzeuge|;🚀|Rakete|die|Raketen|;🚢|Schiff|das|Schiffe|;⛵|Segelboot|das|Segelboote|Boot;🚁|Hubschrauber|der|Hubschrauber|Helikopter;🚒|Feuerwehrauto|das|Feuerwehrautos|Feuerwehr;🚑|Krankenwagen|der|Krankenwagen|Rettungswagen;🚓|Polizeiauto|das|Polizeiautos|Polizei;🚜|Traktor|der|Traktoren|Trecker;🛴|Roller|der|Roller|Tretroller;🏍️|Motorrad|das|Motorräder|;🚚|Lastwagen|der|Lastwagen|LKW,Laster",
  haus: "🏠|Haus|das|Häuser|;🛏️|Bett|das|Betten|;🪑|Stuhl|der|Stühle|;🚪|Tür|die|Türen|;🛁|Badewanne|die|Badewannen|;🔑|Schlüssel|der|Schlüssel|;💡|Lampe|die|Lampen|Glühbirne;⏰|Wecker|der|Wecker|Uhr;📺|Fernseher|der|Fernseher|;☎️|Telefon|das|Telefone|;🧸|Teddy|der|Teddys|Teddybär,Kuscheltier;⚽|Ball|der|Bälle|Fußball;🎈|Luftballon|der|Luftballons|Ballon;🪁|Drachen|der|Drachen|;🧩|Puzzle|das|Puzzles|;🎁|Geschenk|das|Geschenke|Paket;🎲|Würfel|der|Würfel|;🥄|Löffel|der|Löffel|;🧹|Besen|der|Besen|",
  kleid: "👕|T-Shirt|das|T-Shirts|Shirt,Hemd;👖|Hose|die|Hosen|Jeans;👗|Kleid|das|Kleider|;🧦|Socken|die|-|Socke,Strümpfe;🧢|Mütze|die|Mützen|Kappe,Cap,Basecap;🧤|Handschuhe|die|-|Handschuh;🧣|Schal|der|Schals|;👟|Schuh|der|Schuhe|Turnschuh,Sneaker,Schuhe;🧥|Jacke|die|Jacken|Mantel;👓|Brille|die|Brillen|;👂|Ohr|das|Ohren|;👃|Nase|die|Nasen|;👁️|Auge|das|Augen|;👄|Mund|der|Münder|Lippen;✋|Hand|die|Hände|;🦶|Fuß|der|Füße|;🦵|Bein|das|Beine|;🦷|Zahn|der|Zähne|;💪|Arm|der|Arme|Muskel;🧠|Gehirn|das|Gehirne|Hirn",
  farb: "🔴|rot|-|-|;🔵|blau|-|-|;🟢|grün|-|-|;🟡|gelb|-|-|;🟠|orange|-|-|;🟣|lila|-|-|violett;⚫|schwarz|-|-|;⚪|weiß|-|-|;🟤|braun|-|-|;⭐|Stern|der|Sterne|;❤️|Herz|das|Herzen|;🔺|Dreieck|das|Dreiecke|;🟩|Quadrat|das|Quadrate|Viereck;⭕|Kreis|der|Kreise|Ring;🔷|Raute|die|Rauten|",
  natur: "☀️|Sonne|die|Sonnen|;🌙|Mond|der|Monde|;☁️|Wolke|die|Wolken|;🌧️|Regen|der|-|Regenwolke;⛈️|Gewitter|das|Gewitter|;❄️|Schneeflocke|die|Schneeflocken|Schnee;⛄|Schneemann|der|Schneemänner|;🌈|Regenbogen|der|Regenbögen|;🌳|Baum|der|Bäume|;🌲|Tannenbaum|der|Tannenbäume|Tanne;🌷|Tulpe|die|Tulpen|Blume;🌻|Sonnenblume|die|Sonnenblumen|;🍂|Blätter|die|-|Blatt,Laub;🌵|Kaktus|der|Kakteen|;⛰️|Berg|der|Berge|;🌊|Welle|die|Wellen|Meer;🔥|Feuer|das|Feuer|;💧|Tropfen|der|Tropfen|Wassertropfen;🌪️|Tornado|der|Tornados|Wirbelsturm;🌋|Vulkan|der|Vulkane|;🏝️|Insel|die|Inseln|",
  gefuehl: "😀|fröhlich|-|-|froh,glücklich,lachen,lustig;😢|traurig|-|-|weinen;😠|wütend|-|-|sauer,böse;😨|ängstlich|-|-|Angst,erschrocken;😴|müde|-|-|schlafen,schläfrig;😲|überrascht|-|-|erstaunt;🤒|krank|-|-|Fieber;😋|lecker|-|-|hungrig;🥶|kalt|-|-|frieren;🥵|heiß|-|-|warm,schwitzen;🤔|nachdenklich|-|-|überlegen,nachdenken;😍|verliebt|-|-|Liebe;😎|cool|-|-|lässig",
  berufe: "👩‍🚒|Feuerwehrfrau|die|-|Feuerwehrmann,Feuerwehr;👮|Polizist|der|-|Polizistin,Polizei;🧑‍⚕️|Arzt|der|-|Ärztin,Doktor;🧑‍🏫|Lehrerin|die|-|Lehrer;🧑‍🍳|Koch|der|-|Köchin;🧑‍🌾|Bäuerin|die|-|Bauer,Landwirt,Landwirtin;🧑‍🔧|Mechaniker|der|-|Mechanikerin,Handwerker;🧑‍🚀|Astronaut|der|-|Astronautin;🧑‍✈️|Pilotin|die|-|Pilot;🧑‍🎨|Maler|der|-|Malerin,Künstler,Künstlerin;🧑‍🎤|Sänger|der|-|Sängerin;👷|Bauarbeiter|der|-|Bauarbeiterin;🧙|Zauberer|der|-|Zauberin,Hexe;🧑‍🔬|Forscherin|die|-|Forscher,Wissenschaftler,Wissenschaftlerin",
  schule: "🎒|Schulranzen|der|-|Ranzen,Rucksack,Schultasche,Tornister;✏️|Bleistift|der|Bleistifte|Stift;🖍️|Wachsmalstift|der|Wachsmalstifte|Buntstift,Stift,Malstift;📏|Lineal|das|Lineale|;✂️|Schere|die|Scheren|;📕|Buch|das|Bücher|;📒|Heft|das|Hefte|;🖌️|Pinsel|der|Pinsel|;📐|Geodreieck|das|-|Dreieck;🧮|Rechenrahmen|der|-|Abakus,Rechenschieber;🏫|Schule|die|Schulen|;🔔|Glocke|die|Glocken|Klingel;🗑️|Mülleimer|der|-|Papierkorb,Mülltonne;🌍|Globus|der|Globen|Erde,Weltkugel;🖥️|Computer|der|Computer|Bildschirm,Monitor",
  zeichen: "🛑|Stoppschild|das|-|Stopp,Stop;🚦|Ampel|die|Ampeln|;🚸|Achtung Kinder|-|-|Kinder,Schulweg;⚠️|Achtung|-|-|Warnung,Vorsicht,Gefahr;♻️|Recycling|-|-|Mülltrennung,Wiederverwerten;🚭|Rauchen verboten|-|-|nicht rauchen;🚫|verboten|-|-|Verbot;♿|Rollstuhl|der|-|Rollstuhlfahrer,barrierefrei;🚾|Toilette|die|-|WC,Klo;🅿️|Parkplatz|der|-|parken;✅|richtig|-|-|Haken,erledigt;❌|falsch|-|-|Kreuz;❓|Fragezeichen|das|-|Frage;❗|Ausrufezeichen|das|-|;➕|plus|-|-|Pluszeichen;➖|minus|-|-|Minuszeichen;🆘|SOS|-|-|Hilfe,Notruf;🏥|Krankenhaus|das|-|Klinik",
  sport: "🎸|Gitarre|die|Gitarren|;🎹|Klavier|das|Klaviere|Keyboard,Piano;🥁|Trommel|die|Trommeln|Schlagzeug;🎺|Trompete|die|Trompeten|;🎻|Geige|die|Geigen|Violine;🎷|Saxofon|das|Saxofone|Saxophon;🪗|Akkordeon|das|Akkordeons|Ziehharmonika;🎤|Mikrofon|das|Mikrofone|;🏀|Basketball|der|Basketbälle|;🎾|Tennis|das|-|Tennisball;🏊|Schwimmen|das|-|schwimmen;🚴|Radfahren|das|-|Fahrrad fahren;⛷️|Skifahren|das|-|Ski;🏓|Tischtennis|das|-|;🥋|Judo|das|-|Karate;🏆|Pokal|der|Pokale|;🥇|Medaille|die|Medaillen|Goldmedaille",
  laender: "🇩🇪|Deutschland|-|-|;🇦🇹|Österreich|-|-|;🇨🇭|Schweiz|-|-|;🇫🇷|Frankreich|-|-|;🇮🇹|Italien|-|-|;🇪🇸|Spanien|-|-|;🇬🇧|Großbritannien|-|-|England,Vereinigtes Königreich;🇺🇸|USA|-|-|Amerika,Vereinigte Staaten;🇵🇱|Polen|-|-|;🇳🇱|Niederlande|-|-|Holland;🇹🇷|Türkei|-|-|;🇬🇷|Griechenland|-|-|;🇯🇵|Japan|-|-|;🇨🇳|China|-|-|;🇧🇷|Brasilien|-|-|;🇵🇭|Philippinen|-|-|;🇩🇰|Dänemark|-|-|;🇸🇪|Schweden|-|-|;🇺🇦|Ukraine|-|-|;🇮🇳|Indien|-|-|;🇦🇺|Australien|-|-|;🇨🇦|Kanada|-|-|;🇪🇬|Ägypten|-|-|",
  welt: "🌍|Erde|die|-|Weltkugel,Globus;🪐|Planet|der|Planeten|Saturn;☄️|Komet|der|Kometen|;🌌|Milchstraße|die|-|Galaxie;🔭|Teleskop|das|Teleskope|Fernrohr;🛰️|Satellit|der|Satelliten|;🧑‍🚀|Astronaut|der|Astronauten|Astronautin,Raumfahrer;🏔️|Gebirge|das|-|Berg,Berge;🏜️|Wüste|die|Wüsten|;🌊|Ozean|der|Ozeane|Meer;🧭|Kompass|der|Kompasse|;🗺️|Landkarte|die|Landkarten|Karte,Weltkarte;🌡️|Thermometer|das|Thermometer|;⚡|Blitz|der|Blitze|;🧊|Eis|das|-|Eiswürfel;🌋|Vulkan|der|Vulkane|",
  wiss: "🔬|Mikroskop|das|Mikroskope|;🧲|Magnet|der|Magnete|;🧪|Reagenzglas|das|Reagenzgläser|;🔋|Batterie|die|Batterien|Akku;💡|Glühbirne|die|Glühbirnen|Lampe;⚙️|Zahnrad|das|Zahnräder|;🧬|DNA|die|-|Erbgut,DNS;🦠|Bakterie|die|Bakterien|Virus,Keim;🔌|Stecker|der|Stecker|Netzstecker;🖨️|Drucker|der|Drucker|;📡|Satellitenschüssel|die|-|Antenne,Schüssel;⚖️|Waage|die|Waagen|;🧯|Feuerlöscher|der|Feuerlöscher|;🔩|Schraube|die|Schrauben|Mutter;🔧|Schraubenschlüssel|der|-|;🔨|Hammer|der|Hämmer|;⏳|Sanduhr|die|Sanduhren|;🧱|Ziegelstein|der|Ziegelsteine|Ziegel,Stein,Mauer"
};
const WCAT = { tiere: "Tiere", obst: "Obst & Gemüse", essen: "Essen & Trinken", fahr: "Fahrzeuge", haus: "Zuhause & Spielzeug", kleid: "Kleidung & Körper", farb: "Farben & Formen", natur: "Natur & Wetter", gefuehl: "Gefühle", berufe: "Berufe", schule: "In der Schule", zeichen: "Zeichen & Symbole", sport: "Musik & Sport", laender: "Länder & Flaggen", welt: "Erde & Weltall", wiss: "Wissenschaft & Technik" };

/* Wortarten (Klasse 2–3) */
const NOMEN = "Hund,Haus,Baum,Ball,Schule,Tisch,Blume,Auto,Katze,Buch,Sonne,Apfel,Fenster,Tür,Garten,Stuhl,Vogel,Freund,Lehrerin,Brot";
const VERBEN = "laufen,spielen,lesen,schreiben,malen,singen,springen,essen,trinken,schlafen,lachen,rennen,schwimmen,tanzen,bauen,rufen,fliegen,sehen,hören,kochen";
const ADJEKTIVE = "groß,klein,schnell,langsam,schön,laut,leise,rot,lustig,müde,warm,kalt,nett,dick,dünn,hell,dunkel,neu,alt,süß";

/* Verben beugen: Grundform:ich,du,er/sie/es,wir,ihr,sie */
const KONJ = "spielen:spiele,spielst,spielt,spielen,spielt,spielen;lachen:lache,lachst,lacht,lachen,lacht,lachen;malen:male,malst,malt,malen,malt,malen;singen:singe,singst,singt,singen,singt,singen;gehen:gehe,gehst,geht,gehen,geht,gehen;kommen:komme,kommst,kommt,kommen,kommt,kommen;laufen:laufe,läufst,läuft,laufen,lauft,laufen;lesen:lese,liest,liest,lesen,lest,lesen;essen:esse,isst,isst,essen,esst,essen;fahren:fahre,fährst,fährt,fahren,fahrt,fahren;sein:bin,bist,ist,sind,seid,sind;haben:habe,hast,hat,haben,habt,haben;schlafen:schlafe,schläfst,schläft,schlafen,schlaft,schlafen;tanzen:tanze,tanzt,tanzt,tanzen,tanzt,tanzen";
const PRON = ["ich", "du", "er", "wir", "ihr", "sie (viele)"];

/* Zeitformen: Grundform|er (jetzt)|er (Präteritum)|Perfekt (Hilfsverb + Partizip)|Satzrest */
const VT = "gehen|geht|ging|ist gegangen|nach Hause;spielen|spielt|spielte|hat gespielt|Fußball;lesen|liest|las|hat gelesen|ein Buch;essen|isst|aß|hat gegessen|einen Apfel;laufen|läuft|lief|ist gelaufen|zur Schule;schreiben|schreibt|schrieb|hat geschrieben|einen Brief;singen|singt|sang|hat gesungen|ein Lied;fahren|fährt|fuhr|ist gefahren|mit dem Rad;trinken|trinkt|trank|hat getrunken|Saft;sehen|sieht|sah|hat gesehen|einen Film;kommen|kommt|kam|ist gekommen|zu spät;schwimmen|schwimmt|schwamm|ist geschwommen|im See;malen|malt|malte|hat gemalt|ein Bild;lachen|lacht|lachte|hat gelacht|laut;springen|springt|sprang|ist gesprungen|ins Wasser;finden|findet|fand|hat gefunden|den Schlüssel;schlafen|schläft|schlief|hat geschlafen|lange;rufen|ruft|rief|hat gerufen|die Katze;bringen|bringt|brachte|hat gebracht|die Post;denken|denkt|dachte|hat gedacht|an Oma;werfen|wirft|warf|hat geworfen|den Ball;helfen|hilft|half|hat geholfen|der Oma;nehmen|nimmt|nahm|hat genommen|den Bus;geben|gibt|gab|hat gegeben|ein Geschenk;fliegen|fliegt|flog|ist geflogen|nach Spanien;bauen|baut|baute|hat gebaut|ein Haus;kaufen|kauft|kaufte|hat gekauft|Brot;tanzen|tanzt|tanzte|hat getanzt|im Wohnzimmer";
const SUBJ = ["Tim", "Lena", "Oma", "Mein Bruder", "Die Lehrerin", "Ali", "Mia"];

const GEGEN = "groß|klein,laut|leise,schnell|langsam,hell|dunkel,warm|kalt,alt|neu,dick|dünn,hoch|tief,voll|leer,nass|trocken,lang|kurz,schwer|leicht,oben|unten,früh|spät,hart|weich,stark|schwach,viel|wenig,offen|geschlossen,sauber|schmutzig,fröhlich|traurig";

/* i oder ie? Wort:richtig */
const IE = "Lied:ie,Biene:ie,Tier:ie,Spiegel:ie,Wiese:ie,Ziege:ie,Brief:ie,Fliege:ie,Riese:ie,Dieb:ie,sieben:ie,Papier:ie,Kind:i,Fisch:i,Tisch:i,Brille:i,Kino:i,Tiger:i,Bild:i,Licht:i,Wind:i,Mitte:i,Igel:i,Insel:i";

/* s, ss oder ß? */
const SSS = "Fußball:ß,Wasser:ss,Haus:s,Straße:ß,Schloss:ss,Gläser:s,groß:ß,Tasse:ss,Rose:s,bisschen:ss,Messer:ss,Spaß:ß,Gruß:ß,Fluss:ss,Käse:s,heiß:ß,Nuss:ss,Füße:ß,Fass:ss,Bus:s,Glas:s,Schuss:ss,Maß:ß,Kissen:ss,Hose:s,süß:ß,Klasse:ss,Grüße:ß";

/* Satzzeichen am Ende */
const SATZEND = "Wie heißt du|?;Ich heiße Mia|.;Pass auf|!;Wo wohnst du|?;Heute scheint die Sonne|.;Hilfe|!;Magst du Eis|?;Der Hund bellt|.;Komm schnell her|!;Wann kommt Oma|?;Wir spielen im Garten|.;Was machst du|?;Ich habe Hunger|.;Toll gemacht|!;Hast du Zeit|?;Mein Ball ist rot|.";

/* Zusammengesetzte Nomen: Wort1|Artikel1|Wort2|Artikel2|Ergebnis */
const ZUS = "Schnee|der|Mann|der|Schneemann;Hand|die|Schuh|der|Handschuh;Sonne|die|Blume|die|Sonnenblume;Fuß|der|Ball|der|Fußball;Apfel|der|Baum|der|Apfelbaum;Tisch|der|Lampe|die|Tischlampe;Zahn|der|Bürste|die|Zahnbürste;Regen|der|Schirm|der|Regenschirm;Haus|das|Tür|die|Haustür;Wasser|das|Glas|das|Wasserglas;Kinder|die|Zimmer|das|Kinderzimmer;Spiel|das|Platz|der|Spielplatz;Schule|die|Tasche|die|Schultasche;Geburtstag|der|Kuchen|der|Geburtstagskuchen";

/* Allgemeine Fragen: Frage|richtig|falsch1;falsch2;falsch3|Tipp  (Zeilen durch Zeilenumbruch getrennt) */
const Q = {
  dass: `Ich hoffe, ___ du kommst.|dass|das|Kann man „dieses“ oder „welches“ einsetzen? Dann „das“, sonst „dass“.
Das Buch, ___ ich lese, ist spannend.|das|dass|„welches“ passt → das.
___ ist mein Hund.|Das|Dass|„Dieses“ passt → Das.
Weißt du, ___ heute Ferien sind?|dass|das|„dieses/welches“ passt nicht → dass.
Ich glaube, ___ es regnet.|dass|das|„dieses/welches“ passt nicht → dass.
Das Haus, ___ dort steht, ist alt.|das|dass|„welches“ passt → das.
Er sagt, ___ er müde ist.|dass|das|„dieses/welches“ passt nicht → dass.
Siehst du ___ Auto?|das|dass|„dieses“ passt → das.
Es ist schön, ___ du da bist.|dass|das|„dieses/welches“ passt nicht → dass.
Das Kind, ___ lacht, heißt Mia.|das|dass|„welches“ passt → das.
Ich weiß, ___ du das kannst.|dass|das|„dieses/welches“ passt nicht → dass.
Wo ist ___ Fahrrad?|das|dass|„dieses“ passt → das.
Mama freut sich, ___ wir helfen.|dass|das|„dieses/welches“ passt nicht → dass.
Ich mag ___ Lied sehr.|das|dass|„dieses“ passt → das.`,
  wf: `Welches Wort gehört NICHT zur Wortfamilie „fahren“?|Farbe|Fahrrad;Fahrer;Abfahrt|Fahrrad, Fahrer, Abfahrt haben alle den Wortstamm „fahr“.
Welches Wort gehört NICHT zur Wortfamilie „spielen“?|Spiegel|Spielplatz;Spieler;verspielt|Der Wortstamm ist „spiel“.
Welches Wort gehört NICHT zur Wortfamilie „Haus“?|Hase|Häuschen;Hausaufgabe;Haustür|Der Wortstamm ist „haus/häus“.
Welches Wort gehört NICHT zur Wortfamilie „schreiben“?|Schrei|Schreibtisch;Schrift;beschreiben|„Schrei“ kommt von „schreien“.
Welches Wort gehört NICHT zur Wortfamilie „backen“?|Backe|Bäcker;Backofen;Gebäck|Die Backe ist ein Teil vom Gesicht.
Welches Wort gehört NICHT zur Wortfamilie „lesen“?|Besen|Leser;Lesebuch;vorlesen|Der Wortstamm ist „les“.
Welches Wort gehört NICHT zur Wortfamilie „Kind“?|Kinn|kindlich;Kindergarten;Kindheit|Das Kinn ist ein Teil vom Gesicht.
Welches Wort gehört NICHT zur Wortfamilie „fliegen“?|Flöte|Flugzeug;Flieger;Flug|Fliegen, Flug, Flieger gehören zusammen.
Welches Wort gehört NICHT zur Wortfamilie „Schnee“?|Schnecke|Schneemann;schneien;Schneeflocke|Die Schnecke hat nichts mit Schnee zu tun.
Welches Wort gehört NICHT zur Wortfamilie „Freund“?|fremd|freundlich;Freundschaft;befreundet|Der Wortstamm ist „freund“.
Welches Wort gehört NICHT zur Wortfamilie „Wasser“?|Waschbär|wässrig;Wasserfall;bewässern|Der Wortstamm ist „wasser/wässr“.`,
  komma: `Wo sind die Kommas richtig?|Ich mag Äpfel, Birnen und Bananen.|Ich mag Äpfel Birnen, und Bananen.;Ich mag, Äpfel Birnen und Bananen.|Bei Aufzählungen steht ein Komma – aber nicht vor „und“.
Wo ist das Komma richtig?|Ich bleibe zu Hause, weil ich krank bin.|Ich bleibe, zu Hause weil ich krank bin.;Ich bleibe zu Hause weil, ich krank bin.|Vor „weil“ steht ein Komma.
Wo ist das Komma richtig?|Wenn es regnet, nehme ich einen Schirm.|Wenn es, regnet nehme ich einen Schirm.;Wenn es regnet nehme, ich einen Schirm.|Der Nebensatz endet mit dem Verb – danach kommt das Komma.
Wo ist das Komma richtig?|Lisa, komm bitte her!|Lisa komm, bitte her!;Lisa komm bitte, her!|Nach einer Anrede steht ein Komma.
Wo ist das Komma richtig?|Er sagt, dass er kommt.|Er sagt dass, er kommt.;Er, sagt dass er kommt.|Vor „dass“ steht ein Komma.
Wo sind die Kommas richtig?|Der Hund, der laut bellt, heißt Bello.|Der Hund der, laut bellt heißt, Bello.;Der Hund der laut, bellt heißt Bello.|Ein eingeschobener Satz steht zwischen zwei Kommas.
Wo ist das Komma richtig?|Ich lese ein Buch, aber Tom spielt Fußball.|Ich lese, ein Buch aber Tom spielt Fußball.;Ich lese ein Buch aber, Tom spielt Fußball.|Vor „aber“ steht ein Komma.
Wo ist das Komma richtig?|Wir spielen, singen und tanzen.|Wir spielen singen, und tanzen.;Wir, spielen singen und tanzen.|Aufzählung: Komma, aber nicht vor „und“.
Wo ist das Komma richtig?|Obwohl es kalt ist, gehen wir raus.|Obwohl es kalt, ist gehen wir raus.;Obwohl, es kalt ist gehen wir raus.|Der Nebensatz mit „obwohl“ wird durch ein Komma abgetrennt.
Wo ist das Komma richtig?|Ich hoffe, dass du kommst.|Ich hoffe dass, du kommst.;Ich, hoffe dass du kommst.|Vor „dass“ steht ein Komma.
Wo ist das Komma richtig?|Ja, das stimmt.|Ja das, stimmt.;Ja das stimmt.|Nach „Ja“ oder „Nein“ am Satzanfang steht ein Komma.`,
  fall: `<b>Der Hund</b> bellt.|Nominativ|Akkusativ;Dativ;Genitiv|Wer oder was bellt? → Nominativ
Ich sehe <b>den Hund</b>.|Akkusativ|Nominativ;Dativ;Genitiv|Wen oder was sehe ich? → Akkusativ
Ich gebe <b>dem Hund</b> einen Knochen.|Dativ|Nominativ;Akkusativ;Genitiv|Wem gebe ich etwas? → Dativ
Das ist der Ball <b>des Hundes</b>.|Genitiv|Nominativ;Akkusativ;Dativ|Wessen Ball? → Genitiv
<b>Die Katze</b> schläft.|Nominativ|Akkusativ;Dativ;Genitiv|Wer oder was schläft? → Nominativ
Wir besuchen <b>die Oma</b>.|Akkusativ|Nominativ;Dativ;Genitiv|Wen besuchen wir? → Akkusativ
Ich helfe <b>meiner Mutter</b>.|Dativ|Nominativ;Akkusativ;Genitiv|Wem helfe ich? → Dativ
Das Auto <b>meines Vaters</b> ist rot.|Genitiv|Nominativ;Akkusativ;Dativ|Wessen Auto? → Genitiv
Er schenkt <b>dem Kind</b> ein Buch.|Dativ|Nominativ;Akkusativ;Genitiv|Wem schenkt er etwas? → Dativ
Er schenkt dem Kind <b>ein Buch</b>.|Akkusativ|Nominativ;Dativ;Genitiv|Wen oder was schenkt er? → Akkusativ
Die Farbe <b>des Himmels</b> ist blau.|Genitiv|Nominativ;Akkusativ;Dativ|Wessen Farbe? → Genitiv
Ich spiele mit <b>dem Ball</b>.|Dativ|Nominativ;Akkusativ;Genitiv|Nach „mit“ steht immer der Dativ.
Sie kauft <b>einen Apfel</b>.|Akkusativ|Nominativ;Dativ;Genitiv|Wen oder was kauft sie? → Akkusativ
<b>Mein Freund</b> heißt Ali.|Nominativ|Akkusativ;Dativ;Genitiv|Wer heißt Ali? → Nominativ
Wegen <b>des Regens</b> bleiben wir drinnen.|Genitiv|Nominativ;Akkusativ;Dativ|Nach „wegen“ steht der Genitiv.
Der Lehrer lobt <b>die Schüler</b>.|Akkusativ|Nominativ;Dativ;Genitiv|Wen lobt der Lehrer? → Akkusativ
Das Fahrrad gehört <b>meinem Bruder</b>.|Dativ|Nominativ;Akkusativ;Genitiv|Wem gehört das Fahrrad? → Dativ`,
  aktiv: `Der Hund beißt den Briefträger. – Aktiv oder Passiv?|Aktiv|Passiv|Im Aktiv tut das Subjekt selbst etwas.
Der Briefträger wird vom Hund gebissen. – Aktiv oder Passiv?|Passiv|Aktiv|Passiv: „werden“ + Partizip (gebissen).
Die Mutter backt einen Kuchen. – Aktiv oder Passiv?|Aktiv|Passiv|Die Mutter tut selbst etwas → Aktiv.
Der Kuchen wird gebacken. – Aktiv oder Passiv?|Passiv|Aktiv|„wird gebacken“ → Passiv.
Das Auto wird repariert. – Aktiv oder Passiv?|Passiv|Aktiv|„wird repariert“ → Passiv.
Der Mechaniker repariert das Auto. – Aktiv oder Passiv?|Aktiv|Passiv|Der Mechaniker handelt selbst → Aktiv.
Die Tür wurde geöffnet. – Aktiv oder Passiv?|Passiv|Aktiv|„wurde geöffnet“ → Passiv (Vergangenheit).
Die Kinder spielen Fußball. – Aktiv oder Passiv?|Aktiv|Passiv|Die Kinder handeln selbst → Aktiv.
Setze ins Passiv: Der Koch kocht die Suppe.|Die Suppe wird vom Koch gekocht.|Die Suppe kocht den Koch.;Der Koch wird von der Suppe gekocht.;Die Suppe hat gekocht.|Das Objekt (die Suppe) wird zum Subjekt, dazu „wird … gekocht“.
Setze ins Passiv: Lisa malt ein Bild.|Ein Bild wird von Lisa gemalt.|Lisa wird von einem Bild gemalt.;Ein Bild malt Lisa.;Lisa hat ein Bild gemalt.|Das Objekt (ein Bild) wird zum Subjekt.
Setze ins Passiv: Der Lehrer erklärt die Aufgabe.|Die Aufgabe wird vom Lehrer erklärt.|Der Lehrer wird von der Aufgabe erklärt.;Die Aufgabe erklärt den Lehrer.;Der Lehrer hat die Aufgabe erklärt.|Das Objekt wird zum Subjekt, dazu „wird … erklärt“.
Setze ins Aktiv: Der Ball wird von Tom geworfen.|Tom wirft den Ball.|Der Ball wirft Tom.;Tom wird geworfen.;Der Ball hat Tom geworfen.|Wer handelt? Tom → Tom wird Subjekt.`,
  syn: `Was bedeutet fast dasselbe wie „schnell“?|rasch|langsam;laut;schön
Was bedeutet fast dasselbe wie „beginnen“?|anfangen|aufhören;warten;suchen
Was bedeutet fast dasselbe wie „schön“?|hübsch|hässlich;schwer;schnell
Was bedeutet fast dasselbe wie „sprechen“?|reden|schweigen;laufen;hören
Was bedeutet fast dasselbe wie „klug“?|schlau|dumm;müde;laut
Was bedeutet fast dasselbe wie „lustig“?|witzig|traurig;langweilig;leise
Was bedeutet fast dasselbe wie „mutig“?|tapfer|ängstlich;faul;klein
Was bedeutet fast dasselbe wie „Ende“?|Schluss|Anfang;Mitte;Pause
Was bedeutet fast dasselbe wie „Angst“?|Furcht|Mut;Freude;Ruhe
Was bedeutet fast dasselbe wie „kaputt“?|defekt|neu;heil;sauber
Was bedeutet fast dasselbe wie „gucken“?|schauen|hören;riechen;schmecken
Was bedeutet fast dasselbe wie „riesig“?|gewaltig|winzig;schmal;leicht
Was bedeutet fast dasselbe wie „fröhlich“?|heiter|traurig;wütend;müde
Was bedeutet fast dasselbe wie „Auto“?|Wagen|Zug;Rad;Boot`,
  fremd: `Was bedeutet „Experiment“?|Versuch|Ergebnis;Gespräch;Unfall
Was bedeutet „Team“?|Mannschaft|Trainer;Spielfeld;Gegner
Was bedeutet „Information“?|Auskunft|Frage;Fehler;Ausflug
Was bedeutet „Problem“?|Schwierigkeit|Lösung;Geschenk;Ergebnis
Was bedeutet „Kontinent“?|Erdteil|Land;Insel;Stadt
Was bedeutet „Biografie“?|Lebensbeschreibung|Märchenbuch;Wörterbuch;Bilderbuch
Was bedeutet „Diskussion“?|Gespräch über ein Thema|Streit mit Fäusten;Vortrag ohne Zuhörer;Schweigeminute
Was bedeutet „Recycling“?|Wiederverwertung|Wegwerfen;Verbrennen;Sammeln von Briefmarken
Was bedeutet „Tradition“?|Brauch|Erfindung;Neuheit;Zufall
Was bedeutet „Dessert“?|Nachspeise|Vorspeise;Getränk;Hauptgericht
Was bedeutet „Ticket“?|Fahrkarte|Fahrplan;Fahrer;Haltestelle
Was bedeutet „Fantasie“?|Vorstellungskraft|Gedächtnis;Kraft;Wahrheit
Was bedeutet „Interview“?|Befragung|Zeitung;Spiel;Brief
Was bedeutet „Hobby“?|Freizeitbeschäftigung|Arbeit;Hausaufgabe;Pflicht`
};

/* Wortarten (Klasse 5) */
const WART5 = "und|Konjunktion,aber|Konjunktion,weil|Konjunktion,oder|Konjunktion,auf|Präposition,unter|Präposition,mit|Präposition,neben|Präposition,wir|Pronomen,sie|Pronomen,mein|Pronomen,euch|Pronomen,der|Artikel,eine|Artikel,heute|Adverb,gern|Adverb,dort|Adverb,oft|Adverb,Freundschaft|Nomen,Gedanke|Nomen,rennen|Verb,überlegen|Verb,mutig|Adjektiv,freundlich|Adjektiv";
const WART5_ALL = ["Nomen", "Verb", "Adjektiv", "Artikel", "Pronomen", "Präposition", "Konjunktion", "Adverb"];

/* Steigerung: Grundform|Vergleich|Superlativ */
const STEIG = "groß|größer|am größten;klein|kleiner|am kleinsten;gut|besser|am besten;viel|mehr|am meisten;hoch|höher|am höchsten;nah|näher|am nächsten;alt|älter|am ältesten;schnell|schneller|am schnellsten;warm|wärmer|am wärmsten;gern|lieber|am liebsten;jung|jünger|am jüngsten;kurz|kürzer|am kürzesten;lang|länger|am längsten;dunkel|dunkler|am dunkelsten;teuer|teurer|am teuersten";

/* Satzglieder: S=Subjekt P=Prädikat A=Akkusativobjekt D=Dativobjekt X=anderes */
const SATZGL = "S:Der Hund|P:bellt|X:im Garten;S:Mia|P:liest|A:ein Buch;S:Die Kinder|P:spielen|X:auf dem Hof;S:Opa|P:schenkt|D:mir|A:einen Ball;S:Wir|P:essen|A:Pizza;S:Die Lehrerin|P:hilft|D:dem Jungen;S:Der Vogel|P:singt|A:ein Lied;S:Meine Schwester|P:malt|A:ein Bild;S:Der Bäcker|P:gibt|D:dem Kind|A:eine Brezel;X:Morgen|P:fahren|S:wir|X:ans Meer;S:Tom|P:trinkt|A:Saft;S:Das Baby|P:schläft;S:Lena|P:dankt|D:ihrer Freundin;X:Heute|P:besucht|S:Papa|A:den Zoo";

/* Diktat-Wörter je Klasse */
const DIKTAT = {
  2: "Mama,Papa,Oma,Opa,Haus,Hund,Katze,Maus,Ball,Baum,Auto,Sonne,Mond,Tisch,Buch,Schule,rot,blau,gelb,Hose,Rose,Igel,Esel,Nase,Hase,Kind,Hand,Fisch,Ente,Blume,Apfel,Brot,Name,Tante,Wolke",
  3: "Biene,Spiegel,Wiese,Tier,Lied,Brief,Zucker,Decke,Jacke,Mütze,Platz,Hitze,Fahrrad,Zahn,Uhr,Sohn,Kuh,Straße,Fuß,groß,Kissen,Wasser,Schnee,Meer,Boot,Zoo,Haare,Fehler,Stuhl,fahren,nehmen,sehen,Glück,Sack,Katze",
  4: "Geburtstag,Frühling,Weihnachten,Bäckerei,Fußball,Erdbeere,Schmetterling,Hausaufgaben,Mannschaft,plötzlich,natürlich,vielleicht,Fenster,Zähne,Bäume,Häuser,Gefahr,wahr,Jahr,ziemlich,endlich,glücklich,Freundschaft,Ergebnis,Ereignis,Verkehr,Fahrt,Bahnhof,Gemüse,Schwimmbad",
  5: "Bibliothek,Maschine,Theater,Physik,Experiment,Interesse,Fantasie,Gymnasium,Rhythmus,Kontinent,Atmosphäre,Rezept,Pyramide,Zylinder,Kilometer,Thermometer,Ingenieur,Chaos,Clown,Atlas,Jacht,Vase,Mathematik,Chemie",
  6: "Diskussion,Information,Kommunikation,Reparatur,Temperatur,Kilogramm,Prozent,Säugetier,Wissenschaft,Persönlichkeit,Gemeinschaft,Erlebnis,Geheimnis,Spaziergang,außerdem,deshalb,trotzdem,Biografie,Hypothese,Labyrinth,Pinguin,Rhythmus,Philosophie,Charakter"
};

/* Wörter zum Nachspuren (Klasse 1–2) */
const TRACE_WORDS = "Mama,Papa,Oma,Opa,Haus,Hund,Ball,Igel,Sonne,Mond,Auto,Maus,Ente,Esel,Nase,Hose,Kind,Baum,Eis,Ufo";

/* Sticker zum Sammeln */
const STICKERS = "🦄 🐲 🦖 🐳 🦋 🐙 🦜 🦩 🦚 🐬 🦊 🐼 🐨 🐯 🦁 🐸 🐵 🐧 🦉 🐢 🐞 🐝 🌈 ⭐ 🌟 🍀 🌻 🌸 🍉 🍓 🍩 🧁 🍭 🎈 🎨 🎸 🚀 🛸 🚂 ⚽ 🏆 👑 💎 🎁 🧸 🪁 🎠 🏰".split(" ");
const AVATARS = "🦊 🐼 🐯 🦁 🐸 🐵 🐰 🐻 🐨 🦄 🐲 🐙 🐧 🦉 🐶 🐱".split(" ");
