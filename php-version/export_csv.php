<?php
if (isset($_POST["data"])) {

    $data = json_decode($_POST["data"], true);

    header('Content-Type: text/csv');
    header('Content-Disposition: attachment;filename="landed_cost.csv"');

    $output = fopen("php://output", "w");

    fputcsv($output, ["Customs", "VAT", "Total Cost", "Selling Price"]);

    fputcsv($output, [
        $data["customsAmount"],
        $data["vatAmount"],
        $data["convertedTotal"],
        $data["convertedSelling"]
    ]);

    fclose($output);
    exit;
}
?>
