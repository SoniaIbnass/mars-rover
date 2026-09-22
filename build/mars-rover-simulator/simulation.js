// Logique pure de simulation du rover Mars (EX-01 à EX-08, spec.md).
// Aucune manipulation du DOM : chaque fonction retourne un nouvel état.

export const ORIENTATIONS = ['N', 'E', 'S', 'W'];

const MOVE_DELTA = {
  N: [0, 1],
  E: [1, 0],
  S: [0, -1],
  W: [-1, 0],
};

const OBSTACLE_SYMBOLS = new Set(['🌳', '🪨']);
const FREE_SYMBOLS = new Set(['🟩', '🟫']);

export function createRover(x, y, orientation) {
  return { x, y, orientation };
}

export function turnRight(rover) {
  const index = ORIENTATIONS.indexOf(rover.orientation);
  return { ...rover, orientation: ORIENTATIONS[(index + 1) % ORIENTATIONS.length] };
}

export function turnLeft(rover) {
  const index = ORIENTATIONS.indexOf(rover.orientation);
  return { ...rover, orientation: ORIENTATIONS[(index + ORIENTATIONS.length - 1) % ORIENTATIONS.length] };
}

export function isObstacleSymbol(symbol) {
  return OBSTACLE_SYMBOLS.has(symbol);
}

export function isFreeSymbol(symbol) {
  return FREE_SYMBOLS.has(symbol);
}

export function isWithinBounds(map, x, y) {
  return y >= 0 && y < map.length && x >= 0 && x < map[y].length;
}

export function isBlocked(map, x, y) {
  return !isWithinBounds(map, x, y) || isObstacleSymbol(map[y][x]);
}

export function moveForward(rover, map) {
  const [dx, dy] = MOVE_DELTA[rover.orientation];
  const targetX = rover.x + dx;
  const targetY = rover.y + dy;

  if (isBlocked(map, targetX, targetY)) {
    return { rover, moved: false };
  }

  return { rover: { ...rover, x: targetX, y: targetY }, moved: true };
}

export function runSequence(initialRover, map, commands) {
  let rover = initialRover;

  for (const command of commands) {
    if (command === 'avancer') {
      const result = moveForward(rover, map);
      if (!result.moved) {
        return { rover, stoppedEarly: true };
      }
      rover = result.rover;
    } else if (command === 'droite') {
      rover = turnRight(rover);
    } else if (command === 'gauche') {
      rover = turnLeft(rover);
    } else {
      throw new Error(`Commande inconnue : ${command}`);
    }
  }

  return { rover, stoppedEarly: false };
}
