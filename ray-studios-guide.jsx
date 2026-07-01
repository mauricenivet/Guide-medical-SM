import { useState, useMemo } from "react";
import { Search, X, ChevronRight, RotateCcw, Check, BookOpen, Target, ArrowRight, Stethoscope, AlertTriangle, Calculator, Lightbulb, AlertOctagon, Quote, Copy, Ban, Atom } from "lucide-react";

// ============================================================
// DONNÉES. Modifie librement le contenu ici
// ============================================================

const RAY_ORANGE = "#ED9B5F";
const RAY_ORANGE_SOFT = "#F8E4D2";

const THEMES = [
  { id: "before",    label: "Avant la séance",  hint: "Préparation, ce qu'il faut savoir" },
  { id: "flow",      label: "Le déroulé",       hint: "Consultation, séance, parcours" },
  { id: "pricing",   label: "Tarifs & mesure",  hint: "Grille, calcul, ajustements" },
  { id: "care72",    label: "After care",       hint: "Pansement, vaseline, cicatrisation" },
  { id: "alert",     label: "Quand alerter",    hint: "Signaux, cloques, urgences" },
  { id: "special",   label: "Cas particuliers", hint: "Sourcils, zones interdites" },
];

// needsDoctor : la directrice doit transmettre au médecin
const QA = [
  // ===== AVANT LA SÉANCE =====
  {
    id: 1, theme: "before",
    question: "Comment se préparer avant la séance ?",
    short: "Pas d'exposition solaire intense la semaine d'avant. Si vous êtes un peu bronzé, prévenez-nous, le médecin adaptera les paramètres.",
    detail: "Un léger bronzage n'empêche pas la séance, mais un coup de soleil oblige à reporter. Pas besoin de venir à jeun, vous pouvez manger normalement avant. Vêtements amples conseillés sur la zone à traiter.",
    keywords: ["préparer", "avant", "préparation", "à jeun", "manger"],
  },
  {
    id: 2, theme: "before",
    question: "Et si je suis enceinte ou j'allaite ?",
    short: "C'est une contre-indication. On reverra ensemble après l'accouchement et la fin de l'allaitement.",
    detail: "Pas de séance pendant la grossesse ni l'allaitement, par principe de précaution. Certains praticiens recommandent d'attendre 4 mois après l'accouchement. On peut planifier dès maintenant pour plus tard.",
    keywords: ["enceinte", "grossesse", "allaitement", "bébé"],
  },
  {
    id: 3, theme: "before",
    question: "Je suis mineur, comment ça se passe ?",
    short: "Un parent ou représentant légal doit être présent à la consultation et à chaque séance.",
    detail: "Aucune séance sans accompagnement d'un parent ou représentant légal. C'est valable pour la consultation initiale et toutes les séances suivantes.",
    keywords: ["mineur", "ado", "parents", "16 ans", "17 ans"],
  },
  {
    id: 4, theme: "before",
    question: "Je peux conduire après la séance ?",
    short: "Oui. Pas d'anesthésie, juste du froid local. Aucune contre-indication.",
    detail: "Vous ressortez en pleine possession de vos moyens. La cryothérapie est locale et ses effets disparaissent rapidement.",
    keywords: ["conduire", "voiture", "rentrer", "voiture seul"],
  },
  {
    id: 5, theme: "before",
    question: "Je dois venir avec quelque chose ?",
    short: "Juste vous-même, votre pièce d'identité, et vos questions. Vêtements amples sur la zone recommandés.",
    detail: "Aucun matériel à apporter. On fournit tout : lunettes, pansement, vaseline, fiche de soins. Prévoyez des vêtements pratiques selon la zone à traiter.",
    keywords: ["amener", "apporter", "matériel", "vêtements"],
  },
  {
    id: 6, theme: "before",
    question: "J'ai un coup de soleil récent, je peux venir ?",
    short: "Non, on doit reporter. C'est une contre-indication stricte.",
    detail: "Un coup de soleil augmente fortement le risque d'hyperpigmentation. On reprogramme la séance une fois la peau totalement remise.",
    keywords: ["coup de soleil", "brûlé", "vacances", "uv"],
  },
  {
    id: 7, theme: "before",
    question: "Je prends un médicament, c'est compatible ?",
    short: "À transmettre au médecin pour qu'il évalue. Ne jamais répondre seule sur ce point.",
    detail: "Certains médicaments sont neutres, d'autres demandent un ajustement, certains rares cas reportent la séance. Le médecin évalue lors de la consultation initiale et à chaque mise à jour du dossier.",
    keywords: ["médicament", "traitement", "antibiotique", "pilule", "antidépresseur", "compatible"],
    needsDoctor: true,
  },

  // ===== LE DÉROULÉ =====
  {
    id: 10, theme: "flow",
    question: "Comment se passe la première consultation ?",
    short: "Le médecin évalue le tatouage, prend des photos, remplit le questionnaire médical, explique le parcours et établit le devis. Comptez 45 minutes.",
    detail: "Étapes : motif de consultation, questionnaire médical, photos (avec dermatoscope si besoin), explications laser et soins, mesure et devis, Ray Tattoo Profile, consentement éclairé.",
    keywords: ["consultation", "première", "déroulé", "rendez-vous", "45 minutes"],
  },
  {
    id: 11, theme: "flow",
    question: "Comment se passe une séance de traitement ?",
    short: "Check de l'évolution, photos avant, traitement laser avec cryothérapie et lunettes, soins immédiats (vaseline + pansement), photos après.",
    detail: "Le tir laser lui-même est court (quelques minutes pour les petits tatouages, plus pour les grands). On termine par l'application de vaseline et la pose du pansement. Une fiche de soins est remise à chaque sortie.",
    keywords: ["séance", "traitement", "comment ça se passe", "déroulé"],
  },
  {
    id: 12, theme: "flow",
    question: "C'est quoi la différence entre une consultation seule et un bundle ?",
    short: "Bundle = consultation + première séance le même jour. Consultation seule = évaluation et plan, séances à programmer ensuite.",
    detail: "Le bundle convient si le médecin valide l'absence de contre-indication et que le patient veut démarrer immédiatement. La consultation seule laisse du temps pour réfléchir au devis avant de s'engager.",
    keywords: ["bundle", "consultation seule", "différence", "package"],
  },
  {
    id: 13, theme: "flow",
    question: "Le médecin fait tout, je suis là pour quoi ?",
    short: "L'équipe Ray studios gère l'administratif et la logistique pour que le médecin se consacre au médical : consultation, laser, suivi.",
    detail: "Vous accueillez, expliquez le parcours, gérez devis et consentements, et accompagnez le patient. Le médecin est dédié au médical.",
    keywords: ["rôle", "SM", "directrice", "qui fait quoi", "médecin"],
  },

  // ===== TARIFS & MESURE =====
  {
    id: 20, theme: "pricing",
    question: "Comment on mesure un tatouage ?",
    short: "Longueur × largeur de la zone tatouée, en centimètres. La surface en cm² détermine la taille dans la grille.",
    detail: "Exemple : tatouage 3 × 4 cm = 12 cm² → taille S → 149 €. Le coefficient de remplissage reste subjectif : par souci de transparence, expliquez votre méthode de calcul au patient s'il le demande.",
    keywords: ["mesurer", "mesure", "calcul", "surface", "cm2", "centimètres"],
  },
  {
    id: 21, theme: "pricing",
    question: "Quels sont les prix ?",
    short: "Tarif par séance, indexé sur la surface en cm². Voir la grille complète.",
    detail: "XXS (< 1 cm²) 59€ · XS (< 5) 99€ · S (5–15) 149€ · M (16–50) 199€ · L (51–100) 249€ · XL (101–250) 299€ · XXL (251–500) 399€ · 3XL (501–800) 549€ · 4XL (801–1150) 699€ · 5XL (1151–1550) 849€ · 6XL (1551–2000) 999€ · 7XL (2001–2500) 1149€ · 8XL (2501–3000) 1299€ · Au-delà : sur devis.",
    keywords: ["prix", "tarif", "combien", "coût", "grille"],
    hasGrid: true,
  },
  {
    id: 22, theme: "pricing",
    question: "Et si la mesure est tout juste au-dessus d'une tranche ?",
    short: "C'est au jugement du médecin de rester sur la taille ou de passer à l'inférieure. On peut aussi proposer d'ajouter un autre tatouage pour optimiser le devis.",
    detail: "Exemple : 101,5 cm² → arbitrage médecin. Le patient apprécie généralement la transparence sur ce calcul.",
    keywords: ["juste au-dessus", "limite", "tranche", "arrondir"],
  },
  {
    id: 23, theme: "pricing",
    question: "Mon tatouage n'est pas entièrement rempli, c'est pareil ?",
    short: "Le médecin peut ajuster la zone prise en compte. On l'explique au patient pour que le calcul soit clair.",
    detail: "Cette adaptation est généralement bien perçue : le patient comprend l'ajustement et ne se sent pas lésé. Toujours expliquer la méthode si on adapte.",
    keywords: ["pas rempli", "ajuster", "vide", "espace", "lettres"],
  },
  {
    id: 24, theme: "pricing",
    question: "Sourcils, taches de rousseur, prix spécifiques ?",
    short: "Sourcils complets 159€ · Pointe des sourcils 99€ · Taches de rousseur 159€. Tarif forfaitaire, pas au cm².",
    detail: "Pour les zones cosmétiques visage, c'est un forfait fixe. La consultation initiale reste obligatoire pour confirmer la faisabilité.",
    keywords: ["sourcils", "taches", "rousseur", "cosmétique", "visage"],
  },
  {
    id: 25, theme: "pricing",
    question: "Et un tatouage circonférentiel (qui fait le tour) ?",
    short: "Grille spécifique, à partir de 149€ pour la taille S. Le calcul prend en compte le tour complet.",
    detail: "Circ. S (< 16 cm²) 149€ · M (16–50) 199€ · L (50–100) 249€ · XL (100–250) 299€ · 2XL (251–500) 399€ · 3XL (501–800) 549€ · 4XL (801–1150) 699€.",
    keywords: ["circonférentiel", "tour", "bracelet", "cheville", "bras"],
  },
  {
    id: 26, theme: "pricing",
    question: "Combien de séances le patient devra payer ?",
    short: "Le nombre dépend du Ray Tattoo Profile établi par le médecin. À ne pas annoncer sans son évaluation.",
    detail: "Chaque séance est facturée individuellement. L'estimation du nombre revient au médecin lors de la consultation initiale.",
    keywords: ["nombre", "séances", "total", "combien fois"],
    needsDoctor: true,
  },

  // ===== SOINS 72H =====
  {
    id: 30, theme: "care72",
    question: "Combien de temps garder le pansement ?",
    short: "Jusqu'à la première douche : on l'enlève sans forcer, et on ne le remet pas ensuite.",
    detail: "Le pansement posé par le médecin protège pendant les premières heures. Sous la douche, on enlève sans forcer.",
    keywords: ["pansement", "garder", "enlever", "combien temps"],
  },
  {
    id: 31, theme: "care72",
    question: "Comment se laver après la séance ?",
    short: "Savon neutre, sans frotter, eau pas trop chaude. Sécher en tapotant doucement, jamais en frottant.",
    detail: "Pas besoin de couvrir la zone sous la douche. Évitez l'eau brûlante. Tamponnez avec une serviette propre, pas de friction.",
    keywords: ["douche", "laver", "savon", "eau"],
  },
  {
    id: 32, theme: "care72",
    question: "Quels soins appliquer après la douche ?",
    short: "Vaseline en couche épaisse + compresse + sparadrap. À renouveler 1 fois par jour pendant au moins 72 heures.",
    detail: "Le protocole occlusif (vaseline + pansement) favorise une cicatrisation rapide et propre. Pas de film alimentaire qui favorise la sudation.",
    keywords: ["après douche", "vaseline", "compresse", "pansement"],
  },
  {
    id: 33, theme: "care72",
    question: "Quelle alternative si le patient n'a pas de vaseline ?",
    short: "Aquaphor est une alternative. Pour le visage ou les sourcils, c'est Cicaplast SPF 50.",
    detail: "Sur visage et zones où le pansement est inadapté : Cicaplast SPF 50, 3 fois par jour, dès la sortie. C'est notre protocole spécifique.",
    keywords: ["vaseline", "remplacer", "aquaphor", "alternative", "cicaplast"],
  },
  {
    id: 34, theme: "care72",
    question: "Sport, soleil, piscine : autorisés pendant les 48 h ?",
    short: "Non à tout. Pas de sport intense, pas de soleil, pas de piscine, pas de bain, ni sauna ni hammam.",
    detail: "La sudation et la chaleur ralentissent la cicatrisation et augmentent le risque d'infection. Activités douces uniquement.",
    keywords: ["sport", "piscine", "bain", "sauna", "hammam", "48h"],
  },
  {
    id: 35, theme: "care72",
    question: "Peut-on appliquer de la glace sur la zone ?",
    short: "Jamais de glaçon directement sur la peau. Une compresse fraîche enveloppée, brièvement, si la zone chauffe.",
    detail: "La cryothérapie a déjà été faite en séance. Si gonflement ou chaleur, compresse fraîche enveloppée 10 minutes maximum.",
    keywords: ["glace", "froid", "compresse", "chaud"],
  },

  // ===== CICATRISATION (3-10 jours) =====
  {
    id: 40, theme: "care72",
    question: "Combien de temps dure la cicatrisation ?",
    short: "7 à 10 jours en moyenne. Variable selon la zone traitée et le respect des soins.",
    detail: "Le délai dépend de la localisation, de la surface et du respect des soins. Les zones très vascularisées cicatrisent plus vite.",
    keywords: ["cicatriser", "cicatrisation", "temps", "guérir"],
  },
  {
    id: 41, theme: "care72",
    question: "Quels soins après les 72 h de vaseline ?",
    short: "Si pas d'effets secondaires : Cicaplast SPF 50, 3 fois par jour jusqu'à cicatrisation complète. Pansement seulement en cas de frottements.",
    detail: "On passe d'un protocole occlusif (humide) à un protocole crème + protection solaire. La SPF 50 est essentielle même si la zone est couverte.",
    keywords: ["après 72h", "cicaplast", "crème", "suite", "spf"],
  },
  {
    id: 42, theme: "care72",
    question: "Que faire en cas de croûtes ?",
    short: "Normal. Ne jamais gratter ni arracher : on laisse tomber seul et on continue d'hydrater.",
    detail: "Les croûtes font partie du processus. Maintenir la peau hydratée pour éviter les cicatrices. Si démangeaisons, un antihistaminique oral peut soulager.",
    keywords: ["croûte", "croute", "arracher", "gratter"],
  },
  {
    id: 43, theme: "care72",
    question: "Les démangeaisons sont-elles normales ?",
    short: "Fréquent, oui. Pas de corticoïde tant que la peau n'est pas reconstituée. Si c'est très intense, contactez-nous.",
    detail: "Démangeaisons modérées = normal. Démangeaisons intenses ou avec autres signes = on prévient le médecin.",
    keywords: ["démange", "démangeaison", "gratte", "prurit"],
  },
  {
    id: 44, theme: "care72",
    question: "Quand reprendre le sport ?",
    short: "Activité modérée après 48 heures. Sports de contact et transpiration intense : attendre 7 jours.",
    detail: "Pas de rugby, arts martiaux ou crossfit pendant 7 jours. Vêtements amples et respirants en attendant.",
    keywords: ["sport", "reprendre", "activité", "course", "salle"],
  },
  {
    id: 45, theme: "care72",
    question: "Quelle protection solaire après cicatrisation ?",
    short: "SPF 50 obligatoire sur la zone si exposition, renouvelé toutes les 2-3 heures. Pas d'exposition prolongée entre les séances.",
    detail: "L'hyperpigmentation post-laser est le principal risque solaire. La protection reste requise jusqu'à la fin du traitement complet.",
    keywords: ["soleil", "bronzer", "vacances", "spf", "protection"],
  },
  {
    id: 46, theme: "care72",
    question: "Quel délai avant la prochaine séance ?",
    short: "Au minimum 6 à 8 semaines après la séance, le temps que le corps évacue les pigments.",
    detail: "Aller plus vite serait contre-productif : les macrophages ont besoin de ce délai pour faire leur travail. C'est valable pour toutes les zones.",
    keywords: ["prochain", "rendez-vous", "rdv", "espacement", "8 semaines"],
  },

  // ===== QUAND ALERTER =====
  {
    id: 50, theme: "alert",
    question: "Quels signaux justifient un appel au centre ?",
    short: "Douleurs importantes, fièvre, écoulement purulent, phlyctènes (cloques), démangeaisons intenses. Le patient doit nous contacter, on prévient le médecin.",
    detail: "Toute apparition inhabituelle dans les jours suivant la séance mérite un contact. Mieux vaut un appel pour rien qu'un signal manqué.",
    keywords: ["signaux", "alerter", "appeler", "urgence", "symptômes"],
  },
  {
    id: 51, theme: "alert",
    question: "Le patient a une cloque, c'est grave ?",
    short: "Une cloque peut être normale dans les heures qui suivent. Surtout ne pas la percer. On prévient le médecin.",
    detail: "Phlyctène = réaction connue. À ne jamais percer soi-même. Le médecin décidera si une évacuation est nécessaire (sous indication, jamais en autonomie).",
    keywords: ["cloque", "phlyctène", "ampoule", "bulle", "percer"],
  },
  {
    id: 52, theme: "alert",
    question: "Rougeur très persistante après plusieurs jours ?",
    short: "Au-delà de 8-10 jours sans amélioration, on prévient le médecin. Il évaluera si traitement nécessaire.",
    detail: "Rougeur modérée pendant les premiers jours = normal. Si ça persiste ou s'aggrave, transmission au médecin pour évaluation.",
    keywords: ["rougeur", "rouge", "persiste", "longtemps", "érythème"],
  },
  {
    id: 53, theme: "alert",
    question: "Le tatouage semble plus foncé après la séance ?",
    short: "Phénomène connu (assombrissement paradoxal) sur certains pigments. Pas grave. Le médecin adaptera les paramètres aux séances suivantes.",
    detail: "Surtout sur encres rouges, blanches ou beiges contenant des oxydes métalliques. Réversible avec ajustement des longueurs d'onde par le médecin.",
    keywords: ["plus foncé", "noir", "sombre", "paradoxal", "noirci"],
  },
  {
    id: 54, theme: "alert",
    question: "Fièvre, douleur intense, écoulement : on fait quoi ?",
    short: "Le patient contacte le centre immédiatement. On joint le médecin sans attendre.",
    detail: "Signes possibles d'infection. Pas d'attente, pas de minimisation. Transmission rapide au médecin pour prise en charge.",
    keywords: ["fièvre", "infection", "purulent", "écoulement", "urgence"],
    urgent: true,
  },
  {
    id: 55, theme: "alert",
    question: "Le patient est très anxieux, qu'est-ce que je fais ?",
    short: "Écouter, rassurer sans minimiser, transmettre ses inquiétudes au médecin. Ne pas trancher seule sur une question médicale.",
    detail: "Reconnaître l'inquiétude est souvent la moitié du travail. Documenter ce que le patient décrit pour que le médecin ait le contexte.",
    keywords: ["anxieux", "inquiet", "stressé", "panique"],
  },
];

