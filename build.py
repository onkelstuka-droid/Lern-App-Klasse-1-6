# Baut aus src/ die Lern-App (PWA) im Hauptordner:
# index.html (alles in einer Datei), sw.js (Offline), manifest.webmanifest, icons/*.png, 404.html
# Aufruf: python3 build.py  – danach committen und pushen (GitHub Pages veröffentlicht automatisch)
import os, json, hashlib, glob
os.chdir(os.path.dirname(os.path.abspath(__file__)))
rd = lambda p: open(p, encoding='utf-8').read()
JS = ['src/data.js', 'src/glyphs.js', 'src/units.js', 'src/app.js']
css, body = rd('src/style.css'), rd('src/body.html')
js = '\n'.join(rd(p) for p in JS)
ver = hashlib.sha1((css + body + js + rd(__file__)).encode()).hexdigest()[:10]

# App-Symbol: blaues Feld mit „ABC“ und „123“, nur wenn es fehlt
def icons():
    from PIL import Image, ImageDraw, ImageFont
    font = 'fonts/SPSans-Bold.ttf'
    def make(size, maskable, name):
        s = size * 4
        im = Image.new('RGBA', (s, s), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        blue = (58, 156, 255, 255)
        if maskable:
            d.rectangle([0, 0, s, s], fill=blue); k = 0.62
        else:
            d.rounded_rectangle([0, 0, s - 1, s - 1], radius=int(s * 0.24), fill=blue); k = 0.84
        f = ImageFont.truetype(font, int(s * 0.27 * k))
        for txt, y, col in [('ABC', 0.5 - 0.30 * k, (255, 255, 255, 255)), ('123', 0.5 + 0.02 * k, (255, 205, 40, 255))]:
            tw = d.textlength(txt, font=f)
            d.text(((s - tw) / 2, s * y), txt, font=f, fill=col)
        im.resize((size, size), Image.LANCZOS).save('icons/' + name)
    os.makedirs('icons', exist_ok=True)
    for size, mask, name in [(192, False, 'icon-192.png'), (512, False, 'icon-512.png'), (192, True, 'icon-maskable-192.png'),
                             (512, True, 'icon-maskable-512.png'), (180, True, 'apple-touch-icon.png')]:
        if not os.path.exists('icons/' + name):
            make(size, mask, name)
icons()

head = '''<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Lern-App Klasse 1–6</title>
<meta name="description" content="Buchstaben, Zahlen, Rechnen, Schreiben und Sprechen lernen – für Kinder der Klassen 1 bis 6.">
<meta name="theme-color" content="#3a9cff">
<meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Lern-App">
<link rel="manifest" href="manifest.webmanifest"><link rel="icon" href="icons/icon-192.png"><link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Andika:wght@400;700&family=Fredoka:wght@400;500;600;700&display=swap">
<style>
''' + css + '''</style>
<script>if("serviceWorker" in navigator){var hadSW=!!navigator.serviceWorker.controller,reloaded=false;navigator.serviceWorker.addEventListener("controllerchange",function(){if(hadSW&&!reloaded){reloaded=true;location.reload()}});addEventListener("load",function(){navigator.serviceWorker.register("sw.js",{updateViaCache:"none"}).then(function(r){r.update()}).catch(function(){})});document.addEventListener("visibilitychange",function(){if(document.visibilityState==="visible")navigator.serviceWorker.getRegistration().then(function(r){r&&r.update()})})}</script>
</head><body>
'''
open('index.html', 'w', encoding='utf-8').write(head + body + '<script>\n' + js + '\n</script>\n</body></html>\n')

man = {"name": "Lern-App Klasse 1–6", "short_name": "Lern-App", "description": "Buchstaben, Zahlen, Rechnen, Schreiben und Sprechen lernen.",
       "lang": "de", "start_url": "./", "scope": "./", "display": "standalone", "orientation": "portrait", "background_color": "#e6f5ff", "theme_color": "#3a9cff",
       "icons": [{"src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png"}, {"src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png"},
                 {"src": "icons/icon-maskable-192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable"},
                 {"src": "icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}]}
open('manifest.webmanifest', 'w', encoding='utf-8').write(json.dumps(man, ensure_ascii=False, indent=1))

pre = ["./", "index.html", "manifest.webmanifest"] + ["icons/" + os.path.basename(f) for f in sorted(glob.glob('icons/*.png'))]
# Gleiche Adresse (onkelstuka-droid.github.io) wie Vokabelheft und Schichtplaner: nur eigene Caches „lernapp-*“ löschen!
sw = '''// Offline-Speicher der Lern-App. Version wechselt bei jedem Update.
const CACHE="lernapp-%s";const PRE=%s;
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(PRE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("lernapp-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
  if(r.mode==="navigate"||u.pathname.endsWith("/index.html")){ // Seite: erst online (für Updates), sonst aus dem Speicher
    e.respondWith(fetch(r.url,{cache:"no-store"}).then(res=>{if(!res.ok)throw 0;const c=res.clone();caches.open(CACHE).then(x=>x.put("index.html",c));return res}).catch(()=>caches.match("index.html")));return}
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok||res.type==="opaque"){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c))}return res})))});
''' % (ver, json.dumps(pre))
open('sw.js', 'w', encoding='utf-8').write(sw)
open('404.html', 'w', encoding='utf-8').write('<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=./"><a href="./">Lern-App öffnen</a>')
open('.nojekyll', 'w').close()
print("version", ver, "files", len(pre))
