# Spec : Simulateur de trajectoire Mars Rover

Intention de référence : intent/mars-rover-simulator/intent.md

## Périmètre

Le simulateur reçoit un point de départ (position et orientation), une carte plaçant des obstacles, et une séquence de commandes de déplacement. Il interprète cette séquence sur la carte et affiche la position et l'orientation finales du rover. Le rover reste immobile face à un obstacle, y compris le bord de la carte, et l'exécution de la séquence s'arrête dès ce blocage.

Est hors périmètre tout pilotage en temps réel du rover, toute transmission de commandes au rover physique, et toute planification automatique de trajectoire (le simulateur n'évalue qu'une séquence fournie).

## Exigences

### EX-01 — Interpréter le point de départ

Origine dans l'intention : « Il reçoit un point de départ (position (x, y) et orientation N/S/E/W) »
Comportement attendu : Le simulateur accepte en entrée une position (x, y) et une orientation initiale parmi N, S, E, W, et initialise le rover à cet état avant d'exécuter la séquence de commandes.

Scénario
- Situation de départ : Position (0, 0), orientation N, carte valide fournie.
- Action : Initialisation du simulateur avec ces entrées, aucune commande exécutée.
- Résultat attendu : Le rover est positionné en (0, 0), orienté N.

### EX-02 — Interpréter la carte et distinguer obstacle et terrain libre

Origine dans l'intention : « une carte plaçant les obstacles » ; « La carte peut utiliser les symboles 🟩 et 🌳, ou les symboles 🟫 et 🪨. »
Décision Product Owner (2026-09-22) : 🌳 et 🪨 représentent un obstacle ; 🟩 et 🟫 représentent un terrain libre.
Comportement attendu : Le simulateur lit la carte fournie et détermine, pour chaque case, si elle est libre (🟩 ou 🟫) ou occupée par un obstacle (🌳 ou 🪨).

Scénario
- Situation de départ : Carte contenant une case 🌳 en (1, 0) et des cases 🟩 ailleurs.
- Action : Lecture de la carte par le simulateur.
- Résultat attendu : La case (1, 0) est identifiée comme obstacle, les autres cases comme libres.

### EX-03 — Avancer

Origine dans l'intention : « Déplacements possibles : avancer, tourner à droite de 90°, tourner à gauche de 90°. »
Comportement attendu : La commande « avancer » déplace le rover d'une case dans la direction de son orientation courante, si cette case est libre et dans les limites de la carte.

Scénario
- Situation de départ : Rover en (0, 0), orienté N, case (0, 1) libre.
- Action : Exécution de la commande « avancer ».
- Résultat attendu : Le rover est en (0, 1), orienté N.

### EX-04 — Tourner à droite

Origine dans l'intention : « tourner à droite de 90° »
Comportement attendu : La commande « tourner à droite » fait pivoter l'orientation du rover de 90° dans le sens horaire (N→E→S→W→N), sans changer sa position.

Scénario
- Situation de départ : Rover en (2, 2), orienté N.
- Action : Exécution de la commande « tourner à droite ».
- Résultat attendu : Le rover reste en (2, 2), orienté E.

### EX-05 — Tourner à gauche

Origine dans l'intention : « tourner à gauche de 90° »
Comportement attendu : La commande « tourner à gauche » fait pivoter l'orientation du rover de 90° dans le sens antihoraire (N→W→S→E→N), sans changer sa position.

Scénario
- Situation de départ : Rover en (2, 2), orienté N.
- Action : Exécution de la commande « tourner à gauche ».
- Résultat attendu : Le rover reste en (2, 2), orienté W.

### EX-06 — Rester immobile face à un obstacle et interrompre la séquence

Origine dans l'intention : « le rover restant immobile lorsqu'un obstacle bloque son avancée » ; question ouverte sur la sortie des limites de la carte.
Décision Product Owner (2026-09-22) : le bord de la carte est traité comme un obstacle. Interprétation retenue de l'intention (cohérente avec la question ouverte sur le signalement d'un « arrêt anticipé ») : rencontrer un obstacle interrompt l'exécution de la séquence ; les commandes suivantes ne sont pas exécutées.
Comportement attendu : Lorsque la commande « avancer » désigne une case occupée par un obstacle ou située hors des limites de la carte, le rover ne se déplace pas et l'exécution de la séquence de commandes s'arrête immédiatement.

Scénario
- Situation de départ : Rover en (0, 0), orienté N, case (0, 1) occupée par un obstacle (🌳ou 🪨), séquence = [avancer, tourner à droite, avancer].
- Action : Exécution de la séquence.
- Résultat attendu : Le rover reste en (0, 0), orienté N ; les commandes « tourner à droite » et « avancer » qui suivent ne sont pas exécutées.

### EX-07 — Afficher la position et l'orientation finales

