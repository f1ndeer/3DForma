const { Device } = require('../models/models')

class ProductController {
    async getOne(req, res) {
        try {
            // Отримуємо ID з адреси посилання (наприклад, з /product/5 беремо "5")
            const { id } = req.params

            // Шукаємо товар у базі даних за цим ID
            const product = await Device.findOne({
                where: { id }
            })

            // Якщо товару з таким ID немає, повертаємо на головну
            if (!product) {
                return res.redirect('/')
            }

            // Віддаємо шаблон product.ejs і передаємо туди знайдені дані
            return res.render('product', {
                product: product,
                pageTitle: product.name 
            })

        } catch (e) {
            console.error(e)
            res.redirect('/')
        }
    }
}

module.exports = new ProductController()