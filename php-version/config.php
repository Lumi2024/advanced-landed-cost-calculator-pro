<?php
// config.php

$vatRates = [
    "FR" => 20,
    "DE" => 19,
    "ES" => 21,
    "IT" => 22,
    "NL" => 21,
    "BE" => 21,
    "PL" => 23,
    "PT" => 23,
    "IE" => 23
];

function getVatRate($country) {
    global $vatRates;
    return isset($vatRates[$country]) ? $vatRates[$country] : 0;
}
?>
