// Rejoue un scénario de démonstration (créé s'il n'existe pas encore) et
// affiche la position et l'orientation finales du rover — utilisé par `make run`.

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createRover, runSequence } from './simulation.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const scenarioPath = join(__dirname, 'demo-scenario.json');

const DEFAULT_SCENARIO = {
  start: { x: 0, y: 0, orientation: 'N' },
  map: [
    ['🟩', '🟩', '🟩'],
    ['🟩', '🟩', '🟩'],
    ['🟩', '🟩', '🟩'],
  ],
  commands: ['avancer', 'droite', 'avancer'],
};

if (!existsSync(scenarioPath)) {
  writeFileSync(scenarioPath, `${JSON.stringify(DEFAULT_SCENARIO, null, 2)}\n`);
}

const scenario = JSON.parse(readFileSync(scenarioPath, 'utf8'));
const initialRover = createRover(scenario.start.x, scenario.start.y, scenario.start.orientation);
const { rover, stoppedEarly } = runSequence(initialRover, scenario.map, scenario.commands);

console.log(`Position finale : (${rover.x}, ${rover.y})`);
console.log(`Orientation finale : ${rover.orientation}`);
console.log(`Séquence interrompue par un obstacle : ${stoppedEarly ? 'oui' : 'non'}`);
