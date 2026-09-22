// Orchestration DOM : lit le formulaire, appelle simulation.js, rend la
// grille et affiche le résultat (position, orientation, arrêt anticipé).
(function () {
  const { createState, runSequence } = window.MarsRoverSimulation;

  const mapInput = document.getElementById('map-input');
  const startXInput = document.getElementById('start-x');
  const startYInput = document.getElementById('start-y');
  const startOrientationInput = document.getElementById('start-orientation');
  const sequenceInput = document.getElementById('sequence-input');
  const form = document.getElementById('rover-form');
  const gridEl = document.getElementById('grid');
  const resultEl = document.getElementById('result');

  const COMMAND_TOKENS = {
    avancer: 'avancer',
    droite: 'tourner_droite',
    gauche: 'tourner_gauche',
  };

  const ORIENTATION_ROTATION_DEG = { N: 0, E: 90, S: 180, W: 270 };

  // Les lignes saisies sont affichées nord en haut (première ligne = nord) ;
  // simulation.js attend map[y] avec y = 0 au sud : on inverse l'ordre des lignes.
  function parseMap(text) {
    const displayedRows = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => line.split(/\s+/));
    return [...displayedRows].reverse();
  }

  function parseSequence(text) {
    return text
      .split(/[\s,]+/)
      .map((token) => token.trim().toLowerCase())
      .filter((token) => token.length > 0)
      .map((token) => {
        const command = COMMAND_TOKENS[token];
        if (!command) throw new Error(`Commande inconnue : "${token}"`);
        return command;
      });
  }

  function renderGrid(map, rover) {
    gridEl.innerHTML = '';
    const height = map.length;
    const width = height > 0 ? map[0].length : 0;
    gridEl.style.gridTemplateColumns = `repeat(${width}, 1fr)`;

    for (let displayRow = 0; displayRow < height; displayRow += 1) {
      const y = height - 1 - displayRow; // rangée affichée 0 = nord = y max
      for (let x = 0; x < width; x += 1) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = map[y][x];
        if (rover.x === x && rover.y === y) {
          cell.classList.add('cell--rover');
          const roverIcon = document.createElement('span');
          roverIcon.className = 'rover-icon';
          roverIcon.textContent = '🤖';
          roverIcon.style.transform = `rotate(${ORIENTATION_ROTATION_DEG[rover.orientation]}deg)`;
          cell.appendChild(roverIcon);
        }
        gridEl.appendChild(cell);
      }
    }
  }

  function renderResult(result) {
    const stopMessage = result.stoppedEarly
      ? ' — arrêt anticipé : un obstacle a interrompu la séquence avant son terme.'
      : '';
    resultEl.textContent = `Position finale : (${result.x}, ${result.y}) — orientation ${result.orientation}${stopMessage}`;
    resultEl.classList.toggle('result--stopped', result.stoppedEarly);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const map = parseMap(mapInput.value);
      const commands = parseSequence(sequenceInput.value);
      const initial = createState(
        Number(startXInput.value),
        Number(startYInput.value),
        startOrientationInput.value,
      );
      const result = runSequence(initial, map, commands);
      renderGrid(map, result);
      renderResult(result);
    } catch (error) {
      resultEl.textContent = `Erreur : ${error.message}`;
      resultEl.classList.add('result--stopped');
    }
  });

  // Rendu initial avec les valeurs par défaut du formulaire.
  form.dispatchEvent(new Event('submit'));
})();