const SCENARIOS = [
  {
    id: 1,
    situation: "Un patient demande au téléphone combien de séances il lui faudra pour un avant-bras complet noir.",
    options: [
      { text: "« Le noir part très bien, donc ce sera assez rapide, sans doute trois ou quatre séances. »", correct: false,
        why: "Le noir répond bien, mais 'rapide' et un chiffre bas créent une attente intenable." },
      { text: "« Sans l'évaluation c'est impossible à dire. Le médecin établira votre profil en consultation. »", correct: true,
        why: "La seule posture juste : aucune estimation chiffrée sans examen, même approximative." },
      { text: "« Pour une grande pièce noire, comptez en moyenne entre huit et douze séances environ. »", correct: false,
        why: "Sonne raisonnable, mais une fourchette précise reste un pronostic réservé au médecin." },
    ],
  },
  {
    id: 2,
    situation: "Un patient signale par message une cloque tendue et douloureuse, 36 heures après sa séance.",
    options: [
      { text: "« Ne la percez pas, gardez-la propre, et je préviens le médecin pour qu'il vous rappelle. »", correct: true,
        why: "Consigne minimale juste (ne pas percer) et transmission immédiate au bon interlocuteur." },
      { text: "« C'est normal, percez-la avec une aiguille bien désinfectée puis mettez un pansement dessus. »", correct: false,
        why: "On ne donne jamais de consigne de perçage. L'évacuation, si besoin, relève du praticien." },
      { text: "« C'est une cloque tout à fait normale, elle va se résorber seule, ne vous inquiétez pas. »", correct: false,
        why: "Une cloque tendue et douloureuse mérite l'avis du praticien, pas une banalisation." },
    ],
  },
  {
    id: 3,
    situation: "Une patiente phototype V revient à 3 mois : la zone traitée est nettement plus claire que sa peau.",
    options: [
      { text: "« C'est de l'hypopigmentation, c'est temporaire, ça reviendra à la normale en quelques mois. »", correct: false,
        why: "Le terme est juste, mais le pronostic ne l'est pas : ça peut être durable, pas à vous de rassurer." },
      { text: "« C'est l'éclaircissement recherché par le laser sur cette zone, c'est plutôt bon signe pour vous. »", correct: false,
        why: "Faux : éclaircir la peau n'est pas l'objectif, c'est un effet indésirable possible." },
      { text: "« Je vous prends un rendez-vous prioritaire avec le médecin pour qu'il puisse évaluer ça. »", correct: true,
        why: "Une dépigmentation persistante à 3 mois se transmet sans pronostiquer ni minimiser." },
    ],
  },
  {
    id: 4,
    situation: "Un patient veut payer en surprise la première séance de sa compagne, qui n'est jamais venue.",
    options: [
      { text: "« Je vous fais un bon cadeau du montant souhaité, elle viendra ensuite en consultation elle-même. »", correct: true,
        why: "Refuse le contournement de la consultation tout en proposant une vraie alternative." },
      { text: "« Bien sûr, je prends le paiement maintenant et je lui bloque directement une date au planning. »", correct: false,
        why: "Aucun rendez-vous sans consultation ni consentement signé par la personne concernée." },
      { text: "« Ce n'est pas possible chez nous, on ne prend pas de paiement de la part d'une tierce personne. »", correct: false,
        why: "Le bon cadeau règle pourtant la situation. Refuser sec ferme une porte ouverte." },
    ],
  },
  {
    id: 5,
    situation: "Un patient insiste pour espacer ses séances de 4 semaines au lieu de 6 à 8, sa peau cicatrise vite.",
    options: [
      { text: "« Si votre peau cicatrise vraiment vite, je le note pour que le médecin valide cinq semaines. »", correct: false,
        why: "Le délai ne dépend pas de la cicatrisation cutanée mais de l'évacuation des pigments." },
      { text: "« Le délai sert à évacuer les pigments, pas à cicatriser la peau, donc on garde six à huit semaines. »", correct: true,
        why: "Refus argumenté sur le bon mécanisme : c'est le drainage par les macrophages qui impose le délai." },
      { text: "« La vitesse de cicatrisation change tout, on peut donc tenter un délai plus court avec prudence. »", correct: false,
        why: "Confond cicatrisation et évacuation des pigments. Le raccourci est faux." },
    ],
  },
  {
    id: 6,
    situation: "Un patient arrive avec un léger coup de soleil sur la zone à traiter, mais il a posé un jour de congé.",
    options: [
      { text: "« On va adapter la fluence à la baisse et on fait quand même votre séance aujourd'hui. »", correct: false,
        why: "Un coup de soleil est une contre-indication stricte, pas un paramètre à ajuster." },
      { text: "« Le médecin tranchera, installez-vous en salle d'attente et je le préviens de la situation. »", correct: false,
        why: "La règle est claire : coup de soleil égale report. Inutile de faire patienter." },
      { text: "« Un coup de soleil impose de reporter, même léger, je vais donc vous reprogrammer. »", correct: true,
        why: "Décision juste malgré le congé du patient : la sécurité prime sur l'organisation." },
    ],
  },
  {
    id: 7,
    situation: "Un patient sous isotrétinoïne depuis 3 mois pour son acné demande à démarrer son détatouage.",
    options: [
      { text: "« L'isotrétinoïne agit sur l'acné, pas sur la peau face au laser, donc on peut commencer. »", correct: false,
        why: "Faux : c'est une contre-indication temporaire connue. Et on ne tranche jamais soi-même." },
      { text: "« Je note votre traitement dans le dossier, c'est au médecin de l'évaluer en consultation. »", correct: true,
        why: "Ni validation ni refus à votre niveau : transmission et documentation, point." },
      { text: "« C'est contre-indiqué, il faudra revenir environ deux mois après la fin de votre traitement. »", correct: false,
        why: "L'info va dans le bon sens, mais c'est au médecin de poser le délai, pas à vous." },
    ],
  },
  {
    id: 8,
    situation: "Un patient compare votre devis à un concurrent 30 % moins cher et demande pourquoi un tel écart.",
    options: [
      { text: "« Les centres low-cost rognent forcément sur la sécurité, nous on fait vraiment les choses bien. »", correct: false,
        why: "Dénigre sans savoir : vous ne connaissez pas les pratiques exactes du concurrent." },
      { text: "« Chez nous, c'est le médecin qui réalise la séance, le laser est un PicoWay, et tout est encadré. »", correct: true,
        why: "Donne des critères factuels de comparaison, sans dénigrer ni se justifier sur le prix seul." },
      { text: "« Le prix reflète simplement la qualité, vous avez ce pour quoi vous payez, c'est tout. »", correct: false,
        why: "Argument creux et un peu condescendant. N'aide pas le patient à comparer vraiment." },
    ],
  },
  {
    id: 9,
    situation: "Une cliente vous confie en salle d'attente qu'elle traverse une période très sombre en ce moment.",
    options: [
      { text: "« Je vais prévenir le médecin pour voir si on peut maintenir votre séance malgré tout aujourd'hui. »", correct: false,
        why: "Transforme une confidence intime en logistique de planning. Déplacé." },
      { text: "« La séance va vous changer les idées, vous allez voir, ça va aller beaucoup mieux après. »", correct: false,
        why: "Minimise et fait de la séance une fausse thérapie. La souffrance n'est pas une parenthèse." },
      { text: "« Je vous entends. Le 3114 est une ligne d'écoute gratuite, et on peut aussi reporter si besoin. »", correct: true,
        why: "Écoute, oriente vers une ressource réelle, laisse le choix sans forcer." },
    ],
  },
  {
    id: 10,
    situation: "Un patient demande pourquoi le médecin commence par de petits tirs test au lieu de tout traiter.",
    options: [
      { text: "« C'est une façon de vous facturer une séance avant de s'engager vraiment sur le reste du tatouage. »", correct: false,
        why: "Faux et contre-productif : les points test ne sont pas une étape commerciale." },
      { text: "« C'est pour vérifier comment votre peau réagit au laser avant de traiter toute la zone. »", correct: true,
        why: "Vraie raison : évaluer la réaction cutanée et ajuster les paramètres en sécurité." },
      { text: "« C'est une obligation légale qui s'impose avant tout traitement réalisé au laser. »", correct: false,
        why: "Ce n'est pas une obligation légale, c'est une précaution clinique." },
    ],
  },
  {
    id: 11,
    situation: "Un patient veut savoir si son tatouage rouge vif partira aussi bien que la partie noire.",
    options: [
      { text: "« Le rouge ne part jamais vraiment, il faut vous attendre à en garder une trace visible. »", correct: false,
        why: "Faux : nos longueurs d'onde traitent le rouge. Décourage à tort." },
      { text: "« Aucun souci, toutes les couleurs partent exactement de la même façon avec notre laser. »", correct: false,
        why: "Trop affirmatif : les couleurs vives sont plus capricieuses que le noir." },
      { text: "« Les couleurs répondent moins vite que le noir, le médecin évaluera votre cas précis. »", correct: true,
        why: "Honnête sur la difficulté relative, sans fermer la porte, et renvoie à l'évaluation." },
    ],
  },
  {
    id: 12,
    situation: "Une patiente enceinte de 4 mois veut bloquer dès maintenant une date pour 6 mois après l'accouchement.",
    options: [
      { text: "« Je vous mets dans notre liste de rappel pour vous recontacter après votre accouchement. »", correct: true,
        why: "Évite un engagement à long terme alors que tout peut changer (allaitement, médicaments)." },
      { text: "« Je vous bloque la date tout de suite, comme ça vous êtes certaine d'avoir votre créneau. »", correct: false,
        why: "Bloquer un créneau ferme à 8 mois est imprudent : la situation médicale aura pu changer." },
      { text: "« On verra ça le moment venu, rappelez-nous simplement quand vous vous sentirez prête. »", correct: false,
        why: "Risque de perdre le contact. La liste de rappel est nettement plus pro." },
    ],
  },
  {
    id: 13,
    situation: "Un patient ressort de sa première séance sur phototype VI et s'inquiète d'avoir presque rien senti.",
    options: [
      { text: "« Si vous n'avez rien senti, c'est qu'on n'a pas tiré assez fort, on montera la prochaine fois. »", correct: false,
        why: "Faux et inquiétant : la douleur n'est pas le critère, et les fluences basses sont protocolaires." },
      { text: "« Le laser ne fait de toute façon jamais vraiment mal, c'est normal de ne presque rien sentir. »", correct: false,
        why: "Faux : le laser peut être inconfortable. Ici c'est la fluence basse qui explique." },
      { text: "« Sur une peau foncée, on commence volontairement en douceur, c'est un choix de sécurité. »", correct: true,
        why: "Explique le protocole : fluences basses au départ sur phototype VI, montée progressive." },
    ],
  },
  {
    id: 14,
    situation: "Un patient demande si son grain de beauté situé en plein milieu du tatouage sera traité aussi.",
    options: [
      { text: "« On le protège pendant toute la séance, le médecin l'examinera et décidera de la suite. »", correct: true,
        why: "Bonne posture : protection systématique du naevus, examen et décision au médecin." },
      { text: "« On tire dessus comme sur le reste du tatouage, ça ne pose aucun problème particulier. »", correct: false,
        why: "Dangereux : on ne passe jamais le laser sur un naevus sans examen médical." },
      { text: "« Faites-le d'abord contrôler par un dermatologue avant de revenir nous voir pour la séance. »", correct: false,
        why: "Excessif : notre médecin peut l'examiner et décider de le protéger sur place." },
    ],
  },
  {
    id: 15,
    situation: "Un patient appelle à 22h, inquiet d'une rougeur étendue apparue après sa séance de l'après-midi.",
    options: [
      { text: "« Le centre est déjà fermé, le mieux est de rappeler demain à l'ouverture pour en parler. »", correct: false,
        why: "Il s'inquiète maintenant. On peut écouter et trier avant de renvoyer à demain." },
      { text: "« Décrivez-moi ce que vous voyez. Pas de fièvre ni d'écoulement ? Je fais remonter au médecin. »", correct: true,
        why: "Écoute, tri sur les signes graves, transmission. Posture pro même hors horaires." },
      { text: "« Une rougeur c'est toujours parfaitement normal après le laser, il ne faut pas vous inquiéter. »", correct: false,
        why: "Une rougeur étendue n'est pas anodine. La balayer d'un revers est risqué." },
    ],
  },
  {
    id: 16,
    situation: "Un patient demande à filmer sa séance pour prouver à son tatoueur sceptique que le laser marche.",
    options: [
      { text: "« Filmez tout ce que vous voulez, c'est votre corps et c'est donc parfaitement votre droit. »", correct: false,
        why: "Filmer dans un cabinet engage la confidentialité du personnel et d'autres patients." },
      { text: "« C'est strictement interdit chez nous, nous sommes dans un environnement strictement médical. »", correct: false,
        why: "Trop catégorique : avec un cadre précis, c'est négociable." },
      { text: "« À voir avec le médecin, et seulement sur la zone, sans personne d'autre dans le champ. »", correct: true,
        why: "Pose un cadre clair qui protège la confidentialité tout en restant ouvert." },
    ],
  },
  {
    id: 17,
    situation: "Un patient mentionne dans le questionnaire qu'il prend des compléments : ail, ginkgo et oméga 3.",
    options: [
      { text: "« Ce sont des produits parfaitement naturels, donc il n'y a aucun risque pour votre séance. »", correct: false,
        why: "'Naturel' n'égale pas neutre : certains influencent la coagulation." },
      { text: "« Arrêtez-les tous les trois une quinzaine de jours avant votre séance, par simple sécurité. »", correct: false,
        why: "Consigne médicale hors de votre rôle. C'est au médecin d'évaluer un éventuel arrêt." },
      { text: "« Je les note pour le médecin, car certains d'entre eux peuvent agir sur la coagulation. »", correct: true,
        why: "Zone grise réelle (effet anticoagulant léger), documentée et transmise sans trancher." },
    ],
  },
  {
    id: 18,
    situation: "Un patient annule à 9h sa séance de 11h pour une réunion imprévue. C'est sa première annulation.",
    options: [
      { text: "« Des frais d'annulation s'appliquent, car vous avez prévenu à moins de vingt-quatre heures. »", correct: false,
        why: "Trop rigide pour une première annulation justifiée. La relation client compte." },
      { text: "« Pas de souci du tout, je vous retrouve une autre date dès que ça vous arrange de revenir. »", correct: false,
        why: "Aucun cadre posé : le patient ignorera qu'il existe une politique pour la suite." },
      { text: "« Je vous reprogramme. Prévenez 24h avant la prochaine fois, pour éviter d'éventuels frais. »", correct: true,
        why: "Souple cette fois, mais pose le cadre pour l'avenir. Bon équilibre." },
    ],
  },
  {
    id: 19,
    situation: "Un patient a appliqué seul une crème anesthésiante achetée en ligne 30 minutes avant sa séance.",
    options: [
      { text: "« Je préviens le médecin, il verra si c'est compatible ou s'il faut plutôt reporter la séance. »", correct: true,
        why: "Transmet sans dramatiser, ouvre les options, laisse le médecin décider." },
      { text: "« C'est parfait, cette crème va justement vous rendre toute la séance bien plus confortable. »", correct: false,
        why: "Faux : une crème inconnue peut modifier la réponse cutanée au traitement." },
      { text: "« Enlevez tout immédiatement avec de l'alcool, et on pourra faire votre séance juste après. »", correct: false,
        why: "Réaction médicale autonome qui peut aggraver les choses. Pas votre décision." },
    ],
  },
  {
    id: 20,
    situation: "Un patient déçu après 3 séances trouve que son tatouage n'a presque pas bougé.",
    options: [
      { text: "« C'est tout à fait normal, il vous reste sans doute facilement une dizaine de séances à faire. »", correct: false,
        why: "Avance un chiffre sans dossier et banalise la déception. À éviter." },
      { text: "« Je comprends. Je propose au médecin de faire un point pour réévaluer votre progression. »", correct: true,
        why: "Écoute, propose un cadre de réévaluation médicale, ne s'engage sur aucun chiffre." },
      { text: "« Chaque peau réagit vraiment différemment, il faut juste être patient et laisser le temps. »", correct: false,
        why: "Vrai sur le fond mais évasif : n'apporte ni écoute ni solution concrète." },
    ],
  },
];

