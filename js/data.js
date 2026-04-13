/* =============================================================
   DATA.JS — Données pédagogiques SonoBulle
   Modèle : ADDIE + classification phonologique française
============================================================= */

// ── VOYELLES ─────────────────────────────────────────────────
const VOYELLES = [
  {
    id: 'v-a', symbol: 'A', group: 'voyelles',
    example: 'ARBRE', hint: 'Ouvre grand la bouche, langue plate et basse.',
    mouthPos: 'wide-open', lsfLetter: 'A',
    testWords: ['a', 'ah', 'arbre', 'ha']
  },
  {
    id: 'v-e', symbol: 'E', group: 'voyelles',
    example: 'ÉCOLE', hint: 'Bouche entrouverte, position neutre des lèvres.',
    mouthPos: 'half-open', lsfLetter: 'E',
    testWords: ['e', 'eu', 'le', 'de', 'ce']
  },
  {
    id: 'v-ei', symbol: 'É', group: 'voyelles',
    example: 'ÉLÉPHANT', hint: 'Tire les coins des lèvres vers les oreilles.',
    mouthPos: 'spread', lsfLetter: 'E',
    testWords: ['é', 'et', 'aller', 'bébé']
  },
  {
    id: 'v-i', symbol: 'I', group: 'voyelles',
    example: 'ÎLE', hint: 'Lèvres très étirées, ouverture fine.',
    mouthPos: 'spread-tight', lsfLetter: 'I',
    testWords: ['i', 'il', 'si', 'ni', 'île']
  },
  {
    id: 'v-o', symbol: 'O', group: 'voyelles',
    example: 'OURS', hint: 'Arrondis les lèvres en cercle.',
    mouthPos: 'rounded-open', lsfLetter: 'O',
    testWords: ['o', 'oh', 'eau', 'au', 'or']
  },
  {
    id: 'v-u', symbol: 'U', group: 'voyelles',
    example: 'UNIVERS', hint: 'Lèvres en bisou, très serrées et avancées.',
    mouthPos: 'rounded-tight', lsfLetter: 'U',
    testWords: ['u', 'une', 'tu', 'du', 'lu']
  }
];

