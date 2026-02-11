import { ResumeData } from '../types';

export const exportToHtml = (data: ResumeData, isDarkMode: boolean = false) => {
  const container = document.getElementById('resume-container');
  if (!container) return;

  const bgColor = isDarkMode ? '#0f172a' : '#f0f2f5';
  const shadow = isDarkMode ? '0 10px 25px rgba(0,0,0,0.5)' : '0 0 10px rgba(0,0,0,0.1)';

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.header.fullName} - Resume</title>
  <style>
    body { 
      margin: 0; 
      padding: 0; 
      background-color: ${bgColor}; 
      display: flex; 
      justify-content: center; 
      transition: background-color 0.3s ease;
    }
    @media print {
      body { background-color: white; }
    }
    .resume-wrapper {
      box-shadow: ${shadow};
      margin: 40px auto;
      border-radius: 4px;
      overflow: hidden;
    }
    @media print {
      .resume-wrapper {
        box-shadow: none;
        margin: 0;
      }
    }
  </style>
</head>
<body>
  ${container.outerHTML}
  
  <div style="position: fixed; bottom: 20px; right: 20px; font-family: sans-serif;" class="no-print">
    <button onclick="window.print()" style="background: #1E88E5; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
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
  link.download = `${data.header.fullName.replace(/\s+/g, '_')}_Resume.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToJson = (data: ResumeData) => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${data.header.fullName.replace(/\s+/g, '_')}_ResumeData.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
