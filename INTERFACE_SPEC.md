# Articule + — Spécification Complète d'Interface
> Guide destiné à une IA pour reconstruire à l'identique le frontend de cette application d'orthophonie pédiatrique, en remplaçant Web Speech API par un backend Whisper personnalisé.

---

## 1. Vue d'ensemble

**Nom** : Articule +  
**Cible** : Enfants en orthophonie (6-12 ans)  
**Type** : SPA (Single Page Application) vanilla HTML/CSS/JS — aucun framework  
**Objectif** : Apprentissage de l'articulation des sons du français via 5 modules progressifs

### Ce que fait l'app

1. L'enfant clique sur une lettre/son
2. L'app lit le son à voix haute (TTS)
3. L'enfant clique sur "Je répète !" et parle dans son micro
4. L'app capture l'audio → envoie à Whisper → reçoit la transcription
5. La transcription est comparée au son cible → feedback succès/erreur
6. Une barre d'ondulation en temps réel guide visuellement pendant la prise de son

---

## 2. Système de design

### 2.1 Palette de couleurs (CSS custom properties)

```css
:root {
  /* Fonds */
  --bg:         #F4F1EC;   /* fond général beige chaud */
  --surface:    #FFFFFF;   /* cartes, modales */
  --surface-2:  #EDE9E1;   /* fond secondaire */
  --border:     #DDD8CF;
  --border-2:   #CCC8BF;

  /* Texte */
  --text:       #2A2A2A;
  --text-muted: #787068;
  --text-light: #AAA5A0;

  /* Accents (un par module) */
  --terra:  #B85C38;   /* terracotta — Sons, actions primaires */
  --sage:   #5C8A6B;   /* vert sauge — Respiration, succès */
  --slate:  #4A7BA8;   /* bleu ardoise — Quiz, info */
  --plum:   #6B4E8A;   /* prune — Récompenses */
  --gold:   #C49A3A;   /* or vieilli — étoiles, badges */

  /* États */
  --success:    #4A8A5C;
  --success-bg: #EFF7F2;
  --error:      #A84A4A;
  --error-bg:   #FAF0F0;
  --info:       #4A7BA8;
  --info-bg:    #EEF4FB;

  /* Ombres */
  --shadow-sm: 0 1px 4px rgba(0,0,0,0.06);
  --shadow:    0 3px 16px rgba(0,0,0,0.08);
  --shadow-lg: 0 6px 28px rgba(0,0,0,0.11);

  /* Géométrie */
  --radius:      14px;
  --radius-sm:   8px;
  --radius-lg:   22px;
  --radius-pill: 50px;

  /* Transitions */
  --transition: 0.22s ease;
}
```

### 2.2 Typographie

```html
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
```

- **Titres** : `Baloo 2` — poids 700/800
- **Corps** : `Nunito` — poids 400/600/700/800
- `h1` : `clamp(1.8rem, 4vw, 2.8rem)`, weight 800
- `h2` : `1.5rem`, weight 700
- `h3` : `1.2rem`, weight 700
- Corps : `16px` base, `line-height: 1.6`

### 2.3 Icônes

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
```

Font Awesome 6.5 — classes `fa-solid fa-*`

---

## 3. Structure HTML globale

```
body
├── .bg-bubbles          ← 8 spans animés par le micro (bulles montantes)
├── #confettiContainer   ← confettis injectés dynamiquement
├── .toast#toast         ← notifications flottantes (succès, badge, info)
├── .modal-overlay#phonemeModal   ← modale exercice phonème
├── .wrapper#mainAppWrapper
│   ├── header
│   ├── #browserBanner   ← alerte si navigateur incompatible
│   ├── .progress-section
│   ├── nav.tabs
│   ├── #screen-sons      (active par défaut)
│   ├── #screen-respiration
│   ├── #screen-levres
│   ├── #screen-jeu
│   └── #screen-recompenses
└── .confirm-overlay#resetConfirmModal
```

### Layout wrapper

```css
.wrapper {
  max-width: 880px;
  margin: 0 auto;
  padding: 16px 20px 40px;
}
```

---

## 4. Composants globaux

### 4.1 Header

```html
<header>
  <div class="user-pill" id="userPill" style="display:none;">
    <!-- icône user + prénom + bouton déconnexion -->
  </div>
  <div class="logo-wrap">
    <i class="fa-solid fa-comment-dots" style="color:var(--terra);font-size:2rem;"></i>
  </div>
  <h1>Articule +</h1>
  <p id="appGreetingText">J'apprends à articuler en m'amusant !</p>