// ── CONSONNES PAR GROUPE ──────────────────────────────────────
const CONSONNES_GROUPS = [
  {
    groupId: 'bilabiales',
    label: 'Les Bilabiales',
    desc: 'Les deux lèvres se touchent pour former ces sons.',
    phonemes: [
      {
        id: 'c-p', symbol: 'P', group: 'bilabiales',
        example: 'PAPA', hint: 'Ferme les lèvres, puis ouvre d\'un coup avec souffle.',
        mouthPos: 'closed', lsfLetter: 'P',
        testWords: ['p', 'pa', 'papa', 'peu', 'pain']
      },
      {
        id: 'c-b', symbol: 'B', group: 'bilabiales',
        example: 'BÉBÉ', hint: 'Comme P mais la gorge vibre. Sens la vibration !',
        mouthPos: 'closed', lsfLetter: 'B',
        testWords: ['b', 'ba', 'bébé', 'bon', 'bien']
      },
      {
        id: 'c-m', symbol: 'M', group: 'bilabiales',
        example: 'MAMAN', hint: 'Lèvres fermées, laisse vibrer ta gorge. Mmm...',
        mouthPos: 'closed', lsfLetter: 'M',
        testWords: ['m', 'ma', 'maman', 'me', 'moi']
      }
    ]
  },
  {
    groupId: 'dentales',
    label: 'Les Dentales',
    desc: 'La langue touche les dents ou les alvéoles.',
    phonemes: [
      {
        id: 'c-t', symbol: 'T', group: 'dentales',
        example: 'TABLE', hint: 'Langue derrière les dents du haut, puis relâche.',
        mouthPos: 'dental', lsfLetter: 'T',
        testWords: ['t', 'ta', 'table', 'tu', 'te']
      },
      {
        id: 'c-d', symbol: 'D', group: 'dentales',
        example: 'DENT', hint: 'Comme T mais la gorge vibre.',
        mouthPos: 'dental', lsfLetter: 'D',
        testWords: ['d', 'da', 'dent', 'du', 'de']
      },
      {
        id: 'c-n', symbol: 'N', group: 'dentales',
        example: 'NID', hint: 'Langue collée derrière les dents, air par le nez.',
        mouthPos: 'dental', lsfLetter: 'N',
        testWords: ['n', 'na', 'nid', 'non', 'ni']
      }
    ]
  },
  {
    groupId: 'velaires',
    label: 'Les Vélaires',
    desc: 'Le dos de la langue monte vers le palais mou.',
    phonemes: [
      {
        id: 'c-k', symbol: 'K', group: 'velaires',
        example: 'CAKE', hint: 'Dos de la langue vers le haut-fond de la bouche.',
        mouthPos: 'velar', lsfLetter: 'K',
        testWords: ['k', 'ka', 'cake', 'cou', 'qui']
      },
      {
        id: 'c-g', symbol: 'G', group: 'velaires',
        example: 'GÂTEAU', hint: 'Comme K mais la gorge vibre.',
        mouthPos: 'velar', lsfLetter: 'G',
        testWords: ['g', 'ga', 'gâteau', 'gou', 'gui']
      }
    ]
  },
  {
    groupId: 'fricatives',
    label: 'Les Fricatives',
    desc: 'L\'air frotte contre un obstacle pour créer le son.',
    phonemes: [
      {
        id: 'c-f', symbol: 'F', group: 'fricatives',
        example: 'FLEUR', hint: 'Dents du haut sur la lèvre inférieure, souffle doucement.',
        mouthPos: 'labiodental', lsfLetter: 'F',
        testWords: ['f', 'fa', 'fleur', 'feu', 'fin']
      },
      {
        id: 'c-v', symbol: 'V', group: 'fricatives',
        example: 'VÉLO', hint: 'Comme F mais la gorge vibre, sens les dents vibrer !',
        mouthPos: 'labiodental', lsfLetter: 'V',
        testWords: ['v', 'va', 'vélo', 'vu', 'vie']
      },
      {
        id: 'c-s', symbol: 'S', group: 'fricatives',
        example: 'SOLEIL', hint: 'Langue derrière les dents, dents quasi-fermées, siffle.',
        mouthPos: 'alveolar', lsfLetter: 'S',
        testWords: ['s', 'sa', 'soleil', 'si', 'su']
      },
      {
        id: 'c-z', symbol: 'Z', group: 'fricatives',
        example: 'ZÈBRE', hint: 'Comme S mais la gorge vibre.',
        mouthPos: 'alveolar', lsfLetter: 'Z',
        testWords: ['z', 'za', 'zèbre', 'zéro', 'zoo']
      },
      {
        id: 'c-ch', symbol: 'CH', group: 'fricatives',
        example: 'CHAT', hint: 'Lèvres légèrement arrondies, langue au milieu. Chuuut !',
        mouthPos: 'postalveolar', lsfLetter: 'C',
        testWords: ['ch', 'cha', 'chat', 'choux', 'che']
      },
      {
        id: 'c-j', symbol: 'J', group: 'fricatives',
        example: 'JOUR', hint: 'Comme CH mais la gorge vibre.',
        mouthPos: 'postalveolar', lsfLetter: 'J',
        testWords: ['j', 'ja', 'jour', 'je', 'jeu']
      }
    ]
  },
  {
    groupId: 'liquides',
    label: 'Les Liquides',
    desc: 'Sons coulants, la langue fait un mouvement fluide.',
    phonemes: [
      {
        id: 'c-l', symbol: 'L', group: 'liquides',
        example: 'LUNE', hint: 'Bout de la langue derrière les dents du haut, voix ON.',
        mouthPos: 'lateral', lsfLetter: 'L',
        testWords: ['l', 'la', 'lune', 'le', 'li']
      },
      {
        id: 'c-r', symbol: 'R', group: 'liquides',
        example: 'ROBOT', hint: 'Gorge vibrante, comme si tu faisais un gargarisme.',
        mouthPos: 'rhotic', lsfLetter: 'R',
        testWords: ['r', 'ra', 'robot', 're', 'rue']
      }
    ]
  },
  {
    groupId: 'nasales',
    label: 'Les Nasales',
    desc: 'L\'air passe par le nez pour résonner.',
    phonemes: [
      {
        id: 'c-mn', symbol: 'M', group: 'nasales',
        example: 'MOUTON', hint: 'Lèvres fermées, l\'air sort par le nez. Mmmm...',
        mouthPos: 'closed', lsfLetter: 'M',
        testWords: ['m', 'ma', 'mouton', 'mou', 'mi']
      },
      {
        id: 'c-nn', symbol: 'N', group: 'nasales',
        example: 'NUAGE', hint: 'Langue aux dents, l\'air sort par le nez. Nnnn...',
        mouthPos: 'dental', lsfLetter: 'N',
        testWords: ['n', 'na', 'nuage', 'nu', 'ne']
      }
    ]
  }
];

