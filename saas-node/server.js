// server.js

const express = require("express");
const cors = require("cors");
const { getVatRate } = require("./vatRates");
const { convert } = require("./currencyService");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Landed Cost Calculator PRO API running");
});

app.post("/api/calculate", (req, res) => {
    try {
        const {
            productValue,
            shippingCost,
            customsRate,
            marginRate,
            country,
            currency
        } = req.body;

        if (!productValue || !shippingCost || !country) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const vatRate = getVatRate(country);

        const customsAmount = productValue * (customsRate / 100);
        const subtotal = productValue + shippingCost + customsAmount;
        const vatAmount = subtotal * (vatRate / 100);
        const totalCostEUR = subtotal + vatAmount;

        const sellingPriceEUR =
            totalCostEUR * (1 + (marginRate || 0) / 100);

        const convertedTotal = convert(totalCostEUR, currency || "EUR");
        const convertedSelling = convert(sellingPriceEUR, currency || "EUR");

        res.json({
            breakdown: {
                customsAmount,
                vatAmount,
                totalCostEUR,
                sellingPriceEUR
            },
            converted: {
                currency: currency || "EUR",
                totalCost: convertedTotal,
                sellingPrice: convertedSelling
            }
        });
    } catch (err) {
        res.status(500).json({ error: "Calculation error" });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
