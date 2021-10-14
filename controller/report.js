var express = require('express');
var router = express.Router();
var _ = require("underscore");

const { zone, line, target, production, buyer, style } = require('../models/index');
const errorHandler = require('../util/errorHandler');

line.hasOne(target, { foreignKey: 'line_id' });

router.get('/:date', async function (req, res, next) {
    try {
        const result = await zone.findAll({
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
                        ['id', 'target_id'], 'production_hrs', 'target_date', ['target', 'target_count']
                    ],
                    required: true,
                    where: {
                        target_date: req.params.date
                    },
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
        });

        res.status(200).json({
            success: true,
            status: 1,
            message: "Data Fetched",
            data: result
        });
    } catch (error) {
        returnObj = errorHandler(error);
        res.status(returnObj.code).json(returnObj.data);
    }
});

module.exports = router;