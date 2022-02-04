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
    const result = await factory.findAll();
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

router.post('/', async function (req, res, next) {
  try {
    console.log(req.body);
    const factoryLength = await factory.findAll({
      where: {
        factory_name: req.body.factory_name
      }
    });

    if (factoryLength > 0) {
      returnObj = errorHandler("Factory already exist");
      res.status(returnObj.code).json(returnObj.data);
      return;
    }

    const result = await factory.create({
      factory_name: req.body.factory_name
    });

    res.status(200).json({
      success: true,
      status: 1,
      message: 'Factory created',
      data: result
    })

  } catch (error) {
    returnObj = errorHandler(error);
    res.status(returnObj.code).json(returnObj.data);
  }
});

router.put('/disable/:id', async function (req, res, next) {
  try {
    await factory.update(
      {
        status: 0
      },
      {
        where: {
          id: req.params.id
        }
      });

    res.status(200).json({
      success: true,
      status: 1,
      message: 'Factory Disabled'
    });
  } catch (error) {
    returnObj = errorHandler(error);
    res.status(returnObj.code).json(returnObj.data);
  }
});

router.put('/enable/:id', async function (req, res, next) {
  try {
    const result = await factory.update({
      status: 1
    }, {
      where: {
        id: req.params.id
      }
    });
    res.status(200).json({
      success: true,
      status: 1,
      message: 'Factory enabled',
      data: result
    });

  } catch (error) {
    returnObj = errorHandler(error);
    res.status(returnObj.code).json(returnObj.data);
  }

});

router.get('/:id', async function (req, res, next) {
  try {
    const result = await factory.findOne({
      include: [{
        model: zone,
        attributes: ['id', 'zone_name'],
        include: [
          { model: line, attributes: ['id', 'line_name'] }
        ]
      },],
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

module.exports = router;