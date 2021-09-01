/**
 * @author [author]
 * @email [sa@sulthanallaudeen.com]
 * @create date 2021-08-29 17:09:49
 * @modify date 2021-08-29 17:09:49
 * @desc [Target Controller]
 */
var express = require('express');
var router = express.Router();
var _ = require("underscore");

const { factory, zone, line, target, production } = require('../models/index');

factory.hasMany(zone, { foreignKey: 'factory_id' });
zone.hasMany(line, { foreignKey: 'zone_id' });
line.hasMany(target, { foreignKey: 'line_id' });
target.hasMany(production, { foreignKey: 'target_id' });

router.post('/', async function(req, res, next) {
    try {
        const result = await target.create({
            line_id: req.body.line_id,
            target: req.body.target,
            date: req.body.date,
            production_hrs: req.body.production_hrs
        });
        res.status(200).json({
            success: true,
            status: 1,
            message: "Target Created Success",
            data: {
                target: result
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

router.put('/', async function(req, res, next) {
    try {
        const result = await target.update({ target: req.body.target }, { where: { id: req.body.target_id } })
        res.status(200).json({
            success: true,
            status: 1,
            message: "Target Updated Success",
            data: {
                target: result
            }
        });
    } catch (err) {
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

router.delete('/:id', async function(req, res, next) {
    try {
        const result = await target.destroy({ where: { id: req.params.id } })
        res.status(200).json({
            success: true,
            status: 1,
            message: "Target Deleted Success",
            data: {
                target: result
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

router.get('/list/:date', async function(req, res, next) {
    try {
        const result = await zone.findAll({
            model: zone,
            attributes: [
                ['id', 'zoneId'], 'zone_name'
            ],
            required: true,
            include: [{
                model: line,
                attributes: ['id', 'line_name'],
                required: true,
                include: [{
                    model: target,
                    attributes: ['id', 'production_hrs', 'target_date', 'target'],
                    required: true,
                    include: [{
                        model: production,
                        attributes: ['id', 'production_date', 'hour', 'output'],
                        required: true,
                    }]
                }]
            }]
        });
        var responseArray = [];
        for (let zoneindex = 0; zoneindex < result.length; zoneindex++) {
            const zoneElement = result[zoneindex].dataValues;
            var zone_id = zoneElement.zoneId;
            var zone_name = zoneElement.zone_name;
            for (let lineindex = 0; lineindex < zoneElement.lines.length; lineindex++) {
                const lineElement = zoneElement.lines[lineindex];
                var line_id = lineElement.id;
                var line_name = lineElement.line_name;
                for (let targetindex = 0; targetindex < lineElement.targets.length; targetindex++) {
                    const targetElement = lineElement.targets[targetindex];
                    var production_hours = targetElement.production_hrs;
                    var production_target = targetElement.target;
                    for (let productionIndex = 0; productionIndex < targetElement.productions.length; productionIndex++) {
                        const productionElement = targetElement.productions[productionIndex];
                        var target_id = productionElement.id;
                        var target_target = productionElement.target;
                        var response = {
                            "target_id": target_id,
                            "zone_id": zone_id,
                            "zone_name": zone_name,
                            "line_id": line_id,
                            "line_name": line_name,
                            "production_hours": production_hours,
                            "target": production_target
                        }
                        responseArray.push(response);
                    }
                }
            }
        }
        res.status(200).json({
            success: true,
            status: 1,
            message: "Data Fetched Success",
            data: responseArray
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

router.get('/details', async function(req, res, next) {
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

module.exports = router;