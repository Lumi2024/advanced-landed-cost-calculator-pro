function exportCSV() {

    if (!lastCalculation) {
        alert("Please calculate first.");
        return;
    }

    const rows = [
        ["Customs", lastCalculation.customsAmount],
        ["VAT", lastCalculation.vatAmount],
        ["Total Cost", lastCalculation.convertedTotal],
        ["Selling Price", lastCalculation.convertedSelling]
    ];

    let csvContent = "data:text/csv;charset=utf-8,";
    rows.forEach(row => {
        csvContent += row.join(",") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "landed_cost.csv");
    document.body.appendChild(link);
    link.click();
}
