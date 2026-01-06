require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())

// ==========================================
// 1. СТАТИКА (НАЙВАЖЛИВІШЕ ДЛЯ КАРТИНОК)
// ==========================================
// Цей рядок каже серверу: "Якщо просять файл, шукай його в папці static"
// Саме завдяки цьому працюють посилання типу /image/trex.jpg
app.use(express.static(path.resolve(__dirname, 'static')))

// ==========================================
// 2. НАЛАШТУВАННЯ EJS
// ==========================================
app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))

// ==========================================
// 3. РОБОТА З ФАЙЛАМИ
// ==========================================
app.use(fileUpload({}))

// ==========================================
// 4. МАРШРУТИ
// ==========================================
// Підключаємо головний роутер. Він обробляє:
// - Головну сторінку (/)
// - Каталог (/catalog)
// - Товари (/product...)
// - Оплату (/create-checkout)
app.use('/', router)

// ==========================================
// 5. ОБРОБКА ПОМИЛОК
// ==========================================
// Має бути завжди останнім
app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()