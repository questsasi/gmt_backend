/**
 * @author [author]
 * @email [sa@sulthanallaudeen.com]
 * @create date 2021-08-29 17:09:49
 * @modify date 2021-08-29 17:09:49
 * @desc [Production Controller]
 */
var express = require('express');
var router = express.Router();
var _ = require("underscore");

const { factory, zone, line, target, production, buyer, style } = require('../models/index');
const errorHandler = require('../util/errorHandler');

factory.hasMany(zone, { foreignKey: 'factory_id' });
zone.hasMany(line, { foreignKey: 'zone_id' });
line.hasMany(target, { foreignKey: 'line_id' });
target.hasMany(production, { foreignKey: 'target_id' });
target.belongsTo(style, { foreignKey: 'style_id' });
target.belongsToMany(buyer, { foreignKey: 'buyer_id', through: target });
production.belongsTo(buyer, { as: "buyer", foreignKey: "buyer_id"});
buyer.hasMany(production, { as: "productions", foreignKey: "buyer_id"});
production.belongsTo(style, { as: "style", foreignKey: "style_id"});
style.hasMany(production, { as: "productions", foreignKey: "style_id"});



router.post('/postproductionhours', async function(req, res, next) {
    try {
        const result = await production.create({
            production_date: req.body.production_date,
            hour: req.body.hour,
            output: req.body.output,
            target_id: req.body.target_id,
            buyer_id: req.body.buyer_id,
            style_id: req.body.style_id
        });
        res.status(200).json({
            success: true,
            status: 1,
            message: "Production Created",
            data: {
                production: result
            }
        });
    } catch (error) {
        returnObj = errorHandler(error);
        res.status(returnObj.code).json(returnObj.data);
    }
});

router.get('/productionhours', async function(req, res, next) {
    try {
        const result = await factory.findAll({
            raw: true,
            required: true,
            attributes: [
                'id', 'factory_name',
            ],
            include: [{
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
                        attributes: [['id', 'target_id'], 'production_hrs', 'target_date'],
                        required: true,
                        include: [{
                            model: production,
                            attributes: ['production_date', 'hour', 'output'],
                            required: true,
                        }]
                    }]
                }]
            }, ]
        });
        res.status(200).json({
            success: true,
            status: 1,
            message: "Production Fetched",
            data: {
                hour: result
            }
        });
    } catch (error) {
        returnObj = errorHandler(error);
        res.status(returnObj.code).json(returnObj.data);
    }
});

router.get('/productionbyhour/:date', async function(req, res, next) {
    try {
        const result = await factory.findAll({
            raw: true,
            required: true,
            attributes: ['id', 'factory_name'],
            include: [{
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
                        attributes: ['id', 'production_hrs', 'target_date'],
                        required: true,
                        include: [{
                            model: production,
                            attributes: ['production_date', 'hour', 'output'],
                            required: true,
                            where: {
                                production_date: req.params.date
                            }
                        }]
                    }]
                }]
            }, ]
        });
        res.status(200).json({
            success: true,
            status: 1,
            message: "Production Fetched",
            data: {
                hour: result
            }
        });
    } catch (error) {
        returnObj = errorHandler(error);
        res.status(returnObj.code).json(returnObj.data);
    }
});

router.get('/list/:date', async function(req, res, next) {
    try {
        const result = await factory.findAll({
            raw: true,
            required: true,
            attributes: [
                ['id', 'factory_id'], 'factory_name'
            ],
            include: [{
                model: zone,
                attributes: [
                    ["id", "zone_id"], "zone_name"
                ],
                required: true,
                include: [{
                    model: line,
                    attributes: [
                        ['id', 'line_id'], 'line_name'
                    ],
                    required: true,
                    include: [{
                        model: target,
                        attributes: [
                            ['id', 'target_id'], 'production_hrs', 'target_date', 'target'
                        ],
                        required: true,
                        include: [{
                            model: production,
                            attributes: [
                                ['id', 'production_id'], 'production_date', 'hour', 'output'
                            ],
                            required: true,
                            where: {
                                production_date: req.params.date
                            },
                            include: [{
                                model: buyer,
                                as: 'buyer',
                                required: true,
                                attributes: [['id', 'buyer_id'], 'buyer_name']
                            }, {
                                model: style,
                                as: 'style',
                                required: true,
                                attributes: [['id', 'style_id'], 'style_name']
                            }]
                        }]
                    }]
                }]
            }, ]
        });
        var flatResult = makeFlatResult(result);
        res.status(200).json({
            success: true,
            status: 1,
            message: "Data Fetched",
            data: flatResult
        });
    } catch (error) {
        returnObj = errorHandler(error);
        res.status(returnObj.code).json(returnObj.data);
    }
});

// edit

router.put('/', async function(req, res, next) {
    try {
        const result = await production.update({ output: req.body.output }, { where: { id: req.body.production_id } })
        res.status(200).json({
            success: true,
            status: 1,
            message: "Production Updated",
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
        const result = await production.destroy({ where: { id: req.params.id } })
        res.status(200).json({
            success: true,
            status: 1,
            message: "Production Deleted"
        });
    } catch (error) {
        returnObj = errorHandler(error);
        res.status(returnObj.code).json(returnObj.data);
    }
});

router.get('/getadd/:date', async function(req, res, next) {
    try {
        const result = await zone.findAll({
            include: [{
                model: line,
                attributes: [['id', 'line_id'], 'line_name'],
                include: [
                    {
                        model: target,
                        attributes: [['id', 'target_id'], 'target', 'production_hrs'],
                        where: {
                            target_date: req.params.date
                        },
                        include: [{
                            model: buyer,
                            required: true,
                            attributes: [['id', 'buyer_id'], 'buyer_name']
                        }, {
                            model: style,
                            required: true,
                            attributes: [['id', 'style_id'], 'style_name']
                        }]                       
                    }
                ]
            }]
        });

        res.status(200).json({
            success: true,
            status: 1,
            message: "Data Fetched",
            data: {
                zones: result
            }
        });
    } catch (error) {
        returnObj = errorHandler(error);
        res.status(returnObj.code).json(returnObj.data);
    }
});

function makeFlatResult(data) {
    data = data.map(item => {
        return {
            "factory_id": item['zones.factory_id'],
            "factory_name": item['zones.factory_name'],
            "zone_id": item['zones.zone_id'],
            "zone_name": item['zones.zone_name'],
            "line_id": item['zones.lines.id'],
            "line_name": item['zones.lines.line_name'],
            "target_id": item['zones.lines.targets.id'],
            "production_hrs": item['zones.lines.targets.production_hrs'],
            "target_date": item['zones.lines.targets.target_date'],
            "production_id": item['zones.lines.targets.productions.id'],
            "production_date": item['zones.lines.targets.productions.production_date'],
            "hour": item['zones.lines.targets.productions.hour'],
            "output": item['zones.lines.targets.productions.output'],
            "buyer_id": item['zones.lines.targets.productions.buyer.buyer_id'],
            "buyer_name": item['zones.lines.targets.productions.buyer.buyer_name'],
            "style_id": item['zones.lines.targets.productions.style.style_id'],
            "style_name": item['zones.lines.targets.productions.style.style_name']
        };
    });
    return data;
}

module.exports = router;