/* ================================================================
   BABAINA® — DIGITAL EXPERIENCES
   Fichier : script.js

   DESCRIPTION :
   Ce fichier gère les interactions et les animations
   du portfolio BABAINA.

   FONCTIONNALITÉS :
   01. Progression du défilement
   02. Navigation mobile
   03. Animations au scroll
   04. Curseur personnalisé
   05. Effet magnétique
   06. Scène 3D avec WebGL
   07. Navigation active
   08. Année automatique

   TECHNOLOGIES :
   - JavaScript ES6+
   - DOM API
   - IntersectionObserver
   - Canvas API
   - WebGL
   - GLSL (Vertex Shader et Fragment Shader)

   AUCUN FRAMEWORK NÉCESSAIRE.
   ================================================================ */


/* ================================================================
   00 — INITIALISATION DU SCRIPT
   ================================================================ */

/*
   Une IIFE (Immediately Invoked Function Expression)
   est une fonction qui s'exécute immédiatement après
   sa déclaration.

   Pourquoi utiliser cette technique ?

   - Éviter de polluer l'espace global JavaScript.
   - Organiser le code dans un environnement isolé.
   - Éviter les conflits avec d'autres scripts.

   La syntaxe (() => {})() correspond à une fonction fléchée
   immédiatement exécutée.
*/

