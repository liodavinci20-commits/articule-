# Articule +

Application web pédagogique d'orthophonie pour enfants. Permet d'apprendre et de pratiquer l'articulation des sons du français via des exercices interactifs avec correction vocale en temps réel.

---

## Table des matières

1. [Aperçu](#aperçu)
2. [Stack technique](#stack-technique)
3. [Architecture des fichiers](#architecture-des-fichiers)
4. [Modules fonctionnels](#modules-fonctionnels)
5. [Données pédagogiques](#données-pédagogiques)
6. [Authentification et persistance](#authentification-et-persistance)
7. [API externes](#api-externes)
8. [Base de données Supabase](#base-de-données-supabase)
9. [Installation et lancement](#installation-et-lancement)
10. [Compatibilité navigateur](#compatibilité-navigateur)
11. [Points d'attention](#points-dattention)

---

## Aperçu

Articule + est une application mono-page (SPA) sans framework. Elle propose cinq modules pédagogiques progressifs : Sons, Respiration, Lecture labiale, Quiz et Récompenses. Un système de gamification (étoiles, badges, journal) encourage la régularité.

L'application supporte deux modes d'utilisation :
- **Compte Supabase** : progression sauvegardée dans la base de données, accessible depuis n'importe quel appareil.
- **Mode invité** : progression stockée uniquement en localStorage, perdue à la fermeture de session.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Structure | HTML5 sémantique |
| Style | CSS3 vanilla (variables custom, grid, flexbox) |
| Logique | JavaScript ES6+ vanilla, modules IIFE |
| Authentification | Supabase Auth (email + mot de passe) |
| Base de données | Supabase PostgreSQL |
| TTS | ResponsiveVoice (CDN) + fallback SpeechSynthesis natif |
| Reconnaissance vocale | Web Speech API (SpeechRecognition) |
| Audio synthétique | Web Audio API (oscillateurs, ConvolverNode) |
| Icônes | Font Awesome 6.5 |
| Polices | Baloo 2 (titres), Nunito (corps) — Google Fonts |

---

## Architecture des fichiers

```
projet_massing/
├── index.html              # App principale (SPA)
├── login.html              # Page de connexion / inscription
│
├── css/
│   ├── main.css            # Variables, reset, layout, header
│   ├── components.css      # Tous les composants UI (boutons, grilles, modales…)
│   ├── animations.css      # Keyframes (fadeUp, breatheIn, confetti, bulles…)
│   └── login.css           # Styles spécifiques à la page de connexion
│
├── js/
│   ├── supabase.js         # Initialisation du client Supabase (URL + clé)
│   ├── data.js             # Toutes les données pédagogiques (phonèmes, syllabes, mots, quiz, badges)
│   ├── state.js            # État global + localStorage + sync Supabase différée
│   ├── utils.js            # Toast, étoiles, badges, journal, confetti, bulles micro, TTS, SpeechRecognition
│   ├── sons.js             # Module Sons : grilles phonèmes, diagrammes SVG, LSF, reconnaissance
│   ├── respiration.js      # Module Respiration : cycle animé + musique Web Audio
│   ├── labiale.js          # Module Lecture labiale : syllabes + mots + correction vocale
│   ├── quiz.js             # Module Quiz : navigation avant/arrière, score, badges
│   ├── recompenses.js      # Module Récompenses : étoiles, badges, journal
│   ├── app.js              # Initialisation, navigation par onglets, session, raccourcis clavier
│   └── auth.js             # Logique login.html : connexion, inscription, invité
│
├── image/                  # Images JPEG dactylologie LSF (A–Z), organisées par groupe phonologique
│   ├── bilabiales/
│   ├── dentales/
│   ├── fricatives/
│   ├── liquide/
│   ├── semi-voyelles/
│   ├── velaires/
│   └── voyelles/
│
└── dossier images/         # Diagrammes PNG position buccale (consonnes + voyelles)
    ├── les consonnes/
    └── voyelles/
```

### Ordre de chargement des scripts (index.html)

```
supabase-js (CDN)  →  supabase.js  →  responsivevoice (CDN)
→  data.js  →  state.js  →  utils.js
→  sons.js  →  respiration.js  →  labiale.js  →  quiz.js  →  recompenses.js
→  app.js
```

Cet ordre est impératif : chaque module dépend des modules précédents.

---

## Modules fonctionnels

### Module 1 — Sons (`js/sons.js`)

- Affiche deux grilles : 6 voyelles + consonnes regroupées par famille phonologique.
- Au clic sur un phonème, une modale s'ouvre avec :
  - Diagramme SVG inline de position des lèvres/dents/langue (10 positions différentes).
  - Image JPEG de la lettre en dactylologie LSF.
  - Consigne textuelle précise.
  - Bouton "Réécouter" (TTS).
  - Bouton "Je répète !" (SpeechRecognition avec scoring Levenshtein).
  - Bouton "Marquer comme réussi" (fallback manuel, visible 10 s après un échec de reconnaissance).
- Badger au premier clic (`first_sound`) et à la complétion de toutes les voyelles ou bilabiales.

### Module 2 — Respiration (`js/respiration.js`)

- Cycle en trois phases : Inspirer 4 s → Tenir 2 s → Expirer 4 s.
- Cercle animé CSS synchronisé avec les phases.
- Musique de fond synthétique via Web Audio API :
  - 3 oscillateurs (La3 220 Hz + binaural + Mi3 330 Hz).
  - Reverb synthétique via ConvolverNode avec bruit blanc.
  - Gain adaptatif selon la phase.
- 5 cycles = 15 étoiles + badge `breathing_done`.
- Bouton toggle Musique ON/OFF.

### Module 3 — Lecture labiale (`js/labiale.js`)

- 16 groupes de syllabes (B, P, M, T, D, N, K, G, F, V, S, Z, CH, J, L, R), 5 syllabes par groupe = 80 syllabes.
- 25 mots du quotidien classés par catégorie.
- Chaque item dispose de deux actions : TTS (volume) et SpeechRecognition (micro).
- Feedback visuel overlay succès/erreur.
- Badges à 15 syllabes (`lips_syllables`) et 15 mots (`lips_words`).

### Module 4 — Quiz (`js/quiz.js`)

- 8 questions à choix multiples sur les positions buccales et familles phonologiques.
- Diagramme SVG affiché pour les questions visuelles.
- Navigation avant/arrière pendant le quiz.
- +20 étoiles par bonne réponse.
- Écran de fin avec score en % et message encourageant.
- Badges : `quiz_done` (terminer) et `quiz_perfect` (8/8).

### Module 5 — Récompenses (`js/recompenses.js`)

- Compteur total d'étoiles.
- Barre de progression vers le prochain badge (seuils 50 et 100 étoiles).
- Grille des 10 badges avec état verrouillé/débloqué.
- Journal des 10 dernières activités (icône + texte + date + heure).

---

## Données pédagogiques

Toutes les données sont déclarées dans `js/data.js` et exposées en variables globales.

| Variable | Contenu | Taille |
|---|---|---|
| `VOYELLES` | 6 voyelles (A, E, É, I, O, U) | 6 |
| `CONSONNES_GROUPS` | 6 familles de consonnes | 17 phonèmes |
| `ALL_PHONEMES` | Liste plate voyelles + consonnes | 23 |
| `SYLLABES_GROUPS` | 16 bases × 5 syllabes | 80 |
| `MOTS` | Mots du quotidien par catégorie | 25 |
| `QUIZ_DATA` | Questions + diagrammes + explications | 8 |
| `BADGES_DATA` | Clé, icône, nom, description, étoiles requises | 10 |

Chaque phonème et syllabe est décrit par : `id`, `symbol`, `group`, `example`, `hint`, `mouthPos`, `lsfLetter`, `testWords`.

---

## Authentification et persistance

### Flux d'authentification (`js/auth.js` + `js/app.js`)

```
login.html → auth.js
  ├── Connexion email/mot de passe (Supabase Auth)
  ├── Inscription (prénom + email + mot de passe × 2)
  │     └── INSERT dans table `profiles` (id, prenom)
  └── Mode invité → localStorage.setItem('articule_active_user', 'guest')

index.html → app.js
  ├── getSession() Supabase
  ├── Si session absente ET pas invité → redirect login.html
  ├── Si session → loadFromSupabase() + affichage prénom
  └── Si invité → mode local uniquement
```

### État local (`js/state.js`)

- Clé localStorage : `sonobulle_v2`
- Structure :

```js
{
  stars, progress,
  completedPhonemes,  // IDs des phonèmes pratiqués
  breathCycles,
  quizIndex, quizScore, quizHistory,
  earnedBadges,       // clés des badges débloqués
  journal,            // 50 dernières entrées
  syllablesViewed,    // IDs des syllabes vues
  wordsViewed         // IDs des mots vus
}
```

- Toute modification déclenche une sauvegarde localStorage immédiate et une synchronisation Supabase différée de 1,5 s.
- En mode invité, la sync Supabase est désactivée.

### Tables Supabase

| Table | Colonnes principales |
|---|---|
| `profiles` | `id` (uuid FK auth), `prenom` |
| `progress` | `user_id`, `stars`, `breath_cycles`, `completed_phonemes[]`, `syllables_viewed[]`, `words_viewed[]`, `earned_badges[]`, `quiz_history[]`, `updated_at` |
| `journal` | `id`, `user_id`, `icon`, `text`, `created_at` |

---

## API externes

| Service | Usage | Condition |
|---|---|---|
| ResponsiveVoice | TTS français avec accents corrects | Nécessite connexion internet |
| SpeechSynthesis (natif) | Fallback TTS si ResponsiveVoice absent | Intégré au navigateur |
| SpeechRecognition | Reconnaissance vocale pour la correction | Chrome / Edge uniquement |
| Web Audio API | Musique de respiration synthétique | Tous navigateurs modernes |
| Supabase | Auth + BDD cloud | Nécessite connexion internet |
| Google Fonts | Baloo 2 + Nunito | Nécessite connexion internet |
| Font Awesome 6.5 | Icônes | Nécessite connexion internet |

---

## Installation et lancement

L'application est entièrement statique. Aucune compilation ni dépendance npm n'est requise.

### Prérequis

- Navigateur : Google Chrome ou Microsoft Edge (pour la reconnaissance vocale).
- Un serveur HTTP local (les modules ES et la Speech API ne fonctionnent pas via `file://`).

### Lancement avec VS Code Live Server

1. Installer l'extension **Live Server** dans VS Code.
2. Ouvrir le dossier `projet_massing/`.
3. Clic droit sur `login.html` → **Open with Live Server**.

### Lancement avec Python

```bash
cd projet_massing
python -m http.server 5500
# puis ouvrir http://localhost:5500/login.html
```

### Lancement avec Node.js

```bash
npx serve projet_massing
```

---

## Compatibilité navigateur

| Fonctionnalité | Chrome | Edge | Firefox | Safari |
|---|---|---|---|---|
| Reconnaissance vocale | Oui | Oui | Non | Partiel |
| TTS ResponsiveVoice | Oui | Oui | Oui | Oui |
| TTS natif | Oui | Oui | Oui | Oui |
| Web Audio | Oui | Oui | Oui | Oui |
| Supabase / Auth | Oui | Oui | Oui | Oui |

La bannière d'avertissement s'affiche automatiquement si `SpeechRecognition` est absent.

---

## Points d'attention

### Sécurité

- La clé publique Supabase est visible dans `js/supabase.js`. Il s'agit de la clé **anon** (lecture publique limitée par les Row Level Security Supabase). Ne jamais utiliser la clé **service_role** côté client.
- Vérifier que les politiques RLS Supabase limitent chaque utilisateur à ses propres données.

### Limitations connues

- La reconnaissance vocale est disponible uniquement sous Chrome et Edge.
- Le mode invité ne persiste pas entre sessions (données perdues à la fermeture du navigateur).
- Le score de quiz est réinitialisé à chaque rechargement de page (non sauvegardé dans `State`).
- Les bulles animées demandent la permission micro même en mode invité.

### Palette de couleurs

```css
--terra:  #B85C38   /* terracotta */
--sage:   #5C8A6B   /* vert sauge */
--slate:  #4A7BA8   /* bleu ardoise */
--plum:   #6B4E8A   /* prune */
--gold:   #C49A3A   /* or */
```
