<?php
// currency.php

$currencyRates = [
    "EUR" => 1,
    "USD" => 1.08,
    "GBP" => 0.85
];

function convertCurrency($amountEUR, $currency) {
    global $currencyRates;
    $rate = isset($currencyRates[$currency]) ? $currencyRates[$currency] : 1;
    return $amountEUR * $rate;
}
?>
