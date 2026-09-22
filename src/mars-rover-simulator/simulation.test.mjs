import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FORWARD,
  TURN_RIGHT,
  TURN_LEFT,
  parseMap,
  rotateRight,
  rotateLeft,
  isPassable,
  createRover,
  runSequence,
} from './simulation.js';

// Grille entièrement libre, assez grande pour les scénarios EX-01, EX-03, EX-07.
const OPEN_MAP = parseMap(['🟩🟩', '🟩🟩']);

// EX-02 : obstacle en (1, 0), libre ailleurs.
const MAP_WITH_OBSTACLE_AT_1_0 = parseMap(['🟩🟩', '🟩🌳']);

// EX-06 / EX-08 : obstacle en (0, 1), libre ailleurs (case au nord du point de départ).
const MAP_WITH_OBSTACLE_AT_0_1 = parseMap(['🌳🟩', '🟩🟩']);

function singleFreeCellMap() {
  return parseMap(['🟩']);
}

test('EX-01 — interpréter le point de départ (et séquence vide)', () => {
  const rover = createRover(0, 0, 'N');
  const result = runSequence(rover, [], OPEN_MAP);
  assert.deepEqual(result, { position: { x: 0, y: 0 }, orientation: 'N', stopped: false });
});

test('EX-02 — interpréter la carte et distinguer obstacle et terrain libre', () => {
  assert.equal(isPassable(MAP_WITH_OBSTACLE_AT_1_0, 1, 0), false);
  assert.equal(isPassable(MAP_WITH_OBSTACLE_AT_1_0, 0, 0), true);
  assert.equal(isPassable(MAP_WITH_OBSTACLE_AT_1_0, 0, 1), true);
  assert.equal(isPassable(MAP_WITH_OBSTACLE_AT_1_0, 1, 1), true);
});

test('EX-03 — avancer', () => {
  const rover = createRover(0, 0, 'N');
  const result = runSequence(rover, [FORWARD], OPEN_MAP);
  assert.deepEqual(result, { position: { x: 0, y: 1 }, orientation: 'N', stopped: false });
});

test('EX-04 — tourner à droite', () => {
  const rover = createRover(2, 2, 'N');
  const result = runSequence(rover, [TURN_RIGHT], OPEN_MAP);
  assert.deepEqual(result, { position: { x: 2, y: 2 }, orientation: 'E', stopped: false });
});

test('EX-05 — tourner à gauche', () => {
  const rover = createRover(2, 2, 'N');
  const result = runSequence(rover, [TURN_LEFT], OPEN_MAP);
  assert.deepEqual(result, { position: { x: 2, y: 2 }, orientation: 'W', stopped: false });
});

test('EX-06 — rester immobile face à un obstacle et interrompre la séquence', () => {
  const rover = createRover(0, 0, 'N');
  const result = runSequence(rover, [FORWARD, TURN_RIGHT, FORWARD], MAP_WITH_OBSTACLE_AT_0_1);
  // Le rover ne bouge pas et son orientation reste N : « tourner à droite » et le second
  // « avancer » qui suivent le blocage n'ont pas été exécutés.
  assert.deepEqual(result, { position: { x: 0, y: 0 }, orientation: 'N', stopped: true });
});

test('EX-07 — afficher la position et l’orientation finales', () => {
  const rover = createRover(0, 0, 'N');
  const result = runSequence(rover, [FORWARD, TURN_RIGHT, FORWARD], OPEN_MAP);
  assert.deepEqual(result, { position: { x: 1, y: 1 }, orientation: 'E', stopped: false });
});

test('EX-08 — signaler l’arrêt anticipé de la séquence', () => {
  const rover = createRover(0, 0, 'N');
  const result = runSequence(rover, [FORWARD, TURN_RIGHT, FORWARD], MAP_WITH_OBSTACLE_AT_0_1);
  assert.equal(result.stopped, true);
});

test('sortie de carte — chacun des 4 bords traité comme un obstacle', () => {
  const map = singleFreeCellMap();
  for (const orientation of ['N', 'E', 'S', 'W']) {
    const rover = createRover(0, 0, orientation);
    const result = runSequence(rover, [FORWARD], map);
    assert.deepEqual(result, { position: { x: 0, y: 0 }, orientation, stopped: true });
  }
});

test('rotation — cycle complet à droite (N→E→S→W→N)', () => {
  assert.equal(rotateRight('N'), 'E');
  assert.equal(rotateRight('E'), 'S');
  assert.equal(rotateRight('S'), 'W');
  assert.equal(rotateRight('W'), 'N');
});

test('rotation — cycle complet à gauche (N→W→S→E→N)', () => {
  assert.equal(rotateLeft('N'), 'W');
  assert.equal(rotateLeft('W'), 'S');
  assert.equal(rotateLeft('S'), 'E');
  assert.equal(rotateLeft('E'), 'N');
});
