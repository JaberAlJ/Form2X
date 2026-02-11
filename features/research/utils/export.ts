import { PaperData } from '../types';

export const exportToHtml = (data: PaperData, isDarkMode: boolean) => {
    const container = document.getElementById('paper-container');
    if (!container) return;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title} - Research Paper</title>
  
  <!-- KaTeX for LaTeX rendering -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  
  <style>
    /* IEEE Basic Resets */
    body { 
      margin: 0; 
      padding: 0; 
      background-color: ${isDarkMode ? '#020617' : '#e2e8f0'}; 
      display: flex; 
      justify-content: center; 
      font-family: 'Times New Roman', Times, serif;
      transition: background-color 0.3s ease;
    }

    #paper-container {
      background: white;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, ${isDarkMode ? '0.5' : '0.1'}), 0 8px 10px -6px rgba(0, 0, 0, ${isDarkMode ? '0.5' : '0.1'});
      margin: 40px auto;
    }

    @media print {
      body { 
        background-color: white !important; 
        display: block;
      }
      #paper-container {
        box-shadow: none !important;
        margin: 0 !important;
        width: 100% !important;
      }
      @page {
        margin: ${data.style.marginSize}in 0;
        size: A4;
      }
    }
  </style>
</head>
<body>
  ${container.outerHTML}
  
  <div style="position: fixed; bottom: 20px; right: 20px; font-family: sans-serif;" class="no-print">
    <button onclick="window.print()" style="background: #4f46e5; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
      Print to PDF
    </button>
  </div>

  <style>
    @media print {
      .no-print { display: none !important; }
    }
  </style>
</body>
</html>
  `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.title.substring(0, 40).replace(/[^a-z0-9]/gi, '_').toLowerCase()}_IEEE_Paper.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const exportToJson = (data: PaperData) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.title.substring(0, 40).replace(/[^a-z0-9]/gi, '_').toLowerCase()}_ResearchData.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const printToPdf = () => {
    window.print();
};