(() => {

  /*
     "use strict" active le mode strict de JavaScript.

     Il permet notamment de détecter certaines erreurs
     et d'éviter des comportements JavaScript dangereux
     ou ambigus.
  */

  "use strict";


  /* ==============================================================
     VARIABLES GLOBALES DU SCRIPT
     ============================================================== */

  /*
     document.documentElement représente la balise <html>.

     On conserve cet élément dans une constante pour pouvoir
     modifier les propriétés CSS globales du document.
  */

  const root = document.documentElement;


  /*
     matchMedia() permet de vérifier une caractéristique
     de l'environnement ou des préférences de l'utilisateur.

     prefers-reduced-motion détecte si l'utilisateur préfère
     réduire les animations dans son système.
  */

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  /*
     (pointer: coarse) détecte généralement un écran tactile.

     Exemples :
     - Smartphone
     - Tablette

     On utilise cette information pour éviter d'afficher
     un curseur personnalisé sur les appareils tactiles.
  */

  const isTouch = window.matchMedia(
    "(pointer: coarse)"
  ).matches;



  /* ================================================================
     01 — PROGRESSION DU DÉFILEMENT
     ================================================================ */

  /*
     OBJECTIF :
     Afficher une barre horizontale qui indique
     la progression de lecture de la page.

     Le pourcentage est transmis au CSS grâce à une
     variable personnalisée appelée --progress.
  */


  /*
     Fonction updateProgress()

     Elle calcule la distance parcourue par l'utilisateur
     et la transforme en pourcentage.
  */

  const updateProgress = () => {

    /*
       scrollHeight :
       Hauteur totale du document.

       innerHeight :
       Hauteur visible de la fenêtre du navigateur.

       La différence correspond à la distance maximale
       que l'utilisateur peut parcourir en faisant défiler.
    */

    const scrollable = root.scrollHeight - window.innerHeight;


    /*
       On calcule le pourcentage de progression.

       scrollY = position verticale actuelle.

       Exemple :
       Si la page mesure 2000px et que l'utilisateur
       a parcouru 1000px, la progression est de 50%.

       On vérifie que scrollable est supérieur à zéro
       pour éviter une division par zéro.
    */

    const progress = scrollable > 0
      ? (window.scrollY / scrollable) * 100
      : 0;


    /*
       setProperty() permet de modifier une variable CSS
       directement depuis JavaScript.

       Ici, on met à jour --progress.

       Le CSS peut ensuite utiliser :
       width: var(--progress);
    */

    root.style.setProperty(
      "--progress",
      `${progress}%`
    );

  };


  /*
     addEventListener() écoute un événement.

     Ici, chaque événement scroll déclenche updateProgress().

     passive: true indique au navigateur que cet écouteur
     ne cherchera pas à bloquer le défilement.
  */

  window.addEventListener(
    "scroll",
    updateProgress,
    { passive: true }
  );


  /*
     On exécute également la fonction une première fois.

     Cela permet d'afficher la bonne progression dès
     le chargement, même si la page est déjà positionnée
     à un endroit particulier.
  */

  updateProgress();



  /* ================================================================
     02 — MENU MOBILE ACCESSIBLE
     ================================================================ */

  /*
     OBJECTIF :
     Gérer l'ouverture et la fermeture du menu mobile.

     Le menu possède deux états :
     - Fermé
     - Ouvert

     On utilise les classes CSS et les attributs ARIA
     pour gérer son comportement.
  */


  /*
     querySelector() récupère le premier élément HTML
     correspondant au sélecteur CSS indiqué.

     Ici :
     .menu-toggle = bouton d'ouverture du menu.
     .main-nav    = navigation principale.
  */

  const menuButton = document.querySelector(
    ".menu-toggle"
  );

  const navigation = document.querySelector(
    ".main-nav"
  );


  /*
     Fonction closeMenu()

     Elle ferme complètement le menu mobile.

     On vérifie d'abord que les éléments HTML existent.

     Cela évite une erreur JavaScript si le menu
     n'est pas présent sur une page.
  */

  const closeMenu = () => {

    if (!menuButton || !navigation) return;


    /*
       aria-expanded indique aux technologies d'assistance
       si le menu est ouvert ou fermé.

       false = menu fermé.
    */

    menuButton.setAttribute(
      "aria-expanded",
      "false"
    );


    /*
       On met à jour le nom accessible du bouton.
    */

    menuButton.setAttribute(
      "aria-label",
      "Ouvrir le menu"
    );


    /*
       classList.remove() retire la classe CSS is-open.

       Le menu retrouve donc son apparence fermée.
    */

    navigation.classList.remove("is-open");

  };


  /*
     On vérifie que les deux éléments existent avant
     de leur ajouter des événements.
  */

  if (menuButton && navigation) {


    /* --------------------------------------------------------------
       Ouverture et fermeture avec le bouton
       -------------------------------------------------------------- */

    menuButton.addEventListener("click", () => {

      /*
         getAttribute() récupère la valeur de aria-expanded.

         On vérifie si elle est égale à "true".
      */

      const currentlyOpen =
        menuButton.getAttribute("aria-expanded") === "true";


      /*
         On inverse l'état actuel du menu.

         String() transforme le booléen en texte :
         true  devient "true".
         false devient "false".
      */

      menuButton.setAttribute(
        "aria-expanded",
        String(!currentlyOpen)
      );


      /*
         Le texte accessible change selon l'état du menu.
      */

      menuButton.setAttribute(
        "aria-label",
        currentlyOpen
          ? "Ouvrir le menu"
          : "Fermer le menu"
      );


      /*
         classList.toggle() ajoute ou retire une classe.

         Le deuxième argument impose l'état souhaité :

         !currentlyOpen = true  : ajoute is-open.
         !currentlyOpen = false : retire is-open.
      */

      navigation.classList.toggle(
        "is-open",
        !currentlyOpen
      );

    });


    /* --------------------------------------------------------------
       Fermeture après un clic sur un lien
       -------------------------------------------------------------- */

    /*
       querySelectorAll() récupère tous les liens de navigation.

       forEach() parcourt chaque lien pour lui ajouter
       un écouteur d'événement.
    */

    navigation
      .querySelectorAll("a")
      .forEach((link) => {

        link.addEventListener(
          "click",
          closeMenu
        );

      });


    /* --------------------------------------------------------------
       Fermeture avec la touche Escape
       -------------------------------------------------------------- */

    /*
       keydown détecte l'appui sur une touche du clavier.

       Si la touche Escape est utilisée, le menu se ferme.

       Cela améliore l'accessibilité au clavier.
    */

    document.addEventListener("keydown", (event) => {

      if (event.key === "Escape") {
        closeMenu();
      }

    });


    /* --------------------------------------------------------------
       Adaptation lors du redimensionnement
       -------------------------------------------------------------- */

    /*
       resize se déclenche lorsque la taille de la fenêtre change.

       Si l'écran devient supérieur à 680px,
       on ferme le menu mobile.
    */

    window.addEventListener("resize", () => {

      if (window.innerWidth > 680) {
        closeMenu();
      }

    });

  }



  /* ================================================================
     03 — APPARITION PROGRESSIVE AU SCROLL
     ================================================================ */

  /*
     OBJECTIF :
     Faire apparaître progressivement les éléments
     lorsqu'ils entrent dans la zone visible de l'écran.

     Cette technique est appelée Scroll Reveal.
  */


  /*
     On récupère :
     - Tous les éléments possédant la classe .reveal.
     - Toutes les cartes possédant la classe .skill-card.
  */

  const revealElements = document.querySelectorAll(
    ".reveal, .skill-card"
  );


  /*
     IntersectionObserver permet de surveiller
     la visibilité d'un élément dans le navigateur.

     C'est généralement plus performant que de calculer
     manuellement la position de chaque élément à chaque scroll.
  */

  if (
    "IntersectionObserver" in window &&
    !reduceMotion
  ) {


    /*
       Création de l'observateur.

       entries contient les changements de visibilité.

       observer représente l'observateur lui-même.
    */

    const revealObserver = new IntersectionObserver(

      (entries, observer) => {

        /*
           On parcourt chaque élément observé.
        */

        entries.forEach((entry) => {


          /*
             isIntersecting indique si l'élément
             est actuellement dans la zone observée.

             Si ce n'est pas le cas, on passe au suivant.
          */

          if (!entry.isIntersecting) return;


          /*
             On ajoute is-visible.

             Le CSS peut alors déclencher une transition
             d'opacité et de déplacement.
          */

          entry.target.classList.add(
            "is-visible"
          );


          /*
             unobserve() arrête de surveiller cet élément.

             L'animation ne sera donc déclenchée
             qu'une seule fois.
          */

          observer.unobserve(entry.target);

        });

      },

      {
        /*
           threshold définit la proportion de l'élément
           qui doit être visible avant de déclencher l'effet.

           0.14 = 14%.
        */

        threshold: 0.14,

        /*
           rootMargin modifie virtuellement les limites
           de la zone d'observation.

           Ici, on réduit légèrement la zone en bas
           pour anticiper l'animation.
        */

        rootMargin: "0px 0px -35px 0px"
      }

    );


    /*
       On commence à surveiller tous les éléments.
    */

    revealElements.forEach((element) => {

      revealObserver.observe(element);

    });

  } else {

    /*
       Solution de secours :

       Si IntersectionObserver n'est pas disponible,
       ou si l'utilisateur préfère réduire les animations,
       les éléments deviennent immédiatement visibles.
    */

    revealElements.forEach((element) => {

      element.classList.add("is-visible");

    });

  }



  /* ================================================================
     04 — CURSEUR PERSONNALISÉ
     Fonctionnement réservé aux appareils avec souris.
     ================================================================ */

  /*
     OBJECTIF :
     Créer deux éléments graphiques :

     1. Un petit point qui suit directement la souris.
     2. Un cercle qui suit le point avec un léger retard.

     Ce retard crée une impression de fluidité.
  */


  /*
     On désactive cette fonctionnalité :
     - Sur les appareils tactiles.
     - Lorsque la réduction des animations est activée.
  */

  if (!isTouch && !reduceMotion) {


    /*
       Récupération des deux éléments HTML.
    */

    const dot = document.querySelector(
      ".cursor--dot"
    );

    const ring = document.querySelector(
      ".cursor--ring"
    );


    /*
       Position initiale du curseur.

       innerWidth / 2  = centre horizontal.
       innerHeight / 2 = centre vertical.
    */

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;


    /*
       Le cercle possède sa propre position.

       Cela permet de créer son mouvement retardé.
    */

    let ringX = mouseX;
    let ringY = mouseY;


    /*
       On vérifie que les deux éléments HTML existent.
    */

    if (dot && ring) {


      /*
         opacity = 1 rend les éléments visibles.
      */

      dot.style.opacity = "1";
      ring.style.opacity = "1";


      /* ------------------------------------------------------------
         Position instantanée du point
         ------------------------------------------------------------ */

      window.addEventListener(
        "mousemove",
        (event) => {

          /*
             clientX = position horizontale de la souris.
             clientY = position verticale de la souris.
          */

          mouseX = event.clientX;
          mouseY = event.clientY;


          /*
             On met directement à jour la position du point.
          */

          dot.style.left = `${mouseX}px`;
          dot.style.top = `${mouseY}px`;

        },
        { passive: true }
      );


      /* ------------------------------------------------------------
         Animation du cercle suiveur
         ------------------------------------------------------------ */

      /*
         requestAnimationFrame() demande au navigateur
         d'exécuter une fonction au prochain rafraîchissement
         de l'écran.

         C'est une méthode adaptée aux animations.
      */

      const followCursor = () => {


        /*
           Interpolation progressive :

           ringX += (mouseX - ringX) * 0.14;

           On rapproche le cercle de la souris
           de 14% de la distance restante à chaque image.

           Plus la valeur est petite, plus le mouvement
           est lent et fluide.
        */

        ringX += (mouseX - ringX) * 0.14;
        ringY += (mouseY - ringY) * 0.14;


        /*
           Mise à jour de la position du cercle.
        */

        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;


        /*
           On demande une nouvelle image pour continuer
           l'animation tant que la page est active.
        */

        requestAnimationFrame(followCursor);

      };


      /*
         Lancement de l'animation.
      */

      followCursor();


      /* ------------------------------------------------------------
         Interaction avec les éléments cliquables
         ------------------------------------------------------------ */

      /*
         On sélectionne les liens, boutons et cartes.

         Au survol :
         - is-hover est ajoutée.
         - Le CSS peut agrandir le cercle.

         Lorsque la souris quitte l'élément :
         - is-hover est retirée.
      */

      document
        .querySelectorAll("a, button, .skill-card")
        .forEach((element) => {

          element.addEventListener(
            "mouseenter",
            () => ring.classList.add("is-hover")
          );

          element.addEventListener(
            "mouseleave",
            () => ring.classList.remove("is-hover")
          );

        });

    }

  }



  /* ================================================================
     05 — EFFET MAGNÉTIQUE
     ================================================================ */

  /*
     OBJECTIF :
     Donner une petite sensation d'attraction aux boutons.

     Lorsque la souris se déplace sur un élément .magnetic,
     celui-ci suit légèrement la direction du mouvement.
  */


  /*
     Cette interaction est réservée aux appareils
     qui disposent d'un pointeur précis.
  */

  if (!isTouch && !reduceMotion) {


    /*
       On sélectionne tous les éléments magnétiques.
    */

    document
      .querySelectorAll(".magnetic")
      .forEach((element) => {


        /* ----------------------------------------------------------
           Mouvement de l'élément au survol
           ---------------------------------------------------------- */

        element.addEventListener(
          "mousemove",
          (event) => {


            /*
               getBoundingClientRect() retourne les dimensions
               et la position de l'élément dans la fenêtre.
            */

            const bounds = element.getBoundingClientRect();


            /*
               Calcul du déplacement horizontal.

               event.clientX = position actuelle de la souris.
               bounds.left = bord gauche de l'élément.
               bounds.width / 2 = centre horizontal.
            */

            const offsetX =
              event.clientX -
              bounds.left -
              bounds.width / 2;


            /*
               Même calcul sur l'axe vertical.
            */

            const offsetY =
              event.clientY -
              bounds.top -
              bounds.height / 2;


            /*
               On applique une translation légère.

               0.07 signifie que seulement 7% du déplacement
               calculé est appliqué à l'élément.

               Cela évite un mouvement trop important.
            */

            element.style.transform =
              `translate(${offsetX * 0.07}px, ${offsetY * 0.07}px)`;

          }
        );


        /* ----------------------------------------------------------
           Retour à la position normale
           ---------------------------------------------------------- */

        element.addEventListener(
          "mouseleave",
          () => {

            /*
               Une chaîne vide retire le style inline.

               L'élément revient à sa position CSS initiale.
            */

            element.style.transform = "";

          }
        );

      });

  }



  /* ================================================================
     06 — SCÈNE 3D DU HERO AVEC WEBGL
     ================================================================ */

  /*
     OBJECTIF :
     Créer une scène graphique immersive sans utiliser
     Three.js ni une autre bibliothèque 3D.

     WebGL permet d'exécuter des programmes graphiques
     directement sur le processeur graphique (GPU).

     La scène comprend :
     - Une sphère procédurale.
     - Un éclairage.
     - Des lignes géométriques.
     - Des anneaux orbitaux.
     - Des étoiles.
     - Une influence subtile de la souris.

     GLSL est le langage utilisé pour écrire les shaders.
  */


  /*
     Récupération du canvas HTML.

     Le canvas est la surface sur laquelle WebGL dessine.
  */

  const canvas = document.querySelector(
    ".hero-canvas"
  );


  /*
     getContext("webgl") demande au navigateur
     de créer un contexte graphique WebGL.

     alpha: true :
     autorise la transparence du canvas.

     antialias: true :
     améliore la douceur des contours.

     powerPreference: "low-power" :
     suggère au navigateur de privilégier
     une consommation énergétique réduite.
  */

  const gl = canvas?.getContext("webgl", {

    alpha: true,
    antialias: true,
    powerPreference: "low-power"

  });


  /*
     On démarre WebGL seulement si :
     - Le canvas existe.
     - WebGL est disponible.
     - L'utilisateur n'a pas demandé de réduire les animations.
  */

  if (canvas && gl && !reduceMotion) {


    /* ============================================================
       06.1 — VERTEX SHADER
       ============================================================ */

    /*
       Le Vertex Shader est un petit programme exécuté
       sur les sommets des formes graphiques.

       Dans notre cas, il sert à dessiner un grand rectangle
       qui recouvre toute la surface du canvas.

       Ce rectangle servira de support au Fragment Shader.
    */

    const vertexShaderSource = `

      /* Position du sommet reçue depuis JavaScript. */
      attribute vec2 a_position;

      /* Coordonnées transmises au Fragment Shader. */
      varying vec2 v_uv;

      void main() {

        /*
           Conversion des coordonnées de -1 à +1
           en coordonnées de texture de 0 à 1.
        */

        v_uv = a_position * 0.5 + 0.5;

        /*
           gl_Position définit la position finale du sommet.
        */

        gl_Position = vec4(a_position, 0.0, 1.0);

      }

    `;



    /* ============================================================
       06.2 — FRAGMENT SHADER
       ============================================================ */

    /*
       Le Fragment Shader calcule la couleur de chaque pixel.

       C'est ici que l'on construit visuellement :
       - Le halo lumineux.
       - La sphère.
       - Les détails de surface.
       - Les orbites.
       - Les étoiles.
       - L'assombrissement des bords.

       precision highp float demande une précision élevée
       pour les calculs numériques.
    */

    const fragmentShaderSource = `

      /* Précision des nombres décimaux. */
      precision highp float;

      /* Coordonnées du pixel. */
      varying vec2 v_uv;

      /* Dimensions du canvas. */
      uniform vec2 u_resolution;

      /* Position normalisée de la souris. */
      uniform vec2 u_mouse;

      /* Temps écoulé depuis le lancement de l'animation. */
      uniform float u_time;


      /* ==========================================================
         A. FONCTION HASH — GÉNÉRATION PSEUDO-ALÉATOIRE
         ========================================================== */

      /*
         hash() produit une valeur pseudo-aléatoire
         à partir d'une position 3D.

         Elle sert notamment à créer des irrégularités
         dans les textures et les étoiles.
      */

      float hash(vec3 p) {

        p = fract(
          p * 0.3183099 + vec3(.1, .2, .3)
        );

        p *= 17.0;

        return fract(
          p.x * p.y * p.z *
          (p.x + p.y + p.z)
        );

      }


      /* ==========================================================
         B. FONCTION NOISE — TEXTURE ORGANIQUE
         ========================================================== */

      /*
         noise() crée un bruit continu à partir de la fonction hash.

         Cela évite une texture trop uniforme et donne
         un aspect plus organique à la surface de la sphère.
      */

      float noise(vec3 x) {

        vec3 i = floor(x);
        vec3 f = fract(x);

        /*
           Interpolation douce entre les points.
        */

        f = f * f * (3.0 - 2.0 * f);

        return mix(
          mix(
            mix(
              hash(i),
              hash(i + vec3(1,0,0)),
              f.x
            ),
            mix(
              hash(i + vec3(0,1,0)),
              hash(i + vec3(1,1,0)),
              f.x
            ),
            f.y
          ),

          mix(
            mix(
              hash(i + vec3(0,0,1)),
              hash(i + vec3(1,0,1)),
              f.x
            ),
            mix(
              hash(i + vec3(0,1,1)),
              hash(i + vec3(1,1,1)),
              f.x
            ),
            f.y
          ),

          f.z
        );

      }



      /* ==========================================================
         C. PROGRAMME PRINCIPAL DU FRAGMENT SHADER
         ========================================================== */

      void main() {

        /* Coordonnées normalisées du pixel. */
        vec2 uv = v_uv;

        /*
           Transformation des coordonnées de texture
           en coordonnées centrées autour de zéro.

           Le rapport largeur / hauteur est pris en compte
           pour éviter de déformer les proportions.
        */

        vec2 p =
          (uv - 0.5) *
          vec2(
            u_resolution.x / u_resolution.y,
            1.0
          ) * 2.2;


        /* Couleur initiale du fond. */
        vec3 color = vec3(
          0.035,
          0.045,
          0.055
        );


        /* ======================================================
           D. HALO ATMOSPHÉRIQUE
           ====================================================== */

        /*
           Le centre lumineux dépend légèrement
           de la position de la souris.

           Cela crée une sensation d'interaction.
        */

        vec2 center = vec2(
          0.62 + u_mouse.x * 0.045,
          0.02 + u_mouse.y * 0.035
        );


        /*
           Calcul de la distance entre le pixel
           et le centre lumineux.
        */

        float haloDistance = length(
          (p - center) * vec2(0.8, 1.0)
        );


        /*
           exp() produit une diminution progressive
           de la lumière à mesure que l'on s'éloigne.
        */

        float halo = exp(
          -haloDistance * 2.8
        );


        /*
           Mélange de lumière verte dans le fond.
        */

        color +=
          vec3(0.11, 0.22, 0.13) *
          halo *
          0.72;



        /* ======================================================
           E. RAYON DE CAMÉRA ET SPHÈRE 3D
           ====================================================== */

        /*
           ro = origine du rayon de caméra.
           rd = direction du rayon.

           On simule une caméra qui regarde une sphère
           placée au centre de la scène.
        */

        vec3 ro = vec3(
          0.0,
          0.0,
          4.2
        );

        vec3 rd = normalize(
          vec3(
            p - center,
            -2.5
          )
        );


        /* Centre et rayon de la sphère. */

        vec3 sphereCenter = vec3(
          0.0,
          0.0,
          0.0
        );

        float radius = 0.93;


        /*
           Calcul mathématique de l'intersection
           entre le rayon de caméra et la sphère.
        */

        vec3 oc = ro - sphereCenter;

        float b = dot(oc, rd);

        float c =
          dot(oc, oc) -
          radius * radius;

        float discriminant =
          b * b - c;


        /*
           Si discriminant est positif,
           le rayon rencontre la sphère.
        */

        if (discriminant > 0.0) {

          /* Distance jusqu'au point d'intersection. */

          float t =
            -b - sqrt(discriminant);


          /* Position du point touché. */

          vec3 hit = ro + rd * t;


          /* Normale de la surface de la sphère. */

          vec3 normal = normalize(
            hit - sphereCenter
          );


          /* ==================================================
             F. ÉCLAIRAGE ET REFLETS
             ================================================== */

          /*
             dot() calcule le produit scalaire de deux vecteurs.

             Il permet ici de mesurer l'orientation
             de la surface par rapport à la lumière.
          */

          float light = max(
            dot(
              normal,
              normalize(vec3(-0.45, 0.65, 0.8))
            ),
            0.0
          );


          /*
             Fresnel :
             accentue les contours de la sphère
             en fonction de l'angle de vision.
          */

          float fresnel = pow(
            1.0 - max(dot(normal, -rd), 0.0),
            2.5
          );


          /* ==================================================
             G. COORDONNÉES SUR LA SPHÈRE
             ================================================== */

          /*
             atan() et asin() permettent de convertir
             la normale en coordonnées angulaires.

             Elles servent à dessiner des lignes
             de longitude et de latitude.
          */

          float longitude = atan(
            normal.z,
            normal.x
          );

          float latitude = asin(
            clamp(normal.y, -1.0, 1.0)
          );


          /* ==================================================
             H. GRILLE LUMINEUSE
             ================================================== */

          /*
             smoothstep() crée une transition douce.

             sin() permet de répéter les lignes
             régulièrement sur la surface.
          */

          float longitudeLine = smoothstep(
            0.965,
            0.997,
            abs(
              sin(
                longitude * 13.0 +
                u_time * 0.00012
              )
            )
          );


          float latitudeLine = smoothstep(
            0.975,
            0.999,
            abs(
              sin(latitude * 11.0)
            )
          );


          /* On conserve la ligne la plus visible. */

          float gridLine = max(
            longitudeLine,
            latitudeLine
          );


          /* Texture irrégulière de la surface. */

          float surfaceNoise = noise(
            normal * 5.0 +
            vec3(
              0.0,
              u_time * 0.00004,
              0.0
            )
          );


          /* ==================================================
             I. COULEUR ET MATIÈRE
             ================================================== */

          /*
             mix() mélange deux couleurs.

             La texture change légèrement selon
             la valeur du bruit procédural.
          */

          vec3 base = mix(
            vec3(0.018, 0.055, 0.039),
            vec3(0.10, 0.19, 0.12),
            surfaceNoise * 0.8
          );


          /* Intensité de la lumière sur la surface. */

          vec3 lit = base * (
            0.22 + light * 0.88
          );


          /* Ajout de la grille lumineuse verte. */

          lit +=
            vec3(0.30, 0.58, 0.20) *
            gridLine *
            0.30;


          /* Ajout de lumière sur les contours. */

          lit +=
            vec3(0.58, 1.0, 0.30) *
            fresnel *
            0.58;


          /*
             Reflet spéculaire :
             donne une impression de surface brillante.
          */

          lit +=
            vec3(0.75, 1.0, 0.48) *
            pow(
              max(
                dot(
                  reflect(
                    -normalize(vec3(-.45,.65,.8)),
                    normal
                  ),
                  -rd
                ),
                0.0
              ),
              22.0
            ) *
            0.55;


          /* On intègre la sphère dans le fond. */

          color = mix(
            color,
            lit,
            1.0
          );

        }



        /* ======================================================
           J. ORBITES LUMINEUSES
           ====================================================== */

        /*
           Les orbites sont dessinées autour de la sphère.

           length() calcule une distance radiale.
           atan() calcule un angle autour du centre.
        */

        vec2 orb =
          (p - center) *
          vec2(1.0, 1.45);

        float angle = atan(
          orb.y,
          orb.x
        );

        float radial = length(orb);


        /*
           Première orbite :
           sa forme varie légèrement avec le temps.
        */

        float ringA = 1.0 - smoothstep(
          0.003,
          0.009,
          abs(
            radial -
            (
              1.10 +
              0.035 *
              sin(angle * 3.0 + u_time * 0.00025)
            )
          )
        );


        /* Deuxième orbite circulaire. */

        float ringB = 1.0 - smoothstep(
          0.002,
          0.008,
          abs(radial - 1.23)
        );


        /* Ajout des lumières orbitales. */

        color +=
          vec3(0.28, 0.48, 0.20) *
          (
            ringA * 0.13 +
            ringB * 0.07
          );



        /* ======================================================
           K. ÉTOILES PROCÉDURALES
           ====================================================== */

        /*
           Les étoiles sont générées mathématiquement.

           On divise l'écran en petites cellules.
           Chaque cellule reçoit une valeur pseudo-aléatoire.
        */

        vec2 starCell = floor(
          uv * u_resolution * 0.11
        );


        float star = hash(
          vec3(starCell, 2.0)
        );


        /* Position de l'étoile dans sa cellule. */

        vec2 starPoint =
          fract(uv * u_resolution * 0.11) -
          0.5;


        /* Forme lumineuse des petites étoiles. */

        float starDot = 1.0 - smoothstep(
          0.015,
          0.045,
          length(starPoint)
        );


        /*
           Twinkle :
           variation temporelle de l'intensité
           pour donner un effet de scintillement.
        */

        float twinkle =
          0.35 +
          0.65 *
          sin(
            u_time * 0.001 +
            star * 18.0
          );


        /*
           step() sélectionne uniquement certaines cellules.

           Cela évite d'avoir une étoile dans chaque cellule.
        */

        color +=
          vec3(0.68, 0.82, 0.57) *
          starDot *
          step(0.985, star) *
          twinkle *
          0.55;



        /* ======================================================
           L. VIGNETTAGE — ASSOMBRISSEMENT DES BORDS
           ====================================================== */

        /*
           On assombrit légèrement les contours de l'écran.

           Cela concentre l'attention vers le centre
           et améliore la profondeur de la composition.
        */

        float vignette = 1.0 - smoothstep(
          0.15,
          1.15,
          length(
            (uv - 0.5) *
            vec2(1.2, 1.0)
          )
        );


        color *=
          0.55 +
          vignette * 0.45;


        /*
           gl_FragColor représente la couleur finale
           du pixel affiché sur le canvas.

           Le quatrième composant représente l'alpha.
        */

        gl_FragColor = vec4(
          color,
          1.0
        );

      }

    `;



    /* ============================================================
       06.3 — COMPILATION DES SHADERS
       ============================================================ */

    /*
       Le navigateur ne peut pas exécuter directement
       le texte des shaders.

       Il faut d'abord les compiler.

       compileShader() prend :
       - Le type du shader.
       - Son code source.

       Elle retourne le shader compilé ou null en cas d'erreur.
    */

    const compileShader = (type, source) => {


      /* Création du shader. */

      const shader = gl.createShader(type);


      /*
         Si la création échoue, on arrête la fonction.
      */

      if (!shader) return null;


      /* Transmission du code GLSL au shader. */

      gl.shaderSource(
        shader,
        source
      );


      /* Compilation du shader. */

      gl.compileShader(shader);


      /*
         COMPILE_STATUS permet de vérifier
         si la compilation a réussi.
      */

      if (!gl.getShaderParameter(
        shader,
        gl.COMPILE_STATUS
      )) {

        /*
           On supprime le shader en cas d'erreur
           pour éviter de conserver une ressource inutile.
        */

        gl.deleteShader(shader);

        return null;

      }


      /* On retourne le shader compilé. */

      return shader;

    };



    /* ============================================================
       06.4 — CRÉATION DU PROGRAMME WEBGL
       ============================================================ */

    /*
       Compilation du Vertex Shader.
    */

    const vertexShader = compileShader(
      gl.VERTEX_SHADER,
      vertexShaderSource
    );


    /*
       Compilation du Fragment Shader.
    */

    const fragmentShader = compileShader(
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );


    /*
       createProgram() crée un programme WebGL.

       Ce programme permettra d'associer
       les deux shaders ensemble.
    */

    const program = gl.createProgram();


    /*
       On continue uniquement si les ressources existent.
    */

    if (
      vertexShader &&
      fragmentShader &&
      program
    ) {


      /* Association des shaders au programme. */

      gl.attachShader(
        program,
        vertexShader
      );

      gl.attachShader(
        program,
        fragmentShader
      );


      /* Liaison des deux shaders. */

      gl.linkProgram(program);


      /*
         Vérification de la liaison.
      */

      if (gl.getProgramParameter(
        program,
        gl.LINK_STATUS
      )) {


        /*
           useProgram() active le programme WebGL.
        */

        gl.useProgram(program);



        /* ======================================================
           06.5 — GÉOMÉTRIE : RECTANGLE PLEIN ÉCRAN
           ====================================================== */

        /*
           Le shader calcule les pixels du rectangle.

           On utilise deux triangles pour recouvrir
           toute la surface du canvas.
        */

        const buffer = gl.createBuffer();


        /*
           ARRAY_BUFFER est un type de mémoire
           utilisé pour stocker les données des sommets.
        */

        gl.bindBuffer(
          gl.ARRAY_BUFFER,
          buffer
        );


        /*
           Float32Array stocke les coordonnées numériques
           des sommets sous forme de nombres flottants 32 bits.
        */

        gl.bufferData(
          gl.ARRAY_BUFFER,

          new Float32Array([

            -1, -1,
             1, -1,
            -1,  1,

            -1,  1,
             1, -1,
             1,  1

          ]),

          gl.STATIC_DRAW
        );


        /*
           getAttribLocation() récupère l'emplacement
           de a_position dans le Vertex Shader.
        */

        const positionLocation =
          gl.getAttribLocation(
            program,
            "a_position"
          );


        /*
           On active l'attribut.
        */

        gl.enableVertexAttribArray(
          positionLocation
        );


        /*
           On explique à WebGL comment lire les coordonnées :

           2 = deux valeurs par sommet (X et Y).
           gl.FLOAT = nombres flottants.
           false = aucune normalisation.
           0 = aucun espacement supplémentaire.
           0 = début des données.
        */

        gl.vertexAttribPointer(
          positionLocation,
          2,
          gl.FLOAT,
          false,
          0,
          0
        );



        /* ======================================================
           06.6 — VARIABLES UNIFORMES
           ====================================================== */

        /*
           Les uniforms sont des variables envoyées
           depuis JavaScript vers les shaders.

           Contrairement aux attributs, elles peuvent être
           partagées par tous les sommets et pixels.
        */

        const resolutionLocation =
          gl.getUniformLocation(
            program,
            "u_resolution"
          );

        const mouseLocation =
          gl.getUniformLocation(
            program,
            "u_mouse"
          );

        const timeLocation =
          gl.getUniformLocation(
            program,
            "u_time"
          );



        /* ======================================================
           06.7 — VARIABLES DE LA SCÈNE
           ====================================================== */

        /*
           Position de la souris normalisée.

           x = position horizontale.
           y = position verticale.
        */

        const pointer = {
          x: 0,
          y: 0
        };


        /*
           frame conserve l'identifiant de l'animation.

           Il sera utile pour arrêter et relancer
           requestAnimationFrame().
        */

        let frame = 0;


        /*
           visible indique si la page est actuellement visible.

           document.hidden vaut true lorsque l'onglet
           est masqué ou que l'utilisateur est ailleurs.
        */

        let visible = !document.hidden;



        /* ======================================================
           06.8 — REDIMENSIONNEMENT DU CANVAS
           ====================================================== */

        /*
           Fonction resize()

           Elle adapte la résolution du canvas
           aux dimensions réelles de l'écran.
        */

        const resize = () => {


          /*
             devicePixelRatio indique le rapport entre
             les pixels physiques et les pixels CSS.

             On limite sa valeur à 1.7 pour éviter
             une consommation graphique trop importante.
          */

          const ratio = Math.min(
            window.devicePixelRatio || 1,
            1.7
          );


          /*
             clientWidth et clientHeight récupèrent
             les dimensions CSS du canvas.
          */

          const width = Math.max(
            1,
            Math.floor(canvas.clientWidth * ratio)
          );

          const height = Math.max(
            1,
            Math.floor(canvas.clientHeight * ratio)
          );


          /*
             On applique les dimensions internes du canvas.

             Ces dimensions déterminent la résolution réelle
             de l'image calculée par WebGL.
          */

          canvas.width = width;
          canvas.height = height;


          /*
             viewport() indique à WebGL quelle partie
             du canvas doit être utilisée pour le rendu.
          */

          gl.viewport(
            0,
            0,
            width,
            height
          );


          /*
             On envoie les nouvelles dimensions
             au Fragment Shader.
          */

          gl.uniform2f(
            resolutionLocation,
            width,
            height
          );

        };



        /* ======================================================
           06.9 — BOUCLE DE RENDU WEBGL
           ====================================================== */

        /*
           render() est la fonction principale de l'animation.

           Elle sera appelée à chaque nouvelle image
           du navigateur.
        */

        const render = (time) => {


          /*
             Si l'onglet n'est pas visible,
             on arrête la boucle.
          */

          if (!visible) {

            frame = 0;

            return;

          }


          /*
             Envoi du temps au shader.

             time est fourni automatiquement
             par requestAnimationFrame().
          */

          gl.uniform1f(
            timeLocation,
            time
          );


          /*
             Envoi de la position de la souris.
          */

          gl.uniform2f(
            mouseLocation,
            pointer.x,
            pointer.y
          );


          /*
             drawArrays() demande à WebGL de dessiner
             les triangles qui composent notre rectangle.

             TRIANGLES = primitive utilisée.
             0 = premier sommet.
             6 = nombre total de sommets.
          */

          gl.drawArrays(
            gl.TRIANGLES,
            0,
            6
          );


          /*
             On programme l'image suivante.
          */

          frame = requestAnimationFrame(render);

        };



        /* ======================================================
           06.10 — ÉVÉNEMENTS DE LA SCÈNE
           ====================================================== */

        /*
           Redimensionnement du navigateur.

           On recalcule la résolution du canvas.
        */

        window.addEventListener(
          "resize",
          resize,
          { passive: true }
        );


        /*
           Interaction avec la souris.

           On transforme les coordonnées du pointeur
           en valeurs comprises approximativement entre -1 et +1.

           Cela permet au shader de déplacer légèrement
           le halo lumineux.
        */

        window.addEventListener(
          "mousemove",
          (event) => {

            pointer.x =
              (
                event.clientX /
                Math.max(1, window.innerWidth) -
                0.5
              ) * 2;

            pointer.y =
              (
                0.5 -
                event.clientY /
                Math.max(1, window.innerHeight)
              ) * 2;

          },
          { passive: true }
        );


        /* ======================================================
           06.11 — OPTIMISATION DE LA PERFORMANCE
           ====================================================== */

        /*
           visibilitychange se déclenche lorsque
           la visibilité de l'onglet change.

           On arrête le rendu lorsque l'utilisateur
           quitte l'onglet pour économiser des ressources.
        */

        document.addEventListener(
          "visibilitychange",
          () => {


            visible = !document.hidden;


            /*
               Si l'onglet devient invisible :
               on annule l'animation en cours.
            */

            if (!visible && frame) {

              cancelAnimationFrame(frame);

              frame = 0;

            }


            /*
               Si l'utilisateur revient :
               on relance la scène.
            */

            if (visible && !frame) {

              frame = requestAnimationFrame(render);

            }

          }
        );


        /*
           Initialisation de la taille du canvas.
        */

        resize();


        /*
           Premier lancement de la scène WebGL.
        */

        frame = requestAnimationFrame(render);

      } else {

        /*
           Si la liaison des shaders échoue,
           on masque le canvas.

           Le fond CSS reste visible.
        */

        canvas.style.display = "none";

      }

    } else {

      /*
         Si la compilation d'un shader échoue,
         le canvas est masqué.
      */

      canvas.style.display = "none";

    }

  } else if (canvas) {

    /*
       Solution de secours :

       Si WebGL est indisponible ou si les animations
       doivent être réduites, on masque le canvas.

       Le design CSS prend le relais.
    */

    canvas.style.display = "none";

  }



  /* ================================================================
     07 — NAVIGATION ACTIVE SELON LA SECTION VISIBLE
     ================================================================ */

  /*
     OBJECTIF :
     Mettre en évidence le lien de navigation
     correspondant à la section actuellement consultée.

     Exemple :
     Lorsque l'utilisateur arrive dans #projects,
     le lien correspondant reçoit aria-current="location".
  */


  /*
     On récupère tous les liens qui pointent vers
     une ancre interne de la navigation principale.
  */

  const navLinks = document.querySelectorAll(
    ".main-nav a[href^='#']"
  );


  /*
     On récupère toutes les sections HTML possédant un id.
  */

  const sections = document.querySelectorAll(
    "main section[id]"
  );


  /*
     On vérifie que le navigateur possède IntersectionObserver
     et que des liens de navigation existent.
  */

  if (
    "IntersectionObserver" in window &&
    navLinks.length
  ) {


    /*
       Création de l'observateur des sections.
    */

    const sectionObserver = new IntersectionObserver(

      (entries) => {

        entries.forEach((entry) => {


          /*
             On ignore les sections qui ne sont pas visibles.
          */

          if (!entry.isIntersecting) return;


          /*
             On parcourt tous les liens de navigation.
          */

          navLinks.forEach((link) => {


            /*
               On compare le href du lien avec l'id
               de la section actuellement visible.

               Exemple :
               href="#projects"
               id="projects"
            */

            const active =
              link.getAttribute("href") ===
              `#${entry.target.id}`;


            /*
               Si le lien correspond à la section :
               on ajoute aria-current.

               Sinon :
               on retire cet attribut.
            */

            if (active) {

              link.setAttribute(
                "aria-current",
                "location"
              );

            } else {

              link.removeAttribute(
                "aria-current"
              );

            }

          });

        });

      },

      {
        /*
           rootMargin définit la zone de détection.

           Ici, on réduit la zone centrale afin que
           le changement de navigation se fasse
           lorsque la section occupe une position
           pertinente dans la fenêtre.
        */

        rootMargin: "-42% 0px -48% 0px"

      }

    );


    /*
       On commence à observer toutes les sections.
    */

    sections.forEach((section) => {

      sectionObserver.observe(section);

    });

  }



  /* ================================================================
     08 — ANNÉE AUTOMATIQUE
     ================================================================ */

  /*
     OBJECTIF :
     Mettre automatiquement à jour l'année du copyright.

     Cela évite de modifier manuellement le HTML
     chaque nouvelle année.
  */


  /*
     On récupère l'élément HTML portant l'attribut :
     data-current-year.

     Exemple :
     <span data-current-year></span>
  */

  const year = document.querySelector(
    "[data-current-year]"
  );


  /*
     On vérifie que l'élément existe avant de modifier son contenu.

     new Date() récupère la date actuelle.

     getFullYear() retourne l'année sur quatre chiffres.

     textContent modifie le texte visible de l'élément.
  */

  if (year) {

    year.textContent = String(
      new Date().getFullYear()
    );

  }


  /* ================================================================
     FIN DU SCRIPT
     BABAINA® — DIGITAL EXPERIENCES
     ================================================================ */

})();
