# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Nature du dépôt

Ce dépôt suit un workflow **Intent → Spec → Build** piloté par des skills Claude Code
dédiées (`.claude/skills/intent`, `.claude/skills/spec`). Il n'y a pas encore de code
produit : à ce stade, le dépôt ne contient que des documents d'intention et de
spécification. Il n'y a ni build, ni lint, ni tests à exécuter.

- `intent/<slug>/intent.md` — besoin formalisé (skill `intent`), rédigé sans décision
  produit ni contrainte technique inventée. Toute question non tranchée reste dans sa
  section « Questions ouvertes ».
- `intent/<slug>/spec.md` — spécification d'une intention acceptée (skill `spec`,
  invoquée via `/spec <chemin intent.md>`), avec exigences numérotées (EX-XX), scénarios,
  conception proposée, réserves et contexte de génération (prompt exact + commit des
  skills utilisées).

## Règles de workflow à respecter

- **Une phase à la fois, avec validation humaine explicite avant tout commit/push/PR.**
  Ni `intent`, ni `spec` ne commitent ou n'ouvrent de pull request sans confirmation
  explicite de l'utilisateur.
- **Ne jamais merger une pull request soi-même** — le Product Owner l'accepte en mergeant.
- **Une intention acceptée** = mergée sur `main` ET la décision d'acceptation vérifiée
  dans la pull request (la présence sur `main` seule ne suffit pas).
- Les décisions produit (symboles de carte, gestion des bords, stack technique, etc.)
  appartiennent au Product Owner. Ne pas trancher à sa place ni fabriquer de contrainte :
  consigner l'inconnue en « Questions ouvertes » ou en « Réserves » et attendre la réponse.
- Chaque nouvelle phase se travaille sur une branche dédiée créée depuis la dernière
  version de `main` (`claude/intent-<slug>` pour une intention ; nom équivalent pour une
  spec), jamais directement sur `main`.
- La section « Contexte de génération » d'une spec doit toujours citer le prompt exact
  et le commit Git réel des skills utilisées — ne pas inventer un numéro de commit.

## Projet actuel : simulateur Mars Rover

`intent/mars-rover-simulator/` contient l'intention et la spec acceptées d'un simulateur
qui interprète une séquence de commandes (avancer, tourner à droite/gauche de 90°) sur
une carte à obstacles, et affiche la position/orientation finale du rover (avec
signalement d'un arrêt anticipé en cas d'obstacle — voir EX-06 et EX-08 dans `spec.md`).

Stack technique actée dans `spec.md` (section « Conception proposée ») : artefact Claude
Code (web) auto-contenu — une seule page HTML, JavaScript vanilla inline, pas de build ni
de backend, carte rendue en grille CSS (`display: grid`). Aucune persistance, un
utilisateur à la fois. La phase Build (découpage des travaux, code) n'a pas encore
démarré ; ne pas anticiper cette phase depuis les skills `intent`/`spec`.

## Erreurs récurrentes

Lorsqu’une même erreur se répète deux fois, propose une instruction courte et précise pour l’éviter. Appuie-toi sur les erreurs observées et fais valider cette instruction avant de l’ajouter à CLAUDE.md.

Si une instruction devient obsolète, propose sa correction ou son retrait et attends la validation avant de modifier le fichier.

## Vérifier ton travail

- `make test` lance les tests du simulateur.
```
node --test build/mars-rover-simulator/simulation.test.mjs
TAP version 13
# Subtest: EX-01 — initialise le rover au point de départ sans exécuter de commande
ok 1 - EX-01 — initialise le rover au point de départ sans exécuter de commande
  ---
  duration_ms: 3.299585
  type: 'test'
  ...
# Subtest: EX-02 — distingue les symboles obstacle (🌳, 🪨) des symboles libres (🟩, 🟫)
ok 2 - EX-02 — distingue les symboles obstacle (🌳, 🪨) des symboles libres (🟩, 🟫)
  ---
  duration_ms: 0.297815
  type: 'test'
  ...
# Subtest: EX-02 — une case obstacle en (1, 0) bloque le rover qui s’y dirige
ok 3 - EX-02 — une case obstacle en (1, 0) bloque le rover qui s’y dirige
  ---
  duration_ms: 0.208879
  type: 'test'
  ...
# Subtest: EX-03 — avancer déplace le rover d’une case dans son orientation
ok 4 - EX-03 — avancer déplace le rover d’une case dans son orientation
  ---
  duration_ms: 0.134552
  type: 'test'
  ...
# Subtest: EX-04 — tourner à droite pivote l’orientation sans changer la position
ok 5 - EX-04 — tourner à droite pivote l’orientation sans changer la position
  ---
  duration_ms: 0.215058
  type: 'test'
  ...
# Subtest: EX-05 — tourner à gauche pivote l’orientation sans changer la position
ok 6 - EX-05 — tourner à gauche pivote l’orientation sans changer la position
  ---
  duration_ms: 0.199519
  type: 'test'
  ...
# Subtest: EX-06 — un obstacle immobilise le rover et interrompt la séquence
ok 7 - EX-06 — un obstacle immobilise le rover et interrompt la séquence
  ---
  duration_ms: 0.199217
  type: 'test'
  ...
# Subtest: EX-07 — affiche la position et l’orientation finales après exécution complète
ok 8 - EX-07 — affiche la position et l’orientation finales après exécution complète
  ---
  duration_ms: 0.133755
  type: 'test'
  ...
# Subtest: EX-08 — signale l’arrêt anticipé de la séquence dû à un obstacle
ok 9 - EX-08 — signale l’arrêt anticipé de la séquence dû à un obstacle
  ---
  duration_ms: 0.326815
  type: 'test'
  ...
# Subtest: sortie par le bord nord traitée comme un obstacle
ok 10 - sortie par le bord nord traitée comme un obstacle
  ---
  duration_ms: 0.455099
  type: 'test'
  ...
# Subtest: sortie par le bord sud traitée comme un obstacle
ok 11 - sortie par le bord sud traitée comme un obstacle
  ---
  duration_ms: 0.22882
  type: 'test'
  ...
# Subtest: sortie par le bord est traitée comme un obstacle
ok 12 - sortie par le bord est traitée comme un obstacle
  ---
  duration_ms: 0.113932
  type: 'test'
  ...
# Subtest: sortie par le bord ouest traitée comme un obstacle
ok 13 - sortie par le bord ouest traitée comme un obstacle
  ---
  duration_ms: 0.098482
  type: 'test'
  ...
# Subtest: une séquence vide laisse le rover inchangé
ok 14 - une séquence vide laisse le rover inchangé
  ---
  duration_ms: 0.106627
  type: 'test'
  ...
# Subtest: un cycle complet de rotations à droite revient à l’orientation de départ
ok 15 - un cycle complet de rotations à droite revient à l’orientation de départ
  ---
  duration_ms: 0.084749
  type: 'test'
  ...
# Subtest: un cycle complet de rotations à gauche revient à l’orientation de départ
ok 16 - un cycle complet de rotations à gauche revient à l’orientation de départ
  ---
  duration_ms: 0.079164
  type: 'test'
  ...
1..16
# tests 16
# suites 0
# pass 16
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 104.215474
```
- `make run` rejoue le scénario de démonstration.
```
node build/mars-rover-simulator/demo.mjs
Position finale : (1, 1)
Orientation finale : E
Séquence interrompue par un obstacle : non
```

Lance ces deux commandes avant de dire qu'une tâche est finie, et donne leur
sortie dans ton compte rendu. Ne corrige jamais un test pour le faire passer,
n'en supprime aucun et n'en ignore aucun.