// Liste plate de tous les phonèmes pour usage interne
const ALL_PHONEMES = [
  ...VOYELLES,
  ...CONSONNES_GROUPS.flatMap(g => g.phonemes)
];

// ── SYLLABES (LECTURE LABIALE) ────────────────────────────────
const SYLLABES_GROUPS = [
  {
    base: 'B',
    items: [
      { id:'syl-ba', text:'BA', mouthPos:'closed',        lsfLetter:'B', testWords:['ba','bas','bar'] },
      { id:'syl-be', text:'BÈ', mouthPos:'half-open',     lsfLetter:'B', testWords:['bè','bé','belle'] },
      { id:'syl-bi', text:'BI', mouthPos:'spread-tight',  lsfLetter:'B', testWords:['bi','bis','bit'] },
      { id:'syl-bo', text:'BO', mouthPos:'rounded-open',  lsfLetter:'B', testWords:['bo','bon','bof'] },
      { id:'syl-bu', text:'BU', mouthPos:'rounded-tight', lsfLetter:'B', testWords:['bu','bus','but'] }
    ]
  },
  {
    base: 'P',
    items: [
      { id:'syl-pa', text:'PA', mouthPos:'closed',        lsfLetter:'P', testWords:['pa','pas','par'] },
      { id:'syl-pe', text:'PÈ', mouthPos:'half-open',     lsfLetter:'P', testWords:['pè','père','per'] },
      { id:'syl-pi', text:'PI', mouthPos:'spread-tight',  lsfLetter:'P', testWords:['pi','pic','pie'] },
      { id:'syl-po', text:'PO', mouthPos:'rounded-open',  lsfLetter:'P', testWords:['po','pot','pop'] },
      { id:'syl-pu', text:'PU', mouthPos:'rounded-tight', lsfLetter:'P', testWords:['pu','pur','pub'] }
    ]
  },
  {
    base: 'M',
    items: [
      { id:'syl-ma', text:'MA', mouthPos:'closed',        lsfLetter:'M', testWords:['ma','mais','mar'] },
      { id:'syl-mi', text:'MI', mouthPos:'spread-tight',  lsfLetter:'M', testWords:['mi','mis','mie'] },
      { id:'syl-mu', text:'MU', mouthPos:'rounded-tight', lsfLetter:'M', testWords:['mu','mur','mut'] },
      { id:'syl-me', text:'MÈ', mouthPos:'half-open',     lsfLetter:'M', testWords:['mè','mère','mes'] },
      { id:'syl-mo', text:'MO', mouthPos:'rounded-open',  lsfLetter:'M', testWords:['mo','mot','mob'] }
    ]
  },
  {
    base: 'T',
    items: [
      { id:'syl-ta', text:'TA', mouthPos:'dental',        lsfLetter:'T', testWords:['ta','tas','tar'] },
      { id:'syl-te', text:'TÈ', mouthPos:'half-open',     lsfLetter:'T', testWords:['tè','tête','tel'] },
      { id:'syl-ti', text:'TI', mouthPos:'spread-tight',  lsfLetter:'T', testWords:['ti','tic','tir'] },
      { id:'syl-to', text:'TO', mouthPos:'rounded-open',  lsfLetter:'T', testWords:['to','toc','ton'] },
      { id:'syl-tu', text:'TU', mouthPos:'rounded-tight', lsfLetter:'T', testWords:['tu','tus','tur'] }
    ]
  },
  {
    base: 'D',
    items: [
      { id:'syl-da', text:'DA', mouthPos:'dental',        lsfLetter:'D', testWords:['da','dame','dar'] },
      { id:'syl-de', text:'DÈ', mouthPos:'half-open',     lsfLetter:'D', testWords:['dè','des','de'] },
      { id:'syl-di', text:'DI', mouthPos:'spread-tight',  lsfLetter:'D', testWords:['di','dit','dis'] },
      { id:'syl-do', text:'DO', mouthPos:'rounded-open',  lsfLetter:'D', testWords:['do','dos','don'] },
      { id:'syl-du', text:'DU', mouthPos:'rounded-tight', lsfLetter:'D', testWords:['du','duc','dut'] }
    ]
  },
  {
    base: 'N',
    items: [
      { id:'syl-na', text:'NA', mouthPos:'dental',        lsfLetter:'N', testWords:['na','nage','nar'] },
      { id:'syl-ne', text:'NÈ', mouthPos:'half-open',     lsfLetter:'N', testWords:['nè','net','né'] },
      { id:'syl-ni', text:'NI', mouthPos:'spread-tight',  lsfLetter:'N', testWords:['ni','nid','nif'] },
      { id:'syl-no', text:'NO', mouthPos:'rounded-open',  lsfLetter:'N', testWords:['no','non','nor'] },
      { id:'syl-nu', text:'NU', mouthPos:'rounded-tight', lsfLetter:'N', testWords:['nu','nuit','nul'] }
    ]
  },
  {
    base: 'K',
    items: [
      { id:'syl-ka', text:'KA', mouthPos:'velar',         lsfLetter:'K', testWords:['ka','cas','car'] },
      { id:'syl-ke', text:'KÈ', mouthPos:'half-open',     lsfLetter:'K', testWords:['kè','quête','quel'] },
      { id:'syl-ki', text:'KI', mouthPos:'spread-tight',  lsfLetter:'K', testWords:['ki','qui','kir'] },
      { id:'syl-ko', text:'KO', mouthPos:'rounded-open',  lsfLetter:'K', testWords:['ko','cou','col'] },
      { id:'syl-ku', text:'KU', mouthPos:'rounded-tight', lsfLetter:'K', testWords:['ku','cure','cul'] }
    ]
  },
  {
    base: 'G',
    items: [
      { id:'syl-ga', text:'GA', mouthPos:'velar',         lsfLetter:'G', testWords:['ga','gare','gaz'] },
      { id:'syl-ge', text:'GÈ', mouthPos:'half-open',     lsfLetter:'G', testWords:['gè','gel','gêne'] },
      { id:'syl-gi', text:'GI', mouthPos:'spread-tight',  lsfLetter:'G', testWords:['gi','gîte','gif'] },
      { id:'syl-go', text:'GO', mouthPos:'rounded-open',  lsfLetter:'G', testWords:['go','gout','got'] },
      { id:'syl-gu', text:'GU', mouthPos:'rounded-tight', lsfLetter:'G', testWords:['gu','gus','guy'] }
    ]
  },
  {
    base: 'F',
    items: [
      { id:'syl-fa', text:'FA', mouthPos:'labiodental',   lsfLetter:'F', testWords:['fa','face','fat'] },
      { id:'syl-fe', text:'FÈ', mouthPos:'labiodental',   lsfLetter:'F', testWords:['fè','fête','fée'] },
      { id:'syl-fi', text:'FI', mouthPos:'labiodental',   lsfLetter:'F', testWords:['fi','fil','fin'] },
      { id:'syl-fo', text:'FO', mouthPos:'labiodental',   lsfLetter:'F', testWords:['fo','fond','for'] },
      { id:'syl-fu', text:'FU', mouthPos:'labiodental',   lsfLetter:'F', testWords:['fu','fus','fut'] }
    ]
  },
  {
    base: 'V',
    items: [
      { id:'syl-va', text:'VA', mouthPos:'labiodental',   lsfLetter:'V', testWords:['va','vase','var'] },
      { id:'syl-ve', text:'VÈ', mouthPos:'labiodental',   lsfLetter:'V', testWords:['vè','ver','verre'] },
      { id:'syl-vi', text:'VI', mouthPos:'labiodental',   lsfLetter:'V', testWords:['vi','vie','vis'] },
      { id:'syl-vo', text:'VO', mouthPos:'labiodental',   lsfLetter:'V', testWords:['vo','voir','vos'] },
      { id:'syl-vu', text:'VU', mouthPos:'labiodental',   lsfLetter:'V', testWords:['vu','vue','vus'] }
    ]
  },
  {
    base: 'S',
    items: [
      { id:'syl-sa', text:'SA', mouthPos:'alveolar',      lsfLetter:'S', testWords:['sa','sac','sal'] },
      { id:'syl-se', text:'SE', mouthPos:'alveolar',      lsfLetter:'S', testWords:['se','sel','ses'] },
      { id:'syl-si', text:'SI', mouthPos:'alveolar',      lsfLetter:'S', testWords:['si','sis','sir'] },
      { id:'syl-so', text:'SO', mouthPos:'alveolar',      lsfLetter:'S', testWords:['so','son','sol'] },
      { id:'syl-su', text:'SU', mouthPos:'alveolar',      lsfLetter:'S', testWords:['su','sur','sus'] }
    ]
  },
  {
    base: 'Z',
    items: [
      { id:'syl-za', text:'ZA', mouthPos:'alveolar',      lsfLetter:'Z', testWords:['za','zap','zag'] },
      { id:'syl-ze', text:'ZE', mouthPos:'alveolar',      lsfLetter:'Z', testWords:['ze','zèbre','zest'] },
      { id:'syl-zi', text:'ZI', mouthPos:'alveolar',      lsfLetter:'Z', testWords:['zi','zinc','zig'] },
      { id:'syl-zo', text:'ZO', mouthPos:'alveolar',      lsfLetter:'Z', testWords:['zo','zoo','zone'] },
      { id:'syl-zu', text:'ZU', mouthPos:'alveolar',      lsfLetter:'Z', testWords:['zu','zut','zum'] }
    ]
  },
  {
    base: 'CH',
    items: [
      { id:'syl-cha', text:'CHA', mouthPos:'postalveolar', lsfLetter:'C', testWords:['cha','chat','char'] },
      { id:'syl-che', text:'CHE', mouthPos:'postalveolar', lsfLetter:'C', testWords:['che','chef','cher'] },
      { id:'syl-chi', text:'CHI', mouthPos:'postalveolar', lsfLetter:'C', testWords:['chi','chic','chien'] },
      { id:'syl-cho', text:'CHO', mouthPos:'postalveolar', lsfLetter:'C', testWords:['cho','choux','choc'] },
      { id:'syl-chu', text:'CHU', mouthPos:'postalveolar', lsfLetter:'C', testWords:['chu','chut','chute'] }
    ]
  },
  {
    base: 'J',
    items: [
      { id:'syl-ja', text:'JA', mouthPos:'postalveolar',  lsfLetter:'J', testWords:['ja','jardin','jar'] },
      { id:'syl-je', text:'JE', mouthPos:'postalveolar',  lsfLetter:'J', testWords:['je','jeu','jet'] },
      { id:'syl-ji', text:'JI', mouthPos:'postalveolar',  lsfLetter:'J', testWords:['ji','jis','jif'] },
      { id:'syl-jo', text:'JO', mouthPos:'postalveolar',  lsfLetter:'J', testWords:['jo','joli','job'] },
      { id:'syl-ju', text:'JU', mouthPos:'postalveolar',  lsfLetter:'J', testWords:['ju','jus','jupe'] }
    ]
  },
  {
    base: 'L',
    items: [
      { id:'syl-la', text:'LA', mouthPos:'lateral',       lsfLetter:'L', testWords:['la','lac','las'] },
      { id:'syl-le', text:'LE', mouthPos:'lateral',       lsfLetter:'L', testWords:['le','les','leur'] },
      { id:'syl-li', text:'LI', mouthPos:'lateral',       lsfLetter:'L', testWords:['li','lit','lien'] },
      { id:'syl-lo', text:'LO', mouthPos:'lateral',       lsfLetter:'L', testWords:['lo','lot','long'] },
      { id:'syl-lu', text:'LU', mouthPos:'lateral',       lsfLetter:'L', testWords:['lu','lus','lune'] }
    ]
  },
  {
    base: 'R',
    items: [
      { id:'syl-ra', text:'RA', mouthPos:'rhotic',        lsfLetter:'R', testWords:['ra','rat','ras'] },
      { id:'syl-re', text:'RE', mouthPos:'rhotic',        lsfLetter:'R', testWords:['re','ré','rêve'] },
      { id:'syl-ri', text:'RI', mouthPos:'rhotic',        lsfLetter:'R', testWords:['ri','rit','riz'] },
      { id:'syl-ro', text:'RO', mouthPos:'rhotic',        lsfLetter:'R', testWords:['ro','roi','ros'] },
      { id:'syl-ru', text:'RU', mouthPos:'rhotic',        lsfLetter:'R', testWords:['ru','rue','rut'] }
    ]
  }
];

