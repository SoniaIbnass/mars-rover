// Logique pure de simulation du Mars Rover (EX-01 à EX-08 de spec.md).
// Aucune manipulation du DOM ici : voir app.js pour l'orchestration IHM.
// Repère : x croît vers l'est, y croît vers le nord (spec.md, Conception proposée).
// Carte : tableau de lignes `map[y][x]`, la ligne d'indice 0 correspond à y = 0.

(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.MarsRoverSimulation = api;
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  const ORIENTATIONS = ['N', 'E', 'S', 'W'];

  const OBSTACLE_SYMBOLS = new Set(['🌳', '🪨']);
  const FREE_SYMBOLS = new Set(['🟩', '🟫']);

  const FORWARD_DELTA = {
    N: { dx: 0, dy: 1 },
    E: { dx: 1, dy: 0 },
    S: { dx: 0, dy: -1 },
    W: { dx: -1, dy: 0 },
  };

  function createState(x, y, orientation) {
    return { x, y, orientation };
  }

  function rotateRight(orientation) {
    const index = ORIENTATIONS.indexOf(orientation);
    return ORIENTATIONS[(index + 1) % ORIENTATIONS.length];
  }

  function rotateLeft(orientation) {
    const index = ORIENTATIONS.indexOf(orientation);
    return ORIENTATIONS[(index + ORIENTATIONS.length - 1) % ORIENTATIONS.length];
  }

  // EX-06 : le bord de la carte est traité comme un obstacle.
  function isWithinBounds(map, x, y) {
    return y >= 0 && y < map.length && x >= 0 && x < map[y].length;
  }

  // EX-02 : distingue case libre (🟩, 🟫) et case occupée par un obstacle (🌳, 🪨).
  function isObstacleCell(map, x, y) {
    return OBSTACLE_SYMBOLS.has(map[y][x]);
  }

  // EX-06 : une case est bloquante si elle est hors limites ou occupée par un obstacle.
  function isBlocked(map, x, y) {
    if (!isWithinBounds(map, x, y)) return true;
    return isObstacleCell(map, x, y);
  }

  function targetPosition(state) {
    const { dx, dy } = FORWARD_DELTA[state.orientation];
    return { x: state.x + dx, y: state.y + dy };
  }

  // EX-03/EX-06 : avance d'une case si elle est libre et dans les limites, sinon reste immobile.
  function advance(state, map) {
    const target = targetPosition(state);
    if (isBlocked(map, target.x, target.y)) {
      return { state, blocked: true };
    }
    return { state: createState(target.x, target.y, state.orientation), blocked: false };
  }

  function applyCommand(state, map, command) {
    switch (command) {
      case 'avancer':
        return advance(state, map);
      case 'tourner_droite':
        return { state: createState(state.x, state.y, rotateRight(state.orientation)), blocked: false };
      case 'tourner_gauche':
        return { state: createState(state.x, state.y, rotateLeft(state.orientation)), blocked: false };
      default:
        throw new Error(`Commande inconnue : ${command}`);
    }
  }

  // EX-06/EX-07/EX-08 : exécute la séquence commande par commande, s'arrête
  // immédiatement sur un obstacle et signale l'arrêt anticipé.
  function runSequence(initialState, map, commands) {
    let state = initialState;
    for (const command of commands) {
      const result = applyCommand(state, map, command);
      state = result.state;
      if (result.blocked) {
        return { x: state.x, y: state.y, orientation: state.orientation, stoppedEarly: true };
      }
    }
    return { x: state.x, y: state.y, orientation: state.orientation, stoppedEarly: false };
  }

  return {
    ORIENTATIONS,
    OBSTACLE_SYMBOLS,
    FREE_SYMBOLS,
    createState,
    rotateRight,
    rotateLeft,
    isWithinBounds,
    isObstacleCell,
    isBlocked,
    advance,
    applyCommand,
    runSequence,
  };
});