// ===== QUIZ MÉDICAL (questions de connaissances pures) =====
const MEDICAL_QUIZ = [
  {
    id: 1,
    question: "Quel type d'effet le laser PicoWay utilise-t-il pour fragmenter les pigments ?",
    options: [
      { text: "Un effet photothermique (par la chaleur)", correct: false,
        why: "C'est le mécanisme des anciens lasers nanoseconde. Le PicoWay agit différemment." },
      { text: "Un effet photoacoustique (par onde de choc mécanique)", correct: true,
        why: "Exact. Les impulsions ultra-courtes créent une onde de choc qui pulvérise les pigments sans chauffer les tissus autour." },
      { text: "Un effet chimique qui dissout l'encre", correct: false,
        why: "Le laser ne dissout pas l'encre, il la fragmente mécaniquement." },
    ],
  },
  {
    id: 2,
    question: "Une picoseconde correspond à :",
    options: [
      { text: "Un millième de seconde", correct: false,
        why: "Ça, c'est une milliseconde. La picoseconde est bien plus courte." },
      { text: "Un trillionième de seconde (10⁻¹² s)", correct: true,
        why: "Exact. Le PicoWay tire entre 250 et 450 picosecondes selon la longueur d'onde." },
      { text: "Un millionième de seconde", correct: false,
        why: "Ça, c'est une microseconde." },
    ],
  },
  {
    id: 3,
    question: "Quelle longueur d'onde est la plus adaptée pour une encre noire ?",
    options: [
      { text: "532 nm", correct: false,
        why: "Le 532 nm cible plutôt le rouge, le jaune et l'orange." },
      { text: "1064 nm", correct: true,
        why: "Exact. Le 1064 nm cible le noir, le marron, le bleu et le violet, et convient à tous les phototypes." },
      { text: "730 nm", correct: false,
        why: "Le 730 nm est optimisé pour le vert et le bleu." },
    ],
  },
  {
    id: 4,
    question: "Pour quelles couleurs d'encre utilise-t-on le 532 nm ?",
    options: [
      { text: "Noir et bleu foncé", correct: false,
        why: "Le noir et le bleu foncé relèvent du 1064 nm." },
      { text: "Vert et bleu uniquement", correct: false,
        why: "Le vert et le bleu sont mieux traités par le 730 nm." },
      { text: "Rouge, jaune et orange", correct: true,
        why: "Exact. Le 532 nm est la longueur d'onde des couleurs chaudes." },
    ],
  },
  {
    id: 5,
    question: "Combien de phototypes compte l'échelle de Fitzpatrick ?",
    options: [
      { text: "4", correct: false,
        why: "Non, il y en a davantage." },
      { text: "8", correct: false,
        why: "Non, l'échelle s'arrête à VI." },
      { text: "6", correct: true,
        why: "Exact. De I (très claire, brûle toujours) à VI (très foncée, ne brûle pas)." },
    ],
  },
  {
    id: 6,
    question: "Pourquoi les phototypes foncés demandent-ils plus de précautions ?",
    options: [
      { text: "Parce que leur peau contient plus de mélanine, qui absorbe aussi la lumière du laser", correct: true,
        why: "Exact. La mélanine entre en compétition avec l'encre pour absorber le laser, d'où le risque de dépigmentation." },
      { text: "Parce que leur peau est plus épaisse", correct: false,
        why: "Ce n'est pas une question d'épaisseur." },
      { text: "Parce qu'ils ressentent moins la douleur", correct: false,
        why: "Aucun rapport avec la sensibilité à la douleur." },
    ],
  },
  {
    id: 7,
    question: "Quel est le délai minimum recommandé entre deux séances de détatouage ?",
    options: [
      { text: "6 à 8 semaines", correct: true,
        why: "Exact. C'est le temps nécessaire pour que les macrophages évacuent les pigments via le système lymphatique." },
      { text: "2 à 3 semaines", correct: false,
        why: "Trop court. Le corps n'a pas le temps d'évacuer les pigments fragmentés." },
      { text: "6 mois", correct: false,
        why: "Trop long, ce n'est pas nécessaire." },
    ],
  },
  {
    id: 8,
    question: "Qu'est-ce que le « givrage » observé pendant le traitement ?",
    options: [
      { text: "Un signe de brûlure qu'il faut éviter", correct: false,
        why: "Non, le givrage est recherché : c'est le bon critère d'évaluation clinique." },
      { text: "Un blanchiment instantané de la zone, signe que la fluence est adaptée", correct: true,
        why: "Exact. C'est un micro-dégagement de gaz lié à la fragmentation des pigments. Le médecin le recherche comme repère." },
      { text: "Une réaction allergique à l'encre", correct: false,
        why: "Le givrage n'a rien à voir avec une allergie." },
    ],
  },
  {
    id: 9,
    question: "Quelles cellules du corps évacuent les pigments fragmentés par le laser ?",
    options: [
      { text: "Les globules rouges", correct: false,
        why: "Les globules rouges transportent l'oxygène, pas les déchets pigmentaires." },
      { text: "Les macrophages", correct: true,
        why: "Exact. Ces cellules « éboueurs » ingèrent les fragments et les évacuent par le système lymphatique." },
      { text: "Les plaquettes", correct: false,
        why: "Les plaquettes servent à la coagulation." },
    ],
  },
  {
    id: 10,
    question: "Quelle est la principale différence entre l'effet photothermique et photoacoustique ?",
    options: [
      { text: "Le photoacoustique génère beaucoup plus de chaleur", correct: false,
        why: "C'est l'inverse : le photoacoustique génère moins de chaleur." },
      { text: "Le photoacoustique fragmente par onde de choc avec très peu de chaleur résiduelle", correct: true,
        why: "Exact. Moins de chaleur signifie moins de risque de cicatrices et un meilleur confort." },
      { text: "Il n'y a aucune différence pratique", correct: false,
        why: "La différence est majeure en termes de sécurité et d'efficacité." },
    ],
  },
  {
    id: 11,
    question: "La fluence se mesure en :",
    options: [
      { text: "Joules par cm² (J/cm²)", correct: true,
        why: "Exact. La fluence est l'énergie délivrée par unité de surface." },
      { text: "Millimètres (mm)", correct: false,
        why: "Le millimètre mesure la taille du spot, pas la fluence." },
      { text: "Hertz (Hz)", correct: false,
        why: "Le hertz mesure la fréquence des impulsions." },
    ],
  },
  {
    id: 12,
    question: "Que désigne la « taille du spot » ?",
    options: [
      { text: "La durée de l'impulsion", correct: false,
        why: "La durée se mesure en picosecondes, c'est un autre paramètre." },
      { text: "Le nombre de tirs par seconde", correct: false,
        why: "Ça, c'est la fréquence." },
      { text: "Le diamètre du faisceau laser, en millimètres", correct: true,
        why: "Exact. Un grand spot pénètre plus profondément, un petit reste plus superficiel." },
    ],
  },
  {
    id: 13,
    question: "Un grand spot, par rapport à un petit spot :",
    options: [
      { text: "Pénètre moins profondément", correct: false,
        why: "C'est l'inverse : le petit spot est plus superficiel." },
      { text: "N'a aucun effet sur la profondeur", correct: false,
        why: "La taille du spot influence directement la profondeur de pénétration." },
      { text: "Pénètre plus profondément dans la peau", correct: true,
        why: "Exact. Les grands spots sont moins dispersés, donc atteignent des pigments plus profonds." },
    ],
  },
  {
    id: 14,
    question: "Quel type de tatouage demande généralement le plus de séances ?",
    options: [
      { text: "Un tatouage amateur", correct: false,
        why: "Les tatouages amateurs ont peu d'encre, souvent moins de séances." },
      { text: "Un tatouage traumatique", correct: false,
        why: "Les tatouages traumatiques demandent en général 2 à 6 séances." },
      { text: "Un tatouage professionnel", correct: true,
        why: "Exact. L'encre est dense et déposée profondément et régulièrement, d'où plus de 6 à 12 séances possibles." },
    ],
  },
  {
    id: 15,
    question: "L'hypopigmentation est :",
    options: [
      { text: "Un assombrissement de la peau", correct: false,
        why: "Ça, c'est l'hyperpigmentation." },
      { text: "Un éclaircissement de la peau, parfois irréversible", correct: true,
        why: "Exact. La peau perd de la mélanine. Plus fréquent sur le 532 nm et en cas de refroidissement excessif." },
      { text: "Une cloque remplie de liquide", correct: false,
        why: "Une cloque est une phlyctène, c'est autre chose." },
    ],
  },
  {
    id: 16,
    question: "L'hyperpigmentation post-traitement est plus fréquente :",
    options: [
      { text: "Sur les phototypes très clairs (I et II)", correct: false,
        why: "Non, le risque est inverse." },
      { text: "Uniquement sur les tatouages colorés", correct: false,
        why: "L'hyperpigmentation dépend du phototype et du soleil, pas de la couleur de l'encre." },
      { text: "Sur les phototypes foncés et en cas d'exposition solaire", correct: true,
        why: "Exact. C'est pourquoi la protection solaire SPF 50 est essentielle, surtout sur peaux mates." },
    ],
  },
  {
    id: 17,
    question: "Une phlyctène, c'est :",
    options: [
      { text: "Une cloque, bulle de liquide sous l'épiderme", correct: true,
        why: "Exact. Elle peut apparaître 24 à 48h après la séance. À ne jamais percer soi-même." },
      { text: "Une rougeur passagère", correct: false,
        why: "La rougeur s'appelle érythème." },
      { text: "Une croûte sèche", correct: false,
        why: "Une croûte est un stade différent de la cicatrisation." },
    ],
  },
  {
    id: 18,
    question: "Quel est le temps de cicatrisation moyen après une séance ?",
    options: [
      { text: "1 à 2 jours", correct: false,
        why: "Trop court pour une cicatrisation complète." },
      { text: "7 à 10 jours", correct: true,
        why: "Exact. Variable selon la zone, la surface et le respect des soins post-séance." },
      { text: "1 mois", correct: false,
        why: "Plus long que la réalité dans la majorité des cas." },
    ],
  },
  {
    id: 19,
    question: "Pendant les 72 premières heures, quel soin est recommandé en protocole standard ?",
    options: [
      { text: "Exposer la zone à l'air libre sans rien appliquer", correct: false,
        why: "Non, la cicatrisation en milieu humide est préférée." },
      { text: "Vaseline en couche épaisse sous un pansement, renouvelée chaque jour", correct: true,
        why: "Exact. Le milieu humide occlusif accélère la cicatrisation et limite les croûtes." },
      { text: "Désinfecter à l'alcool plusieurs fois par jour", correct: false,
        why: "L'alcool est trop agressif et assèche la plaie." },
    ],
  },
  {
    id: 20,
    question: "Pourquoi proscrit-on le film alimentaire sur une zone traitée ?",
    options: [
      { text: "Parce qu'il favorise la sudation et les irritations", correct: true,
        why: "Exact. Il crée un environnement non respirant propice aux macérations, surtout par temps chaud." },
      { text: "Parce qu'il colle à la peau", correct: false,
        why: "Ce n'est pas la raison principale." },
      { text: "Parce qu'il bloque l'action du laser", correct: false,
        why: "Le film s'applique après la séance, il n'interagit pas avec le laser." },
    ],
  },
  {
    id: 21,
    question: "Quelle est la conduite à tenir face à une phlyctène (cloque) ?",
    options: [
      { text: "La percer avec une aiguille stérile", correct: false,
        why: "Jamais de soi-même. L'évacuation ne se fait que sur indication du praticien." },
      { text: "Ne pas la percer et prévenir le praticien si elle est volumineuse ou douloureuse", correct: true,
        why: "Exact. Percer expose à l'infection. On protège et on transmet au médecin." },
      { text: "Appliquer de l'alcool dessus", correct: false,
        why: "L'alcool est inadapté sur une plaie." },
    ],
  },
  {
    id: 22,
    question: "Quel SPF est recommandé entre les séances et jusqu'à cicatrisation complète ?",
    options: [
      { text: "SPF 15", correct: false,
        why: "Insuffisant pour protéger une peau fragilisée par le laser." },
      { text: "Aucune protection n'est nécessaire", correct: false,
        why: "Au contraire, le soleil est le principal facteur de risque pigmentaire." },
      { text: "SPF 30 au strict minimum, idéalement SPF 50", correct: true,
        why: "Exact. La protection solaire élevée prévient l'hyperpigmentation post-inflammatoire." },
    ],
  },
  {
    id: 23,
    question: "Le coup de soleil sur la zone à traiter est :",
    options: [
      { text: "Une contre-indication stricte (on reporte la séance)", correct: true,
        why: "Exact. Le risque d'hyperpigmentation et de complications est trop élevé sur une peau brûlée." },
      { text: "Sans importance", correct: false,
        why: "Faux, c'est une contre-indication." },
      { text: "Un avantage car la peau est préparée", correct: false,
        why: "Absolument pas, c'est un facteur de risque majeur." },
    ],
  },
  {
    id: 24,
    question: "Un bronzage récent (sans coup de soleil) est-il une contre-indication absolue ?",
    options: [
      { text: "Oui, on ne traite jamais une peau bronzée", correct: false,
        why: "Trop catégorique. Le bronzage n'est pas une contre-indication absolue." },
      { text: "Non, ça ne change rien aux réglages", correct: false,
        why: "Faux, le médecin doit adapter la fluence sur peau bronzée." },
      { text: "Non, mais il impose d'adapter les paramètres (fluence diminuée)", correct: true,
        why: "Exact. Le bronzage reste un facteur de risque d'hyperpigmentation, les paramètres sont ajustés en conséquence." },
    ],
  },
  {
    id: 25,
    question: "Pourquoi le détatouage est-il déconseillé sur les paupières et les lèvres (maquillage permanent) ?",
    options: [
      { text: "À cause du risque de virage de couleur des pigments (oxyde de fer, dioxyde de titane)", correct: true,
        why: "Exact. Ces pigments peuvent virer au noir ou au gris de façon irréversible sous le laser." },
      { text: "Parce que c'est trop douloureux", correct: false,
        why: "La douleur n'est pas la raison principale." },
      { text: "Parce que l'encre y est trop profonde", correct: false,
        why: "La profondeur n'est pas l'enjeu principal sur ces zones." },
    ],
  },
  {
    id: 26,
    question: "L'assombrissement paradoxal concerne surtout :",
    options: [
      { text: "Les encres claires contenant des oxydes métalliques (rouge, blanc, beige)", correct: true,
        why: "Exact. Ces pigments peuvent noircir sous le laser, c'est réversible avec un ajustement des paramètres." },
      { text: "Les encres noires classiques", correct: false,
        why: "Le noir s'éclaircit normalement, il n'est pas concerné." },
      { text: "Toutes les encres de façon systématique", correct: false,
        why: "C'est un phénomène spécifique à certaines encres, pas systématique." },
    ],
  },
  {
    id: 27,
    question: "La grossesse est-elle une contre-indication au détatouage ?",
    options: [
      { text: "Non, c'est sans danger", correct: false,
        why: "On ne traite pas une femme enceinte, par principe de précaution." },
      { text: "Uniquement au premier trimestre", correct: false,
        why: "La contre-indication couvre toute la grossesse et l'allaitement." },
      { text: "Oui, par principe de précaution", correct: true,
        why: "Exact. Même sans effet documenté sur le fœtus, on s'abstient par précaution, ainsi que pendant l'allaitement." },
    ],
  },
  {
    id: 28,
    question: "Sur un phototype foncé, quel critère clinique le médecin privilégie-t-il ?",
    options: [
      { text: "Un érythème léger ou un léger assombrissement de l'encre", correct: true,
        why: "Exact. On vise un critère d'évaluation moins sévère pour limiter le risque pigmentaire." },
      { text: "Un givrage intense et un blanchiment marqué", correct: false,
        why: "Au contraire, sur peau foncée le givrage marqué peut être excessif et risqué." },
      { text: "Aucun critère, on tire au maximum", correct: false,
        why: "Dangereux. Les fluences excessives provoquent des effets indésirables." },
    ],
  },
  {
    id: 29,
    question: "Que faut-il faire en cas de saignements ponctuels fréquents pendant le tir ?",
    options: [
      { text: "Réduire la fluence jusqu'à ce que les saignements disparaissent", correct: true,
        why: "Exact. Un saignement ponctuel fréquent est un signe d'énergie trop élevée." },
      { text: "Augmenter la fluence pour finir plus vite", correct: false,
        why: "Faux. Le saignement signale plutôt une densité d'énergie excessive." },
      { text: "Arrêter définitivement le traitement", correct: false,
        why: "Inutilement radical. On ajuste les paramètres." },
    ],
  },
  {
    id: 30,
    question: "Les zones du corps les mieux vascularisées (proches du cœur) :",
    options: [
      { text: "Évacuent les pigments plus lentement", correct: false,
        why: "C'est l'inverse : mieux c'est vascularisé, mieux ça draine." },
      { text: "Ne changent rien à la vitesse d'évacuation", correct: false,
        why: "La vascularisation influence directement le drainage." },
      { text: "Évacuent les pigments plus rapidement", correct: true,
        why: "Exact. Une bonne vascularisation aide les macrophages à drainer les fragments. Les extrémités (mains, pieds) sont plus lentes." },
    ],
  }
];


