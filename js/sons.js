/* =============================================================
   SONS.JS — Module Sons : phonèmes, diagrammes, LSF, correction
============================================================= */

const Sons = (() => {

  // ── DIAGRAMMES DE BOUCHE (SVG inline) ────────────────────
  // Chaque SVG montre la position des lèvres, dents et langue.
  // Viewbox : 220 x 150. Couleurs neutres sur fond blanc.

  const MOUTH_SVG = {

    'wide-open': `
      <svg viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg"
           stroke-linecap="round" stroke-linejoin="round">
        <!-- Lèvre supérieure -->
        <path d="M35 48 C75 28 145 28 185 48" stroke="#3A3530" stroke-width="3"/>
        <path d="M35 48 C75 56 145 56 185 48" stroke="#3A3530" stroke-width="2"/>
        <!-- Lèvre inférieure -->
        <path d="M35 108 C75 122 145 122 185 108" stroke="#3A3530" stroke-width="3"/>
        <path d="M35 108 C75 100 145 100 185 108" stroke="#3A3530" stroke-width="2"/>
        <!-- Coins -->
        <path d="M35 48 L35 108" stroke="#3A3530" stroke-width="2"/>
        <path d="M185 48 L185 108" stroke="#3A3530" stroke-width="2"/>
        <!-- Dents supérieures -->
        <rect x="48" y="56" width="124" height="16" rx="3" fill="#F8F6F2" stroke="#AAA" stroke-width="1.5"/>
        <line x1="68" y1="56" x2="68" y2="72" stroke="#CCC" stroke-width="1"/>
        <line x1="86" y1="56" x2="86" y2="72" stroke="#CCC" stroke-width="1"/>
        <line x1="104" y1="56" x2="104" y2="72" stroke="#CCC" stroke-width="1"/>
        <line x1="122" y1="56" x2="122" y2="72" stroke="#CCC" stroke-width="1"/>
        <line x1="140" y1="56" x2="140" y2="72" stroke="#CCC" stroke-width="1"/>
        <line x1="158" y1="56" x2="158" y2="72" stroke="#CCC" stroke-width="1"/>
        <!-- Dents inférieures -->
        <rect x="48" y="82" width="124" height="16" rx="3" fill="#F8F6F2" stroke="#AAA" stroke-width="1.5"/>
        <line x1="68" y1="82" x2="68" y2="98" stroke="#CCC" stroke-width="1"/>
        <line x1="86" y1="82" x2="86" y2="98" stroke="#CCC" stroke-width="1"/>
        <line x1="104" y1="82" x2="104" y2="98" stroke="#CCC" stroke-width="1"/>
        <line x1="122" y1="82" x2="122" y2="98" stroke="#CCC" stroke-width="1"/>
        <line x1="140" y1="82" x2="140" y2="98" stroke="#CCC" stroke-width="1"/>
        <line x1="158" y1="82" x2="158" y2="98" stroke="#CCC" stroke-width="1"/>
        <!-- Langue basse -->
        <path d="M58 98 Q110 118 162 98" fill="#C89090" stroke="#9A6060" stroke-width="1.5"/>
        <!-- Label -->
        <text x="110" y="142" text-anchor="middle" font-size="11" fill="#7A7570" font-family="sans-serif">Bouche grande ouverte — /a/</text>
      </svg>`,

    'half-open': `
      <svg viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M40 60 C80 48 140 48 180 60" stroke="#3A3530" stroke-width="3"/>
        <path d="M40 60 C80 66 140 66 180 60" stroke="#3A3530" stroke-width="2"/>
        <path d="M40 90 C80 100 140 100 180 90" stroke="#3A3530" stroke-width="3"/>
        <path d="M40 90 C80 85 140 85 180 90" stroke="#3A3530" stroke-width="2"/>
        <path d="M40 60 L40 90" stroke="#3A3530" stroke-width="2"/>
        <path d="M180 60 L180 90" stroke="#3A3530" stroke-width="2"/>
        <!-- Dents sup légèrement visibles -->
        <rect x="55" y="66" width="110" height="10" rx="2" fill="#F8F6F2" stroke="#CCC" stroke-width="1"/>
        <line x1="72" y1="66" x2="72" y2="76" stroke="#DDD" stroke-width="1"/>
        <line x1="88" y1="66" x2="88" y2="76" stroke="#DDD" stroke-width="1"/>
        <line x1="104" y1="66" x2="104" y2="76" stroke="#DDD" stroke-width="1"/>
        <line x1="120" y1="66" x2="120" y2="76" stroke="#DDD" stroke-width="1"/>
        <line x1="136" y1="66" x2="136" y2="76" stroke="#DDD" stroke-width="1"/>
        <text x="110" y="142" text-anchor="middle" font-size="11" fill="#7A7570" font-family="sans-serif">Mi-ouverte, position neutre — /e/</text>
      </svg>`,

    'spread': `
      <svg viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg"
           stroke-linecap="round" stroke-linejoin="round">
        <!-- Lèvres très étirées en sourire -->
        <path d="M20 68 C60 52 160 52 200 68" stroke="#3A3530" stroke-width="3"/>
        <path d="M20 68 C60 72 160 72 200 68" stroke="#3A3530" stroke-width="2"/>
        <path d="M20 82 C60 92 160 92 200 82" stroke="#3A3530" stroke-width="3"/>
        <path d="M20 82 C60 78 160 78 200 82" stroke="#3A3530" stroke-width="2"/>
        <path d="M20 68 L20 82" stroke="#3A3530" stroke-width="2"/>
        <path d="M200 68 L200 82" stroke="#3A3530" stroke-width="2"/>
        <!-- Dents bien visibles -->
        <rect x="38" y="72" width="144" height="10" rx="2" fill="#F8F6F2" stroke="#BBB" stroke-width="1.5"/>
        <line x1="58"  y1="72" x2="58"  y2="82" stroke="#CCC" stroke-width="1"/>
        <line x1="76"  y1="72" x2="76"  y2="82" stroke="#CCC" stroke-width="1"/>
        <line x1="94"  y1="72" x2="94"  y2="82" stroke="#CCC" stroke-width="1"/>
        <line x1="112" y1="72" x2="112" y2="82" stroke="#CCC" stroke-width="1"/>
        <line x1="130" y1="72" x2="130" y2="82" stroke="#CCC" stroke-width="1"/>
        <line x1="148" y1="72" x2="148" y2="82" stroke="#CCC" stroke-width="1"/>
        <line x1="166" y1="72" x2="166" y2="82" stroke="#CCC" stroke-width="1"/>
        <!-- Flèches étirement -->
        <path d="M12 75 L4 75" stroke="#B85C38" stroke-width="1.5" marker-end="url(#arr)"/>
        <path d="M208 75 L216 75" stroke="#B85C38" stroke-width="1.5"/>
        <text x="110" y="142" text-anchor="middle" font-size="11" fill="#7A7570" font-family="sans-serif">Lèvres etirées en sourire — /é/</text>
      </svg>`,

    'spread-tight': `
      <svg viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 70 C60 55 160 55 205 70" stroke="#3A3530" stroke-width="3"/>
        <path d="M15 70 C60 73 160 73 205 70" stroke="#3A3530" stroke-width="2"/>
        <path d="M15 80 C60 90 160 90 205 80" stroke="#3A3530" stroke-width="3"/>
        <path d="M15 80 C60 77 160 77 205 80" stroke="#3A3530" stroke-width="2"/>
        <path d="M15 70 L15 80" stroke="#3A3530" stroke-width="2"/>
        <path d="M205 70 L205 80" stroke="#3A3530" stroke-width="2"/>
        <rect x="38" y="73" width="144" height="7" rx="2" fill="#F8F6F2" stroke="#BBB" stroke-width="1"/>
        <line x1="60"  y1="73" x2="60"  y2="80" stroke="#CCC" stroke-width="1"/>
        <line x1="80"  y1="73" x2="80"  y2="80" stroke="#CCC" stroke-width="1"/>
        <line x1="100" y1="73" x2="100" y2="80" stroke="#CCC" stroke-width="1"/>
        <line x1="120" y1="73" x2="120" y2="80" stroke="#CCC" stroke-width="1"/>
        <line x1="140" y1="73" x2="140" y2="80" stroke="#CCC" stroke-width="1"/>
        <line x1="160" y1="73" x2="160" y2="80" stroke="#CCC" stroke-width="1"/>
        <text x="110" y="142" text-anchor="middle" font-size="11" fill="#7A7570" font-family="sans-serif">Etirement maximal, ouverture fine — /i/</text>
      </svg>`,

    'rounded-open': `
      <svg viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg"
           stroke-linecap="round" stroke-linejoin="round">
        <!-- Bouche en O moyen -->
        <ellipse cx="110" cy="80" rx="42" ry="30" stroke="#3A3530" stroke-width="3" fill="white"/>
        <!-- Lèvre sup plus épaisse -->
        <path d="M68 80 C85 62 135 62 152 80" stroke="#3A3530" stroke-width="2.5"/>
        <!-- Lèvre inf plus épaisse -->
        <path d="M68 80 C85 98 135 98 152 80" stroke="#3A3530" stroke-width="2.5"/>
        <!-- Intérieur de bouche -->
        <ellipse cx="110" cy="80" rx="30" ry="20" fill="#E8D0C8" stroke="none"/>
        <!-- Indication arrondissement -->
        <text x="110" y="142" text-anchor="middle" font-size="11" fill="#7A7570" font-family="sans-serif">Lèvres arrondies, ouverture moyenne — /o/</text>
      </svg>`,

    'rounded-tight': `
      <svg viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg"
           stroke-linecap="round" stroke-linejoin="round">
        <!-- Bouche en O très petit, lèvres projetées -->
        <ellipse cx="110" cy="80" rx="22" ry="18" stroke="#3A3530" stroke-width="3.5" fill="white"/>
        <path d="M88 80 C96 66 124 66 132 80" stroke="#3A3530" stroke-width="3"/>
        <path d="M88 80 C96 94 124 94 132 80" stroke="#3A3530" stroke-width="3"/>
        <!-- Projection vers l'avant (flèches) -->
        <path d="M110 50 L110 44" stroke="#B85C38" stroke-width="1.5"/>
        <path d="M110 110 L110 116" stroke="#B85C38" stroke-width="1.5"/>
        <ellipse cx="110" cy="80" rx="13" ry="11" fill="#E8D0C8"/>
        <text x="110" y="142" text-anchor="middle" font-size="11" fill="#7A7570" font-family="sans-serif">Lèvres en bisou, très serrees — /u/</text>
      </svg>`,

    'closed': `
      <svg viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg"
           stroke-linecap="round" stroke-linejoin="round">
        <!-- Lèvres fermées -->
        <path d="M40 72 C80 60 140 60 180 72" stroke="#3A3530" stroke-width="3"/>
        <path d="M40 72 C80 76 140 76 180 72" stroke="#3A3530" stroke-width="2"/>
        <!-- Ligne de fermeture -->
        <path d="M42 74 C80 78 140 78 178 74" stroke="#3A3530" stroke-width="2.5"/>
        <!-- Lèvre inférieure -->
        <path d="M40 74 C80 92 140 92 180 74" stroke="#3A3530" stroke-width="3"/>
        <path d="M40 74 C80 80 140 80 180 74" stroke="#3A3530" stroke-width="2"/>
        <!-- Flèche fermeture -->
        <path d="M110 50 L110 66" stroke="#B85C38" stroke-width="1.5" stroke-dasharray="3,2"/>
        <path d="M110 100 L110 86" stroke="#B85C38" stroke-width="1.5" stroke-dasharray="3,2"/>
        <text x="110" y="142" text-anchor="middle" font-size="11" fill="#7A7570" font-family="sans-serif">Lèvres fermées — /p/ /b/ /m/</text>
      </svg>`,

    'labiodental': `
      <svg viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg"
           stroke-linecap="round" stroke-linejoin="round">
        <!-- Lèvre supérieure -->
        <path d="M40 58 C80 46 140 46 180 58" stroke="#3A3530" stroke-width="3"/>
        <path d="M40 58 C80 64 140 64 180 58" stroke="#3A3530" stroke-width="2"/>
        <!-- Dents supérieures bien visibles -->
        <rect x="52" y="64" width="116" height="14" rx="3" fill="#F8F6F2" stroke="#AAA" stroke-width="1.5"/>
        <line x1="70"  y1="64" x2="70"  y2="78" stroke="#CCC" stroke-width="1"/>
        <line x1="86"  y1="64" x2="86"  y2="78" stroke="#CCC" stroke-width="1"/>
        <line x1="102" y1="64" x2="102" y2="78" stroke="#CCC" stroke-width="1"/>
        <line x1="118" y1="64" x2="118" y2="78" stroke="#CCC" stroke-width="1"/>
        <line x1="134" y1="64" x2="134" y2="78" stroke="#CCC" stroke-width="1"/>
        <line x1="150" y1="64" x2="150" y2="78" stroke="#CCC" stroke-width="1"/>
        <!-- Lèvre inférieure EN DESSOUS des dents (contact) -->
        <path d="M45 80 C80 86 140 86 175 80" stroke="#3A3530" stroke-width="3"/>
        <path d="M45 80 C80 96 140 96 175 80" stroke="#3A3530" stroke-width="2.5"/>
        <!-- Zone de contact (dents sur lèvre) -->
        <path d="M55 78 C80 82 140 82 165 78" stroke="#B85C38" stroke-width="1.5" stroke-dasharray="4,2"/>
        <text x="110" y="142" text-anchor="middle" font-size="11" fill="#7A7570" font-family="sans-serif">Dents sup sur levre inf — /f/ /v/</text>
      </svg>`,

    'dental': `
      <svg viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg"
           stroke-linecap="round" stroke-linejoin="round">
        <!-- Lèvres entrouverte -->
        <path d="M42 56 C80 44 140 44 178 56" stroke="#3A3530" stroke-width="3"/>
        <path d="M42 56 C80 62 140 62 178 56" stroke="#3A3530" stroke-width="2"/>
        <path d="M42 90 C80 100 140 100 178 90" stroke="#3A3530" stroke-width="3"/>
        <path d="M42 90 C80 84 140 84 178 90" stroke="#3A3530" stroke-width="2"/>
        <path d="M42 56 L42 90" stroke="#3A3530" stroke-width="1.5"/>
        <path d="M178 56 L178 90" stroke="#3A3530" stroke-width="1.5"/>
        <!-- Dents sup -->
        <rect x="52" y="62" width="116" height="12" rx="2" fill="#F8F6F2" stroke="#BBB" stroke-width="1.5"/>
        <line x1="70"  y1="62" x2="70"  y2="74" stroke="#CCC" stroke-width="1"/>
        <line x1="86"  y1="62" x2="86"  y2="74" stroke="#CCC" stroke-width="1"/>
        <line x1="102" y1="62" x2="102" y2="74" stroke="#CCC" stroke-width="1"/>
        <line x1="118" y1="62" x2="118" y2="74" stroke="#CCC" stroke-width="1"/>
        <line x1="134" y1="62" x2="134" y2="74" stroke="#CCC" stroke-width="1"/>
        <line x1="150" y1="62" x2="150" y2="74" stroke="#CCC" stroke-width="1"/>
        <!-- Langue (pointe) touchant les dents -->
        <path d="M80 82 Q110 70 140 82" fill="#C89090" stroke="#9A6060" stroke-width="1.5"/>
        <path d="M104 74 Q110 62 116 74" fill="#C89090" stroke="#9A6060" stroke-width="1.5"/>
        <text x="110" y="142" text-anchor="middle" font-size="11" fill="#7A7570" font-family="sans-serif">Langue derrière les dents — /t/ /d/ /n/</text>
      </svg>`,

    'alveolar': `
      <svg viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M42 60 C80 48 140 48 178 60" stroke="#3A3530" stroke-width="3"/>
        <path d="M42 60 C80 66 140 66 178 60" stroke="#3A3530" stroke-width="2"/>
        <path d="M42 86 C80 96 140 96 178 86" stroke="#3A3530" stroke-width="3"/>
        <path d="M42 86 C80 80 140 80 178 86" stroke="#3A3530" stroke-width="2"/>
        <path d="M42 60 L42 86" stroke="#3A3530" stroke-width="1.5"/>
        <path d="M178 60 L178 86" stroke="#3A3530" stroke-width="1.5"/>
        <!-- Dents quasi fermées -->
        <rect x="52" y="66" width="116" height="11" rx="2" fill="#F8F6F2" stroke="#BBB" stroke-width="1.5"/>
        <rect x="52" y="77" width="116" height="11" rx="2" fill="#F8F6F2" stroke="#BBB" stroke-width="1.5"/>
        <line x1="70"  y1="66" x2="70"  y2="88" stroke="#CCC" stroke-width="1"/>
        <line x1="88"  y1="66" x2="88"  y2="88" stroke="#CCC" stroke-width="1"/>
        <line x1="106" y1="66" x2="106" y2="88" stroke="#CCC" stroke-width="1"/>
        <line x1="124" y1="66" x2="124" y2="88" stroke="#CCC" stroke-width="1"/>
        <line x1="142" y1="66" x2="142" y2="88" stroke="#CCC" stroke-width="1"/>
        <line x1="160" y1="66" x2="160" y2="88" stroke="#CCC" stroke-width="1"/>
        <!-- Petit espace (sifflement) -->
        <path d="M90 73 Q110 71 130 73" stroke="#B85C38" stroke-width="1.5" fill="none" stroke-dasharray="3,2"/>
        <text x="110" y="142" text-anchor="middle" font-size="11" fill="#7A7570" font-family="sans-serif">Dents quasi closes, sifflement — /s/ /z/</text>
      </svg>`,

    'postalveolar': `
      <svg viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg"
           stroke-linecap="round" stroke-linejoin="round">
        <!-- Lèvres légèrement arrondies et avancées -->
        <path d="M52 60 C82 46 138 46 168 60" stroke="#3A3530" stroke-width="3"/>
        <path d="M52 60 C82 66 138 66 168 60" stroke="#3A3530" stroke-width="2"/>
        <path d="M52 95 C82 106 138 106 168 95" stroke="#3A3530" stroke-width="3"/>
        <path d="M52 95 C82 89 138 89 168 95" stroke="#3A3530" stroke-width="2"/>
        <path d="M52 60 C46 72 46 84 52 95" stroke="#3A3530" stroke-width="2"/>
        <path d="M168 60 C174 72 174 84 168 95" stroke="#3A3530" stroke-width="2"/>
        <!-- Intérieur -->
        <ellipse cx="110" cy="78" rx="38" ry="17" fill="#F0E8E0" stroke="none"/>
        <!-- Flèches arrondissement -->
        <path d="M46 78 L36 78" stroke="#B85C38" stroke-width="1.5"/>
        <path d="M174 78 L184 78" stroke="#B85C38" stroke-width="1.5"/>
        <text x="110" y="142" text-anchor="middle" font-size="11" fill="#7A7570" font-family="sans-serif">Lèvres arrondies et avancées — /ch/ /j/</text>
      </svg>`,

    'velar': `
      <svg viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M42 54 C80 40 140 40 178 54" stroke="#3A3530" stroke-width="3"/>
        <path d="M42 54 C80 60 140 60 178 54" stroke="#3A3530" stroke-width="2"/>
        <path d="M42 96 C80 108 140 108 178 96" stroke="#3A3530" stroke-width="3"/>
        <path d="M42 96 C80 90 140 90 178 96" stroke="#3A3530" stroke-width="2"/>
        <path d="M42 54 L42 96" stroke="#3A3530" stroke-width="1.5"/>
        <path d="M178 54 L178 96" stroke="#3A3530" stroke-width="1.5"/>
        <!-- Dents visibles -->
        <rect x="52" y="60" width="116" height="12" rx="2" fill="#F8F6F2" stroke="#BBB" stroke-width="1.5"/>
        <rect x="52" y="82" width="116" height="12" rx="2" fill="#F8F6F2" stroke="#BBB" stroke-width="1.5"/>
        <!-- Langue au fond -->
        <path d="M80 90 Q110 110 140 90" fill="#C89090" stroke="none"/>
        <!-- Arc indiquant le fond de la gorge -->
        <path d="M90 80 Q110 68 130 80" stroke="#B85C38" stroke-width="1.5" fill="none" stroke-dasharray="4,3"/>
        <text x="110" y="142" text-anchor="middle" font-size="11" fill="#7A7570" font-family="sans-serif">Langue au fond, contact vélaire — /k/ /g/</text>
      </svg>`,

    'lateral': `
      <svg viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M42 58 C80 46 140 46 178 58" stroke="#3A3530" stroke-width="3"/>
        <path d="M42 58 C80 64 140 64 178 58" stroke="#3A3530" stroke-width="2"/>
        <path d="M42 90 C80 100 140 100 178 90" stroke="#3A3530" stroke-width="3"/>
        <path d="M42 90 C80 84 140 84 178 90" stroke="#3A3530" stroke-width="2"/>
        <path d="M42 58 L42 90" stroke="#3A3530" stroke-width="1.5"/>
        <path d="M178 58 L178 90" stroke="#3A3530" stroke-width="1.5"/>
        <!-- Dents -->
        <rect x="52" y="64" width="116" height="12" rx="2" fill="#F8F6F2" stroke="#BBB" stroke-width="1.5"/>
        <!-- Langue levée (pointe) -->
        <path d="M80 84 Q110 60 140 84" fill="#C89090" stroke="#9A6060" stroke-width="1.5"/>
        <!-- Pointe de langue vers les alvéoles -->
        <path d="M106 65 Q110 56 114 65" fill="#C89090" stroke="#9A6060" stroke-width="1.5"/>
        <text x="110" y="142" text-anchor="middle" font-size="11" fill="#7A7570" font-family="sans-serif">Pointe de langue levée — /l/</text>
      </svg>`,

    'rhotic': `
      <svg viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M42 62 C80 50 140 50 178 62" stroke="#3A3530" stroke-width="3"/>
        <path d="M42 62 C80 68 140 68 178 62" stroke="#3A3530" stroke-width="2"/>
        <path d="M42 94 C80 104 140 104 178 94" stroke="#3A3530" stroke-width="3"/>
        <path d="M42 94 C80 88 140 88 178 94" stroke="#3A3530" stroke-width="2"/>
        <path d="M42 62 L42 94" stroke="#3A3530" stroke-width="1.5"/>
        <path d="M178 62 L178 94" stroke="#3A3530" stroke-width="1.5"/>
        <!-- Dents -->
        <rect x="52" y="68" width="116" height="12" rx="2" fill="#F8F6F2" stroke="#BBB" stroke-width="1.5"/>
        <!-- Langue reculée au fond -->
        <path d="M85 88 Q110 100 135 88" fill="#C89090" stroke="#9A6060" stroke-width="1.5"/>
        <!-- Vibration luette (ondes) -->
        <path d="M100 76 Q108 70 116 76 Q124 82 132 76" stroke="#B85C38" stroke-width="1.5" fill="none"/>
        <path d="M100 76 Q108 70 116 76 Q124 82 132 76" stroke="#B85C38" stroke-width="1.5" fill="none" opacity="0.5" transform="translate(0,4)"/>
        <text x="110" y="142" text-anchor="middle" font-size="11" fill="#7A7570" font-family="sans-serif">Vibration uvulaire au fond — /r/</text>
      </svg>`
  };

  // ── SIGNES LSF (dactylologie simplifiée) ─────────────────
  // Main droite, paume vers l'observateur, couleur neutre

  const HAND_BASE_COLOR = '#F0D8B8';
  const HAND_STROKE = '#8B6040';

  const LSF_SVG = {
    'A': `<svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Poing fermé : lettre A -->
      <rect x="20" y="35" width="40" height="48" rx="10" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <!-- 4 doigts repliés (bosses) -->
      <path d="M24,36 Q32,22 40,36" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <path d="M32,36 Q40,20 48,36" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <path d="M40,36 Q48,22 56,36" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <!-- Pouce sur le côté -->
      <path d="M20,52 Q8,46 10,58 Q12,68 20,66" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <text x="40" y="98" text-anchor="middle" font-size="11" fill="#2A2A2A" font-weight="600" font-family="sans-serif">A</text>
    </svg>`,

    'B': `<svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Main plate ouverte : lettre B -->
      <rect x="24" y="42" width="34" height="40" rx="8" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <rect x="24" y="16" width="8" height="30" rx="4" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <rect x="33" y="12" width="8" height="33" rx="4" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <rect x="42" y="14" width="8" height="31" rx="4" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <rect x="51" y="18" width="8" height="27" rx="4" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <!-- Pouce replié -->
      <path d="M24,54 Q14,52 14,60 Q14,68 24,66" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <text x="40" y="98" text-anchor="middle" font-size="11" fill="#2A2A2A" font-weight="600" font-family="sans-serif">B</text>
    </svg>`,

    'C': `<svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Forme C courbée -->
      <path d="M58,26 Q22,30 22,55 Q22,78 58,82" stroke="${HAND_STROKE}" stroke-width="14" fill="none"
            stroke-linecap="round" opacity="0.9" stroke="#E8C898"/>
      <path d="M58,26 Q24,30 24,55 Q24,78 58,82" stroke="${HAND_STROKE}" stroke-width="3" fill="none"
            stroke-linecap="round"/>
      <text x="40" y="98" text-anchor="middle" font-size="11" fill="#2A2A2A" font-weight="600" font-family="sans-serif">C</text>
    </svg>`,

    'D': `<svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Index levé, autres repliés -->
      <rect x="22" y="42" width="36" height="38" rx="8" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <!-- Index droit vers le haut -->
      <rect x="36" y="10" width="9" height="36" rx="4.5" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <!-- Autres doigts repliés (bosses) -->
      <path d="M34,42 Q40,34 46,42" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="1.5"/>
      <path d="M44,42 Q50,36 56,42" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="1.5"/>
      <!-- Pouce formant cercle avec index -->
      <path d="M22,54 Q14,50 36,16" stroke="${HAND_STROKE}" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.15"/>
      <path d="M22,52 Q16,46 34,16" stroke="${HAND_STROKE}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <text x="40" y="98" text-anchor="middle" font-size="11" fill="#2A2A2A" font-weight="600" font-family="sans-serif">D</text>
    </svg>`,

    'E': `<svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Doigts légèrement courbés -->
      <rect x="20" y="44" width="40" height="36" rx="8" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <path d="M22,44 Q30,28 38,44" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <path d="M30,44 Q38,24 46,44" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <path d="M38,44 Q46,26 54,44" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <path d="M46,44 Q54,30 60,44" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <!-- Pouce -->
      <path d="M20,56 Q10,50 12,60 Q14,70 20,68" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <text x="40" y="98" text-anchor="middle" font-size="11" fill="#2A2A2A" font-weight="600" font-family="sans-serif">E</text>
    </svg>`,

    'F': `<svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Index + pouce en cercle, autres levés -->
      <rect x="22" y="50" width="36" height="30" rx="8" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <!-- Cercle index-pouce -->
      <circle cx="35" cy="44" r="10" stroke="${HAND_STROKE}" stroke-width="2" fill="${HAND_BASE_COLOR}"/>
      <!-- 3 doigts levés -->
      <rect x="40" y="18" width="8" height="35" rx="4" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <rect x="50" y="20" width="8" height="33" rx="4" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <text x="40" y="98" text-anchor="middle" font-size="11" fill="#2A2A2A" font-weight="600" font-family="sans-serif">F</text>
    </svg>`,

    'G': `<svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Index + pouce horizontaux vers la droite -->
      <rect x="18" y="38" width="36" height="30" rx="8" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <!-- Index horizontal -->
      <rect x="48" y="46" width="28" height="8" rx="4" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <!-- Pouce horizontal -->
      <rect x="48" y="58" width="22" height="7" rx="3.5" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <!-- Autres doigts repliés -->
      <path d="M34,38 Q40,28 46,38" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="1.5"/>
      <path d="M42,38 Q48,30 54,38" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="1.5"/>
      <text x="35" y="98" text-anchor="middle" font-size="11" fill="#2A2A2A" font-weight="600" font-family="sans-serif">G</text>
    </svg>`,

    'I': `<svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Auriculaire levé (auriculaire = little finger) -->
      <rect x="20" y="44" width="40" height="36" rx="8" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <!-- 4 premiers doigts repliés -->
      <path d="M22,44 Q30,34 38,44" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="1.5"/>
      <path d="M30,44 Q38,30 46,44" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="1.5"/>
      <path d="M38,44 Q46,34 54,44" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="1.5"/>
      <!-- Auriculaire levé -->
      <rect x="52" y="16" width="8" height="32" rx="4" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <!-- Pouce -->
      <path d="M20,56 Q10,52 12,60 Q14,68 20,66" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <text x="40" y="98" text-anchor="middle" font-size="11" fill="#2A2A2A" font-weight="600" font-family="sans-serif">I</text>
    </svg>`,

    'J': `<svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Comme I + mouvement en J -->
      <rect x="20" y="44" width="40" height="36" rx="8" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <path d="M22,44 Q30,34 38,44" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="1.5"/>
      <path d="M30,44 Q38,30 46,44" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="1.5"/>
      <path d="M38,44 Q46,34 54,44" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="1.5"/>
      <rect x="52" y="16" width="8" height="32" rx="4" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <!-- Flèche J -->
      <path d="M56 16 Q66 10 68 22 Q70 38 60 42" stroke="#B85C38" stroke-width="1.5" fill="none" stroke-dasharray="3,2"/>
      <path d="M20,56 Q10,52 12,60 Q14,68 20,66" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <text x="40" y="98" text-anchor="middle" font-size="11" fill="#2A2A2A" font-weight="600" font-family="sans-serif">J</text>
    </svg>`,

    'K': `<svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Index + majeur en V, pouce entre les deux -->
      <rect x="20" y="52" width="36" height="28" rx="8" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <rect x="26" y="18" width="8" height="38" rx="4" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <rect x="36" y="22" width="8" height="34" rx="4" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <!-- Autres repliés -->
      <path d="M44,52 Q50,42 56,52" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="1.5"/>
      <!-- Pouce entre index et majeur -->
      <path d="M36,44 Q40,36 44,44" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="6" stroke-linecap="round" opacity="0.6"/>
      <text x="40" y="98" text-anchor="middle" font-size="11" fill="#2A2A2A" font-weight="600" font-family="sans-serif">K</text>
    </svg>`,

    'L': `<svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- L shape : index vers le haut, pouce horizontal -->
      <rect x="26" y="46" width="32" height="30" rx="8" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <!-- Index vertical -->
      <rect x="30" y="14" width="9" height="36" rx="4.5" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <!-- Pouce horizontal -->
      <rect x="26" y="46" width="26" height="8" rx="4" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <!-- Autres doigts repliés -->
      <path d="M40,52 Q46,42 52,52" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="1.5"/>
      <path d="M48,52 Q54,44 58,52" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="1.5"/>
      <text x="40" y="98" text-anchor="middle" font-size="11" fill="#2A2A2A" font-weight="600" font-family="sans-serif">L</text>
    </svg>`,

    'M': `<svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- 3 doigts repliés sur le pouce -->
      <rect x="20" y="42" width="40" height="38" rx="8" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <path d="M22,42 Q32,28 42,42" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <path d="M30,42 Q40,26 50,42" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <path d="M38,42 Q48,30 58,42" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <!-- Pouce visible sous les doigts -->
      <path d="M20,56 Q24,48 34,50" stroke="${HAND_STROKE}" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.5"/>
      <path d="M20,56 Q24,48 34,50" stroke="${HAND_STROKE}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <text x="40" y="98" text-anchor="middle" font-size="11" fill="#2A2A2A" font-weight="600" font-family="sans-serif">M</text>
    </svg>`,

    'N': `<svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- 2 doigts repliés sur le pouce -->
      <rect x="20" y="42" width="40" height="38" rx="8" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <path d="M22,42 Q32,28 42,42" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <path d="M30,42 Q40,26 50,42" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <!-- 2 autres doigts droits -->
      <path d="M50,42 Q54,32 58,42" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="1.5" opacity="0.5"/>
      <!-- Pouce -->
      <path d="M20,56 Q24,48 32,50" stroke="${HAND_STROKE}" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.5"/>
      <path d="M20,56 Q24,48 32,50" stroke="${HAND_STROKE}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <text x="40" y="98" text-anchor="middle" font-size="11" fill="#2A2A2A" font-weight="600" font-family="sans-serif">N</text>
    </svg>`,

    'O': `<svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Tous les doigts forment un O -->
      <circle cx="40" cy="46" r="20" stroke="${HAND_STROKE}" stroke-width="12" fill="none"
              stroke-linecap="round" opacity="0.12" stroke="${HAND_BASE_COLOR}"/>
      <circle cx="40" cy="46" r="20" stroke="${HAND_STROKE}" stroke-width="3" fill="none"/>
      <!-- Palm en bas -->
      <rect x="22" y="60" width="36" height="22" rx="8" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <text x="40" y="98" text-anchor="middle" font-size="11" fill="#2A2A2A" font-weight="600" font-family="sans-serif">O</text>
    </svg>`,

    'P': `<svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Comme K mais pointant vers le bas -->
      <rect x="20" y="30" width="36" height="28" rx="8" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <!-- Index vers le bas -->
      <rect x="28" y="52" width="8" height="32" rx="4" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <rect x="38" y="52" width="8" height="28" rx="4" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <!-- Autres repliés -->
      <path d="M48,30 Q54,20 58,30" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="1.5"/>
      <path d="M20,40 Q14,38 12,46 Q10,54 20,52" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <text x="40" y="98" text-anchor="middle" font-size="11" fill="#2A2A2A" font-weight="600" font-family="sans-serif">P</text>
    </svg>`,

    'R': `<svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Index et majeur croisés -->
      <rect x="20" y="52" width="40" height="28" rx="8" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <!-- Index (légèrement incliné) -->
      <rect x="28" y="18" width="8" height="38" rx="4" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2" transform="rotate(5,32,40)"/>
      <!-- Majeur croisé par dessus -->
      <rect x="36" y="16" width="8" height="40" rx="4" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2" transform="rotate(-5,40,38)"/>
      <!-- Autres repliés -->
      <path d="M44,52 Q50,42 56,52" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="1.5"/>
      <!-- Croix de référence -->
      <circle cx="40" cy="38" r="5" fill="#B85C38" opacity="0.25"/>
      <text x="40" y="98" text-anchor="middle" font-size="11" fill="#2A2A2A" font-weight="600" font-family="sans-serif">R</text>
    </svg>`,

    'S': `<svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Poing, pouce sur les doigts -->
      <rect x="20" y="36" width="40" height="44" rx="10" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <path d="M22,36 Q32,22 42,36" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <path d="M30,36 Q40,20 50,36" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <path d="M38,36 Q48,24 58,36" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <!-- Pouce croisé par-dessus -->
      <path d="M20,52 Q28,46 46,50" stroke="${HAND_STROKE}" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.3"/>
      <path d="M20,52 Q28,46 46,50" stroke="${HAND_STROKE}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <text x="40" y="98" text-anchor="middle" font-size="11" fill="#2A2A2A" font-weight="600" font-family="sans-serif">S</text>
    </svg>`,

    'T': `<svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Pouce entre index et majeur -->
      <rect x="20" y="42" width="40" height="38" rx="8" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <path d="M22,42 Q32,28 42,42" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <path d="M30,42 Q40,26 50,42" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <path d="M38,42 Q48,30 58,42" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <!-- Pouce entre index et majeur -->
      <path d="M20,54 Q32,40 42,44" stroke="${HAND_STROKE}" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.4"/>
      <path d="M20,54 Q32,40 42,44" stroke="${HAND_STROKE}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <text x="40" y="98" text-anchor="middle" font-size="11" fill="#2A2A2A" font-weight="600" font-family="sans-serif">T</text>
    </svg>`,

    'U': `<svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Index et majeur ensemble vers le haut -->
      <rect x="20" y="52" width="40" height="28" rx="8" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <rect x="28" y="18" width="8" height="38" rx="4" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <rect x="38" y="18" width="8" height="38" rx="4" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <!-- Les 2 doigts collés -->
      <rect x="31" y="20" width="12" height="34" rx="4" fill="${HAND_BASE_COLOR}" stroke="none"/>
      <!-- Autres repliés -->
      <path d="M46,52 Q52,42 58,52" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="1.5"/>
      <!-- Pouce -->
      <path d="M20,60 Q12,56 14,64 Q16,72 20,70" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <text x="40" y="98" text-anchor="middle" font-size="11" fill="#2A2A2A" font-weight="600" font-family="sans-serif">U</text>
    </svg>`,

    'V': `<svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Signe V / Peace -->
      <rect x="20" y="52" width="40" height="28" rx="8" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <!-- Index légèrement écarté -->
      <rect x="26" y="16" width="8" height="40" rx="4" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2" transform="rotate(-8,30,38)"/>
      <!-- Majeur légèrement écarté de l'autre côté -->
      <rect x="40" y="16" width="8" height="40" rx="4" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2" transform="rotate(8,44,38)"/>
      <!-- Autres repliés -->
      <path d="M48,52 Q54,42 60,52" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="1.5"/>
      <!-- Pouce -->
      <path d="M20,60 Q12,56 14,64 Q16,72 20,70" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <text x="40" y="98" text-anchor="middle" font-size="11" fill="#2A2A2A" font-weight="600" font-family="sans-serif">V</text>
    </svg>`,

    'Z': `<svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Index levé, trace Z dans l'air -->
      <rect x="20" y="52" width="40" height="28" rx="8" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <rect x="32" y="16" width="9" height="40" rx="4.5" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <!-- Z tracé -->
      <path d="M20,10 L54,10 L20,30 L54,30" stroke="#B85C38" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-dasharray="3,2"/>
      <path d="M44,52 Q50,42 56,52" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="1.5"/>
      <path d="M52,52 Q56,44 60,52" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="1.5"/>
      <path x="20,60 Q12,56 14,64 Q16,72 20,70" fill="${HAND_BASE_COLOR}" stroke="${HAND_STROKE}" stroke-width="2"/>
      <text x="40" y="98" text-anchor="middle" font-size="11" fill="#2A2A2A" font-weight="600" font-family="sans-serif">Z</text>
    </svg>`
  };

  function getMouthSVG(pos) {
    return MOUTH_SVG[pos] || MOUTH_SVG['half-open'];
  }

  function getLSFSVG(letter) {
    return LSF_SVG[letter] || LSF_SVG['A'];
  }

  // ── ÉTAT LOCAL ────────────────────────────────────────────
  let _currentPanel = null;  // phonème actuellement ouvert
  let _recSession = null;    // session SpeechRecognition en cours

  // ── CONSTRUCTION DES GRILLES ─────────────────────────────
  function init() {
    _buildVoyellesGrid();
    _buildConsonnesGroups();
  }

  function _buildVoyellesGrid() {
    const grid = document.getElementById('voyellesGrid');
    if (!grid) return;
    grid.innerHTML = '';
    VOYELLES.forEach(v => {
      grid.appendChild(_createPhonemeCard(v));
    });
  }

  function _buildConsonnesGroups() {
    const container = document.getElementById('consonnesContainer');
    if (!container) return;
    container.innerHTML = '';

    CONSONNES_GROUPS.forEach(group => {
      const section = document.createElement('div');
      section.className = 'phoneme-group';

      const header = document.createElement('div');
      header.className = 'phoneme-group-header';
      header.innerHTML = `
        <span class="phoneme-group-label">${group.label}</span>
        <span class="phoneme-group-desc">${group.desc}</span>
      `;

      const grid = document.createElement('div');
      grid.className = 'phoneme-grid';
      group.phonemes.forEach(p => grid.appendChild(_createPhonemeCard(p)));

      section.appendChild(header);
      section.appendChild(grid);
      container.appendChild(section);
    });
  }

  function _createPhonemeCard(phoneme) {
    const done = State.has('completedPhonemes', phoneme.id);
    const card = document.createElement('div');
    card.className = 'phoneme-card' + (done ? ' phoneme-card--done' : '');
    card.id = 'pcard-' + phoneme.id;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'Son ' + phoneme.symbol + ', exemple : ' + phoneme.example);
    card.tabIndex = 0;

    card.innerHTML = `
      <div class="phoneme-card__symbol">${phoneme.symbol}</div>
      <div class="phoneme-card__example">${phoneme.example}</div>
      ${done ? '<i class="fa-solid fa-circle-check phoneme-card__check" aria-hidden="true"></i>' : ''}
    `;

    card.addEventListener('click', () => openPhonemePanel(phoneme));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPhonemePanel(phoneme); }
    });
    return card;
  }

  // ── PANNEAU D'EXERCICE ────────────────────────────────────
  function openPhonemePanel(phoneme) {
    _currentPanel = phoneme;

    // Badge premier son
    if (State.get('completedPhonemes').length === 0 && !State.has('earnedBadges', 'first_sound')) {
      Utils.earnBadge('first_sound');
    }

    // Jouer le son immédiatement
    Utils.speak(phoneme.symbol);

    // Peupler la modale
    document.getElementById('panelSymbol').textContent = phoneme.symbol;
    document.getElementById('panelExample').textContent = phoneme.example;
    document.getElementById('panelHint').textContent = phoneme.hint;
    document.getElementById('panelMouth').innerHTML = getMouthSVG(phoneme.mouthPos);
    document.getElementById('panelLSF').innerHTML = getLSFSVG(phoneme.lsfLetter);
    document.getElementById('panelLSFLabel').textContent = 'Signe LSF : ' + phoneme.lsfLetter;

    // Réinitialiser le feedback
    _resetPanelFeedback();

    // Activer LSF clignotant
    _startLSFBlink();

    // Ouvrir la modale
    const overlay = document.getElementById('phonemeModal');
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');

    // Lancer le monitoring micro (pour les bulles)
    Utils.startBubbleMic();
  }

  function closePhonemePanel() {
    _currentPanel = null;
    _stopLSFBlink();
    _stopRecording();
    const overlay = document.getElementById('phonemeModal');
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
  }

  function _resetPanelFeedback() {
    const fb = document.getElementById('panelFeedback');
    if (fb) {
      fb.className = 'phoneme-feedback';
      fb.innerHTML = '';
    }
    const btn = document.getElementById('panelRepeatBtn');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-microphone" aria-hidden="true"></i> Je répète !';
    }
    document.getElementById('panelMarkDoneBtn').style.display = 'none';
  }

  // ── ACTIONS DU PANNEAU ────────────────────────────────────
  function replaySound() {
    if (!_currentPanel) return;
    Utils.speak(_currentPanel.symbol);
    _startLSFBlink();
  }

  function startRepeat() {
    if (!_currentPanel) return;

    const btn = document.getElementById('panelRepeatBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-circle-dot fa-beat" aria-hidden="true"></i> Écoute...';

    const fb = document.getElementById('panelFeedback');
    fb.className = 'phoneme-feedback phoneme-feedback--listening';
    fb.innerHTML = '<i class="fa-solid fa-ear-listen" aria-hidden="true"></i> Je t\'écoute... parle maintenant !';

    _recSession = Utils.recognize(
      _currentPanel.testWords,
      4000,
      (result) => _handleRecognitionResult(result)
    );
  }

  function _stopRecording() {
    if (_recSession) {
      try { _recSession.abort(); } catch(e) {}
      _recSession = null;
    }
  }

  function _handleRecognitionResult(result) {
    _recSession = null;
    const btn = document.getElementById('panelRepeatBtn');
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-microphone" aria-hidden="true"></i> Je répète !';

    const fb = document.getElementById('panelFeedback');

    if (result.noApi) {
      // Navigateur non compatible → feedback neutre
      fb.className = 'phoneme-feedback phoneme-feedback--info';
      fb.innerHTML = '<i class="fa-solid fa-circle-info"></i> Reconnaisance vocale non disponible sur ce navigateur (utilise Chrome).';
      document.getElementById('panelMarkDoneBtn').style.display = 'inline-flex';
      return;
    }

    if (result.success && result.quality >= 0.3) {
      fb.className = 'phoneme-feedback phoneme-feedback--success';
      fb.innerHTML = '<i class="fa-solid fa-circle-check" aria-hidden="true"></i> Bravo ! Tu as bien prononcé le son !';
      Utils.fireConfetti();
      Utils.triggerBubblesManual(5);
      _markCurrentDone();
    } else {
      fb.className = 'phoneme-feedback phoneme-feedback--error';
      const msg = result.error === 'no-speech'
        ? 'Je n\'ai rien entendu. Clique sur "Je répète" et parle fort !'
        : 'Pas tout à fait... essaie encore !';
      fb.innerHTML = `<i class="fa-solid fa-circle-xmark" aria-hidden="true"></i> ${msg}`;
      btn.innerHTML = '<i class="fa-solid fa-microphone" aria-hidden="true"></i> Réessayer';
      document.getElementById('panelMarkDoneBtn').style.display = 'inline-flex';
    }
  }

  function _markCurrentDone() {
    if (!_currentPanel) return;
    const id = _currentPanel.id;
    if (!State.has('completedPhonemes', id)) {
      State.push('completedPhonemes', id);
      Utils.addStars(10);
      Utils.logJournal('fa-comment', 'Son prononce : ' + _currentPanel.symbol + ' (' + _currentPanel.example + ')');

      // Mettre à jour la carte
      const card = document.getElementById('pcard-' + id);
      if (card) {
        card.classList.add('phoneme-card--done');
        if (!card.querySelector('.phoneme-card__check')) {
          const icon = document.createElement('i');
          icon.className = 'fa-solid fa-circle-check phoneme-card__check';
          card.appendChild(icon);
        }
      }

      // Vérifier badges
      _checkBadges();
    }
    document.getElementById('panelMarkDoneBtn').style.display = 'none';
  }

  function markDoneManually() {
    _markCurrentDone();
  }

  function _checkBadges() {
    const done = State.get('completedPhonemes');
    const vowelIds = VOYELLES.map(v => v.id);
    if (vowelIds.every(id => done.includes(id))) {
      Utils.earnBadge('all_vowels');
    }
    const bilIds = CONSONNES_GROUPS.find(g => g.groupId === 'bilabiales').phonemes.map(p => p.id);
    if (bilIds.every(id => done.includes(id))) {
      Utils.earnBadge('all_bilabiales');
    }
  }

  // ── ANIMATION LSF CLIGNOTANTE ─────────────────────────────
  let _lsfBlinkTimer = null;

  function _startLSFBlink() {
    _stopLSFBlink();
    const el = document.getElementById('panelLSF');
    if (!el) return;
    let visible = true;
    el.style.opacity = '1';
    _lsfBlinkTimer = setInterval(() => {
      visible = !visible;
      el.style.opacity = visible ? '1' : '0.2';
    }, 500);
    // Arrêt après 4 secondes
    setTimeout(_stopLSFBlink, 4000);
  }

  function _stopLSFBlink() {
    if (_lsfBlinkTimer) {
      clearInterval(_lsfBlinkTimer);
      _lsfBlinkTimer = null;
    }
    const el = document.getElementById('panelLSF');
    if (el) el.style.opacity = '1';
  }

  // ── API PUBLIQUE ──────────────────────────────────────────
  return {
    init,
    openPhonemePanel,
    closePhonemePanel,
    replaySound,
    startRepeat,
    markDoneManually,
    getMouthSVG,
    getLSFSVG
  };

})();
