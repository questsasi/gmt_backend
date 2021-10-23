var express = require('express');
var router = express.Router();

const errorHandler = require('../util/errorHandler');
const { user, sequelize } = require('../models/index');

router.get('', async function (req, res, next) {
  try {

    const result = await user.findAll();
    res.status(200).json({
      success: true,
      status: 1,
      message: "User Success",
      data:  result
    });
  }
  catch(e) {
    returnObj = errorHandler(error);
    res.status(returnObj.code).json(returnObj.data);
  }
});

router.post('/', async function (req, res, next) {
  try {
    console.log(req.body);
    const result = await user.create({
      "name": req.body.name,
      "email": req.body.email,
      "password": req.body.password,
      "role": req.body.role,
      "contact_number": req.body.contact_number,
      "status": 1,
      "created_on": "CURRENT_TIMESTAMP()"
    }); 

    res.status().json({
      success: true,
      status: 1,
      message: "User created",
      data: result
    });
  } catch(error) {
    resultObj = errorHandler(error);
    res.status(resultObj.code).json(resultObj.data);
  }
});

module.exports = router;