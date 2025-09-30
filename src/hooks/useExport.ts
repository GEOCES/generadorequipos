import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const useExport = () => {
  const teamRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!teamRef.current) {
      console.error('No se encontró el elemento para capturar');
      return;
    }

    try {
      // Mostrar temporalmente el elemento para captura
      teamRef.current.style.position = 'absolute';
      teamRef.current.style.left = '-9999px';
      teamRef.current.style.top = '0';
      teamRef.current.style.visibility = 'visible';
      teamRef.current.style.display = 'block';

      // Esperar un momento para que se renderice
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(teamRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: teamRef.current.scrollWidth,
        height: teamRef.current.scrollHeight
      });

      // Ocultar el elemento nuevamente
      teamRef.current.style.position = 'static';
      teamRef.current.style.left = 'auto';
      teamRef.current.style.top = 'auto';
      teamRef.current.style.visibility = 'hidden';
      teamRef.current.style.display = 'none';

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('equipos-generados.pdf');
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
    }
  };

  const generateJPG = async () => {
    if (!teamRef.current) {
      console.error('No se encontró el elemento para capturar');
      return;
    }

    try {
      // Mostrar temporalmente el elemento para captura
      teamRef.current.style.position = 'absolute';
      teamRef.current.style.left = '-9999px';
      teamRef.current.style.top = '0';
      teamRef.current.style.visibility = 'visible';
      teamRef.current.style.display = 'block';

      // Esperar un momento para que se renderice
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(teamRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: teamRef.current.scrollWidth,
        height: teamRef.current.scrollHeight
      });

      // Ocultar el elemento nuevamente
      teamRef.current.style.position = 'static';
      teamRef.current.style.left = 'auto';
      teamRef.current.style.top = 'auto';
      teamRef.current.style.visibility = 'hidden';
      teamRef.current.style.display = 'none';

      const link = document.createElement('a');
      link.download = 'equipos-generados.jpg';
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
    } catch (error) {
      console.error('Error generando JPG:', error);
      alert('Error al generar el JPG. Por favor, inténtalo de nuevo.');
    }
  };

  return {
    teamRef,
    generatePDF,
    generateJPG
  };
};
