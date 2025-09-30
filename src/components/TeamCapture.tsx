import React from 'react';
import { FaTrophy, FaUsers } from 'react-icons/fa';
import { MdSportsSoccer } from 'react-icons/md';

interface Player {
  id: string;
  name: string;
}

interface Team {
  name: string;
  color: string;
  players: Player[];
}

interface TeamCaptureProps {
  teams: Team[];
}

const TeamCapture = React.forwardRef<HTMLDivElement, TeamCaptureProps>(({ teams }, ref) => {
  return (
    <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <MdSportsSoccer className="text-4xl text-grass-600" />
          <h1 className="text-3xl font-bold text-grass-800">
            Equipos Generados
          </h1>
        </div>
        <p className="text-field-600 text-lg">
          Generado el {new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {teams.map((team) => (
          <div
            key={team.name}
            className={`rounded-xl p-6 shadow-lg border-l-4 ${
              team.color === 'red' 
                ? 'border-red-500 bg-red-50' 
                : 'border-blue-500 bg-blue-50'
            }`}
          >
            {/* Team Header */}
            <div className="flex items-center space-x-3 mb-6">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                team.color === 'red' ? 'bg-red-500' : 'bg-blue-500'
              }`}>
                <FaUsers className="text-white text-sm" />
              </div>
              <h3 className="text-2xl font-bold text-field-800">
                {team.name}
              </h3>
              <FaTrophy className={`text-2xl ${
                team.color === 'red' ? 'text-red-500' : 'text-blue-500'
              }`} />
            </div>

            {/* Players List */}
            <div className="space-y-3">
              {team.players.map((player, playerIndex) => (
                <div
                  key={player.id}
                  className={`bg-white rounded-lg p-4 flex items-center space-x-4 shadow-sm ${
                    team.color === 'red' 
                      ? 'border-l-4 border-red-300' 
                      : 'border-l-4 border-blue-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                    team.color === 'red' ? 'bg-red-500' : 'bg-blue-500'
                  }`}>
                    {playerIndex + 1}
                  </div>
                  <span className="text-field-800 font-semibold text-lg">
                    {player.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-field-500 text-sm">
        <p>Generado por el Generador de Equipos</p>
        <p>www.generadorequipos.com</p>
      </div>
    </div>
  );
});

TeamCapture.displayName = 'TeamCapture';

export default TeamCapture;