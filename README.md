# Guide médical du SM — Ray studios

Application web interne destinée aux **studio managers** de Ray studios (centre de détatouage au laser PicoWay). Elle leur donne de quoi répondre aux premières questions médicales des patients, sans se substituer au médecin.

🔗 **En ligne** : [ray-guide.vercel.app](https://ray-guide.vercel.app)

---

## Contenu de l'outil

5 onglets : **Comprendre** (vulgarisation médicale), **Thèmes** (flashcards + recherche), **Réflexes** (phrases à éviter/dire + glossaire), **Quiz** (situations terrain + connaissances médicales), **Calcul** (estimation téléphonique).

---

## Fichiers du dépôt

| Fichier | Rôle | On y touche ? |
|---|---|---|
| `ray-studios-guide.jsx` | **Code source** (données + composants React). C'est la seule source de vérité. | **Oui**, pour tout changement |
| `ray-studios-guide.html` | Version autonome mise en ligne. **Générée** à partir du `.jsx`. | Non |
| `build_html_v2.py` | Script qui assemble le `.html` final à partir du code compilé. | Rarement |
| `documentation-technique-guide-SM.md` | **Documentation complète** pour reprendre le projet. À lire en premier. | — |

---

## Modifier le contenu (l'essentiel)

Tout le contenu médical est dans des **blocs de données** en haut du fichier `.jsx` (repérables car en majuscules) : `THEMES`, `QA`, `SCENARIOS`, `MEDICAL_QUIZ`, `FORBIDDEN_PHRASES`, `GLOSSARY`, `EDUCATION`.

Pour modifier une question, une réponse ou un terme : chercher le texte dans le `.jsx`, éditer en respectant le format des entrées voisines, puis régénérer le `.html` (voir la documentation, section 4).

> ⚠️ **Piège n°1** : une virgule manquante entre deux entrées casse tout le site. Toujours vérifier.

---

## Régénérer le HTML

Le `.html` est produit à partir du `.jsx` (compilation TypeScript puis assemblage). **La procédure complète pas à pas est dans `documentation-technique-guide-SM.md`, section 4.**

---

## Pile technique

React 18 + Tailwind CSS, chargés via CDN. Icônes recréées en SVG (aucune dépendance). Le `.html` est autonome : aucune installation requise pour l'utilisateur final.

---

## Feuille de route

- Version anglaise de l'outil
- Liaison à une source de contenu externe (Notion / Rsap) — nécessite une API côté source
- Sauvegarde partagée du code (ce dépôt)

---

*Pour toute reprise du projet, commencer par lire `documentation-technique-guide-SM.md`.*
