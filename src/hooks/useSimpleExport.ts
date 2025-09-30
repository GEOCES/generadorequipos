import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const useSimpleExport = () => {
  const exportRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    const element = document.getElementById('exportable-teams');
    if (!element) {
      console.error('No se encontró el elemento para exportar');
      alert('Error: No se encontró el contenido para exportar');
      return;
    }

    try {
      console.log('Iniciando generación de PDF...');
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: true
      });

      console.log('Canvas generado:', canvas.width, 'x', canvas.height);

      const imgData = canvas.toDataURL('image/png');
      console.log('Imagen generada, tamaño:', imgData.length);

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      console.log('Dimensiones PDF:', imgWidth, 'x', imgHeight);

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('equipos-generados.pdf');
      
      console.log('PDF generado exitosamente');
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF: ' + error.message);
    }
  };

  const generateJPG = async () => {
    const element = document.getElementById('exportable-teams');
    if (!element) {
      console.error('No se encontró el elemento para exportar');
      alert('Error: No se encontró el contenido para exportar');
      return;
    }

    try {
      console.log('Iniciando generación de JPG...');
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: true
      });

      console.log('Canvas generado:', canvas.width, 'x', canvas.height);

      const link = document.createElement('a');
      link.download = 'equipos-generados.jpg';
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
      
      console.log('JPG generado exitosamente');
    } catch (error) {
      console.error('Error generando JPG:', error);
      alert('Error al generar el JPG: ' + error.message);
    }
  };

  return {
    exportRef,
    generatePDF,
    generateJPG
  };
};