// ── MOTS (LECTURE LABIALE) ────────────────────────────────────
const MOTS = [
  // Mots simples répétitifs (pour débutants)
  { id:'mot-baba',  text:'BABA',   category:'Premiers mots', mouthPos:'closed',        lsfLetter:'B', testWords:['baba','ba ba'] },
  { id:'mot-dada',  text:'DADA',   category:'Premiers mots', mouthPos:'dental',        lsfLetter:'D', testWords:['dada','da da'] },
  { id:'mot-dudu',  text:'DUDU',   category:'Premiers mots', mouthPos:'rounded-tight', lsfLetter:'D', testWords:['dudu','du du'] },
  { id:'mot-fafa',  text:'FAFA',   category:'Premiers mots', mouthPos:'labiodental',   lsfLetter:'F', testWords:['fafa','fa fa'] },
  { id:'mot-pipi',  text:'PIPI',   category:'Premiers mots', mouthPos:'spread-tight',  lsfLetter:'P', testWords:['pipi','pi pi'] },
  { id:'mot-nani',  text:'NANI',   category:'Premiers mots', mouthPos:'dental',        lsfLetter:'N', testWords:['nani','na ni'] },
  { id:'mot-tata',  text:'TATA',   category:'Premiers mots', mouthPos:'dental',        lsfLetter:'T', testWords:['tata','ta ta'] },
  { id:'mot-dolo',  text:'DOLO',   category:'Premiers mots', mouthPos:'dental',        lsfLetter:'D', testWords:['dolo','do lo'] },
  { id:'mot-toto',  text:'TOTO',   category:'Premiers mots', mouthPos:'dental',        lsfLetter:'T', testWords:['toto','to to'] },
  // Famille
  { id:'mot-papa',  text:'PAPA',   category:'Famille',       mouthPos:'closed',        lsfLetter:'P', testWords:['papa','pa pa'] },
  { id:'mot-maman', text:'MAMAN',  category:'Famille',       mouthPos:'closed',        lsfLetter:'M', testWords:['maman','ma man'] },
  { id:'mot-manou', text:'MANOU',  category:'Famille',       mouthPos:'closed',        lsfLetter:'M', testWords:['manou','ma nou'] },
  // Verbes et mots courants
  { id:'mot-tape',  text:'TAPE',   category:'Actions',       mouthPos:'dental',        lsfLetter:'T', testWords:['tape','taper'] },
  { id:'mot-je',    text:'JE',     category:'Pronoms',       mouthPos:'postalveolar',  lsfLetter:'J', testWords:['je','jeu'] },
  { id:'mot-bonne', text:'BONNE',  category:'Adjectifs',     mouthPos:'closed',        lsfLetter:'B', testWords:['bonne','bon'] },
  { id:'mot-choux', text:'CHOUX',  category:'Nourriture',    mouthPos:'postalveolar',  lsfLetter:'C', testWords:['choux','chou'] },
  // Mots de la vie quotidienne
  { id:'mot-bonjour', text:'BONJOUR', category:'Salutations', mouthPos:'closed',       lsfLetter:'B', testWords:['bonjour','bon jour'] },
  { id:'mot-merci',   text:'MERCI',   category:'Politesse',   mouthPos:'closed',       lsfLetter:'M', testWords:['merci','mer ci'] },
  { id:'mot-eau',     text:'EAU',     category:'Quotidien',   mouthPos:'rounded-open', lsfLetter:'O', testWords:['eau','o'] },
  { id:'mot-pain',    text:'PAIN',    category:'Nourriture',  mouthPos:'closed',       lsfLetter:'P', testWords:['pain','pan'] },
  { id:'mot-chat',    text:'CHAT',    category:'Animaux',     mouthPos:'postalveolar', lsfLetter:'C', testWords:['chat','cha'] },
  { id:'mot-oui',     text:'OUI',     category:'Réponses',    mouthPos:'rounded-open', lsfLetter:'O', testWords:['oui','wi'] },
  { id:'mot-non',     text:'NON',     category:'Réponses',    mouthPos:'dental',       lsfLetter:'N', testWords:['non','no'] },
  { id:'mot-aide',    text:'AIDE',    category:'Important',   mouthPos:'wide-open',    lsfLetter:'A', testWords:['aide','ed'] },
  { id:'mot-ami',     text:'AMI',     category:'Amitié',      mouthPos:'wide-open',    lsfLetter:'A', testWords:['ami','a mi'] }
];