// ===== PHRASES À NE JAMAIS DIRE =====
const FORBIDDEN_PHRASES = [
  {
    bad: "Ça va partir à 100 %",
    why: "Trop affirmatif. Le résultat dépend des couleurs, du type d'encre et de la peau. Promettre crée une déception.",
    good: "Chez Ray studios, on a un laser PicoWay parmi les plus performants et des médecins expérimentés. Le médecin vous donnera un pronostic réaliste en consultation.",
  },
  {
    bad: "Comptez X séances",
    why: "L'estimation revient au médecin via le Ray Tattoo Profile. Avancer un chiffre vous met en porte-à-faux.",
    good: "Nous avons un outil qui aide à estimer le nombre de séances, et le médecin affinera tout ça avec votre Ray Tattoo Profile en consultation.",
  },
  {
    bad: "Ce n'est pas grave",
    why: "Minimise l'inquiétude. Le patient se sent non-écouté et peut se fermer.",
    good: "Je comprends votre inquiétude. Je la transmets au médecin pour qu'il vous rappelle et vous réponde précisément.",
  },
  {
    bad: "C'est totalement indolore",
    why: "Faux. À la première impulsion, le patient perd toute confiance en vous.",
    good: "C'est inconfortable, comme un élastique qui claque, mais notre technologie picoseconde limite la sensation. On utilise du froid en continu et une balle anti-stress est à disposition.",
  },
  {
    bad: "Vous êtes la première à avoir ça",
    why: "Anxiogène. Donne l'impression d'un cas isolé, voire d'une erreur du centre.",
    good: "Ce que vous décrivez, on l'a déjà rencontré, c'est connu. Je le transmets au médecin pour qu'il l'évalue.",
  },
  {
    bad: "Allez aux urgences",
    why: "Excessif sans contexte. Nous avons un parcours interne avec le médecin en première intention.",
    good: "Je préviens le médecin tout de suite pour qu'il vous rappelle. Décrivez-moi ce que vous voyez.",
  },
  {
    bad: "Je ne sais pas",
    why: "Peu rassurant. Donne l'impression d'un manque de professionnalisme.",
    good: "C'est une bonne question. Je vérifie auprès du médecin et je vous rappelle aujourd'hui.",
  },
  {
    bad: "Bon, ce médicament, ça passe",
    why: "Aucune évaluation de compatibilité ne relève du SM. Jamais. Même pour un antibiotique banal, et même si la base ne le signale pas comme contre-indiqué.",
    good: "Je note votre traitement. C'est le médecin qui évaluera la compatibilité en consultation, je ne peux pas vous le garantir à l'avance.",
  },
  {
    bad: "Le médecin va sûrement dire oui",
    why: "Engage le médecin sur une décision qu'il n'a pas prise. Met le patient en attente d'un OK qui peut ne pas venir.",
    good: "C'est au médecin de trancher en fonction de votre dossier. Je transmets votre demande pour qu'il l'étudie.",
  },
  {
    bad: "Les autres centres sont moins bien",
    why: "Dénigrer la concurrence n'est jamais crédible. On valorise Ray studios sur des faits, pas en rabaissant les autres.",
    good: "Chez nous, le médecin réalise lui-même la séance, le laser est un PicoWay et le parcours est encadré du début à la fin. C'est ce qui fait notre différence.",
  },
  {
    bad: "Ne vous inquiétez pas, tout va bien se passer",
    why: "Bien intentionné, mais c'est une promesse qu'on ne peut pas tenir. Mieux vaut rassurer par le sérieux du cadre que par une garantie.",
    good: "Vous êtes entre de bonnes mains : matériel de pointe, médecins compétents et un suivi à chaque étape. Toute inquiétude, on la transmet au médecin.",
  },
];

