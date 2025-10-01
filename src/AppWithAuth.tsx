import React, { useState } from 'react';
import { FaPlus, FaTrash, FaRandom, FaUsers, FaTrophy, FaRedo, FaFilePdf, FaImage, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { MdSportsSoccer } from 'react-icons/md';
import { useDirectExport } from './hooks/useDirectExport';
import { useAuth } from './contexts/AuthContext';
import { generateBalancedTeams } from './utils/teamBalancer';
import type { PlayerForTeam, BalancedTeam } from './utils/teamBalancer';

const AppWithAuth: React.FC = () => {
  const { currentUser, users, logout } = useAuth();
  const [selectedPlayers, setSelectedPlayers] = useState<PlayerForTeam[]>([]);
  const [manualPlayerName, setManualPlayerName] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [teams, setTeams] = useState<BalancedTeam[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { generatePDF, generateJPG } = useDirectExport();

  const addRegisteredPlayer = () => {
    if (!selectedUserId) return;
    
    const user = users.find(u => u.id === selectedUserId);
    if (!user) return;

    // Verificar si ya está agregado
    if (selectedPlayers.some(p => p.id === user.id)) {
      alert('Este jugador ya está en la lista');
      return;
    }

    if (selectedPlayers.length >= 10) {
      alert('Ya tienes 10 jugadores');
      return;
    }

    const player: PlayerForTeam = {
      id: user.id,
      name: user.nick,
      skills: user.skills
    };

    setSelectedPlayers([...selectedPlayers, player]);
    setSelectedUserId('');
  };

  const addManualPlayer = () => {
    if (!manualPlayerName.trim()) return;

    if (selectedPlayers.length >= 10) {
      alert('Ya tienes 10 jugadores');
      return;
    }

    const player: PlayerForTeam = {
      id: `manual-${Date.now()}`,
      name: manualPlayerName.trim(),
      skills: undefined // Sin habilidades
    };

    setSelectedPlayers([...selectedPlayers, player]);
    setManualPlayerName('');
  };

  const removePlayer = (id: string) => {
    setSelectedPlayers(selectedPlayers.filter(p => p.id !== id));
  };

  const generateTeams = () => {
    if (selectedPlayers.length !== 10) return;
    
    setIsGenerating(true);
    
    setTimeout(() => {
      const balancedTeams = generateBalancedTeams(selectedPlayers);
      setTeams(balancedTeams);
      setIsGenerating(false);
    }, 1500);
  };

  const resetTeams = () => {
    setTeams([]);
  };

  const resetAll = () => {
    setSelectedPlayers([]);
    setTeams([]);
    setManualPlayerName('');
    setSelectedUserId('');
  };

  const handleGeneratePDF = async () => {
    setIsExporting(true);
    try {
      // Convertir teams a formato compatible
      const teamsForExport = teams.map(team => ({
        name: team.name,
        color: team.color,
        players: team.players.map(p => ({ id: p.id, name: p.name }))
      }));
      generatePDF(teamsForExport);
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerateJPG = async () => {
    setIsExporting(true);
    try {
      const teamsForExport = teams.map(team => ({
        name: team.name,
        color: team.color,
        players: team.players.map(p => ({ id: p.id, name: p.name }))
      }));
      generateJPG(teamsForExport);
    } finally {
      setIsExporting(false);
    }
  };

  // Obtener el promedio de skills de un jugador
  const getPlayerSkillsDisplay = (player: PlayerForTeam) => {
    if (!player.skills) return null;
    const avg = (player.skills.velocidad + player.skills.disparo + player.skills.calidad + player.skills.resistencia) / 4;
    return (
      <span className="text-xs text-grass-600 font-semibold">
        ⭐ {avg.toFixed(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-grass-50 via-grass-100 to-grass-200">
      {/* Header con usuario */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MdSportsSoccer className="text-4xl text-grass-600" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-grass-800">
                  Generador de Equipos
                </h1>
                <p className="text-sm text-field-600">
                  Equipos balanceados por habilidades
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-field-700">
                <FaUserCircle className="text-2xl text-grass-600" />
                <span className="font-medium">{currentUser?.nick}</span>
              </div>
              <button
                onClick={logout}
                className="btn-secondary flex items-center space-x-2"
              >
                <FaSignOutAlt />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Player Selection Section */}
          <div className="card p-6 mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <FaUsers className="text-grass-600 text-xl" />
              <h2 className="text-2xl font-semibold text-grass-800">
                Seleccionar Jugadores ({selectedPlayers.length}/10)
              </h2>
            </div>
            
            {/* Selector de usuario registrado */}
            <div className="mb-4">
              <label className="block text-field-700 font-medium mb-2">
                Agregar usuario registrado
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="input-field flex-1"
                  disabled={selectedPlayers.length >= 10}
                >
                  <option value="">Selecciona un usuario...</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.nick} - ⭐ {((user.skills.velocidad + user.skills.disparo + user.skills.calidad + user.skills.resistencia) / 4).toFixed(1)}
                    </option>
                  ))}
                </select>
                <button
                  onClick={addRegisteredPlayer}
                  disabled={!selectedUserId || selectedPlayers.length >= 10}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPlus />
                  <span>Agregar</span>
                </button>
              </div>
            </div>

            {/* Input manual */}
            <div className="mb-6">
              <label className="block text-field-700 font-medium mb-2">
                O agregar jugador sin registro
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  value={manualPlayerName}
                  onChange={(e) => setManualPlayerName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addManualPlayer()}
                  placeholder="Nombre del jugador..."
                  className="input-field flex-1"
                  disabled={selectedPlayers.length >= 10}
                />
                <button
                  onClick={addManualPlayer}
                  disabled={!manualPlayerName.trim() || selectedPlayers.length >= 10}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPlus />
                  <span>Agregar</span>
                </button>
              </div>
            </div>

            {/* Players List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {selectedPlayers.map((player) => (
                <div
                  key={player.id}
                  className="bg-white/60 rounded-lg p-3 flex flex-col group hover:bg-white/80 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-field-800 font-medium truncate">{player.name}</span>
                    <button
                      onClick={() => removePlayer(player.id)}
                      className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                  {getPlayerSkillsDisplay(player)}
                </div>
              ))}
            </div>

            {selectedPlayers.length > 0 && (
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
          {selectedPlayers.length === 10 && (
            <div className="text-center mb-8">
              <button
                onClick={generateTeams}
                disabled={isGenerating}
                className="btn-primary text-lg px-8 py-4 flex items-center space-x-3 mx-auto disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generando equipos balanceados...</span>
                  </>
                ) : (
                  <>
                    <FaRandom />
                    <span>Generar Equipos Balanceados</span>
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
                          <span>Generando...</span>
                        </>
                      ) : (
                        <>
                          <FaFilePdf />
                          <span>PDF</span>
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
                          <span>Generando...</span>
                        </>
                      ) : (
                        <>
                          <FaImage />
                          <span>JPG</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Balance Info */}
                <div className="flex justify-center gap-8 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-field-700">
                      Promedio: <strong>{teams[0].averageSkill.toFixed(2)}</strong>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-field-700">
                      Promedio: <strong>{teams[1].averageSkill.toFixed(2)}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Teams Display */}
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
                          className={`bg-white/60 rounded-lg p-3 flex items-center justify-between animate-slide-up ${
                            team.color === 'red' 
                              ? 'border-l-4 border-red-300' 
                              : 'border-l-4 border-blue-300'
                          }`}
                          style={{ animationDelay: `${(index * 0.2) + (playerIndex * 0.1)}s` }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                              team.color === 'red' ? 'bg-red-500' : 'bg-blue-500'
                            }`}>
                              {playerIndex + 1}
                            </div>
                            <span className="text-field-800 font-medium">{player.name}</span>
                          </div>
                          {getPlayerSkillsDisplay(player)}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          {selectedPlayers.length === 0 && (
            <div className="card p-8 text-center">
              <MdSportsSoccer className="text-6xl text-grass-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-field-700 mb-4">
                ¡Comienza seleccionando jugadores!
              </h3>
              <p className="text-field-600 max-w-md mx-auto">
                Selecciona usuarios registrados o agrega jugadores manualmente.
                Necesitas 10 jugadores para generar equipos balanceados por habilidades.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-white/20 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-field-600">
          <p>Generador de Equipos con Sistema de Balanceo - React, TypeScript y Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
};

export default AppWithAuth;

