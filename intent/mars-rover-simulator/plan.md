# Plan de réalisation — Simulateur Mars Rover (phase Build)

## Contexte

`intent/mars-rover-simulator/intent.md` et `spec.md` sont acceptés (toutes les questions
ouvertes ont été tranchées par le Product Owner le 2026-09-22 : symboles de carte, bord
traité comme obstacle, signalement de l'arrêt anticipé). La spec fige déjà la stack
technique (artefact Claude Code web auto-contenu, HTML + JS vanilla inline, grille CSS,
sans build ni backend) et la conception (repère de coordonnées, cycle des rotations,
boucle d'exécution). La phase Build peut donc démarrer directement sur l'implémentation,
sans nouvelle clarification produit.

Ce plan couvre uniquement la mise en œuvre technique (fichiers, ordre, tests). Aucune
décision produit n'est rouverte.

**Première étape immédiate** : enregistrer ce plan dans
`intent/mars-rover-simulator/plan.md` et commiter uniquement ce fichier sur la branche
`claude/nice-mccarthy-joywwm` (déjà créée depuis `main`). Aucun autre fichier n'est créé
ni commité à ce stade — l'implémentation (étapes 2 et suivantes ci-dessous) fait l'objet
de commits séparés, un par étape, avec validation avant chaque commit.

## Fichiers à créer

Sous un nouveau dossier `src/mars-rover-simulator/` (`build/` est exclu par
`.gitignore`, gabarit Python générique — non lié à ce projet) :

- **`simulation.js`** — logique pure de simulation (aucune manipulation du DOM) :
  état du rover (position, orientation), rotation droite/gauche (EX-04, EX-05),
  lecture de la carte et distinction case libre/obstacle (EX-02), avancer avec
  vérification de la case cible et des limites de la carte (EX-03, EX-06), exécution
  de la séquence commande par commande avec arrêt immédiat sur obstacle (EX-06),
  résultat final incluant position, orientation et indicateur d'arrêt anticipé
  (EX-07, EX-08). Fonctions petites, sans effet de bord caché (retournent un nouvel
  état plutôt que de muter en place), conformément à la skill clean-code du dépôt.
- **`simulation.test.mjs`** — tests unitaires avec le test runner natif de Node
  (`node:test` + `node:assert`), sans dépendance à installer ni étape de build : un
  test par scénario EX-01 à EX-08 repris de `spec.md`, plus les cas limites non
  couverts explicitement (sortie par les 4 bords de la carte, séquence vide, cycle
  complet des rotations dans les deux sens).
- **`index.html`** — structure de page : formulaire d'entrée (position/orientation de
  départ, carte, séquence de commandes), zone de rendu de la carte en grille CSS
  (`display: grid`), zone d'affichage du résultat.
- **`styles.css`** — mise en page de la grille et représentation visuelle du rover
  orienté selon EX-04/EX-05.
- **`app.js`** — orchestration DOM : lecture du formulaire, appel à `simulation.js`,
  rendu de la grille et du rover, affichage de la position/orientation finales et du
  message d'arrêt anticipé le cas échéant (EX-07, EX-08).

Aucun fichier existant à modifier : le dépôt ne contient encore aucun code.

## Ordre de travail

Une étape = un commit, validé avant d'être créé (une phase à la fois, cf. CLAUDE.md) :

1. `intent/mars-rover-simulator/plan.md` (ce plan) — commit isolé.
2. `simulation.js` — logique pure (EX-01 à EX-06, EX-08).
3. `simulation.test.mjs` — tests des scénarios EX-01 à EX-08 + cas limites ; exécutés
   (`node --test`) avant de passer à l'IHM.
4. `index.html` + `styles.css` — structure de page et rendu de grille.
5. `app.js` — intégration de `simulation.js` à l'IHM (EX-07, EX-08 côté affichage).
6. Vérification manuelle dans un navigateur des scénarios clés de la spec (aucune
   automatisation possible sans framework DOM, hors périmètre vu la taille du projet).

La publication finale sous forme d'artefact Claude Code multi-fichiers (`simulation.js`,
`app.js`, `styles.css`, `index.html` publiés tels quels, sans fusion préalable) est une
étape distincte, après validation humaine du code, et n'est pas couverte par ce plan
d'implémentation.

## Tests prévus

- Tests unitaires Node natifs sur `simulation.js`, un par exigence EX-01 à EX-08 (repris
  des scénarios de `spec.md`), plus : sortie par chacun des 4 bords, séquence vide,
  rotation complète dans les deux sens.
- Vérification manuelle des rendus (grille, orientation du rover, message d'arrêt
  anticipé) dans un navigateur — pas de test automatisé de l'IHM, cohérent avec
  l'absence de backend/build imposée par la spec.
- Pas de suite e2e : hors périmètre pour un artefact de cette taille.

## Organisation multi-fichiers et publication (tranché)

La spec parle d'un « JavaScript vanilla inline » en une seule page. Séparer
`simulation.js`/`app.js`/`styles.css` pendant le développement permet de tester la
logique avec Node sans backend ni build (voir Tests prévus). Décision : cette
séparation est conservée jusqu'à la livraison — l'artefact est publié tel quel en
artefact multi-fichiers via le support natif du tool Artifact, **sans** étape de
recombinaison manuelle en un unique fichier HTML.

Raison du choix : une recombinaison manuelle à la publication est un geste non testé,
fait après coup — elle pourrait faire diverger le code livré du code testé (oubli d'un
correctif, erreur de copier-coller, mauvais ordre de scripts). Publier les fichiers
tels quels élimine ce risque sans rien changer à la stratégie de tests.

Conséquence assumée : l'artefact final n'est pas un unique fichier `.html` portable hors
de l'environnement Claude Artifact ; le partager ailleurs suppose de transmettre les 4
fichiers ensemble. Cohérent avec l'usage décrit dans l'intention (l'équipe teste une
séquence via l'artefact avant envoi au rover) ; aucun besoin de fichier `.html` isolé
n'a été identifié.

## Vérification

- `node --test src/mars-rover-simulator/simulation.test.mjs` doit passer entièrement
  après l'étape 3.
- Ouverture de `index.html` dans un navigateur pour rejouer manuellement les scénarios
  EX-01, EX-03 à EX-08 après l'étape 5.