</header>
```

- Logo : cercle blanc 80×80px avec icône `fa-comment-dots` terracotta
- Titre centré avec animation `fadeDown 0.6s`
- Pill utilisateur en haut à droite (prénom + logout)

### 4.2 Barre de progression globale

```html
<div class="progress-section">
  <div class="progress-header">
    <span><i class="fa-solid fa-chart-line"></i> Ma progression</span>
    <div class="progress-stars">
      <i class="fa-solid fa-star"></i>
      <span id="starsCount">0</span>
    </div>
  </div>
  <div class="progress-bar-bg">
    <div class="progress-bar-fill" id="progressFill" style="width:0%;"></div>
  </div>
  <p class="progress-label"><span id="progressText">0</span>% accompli</p>
</div>
```

- Fond `--surface`, border `--border`, radius `--radius`, padding 16px
- Barre de progression : gradient `var(--terra)` → `var(--gold)`
- Étoiles affichées en haut à droite du header de section

### 4.3 Navigation par onglets

```html
<nav class="tabs" role="tablist">
  <button class="tab-btn active" data-tab="sons">
    <i class="fa-solid fa-comment"></i> Sons
  </button>
  <button class="tab-btn" data-tab="respiration">
    <i class="fa-solid fa-wind"></i> Respiration
  </button>
  <button class="tab-btn" data-tab="levres">
    <i class="fa-solid fa-eye"></i> Lecture labiale
  </button>
  <button class="tab-btn" data-tab="jeu">
    <i class="fa-solid fa-gamepad"></i> Quiz
  </button>
  <button class="tab-btn" data-tab="recompenses">
    <i class="fa-solid fa-trophy"></i> Récompenses
  </button>
</nav>
```

- Flex row, scroll horizontal sur mobile
- `.tab-btn.active` : fond `var(--terra)`, texte blanc
- Transition de couleur `var(--transition)`

### 4.4 Carte (composant de base)

```html
<div class="card">
  <div class="card-title"><i class="fa-solid fa-*"></i> Titre</div>
  <div class="card-subtitle">Sous-titre</div>
  <!-- contenu -->
</div>
```

- Fond `--surface`, border `--border`, radius `--radius`, shadow `--shadow`
- Padding 20px, margin-bottom 16px
- `.card-title` : font Baloo 2, 1.05rem, couleur `--text`
- `.card-subtitle` : font Nunito, 0.85rem, couleur `--text-muted`

### 4.5 Bannière de module

```html
<div class="module-banner module-banner--sons">
  <div class="module-banner__icon">
    <i class="fa-solid fa-comment"></i>
  </div>
  <div>
    <h3>Module 1 — Les Sons</h3>
    <p>Description courte</p>
  </div>
</div>
```

Couleurs par module :
- `--sons` : accent terra
- `--respiration` : accent sage
- `--levres` : accent slate
- `--quiz` : accent plum
- `--recompenses` : accent gold

### 4.6 Boutons

```html
<!-- Primaire (action principale) -->
<button class="btn-primary">
  <i class="fa-solid fa-microphone"></i> Je répète !
</button>

<!-- Secondaire (action secondaire) -->
<button class="btn-secondary">
  <i class="fa-solid fa-volume-high"></i> Réécouter
</button>
```

- `.btn-primary` : fond `--terra`, texte blanc, radius `--radius-pill`, padding 12px 24px, shadow
- `.btn-secondary` : fond transparent, border `--border-2`, texte `--text`, radius `--radius-pill`
- Hover : légère élévation shadow, scale 1.02
- Active : scale 0.98

### 4.7 Toast (notification)

```html
<div class="toast" id="toast" role="status" aria-live="polite"></div>
```

- Position fixe en haut au centre
- `.toast--success` : fond `--success-bg`, bordure `--success`
- `.toast--badge` : fond `--gold` opacité, bordure `--gold`
- `.toast--info` : fond `--info-bg`, bordure `--info`
- Animation slide-down + fade, disparaît après 3,5s

### 4.8 Bulles de fond

```html
<div class="bg-bubbles" aria-hidden="true">
  <span></span><!-- × 8 -->
</div>
```

- 8 spans absolus, tailles variées (20-80px), fond `rgba(184,92,56,0.08)` à `rgba(92,138,107,0.06)`
- Animation `bubble-rise` déclenchée dynamiquement quand l'amplitude micro dépasse un seuil
- Position fixe, z-index 0 (derrière tout le contenu)

---

## 5. Module 1 — Sons

### 5.1 Structure écran

```html
<div class="screen active" id="screen-sons">
  <!-- Bannière module -->
  <div class="module-banner module-banner--sons">...</div>

  <!-- Carte voyelles -->
  <div class="card">
    <div class="card-title"><i class="fa-solid fa-volume-high"></i> Les Voyelles</div>
    <div class="card-subtitle">Les sons fondamentaux — commence par ici !</div>
    <div class="phoneme-grid" id="voyellesGrid"></div>
  </div>

  <!-- Carte consonnes -->
  <div class="card">
    <div class="card-title"><i class="fa-solid fa-comment"></i> Les Consonnes</div>
    <div class="card-subtitle">Classées par type de production — observe ta bouche !</div>
    <div id="consonnesContainer"></div>
  </div>
