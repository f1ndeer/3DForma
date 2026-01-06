const { Type } = require('../models/models');
const ApiError = require('../error/ApiError');

class TypeController {
    
    // 1. Створити тип
    async create(req, res, next) {
        try {
            const { name } = req.body;
            
            if (!name) {
                return next(ApiError.badRequest('Не задано название типа'));
            }

            const type = await Type.create({ name });
            return res.json(type);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    // 2. Отримати всі типи
    async getAll(req, res) {
        // Тут try/catch не обов'язковий, якщо немає складної логіки, 
        // але для надійності можна залишити
        try {
            const types = await Type.findAll();
            return res.json(types);
        } catch (e) {
            // Якщо станеться помилка бази даних
            console.error(e); 
            return res.status(500).json({message: "Помилка отримання типів"});
        }
    }

    // 3. Видалити тип (якщо знадобиться для адмінки)
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            
            if (!id) {
                return next(ApiError.badRequest('Не указан ID'));
            }

            const deletedCount = await Type.destroy({ where: { id } });

            if (!deletedCount) {
                return next(ApiError.badRequest('Тип не найден'));
            }

            return res.json({ message: 'Тип успешно удален' });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new TypeController();