// ===== GLOSSAIRE =====
const GLOSSARY = [
  {
    term: "Assombrissement paradoxal",
    techDef: "Phénomène où le tatouage devient temporairement plus foncé après une séance, sur certains pigments (encres rouges, blanches, beiges contenant des oxydes métalliques).",
    patientWords: "Ça peut arriver sur certaines encres, c'est connu et réversible. Le médecin adaptera la longueur d'onde aux séances suivantes.",
  },
  {
    term: "Chéloïde",
    techDef: "Cicatrice anormalement épaisse, surélevée et qui déborde de la plaie d'origine. Prédisposition génétique.",
    patientWords: "Une cicatrice particulière qui peut se former chez certaines personnes prédisposées. Le médecin vérifie en consultation initiale.",
  },
  {
    term: "Cryothérapie",
    techDef: "Refroidissement de la peau par souffle d'air à très basse température, pendant et après le passage du laser (Zimmer ou Mecotec).",
    patientWords: "L'air froid qu'on souffle pendant la séance pour anesthésier la peau et limiter l'inconfort.",
  },
  {
    term: "Croûte",
    techDef: "Formation sèche qui apparaît pendant la cicatrisation, après une phase de suintement. Ne doit jamais être grattée ni arrachée.",
    patientWords: "Une petite croûte peut se former, c'est normal. Surtout ne pas la gratter : laissez-la tomber toute seule.",
  },
  {
    term: "Dépigmentation",
    techDef: "Perte de couleur de la peau (terme englobant l'hypopigmentation). Peut être temporaire ou durable selon l'intensité et le phototype.",
    patientWords: "Une zone qui perd sa couleur naturelle. On en parle au médecin pour qu'il évalue et adapte.",
  },
  {
    term: "Dermatoscope",
    techDef: "Loupe grossissante avec éclairage permettant l'examen détaillé de la peau et des pigments.",
    patientWords: "Une sorte de loupe que le médecin utilise pour examiner votre tatouage et votre peau en détail.",
  },
  {
    term: "Détatouage",
    techDef: "Élimination progressive d'un tatouage par fragmentation laser des pigments, ensuite évacués par l'organisme. Nécessite plusieurs séances.",
    patientWords: "Le laser casse l'encre en petits morceaux que votre corps élimine ensuite, séance après séance.",
  },
  {
    term: "Effet photoacoustique",
    techDef: "Mécanisme du laser PicoWay : fragmentation des pigments par onde de choc mécanique plutôt que par chaleur (photothermique).",
    patientWords: "Le laser pulvérise l'encre par vibration plutôt que par brûlure. C'est ce qui rend le PicoWay plus précis et mieux toléré.",
  },
  {
    term: "Érythème",
    techDef: "Rougeur de la peau, réaction inflammatoire normale après une séance laser.",
    patientWords: "La rougeur qui apparaît après la séance. C'est normal et ça passe en quelques jours.",
  },
  {
    term: "Fluence",
    techDef: "Énergie laser délivrée par unité de surface, exprimée en J/cm². Réglée par le médecin selon le phototype et la lésion.",
    patientWords: "L'intensité du laser, que le médecin ajuste à votre peau et à votre tatouage.",
  },
  {
    term: "Givrage",
    techDef: "Blanchiment instantané de la zone pendant le tir, dû à un micro-dégagement de gaz. Repère clinique d'une fluence adaptée. Disparaît en quelques minutes.",
    patientWords: "Le petit blanchiment qu'on voit pendant le tir, c'est bon signe : ça veut dire que le laser agit bien.",
  },
  {
    term: "Hyperpigmentation",
    techDef: "Assombrissement de la peau post-inflammatoire. Plus fréquent sur phototypes III à VI, lié au soleil ou à des fluences excessives.",
    patientWords: "Une zone qui devient plus foncée après cicatrisation. Souvent transitoire (quelques semaines à mois). La protection solaire est essentielle.",
  },
  {
    term: "Hypopigmentation",
    techDef: "Éclaircissement de la peau par perte de mélanine. Peut être irréversible. Plus fréquent sur 532 nm et en cas de refroidissement excessif.",
    patientWords: "Une zone plus claire que la peau normale. Peut prendre 3 à 6 mois à se repigmenter.",
  },
  {
    term: "Longueur d'onde",
    techDef: "Couleur précise du faisceau laser, en nanomètres (nm). Chez Ray studios : 532 nm (rouge, jaune), 730 nm et 1064 nm (noir, foncés). Choisie selon l'encre.",
    patientWords: "Chaque couleur d'encre a besoin d'un type de laser précis. C'est pour ça qu'on en a plusieurs au centre.",
  },
  {
    term: "Macrophage",
    techDef: "Cellule du système immunitaire qui phagocyte les pigments fragmentés par le laser et les évacue via les voies lymphatiques.",
    patientWords: "Les cellules qui « nettoient » votre peau et évacuent les pigments cassés par le laser. C'est pourquoi il faut 6-8 semaines entre deux séances.",
  },
  {
    term: "Mélanine",
    techDef: "Pigment naturel responsable de la couleur de la peau. Plus présente sur les phototypes foncés, elle absorbe aussi le laser, d'où les précautions accrues.",
    patientWords: "Le pigment qui donne sa couleur à la peau. Plus la peau est foncée, plus le médecin règle le laser avec prudence.",
  },
  {
    term: "Œdème",
    techDef: "Gonflement localisé dû à l'accumulation de liquide, réaction inflammatoire fréquente et transitoire après une séance.",
    patientWords: "Un petit gonflement après la séance, c'est normal et ça part en quelques jours.",
  },
  {
    term: "Phlyctène",
    techDef: "Cloque, bulle de liquide sous l'épiderme. Apparition possible dans les 24-48h post-séance.",
    patientWords: "Une cloque. Surtout ne pas la percer. Si elle apparaît, on prévient le médecin.",
  },
  {
    term: "Phototype",
    techDef: "Classification de Fitzpatrick (I à VI) selon la réaction de la peau au soleil. Détermine le réglage du laser.",
    patientWords: "La classification de votre type de peau, qui aide le médecin à régler le laser à la bonne intensité.",
  },
  {
    term: "Picoseconde",
    techDef: "Un milliardième de seconde (10⁻¹² s). Durée des impulsions du PicoWay (300-450 ps).",
    patientWords: "Des impulsions ultra-courtes, ce qui permet de fragmenter l'encre sans abîmer la peau autour.",
  },
  {
    term: "Effet photothermique",
    techDef: "Mécanisme des anciens lasers (nanoseconde) : fragmentation par la chaleur, avec plus de risque pour les tissus environnants. À distinguer du photoacoustique.",
    patientWords: "L'ancienne méthode, qui chauffait plus la peau. Notre PicoWay travaille autrement, par onde de choc.",
  },
  {
    term: "Pigment",
    techDef: "Particule colorée déposée dans le derme lors du tatouage. Sa couleur, sa profondeur et sa composition déterminent la réponse au laser.",
    patientWords: "L'encre déposée sous la peau. C'est elle que le laser vient cibler et fragmenter.",
  },
  {
    term: "Ray Tattoo Profile (RTP)",
    techDef: "Évaluation Ray studios établie par le médecin : caractéristiques du tatouage, phototype, estimation du nombre de séances et du pronostic.",
    patientWords: "Le profil de votre tatouage établi par le médecin lors de la consultation. Il décrit votre parcours estimé.",
  },
  {
    term: "Taille du spot",
    techDef: "Diamètre du faisceau laser, en millimètres. Un grand spot pénètre plus profondément, un petit reste plus superficiel.",
    patientWords: "La largeur du faisceau, que le médecin choisit selon la profondeur de votre encre.",
  },
  {
    term: "Système lymphatique",
    techDef: "Réseau de drainage de l'organisme. Il transporte les fragments de pigment captés par les macrophages vers les ganglions, où ils sont éliminés.",
    patientWords: "Le réseau qui évacue les déchets du corps. C'est par lui que l'encre fragmentée s'en va, ce qui prend du temps.",
  },
];

// ===== COMPRENDRE (vulgarisation médicale) =====
const EDUCATION = [
  {
    id: "how-laser-works",
    title: "Comment fonctionne le laser ?",
    intro: "Pas de coupure, pas de chirurgie. Le laser envoie de la lumière à une longueur d'onde précise, qui traverse la peau jusqu'à l'encre du tatouage. Cette encre éclate en mini-particules. C'est ensuite le corps qui fait le travail.",
    sections: [
      {
        title: "Le principe en 3 étapes",
        items: [
          { label: "1.", strong: "La lumière cible l'encre.", text: "Le laser traverse l'épiderme sans l'abîmer et atteint les pigments déposés dans le derme." },
          { label: "2.", strong: "L'encre éclate.", text: "Les pigments absorbent l'énergie du laser et se fragmentent en minuscules particules." },
          { label: "3.", strong: "Le corps évacue.", text: "Les macrophages (les « éboueurs » du corps) ramassent ces fragments et les évacuent par le système lymphatique." },
        ],
      },
      {
        title: "Pourquoi 6 à 8 semaines entre deux séances ?",
        text: "Le laser ne fait pas tout : il casse les pigments, mais c'est le corps qui les évacue. Ce nettoyage prend du temps. Vouloir aller plus vite serait inutile, et risqué pour la peau.",
      },
      {
        title: "Pourquoi plusieurs longueurs d'onde ?",
        text: "Chaque couleur d'encre absorbe une longueur d'onde précise. Sans la bonne longueur d'onde, le laser passe à côté du pigment. C'est pour ça qu'on dispose de trois longueurs d'onde au centre.",
        wavelengths: [
          { nm: "532", gradient: "linear-gradient(135deg, #DC2626 0%, #F97316 50%, #FACC15 100%)", inks: "Rouge, jaune, orange", phototypes: "I à III" },
          { nm: "730", gradient: "linear-gradient(135deg, #2563EB 0%, #22C55E 100%)", inks: "Vert, bleu", phototypes: "II à IV" },
          { nm: "1064", gradient: "linear-gradient(135deg, #1F2937 0%, #4B5563 100%)", inks: "Noir, marron, vert, bleu, violet", phototypes: "I à VI" },
        ],
      },
      {
        title: "Le givrage : le signe que ça marche",
        text: "Pendant le tir, on observe souvent un blanchiment instantané de la zone, qu'on appelle le « givrage ». C'est un micro-dégagement de gaz provoqué par la fragmentation des pigments. C'est le repère visuel que le médecin recherche : il indique que la fluence est adaptée. Ce givrage disparaît en quelques minutes.",
      },
      {
        title: "Toutes les encres ne partent pas pareil",
        text: "Le noir et le bleu foncé répondent le mieux : ils absorbent un large spectre de longueurs d'onde. Les couleurs vives (rouge, jaune, vert) sont plus capricieuses. Et certaines encres cosmétiques contenant des oxydes métalliques peuvent virer ou s'assombrir, d'où la prudence sur le maquillage permanent.",
      },
    ],
  },
  {
    id: "phototypes",
    title: "Les phototypes",
    intro: "Le phototype, c'est la classification de la peau selon sa réaction au soleil. Il y en a 6, du plus clair au plus foncé. Le médecin le détermine obligatoirement avant traitement. C'est lui qui dicte les réglages du laser.",
    sections: [
      {
        title: "Les 6 phototypes (échelle de Fitzpatrick)",
        phototypes: [
          { roman: "I",   color: "#F4D9C0", desc: "Très claire. Brûle toujours, ne bronze jamais. Souvent rousse ou blonde aux yeux clairs." },
          { roman: "II",  color: "#E8C19F", desc: "Claire. Brûle souvent, bronze peu." },
          { roman: "III", color: "#D2A37A", desc: "Intermédiaire. Brûle parfois, bronze progressivement." },
          { roman: "IV",  color: "#A87752", desc: "Mate. Brûle rarement, bronze facilement." },
          { roman: "V",   color: "#704A2D", desc: "Foncée. Brûle très rarement, bronze fortement." },
          { roman: "VI",  color: "#3D2615", desc: "Très foncée à noire. Ne brûle pas." },
        ],
      },
      {
        title: "Pourquoi c'est crucial pour le laser",
        text: "Plus la peau est foncée, plus elle contient de mélanine, un pigment naturel. Or la mélanine absorbe aussi la lumière du laser. Sans précaution, le laser ciblerait la peau au lieu de l'encre.",
        risks: [
          "Hypopigmentation : la peau devient plus claire que le reste",
          "Hyperpigmentation : la peau devient plus foncée",
          "Risque accru de cicatrices",
        ],
      },
      {
        title: "Adaptation aux phototypes foncés",
        text: "Sur les phototypes IV à VI, le médecin baisse la fluence (l'intensité du laser) et privilégie le 1064 nm, qui traverse mieux la peau sans accrocher la mélanine épidermique. Il commence toujours par un test, observe la réaction, puis ajuste séance après séance.",
      },
    ],
  },
  {
    id: "picoseconde",
    title: "La techno picoseconde",
    intro: "Une picoseconde, c'est un milliardième de seconde (10⁻¹² s). Le PicoWay envoie des impulsions extrêmement courtes, entre 250 et 450 picosecondes. Cette ultra-rapidité change tout par rapport aux anciens lasers.",
    sections: [
      {
        title: "Photothermique vs photoacoustique : la grande différence",
        comparison: [
          {
            label: "Anciens lasers (nanoseconde)",
            type: "Effet photothermique",
            analogy: "Comme verser de l'eau chaude sur de la glace : ça finit par fondre, mais ça chauffe aussi tout autour.",
            points: ["Beaucoup de chaleur résiduelle", "Plus de risque de cicatrices", "Inconfort plus marqué", "Fragmentation moins fine"],
            isOld: true,
          },
          {
            label: "PicoWay (picoseconde)",
            type: "Effet photoacoustique",
            analogy: "Comme un marteau qui brise du verre en mille morceaux : c'est mécanique, instantané, et la chaleur n'a pas le temps de se diffuser.",
            points: ["Beaucoup moins de chaleur", "Moins de risque de cicatrices", "Mieux toléré", "Fragmentation plus fine de l'encre"],
            isOld: false,
          },
        ],
      },
      {
        title: "Concrètement, qu'est-ce que ça change ?",
        bullets: [
          "Les pigments sont fragmentés en particules plus petites, donc plus faciles à évacuer pour le corps.",
          "Moins de chaleur résiduelle dans la peau = moins de douleur pendant la séance.",
          "Moins de risque d'hypopigmentation ou d'hyperpigmentation, surtout sur peaux mates et foncées.",
          "Le PicoWay produit 4,5× plus d'effet photoacoustique que d'autres lasers picosecondes. C'est ce qui fait sa précision.",
        ],
      },
      {
        title: "Le mot juste pour le patient",
        text: "Inutile de parler de « photoacoustique » à un patient. Une formule comme : « notre laser pulvérise l'encre par onde de choc plutôt que par chaleur, c'est plus précis et mieux toléré » suffit largement.",
      },
    ],
  },
  {
    id: "ink-journey",
    title: "Le parcours de l'encre",
    intro: "Une question revient souvent : « où va l'encre une fois qu'elle est cassée ? » Comprendre ce trajet aide à expliquer pourquoi le détatouage prend du temps et pourquoi le mode de vie du patient compte.",
    sections: [
      {
        title: "Avant le laser",
        text: "Quand on se fait tatouer, l'aiguille dépose l'encre dans le derme, la couche profonde de la peau. Le corps reconnaît ces pigments comme des corps étrangers et envoie des macrophages pour les « manger ». Mais les particules d'encre sont trop grosses pour être évacuées : les macrophages restent coincés avec, et c'est ce qui rend le tatouage permanent et stable dans le temps.",
      },
      {
        title: "Ce que change le laser",
        items: [
          { label: "1.", strong: "Fragmentation.", text: "Le laser brise les grosses particules d'encre en fragments minuscules, assez petits pour être transportés." },
          { label: "2.", strong: "Capture.", text: "De nouveaux macrophages viennent engloutir ces petits fragments." },
          { label: "3.", strong: "Évacuation.", text: "Ils rejoignent le système lymphatique, qui draine les déchets vers les ganglions, puis le corps les élimine progressivement." },
        ],
      },
      {
        title: "Pourquoi le mode de vie compte",
        text: "Comme l'évacuation passe par le système lymphatique et la circulation, tout ce qui soutient une bonne circulation aide : hydratation, activité physique régulière (en dehors des 48h post-séance), éviter le tabac qui ralentit la microcirculation. Ce n'est pas magique, mais ça participe au résultat global.",
      },
      {
        title: "La bonne image pour le patient",
        text: "Une métaphore simple : « le laser casse l'encre en miettes assez petites pour que votre corps puisse les jeter à la poubelle tout seul. Et ça, ça prend plusieurs semaines après chaque séance. » C'est imagé, juste, et ça fait comprendre le délai.",
      },
    ],
  },
  {
    id: "myths",
    title: "Les idées reçues",
    intro: "Les patients arrivent souvent avec des croyances fausses sur le détatouage. Savoir les démonter calmement, avec les bons mots, rassure et installe la confiance. Voici les plus fréquentes.",
    sections: [
      {
        title: "Ce qu'on entend, et ce qui est vrai",
        myths: [
          {
            myth: "« Le laser, ça donne le cancer. »",
            truth: "Faux. Le laser de détatouage n'émet pas de rayonnement ionisant (comme les rayons X). Il fragmente l'encre par la lumière et n'altère pas l'ADN des cellules.",
          },
          {
            myth: "« L'encre dissoute part dans le sang et c'est toxique. »",
            truth: "À nuancer. L'encre n'est pas 'dissoute' : elle est fragmentée puis évacuée par le système lymphatique, comme le corps gère d'autres déchets. C'est un processus naturel.",
          },
          {
            myth: "« On peut tout enlever en une ou deux séances. »",
            truth: "Faux. Il faut presque toujours plusieurs séances espacées de 6 à 8 semaines. Le corps a besoin de ce temps pour évacuer les pigments entre deux passages.",
          },
          {
            myth: "« Si ça fait très mal, c'est que c'est plus efficace. »",
            truth: "Faux. La douleur n'est pas un indicateur d'efficacité. Le bon repère clinique, c'est la réaction de la peau, que seul le médecin évalue.",
          },
          {
            myth: "« Les crèmes de détatouage vendues en ligne marchent aussi bien. »",
            truth: "Faux et risqué. Ces crèmes n'atteignent pas l'encre dans le derme et peuvent abîmer la peau (brûlures chimiques, cicatrices). Seul le laser agit en profondeur.",
          },
          {
            myth: "« Une fois détatoué, je pourrai me faire retatouer au même endroit. »",
            truth: "Souvent oui, mais c'est au médecin et au futur tatoueur d'évaluer l'état de la peau une fois la cicatrisation complète et le résultat stabilisé.",
          },
        ],
      },
      {
        title: "La bonne attitude face à une croyance fausse",
        text: "Ne jamais moquer ni balayer la croyance d'un patient. On reconnaît la question, on corrige avec une info simple et juste, et on renvoie au médecin pour tout ce qui touche à sa situation personnelle. Un patient qui se sent écouté accepte beaucoup mieux d'être détrompé.",
      },
    ],
  },
  {
    id: "pillars",
    title: "Les 4 paramètres",
    intro: "Pour chaque séance, le médecin règle 4 paramètres qui définissent l'effet du laser sur la peau et le tatouage. Ces réglages sont ajustés à chaque patient : votre phototype, votre tatouage, votre tolérance.",
    sections: [
      {
        title: "Les 4 réglages du laser",
        pillars: [
          {
            name: "Fluence",
            unit: "J/cm²",
            what: "L'intensité du laser sur la peau",
            explain: "C'est la dose délivrée par unité de surface. Plus elle est élevée, plus l'impact sur l'encre est fort, mais plus le risque pour la peau augmente. Le médecin l'ajuste au phototype et au type de tatouage.",
          },
          {
            name: "Taille du spot",
            unit: "mm",
            what: "Le diamètre du faisceau",
            explain: "Un grand spot pénètre plus profondément et reste mieux concentré. Un petit spot est plus diffus et plus superficiel. Le choix dépend surtout de la profondeur à laquelle l'encre a été déposée.",
          },
          {
            name: "Énergie",
            unit: "mJ",
            what: "L'énergie de chaque impulsion",
            explain: "C'est ce que délivre chaque tir laser. Combinée à la taille du spot, elle détermine la fluence. C'est la valeur qui s'affiche directement sur l'écran de la machine.",
          },
          {
            name: "Fréquence",
            unit: "Hz",
            what: "Le nombre d'impulsions par seconde",
            explain: "Combien de fois par seconde le laser tire. Une fréquence élevée accélère le traitement mais peut augmenter l'inconfort. Le médecin l'ajuste selon la zone, la taille du tatouage et la tolérance du patient.",
          },
        ],
      },
      {
        title: "Comment tout ça s'articule",
        text: "Ces 4 paramètres ne se règlent pas isolément. Augmenter la fluence ou réduire la taille du spot rend chaque tir plus intense. La longueur d'onde choisie (532, 730 ou 1064 nm selon la couleur d'encre) vient encore moduler tout ça. C'est cette combinaison fine qui rend chaque séance personnalisée.",
      },
    ],
  },
];

