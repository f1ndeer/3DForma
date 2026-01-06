const uuid = require('uuid')
const path = require('path');
const {Device, DeviceInfo} = require('../models/models')
const ApiError = require('../error/ApiError');
// 👇 ДОДАНО: Імпорт операторів Sequelize (для пошуку масиву ID)
const { Op } = require('sequelize')

class DeviceController {
    async create(req, res, next) {
        try {
            // Додаємо нові поля description, images, info (текстове)
            let {name, price, brandId, typeId, info, description, images} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            
            // Створюємо товар з усіма новими полями
            const device = await Device.create({
                name, 
                price, 
                brandId, 
                typeId, 
                img: fileName, 
                description, 
                info, // Це коротке поле "Кому підходить"
                images // Це JSON з галереєю
            });

            // Це старий код для таблиці характеристик (якщо ви його використовуєте в адмінці)
            // Якщо прийде info як масив характеристик (стара логіка), ми його збережемо в DeviceInfo
            if (info && typeof info !== 'string') {
                try {
                    const parsedInfo = JSON.parse(info)
                    parsedInfo.forEach(i =>
                        DeviceInfo.create({
                            title: i.title,
                            description: i.description,
                            deviceId: device.id
                        })
                    )
                } catch (e) {
                    // Ігноруємо помилку парсингу, якщо info - це просто рядок
                }
            }

            return res.json(device)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async getAll(req, res) {
        let {brandId, typeId, limit, page} = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        let devices;
        if (!brandId && !typeId) {
            devices = await Device.findAndCountAll({limit, offset})
        }
        if (brandId && !typeId) {
            devices = await Device.findAndCountAll({where:{brandId}, limit, offset})
        }
        if (!brandId && typeId) {
            devices = await Device.findAndCountAll({where:{typeId}, limit, offset})
        }
        if (brandId && typeId) {
            devices = await Device.findAndCountAll({where:{typeId, brandId}, limit, offset})
        }
        return res.json(devices)
    }

    // 👇 ОНОВЛЕНО: getOne з правильним include
    async getOne(req, res) {
        const {id} = req.params
        const device = await Device.findOne(
            {
                where: {id},
                // Ми змінили назву асоціації в models.js на 'device_details', 
                // щоб не було конфлікту з полем info
                include: [{model: DeviceInfo, as: 'device_details'}]
            },
        )
        return res.json(device)
    }

    // 👇 НОВИЙ МЕТОД: Отримання товарів для Улюблених
    async getFavorites(req, res) {
        try {
            const { ids } = req.body // Отримуємо масив ID [1, 2, 5]

            if (!ids || ids.length === 0) {
                return res.json([])
            }

            // Шукаємо всі товари, чиї ID входять у список
            const devices = await Device.findAll({
                where: {
                    id: {
                        [Op.in]: ids 
                    }
                }
            })

            return res.json(devices)
        } catch (e) {
            console.error(e)
            return res.json([])
        }
    }
}

module.exports = new DeviceController()