</div>
```

### 5.2 Grille de phonèmes

Chaque phonème est une carte cliquable :

```html
<button class="phoneme-card" id="pcard-v-a" onclick="Sons.openPhonemePanel('v-a')">
  <div class="phoneme-card__symbol">A</div>
  <div class="phoneme-card__example">ARBRE</div>
  <!-- Quand réussi : -->
  <div class="phoneme-card__check"><i class="fa-solid fa-check"></i></div>
</button>
```

- Grille CSS : `grid-template-columns: repeat(auto-fill, minmax(80px, 1fr))`
- État réussi `.phoneme-card--done` : fond `--success-bg`, bordure `--success`, check vert visible
- Symbole : font Baloo 2, 1.8rem, couleur `--terra`
- Exemple : Nunito 0.65rem, uppercase, `--text-muted`

Les consonnes sont regroupées par famille :

```html
<div class="phoneme-group">
  <div class="phoneme-group__label">Les Bilabiales</div>
  <div class="phoneme-group__desc">Les deux lèvres se touchent pour former ces sons.</div>
  <div class="phoneme-grid"><!-- cartes phonèmes --></div>
</div>
```

### 5.3 Données — Voyelles (6)

| id | symbol | example | hint | testWords |
|---|---|---|---|---|
| v-a | A | ARBRE | Ouvre grand la bouche, langue plate et basse. | ['a','ah','arbre','ha'] |
| v-e | E | ÉCOLE | Bouche entrouverte, position neutre des lèvres. | ['e','eu','le','de','ce'] |
| v-ei | É | ÉLÉPHANT | Tire les coins des lèvres vers les oreilles. | ['é','et','aller','bébé'] |
| v-i | I | ÎLE | Lèvres très étirées, ouverture fine. | ['i','il','si','ni','île'] |
| v-o | O | OURS | Arrondis les lèvres en cercle. | ['o','oh','eau','au','or'] |
| v-u | U | UNIVERS | Lèvres en bisou, très serrées et avancées. | ['u','une','tu','du','lu'] |

### 5.4 Données — Consonnes (21, 6 groupes)

**Bilabiales** (les deux lèvres se touchent) :
- P / PAPA / `['p','pa','papa','peu','pain']`
- B / BÉBÉ / `['b','ba','bébé','bon','bien']`
- M / MAMAN / `['m','ma','maman','me','moi']`

**Dentales** (langue → dents/alvéoles) :
- T / TABLE / `['t','ta','table','tu','te']`
- D / DENT / `['d','da','dent','du','de']`
- N / NID / `['n','na','nid','non','ni']`

**Vélaires** (fond de la bouche) :
- K / CHAT / `['k','ka','cake','cou','qui']`
- G / GÂTEAU / `['g','ga','gâteau','gros','gui']`

**Fricatives** (frottement de l'air) :
- F / FLEUR / `['f','fa','fleur','feu','fait']`
- V / VÉLO / `['v','va','vélo','vite','voir']`
- S / SOLEIL / `['s','sa','soleil','si','sous']`
- Z / ZÈBRE / `['z','za','zèbre','zoo','zut']`
- CH / CHAT / `['ch','cha','chat','chien','chou']`
- J / JOUET / `['j','ja','jouet','jeu','jour']`

**Liquides** (langue en l'air) :
- L / LUNE / `['l','la','lune','lit','loup']`
- R / ROSE / `['r','ra','rose','rue','roi']`

**Semi-voyelles** :
- Y / YEUX / `['y','ya','yeux','yoyo']`
- W / WIFI / `['w','wa','wifi','web']`

**Nasales** :
- GN / AGNEAU / `['gn','gna','agneau','ligne']`
- NG / CAMPING / `['ng','camping','ring']`

### 5.5 Modale exercice phonème

```html
<div class="modal-overlay" id="phonemeModal">
  <div class="modal">

    <!-- Bouton fermer -->
    <button class="modal__close" onclick="Sons.closePhonemePanel()">
      <i class="fa-solid fa-xmark"></i>
    </button>

    <!-- En-tête : symbole + exemple -->
    <div class="modal__header">
      <div class="modal__symbol" id="panelSymbol">A</div>   <!-- Baloo 2, 4rem, terra -->
      <div class="modal__example" id="panelExample">ARBRE</div>
    </div>

    <!-- Diagramme bouche + image LSF côte à côte -->
    <div class="modal__body">
      <div class="modal__diagram" id="panelMouth"></div>    <!-- SVG ou IMG -->
      <div class="modal__lsf-wrap">
        <div class="modal__lsf" id="panelLSF"></div>        <!-- IMG dactylologie -->
        <span class="modal__lsf-label" id="panelLSFLabel">Signe LSF</span>
      </div>
    </div>

    <!-- Consigne textuelle -->
    <div class="modal__hint" id="panelHint">
      Ouvre grand la bouche, langue basse.
    </div>

    <!-- Zone transcript (ce que le micro a entendu) -->
    <div id="transcriptZone" class="transcript-zone transcript-zone--idle">
      <div class="transcript-zone__label" id="transcriptLabel">Ce que tu as dit</div>
      <div class="transcript-zone__text" id="transcriptText">—</div>
    </div>

    <!-- Canvas barre d'onde en temps réel -->
    <canvas id="waveCanvas" height="56"
      style="display:none; width:100%; border-radius:8px; margin:6px 0 4px;"></canvas>

    <!-- Feedback reconnaissance vocale -->
    <div class="phoneme-feedback" id="panelFeedback" aria-live="polite"></div>

    <!-- Bouton fallback manuel -->
    <button class="btn-secondary" id="panelMarkDoneBtn"
      onclick="Sons.markDoneManually()" style="display:none;">
      <i class="fa-solid fa-check"></i> Marquer comme réussi
    </button>

    <!-- Actions -->
    <div class="modal__actions">
      <button class="btn-secondary" onclick="Sons.replaySound()">
        <i class="fa-solid fa-volume-high"></i> Réécouter
      </button>
      <button class="btn-primary" id="panelRepeatBtn" onclick="Sons.toggleRepeat()">
        <i class="fa-solid fa-microphone"></i> Je répète !
      </button>
    </div>

  </div>
