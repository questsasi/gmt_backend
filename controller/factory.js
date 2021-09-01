/**
 * @author [author]
 * @email [sa@sulthanallaudeen.com]
 * @create date 2021-08-29 17:09:49
 * @modify date 2021-08-29 17:09:49
 * @desc [Factory Controller]
 */
var express = require('express');
var router = express.Router();

const { factory, zone, line, target, production } = require('../models/index');

factory.hasMany(zone, { foreignKey: 'factory_id' });
zone.hasMany(line, { foreignKey: 'zone_id' });
line.hasMany(target, { foreignKey: 'line_id' });
target.hasMany(production, { foreignKey: 'target_id' });

router.get('/', async function(req, res, next) {
    try {
        const result = await factory.findAll({
            include: [{
                model: zone,
                attributes: ['id', 'zone_name'],
                include: [
                    { model: line, attributes: ['id', 'line_name'] }
                ]
            }, ]
        });
        res.status(200).json({
            success: true,
            status: 1,
            message: "Data Fetched Success",
            data: {
                zone: result
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            status: 0,
            message: "Server Error",
            data: {
                error: error
            }
        });
    }
});

router.get('/:id', async function(req, res, next) {
    try {
        const result = await factory.findOne({
            include: [{
                model: zone,
                attributes: ['id', 'zone_name'],
                include: [
                    { model: line, attributes: ['id', 'line_name'] }
                ]
            }, ],
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({
            success: true,
            status: 1,
            message: "Data Fetched Success",
            data: {
                zone: result
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            status: 0,
            message: "Server Error",
            data: {
                error: error
            }
        });
    }
});

module.exports = router;