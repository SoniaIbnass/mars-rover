import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createRover,
  turnRight,
  turnLeft,
  runSequence,
  isObstacleSymbol,
  isFreeSymbol,
} from './simulation.js';

const FREE_3X3 = [
  ['🟩', '🟩', '🟩'],
  ['🟩', '🟩', '🟩'],
  ['🟩', '🟩', '🟩'],
];

test('EX-01 — initialise le rover au point de départ sans exécuter de commande', () => {
  const rover = createRover(0, 0, 'N');
  const { rover: result, stoppedEarly } = runSequence(rover, FREE_3X3, []);
  assert.deepEqual(result, { x: 0, y: 0, orientation: 'N' });
  assert.equal(stoppedEarly, false);
});

test('EX-02 — distingue les symboles obstacle (🌳, 🪨) des symboles libres (🟩, 🟫)', () => {
  assert.equal(isObstacleSymbol('🌳'), true);
  assert.equal(isObstacleSymbol('🪨'), true);
  assert.equal(isFreeSymbol('🟩'), true);
  assert.equal(isFreeSymbol('🟫'), true);
  assert.equal(isObstacleSymbol('🟩'), false);
  assert.equal(isFreeSymbol('🌳'), false);
});

test('EX-02 — une case obstacle en (1, 0) bloque le rover qui s’y dirige', () => {
  const map = [
    ['🟩', '🌳', '🟩'],
    ['🟩', '🟩', '🟩'],
    ['🟩', '🟩', '🟩'],
  ];
  const rover = createRover(0, 0, 'E');
  const { rover: result, stoppedEarly } = runSequence(rover, map, ['avancer']);
  assert.deepEqual(result, { x: 0, y: 0, orientation: 'E' });
  assert.equal(stoppedEarly, true);
});

test('EX-03 — avancer déplace le rover d’une case dans son orientation', () => {
  const rover = createRover(0, 0, 'N');
  const { rover: result, stoppedEarly } = runSequence(rover, FREE_3X3, ['avancer']);
  assert.deepEqual(result, { x: 0, y: 1, orientation: 'N' });
  assert.equal(stoppedEarly, false);
});

test('EX-04 — tourner à droite pivote l’orientation sans changer la position', () => {
  const rover = createRover(2, 2, 'N');
  const result = turnRight(rover);
  assert.deepEqual(result, { x: 2, y: 2, orientation: 'E' });
});

test('EX-05 — tourner à gauche pivote l’orientation sans changer la position', () => {
  const rover = createRover(2, 2, 'N');
  const result = turnLeft(rover);
  assert.deepEqual(result, { x: 2, y: 2, orientation: 'W' });
});

test('EX-06 — un obstacle immobilise le rover et interrompt la séquence', () => {
  const map = [
    ['🟩', '🟩', '🟩'],
    ['🌳', '🟩', '🟩'],
    ['🟩', '🟩', '🟩'],
  ];
  const rover = createRover(0, 0, 'N');
  const { rover: result, stoppedEarly } = runSequence(rover, map, ['avancer', 'droite', 'avancer']);
  assert.deepEqual(result, { x: 0, y: 0, orientation: 'N' });
  assert.equal(stoppedEarly, true);
});

test('EX-07 — affiche la position et l’orientation finales après exécution complète', () => {
  const rover = createRover(0, 0, 'N');
  const { rover: result, stoppedEarly } = runSequence(rover, FREE_3X3, ['avancer', 'droite', 'avancer']);
  assert.deepEqual(result, { x: 1, y: 1, orientation: 'E' });
  assert.equal(stoppedEarly, false);
});

test('EX-08 — signale l’arrêt anticipé de la séquence dû à un obstacle', () => {
  const map = [
    ['🟩', '🟩', '🟩'],
    ['🌳', '🟩', '🟩'],
    ['🟩', '🟩', '🟩'],
  ];
  const rover = createRover(0, 0, 'N');
  const { stoppedEarly } = runSequence(rover, map, ['avancer', 'droite', 'avancer']);
  assert.equal(stoppedEarly, true);
});

test('sortie par le bord nord traitée comme un obstacle', () => {
  const rover = createRover(1, 2, 'N');
  const { rover: result, stoppedEarly } = runSequence(rover, FREE_3X3, ['avancer']);
  assert.deepEqual(result, { x: 1, y: 2, orientation: 'N' });
  assert.equal(stoppedEarly, true);
});

test('sortie par le bord sud traitée comme un obstacle', () => {
  const rover = createRover(1, 0, 'S');
  const { rover: result, stoppedEarly } = runSequence(rover, FREE_3X3, ['avancer']);
  assert.deepEqual(result, { x: 1, y: 0, orientation: 'S' });
  assert.equal(stoppedEarly, true);
});

test('sortie par le bord est traitée comme un obstacle', () => {
  const rover = createRover(2, 1, 'E');
  const { rover: result, stoppedEarly } = runSequence(rover, FREE_3X3, ['avancer']);
  assert.deepEqual(result, { x: 2, y: 1, orientation: 'E' });
  assert.equal(stoppedEarly, true);
});

test('sortie par le bord ouest traitée comme un obstacle', () => {
  const rover = createRover(0, 1, 'W');
  const { rover: result, stoppedEarly } = runSequence(rover, FREE_3X3, ['avancer']);
  assert.deepEqual(result, { x: 0, y: 1, orientation: 'W' });
  assert.equal(stoppedEarly, true);
});

test('une séquence vide laisse le rover inchangé', () => {
  const rover = createRover(1, 1, 'S');
  const { rover: result, stoppedEarly } = runSequence(rover, FREE_3X3, []);
  assert.deepEqual(result, { x: 1, y: 1, orientation: 'S' });
  assert.equal(stoppedEarly, false);
});

test('un cycle complet de rotations à droite revient à l’orientation de départ', () => {
  let rover = createRover(0, 0, 'N');
  for (let i = 0; i < 4; i += 1) {
    rover = turnRight(rover);
  }
  assert.equal(rover.orientation, 'N');
});

test('un cycle complet de rotations à gauche revient à l’orientation de départ', () => {
  let rover = createRover(0, 0, 'N');
  for (let i = 0; i < 4; i += 1) {
    rover = turnLeft(rover);
  }
  assert.equal(rover.orientation, 'N');
});
