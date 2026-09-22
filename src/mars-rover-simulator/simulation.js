export const ORIENTATIONS = ['N', 'E', 'S', 'W'];

const FORWARD_DELTA = {
  N: { dx: 0, dy: 1 },
  E: { dx: 1, dy: 0 },
  S: { dx: 0, dy: -1 },
  W: { dx: -1, dy: 0 },
};

const OBSTACLE_SYMBOLS = new Set(['🌳', '🪨']);
const FREE_SYMBOLS = new Set(['🟩', '🟫']);

export const FORWARD = 'avancer';
export const TURN_RIGHT = 'tourner à droite';
export const TURN_LEFT = 'tourner à gauche';

export function parseMap(rows) {
  // rows[0] est la ligne affichée en haut (la plus au nord) ; le repère accepté
  // (spec.md, Conception proposée) fait croître y vers le nord, d'où l'inversion.
  return rows
    .slice()
    .reverse()
    .map((row) => Array.from(row));
}

export function rotateRight(orientation) {
  const index = ORIENTATIONS.indexOf(orientation);
  return ORIENTATIONS[(index + 1) % ORIENTATIONS.length];
}

export function rotateLeft(orientation) {
  const index = ORIENTATIONS.indexOf(orientation);
  return ORIENTATIONS[(index + ORIENTATIONS.length - 1) % ORIENTATIONS.length];
}

export function isPassable(grid, x, y) {
  const row = grid[y];
  if (row === undefined || row[x] === undefined) {
    return false;
  }
  return FREE_SYMBOLS.has(row[x]);
}

export function isObstacleSymbol(symbol) {
  return OBSTACLE_SYMBOLS.has(symbol);
}

export function createRover(x, y, orientation) {
  return { position: { x, y }, orientation };
}

function applyForward(rover, grid) {
  const delta = FORWARD_DELTA[rover.orientation];
  const next = { x: rover.position.x + delta.dx, y: rover.position.y + delta.dy };
  if (!isPassable(grid, next.x, next.y)) {
    return { rover, blocked: true };
  }
  return { rover: { position: next, orientation: rover.orientation }, blocked: false };
}

function applyCommand(rover, command, grid) {
  if (command === TURN_RIGHT) {
    return { rover: { ...rover, orientation: rotateRight(rover.orientation) }, blocked: false };
  }
  if (command === TURN_LEFT) {
    return { rover: { ...rover, orientation: rotateLeft(rover.orientation) }, blocked: false };
  }
  if (command === FORWARD) {
    return applyForward(rover, grid);
  }
  throw new Error(`Commande inconnue : ${command}`);
}

export function runSequence(startRover, commands, grid) {
  let rover = startRover;
  for (const command of commands) {
    const result = applyCommand(rover, command, grid);
    rover = result.rover;
    if (result.blocked) {
      return { position: rover.position, orientation: rover.orientation, stopped: true };
    }
  }
  return { position: rover.position, orientation: rover.orientation, stopped: false };
}
