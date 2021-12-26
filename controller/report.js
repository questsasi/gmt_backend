var express = require('express');
var router = express.Router();
var _ = require("underscore");

const { factory, zone, line, target, production, buyer, style, sequelize } = require('../models/index');
const errorHandler = require('../util/errorHandler');

line.hasOne(target, { foreignKey: 'line_id' });

router.get('/zones/:date', async function (req, res, next) {
  try {
    const result = await zone.findAll({
      model: zone,
      attributes: [
        ["id", "zone_id"], "zone_name"
      ],
      required: true,
      order: [
        ['id', 'ASC']
      ],
      include: [{
        model: line,
        attributes: [
          ['id', 'line_id'], 'line_name'
        ],
        required: true,
        order: [
          ['id', 'ASC']
        ],
        include: [{
          model: target,
          attributes: [
            ['id', 'target_id'], 'production_hrs', 'target_date', ['target', 'target_count']
          ],
          required: true,
          order: [
            ['id', 'ASC']
          ],
          where: {
            target_date: req.params.date
          },
          include: [{
            model: production,
            attributes: [
              ['id', 'production_id'], 'production_date', 'hour', 'output'
            ],
            required: true,
            order: [
              ['id', 'ASC']
            ],
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
      data: processZoneData(result)
    });
  } catch (error) {
    returnObj = errorHandler(error);
    res.status(returnObj.code).json(returnObj.data);
  }
});

router.get('/lines/:date', async function (req, res, next) {
  try {
    const result = await zone.findAll({
      model: zone,
      attributes: [
        ["id", "zone_id"], "zone_name"
      ],
      required: true,
      order: [
        ['id', 'ASC']
      ],
      include: [{
        model: line,
        attributes: [
          ['id', 'line_id'], 'line_name'
        ],
        required: true,
        order: [
          ['id', 'ASC']
        ],
        include: [{
          model: target,
          attributes: [
            ['id', 'target_id'], 'production_hrs', 'target_date', ['target', 'target_count']
          ],
          required: true,
          order: [
            ['id', 'ASC']
          ],
          where: {
            target_date: req.params.date
          },
          include: [{
            model: production,
            attributes: [
              ['id', 'production_id'], 'production_date', 'hour', 'output'
            ],
            required: true,
            order: [
              ['id', 'ASC']
            ],
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
      data: processLineData(result)
    });
  } catch (error) {
    returnObj = errorHandler(error);
    res.status(returnObj.code).json(returnObj.data);
  }
});

router.get('/factory/:date', async function (req, res, next) {
  try {
    const rawData = await factory.findOne(
      {
        model: factory,
        attributes: ['id', 'factory_name'],
        required: true,
        where: {
          id: 1
        },
        include: [{
          model: zone,
          attributes: [
            ["id", "zone_id"], "zone_name"
          ],
          required: true,
          order: [
            ['id', 'ASC']
          ],
          include: [{
            model: line,
            attributes: [
              ['id', 'line_id'], 'line_name'
            ],
            required: true,
            order: [
              ['id', 'ASC']
            ],
            include: [{
              model: target,
              attributes: [
                ['id', 'target_id'], 'production_hrs', 'target_date', ['target', 'target_count']
              ],
              required: true,
              order: [
                ['id', 'ASC']
              ],
              where: {
                target_date: req.params.date
              },
              include: [{
                model: production,
                attributes: [
                  ['id', 'production_id'], 'production_date', 'hour', 'output'
                ],
                required: true,
                order: [
                  ['id', 'ASC']
                ],
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
        }]
      });

    res.status(200).json({
      success: true,
      status: 1,
      message: "Data Fetched",
      data: processFactoryData(rawData)
    });
  } catch (error) {
    returnObj = errorHandler(error);
    res.status(returnObj.code).json(returnObj.data);
  }
});


function processLineData(zoneObj) {
  zoneObj = JSON.parse(JSON.stringify(zoneObj));
  let result = [];
  for (var zone = 0; zone < zoneObj.length; zone++) {
    let lines = zoneObj[zone].lines;
    let temp_achieved_total = 0;
    let temp_presant_total = 0;

    for (var line = 0; line < lines.length; line++) {
      lines[line].toggle = false;
      lines[line].target_count = lines[line].targets[0].target_count;
      lines[line].target_id = lines[line].targets[0].target_id;
      lines[line].production_hrs = lines[line].targets[0].production_hrs;

      // Calculation added
      lines[line].achieved = getAchieved(lines[line].targets[0].productions);
      lines[line].productions = lines[line].targets[0].productions;
      let oneHrCount = lines[line].target_count / lines[line].production_hrs;
      lines[line].presant = (oneHrCount * lines[line].productions.length).toFixed(0);
      lines[line].percent = ((lines[line].achieved / lines[line].presant) * 100).toFixed(2);
      lines[line].difference = (lines[line].achieved - lines[line].presant).toFixed(0);
      lines[line].presant_hrs = lines[line].productions.length;
      lines[line].remaining_hrs = lines[line].production_hrs - lines[line].productions.length;

      temp_achieved_total += parseInt(lines[line].achieved);
      temp_presant_total += parseInt(lines[line].presant);
    }

    // Summary
    let wholeObj = {
      percent: (temp_achieved_total / temp_presant_total * 100).toFixed(2),
      target_count: (lines.reduce((key, { target_count }) => key + parseInt(target_count), 0)),
      presant: (lines.reduce((key, { presant }) => key + parseInt(presant), 0)),
      achieved: (lines.reduce((key, { achieved }) => key + parseInt(achieved), 0)),
      difference: (lines.reduce((key, { difference }) => key + parseInt(difference), 0)),
      production_hrs: ((lines.reduce((key, { production_hrs }) => key + parseInt(production_hrs), 0)) / lines.length).toFixed(0),
      presant_hrs: ((lines.reduce((key, { productions }) => key + parseInt(productions.length), 0)) / lines.length).toFixed(0),
      remaining_hrs: 0
    };
    wholeObj.remaining_hrs = wholeObj.production_hrs - wholeObj.presant_hrs;

    zoneObj[zone].summary = wholeObj;

    result.push(zoneObj[zone]);
  }

  return result;
}


function getAchieved(production_hrs) {
  return production_hrs
    .map(function (jedi) {
      return jedi.output;
    })
    .reduce(function (acc, score) {
      return acc + score;
    }, 0);
}


function processZoneData(zoneObj) {
  zoneObj = JSON.parse(JSON.stringify(zoneObj));
  let result = [];

  for (var zone = 0; zone < zoneObj.length; zone++) {
    let zoneTemp = zoneObj[zone];
    var temp = {
      zone_id: zoneTemp['zone_id'],
      zone_name: zoneTemp.zone_name,
      line_count: zoneTemp.lines.length,
      target_output: 0,
      target_hrs: 0,
      hours_completed: 0,
      hours_remaining: 0,
      target_achieved: 0,
      target_presant: 0,
      target_diff: 0,
      acheieved_percent: 0
    };
    for (var line = 0; line < zoneTemp.lines.length; line++) {
      var lineTemp = zoneTemp.lines[line];
      temp.target_output = lineTemp.targets.reduce(function (k, v) {
        return temp.target_output + v.target_count;
      }, 0);
      temp.target_hrs = lineTemp.targets.reduce(function (k, v) {
        return temp.target_hrs + v.production_hrs;
      }, 0);

      for (var target = 0; target < lineTemp.targets.length; target++) {
        var targetTemp = lineTemp.targets[target];
        temp.hours_completed += targetTemp.productions.length;

        targetTemp.productions.reduce(function (k, v) {
          temp.target_achieved += v.output;
        }, 0);

      }

    }

    temp.hours_remaining = temp.target_hrs - temp.hours_completed;
    temp.target_presant = (temp.target_output / temp.target_hrs).toFixed(2) * temp.hours_completed;
    temp.target_diff = temp.target_achieved - temp.target_presant.toFixed(0);
    temp.acheieved_percent = ((temp.target_achieved / temp.target_presant) * 100).toFixed(2);

    temp.target_hrs_avg = temp.target_hrs / zoneTemp.lines.length;
    temp.hours_completed_avg = (temp.hours_completed / zoneTemp.lines.length).toFixed(0);
    temp.hours_remaining_avg = (temp.hours_remaining / zoneTemp.lines.length).toFixed(0);
    temp.target_presant = temp.target_presant.toFixed(0);
    result.push(temp);
  }

  return result;
}

function processFactoryData(rawData) {
  let zoneResult = processZoneData(rawData.zones);
  let result = {
    "factory_id": rawData.id,
    "factory_name": rawData.factory_name,
    "zone_count": zoneResult.length,
    "line_count": zoneResult.reduce((sum, obj) => sum + parseInt(obj.line_count), 0),
    "target_output": zoneResult.reduce((sum, obj) => sum + parseInt(obj.target_output), 0),
    "target_hrs": zoneResult.reduce((sum, obj) => sum + parseInt(obj.target_hrs), 0),
    "hours_completed": zoneResult.reduce((sum, obj) => sum + parseInt(obj.hours_completed), 0),
    "hours_remaining": zoneResult.reduce((sum, obj) => sum + parseInt(obj.hours_remaining), 0),
    "target_achieved": zoneResult.reduce((sum, obj) => sum + parseInt(obj.target_achieved), 0),
    "target_presant": zoneResult.reduce((sum, obj) => sum + parseInt(obj.target_presant), 0),
    "target_diff": zoneResult.reduce((sum, obj) => sum + parseInt(obj.target_diff), 0),
    "acheieved_percent": (zoneResult.reduce((sum, obj) => sum + parseInt(obj.acheieved_percent), 0) / zoneResult.length).toFixed(0),
    "target_hrs_avg": (zoneResult.reduce((sum, obj) => sum + parseInt(obj.target_hrs_avg), 0) / zoneResult.length).toFixed(0),
    "hours_completed_avg": (zoneResult.reduce((sum, obj) => sum + parseInt(obj.hours_completed_avg), 0) / zoneResult.length).toFixed(0),
    "hours_remaining_avg": (zoneResult.reduce((sum, obj) => sum + parseInt(obj.hours_remaining_avg), 0) / zoneResult.length).toFixed(0)
    // zoneResult: processZoneData(rawData.zones)
  };
  return result;
}


module.exports = router;