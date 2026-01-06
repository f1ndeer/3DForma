// Імпортуємо моделі товару та категорій (Type)
const { Device, Type } = require('../models/models')

class CatalogController {
    async getAll(req, res) {
        try {
            // 1. Отримуємо всі товари з Бази Даних (від 1-го до останнього)
            const products = await Device.findAll({
                order: [['id', 'ASC']]
            })

            // 2. Отримуємо всі категорії (типи) з Бази Даних для фільтра
            const types = await Type.findAll({
                order: [['name', 'ASC']]
            })

            // 3. Віддаємо сторінку catalog.ejs і передаємо туди ВСІ дані
            return res.render('catalog', { 
                pageTitle: 'Каталог товарів',
                products: products,
                types: types // 👈 Тепер фільтр у каталозі запрацює!
            })

        } catch (e) {
            console.error('Помилка отримання каталогу:', e)
            
            // Якщо сталася помилка, передаємо порожні масиви, щоб сторінка завантажилась
            return res.render('catalog', { 
                pageTitle: 'Каталог товарів',
                products: [],
                types: [] 
            })
        }
    }
}

module.exports = new CatalogController()