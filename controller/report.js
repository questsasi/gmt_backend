var express = require('express');
var router = express.Router();
var _ = require("underscore");

const { factory, zone, line, target, production } = require('../models/index');
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
                        }
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
        console.log(error);
        res.status(400).json({
            success: false,
            status: 0,
            message: "Server Error",
            data: error
        });
    }
});

module.exports = router;