</div>
```

**États de `.transcript-zone`** :
- `--idle` : fond neutre, texte `—`
- `--listening` : fond `--info-bg`, bordure `--info`, texte `J'entends...`
- `--success` : fond `--success-bg`, bordure `--success`
- `--error` : fond `--error-bg`, bordure `--error`

**États de `.phoneme-feedback`** :
- `--success` : `✓ Bravo ! C'est bien le son !` — fond vert
- `--error` : `✗ Pas tout à fait... réessaie !` — fond rouge
- `--info` : message informatif — fond bleu

**Bouton "Je répète !" pendant l'enregistrement** :
```html
<!-- Pendant l'enregistrement : -->
<button class="btn-primary btn--recording" id="panelRepeatBtn">
  <i class="fa-solid fa-stop"></i> Arrêter
</button>
```

### 5.6 Visualiseur d'onde (canvas)

- Canvas affiché uniquement pendant l'enregistrement
- Dessin en temps réel via `AudioContext` + `AnalyserNode`
- Couleur de l'onde : terracotta calme `rgba(184,92,56,0.6)` → or vif `rgba(196,154,58,1)` quand amplitude élevée
- Épaisseur de ligne : 2px → 5px selon amplitude
- Fond : `rgba(184,92,56,0.06)` avec ligne centrale pointillée
- Connexion : **le même stream AudioContext sert la détection de silence ET le canvas** (un seul getUserMedia)

### 5.7 Flux d'interaction — Module Sons

```
1. Clic phonème-card → openPhonemePanel()
   → ouvre modal, remplit symbole/exemple/hint/diagramme/LSF
   → parle automatiquement le son (TTS)

2. Clic "Réécouter" → TTS rejoue le son

3. Clic "Je répète !" → startRepeat()
   → startBubbleMic() : demande permission micro, crée AudioContext
   → MediaRecorder.start() sur _micStream
   → canvas waveCanvas s'affiche
   → bouton change en "Arrêter"
   → bulles de fond s'animent selon amplitude

4. Silence 1,5s OU clic "Arrêter" → recorder.stop()
   → blob audio envoyé à POST /api/transcribe (ou endpoint Whisper)
   → réponse { text: "..." }
   → comparaison texte reçu vs phonème cible (_matchPhoneme)
   → affichage feedback succès/erreur
   → si succès : confetti + bulles + +10 étoiles + phonème marqué ✓
   → bouton "Marquer comme réussi" apparaît 10s après un échec

5. Fermeture modale → stopWaveform(), stopBubbleMic()
```

### 5.8 Logique de correspondance phonème

```js
function _matchPhoneme(transcript, phoneme) {
  // normalize: minuscules, sans accents, sans ponctuation
  const norm = s => s.toLowerCase().normalize('NFD')
    .replace(/\p{Mn}/gu, '').replace(/[^a-z]/g, '').trim();

  const t   = norm(transcript);
  const sym = norm(phoneme.symbol);

  if (!t) return false;
  if (sym && t.startsWith(sym)) return true;  // "ah" pour "a" ✓
  return phoneme.testWords.some(w => {
    const nw = norm(w);
    return nw && (t === nw || t.startsWith(nw) || t.includes(nw));
  });
}
```

