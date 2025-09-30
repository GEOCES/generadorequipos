import React, { useState } from 'react';
import { FaPlus, FaTrash, FaRandom, FaUsers, FaTrophy, FaRedo, FaFilePdf, FaImage } from 'react-icons/fa';
import { MdSportsSoccer } from 'react-icons/md';
import { useDirectExport } from './hooks/useDirectExport';

interface Player {
  id: string;
  name: string;
}

interface Team {
  name: string;
  color: string;
  players: Player[];
}

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { generatePDF, generateJPG } = useDirectExport();

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < 10) {
      const newPlayer: Player = {
        id: Date.now().toString(),
        name: newPlayerName.trim()
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter(player => player.id !== id));
  };

  const generateTeams = () => {
    if (players.length < 10) return;
    
    setIsGenerating(true);
    
    // Simular delay para efecto visual
    setTimeout(() => {
      const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
      
      const teamRed: Team = {
        name: 'Equipo Rojo',
        color: 'red',
        players: shuffledPlayers.slice(0, 5)
      };
      
      const teamBlue: Team = {
        name: 'Equipo Azul',
        color: 'blue',
        players: shuffledPlayers.slice(5, 10)
      };
      
      setTeams([teamRed, teamBlue]);
      setIsGenerating(false);
    }, 1500);
  };

  const resetTeams = () => {
    setTeams([]);
  };

  const resetAll = () => {
    setPlayers([]);
    setTeams([]);
    setNewPlayerName('');
  };

  const handleGeneratePDF = async () => {
    setIsExporting(true);
    try {
      generatePDF(teams);
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerateJPG = async () => {
    setIsExporting(true);
    try {
      generateJPG(teams);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-grass-50 via-grass-100 to-grass-200">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-3">
            <MdSportsSoccer className="text-4xl text-grass-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-grass-800">
              Generador de Equipos
            </h1>
          </div>
          <p className="text-center text-field-600 mt-2">
            Crea equipos balanceados de 5 jugadores cada uno
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Player Input Section */}
          <div className="card p-6 mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <FaUsers className="text-grass-600 text-xl" />
              <h2 className="text-2xl font-semibold text-grass-800">
                Agregar Jugadores ({players.length}/10)
              </h2>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                placeholder="Nombre del jugador..."
                className="input-field flex-1"
                disabled={players.length >= 10}
              />
              <button
                onClick={addPlayer}
                disabled={!newPlayerName.trim() || players.length >= 10}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPlus />
                <span>Agregar</span>
              </button>
            </div>

            {/* Players List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="bg-white/60 rounded-lg p-3 flex items-center justify-between group hover:bg-white/80 transition-colors"
                >
                  <span className="text-field-800 font-medium">{player.name}</span>
                  <button
                    onClick={() => removePlayer(player.id)}
                    className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              ))}
            </div>

            {players.length > 0 && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={resetAll}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <FaRedo />
                  <span>Limpiar Todo</span>
                </button>
              </div>
            )}
          </div>

          {/* Generate Teams Button */}
          {players.length === 10 && (
            <div className="text-center mb-8">
              <button
                onClick={generateTeams}
                disabled={isGenerating}
                className="btn-primary text-lg px-8 py-4 flex items-center space-x-3 mx-auto disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generando equipos...</span>
                  </>
                ) : (
                  <>
                    <FaRandom />
                    <span>Generar Equipos</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Teams Display */}
          {teams.length > 0 && (
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={resetTeams}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <FaRedo />
                    <span>Nuevos Equipos</span>
                  </button>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleGeneratePDF}
                      disabled={isExporting}
                      className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isExporting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Generando PDF...</span>
                        </>
                      ) : (
                        <>
                          <FaFilePdf />
                          <span>Descargar PDF</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={handleGenerateJPG}
                      disabled={isExporting}
                      className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isExporting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Generando JPG...</span>
                        </>
                      ) : (
                        <>
                          <FaImage />
                          <span>Descargar JPG</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>


              {/* Teams Display - Visible */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {teams.map((team, index) => (
                  <div
                    key={team.name}
                    className={`card p-6 animate-fade-in ${
                      team.color === 'red' 
                        ? 'border-l-4 border-red-500' 
                        : 'border-l-4 border-blue-500'
                    }`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="flex items-center space-x-3 mb-6">
                      <div className={`w-4 h-4 rounded-full ${
                        team.color === 'red' ? 'bg-red-500' : 'bg-blue-500'
                      }`}></div>
                      <h3 className="text-2xl font-bold text-field-800">
                        {team.name}
                      </h3>
                      <FaTrophy className={`text-xl ${
                        team.color === 'red' ? 'text-red-500' : 'text-blue-500'
                      }`} />
                    </div>

                    <div className="space-y-3">
                      {team.players.map((player, playerIndex) => (
                        <div
                          key={player.id}
                          className={`bg-white/60 rounded-lg p-3 flex items-center space-x-3 animate-slide-up ${
                            team.color === 'red' 
                              ? 'border-l-4 border-red-300' 
                              : 'border-l-4 border-blue-300'
                          }`}
                          style={{ animationDelay: `${(index * 0.2) + (playerIndex * 0.1)}s` }}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            team.color === 'red' ? 'bg-red-500' : 'bg-blue-500'
                          }`}>
                            {playerIndex + 1}
                          </div>
                          <span className="text-field-800 font-medium">{player.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          {players.length === 0 && (
            <div className="card p-8 text-center">
              <MdSportsSoccer className="text-6xl text-grass-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-field-700 mb-4">
                ¡Comienza agregando jugadores!
              </h3>
              <p className="text-field-600 max-w-md mx-auto">
                Agrega 10 jugadores para generar dos equipos balanceados de 5 jugadores cada uno.
                Los equipos se generarán aleatoriamente para mayor equidad.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-white/20 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-field-600">
          <p>Generador de Equipos - Creado con React, TypeScript y Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
};

export default App;