// ── QUIZ ──────────────────────────────────────────────────────
const QUIZ_DATA = [
  {
    id: 'q1',
    q: 'Quelle forme prennent les lèvres pour le son "O" ?',
    img: 'rounded-open', // référence à un diagramme SVG
    options: ['En cercle arrondi', 'En grand sourire', 'Fermées complètement', 'Dents sur la lèvre'],
    correct: 0,
    explanation: 'Pour le O, on arrondit les lèvres comme un cercle parfait.'
  },
  {
    id: 'q2',
    q: 'Pour dire "M", que font les lèvres ?',
    img: 'closed',
    options: ['Elles s\'ouvrent grand', 'Elles se ferment complètement', 'Elles s\'étirent', 'La langue sort'],
    correct: 1,
    explanation: 'Les lèvres se ferment complètement et l\'air passe par le nez.'
  },
  {
    id: 'q3',
    q: 'Quel son se prononce avec un grand sourire ?',
    img: 'spread-tight',
    options: ['O', 'U', 'I', 'A'],
    correct: 2,
    explanation: 'Pour le I, on étire les lèvres comme un grand sourire.'
  },
  {
    id: 'q4',
    q: 'Pour sentir les vibrations, où pose-t-on la main ?',
    img: null,
    options: ['Sur la tête', 'Sur la gorge', 'Sur le ventre', 'Sur les lèvres'],
    correct: 1,
    explanation: 'La gorge vibre pour les sons voisés (b, d, v, z, etc.).'
  },
  {
    id: 'q5',
    q: 'Quel son se fait avec les dents sur la lèvre inférieure ?',
    img: 'labiodental',
    options: ['P', 'M', 'F', 'L'],
    correct: 2,
    explanation: 'Le F (et V) se forme avec les dents du haut sur la lèvre du bas.'
  },
  {
    id: 'q6',
    q: 'Les sons B, P et M appartiennent à quel groupe ?',
    img: null,
    options: ['Fricatives', 'Dentales', 'Bilabiales', 'Vélaires'],
    correct: 2,
    explanation: 'B, P et M sont des bilabiales : les deux lèvres se touchent.'
  },
  {
    id: 'q7',
    q: 'Pour le son "CH" (comme dans CHAT), les lèvres sont :',
    img: 'postalveolar',
    options: ['Très ouvertes', 'Légèrement arrondies', 'Complètement fermées', 'Étirées en sourire'],
    correct: 1,
    explanation: 'Pour CH, on arrondit légèrement les lèvres et on fait passer l\'air.'
  },
  {
    id: 'q8',
    q: 'Quelle syllabe commence par une bilabiale ?',
    img: null,
    options: ['SI', 'LA', 'BA', 'RA'],
    correct: 2,
    explanation: 'BA commence par B, une consonne bilabiale (lèvres qui se touchent).'
  }
];

