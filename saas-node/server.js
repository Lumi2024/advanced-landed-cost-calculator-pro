const express = require("express");
const app = express();
app.use(express.json());

app.post("/api/calculate", (req, res) => {
    const { product, shipping, customs, vat } = req.body;

    const customsAmount = product * customs/100;
    const subtotal = product + shipping + customsAmount;
    const vatAmount = subtotal * vat/100;
    const total = subtotal + vatAmount;

    res.json({ total });
});

app.listen(3000);