// ===== CAS PARTICULIERS (zones visage/cosmétique et zones interdites) =====
const SPECIAL_CASES = [
  {
    id: 70, theme: "special",
    question: "Sourcils complets",
    short: "Tarif forfaitaire 159 € par séance. Protocole spécifique : Cicaplast SPF 50 dès le début, pas de pansement.",
    detail: "Les pigments cosmétiques (souvent dioxyde de titane) demandent une attention particulière. Le médecin évalue le risque de virage de couleur en consultation initiale.",
    keywords: ["sourcils", "cosmétique", "maquillage"],
  },
  {
    id: 71, theme: "special",
    question: "Taches de rousseur",
    short: "Tarif forfaitaire 159 € par séance. Consultation initiale obligatoire pour évaluer le phototype.",
    detail: "Le médecin évaluera la pertinence du traitement selon votre type de peau.",
    keywords: ["taches", "rousseur", "visage"],
  },
  {
    id: 72, theme: "special",
    question: "Pointe des sourcils (retouche)",
    short: "Tarif spécifique 99 €. La consultation initiale reste obligatoire.",
    detail: "Pour les petites zones de retouche uniquement.",
    keywords: ["pointe", "sourcils", "retouche"],
  },
  {
    id: 73, theme: "special",
    question: "Paupières (maquillage permanent)",
    short: "Non, nous ne le proposons pas. Nécessite des coques intra-oculaires que nous n'avons pas, et risque élevé de virage de couleur.",
    detail: "Position Ray studios : abstention thérapeutique sur les paupières. À expliquer clairement au patient sans le rediriger ailleurs (on ne peut pas garantir la qualité d'autres centres).",
    keywords: ["paupières", "yeux", "maquillage"],
    forbidden: true,
  },
  {
    id: 74, theme: "special",
    question: "Lèvres (maquillage permanent)",
    short: "Non. Risque de virage de couleur définitif (pigments clairs qui virent au noir ou gris).",
    detail: "Les pigments à base d'oxyde de fer réagissent mal au laser. Le changement de couleur est irréversible. Abstention thérapeutique.",
    keywords: ["lèvres", "bouche", "maquillage permanent"],
    forbidden: true,
  },
  {
    id: 75, theme: "special",
    question: "Gencives",
    short: "Non. Risques de brûlures gingivales, nécroses, récession gingivale, mauvaise cicatrisation.",
    detail: "Pas de détatouage des gencives chez Ray studios.",
    keywords: ["gencives", "bouche", "dents"],
    forbidden: true,
  },
  {
    id: 76, theme: "special",
    question: "Verge, testicules, anus",
    short: "Non. Zones très sensibles, risques de lésions nerveuses, cicatrices, troubles fonctionnels. Données scientifiques insuffisantes.",
    detail: "Position de prudence Ray studios. Ces zones ne sont jamais traitées, quelle que soit l'insistance du patient.",
    keywords: ["verge", "testicules", "anus", "génitales", "intimes"],
    forbidden: true,
  },
  {
    id: 77, theme: "special",
    question: "Sourcils déjà traités ailleurs (résidu vert)",
    short: "À transmettre au médecin. Si la couleur résiduelle est verte, il est généralement préférable de ne pas traiter (dioxyde de titane qui peut virer).",
    detail: "Le médecin évaluera au cas par cas selon l'historique du patient.",
    keywords: ["sourcils", "vert", "résidu", "ailleurs"],
    needsDoctor: true,
  },
  {
    id: 78, theme: "special",
    question: "Tatouage par poudre d'arme à feu",
    short: "Contre-indication formelle. Risque de micro-explosions et cicatrices.",
    detail: "À transmettre au médecin si la question se pose. Ce type de tatouage accidentel ne se traite pas au laser.",
    keywords: ["poudre", "arme", "feu", "accidentel"],
    needsDoctor: true,
    forbidden: true,
  },
  {
    id: 79, theme: "special",
    question: "Taches pigmentaires (mélasma, lentigines)",
    short: "Non. Ray studios se consacre exclusivement au détatouage, pas aux taches pigmentaires.",
    detail: "Choix de spécialisation pour garantir la qualité des soins. À rediriger vers un dermatologue ou un centre dédié.",
    keywords: ["mélasma", "lentigines", "taches", "pigmentaires"],
    forbidden: true,
  },
];

// Liste complète utilisée par Recherche et Thèmes
const ALL_QA = [...QA, ...SPECIAL_CASES];

// ============================================================
// COMPOSANTS
// ============================================================

const LOGO_ROUND = "data:image/png;base64,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";
const LOGO_WORDMARK = "data:image/png;base64,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";

function RayMark({ size = 36 }) {
  return (
    <img
      src={LOGO_ROUND}
      alt="Ray studios"
      width={size}
      height={size}
      className="rounded-full"
      style={{ display: "block" }}
    />
  );
}

function RayWordmark({ height = 22 }) {
  return (
    <img
      src={LOGO_WORDMARK}
      alt="Ray studios"
      height={height}
      style={{ height: `${height}px`, width: "auto", display: "block" }}
    />
  );
}

function FadeDots({ className = "" }) {
  const opacities = [1, 0.85, 0.65, 0.45, 0.3, 0.18, 0.08, 0.03];
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {opacities.map((o, i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ opacity: o, backgroundColor: "#1A1A1A" }}
        />
      ))}
    </div>
  );
}

function ThemeBadge({ themeId }) {
  const theme = THEMES.find((t) => t.id === themeId);
  if (!theme) return null;
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-medium text-stone-500">
      <span className="w-1 h-1 rounded-full" style={{ backgroundColor: RAY_ORANGE }} />
      {theme.label}
    </span>
  );
}

function DoctorBadge() {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-medium px-2 py-1 rounded-md"
      style={{ backgroundColor: RAY_ORANGE_SOFT, color: "#8B4513" }}
    >
      <Stethoscope className="w-3 h-3" />
      Pour le médecin
    </span>
  );
}

function UrgentBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-medium px-2 py-1 rounded-md bg-red-50 text-red-700">
      <AlertTriangle className="w-3 h-3" />
      Urgent
    </span>
  );
}

function ForbiddenBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-medium px-2 py-1 rounded-md bg-red-50 text-red-700">
      <Ban className="w-3 h-3" />
      On ne le fait pas
    </span>
  );
}

