#!/usr/bin/env python3
# =============================================================================
# build_html_v2.py - Générateur du HTML autonome du Guide médical du SM
# =============================================================================
#
# RÔLE : transforme le code source React (ray-studios-guide.jsx) en un fichier
#        HTML autonome (ray-studios-guide.html) prêt à mettre en ligne.
#
# POURQUOI : le navigateur reçoit du JavaScript déjà compilé (rapide à charger),
#            au lieu de compiler le JSX à l'ouverture (lent, bloquait le site).
#
# PRÉREQUIS :
#   - Node.js installé (commande "node")
#   - TypeScript installé (commande "tsc")   ->  npm install -g typescript
#
# PROCÉDURE COMPLÈTE (voir documentation section 4) :
#   1. Depuis ray-studios-guide.jsx, créer app.tsx :
#        - retirer les 2 lignes "import ... from react/lucide" du début
#        - remplacer "export default function App" par "function App"
#   2. Compiler :
#        tsc app.tsx --jsx react --jsxFactory React.createElement \
#            --target es2018 --module none --allowJs --skipLibCheck \
#            --noEmitOnError false --lib es2018,dom
#      -> produit app.js  (vérifier : aucune erreur "TS1xxx" = syntaxe)
#   3. Vérifier : node --check app.js
#   4. Lancer ce script : python3 build_html_v2.py
#      (il lit /tmp/jsxbuild/app.js et écrit le HTML dans outputs)
#   5. Ouvrir le HTML dans un navigateur pour vérifier l'affichage.
#
# NOTE : les chemins ci-dessous (/tmp/jsxbuild/app.js et le dossier de sortie)
#        sont à adapter à votre environnement de travail.
# =============================================================================

import re

# Lire le JS pré-compilé par tsc
with open('/tmp/jsxbuild/app.js') as f:
    compiled_js = f.read()

# Retirer le "use strict" en tête (on le remet dans le scope du script)
compiled_js = compiled_js.replace('"use strict";\n', '', 1)

# Icônes inline (style Lucide) — version JS pur (React.createElement)
icons_js = '''
    // ===== Icônes (style Lucide) =====
    function Icon(props) {
      var children = props.children, className = props.className || "", strokeWidth = props.strokeWidth || 2;
      return React.createElement("svg", {
        xmlns: "http://www.w3.org/2000/svg", width: 24, height: 24, viewBox: "0 0 24 24",
        fill: "none", stroke: "currentColor", strokeWidth: strokeWidth,
        strokeLinecap: "round", strokeLinejoin: "round", className: className
      }, children);
    }
    function mkIcon(paths) {
      return function(props) {
        return React.createElement(Icon, props, paths.map(function(d, i) {
          if (d.c) return React.createElement("circle", Object.assign({key:i}, d.c));
          if (d.l) return React.createElement("line", Object.assign({key:i}, d.l));
          if (d.poly) return React.createElement("polygon", {key:i, points:d.poly});
          if (d.rect) return React.createElement("rect", Object.assign({key:i}, d.rect));
          return React.createElement("path", {key:i, d:d});
        }));
      };
    }
    var Search = mkIcon([{c:{cx:11,cy:11,r:8}}, "m21 21-4.3-4.3"]);
    var X = mkIcon(["M18 6 6 18", "m6 6 12 12"]);
    var ChevronRight = mkIcon(["m9 18 6-6-6-6"]);
    var RotateCcw = mkIcon(["M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", "M3 3v5h5"]);
    var Check = mkIcon(["M20 6 9 17l-5-5"]);
    var BookOpen = mkIcon(["M12 7v14", "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"]);
    var Target = mkIcon([{c:{cx:12,cy:12,r:10}}, {c:{cx:12,cy:12,r:6}}, {c:{cx:12,cy:12,r:2}}]);
    var ArrowRight = mkIcon(["M5 12h14", "m12 5 7 7-7 7"]);
    var Stethoscope = mkIcon(["M11 2v2","M5 2v2","M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1","M8 15a6 6 0 0 0 12 0v-3",{c:{cx:20,cy:10,r:2}}]);
    var AlertTriangle = mkIcon(["m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z","M12 9v4","M12 17h.01"]);
    var Calculator = mkIcon([{rect:{width:16,height:20,x:4,y:2,rx:2}},{l:{x1:8,x2:16,y1:6,y2:6}},{l:{x1:16,x2:16,y1:14,y2:18}},"M16 10h.01","M12 10h.01","M8 10h.01","M12 14h.01","M8 14h.01","M12 18h.01","M8 18h.01"]);
    var Lightbulb = mkIcon(["M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5","M9 18h6","M10 22h4"]);
    var AlertOctagon = mkIcon([{poly:"7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"},{l:{x1:12,x2:12,y1:8,y2:12}},{l:{x1:12,x2:12.01,y1:16,y2:16}}]);
    var Quote = mkIcon(["M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z","M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"]);
    var Copy = mkIcon([{rect:{width:14,height:14,x:8,y:8,rx:2,ry:2}},"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"]);
    var Ban = mkIcon([{c:{cx:12,cy:12,r:10}},"m4.9 4.9 14.2 14.2"]);
    var Atom = mkIcon([{c:{cx:12,cy:12,r:1}},"M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z","M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"]);
'''

html = '''<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ray studios. Guide médical du SM</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script crossorigin src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"></script>
  <style>
    html, body { margin: 0; padding: 0; background: #FAFAF7; min-height: 100vh; }
    #loading {
      position: fixed; inset: 0; display: flex; align-items: center; justify-content: center;
      background: #FAFAF7; z-index: 9999;
      font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
    }
    #loading.hidden { display: none; }
    .loading-dots { display: inline-flex; gap: 4px; margin-top: 12px; }
    .loading-dots span {
      width: 6px; height: 6px; border-radius: 50%; background: #1A1A1A;
      animation: pulse 1.4s ease-in-out infinite;
    }
    .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
    .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
    .loading-dots span:nth-child(4) { animation-delay: 0.6s; }
    .loading-dots span:nth-child(5) { animation-delay: 0.8s; }
    @keyframes pulse { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }
  </style>
</head>
<body>
  <div id="loading">
    <div style="text-align: center; color: #1A1A1A;">
      <div style="font-size: 15px; font-weight: 600; margin-bottom: 4px;">Ray studios</div>
      <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #78716C;">Guide médical du SM</div>
      <div class="loading-dots"><span></span><span></span><span></span><span></span><span></span></div>
    </div>
  </div>
  <div id="root"></div>

  <script>
  (function() {
    var React = window.React;
    var ReactDOM = window.ReactDOM;
    var useState = React.useState, useMemo = React.useMemo, useEffect = React.useEffect, useReducer = React.useReducer;
''' + icons_js + '''

''' + compiled_js + '''

    try {
      var root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(App));
      var l = document.getElementById('loading');
      if (l) l.classList.add('hidden');
    } catch (e) {
      document.getElementById('loading').innerHTML =
        '<div style="font-family: sans-serif; color: #b91c1c; max-width: 500px; padding: 20px;">' +
        '<strong>Erreur de chargement</strong><br><br>' + String(e) + '</div>';
      console.error(e);
    }
  })();
  </script>
</body>
</html>
'''

with open('/mnt/user-data/outputs/ray-studios-guide.html', 'w') as f:
    f.write(html)

import os
size = os.path.getsize('/mnt/user-data/outputs/ray-studios-guide.html')
print(f"HTML créé (JS pré-compilé, sans Babel): {size:,} octets ({size/1024:.0f} Ko)")
