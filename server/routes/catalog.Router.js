// server/routes/catalogRouter.js
const Router = require('express')
const router = new Router()
const catalogController = require('../controllers/catalogController')

// Коли хтось заходить на /catalog (префікс буде в головному роутері),
// ми викликаємо функцію getAll
router.get('/', catalogController.getAll)

// У майбутньому сюди можна додати сторінку окремого товару:
// router.get('/:id', catalogController.getOne)

module.exports = router