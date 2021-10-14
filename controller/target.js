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

const { factory, zone, line, target, production, buyer, style } = require('../models/index');
const errorHandler = require('../util/errorHandler');

factory.hasMany(zone, { foreignKey: 'factory_id' });
zone.hasMany(line, { foreignKey: 'zone_id' });
line.hasMany(target, { foreignKey: 'line_id' });
target.hasMany(production, { foreignKey: 'target_id' });
target.belongsTo(style, { foreignKey: 'style_id' });
target.belongsTo(buyer, { foreignKey: 'buyer_id' });



router.post('/', async function(req, res, next) {
    try {
        const result = [];
        for(var i = 0; i < req.body.line_id.length; i++) {
            console.log(req.body.line_id[i]);
            const resp = await target.create({
                line_id: req.body.line_id[i],
                target: req.body.target,
                target_date: req.body.date,
                production_hrs: req.body.production_hrs,
                buyer_id: req.body.buyer_id,
                style_id: req.body.style_id
            })
            result.push(resp);
        }
        res.status(200).json({
            success: true,
            status: 1,
            message: "Target Created",
            data: {
                target: result
            }
        });
    } catch (error) {
      returnObj = errorHandler(error);
      res.status(returnObj.code).json(returnObj.data);
    }
});

router.put('/', async function(req, res, next) {
    try {
        const result = await target.update({ target: req.body.target }, { where: { id: req.body.target_id } })
        res.status(200).json({
            success: true,
            status: 1,
            message: "Target Updated",
            data: {
                target: result
            }
        });
    } catch (error) {
      returnObj = errorHandler(error);
      res.status(returnObj.code).json(returnObj.data);
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
      returnObj = errorHandler(error);
      res.status(returnObj.code).json(returnObj.data);
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
                    where: {
                        target_date: req.params.date
                    },
                    include: [
                        {
                            model: style,
                            attributes: ['id', 'style_name'],
                            required: true
                        },
                        {
                            model: buyer,
                            attributes: ['id', 'buyer_name'],
                            required: true
                        },
                    ]
                },
                ]
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
                    var production_target_date = targetElement.target_date;
                        var response = {
                            "zone_id": zone_id,
                            "zone_name": zone_name,
                            "line_id": line_id,
                            "line_name": line_name,
                            "production_hours": production_hours,
                            "target": production_target,
                            "target_date": production_target_date,
                            "target_id": targetElement.id,
                            "style_id": targetElement.style.id,
                            "style_name": targetElement.style.style_name,
                            "buyer_id": targetElement.buyer.id,
                            "buyer_name": targetElement.buyer.buyer_name
                        }
                        responseArray.push(response);
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
      returnObj = errorHandler(error);
      res.status(returnObj.code).json(returnObj.data);
    }
});

router.get('/details', async function(req, res, next) {
    try {
        const zoneResult = await zone.findAll({
            attributes: ['id', 'zone_name'],
            include: [
                { model: line, attributes: ['id', 'line_name'] }
            ]
        });

        res.status(200).json({
            success: true,
            status: 1,
            message: "Data Fetched",
            data: {
                zones: zoneResult,
                buyers: await buyer.findAll(),
                styles: await style.findAll()
            }
        });
    } catch (error) {
        returnObj = errorHandler(error);
        res.status(returnObj.code).json(returnObj.data);
    }
});

module.exports = router;