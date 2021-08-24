const express = require("express");
const app = express();
const PORT = 3000;
const { Sequelize, Model, DataTypes } = require("sequelize");

const db = require('./models');
const { factory, zone, line, target, production } = require('./models');


// Reationship b/w tables
factory.hasMany(zone, { foreignKey: 'factory_id' });
// zone.belongsTo(factory);

zone.hasMany(line, { foreignKey: 'zone_id' });
// lne.belongsTo(zone, { foreignKey: 'zone_id', targetKey: 'zone_id' });

line.hasMany(target, { foreignKey: 'line_id' });
// target.belongsTo(line, { foreignKey: 'line_id', targetKey: 'line_id' });

target.hasMany(production, { foreignKey: 'target_id' });
// production.belongsTo(target, { foreignKey: 'target_id', targetKey: 'target_id' });


app.use(express.json());
app.use(express.urlencoded());

db.sequelize.sync().then((req) => {

  app.listen(PORT, () => {
    console.log("Listening at Port: " + PORT);
  });
});



// API`s
app.get('/zone', async (req, res) => {
  try {
    const respBody = await factory.findAll({
      include: [
        { model: zone, attributes: ['id', 'zone_name'] },
      ],
      where: {
        id: 1
      }
    });
    res.status(200).send(respBody);
  }
  catch (e) {
    res.status(400).send(e);
  }
});

// Get target entry
app.get('/gettargetentry', async (req, res) => {
  try {
    const respBody = await factory.findAll({
      include: [
        {
          model: zone, attributes: ['id', 'zone_name'],
          include: [
            { model: line, attributes: ['id', 'line_name'] }
          ]
        },
      ]
    });
    res.status(200).send(respBody);
  }
  catch (e) {
    res.status(400).send(e);
  }
});


// Post target entry
app.post('/target', async (req, res) => {
  try {
    console.log(req.body);
    const respBody = await target.create({
      line_id: req.body.line_id,
      target: req.body.target,
      date: req.body.date,
      production_hrs: req.body.production_hrs
    });
    res.status(201).send(respBody);
  }
  catch (e) {
    // console.log(e);
    res.status(400).send(e);
  }
});

// Get Production Hours
app.get('/getproductionhours', async (req, res) => {
  try {
    console.log(req.body);
    const respBody = await factory.findAll({
      raw: true,
      required: true,
      attributes: [
        'id', 'factory_name',
        // [Sequelize.col('zone.id'), 'zoneId']
        // 'zone.id', 'zone.zone_name'
      ],
      include: [
        {
          model: zone,
          attributes: [['id', 'zoneId'], 'zone_name'],
          required: true,
          // attributes: [],
          include: [
            {
              model: line,
              attributes: ['id', 'line_name'],
              // attributes: [],
              required: true,
              include: [
                {
                  model: target,
                  attributes: ['id', 'production_hrs', 'target_date'],
                  // attributes: [],
                  required: true,
                  include: [
                    {
                      model: production,
                      attributes: ['production_date', 'hour', 'output'],
                      // attributes: [],
                      required: true,
                      // where: {
                      //   production_date: "2021-05-15"
                      // }
                    }
                  ]
                }
              ]
            }
          ]
        },
      ]
    });
    res.status(200).send(respBody);
  }
  catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});


// Post Production Hours
app.post('/postproductionhours', async (req, res) => {
  try {
    console.log(req.body);
    const respBody = await production.create({
      production_date: req.body.production_date,
      hour: req.body.hour,
      output: req.body.output,
      target_id: req.body.target_id
    });
    res.status(201).send(respBody);
  }
  catch (e) {
    // console.log(e);
    res.status(400).send(e);
  }
});


// Get production By Hour
app.get('/getproductionbyhour', async (req, res) => {
  try {
    console.log(req.body);
    const respBody = await factory.findAll({
      raw: true,
      required: true,
      attributes: ['id', 'factory_name'],
      include: [
        {
          model: zone,
          attributes: [['id', 'zoneId'], 'zone_name'],
          required: true,
          include: [
            {
              model: line,
              attributes: ['id', 'line_name'],
              required: true,
              include: [
                {
                  model: target,
                  attributes: ['id', 'production_hrs', 'target_date'],
                  required: true,
                  include: [
                    {
                      model: production,
                      attributes: ['production_date', 'hour', 'output'],
                      required: true,
                      where: {
                        production_date: "2021-05-15"
                      }
                    }
                  ]
                }
              ]
            }
          ]
        },
      ]
    });
    res.status(200).send(respBody);
  }
  catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});
