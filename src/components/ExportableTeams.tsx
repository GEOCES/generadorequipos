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

interface ExportableTeamsProps {
  teams: Team[];
}

const ExportableTeams: React.FC<ExportableTeamsProps> = ({ teams }) => {
  return (
    <div id="exportable-teams" style={{ 
      width: '800px', 
      minHeight: '600px',
      backgroundColor: 'white', 
      padding: '40px',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
      boxSizing: 'border-box',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
          <MdSportsSoccer style={{ fontSize: '48px', color: '#2d8f2d', marginRight: '15px' }} />
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#2d8f2d', margin: 0 }}>
            Equipos Generados
          </h1>
        </div>
        <p style={{ fontSize: '18px', color: '#666', margin: 0 }}>
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
      <div style={{ display: 'flex', gap: '40px', justifyContent: 'center' }}>
        {teams.map((team) => (
          <div
            key={team.name}
            style={{
              width: '350px',
              borderRadius: '12px',
              padding: '30px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              borderLeft: `6px solid ${team.color === 'red' ? '#ef4444' : '#3b82f6'}`,
              backgroundColor: team.color === 'red' ? '#fef2f2' : '#eff6ff'
            }}
          >
            {/* Team Header */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '30px',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: team.color === 'red' ? '#ef4444' : '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '15px'
              }}>
                <FaUsers style={{ color: 'white', fontSize: '16px' }} />
              </div>
              <h3 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: '#333',
                margin: 0,
                marginRight: '15px'
              }}>
                {team.name}
              </h3>
              <FaTrophy style={{ 
                fontSize: '24px', 
                color: team.color === 'red' ? '#ef4444' : '#3b82f6'
              }} />
            </div>

            {/* Players List */}
            <div>
              {team.players.map((player, playerIndex) => (
                <div
                  key={player.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    borderLeft: `4px solid ${team.color === 'red' ? '#fca5a5' : '#93c5fd'}`
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: team.color === 'red' ? '#ef4444' : '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    marginRight: '16px'
                  }}>
                    {playerIndex + 1}
                  </div>
                  <span style={{ 
                    fontSize: '18px', 
                    fontWeight: '600', 
                    color: '#333'
                  }}>
                    {player.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ 
        marginTop: '40px', 
        textAlign: 'center', 
        color: '#999', 
        fontSize: '14px' 
      }}>
        <p style={{ margin: '5px 0' }}>Generado por el Generador de Equipos</p>
        <p style={{ margin: '5px 0' }}>www.generadorequipos.com</p>
      </div>
    </div>
  );
};

export default ExportableTeams;
