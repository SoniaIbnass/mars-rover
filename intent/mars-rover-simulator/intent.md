# Intent : Simulateur de trajectoire Mars Rover
Auteur : non renseigné.

## Problème
Une fois sur Mars, le rover ne peut pas être piloté en temps réel : le signal met plusieurs minutes à parcourir la distance Terre-Mars. L'équipe doit donc lui transmettre à l'avance une séquence de commandes de déplacement, qu'il exécute seul sur un terrain comportant des obstacles. Envoyer une séquence non testée expose au risque qu'elle échoue ou bloque le rover, sans possibilité de correction immédiate.

## Résultat proposé
Un simulateur qui permet de tester une séquence de commandes avant de l'envoyer au rover. Il reçoit un point de départ (position (x, y) et orientation N/S/E/W), une carte plaçant les obstacles, et une liste de commandes de déplacement (avancer, tourner à droite/gauche de 90°). Il interprète ces commandes et affiche la position et la direction finales du rover, le rover restant immobile lorsqu'un obstacle bloque son avancée.

## Utilisateurs et systèmes concernés
- L'équipe qui construit le rover, qui utilise le simulateur pour valider une séquence de commandes avant de l'envoyer au rover.
- Le rover Mars, système cible dont le comportement est simulé.

## Contraintes
- Entrées : un point de départ (x, y), une orientation initiale (N, S, E, W), une carte plaçant les obstacles, une liste de commandes.
- Déplacements possibles : avancer, tourner à droite de 90°, tourner à gauche de 90°.
- Le rover reste immobile lorsqu'un obstacle bloque son avancée.
- La carte peut utiliser les symboles 🟩 et 🌳, ou les symboles 🟫 et 🪨.

## Questions ouvertes
- Qui est l'auteur de cette intention (nom, rôle) ?
- Pour chaque paire de symboles, lequel représente un obstacle et lequel représente un terrain libre ?
- Le rover peut-il sortir des limites de la carte (bord traité comme obstacle, comportement cyclique, ou autre) ?
- Le simulateur doit-il signaler qu'un obstacle a interrompu la séquence avant son terme, ou se limiter à afficher la position/direction finale ?
