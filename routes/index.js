const Router = require('express');
const router = new Router();

// --- 1. ІМПОРТ КОНТРОЛЕРІВ ---
const catalogController = require('../controllers/catalogController');
const paymentController = require('../controllers/paymentController');
const userController    = require('../controllers/userController');
const deviceController  = require('../controllers/deviceController');
const brandController   = require('../controllers/brandController');
const typeController    = require('../controllers/typeController');

// --- 2. ІМПОРТ НОВОГО РОУТЕРА ТОВАРІВ ---
const productRouter = require('./productRouter');

// ===========================================
// СТОРІНКИ САЙТУ (FRONTEND)
// ===========================================

router.get('/', (req, res) => {
    res.render('index', { pageTitle: 'Форма3D — Головна' });
});

router.get('/privacy', (req, res) => {
    res.render('privacy', { pageTitle: 'Політика конфіденційності' });
});

router.get('/catalog', catalogController.getAll);

router.get('/favorites', (req, res) => {
    res.render('favorites', { pageTitle: 'Улюблені' });
});

router.use('/product', productRouter);


// ===========================================
// API ТА ФУНКЦІОНАЛ (BACKEND)
// ===========================================

// Решта ваших API для роботи з базою даних та користувачами
router.post('/get-favorites', deviceController.getFavorites);
router.post('/create-checkout', paymentController.create);
router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/auth', userController.check);

// Адмін-функціонал
router.post('/type', typeController.create);
router.get('/type', typeController.getAll);
router.post('/brand', brandController.create);
router.get('/brand', brandController.getAll);
router.post('/device', deviceController.create);
router.get('/device', deviceController.getAll);

module.exports = router;