Origine dans l'intention : « il affiche la position et la direction finales du rover »
Comportement attendu : Une fois la séquence exécutée (en totalité ou jusqu'à son interruption par un obstacle), le simulateur affiche la position (x, y) et l'orientation finales du rover.

Scénario
- Situation de départ : Rover en (0, 0), orienté N, séquence = [avancer, tourner à droite, avancer], aucun obstacle sur le trajet.
- Action : Exécution complète de la séquence.
- Résultat attendu : Affichage de la position (1, 1) et de l'orientation E.

### EX-08 — Signaler l'arrêt anticipé de la séquence

Origine dans l'intention : question ouverte « Le simulateur doit-il signaler qu'un obstacle a interrompu la séquence avant son terme, ou se limiter à afficher la position/direction finale ? »
Décision Product Owner (2026-09-22) : signaler l'arrêt anticipé.
Comportement attendu : Lorsque l'exécution de la séquence s'interrompt suite à un obstacle (EX-06), le simulateur l'indique explicitement, en complément de la position et de l'orientation finales (EX-07).

Scénario
- Situation de départ : Rover en (0, 0), orienté N, case (0, 1) occupée par un obstacle, séquence = [avancer, tourner à droite, avancer].
- Action : Exécution de la séquence.
- Résultat attendu : Affichage de la position (0, 0), de l'orientation N, et d'une indication explicite que la séquence a été interrompue par un obstacle avant son terme.

## Conception proposée

- **Représentation de la carte** (proposition à valider) : une grille 2D de dimensions fixes (largeur × hauteur), chaque case classée « libre » ou « obstacle » selon EX-02. Les limites de la grille définissent le périmètre hors duquel toute case est traitée comme un obstacle (EX-06).
- **Repère de coordonnées** (accepté, décision Product Owner du 2026-09-22) : x croît vers l'est, y croît vers le nord (convention mathématique standard), conditionnant le sens des déplacements associés à chaque orientation (N : y+1, S : y-1, E : x+1, W : x-1).
- **Cycle des orientations** (accepté, découle directement d'EX-04/EX-05) : rotation à droite N→E→S→W→N ; rotation à gauche N→W→S→E→N.
- **Boucle d'exécution** (accepté, découle d'EX-06/EX-07/EX-08) : les commandes sont traitées dans l'ordre. Une commande de rotation s'applique toujours. Une commande « avancer » est évaluée avant d'être appliquée : si la case cible est libre et dans les limites, le rover s'y déplace ; sinon le rover reste immobile et le traitement de la séquence s'arrête, avec le signalement prévu par EX-08.
- **Stack technique** (accepté, décision Product Owner du 2026-09-22) : le simulateur est réalisé sous forme d'artefact Claude Code (web) auto-contenu — une seule page HTML, sans étape de build ni backend. Logique en JavaScript vanilla inline (la logique de simulation, EX-01 à EX-08, est une simple machine à états ; aucun framework n'est nécessaire). Rendu de la carte en grille CSS (`display: grid`), une case par cellule, le rover représenté par une icône orientée selon EX-04/EX-05. Aucune persistance ni état partagé entre utilisateurs : chaque test de séquence est éphémère, cohérent avec l'usage décrit dans l'intention (l'équipe teste une séquence avant envoi au rover, un utilisateur à la fois).

## Réserves

Aucune réserve non résolue à ce stade : les trois ambiguïtés qui empêchaient de préciser le comportement (symboles de la carte, sortie des limites, signalement d'un arrêt anticipé) ont été tranchées par le Product Owner le 2026-09-22 et sont intégrées aux exigences EX-02, EX-06 et EX-08 ci-dessus.

## Questions ouvertes

- **Auteur de l'intention (nom, rôle)** : reste ouverte, l'intention ne renseigne pas cette information. Sans effet sur les exigences ni sur le passage en phase Build ; à documenter si une réponse humaine devient disponible.
- **Symboles de la carte (obstacle vs. terrain libre)** : répondue par le Product Owner le 2026-09-22 — voir EX-02.
- **Sortie des limites de la carte** : répondue par le Product Owner le 2026-09-22 — voir EX-06.
- **Signalement d'un arrêt anticipé dû à un obstacle** : répondue par le Product Owner le 2026-09-22 — voir EX-08.

## Contexte de génération

### Demande initiale

`/spec intent/mars-rover/intent.md`

Note : le chemin fourni ne correspond à aucun fichier existant ; le fichier `intent/mars-rover-simulator/intent.md` (seule intention présente dans le dépôt) a été retenu comme cible.

### Skills utilisées

| Chemin | Commit Git de la version utilisée |
| --- | --- |
| .claude/skills/spec/SKILL.md | 8dc579fe8f5a87d199fb3755b0e8c5434f0bdefa |

### Révisions

- 2026-09-22 : demande « je veux une stack technique compatible avec les artefacts claude code (web) ». Ajout du choix de stack technique à la section Conception proposée (décision Product Owner). Skill utilisée : .claude/skills/spec/SKILL.md, commit 8dc579fe8f5a87d199fb3755b0e8c5434f0bdefa.
- 2026-09-22 : demande « mets à jour spec.md pour indiquer le repère de coordonnées comme validé ». Le repère de coordonnées (x vers l'est, y vers le nord) passe de « proposition à valider » à « accepté, décision Product Owner » dans la section Conception proposée. Édition directe en phase Build (hors invocation de la skill spec).