---

## 6. Module 2 — Respiration

### 6.1 Structure

```html
<div class="breathing-container">
  <!-- Cercle animé central -->
  <div class="breath-circle" id="breathCircle" onclick="Respiration.start()">
    <i class="fa-solid fa-play" id="breathIcon"></i>
    <span>COMMENCER</span>
  </div>

  <!-- Compte à rebours -->
  <div class="breath-count" id="breathCount"></div>
  <div class="breath-label" id="breathLabel">Clique pour commencer !</div>

  <!-- Indicateurs de phase -->
  <div class="breath-steps">
    <div class="breath-step-pill" id="step-inhale">INSPIRER 4s</div>
    <div class="breath-step-pill" id="step-hold">TENIR 2s</div>
    <div class="breath-step-pill" id="step-exhale">EXPIRER 4s</div>
  </div>

  <p>Cycles : <strong id="breathCycles">0</strong> / 5</p>

  <button class="btn-secondary" id="musicToggleBtn" onclick="Respiration.toggleMusic()">
    <i class="fa-solid fa-volume-xmark"></i> Musique OFF
  </button>
</div>
```

### 6.2 Comportement

- Cercle : 160px, animation CSS `breatheIn` (scale 1→1.4) / `breatheOut` (scale 1.4→1) / `breatheHold`
- 3 phases : Inspirer 4s → Tenir 2s → Expirer 4s
- Pill de phase active : surlignée en couleur sage
- 5 cycles → +15 étoiles + badge `breathing_done`
- Musique Web Audio : 3 oscillateurs + reverb ConvolverNode

---

## 7. Module 3 — Lecture Labiale

### 7.1 Structure

```html
<!-- Zone enregistrement active (s'affiche pendant la prise de son) -->
<div id="labialeRecordingZone" class="labiale-recording-zone" style="display:none;">
  <div class="labiale-recording-zone__target">
    Tu dois dire : <strong id="labialeTargetWord">—</strong>
  </div>
  <canvas id="labialeWaveCanvas" height="56" style="display:none; width:100%; border-radius:8px;"></canvas>
  <div id="labialeTranscriptZone" class="transcript-zone transcript-zone--idle">
    <div class="transcript-zone__label" id="labialeTranscriptLabel">Ce que tu as dit</div>
    <div class="transcript-zone__text" id="labialeTranscriptText">—</div>
  </div>
  <div class="phoneme-feedback" id="labialeFeedback"></div>
</div>

<!-- Carte syllabes -->
<div class="card">
  <div class="card-title"><i class="fa-solid fa-spell-check"></i> Les Syllabes</div>
  <div id="syllabesContainer"></div>  <!-- injecté par labiale.js -->
</div>

<!-- Carte mots -->
<div class="card">
  <div class="card-title"><i class="fa-solid fa-comment-dots"></i> Les Mots</div>
  <div id="motsContainer"></div>  <!-- injecté par labiale.js -->
</div>
```

### 7.2 Carte syllabe/mot

```html
<div class="labiale-card" id="lcard-ba">
  <div class="labiale-card__text">BA</div>
  <div class="labiale-card__actions">
    <button class="btn-icon" onclick="Labiale.play('ba', 'syl', card)">
      <i class="fa-solid fa-volume-high"></i>
    </button>
    <button class="btn-icon btn-mic" onclick="Labiale.record('ba', 'syl', card, micBtn)">
      <i class="fa-solid fa-microphone"></i>
    </button>
  </div>
  <!-- Overlay feedback (succès/erreur) affiché brièvement -->
  <div class="labiale-card__overlay labiale-card__overlay--success" style="display:none;">
    <i class="fa-solid fa-check"></i>
  </div>
</div>
```

- Carte : fond `--surface`, border `--border`, radius `--radius`, padding 12px
- Texte : Baloo 2, 1.3rem, centré
- Boutons icône : 36px ronds, fond `--surface-2`
- Overlay : fond semi-transparent vert/rouge, icône centré, animation `popIn`
- État réussi `.labiale-card--done` : bordure `--success`, fond `--success-bg`

### 7.3 Données — Syllabes (80 = 16 groupes × 5)

Groupes : **B, P, M, T, D, N, K, G, F, V, S, Z, CH, J, L, R**

Exemple groupe B :
```
BA, BE, BI, BO, BU
```

Chaque syllabe : `{ id, text, group, testWords: [text.toLowerCase(), ...variantes] }`

### 7.4 Données — Mots (20-25 mots du quotidien)

