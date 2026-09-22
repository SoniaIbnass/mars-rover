// Tests unitaires de la logique pure (simulation.js), un par scénario EX-01 à
// EX-08 de spec.md, plus les cas limites listés dans plan.md.
import test from 'node:test';
import assert from 'node:assert/strict';
import simulation from './simulation.js';

const {
  createState,
  rotateRight,
  rotateLeft,
  isWithinBounds,
  isObstacleCell,
  advance,
  runSequence,
} = simulation;

const FREE_2X2 = [
  ['🟩', '🟩'],
  ['🟩', '🟩'],
];

test('EX-01 — initialise le rover au point de départ sans exécuter de commande', () => {
  const state = createState(0, 0, 'N');
  assert.deepEqual(state, { x: 0, y: 0, orientation: 'N' });
});

test('EX-02 — distingue case libre et case occupée par un obstacle', () => {
  const map = [
    ['🟩', '🌳'],
    ['🟩', '🟩'],
  ];
  assert.equal(isObstacleCell(map, 1, 0), true);
  assert.equal(isObstacleCell(map, 0, 0), false);
  assert.equal(isObstacleCell(map, 0, 1), false);
  assert.equal(isObstacleCell(map, 1, 1), false);
});

test('EX-03 — avancer déplace le rover d\'une case dans son orientation', () => {
  const state = createState(0, 0, 'N');
  const { state: next, blocked } = advance(state, FREE_2X2);
  assert.equal(blocked, false);
  assert.deepEqual(next, { x: 0, y: 1, orientation: 'N' });
});

test('EX-04 — tourner à droite pivote l\'orientation sans changer la position', () => {
  assert.equal(rotateRight('N'), 'E');
});

test('EX-05 — tourner à gauche pivote l\'orientation sans changer la position', () => {
  assert.equal(rotateLeft('N'), 'W');
});

test('EX-07 — affiche la position et l\'orientation finales après exécution complète', () => {
  const initial = createState(0, 0, 'N');
  const result = runSequence(initial, FREE_2X2, ['avancer', 'tourner_droite', 'avancer']);
  assert.equal(result.x, 1);
  assert.equal(result.y, 1);
  assert.equal(result.orientation, 'E');
});

test('cas limite — sortie de la carte par le bord nord traitée comme un obstacle', () => {
  const initial = createState(0, 1, 'N');
  const result = runSequence(initial, FREE_2X2, ['avancer']);
  assert.deepEqual(result, { x: 0, y: 1, orientation: 'N', stoppedEarly: true });
});

test('cas limite — sortie de la carte par le bord sud traitée comme un obstacle', () => {
  const initial = createState(0, 0, 'S');
  const result = runSequence(initial, FREE_2X2, ['avancer']);
  assert.deepEqual(result, { x: 0, y: 0, orientation: 'S', stoppedEarly: true });
});

test('cas limite — sortie de la carte par le bord est traitée comme un obstacle', () => {
  const initial = createState(1, 0, 'E');
  const result = runSequence(initial, FREE_2X2, ['avancer']);
  assert.deepEqual(result, { x: 1, y: 0, orientation: 'E', stoppedEarly: true });
});

test('cas limite — sortie de la carte par le bord ouest traitée comme un obstacle', () => {
  const initial = createState(0, 0, 'W');
  const result = runSequence(initial, FREE_2X2, ['avancer']);
  assert.deepEqual(result, { x: 0, y: 0, orientation: 'W', stoppedEarly: true });
});

test('cas limite — une séquence vide laisse le rover à son état initial', () => {
  const initial = createState(0, 0, 'N');
  const result = runSequence(initial, FREE_2X2, []);
  assert.deepEqual(result, { x: 0, y: 0, orientation: 'N', stoppedEarly: false });
});

test('cas limite — un cycle complet de rotations à droite revient à l\'orientation initiale', () => {
  let orientation = 'N';
  const visited = [orientation];
  for (let i = 0; i < 4; i += 1) {
    orientation = rotateRight(orientation);
    visited.push(orientation);
  }
  assert.deepEqual(visited, ['N', 'E', 'S', 'W', 'N']);
});

test('cas limite — un cycle complet de rotations à gauche revient à l\'orientation initiale', () => {
  let orientation = 'N';
  const visited = [orientation];
  for (let i = 0; i < 4; i += 1) {
    orientation = rotateLeft(orientation);
    visited.push(orientation);
  }
  assert.deepEqual(visited, ['N', 'W', 'S', 'E', 'N']);
});

test('isWithinBounds — rejette les coordonnées hors de la grille', () => {
  assert.equal(isWithinBounds(FREE_2X2, -1, 0), false);
  assert.equal(isWithinBounds(FREE_2X2, 0, 2), false);
  assert.equal(isWithinBounds(FREE_2X2, 1, 1), true);
});
