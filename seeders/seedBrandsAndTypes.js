const sequelize = require('../db');
const { Brand, Type } = require('../models/models');

const seedBrandsAndTypes = async () => {
    try {
        // Перевіримо чи вже існують бренди
        const brandCount = await Brand.count();
        if (brandCount > 0) {
            console.log('Бренди вже додані в БД');
            return;
        }

        // Додаємо бренди
        const brands = [
            { name: 'Creality' },
            { name: 'Anycubic' },
            { name: 'Elegoo' },
            { name: 'Prusa' },
            { name: 'Formlabs' }
        ];

        await Brand.bulkCreate(brands);
        console.log('✅ Бренди додані в БД');

        // Додаємо типи
        const types = [
            { name: '3D Printer' },
            { name: 'FDM Printer' },
            { name: 'Resin Printer' },
            { name: 'SLA Printer' },
            { name: 'LCD Printer' }
        ];

        await Type.bulkCreate(types);
        console.log('✅ Типи додані в БД');

    } catch (e) {
        console.error('Помилка при додаванні даних:', e.message);
    }
};

module.exports = seedBrandsAndTypes;
