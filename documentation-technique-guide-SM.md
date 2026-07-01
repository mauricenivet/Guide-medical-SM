# Documentation technique — Guide médical du SM (Ray studios)

> **À qui s'adresse ce document**
> À toute personne qui reprend le développement ou la maintenance de l'outil « Guide médical du SM », sans connaissance préalable du projet. Il explique ce qu'est l'outil, comment il est construit, comment le modifier, et comment le mettre en ligne.
>
> **Dernière mise à jour** : juillet 2026

---

## 1. Vue d'ensemble

### 1.1 À quoi sert l'outil

Le « Guide médical du SM » est une application web interne destinée aux **studio managers (SM)** de Ray studios, centre de détatouage au laser. Il leur donne de quoi répondre aux premières questions des patients sur la partie médicale, sans se substituer au médecin, et savoir quand renvoyer vers lui.

Le laser utilisé au centre est le **PicoWay de Candela**. Tout le contenu médical est vulgarisé et validé pour un usage non-médical (le SM n'est pas soignant).

### 1.2 Ce que contient l'outil

L'application est organisée en **5 onglets** :

| Onglet | Rôle |
|---|---|
| **Comprendre** | Vulgarisation médicale : fonctionnement du laser, phototypes, picoseconde, parcours de l'encre, idées reçues, les 4 paramètres |
| **Thèmes** | Flashcards de questions/réponses classées par thème, avec une barre de recherche intégrée en haut |
| **Réflexes** | Phrases à éviter / à privilégier, et glossaire des termes techniques |
| **Quiz** | Deux quiz : situations terrain et connaissances médicales |
| **Calcul** | Calculatrice d'estimation (taille et prix indicatif d'un tatouage) pour les demandes téléphoniques |

### 1.3 État actuel du contenu

- 6 thèmes, 47 questions/réponses (flashcards)
- 20 mises en situation (quiz terrain) + 30 questions médicales (quiz connaissances)
- 11 phrases « réflexes » (à éviter / à dire)
- 25 termes de glossaire
- 6 sujets pédagogiques dans « Comprendre »

---

## 2. Comment c'est construit (vue simple)

### 2.1 Le principe

L'outil est un site web fait avec **React** (une bibliothèque JavaScript très répandue pour construire des interfaces). Tout tient dans **un seul fichier de code source**, ce qui simplifie énormément la reprise : pas de dossiers imbriqués, pas de dizaines de fichiers.

Il existe **deux versions du même outil** :

1. **`ray-studios-guide.jsx`** — le **code source**. C'est le fichier qu'on modifie. Lisible, organisé, commenté.
2. **`ray-studios-guide.html`** — la **version autonome**. C'est le fichier qu'on met en ligne ou qu'on ouvre directement dans un navigateur. Il est *généré* à partir du `.jsx` (voir section 4).

> **Analogie** : le `.jsx` est la recette de cuisine (ce qu'on lit et modifie), le `.html` est le plat fini (ce qu'on sert). On ne modifie jamais le plat directement : on change la recette, puis on refait le plat.

### 2.2 Les technologies employées

| Techno | À quoi ça sert | Faut-il la connaître ? |
|---|---|---|
| **React 18** | Construit l'interface (les onglets, les cartes, les boutons) | Oui, bases utiles |
| **Tailwind CSS** | Gère l'apparence (couleurs, espacements, mise en page) via des classes | Bases utiles |
| **Lucide (icônes)** | Les petites icônes. Ici recréées « à la main » en SVG pour éviter toute dépendance | Non |
| **TypeScript (tsc)** | Sert uniquement à *compiler* le code lors de la génération du HTML | Non, juste lancer une commande |

Tout est chargé depuis des **CDN** (des serveurs publics) dans la version HTML : rien à installer pour que le site fonctionne chez l'utilisateur final. Une connexion internet est nécessaire au premier chargement.

---

## 3. Structure du fichier source (`.jsx`)

Le fichier est organisé en deux grandes parties : **les données** (en haut) et **les composants d'affichage** (en bas).

### 3.1 Les données — la partie qu'on modifie le plus souvent

Tout le contenu médical est regroupé en haut du fichier dans des **blocs de données** faciles à repérer (ils sont en majuscules). Pour changer une question, une réponse, un terme de glossaire, **c'est ici et nulle part ailleurs**.

