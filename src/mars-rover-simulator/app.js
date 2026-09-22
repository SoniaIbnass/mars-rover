import { parseMap, createRover, runSequence, FORWARD, TURN_RIGHT, TURN_LEFT } from './simulation.js';

const COMMAND_LETTERS = { A: FORWARD, D: TURN_RIGHT, G: TURN_LEFT };

function parseCommands(text) {
  return text
    .replace(/[\s,]/g, '')
    .split('')
    .map((letter) => {
      const command = COMMAND_LETTERS[letter.toUpperCase()];
      if (!command) {
        throw new Error(`Commande inconnue : « ${letter} » (attendu : A, D ou G)`);
      }
      return command;
    });
}

function readMapRows(text) {
  return text.split('\n').filter((line) => line.length > 0);
}

function readForm() {
  const x = Number(document.getElementById('start-x').value);
  const y = Number(document.getElementById('start-y').value);
  if (Number.isNaN(x) || Number.isNaN(y)) {
    throw new Error('Position de départ invalide : x et y doivent être des nombres.');
  }
  const orientation = document.getElementById('start-orientation').value;
  const mapRows = readMapRows(document.getElementById('map-input').value);
  const commandsText = document.getElementById('commands-input').value;
  return { x, y, orientation, mapRows, commandsText };
}

function renderGrid(container, grid, roverPosition, roverOrientation) {
  const height = grid.length;
  container.innerHTML = '';
  container.style.gridTemplateColumns = '';
  container.style.gridTemplateRows = '';
  if (height === 0) {
    return;
  }

  const width = grid[0].length;
  container.style.gridTemplateColumns = `repeat(${width}, 2rem)`;
  container.style.gridTemplateRows = `repeat(${height}, 2rem)`;

  // Rendu en ordre naturel de lecture (nord en haut) : y décroît à chaque ligne DOM.
  for (let y = height - 1; y >= 0; y -= 1) {
    for (let x = 0; x < width; x += 1) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = grid[y][x] ?? '';
      container.appendChild(cell);
    }
  }

  const rover = document.createElement('div');
  rover.className = 'rover';
  rover.textContent = '➤';
  rover.dataset.orientation = roverOrientation;
  rover.style.gridColumn = String(roverPosition.x + 1);
  rover.style.gridRow = String(height - roverPosition.y);
  container.appendChild(rover);
}

function renderResult(container, result) {
  const stoppedMessage = result.stopped
    ? ' — arrêt anticipé : un obstacle a interrompu la séquence avant son terme.'
    : '';
  container.textContent = `Position finale : (${result.position.x}, ${result.position.y}), orientation ${result.orientation}.${stoppedMessage}`;
}

function renderError(container, error) {
  container.textContent = `Erreur : ${error.message}`;
}

function previewStart() {
  const { x, y, orientation, mapRows } = readForm();
  const grid = parseMap(mapRows);
  renderGrid(document.getElementById('grid'), grid, { x, y }, orientation);
}

function runSimulation(event) {
  event.preventDefault();
  const resultEl = document.getElementById('result');
  try {
    const { x, y, orientation, mapRows, commandsText } = readForm();
    const grid = parseMap(mapRows);
    const commands = parseCommands(commandsText);
    const rover = createRover(x, y, orientation);
    const result = runSequence(rover, commands, grid);
    renderGrid(document.getElementById('grid'), grid, result.position, result.orientation);
    renderResult(resultEl, result);
  } catch (error) {
    renderError(resultEl, error);
  }
}

document.getElementById('simulation-form').addEventListener('submit', runSimulation);
document.getElementById('map-input').addEventListener('input', previewStart);
previewStart();
