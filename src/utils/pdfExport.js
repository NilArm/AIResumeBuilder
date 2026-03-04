export function exportToPdf(elementId, filename = 'Resume.pdf') {
    return import('html2pdf.js').then((module) => {
        const html2pdf = module.default;
        const element = document.getElementById(elementId);

        const opt = {
            margin: [0.3, 0.4, 0.3, 0.4],
            filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true,
            },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        return html2pdf().set(opt).from(element).save();
    });
}