| Bloc | Contenu | Format d'une entrée |
|---|---|---|
| `THEMES` | La liste des 6 thèmes | `{ id, label, hint }` |
| `QA` | Les questions/réponses principales | `{ id, theme, question, short, detail, keywords }` |
| `SPECIAL_CASES` | Questions des cas particuliers (fusionnées avec QA à l'affichage) | idem QA |
| `SCENARIOS` | Les 20 mises en situation du quiz terrain | `{ id, situation, options[] }` |
| `MEDICAL_QUIZ` | Les 30 questions médicales | `{ id, question, options[] }` |
| `FORBIDDEN_PHRASES` | Les phrases réflexes | `{ bad, why, good }` |
| `GLOSSARY` | Les termes techniques | `{ term, techDef, patientWords }` |
| `EDUCATION` | Les 6 sujets de « Comprendre » | `{ id, title, intro, sections[] }` |

> **Note importante** : `QA` et `SPECIAL_CASES` sont fusionnés automatiquement dans une liste `ALL_QA` utilisée partout dans l'app. Si vous ajoutez une question, mettez-la dans `QA` (ou `SPECIAL_CASES` pour un cas particulier), pas dans `ALL_QA`.

### 3.2 Les couleurs de la marque

En tout début de fichier, deux constantes définissent l'identité visuelle :

- `RAY_ORANGE = "#ED9B5F"` — l'orange principal de Ray studios
- `RAY_ORANGE_SOFT = "#F8E4D2"` — une version douce pour les fonds

Les logos sont intégrés directement dans le code sous forme de texte encodé (base64), dans les constantes `LOGO_ROUND` et `LOGO_WORDMARK`. Pas de fichier image externe à gérer.

### 3.3 Les composants d'affichage — la partie qu'on modifie rarement

Sous les données se trouvent les **composants** : ce sont les briques qui affichent l'interface. On n'y touche que pour changer la *mise en page* ou ajouter une *fonctionnalité*, pas pour changer le contenu.

| Composant | Ce qu'il affiche |
|---|---|
| `App` | Le squelette général : en-tête, barre d'onglets, aiguillage entre les modes |
| `LearnMode` | L'onglet « Comprendre » |
| `ThemesMode` | L'onglet « Thèmes » (avec la recherche intégrée) |
| `ReflexesMode` | L'onglet « Réflexes » (phrases + glossaire) |
| `TrainingMode` | L'onglet « Quiz » (les deux quiz) |
| `CalcMode` | L'onglet « Calcul » |
| `RayMark`, `RayWordmark` | Les logos |
| `ThemeBadge`, `DoctorBadge`, `UrgentBadge`, `ForbiddenBadge` | Les petites étiquettes colorées |
| `PricingGrid` | Le tableau de tarifs |
| `FadeDots` | L'élément décoratif (points qui s'estompent) |

---

## 4. Comment modifier et régénérer l'outil

C'est la section la plus importante pour la maintenance courante.

### 4.1 Modifier du contenu (cas le plus fréquent)

Exemple : corriger une réponse, ajouter un terme au glossaire, changer une question de quiz.

1. Ouvrir **`ray-studios-guide.jsx`** dans n'importe quel éditeur de texte (idéalement VS Code, gratuit).
2. Trouver le bloc de données concerné (voir tableau 3.1). Une recherche par mot-clé (Ctrl+F) sur le texte à modifier vous y amène directement.
3. Modifier en respectant **exactement** le format des entrées voisines (les accolades, les virgules, les guillemets). C'est le point le plus délicat : une virgule oubliée casse tout.
4. Régénérer la version HTML (voir 4.3).

> **Piège classique** : entre deux entrées d'une liste, il faut une **virgule**. Oublier cette virgule est l'erreur n°1 qui empêche le site de s'afficher. Toujours vérifier que chaque `}` de fin d'entrée est suivi d'une `,` (sauf le tout dernier).

### 4.2 Prérequis pour régénérer le HTML

La régénération transforme le `.jsx` en `.html`. Il faut deux outils installés sur la machine :

- **Node.js** (inclut la commande `node`)
- **TypeScript** (la commande `tsc`) — s'installe avec : `npm install -g typescript`

### 4.3 La procédure de régénération (étape par étape)

L'objectif : produire un `.html` à jour, sans erreur. Le principe est de **compiler** le code une bonne fois (au lieu de le faire compiler par le navigateur de chaque utilisateur, ce qui était lent).

**Étape 1 — Préparer le code à compiler.**
On prend le `.jsx`, on retire les deux lignes `import` du tout début (elles ne servent que dans un projet React classique), et on renomme la dernière fonction `export default function App` en `function App`. On enregistre le résultat sous `app.tsx`.

**Étape 2 — Compiler avec TypeScript.**
```
tsc app.tsx --jsx react --jsxFactory React.createElement --target es2018 --module none --allowJs --skipLibCheck --noEmitOnError false --lib es2018,dom
```
Cette commande produit un fichier `app.js` (du JavaScript pur que tout navigateur comprend). **Vérifier qu'aucune erreur commençant par `TS1` n'apparaît** : ce sont les erreurs de syntaxe (virgule manquante, etc.). Les autres avertissements (`TS2`, `TS7`) sont sans conséquence ici.

