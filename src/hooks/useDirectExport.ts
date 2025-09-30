import jsPDF from 'jspdf';

interface Player {
  id: string;
  name: string;
}

interface Team {
  name: string;
  color: string;
  players: Player[];
}

export const useDirectExport = () => {
  const generatePDF = (teams: Team[]) => {
    try {
      console.log('Iniciando generación de PDF directa...');
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      const contentHeight = pageHeight - (margin * 2);

      // Título principal
      pdf.setFontSize(24);
      pdf.setTextColor(45, 143, 45); // Verde césped
      pdf.text('Equipos Generados', pageWidth / 2, margin + 15, { align: 'center' });

      // Fecha
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      const fecha = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      pdf.text(`Generado el ${fecha}`, pageWidth / 2, margin + 25, { align: 'center' });

      // Configuración de equipos
      const teamWidth = (contentWidth - 20) / 2; // 20mm de separación entre equipos
      const teamHeight = contentHeight - 50;
      const startY = margin + 40;

      teams.forEach((team, teamIndex) => {
        const x = margin + (teamIndex * (teamWidth + 20));
        const y = startY;

        // Fondo del equipo
        const teamColor = team.color === 'red' ? [239, 68, 68] : [59, 130, 246];
        const bgColor = team.color === 'red' ? [254, 242, 242] : [239, 246, 255];
        
        // Rectángulo de fondo
        pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
        pdf.rect(x, y, teamWidth, teamHeight, 'F');

        // Borde izquierdo de color
        pdf.setFillColor(teamColor[0], teamColor[1], teamColor[2]);
        pdf.rect(x, y, 4, teamHeight, 'F');

        // Título del equipo
        pdf.setFontSize(18);
        pdf.setTextColor(teamColor[0], teamColor[1], teamColor[2]);
        pdf.text(team.name, x + 10, y + 20);

        // Lista de jugadores
        pdf.setFontSize(14);
        pdf.setTextColor(60, 60, 60);

        team.players.forEach((player, playerIndex) => {
          const playerY = y + 35 + (playerIndex * 25);
          
          // Número del jugador
          pdf.setFillColor(teamColor[0], teamColor[1], teamColor[2]);
          pdf.circle(x + 15, playerY - 3, 8, 'F');
          pdf.setTextColor(255, 255, 255);
          pdf.setFontSize(12);
          pdf.text((playerIndex + 1).toString(), x + 15, playerY + 2, { align: 'center' });

          // Nombre del jugador
          pdf.setTextColor(60, 60, 60);
          pdf.setFontSize(14);
          pdf.text(player.name, x + 30, playerY);
        });
      });

      // Footer
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text('Generado por el Generador de Equipos', pageWidth / 2, pageHeight - 10, { align: 'center' });
      pdf.text('www.generadorequipos.com', pageWidth / 2, pageHeight - 5, { align: 'center' });

      // Guardar PDF
      pdf.save('equipos-generados.pdf');
      console.log('PDF generado exitosamente');

    } catch (error) {
      console.error('Error generando PDF:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert('Error al generar el PDF: ' + errorMessage);
    }
  };

  const generateJPG = (teams: Team[]) => {
    try {
      console.log('Iniciando generación de JPG...');
      
      // Crear un canvas temporal
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('No se pudo crear el contexto del canvas');
      }

      // Configurar dimensiones
      canvas.width = 1200;
      canvas.height = 800;

      // Fondo blanco
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Título principal
      ctx.fillStyle = '#2d8f2d';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Equipos Generados', canvas.width / 2, 80);

      // Fecha
      ctx.fillStyle = '#666666';
      ctx.font = '24px Arial';
      const fecha = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      ctx.fillText(`Generado el ${fecha}`, canvas.width / 2, 120);

      // Configuración de equipos
      const teamWidth = 500;
      const teamHeight = 600;
      const startY = 150;
      const margin = 50;

      teams.forEach((team, teamIndex) => {
        const x = margin + (teamIndex * (teamWidth + margin));
        const y = startY;

        // Colores del equipo
        const teamColor = team.color === 'red' ? '#ef4444' : '#3b82f6';
        const bgColor = team.color === 'red' ? '#fef2f2' : '#eff6ff';

        // Fondo del equipo
        ctx.fillStyle = bgColor;
        ctx.fillRect(x, y, teamWidth, teamHeight);

        // Borde izquierdo
        ctx.fillStyle = teamColor;
        ctx.fillRect(x, y, 8, teamHeight);

        // Título del equipo
        ctx.fillStyle = teamColor;
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(team.name, x + 20, y + 50);

        // Lista de jugadores
        ctx.font = '24px Arial';
        ctx.fillStyle = '#333333';

        team.players.forEach((player, playerIndex) => {
          const playerY = y + 100 + (playerIndex * 50);
          
          // Número del jugador
          ctx.fillStyle = teamColor;
          ctx.beginPath();
          ctx.arc(x + 30, playerY - 5, 20, 0, 2 * Math.PI);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 20px Arial';
          ctx.textAlign = 'center';
          ctx.fillText((playerIndex + 1).toString(), x + 30, playerY + 5);

          // Nombre del jugador
          ctx.fillStyle = '#333333';
          ctx.font = '24px Arial';
          ctx.textAlign = 'left';
          ctx.fillText(player.name, x + 70, playerY);
        });
      });

      // Footer
      ctx.fillStyle = '#999999';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Generado por el Generador de Equipos', canvas.width / 2, canvas.height - 30);
      ctx.fillText('www.generadorequipos.com', canvas.width / 2, canvas.height - 10);

      // Convertir a imagen y descargar
      const link = document.createElement('a');
      link.download = 'equipos-generados.jpg';
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
      
      console.log('JPG generado exitosamente');

    } catch (error) {
      console.error('Error generando JPG:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert('Error al generar el JPG: ' + errorMessage);
    }
  };

  return {
    generatePDF,
    generateJPG
  };
};

