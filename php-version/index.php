<?php
require_once "calculator.php";

$result = null;

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $productValue = floatval($_POST["productValue"]);
    $shippingCost = floatval($_POST["shippingCost"]);
    $customsRate = floatval($_POST["customsRate"]);
    $marginRate = floatval($_POST["marginRate"]);
    $country = $_POST["country"];
    $currency = $_POST["currency"];

    $result = calculateLandedCost(
        $productValue,
        $shippingCost,
        $customsRate,
        $marginRate,
        $country,
        $currency
    );
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Landed Cost Calculator PRO</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<div class="container">
<h2>Landed Cost Calculator PRO (PHP)</h2>

<form method="post">

<input type="number" step="0.01" name="productValue" placeholder="Product value" required>
<input type="number" step="0.01" name="shippingCost" placeholder="Shipping cost" required>
<input type="number" step="0.01" name="customsRate" placeholder="Customs %" required>
<input type="number" step="0.01" name="marginRate" placeholder="Margin %" required>

<select name="country">
<option value="FR">France</option>
<option value="DE">Germany</option>
<option value="ES">Spain</option>
<option value="IT">Italy</option>
</select>

<select name="currency">
<option value="EUR">EUR</option>
<option value="USD">USD</option>
<option value="GBP">GBP</option>
</select>

<button type="submit">Calculate</button>

</form>

<?php if ($result): ?>

<div class="results">
    <h3>Results</h3>
    Customs: <?= round($result["customsAmount"], 2) ?> EUR<br>
    VAT: <?= round($result["vatAmount"], 2) ?> EUR<br>
    Total cost: <?= round($result["convertedTotal"], 2) ?> <?= $result["currency"] ?><br>
    Selling price: <?= round($result["convertedSelling"], 2) ?> <?= $result["currency"] ?>
</div>

<form action="export_csv.php" method="post">
    <input type="hidden" name="data" value='<?= json_encode($result) ?>'>
    <button type="submit">Export CSV</button>
</form>

<?php endif; ?>

</div>
</body>
</html>