// ── BADGES ────────────────────────────────────────────────────
const BADGES_DATA = [
  { key:'first_sound',    icon:'fa-play',       name:'Premier Son',      desc:'Clique sur un son pour la première fois',       stars: 0 },
  { key:'all_vowels',     icon:'fa-star',       name:'Maître Voyelles',  desc:'Pratique toutes les voyelles',                  stars: 20 },
  { key:'all_bilabiales', icon:'fa-comment',     name:'Levres d\'or',     desc:'Pratique toutes les bilabiales',                stars: 15 },
  { key:'breathing_done', icon:'fa-wind',       name:'Grand Souffleur',  desc:'Complète 5 cycles de respiration',              stars: 15 },
  { key:'quiz_perfect',   icon:'fa-trophy',     name:'Quiz Parfait',     desc:'8/8 au quiz',                                   stars: 30 },
  { key:'quiz_done',      icon:'fa-check',      name:'Quiz Complété',    desc:'Termine le quiz',                               stars: 10 },
  { key:'lips_syllables', icon:'fa-eye',        name:'Syllabes Maître',  desc:'15 syllabes en lecture labiale',                stars: 20 },
  { key:'lips_words',     icon:'fa-comment',    name:'Lecteur Expert',   desc:'15 mots en lecture labiale',                    stars: 25 },
  { key:'stars_50',       icon:'fa-certificate','name':'Étoile Montante', desc:'50 étoiles collectées',                        stars: 0  },
  { key:'stars_100',      icon:'fa-award',      name:'Super Étoile',     desc:'100 étoiles collectées',                        stars: 0  }
];