Catégories : Premiers mots, Famille, Actions, Animaux, Objets

Exemples :
```
MAMAN, PAPA, BÉBÉ, BONJOUR, MERCI, OUI, NON,
CHAT, CHIEN, OISEAU, MAISON, ÉCOLE, SOLEIL, FLEUR,
BOIRE, MANGER, DORMIR, JOUER, LIRE, CHANTER
```

### 7.5 Flux d'interaction — Lecture Labiale

```
1. Clic bouton volume → TTS du texte (Utils.speak)

2. Clic bouton micro → _startRecording(item, type, card, micBtn)
   → labialeRecordingZone s'affiche avec le mot cible
   → startBubbleMic(), startWaveform(labialeWaveCanvas)
   → MediaRecorder démarre
   → bouton micro → rouge/actif

3. Silence 1,5s OU clic re-micro → stop
   → envoi audio → Whisper → texte
   → _matchLabiale(heard, item) : compare au texte cible
   → overlay succès/erreur sur la carte
   → si succès : +5 étoiles, badge si 15+ réussites
```

### 7.6 Logique correspondance labiale

```js
function _matchLabiale(transcript, item) {
  const norm = s => s.toLowerCase().normalize('NFD')
    .replace(/\p{Mn}/gu, '').replace(/[^a-z]/g, '').trim();
  const t = norm(transcript);
  const target = norm(item.text);
  return t === target || t.startsWith(target) || t.includes(target)
    || item.testWords.some(w => norm(w) === t || t.includes(norm(w)));
}
```

---

## 8. Module 4 — Quiz

### 8.1 Structure

```html
<div id="quizContainer">
  <div class="quiz-score-bar">
    <span>Question <span id="qNum">1</span> / <span id="qTotal">8</span></span>
    <span>Score : <span id="qScore">0</span> <i class="fa-solid fa-check"></i></span>
  </div>
  <div id="qImg" class="quiz-question-img"></div>  <!-- diagramme optionnel -->
  <p class="quiz-question-text" id="qText"></p>
  <div class="quiz-options" id="qOptions" role="group"></div>
  <div class="quiz-feedback" id="qFeedback" aria-live="polite"></div>
  <div class="quiz-nav">
    <button class="btn-secondary" id="prevBtn" onclick="Quiz.prev()" disabled>
      <i class="fa-solid fa-arrow-left"></i> Précédente
    </button>
    <button class="btn-primary btn--hidden" id="nextBtn" onclick="Quiz.next()">
      Question suivante <i class="fa-solid fa-arrow-right"></i>
    </button>
  </div>
</div>
```

### 8.2 Options de réponse

```html
<button class="quiz-option" onclick="Quiz.answer(this, 'Bilabiales')">
  Bilabiales
</button>
```

États après réponse :
- `.quiz-option--correct` : fond vert, icône ✓
- `.quiz-option--wrong` : fond rouge, icône ✗
- Toutes les options désactivées après réponse

### 8.3 Données Quiz (8 questions)

```js
[
  {
    question: "Comment s'appelle le groupe des sons P, B, M ?",
    options: ["Bilabiales", "Dentales", "Fricatives", "Vélaires"],
    answer: "Bilabiales",
    explanation: "P, B et M se prononcent en fermant les deux lèvres.",
    diagram: null
  },
  {
    question: "Quel son voit-on ici ?",
    options: ["A", "O", "U", "I"],
    answer: "O",
    explanation: "Les lèvres forment un cercle arrondi pour le son O.",
    diagram: "rounded-open"  // mouthPos → affiche le SVG correspondant
  },
  // ... 6 autres questions sur phonologie et positions buccales
]
```

### 8.4 Écran de fin

```html
<div class="quiz-end">
  <div class="quiz-end__score">6/8 — 75%</div>
  <p class="quiz-end__msg">Très bien ! Continue à t'entraîner !</p>
  <button class="btn-primary" onclick="Quiz.restart()">
    <i class="fa-solid fa-rotate-right"></i> Recommencer
  </button>
</div>
```

Messages selon score : 8/8 → "Parfait !", 6-7 → "Très bien !", 4-5 → "Bien !", <4 → "Continue !"

---

## 9. Module 5 — Récompenses

### 9.1 Section étoiles

```html
<div class="stars-display">
  <div class="stars-total" id="totalStarsDisplay">0</div>
  <p class="stars-label">étoiles gagnées</p>
  <p id="starsNextGift">100 étoiles avant le prochain badge !</p>
  <div class="progress-bar-bg">
    <div class="progress-bar-fill" id="starsProgressFill"
      style="width:0%; background:linear-gradient(90deg,var(--gold),var(--terra));"></div>
  </div>
</div>
```