function PricingGrid() {
  const tiers = [
    ["XXS", "< 1 cm²", "59 €"],
    ["XS", "< 5 cm²", "99 €"],
    ["S", "5–15 cm²", "149 €"],
    ["M", "16–50 cm²", "199 €"],
    ["L", "51–100 cm²", "249 €"],
    ["XL", "101–250 cm²", "299 €"],
    ["XXL", "251–500 cm²", "399 €"],
    ["3XL", "501–800 cm²", "549 €"],
    ["4XL", "801–1150 cm²", "699 €"],
    ["5XL", "1151–1550 cm²", "849 €"],
    ["6XL", "1551–2000 cm²", "999 €"],
    ["7XL", "2001–2500 cm²", "1 149 €"],
    ["8XL", "2501–3000 cm²", "1 299 €"],
    ["Custom", "> 3000 cm²", "Sur devis"],
  ];
  return (
    <div className="mt-3 border border-stone-200 rounded-lg overflow-hidden">
      <div className="grid grid-cols-3 text-[10px] uppercase tracking-widest font-medium text-stone-500 bg-stone-50 px-3 py-2">
        <span>Taille</span>
        <span>Surface</span>
        <span className="text-right">Par séance</span>
      </div>
      {tiers.map(([size, range, price], i) => (
        <div
          key={size}
          className={`grid grid-cols-3 text-sm px-3 py-2 ${
            i % 2 === 0 ? "bg-white" : "bg-stone-50/50"
          }`}
        >
          <span className="font-mono font-medium text-stone-900">{size}</span>
          <span className="text-stone-600">{range}</span>
          <span className="text-right font-medium" style={{ color: RAY_ORANGE }}>{price}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// MODE : THÈMES (avec recherche intégrée)
// ============================================================

function ThemesMode() {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [flippedId, setFlippedId] = useState(null);
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return ALL_QA.filter((item) => {
      const haystack = [
        item.question,
        item.short,
        item.detail,
        ...(item.keywords || []),
      ].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  // Barre de recherche réutilisable
  const searchBar = (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (e.target.value) setSelectedTheme(null);
        }}
        placeholder="Rechercher : cloque, soleil, prix, vaseline…"
        className="w-full pl-12 pr-12 py-4 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 text-base"
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-stone-100 rounded-lg"
          aria-label="Effacer"
        >
          <X className="w-4 h-4 text-stone-500" />
        </button>
      )}
    </div>
  );

  // === Affichage des résultats de recherche ===
  if (searchResults) {
    return (
      <div className="max-w-3xl mx-auto px-6 pb-24">
        <div className="mt-4">{searchBar}</div>
        <div className="text-xs text-stone-500 mt-2 pl-1">
          {searchResults.length} {searchResults.length > 1 ? "réponses" : "réponse"}
        </div>

        <div className="mt-4 space-y-2">
          {searchResults.length === 0 && (
            <div className="text-center py-16 text-stone-500">
              <p className="text-sm">Aucune réponse pour « {query} ».</p>
              <p className="text-xs mt-2">Essayez un mot plus court ou un synonyme.</p>
            </div>
          )}
          {searchResults.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="w-full text-left px-5 py-4 hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <ThemeBadge themeId={item.theme} />
                        {item.needsDoctor && <DoctorBadge />}
                        {item.urgent && <UrgentBadge />}
                        {item.forbidden && <ForbiddenBadge />}
                      </div>
                      <div className="font-medium text-stone-900 mt-1.5">
                        {item.question}
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 text-stone-400 mt-1 flex-shrink-0 transition-transform ${
                        isOpen ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 border-t border-stone-100">
                    <div className="pt-4">
                      <div className="text-stone-800 leading-relaxed">
                        {item.short}
                      </div>
                    </div>
                    <div className="mt-5 pt-5 border-t border-dashed border-stone-200">
                      <div className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-2">
                        Pour aller plus loin
                      </div>
                      <div className="text-sm text-stone-600 leading-relaxed">
                        {item.detail}
                      </div>
                    </div>
                    {item.hasGrid && <PricingGrid />}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // === Grille des thèmes (pas de recherche active) ===
  if (!selectedTheme) {
    return (
      <div className="max-w-4xl mx-auto px-6 pb-24">
        <div className="mt-4 mb-4">{searchBar}</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {THEMES.map((theme) => {
            const count = ALL_QA.filter((q) => q.theme === theme.id).length;
            return (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className="group text-left bg-white border border-stone-200 rounded-xl p-5 hover:border-stone-400 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-stone-900 text-lg">
                      {theme.label}
                    </div>
                    <div className="text-sm text-stone-500 mt-0.5">
                      {theme.hint}
                    </div>
                  </div>
                  <div className="text-xs text-stone-400 font-mono">
                    {String(count).padStart(2, "0")}
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm" style={{ color: RAY_ORANGE }}>
                  <span>Ouvrir</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // === Flashcards d'un thème sélectionné ===
  const theme = THEMES.find((t) => t.id === selectedTheme);
  const cards = ALL_QA.filter((q) => q.theme === selectedTheme);

  return (
    <div className="max-w-4xl mx-auto px-6 pb-24">
      <div className="flex items-center justify-between mt-4 mb-4">
        <button
          onClick={() => {
            setSelectedTheme(null);
            setFlippedId(null);
          }}
          className="text-sm text-stone-600 hover:text-stone-900 flex items-center gap-1.5"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Tous les thèmes
        </button>
        <div className="text-xs text-stone-500 font-mono">
          {cards.length} carte{cards.length > 1 ? "s" : ""}
        </div>
      </div>
      <h2 className="text-2xl font-semibold text-stone-900 mb-1">{theme.label}</h2>
      <p className="text-sm text-stone-500 mb-6">
        Touchez une carte pour révéler la réponse.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {cards.map((card) => {
          const isFlipped = flippedId === card.id;
          return (
            <button
              key={card.id}
              onClick={() => setFlippedId(isFlipped ? null : card.id)}
              className={`text-left rounded-xl border p-5 min-h-[180px] transition-all ${
                isFlipped
                  ? "bg-stone-900 text-stone-50 border-stone-900"
                  : "bg-white text-stone-900 border-stone-200 hover:border-stone-400"
              }`}
            >
              {!isFlipped ? (
                <div className="h-full flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap min-h-[20px]">
                    {card.needsDoctor && <DoctorBadge />}
                    {card.urgent && <UrgentBadge />}
                    {card.forbidden && <ForbiddenBadge />}
                  </div>
                  <div className="font-medium text-lg mt-2 flex-1">
                    {card.question}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mt-4">
                    <RotateCcw className="w-3.5 h-3.5" />
                    Voir la réponse
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="leading-relaxed flex-1">
                    {card.short}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-400 mt-4">
                    <RotateCcw className="w-3.5 h-3.5" />
                    Retourner
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// MODE : ENTRAÎNEMENT
// ============================================================

function TrainingMode() {
  const [quizType, setQuizType] = useState(null); // null = écran de choix
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const deck = quizType === "medical" ? MEDICAL_QUIZ : SCENARIOS;
  const current = deck[index];

  function chooseOption(i) {
    if (chosen !== null) return;
    setChosen(i);
    if (current.options[i].correct) {
      setScore((s) => s + 1);
    }
  }

  function next() {
    if (index < deck.length - 1) {
      setIndex(index + 1);
      setChosen(null);
    } else {
      setDone(true);
    }
  }

  function restart() {
    setIndex(0);
    setChosen(null);
    setScore(0);
    setDone(false);
  }

  function backToChoice() {
    setQuizType(null);
    restart();
  }

  // === Écran de choix du type de quiz ===
  if (quizType === null) {
    return (
      <div className="max-w-2xl mx-auto px-6 pb-24">
        <div className="mt-4 mb-6">
          <h2 className="text-2xl font-semibold text-stone-900 mb-1">Quiz</h2>
          <p className="text-sm text-stone-500">Choisissez le type d'entraînement.</p>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => setQuizType("scenario")}
            className="group w-full text-left bg-white border border-stone-200 rounded-xl p-5 hover:border-stone-400 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium text-stone-900 text-lg">Situations terrain</div>
                <div className="text-sm text-stone-500 mt-0.5">Que répondre face à un patient ? {SCENARIOS.length} mises en situation.</div>
              </div>
              <ArrowRight className="w-5 h-5 mt-1 transition-transform group-hover:translate-x-1" style={{ color: RAY_ORANGE }} />
            </div>
          </button>
          <button
            onClick={() => setQuizType("medical")}
            className="group w-full text-left bg-white border border-stone-200 rounded-xl p-5 hover:border-stone-400 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium text-stone-900 text-lg">Connaissances médicales</div>
                <div className="text-sm text-stone-500 mt-0.5">Le laser, les phototypes, les soins. {MEDICAL_QUIZ.length} questions de connaissances.</div>
              </div>
              <ArrowRight className="w-5 h-5 mt-1 transition-transform group-hover:translate-x-1" style={{ color: RAY_ORANGE }} />
            </div>
          </button>
        </div>
      </div>
    );
  }

  // === Écran de résultat ===
  if (done) {
    const pct = Math.round((score / deck.length) * 100);
    return (
      <div className="max-w-2xl mx-auto px-6 pb-24 mt-12 text-center">
        <FadeDots className="justify-center mb-8" />
        <div className="text-6xl font-bold text-stone-900 mb-2">
          {score}<span className="text-stone-300">/{deck.length}</span>
        </div>
        <div className="text-stone-500 text-sm uppercase tracking-widest mb-8">
          {pct} % de bonnes réponses
        </div>
        <p className="text-stone-700 mb-10 max-w-md mx-auto">
          {pct === 100 && "Sans-faute. Vous maîtrisez le sujet."}
          {pct >= 70 && pct < 100 && "Très bien. Repassez les questions où vous avez hésité."}
          {pct < 70 && "À retravailler. Un tour dans Comprendre et Thèmes aide à consolider."}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={restart}
            className="inline-flex items-center gap-2 text-white px-5 py-3 rounded-lg transition-colors"
            style={{ backgroundColor: "#1A1A1A" }}
          >
            <RotateCcw className="w-4 h-4" />
            Recommencer
          </button>
          <button
            onClick={backToChoice}
            className="inline-flex items-center gap-2 text-stone-600 px-5 py-3 rounded-lg hover:bg-stone-100 transition-colors"
          >
            Changer de quiz
          </button>
        </div>
      </div>
    );
  }

  const isScenario = quizType === "scenario";
  const promptLabel = isScenario ? "Situation" : "Question";

  return (
    <div className="max-w-2xl mx-auto px-6 pb-24">
      <div className="mt-4 mb-6">
        <button
          onClick={backToChoice}
          className="text-sm text-stone-600 hover:text-stone-900 flex items-center gap-1.5 mb-4"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          {isScenario ? "Situations terrain" : "Connaissances médicales"}
        </button>
        <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
          <span className="font-mono">
            {String(index + 1).padStart(2, "0")} / {String(deck.length).padStart(2, "0")}
          </span>
          <span>Score : {score}</span>
        </div>
        <div className="h-0.5 bg-stone-200 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${((index + (chosen !== null ? 1 : 0)) / deck.length) * 100}%`,
              backgroundColor: RAY_ORANGE,
            }}
          />
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-6 mb-4">
        <div className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-3">
          {promptLabel}
        </div>
        <p className="text-lg text-stone-900 leading-relaxed">
          {isScenario ? current.situation : current.question}
        </p>
      </div>

      <div className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-3 px-1">
        {isScenario ? "Que répondez-vous ?" : "Quelle est la bonne réponse ?"}
      </div>

      <div className="space-y-2">
        {current.options.map((opt, i) => {
          const isChosen = chosen === i;
          const showResult = chosen !== null;
          const isCorrect = opt.correct;

          let stateClass = "bg-white border-stone-200 hover:border-stone-400";
          if (showResult && isCorrect) {
            stateClass = "bg-emerald-50 border-emerald-300";
          } else if (showResult && isChosen && !isCorrect) {
            stateClass = "bg-red-50 border-red-300";
          } else if (showResult && !isChosen) {
            stateClass = "bg-white border-stone-200 opacity-60";
          }

          return (
            <button
              key={i}
              onClick={() => chooseOption(i)}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-xl border transition-all ${stateClass} ${
                !showResult ? "cursor-pointer" : "cursor-default"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                    showResult && isCorrect
                      ? "border-emerald-600 bg-emerald-600"
                      : showResult && isChosen && !isCorrect
                      ? "border-red-600 bg-red-600"
                      : "border-stone-300"
                  }`}
                >
                  {showResult && isCorrect && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                  {showResult && isChosen && !isCorrect && <X className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>
                <div className="flex-1">
                  <div className="text-stone-900">{opt.text}</div>
                  {showResult && (
                    <div className={`text-sm mt-2 ${isCorrect ? "text-emerald-700" : "text-stone-600"}`}>
                      {opt.why}
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {chosen !== null && (
        <button
          onClick={next}
          className="mt-6 w-full text-white py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          style={{ backgroundColor: "#1A1A1A" }}
        >
          {index < deck.length - 1 ? "Question suivante" : "Voir le résultat"}
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// ============================================================
// MODE : CALCUL DE TATOUAGE
// ============================================================

function CalcMode() {
  const [longueur, setLongueur] = useState("");
  const [largeur, setLargeur] = useState("");
  const [isCirconf, setIsCirconf] = useState(false);
  const [copied, setCopied] = useState(false);

  const grilleStandard = [
    { max: 1,    label: "XXS", price: 59 },
    { max: 5,    label: "XS",  price: 99 },
    { max: 15,   label: "S",   price: 149 },
    { max: 50,   label: "M",   price: 199 },
    { max: 100,  label: "L",   price: 249 },
    { max: 250,  label: "XL",  price: 299 },
    { max: 500,  label: "XXL", price: 399 },
    { max: 800,  label: "3XL", price: 549 },
    { max: 1150, label: "4XL", price: 699 },
    { max: 1550, label: "5XL", price: 849 },
    { max: 2000, label: "6XL", price: 999 },
    { max: 2500, label: "7XL", price: 1149 },
    { max: 3000, label: "8XL", price: 1299 },
  ];

  const grilleCirconf = [
    { max: 16,   label: "Circ. S",   price: 149 },
    { max: 50,   label: "Circ. M",   price: 199 },
    { max: 100,  label: "Circ. L",   price: 249 },
    { max: 250,  label: "Circ. XL",  price: 299 },
    { max: 500,  label: "Circ. 2XL", price: 399 },
    { max: 800,  label: "Circ. 3XL", price: 549 },
    { max: 1150, label: "Circ. 4XL", price: 699 },
  ];

  const surface = useMemo(() => {
    const L = parseFloat(longueur);
    const l = parseFloat(largeur);
    if (isNaN(L) || isNaN(l) || L <= 0 || l <= 0) return null;
    return L * l;
  }, [longueur, largeur]);

  const result = useMemo(() => {
    if (!surface) return null;
    const grille = isCirconf ? grilleCirconf : grilleStandard;
    const tier = grille.find((t) => surface <= t.max);
    return tier || { label: "Custom", price: "Sur devis", isCustom: true };
  }, [surface, isCirconf]);

  const phrase = result && surface
    ? `Pour un tatouage de ${longueur} × ${largeur} cm = ${surface.toFixed(1)} cm², c'est la taille ${result.label}, soit ${typeof result.price === "number" ? result.price + " €" : result.price} par séance. Le nombre de séances sera estimé par le médecin lors de la consultation initiale.`
    : "";

  function copyPhrase() {
    navigator.clipboard.writeText(phrase).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="max-w-2xl mx-auto px-6 pb-24">
      <div className="mt-4 mb-5">
        <h2 className="text-2xl font-semibold text-stone-900 mb-1">Calculatrice tatouage</h2>
        <p className="text-sm text-stone-500">Entrez les dimensions, la taille et le prix s'affichent automatiquement.</p>
      </div>

      <div className="mb-5 border-l-2 rounded-r p-4 bg-white border border-stone-200" style={{ borderLeftColor: RAY_ORANGE, borderLeftWidth: "3px" }}>
        <div className="text-[10px] uppercase tracking-widest font-medium mb-1.5" style={{ color: "#8B4513" }}>
          À utiliser uniquement pour les demandes téléphoniques
        </div>
        <p className="text-sm text-stone-700 leading-relaxed">
          C'est le médecin qui détermine la taille du tatouage et le prix adéquat lors de la consultation initiale. Cet outil sert uniquement quand un patient demande une estimation par téléphone.
        </p>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => setIsCirconf(false)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              !isCirconf ? "text-white" : "bg-stone-100 text-stone-600"
            }`}
            style={!isCirconf ? { backgroundColor: "#1A1A1A" } : {}}
          >
            Tatouage standard
          </button>
          <button
            onClick={() => setIsCirconf(true)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              isCirconf ? "text-white" : "bg-stone-100 text-stone-600"
            }`}
            style={isCirconf ? { backgroundColor: "#1A1A1A" } : {}}
          >
            Circonférentiel
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-[10px] uppercase tracking-widest text-stone-500 font-medium">Longueur (cm)</span>
            <input
              type="number"
              value={longueur}
              onChange={(e) => setLongueur(e.target.value)}
              placeholder="0"
              min="0"
              step="0.1"
              className="w-full mt-1.5 px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 text-lg focus:outline-none focus:border-stone-400"
            />
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-widest text-stone-500 font-medium">Largeur (cm)</span>
            <input
              type="number"
              value={largeur}
              onChange={(e) => setLargeur(e.target.value)}
              placeholder="0"
              min="0"
              step="0.1"
              className="w-full mt-1.5 px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 text-lg focus:outline-none focus:border-stone-400"
            />
          </label>
        </div>
      </div>

      {result && (
        <div className="mt-3 bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-3 divide-x divide-stone-200">
            <div className="p-5">
              <div className="text-[10px] uppercase tracking-widest text-stone-500 font-medium">Surface</div>
              <div className="text-2xl font-semibold text-stone-900 mt-1">
                {surface.toFixed(1)} <span className="text-sm text-stone-500 font-normal">cm²</span>
              </div>
            </div>
            <div className="p-5">
              <div className="text-[10px] uppercase tracking-widest text-stone-500 font-medium">Taille</div>
              <div className="text-2xl font-semibold text-stone-900 mt-1 font-mono">
                {result.label}
              </div>
            </div>
            <div className="p-5" style={{ backgroundColor: RAY_ORANGE_SOFT }}>
              <div className="text-[10px] uppercase tracking-widest font-medium" style={{ color: "#8B4513" }}>Par séance</div>
              <div className="text-2xl font-semibold mt-1" style={{ color: "#8B4513" }}>
                {typeof result.price === "number" ? `${result.price} €` : result.price}
              </div>
            </div>
          </div>

          <div className="border-t border-stone-200 p-5">
            <div className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-2">
              Synthèse
            </div>
            <p className="text-stone-800 leading-relaxed">{phrase}</p>
            <button
              onClick={copyPhrase}
              className="mt-4 inline-flex items-center gap-2 text-sm text-white px-4 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: "#1A1A1A" }}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copié" : "Copier"}
            </button>
          </div>
        </div>
      )}

      {!result && longueur && largeur && (
        <div className="mt-3 text-center py-8 text-stone-500 text-sm">
          Entrez des valeurs positives pour voir le résultat.
        </div>
      )}

      <div className="mt-6 text-xs text-stone-500 px-1 leading-relaxed">
        <strong className="text-stone-700">Note :</strong> Si la mesure est juste au-dessus d'une tranche, c'est au médecin de décider de la taille. Le coefficient de remplissage reste subjectif. Expliquez votre méthode au patient si demandé.
      </div>
    </div>
  );
}

// ============================================================
// MODE : COMPRENDRE (vulgarisation médicale)
// ============================================================

function LearnMode() {
  const [topic, setTopic] = useState("how-laser-works");
  const current = EDUCATION.find((e) => e.id === topic);

  return (
    <div className="max-w-3xl mx-auto px-6 pb-24">
      {/* Sélecteur de sujet */}
      <div className="mt-4 mb-4">
        <div className="flex gap-2 overflow-x-auto -mx-1 px-1">
          {EDUCATION.map((e) => {
            const isActive = topic === e.id;
            return (
              <button
                key={e.id}
                onClick={() => setTopic(e.id)}
                className={`flex-shrink-0 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive ? "text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
                style={isActive ? { backgroundColor: "#1A1A1A" } : {}}
              >
                {e.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* En-tête du sujet */}
      <div className="mt-6 mb-8">
        <h2 className="text-2xl font-semibold text-stone-900 mb-3">{current.title}</h2>
        <p className="text-stone-700 leading-relaxed">{current.intro}</p>
      </div>

      {/* Sections du sujet */}
      <div className="space-y-8">
        {current.sections.map((sec, i) => (
          <section key={i}>
            <h3 className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-3">
              {sec.title}
            </h3>

            {/* Liste à étapes numérotées */}
            {sec.items && (
              <div className="space-y-3">
                {sec.items.map((it, j) => (
                  <div key={j} className="bg-white border border-stone-200 rounded-xl p-4 flex gap-4">
                    <div className="flex-shrink-0 font-mono text-2xl font-semibold" style={{ color: RAY_ORANGE }}>
                      {it.label}
                    </div>
                    <div className="text-stone-800 leading-relaxed pt-1">
                      <span className="font-medium">{it.strong}</span> {it.text}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Paragraphe texte */}
            {sec.text && (
              <div className="bg-white border border-stone-200 rounded-xl p-5">
                <p className="text-stone-800 leading-relaxed">{sec.text}</p>
                {/* Risques associés au texte */}
                {sec.risks && (
                  <ul className="mt-4 space-y-2">
                    {sec.risks.map((r, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-stone-700">
                        <span className="flex-shrink-0 w-1 h-1 rounded-full mt-2" style={{ backgroundColor: "#DC2626" }} />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Grille longueurs d'onde */}
            {sec.wavelengths && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {sec.wavelengths.map((w, j) => (
                  <div key={j} className="bg-white border border-stone-200 rounded-xl p-5">
                    <div className="flex items-baseline gap-2">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0 border border-black/5"
                        style={{ background: w.gradient }}
                      />
                      <div className="font-mono text-2xl font-semibold text-stone-900">
                        {w.nm}<span className="text-sm font-normal text-stone-500"> nm</span>
                      </div>
                    </div>
                    <div className="mt-3 text-sm">
                      <div className="text-stone-800">{w.inks}</div>
                      <div className="text-xs text-stone-500 mt-1 font-mono">Phototypes {w.phototypes}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Échelle des phototypes */}
            {sec.phototypes && (
              <div className="space-y-3">
                {sec.phototypes.map((p, j) => (
                  <div key={j} className="bg-white border border-stone-200 rounded-xl p-4 flex items-center gap-4">
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-mono font-semibold text-white"
                      style={{ backgroundColor: p.color, textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}
                    >
                      {p.roman}
                    </div>
                    <div className="text-sm text-stone-700 leading-relaxed">
                      {p.desc}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Comparaison 2 colonnes */}
            {sec.comparison && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sec.comparison.map((c, j) => (
                  <div
                    key={j}
                    className="rounded-xl p-5 border"
                    style={
                      c.isOld
                        ? { backgroundColor: "#FAFAF7", borderColor: "#E7E5E4" }
                        : { backgroundColor: RAY_ORANGE_SOFT, borderColor: RAY_ORANGE }
                    }
                  >
                    <div className="text-[10px] uppercase tracking-widest font-medium mb-1" style={{ color: c.isOld ? "#78716C" : "#8B4513" }}>
                      {c.label}
                    </div>
                    <div className="font-semibold text-stone-900 text-lg">{c.type}</div>
                    <p className="text-sm text-stone-700 mt-3 italic leading-relaxed">{c.analogy}</p>
                    <ul className="mt-4 space-y-1.5">
                      {c.points.map((pt, k) => (
                        <li key={k} className="flex items-start gap-2 text-sm text-stone-700">
                          <span
                            className="flex-shrink-0 w-1 h-1 rounded-full mt-2"
                            style={{ backgroundColor: c.isOld ? "#A8A29E" : RAY_ORANGE }}
                          />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Grille des 4 piliers */}
            {sec.pillars && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sec.pillars.map((p, j) => (
                  <div key={j} className="bg-white border border-stone-200 rounded-xl p-5">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="text-lg font-semibold text-stone-900">{p.name}</div>
                      <div className="font-mono text-xs px-2 py-1 rounded-md" style={{ backgroundColor: RAY_ORANGE_SOFT, color: "#8B4513" }}>
                        {p.unit}
                      </div>
                    </div>
                    <div className="text-sm text-stone-500 italic mt-1">{p.what}</div>
                    <p className="text-sm text-stone-700 leading-relaxed mt-3">{p.explain}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Idées reçues (mythe vs vérité) */}
            {sec.myths && (
              <div className="space-y-3">
                {sec.myths.map((m, j) => (
                  <div key={j} className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                    <div className="px-5 py-4 border-l-4" style={{ borderLeftColor: "#DC2626" }}>
                      <div className="text-[10px] uppercase tracking-widest font-medium text-red-700 mb-1">
                        Idée reçue
                      </div>
                      <div className="text-stone-900 font-medium italic">{m.myth}</div>
                    </div>
                    <div className="px-5 py-4 border-t border-stone-100" style={{ backgroundColor: RAY_ORANGE_SOFT }}>
                      <div className="text-[10px] uppercase tracking-widest font-medium mb-1" style={{ color: "#8B4513" }}>
                        La réalité
                      </div>
                      <div className="text-stone-800 leading-relaxed text-sm">{m.truth}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bullet list */}
            {sec.bullets && (
              <div className="bg-white border border-stone-200 rounded-xl p-5">
                <ul className="space-y-3">
                  {sec.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-3 text-stone-800 leading-relaxed">
                      <span
                        className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2.5"
                        style={{ backgroundColor: RAY_ORANGE }}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// MODE : RÉFLEXES (phrases interdites + glossaire)
// ============================================================

function ReflexesMode() {
  const [subMode, setSubMode] = useState("phrases");
  const [glossQuery, setGlossQuery] = useState("");

  const filteredGlossary = useMemo(() => {
    const q = glossQuery.trim().toLowerCase();
    if (!q) return GLOSSARY;
    return GLOSSARY.filter((g) =>
      (g.term + " " + g.techDef + " " + g.patientWords).toLowerCase().includes(q)
    );
  }, [glossQuery]);

  return (
    <div className="max-w-3xl mx-auto px-6 pb-24">
      <div className="mt-4 mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setSubMode("phrases")}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              subMode === "phrases" ? "text-white" : "bg-stone-100 text-stone-600"
            }`}
            style={subMode === "phrases" ? { backgroundColor: "#1A1A1A" } : {}}
          >
            <AlertOctagon className="w-4 h-4" />
            À ne jamais dire
          </button>
          <button
            onClick={() => setSubMode("glossary")}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              subMode === "glossary" ? "text-white" : "bg-stone-100 text-stone-600"
            }`}
            style={subMode === "glossary" ? { backgroundColor: "#1A1A1A" } : {}}
          >
            <Quote className="w-4 h-4" />
            Glossaire
          </button>
        </div>
      </div>

      {subMode === "phrases" && (
        <div>
          <p className="text-sm text-stone-500 mb-6 px-1">
            Les phrases qui peuvent mettre le SM (et Ray studios) en porte-à-faux, avec la reformulation correcte.
          </p>
          <div className="space-y-3">
            {FORBIDDEN_PHRASES.map((p, i) => (
              <div key={i} className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-l-4" style={{ borderLeftColor: "#DC2626" }}>
                  <div className="text-[10px] uppercase tracking-widest font-medium text-red-700 mb-1">
                    À ne pas dire
                  </div>
                  <div className="text-stone-900 font-medium italic">« {p.bad} »</div>
                  <div className="text-sm text-stone-600 mt-2">{p.why}</div>
                </div>
                <div className="px-5 py-4 border-t border-stone-100" style={{ backgroundColor: RAY_ORANGE_SOFT }}>
                  <div className="text-[10px] uppercase tracking-widest font-medium mb-1" style={{ color: "#8B4513" }}>
                    À dire à la place
                  </div>
                  <div className="text-stone-900">« {p.good} »</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {subMode === "glossary" && (
        <div>
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={glossQuery}
              onChange={(e) => setGlossQuery(e.target.value)}
              placeholder="Chercher un terme : fluence, érythème, RTP…"
              className="w-full pl-11 pr-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 text-sm"
            />
          </div>
          <div className="space-y-2">
            {filteredGlossary.map((g) => (
              <div key={g.term} className="bg-white border border-stone-200 rounded-xl p-5">
                <div className="font-semibold text-stone-900">{g.term}</div>
                <div className="mt-3">
                  <div className="text-[10px] uppercase tracking-widest text-stone-400 font-medium mb-1">
                    Définition
                  </div>
                  <div className="text-sm text-stone-700 leading-relaxed">{g.techDef}</div>
                </div>
                <div className="mt-3 pt-3 border-t border-dashed border-stone-200">
                  <div className="text-[10px] uppercase tracking-widest font-medium mb-1" style={{ color: "#8B4513" }}>
                    À dire au patient
                  </div>
                  <div className="text-sm text-stone-800 leading-relaxed">{g.patientWords}</div>
                </div>
              </div>
            ))}
            {filteredGlossary.length === 0 && (
              <div className="text-center py-12 text-stone-500 text-sm">
                Aucun terme trouvé pour « {glossQuery} ».
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// APPLICATION
// ============================================================

export default function App() {
  const [mode, setMode] = useState("themes");

  const tabs = [
    { id: "learn",    label: "Comprendre", icon: Atom },
    { id: "themes",   label: "Thèmes",     icon: BookOpen },
    { id: "reflex",   label: "Réflexes",   icon: Lightbulb },
    { id: "training", label: "Quiz",       icon: Target },
    { id: "calc",     label: "Calcul",     icon: Calculator },
  ];


  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#FAFAF7",
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
      }}
    >
      {/* En-tête */}
      <header
        className="sticky top-0 z-20 border-b border-stone-200"
        style={{ backgroundColor: "rgba(250, 250, 247, 0.95)", backdropFilter: "blur(8px)" }}
      >
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RayMark size={36} />
            <div>
              <RayWordmark height={18} />
              <div className="text-[10px] uppercase tracking-widest text-stone-500 mt-1">
                Guide médical du SM
              </div>
            </div>
          </div>
          <FadeDots className="hidden sm:flex" />
        </div>

        <div className="max-w-4xl mx-auto px-6">
          <div className="flex gap-1 -mb-px overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = mode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setMode(tab.id)}
                  className={`flex items-center gap-2 px-3 py-3 text-sm border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                    isActive ? "font-medium" : "border-transparent text-stone-500 hover:text-stone-900"
                  }`}
                  style={
                    isActive
                      ? { borderBottomColor: RAY_ORANGE, color: "#1A1A1A" }
                      : {}
                  }
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Contenu */}
      <main className="pt-4">
        {mode === "learn"    && <LearnMode />}
        {mode === "themes"   && <ThemesMode />}
        {mode === "reflex"   && <ReflexesMode />}
        {mode === "training" && <TrainingMode />}
        {mode === "calc"     && <CalcMode />}
      </main>

      {/* Pied de page */}
      <footer className="border-t border-stone-200 py-6 text-center">
        <div className="text-[10px] uppercase tracking-widest text-stone-400">
          Ray studios · Outil interne. Ne remplace pas l'avis médical
        </div>
      </footer>
    </div>
  );
}
