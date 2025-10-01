import type { UserSkills } from '../types/user';

export interface PlayerForTeam {
  id: string;
  name: string;
  skills?: UserSkills;
}

export interface BalancedTeam {
  name: string;
  color: string;
  players: PlayerForTeam[];
  averageSkill: number;
}

// Calcular promedio de habilidades de un jugador
const calculatePlayerAverage = (skills?: UserSkills): number => {
  if (!skills) return 5; // Valor por defecto para jugadores sin registro
  return (skills.velocidad + skills.disparo + skills.calidad + skills.resistencia) / 4;
};

// Calcular promedio de habilidades de un equipo
const calculateTeamAverage = (players: PlayerForTeam[]): number => {
  const sum = players.reduce((acc, player) => acc + calculatePlayerAverage(player.skills), 0);
  return players.length > 0 ? sum / players.length : 0;
};

// Algoritmo de balanceo mejorado usando búsqueda greedy
export const generateBalancedTeams = (players: PlayerForTeam[]): BalancedTeam[] => {
  if (players.length !== 10) {
    throw new Error('Se necesitan exactamente 10 jugadores');
  }

  // Ordenar jugadores por habilidad (de mayor a menor)
  const sortedPlayers = [...players].sort((a, b) => {
    return calculatePlayerAverage(b.skills) - calculatePlayerAverage(a.skills);
  });

  // Inicializar equipos
  const teamRed: PlayerForTeam[] = [];
  const teamBlue: PlayerForTeam[] = [];

  // Asignar jugadores alternando pero manteniendo balance
  // Estrategia: asignar al equipo con menor promedio actual
  sortedPlayers.forEach((player) => {
    const redAvg = calculateTeamAverage(teamRed);
    const blueAvg = calculateTeamAverage(teamBlue);

    // Si los equipos están llenos, agregar al que tiene menos
    if (teamRed.length === 5) {
      teamBlue.push(player);
    } else if (teamBlue.length === 5) {
      teamRed.push(player);
    } else {
      // Agregar al equipo con menor promedio
      if (redAvg <= blueAvg) {
        teamRed.push(player);
      } else {
        teamBlue.push(player);
      }
    }
  });

  // Intentar optimización mediante intercambios (opcional)
  const optimizedTeams = optimizeTeams(teamRed, teamBlue);

  // Shuffle dentro de cada equipo para añadir aleatoriedad visual
  const shuffledRed = shuffleArray([...optimizedTeams.teamRed]);
  const shuffledBlue = shuffleArray([...optimizedTeams.teamBlue]);

  return [
    {
      name: 'Equipo Rojo',
      color: 'red',
      players: shuffledRed,
      averageSkill: calculateTeamAverage(shuffledRed)
    },
    {
      name: 'Equipo Azul',
      color: 'blue',
      players: shuffledBlue,
      averageSkill: calculateTeamAverage(shuffledBlue)
    }
  ];
};

// Optimización mediante intercambios
const optimizeTeams = (
  teamRed: PlayerForTeam[],
  teamBlue: PlayerForTeam[]
): { teamRed: PlayerForTeam[]; teamBlue: PlayerForTeam[] } => {
  let red = [...teamRed];
  let blue = [...teamBlue];
  let improved = true;
  let iterations = 0;
  const maxIterations = 50;

  while (improved && iterations < maxIterations) {
    improved = false;
    iterations++;

    const currentDiff = Math.abs(calculateTeamAverage(red) - calculateTeamAverage(blue));

    // Intentar intercambiar cada par de jugadores
    for (let i = 0; i < red.length; i++) {
      for (let j = 0; j < blue.length; j++) {
        // Crear equipos temporales con el intercambio
        const tempRed = [...red];
        const tempBlue = [...blue];
        [tempRed[i], tempBlue[j]] = [tempBlue[j], tempRed[i]];

        const newDiff = Math.abs(calculateTeamAverage(tempRed) - calculateTeamAverage(tempBlue));

        // Si el intercambio mejora el balance, aplicarlo
        if (newDiff < currentDiff) {
          red = tempRed;
          blue = tempBlue;
          improved = true;
          break;
        }
      }
      if (improved) break;
    }
  }

  return { teamRed: red, teamBlue: blue };
};

// Función auxiliar para mezclar array (Fisher-Yates shuffle)
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

