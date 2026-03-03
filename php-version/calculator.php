<?php
// calculator.php

require_once "config.php";
require_once "currency.php";

function calculateLandedCost($productValue, $shippingCost, $customsRate, $marginRate, $country, $currency) {

    $vatRate = getVatRate($country);

    $customsAmount = $productValue * ($customsRate / 100);
    $subtotal = $productValue + $shippingCost + $customsAmount;
    $vatAmount = $subtotal * ($vatRate / 100);
    $totalCostEUR = $subtotal + $vatAmount;

    $sellingPriceEUR = $totalCostEUR * (1 + ($marginRate / 100));

    $convertedTotal = convertCurrency($totalCostEUR, $currency);
    $convertedSelling = convertCurrency($sellingPriceEUR, $currency);

    return [
        "customsAmount" => $customsAmount,
        "vatAmount" => $vatAmount,
        "totalCostEUR" => $totalCostEUR,
        "sellingPriceEUR" => $sellingPriceEUR,
        "convertedTotal" => $convertedTotal,
        "convertedSelling" => $convertedSelling,
        "currency" => $currency
    ];
}
?>