**Étape 3 — Vérifier que le JavaScript est valide.**
```
node --check app.js
```
Si cette commande ne renvoie rien, le code est syntaxiquement correct.

**Étape 4 — Assembler le HTML final.**
Un petit script (`build_html_v2.py`, fourni avec le projet) prend le `app.js` compilé et l'insère dans un gabarit HTML avec : le chargement de React et Tailwind depuis les CDN, la définition des icônes, et un écran de chargement aux couleurs de Ray studios. Il produit `ray-studios-guide.html`.

**Étape 5 — Vérifier le résultat.**
Ouvrir le `.html` dans un navigateur et vérifier que tout s'affiche : les 5 onglets, la recherche, les quiz. En cas d'écran de chargement bloqué, c'est presque toujours une erreur de syntaxe non repérée à l'étape 2.

> **Pourquoi cette compilation ?** Une version antérieure faisait compiler le code *dans le navigateur* (avec un outil nommé Babel). Sur 2500 lignes, c'était très lent, jusqu'à bloquer l'ouverture. En compilant *avant*, le navigateur reçoit du code prêt à l'emploi : chargement quasi instantané.

### 4.4 Vérifications systématiques avant publication

- Nombre de parenthèses/accolades/crochets ouvrants = fermants (un script Python simple le vérifie).
- `node --check` passe sans erreur sur le HTML final.
- L'affichage est testé dans un vrai navigateur.

---

## 5. Mise en ligne (hébergement)

### 5.1 Solution actuelle : Vercel

L'outil est hébergé sur **Vercel** (service gratuit), à l'adresse `ray-guide.vercel.app`.

Vercel affiche automatiquement le fichier nommé **`index.html`**. Pour publier une nouvelle version :

1. Renommer le nouveau `ray-studios-guide.html` en `index.html`.
2. Le déposer sur Vercel (glisser-déposer du dossier le contenant), ou le pousser via le dépôt Git connecté.
3. L'URL reste identique, seul le contenu est mis à jour.

### 5.2 Alternative de secours

Le fichier `.html` étant totalement autonome, il peut aussi être **ouvert directement** par double-clic depuis un ordinateur, ou hébergé sur n'importe quel service de fichiers statiques (Netlify, GitHub Pages, etc.). Aucune configuration serveur n'est nécessaire.

### 5.3 Remarque sur la confidentialité

Le contenu est médical et interne. Une URL Vercel publique est accessible à quiconque possède le lien. Si une vraie protection est requise, deux pistes : la protection par mot de passe native de **Vercel Pro** (payant), ou un écran de mot de passe ajouté dans le fichier (protection légère, dissuasive seulement).

---

## 6. Évolutions prévues (feuille de route)

Points identifiés mais non encore réalisés, à la date de cette documentation :

- **Version anglaise** de l'outil (traduction des blocs de données).
- **Liaison à une source de contenu externe** (Notion, ou l'outil interne « Rsap ») pour que le contenu se mette à jour sans toucher au code. *Prérequis* : que la source expose une API, ce qui n'est pas le cas aujourd'hui. En attendant, une piste réaliste est d'externaliser les données dans un fichier modifiable (Google Sheet / JSON).
- **Sauvegarde du fichier source** dans un espace partagé (« outil médecin » sur Notion) pour ne pas dépendre d'un seul poste.

---

## 7. En cas de problème — aide-mémoire

| Symptôme | Cause probable | Solution |
|---|---|---|
| Écran de chargement bloqué | Erreur de syntaxe dans le code (souvent une virgule manquante entre deux entrées) | Recompiler avec `tsc` et lire les erreurs `TS1…` ; vérifier le bloc modifié en dernier |
| Une modif de contenu n'apparaît pas | Le HTML n'a pas été régénéré | Refaire la procédure de la section 4.3 |
| Le site est lent au 1er chargement | Normal : chargement des CDN (React, Tailwind) | S'améliore aux chargements suivants grâce au cache |
| Une icône a disparu | Icône utilisée dans le code mais non définie dans le script de build | Ajouter sa définition dans `build_html_v2.py` |
| Les couleurs / styles ne s'appliquent pas | Classe Tailwind mal écrite | Vérifier l'orthographe de la classe |

---

## 8. Récapitulatif des fichiers du projet

| Fichier | Rôle | On y touche ? |
|---|---|---|
| `ray-studios-guide.jsx` | Code source (données + composants) | **Oui**, pour tout changement |
| `ray-studios-guide.html` | Version autonome mise en ligne | Non (généré automatiquement) |
| `build_html_v2.py` | Script qui assemble le HTML final | Rarement (ajout d'icône) |
| `index.html` | Le `.html` renommé pour Vercel | Non (c'est une copie) |

---

*Fin de la documentation. Pour toute reprise, commencer par lire les sections 1 à 4 : elles suffisent à comprendre et modifier l'outil au quotidien.*
