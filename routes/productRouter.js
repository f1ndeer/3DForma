const Router = require('express')
const router = new Router()
const productController = require('../controllers/productController')

// Цей роут спрацює, коли адреса буде /product/:id
// (наприклад: /product/5)
router.get('/:id', productController.getOne)

module.exports = router