Seuils : 50 étoiles → badge `stars_50` / 100 étoiles → badge `stars_100`

### 9.2 Grille badges

```html
<div class="badges-grid" id="badgesGrid">
  <!-- Généré dynamiquement -->
  <div class="badge-item badge-item--earned">
    <div class="badge-icon"><i class="fa-solid fa-star"></i></div>
    <div class="badge-name">Première Étoile</div>
  </div>
  <div class="badge-item badge-item--locked">
    <div class="badge-icon"><i class="fa-solid fa-lock"></i></div>
    <div class="badge-name">Quiz Parfait</div>
  </div>
</div>
```

- Grille : `repeat(auto-fill, minmax(90px, 1fr))`
- Gagné : fond coloré selon accent, icône colorée, animation `popIn`
- Verrouillé : fond `--surface-2`, icône `--text-light`, opacité 0.5

### 9.3 Données — 10 Badges

| key | icon | name | condition |
|---|---|---|---|
| first_sound | fa-music | Premier Son | Cliquer sur le 1er phonème |
| all_vowels | fa-language | Toutes les Voyelles | Compléter les 6 voyelles |
| bilabiales | fa-lips | Bilabiales | Compléter P, B, M |
| breathing_done | fa-wind | Souffle Maîtrisé | Terminer 5 cycles respiration |
| lips_syllables | fa-spell-check | Syllabiste | Réussir 15 syllabes |
| lips_words | fa-comment-dots | Vocabulaire | Réussir 15 mots |
| quiz_done | fa-gamepad | Quizzeur | Terminer le quiz |
| quiz_perfect | fa-crown | Quiz Parfait | Score 8/8 |
| stars_50 | fa-star | 50 Étoiles | Accumuler 50 étoiles |
| stars_100 | fa-trophy | 100 Étoiles | Accumuler 100 étoiles |

### 9.4 Journal d'activité

```html
<div class="journal-entry">
  <div class="journal-entry__icon">
    <i class="fa-solid fa-comment"></i>
  </div>
  <div class="journal-entry__content">
    <p class="journal-entry__text">Son prononcé : A (ARBRE)</p>
    <p class="journal-entry__time">14:32 · 27/04</p>
  </div>
</div>
```

- 10 dernières entrées, ordre inverse (plus récent en haut)
- Icônes : `fa-comment` (son), `fa-microphone` (labiale), `fa-wind` (respiration), `fa-award` (badge)

---

## 10. Système de gamification

### Étoiles

| Action | Gain |
|---|---|
| Phonème prononcé correctement | +10 ⭐ |
| Syllabe ou mot réussi | +5 ⭐ |
| Bonne réponse quiz | +20 ⭐ |
| 5 cycles respiration | +15 ⭐ |
| Badge débloqué | +0 à +30 ⭐ (selon badge) |

### Progression globale

```js
// Calcul : phonèmes + syllabes + mots + quiz + cycles
State.computeProgress() → pourcentage 0-100
```

---

## 11. Intégration reconnaissance vocale (à adapter pour Whisper)

### Interface attendue par le frontend

Le frontend appelle uniquement `Utils.recognize(expectedWords, timeoutMs, callback, onInterim)`.

Cette fonction doit :

1. **Démarrer** le micro (via `startBubbleMic()` qui initialise `_micStream` et `_micAnalyser`)
2. **Afficher** le canvas de forme d'onde (déjà géré par `startWaveform`)
3. **Enregistrer** l'audio (MediaRecorder sur `_micStream`)
4. **Détecter le silence** (via `_micAnalyser` — seuil RMS ~8)
5. **Envoyer** l'audio à ton endpoint Whisper : `POST /api/transcribe` avec le blob en body brut (`Content-Type: audio/webm`)
6. **Retourner** `{ recognized: string, success: boolean, quality: number }`
7. **Retourner** un objet `{ abort() }` synchroniquement pour que le bouton "Arrêter" fonctionne

### Endpoint Whisper attendu

```
POST /api/transcribe
Content-Type: audio/webm (ou audio/mp4, audio/ogg selon le navigateur)
Body: blob audio brut

Response 200: { "text": "ba" }
Response 4xx/5xx: { "error": "..." }
```

### Connexion barre d'onde ↔ enregistrement

**CRITIQUE** : Le `MediaRecorder` doit utiliser le même stream que `startBubbleMic()`.  
Ne jamais appeler `getUserMedia()` une 2ème fois — cela crée deux streams séparés et la barre d'onde reste morte.

```js
// Ordre correct :
await startBubbleMic();        // crée _micStream + _micAnalyser
const recorder = new MediaRecorder(_micStream, { mimeType });  // même stream
// startWaveform(canvas) lit déjà _micAnalyser → fonctionne automatiquement
```

---

## 12. Architecture JS

