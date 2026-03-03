function exportPDF() {

    if (!lastCalculation) {
        alert("Please calculate first.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Landed Cost Calculation", 10, 10);
    doc.text(`Customs: ${lastCalculation.customsAmount.toFixed(2)} EUR`, 10, 20);
    doc.text(`VAT: ${lastCalculation.vatAmount.toFixed(2)} EUR`, 10, 30);
    doc.text(`Total Cost: ${lastCalculation.convertedTotal.toFixed(2)} ${lastCalculation.currency}`, 10, 40);
    doc.text(`Selling Price: ${lastCalculation.convertedSelling.toFixed(2)} ${lastCalculation.currency}`, 10, 50);

    doc.save("landed_cost.pdf");
}
