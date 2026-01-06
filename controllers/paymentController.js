// server/controllers/paymentController.js
const axios = require('axios');
require('dotenv').config(); // Переконайтеся, що встановили dotenv

class PaymentController {
    async create(req, res) {
        const { productId, productName, amount } = req.body;

        try {
            const payload = {
                amount: amount * 100,
                merchantPaymInfo: {
                    reference: `order_${productId}_${Date.now()}`,
                    destination: `Оплата: ${productName}`,
                },
                redirectUrl: 'http://localhost:5000/success', // Змініть порт/адресу на ваші
                webHookUrl: 'http://localhost:5000/api/webhook',
            };

            // Приклад для Monobank (або ваш код LiqPay)
            const response = await axios.post(
                'https://api.monobank.ua/api/merchant/invoice/create',
                payload,
                { headers: { 'X-Token': process.env.MONOBANK_TOKEN } }
            );

            return res.json({ url: response.data.pageUrl });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Помилка оплати' });
        }
    }
}

module.exports = new PaymentController();