### Pattern IIFE

Chaque module est une IIFE qui expose une API publique :

```js
const Sons = (() => {
  // variables privées
  let _currentPanel = null;

  function openPhonemePanel(id) { ... }
  function closePhonemePanel() { ... }

  return { openPhonemePanel, closePhonemePanel, ... };
})();
```

### Ordre de chargement obligatoire

```html
<!-- 1. CDN externes -->
<script src="supabase-js CDN"></script>
<script src="responsivevoice CDN"></script>

<!-- 2. Config -->
<script src="js/supabase.js"></script>

<!-- 3. Données puis état -->
<script src="js/data.js"></script>
<script src="js/state.js"></script>
<script src="js/utils.js"></script>

<!-- 4. Modules dans l'ordre -->
<script src="js/sons.js"></script>
<script src="js/respiration.js"></script>
<script src="js/labiale.js"></script>
<script src="js/quiz.js"></script>
<script src="js/recompenses.js"></script>

<!-- 5. App en dernier -->
<script src="js/app.js"></script>
```

### État global (State)

```js
State.get('stars')           // nombre d'étoiles
State.set('stars', n)        // modifier
State.has('earnedBadges', k) // vérifier si badge gagné
State.push('earnedBadges', k) // ajouter badge
State.push('journal', entry) // ajouter entrée journal
State.get('completedPhonemes') // tableau d'IDs
State.computeProgress()      // calcule % global
```

### TTS

```js
Utils.speak("bonjour", () => console.log('fin'));
// Priorité : ResponsiveVoice (CDN) → SpeechSynthesis natif
// Langue : fr-FR, rate: 0.8, pitch: 1.0
```

---

## 13. Animations CSS (keyframes)

```css
@keyframes fadeUp   { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
@keyframes fadeDown { from { opacity:0; transform:translateY(-12px) } to { opacity:1; transform:translateY(0) } }
@keyframes popIn    { 0%{transform:scale(0.7);opacity:0} 70%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
@keyframes shake    { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
@keyframes breatheIn  { from{transform:scale(1)} to{transform:scale(1.4)} }
@keyframes breatheOut { from{transform:scale(1.4)} to{transform:scale(1)} }
@keyframes breatheHold{ 0%,100%{transform:scale(1.4)} }
@keyframes confettiFall { ... }
@keyframes bubble-rise  { 0%{bottom:-50px;opacity:0} 20%{opacity:0.6} 80%{opacity:0.3} 100%{bottom:110vh;opacity:0} }
```

---

## 14. Responsive design

Breakpoints :
- `max-width: 600px` : tabs en scroll horizontal, grille phonèmes 3 colonnes → 2, modal plein écran

Règles clés :
```css
@media (max-width: 600px) {
  .tabs { overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch; }
  .phoneme-grid { grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)); }
  .modal { width: 95vw; max-height: 90vh; overflow-y: auto; }
  .modal__body { flex-direction: column; }
}
```

---

## 15. Résumé des IDs DOM critiques

| ID | Rôle |
|---|---|
| `phonemeModal` | overlay modale phonème |
| `panelSymbol` | lettre/symbole du phonème (ex: A) |
| `panelExample` | mot exemple (ex: ARBRE) |
| `panelMouth` | conteneur diagramme bouche |
| `panelLSF` | conteneur image dactylologie |
| `panelHint` | consigne textuelle |
| `transcriptZone` | zone affichage ce que le micro a entendu |
| `transcriptText` | texte de la transcription |
| `transcriptLabel` | label au-dessus ("Tu as dit" / "J'entends...") |
| `waveCanvas` | canvas barre d'onde sons |
| `panelFeedback` | feedback reconnaissance (✓ ou ✗) |
| `panelRepeatBtn` | bouton "Je répète !" / "Arrêter" |
| `panelMarkDoneBtn` | bouton fallback manuel |
| `labialeRecordingZone` | zone enregistrement lecture labiale |
| `labialeTargetWord` | mot cible affiché pendant enregistrement |
| `labialeWaveCanvas` | canvas barre d'onde labiale |
| `labialeTranscriptZone` | zone transcript labiale |
| `labialeFeedback` | feedback labiale |
| `voyellesGrid` | grille voyelles injectée par sons.js |
| `consonnesContainer` | container groupes consonnes |
| `syllabesContainer` | container syllabes injecté par labiale.js |
| `motsContainer` | container mots |
| `quizContainer` | container quiz (remplacé par écran fin) |
| `badgesGrid` | grille badges |
| `journalLog` | liste entrées journal |
| `starsCount` | compteur étoiles header |
| `progressFill` | barre progression (width %) |
| `breathCircle` | cercle respiration cliquable |
| `breathLabel` | label phase respiration |
| `toast` | notification flottante |
