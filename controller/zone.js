var express = require('express');
var router = express.Router();

const { factory, zone, line, target, production } = require('../models/index');
const errorHandler = require('../util/errorHandler');

factory.hasMany(zone, { foreignKey: 'factory_id' });
zone.hasMany(line, { foreignKey: 'zone_id' });
line.hasMany(target, { foreignKey: 'line_id' });
target.hasMany(production, { foreignKey: 'target_id' });

router.get('/', async function (req, res, next) {
  try {
    const result = await factory.findAll({
      include: [
        { model: zone, attributes: ['id', 'zone_name'] },
      ]
    });
    res.status(200).json({
      success: true,
      status: 1,
      message: "Data Fetched",
      data: {
        zone: result
      }
    });
  } catch (error) {
    returnObj = errorHandler(error);
    res.status(returnObj.code).json(returnObj.data);
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    const result = await factory.findOne({
      include: [
        { model: zone, attributes: ['id', 'zone_name'] },
      ],
      where: {
        id: req.params.id
      }
    });
    res.status(200).json({
      success: true,
      status: 1,
      message: "Data Fetched",
      data: {
        zone: result
      }
    });
  } catch (error) {
    returnObj = errorHandler(error);
    res.status(returnObj.code).json(returnObj.data);
  }
});


// Config
router.post("/create", async function (req, res, next) { 
  try {
    const returnData = await zone.findAll({
      where: {
        factory_id: req.body.factory,
        zone_name: req.body.zonename
      }
    });

    if (returnData.length > 0) {
      let returnObj = errorHandler("Zone name already exist");
      res.status(returnObj.code).json(returnObj.data);
      return;
    }

    const result = zone.create({
      zone_name: req.body.zonename,
      factory_id: req.body.factory
    });

    res.status(200).json({
      success: true,
      status: 1,
      message: 'Zone created',
      data: result
    });

  } catch (error) {
    const returnObj = errorHandler(error);
    res.send(returnObj.code).json(returnObj.data);
  }
});

module.exports = router;