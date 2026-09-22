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
