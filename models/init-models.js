var DataTypes = require("sequelize").DataTypes;
var _buyer = require("./buyer");
var _factory = require("./factory");
var _line = require("./line");
var _production = require("./production");
var _style = require("./style");
var _target = require("./target");
var _zone = require("./zone");

function initModels(sequelize) {
  var buyer = _buyer(sequelize, DataTypes);
  var factory = _factory(sequelize, DataTypes);
  var line = _line(sequelize, DataTypes);
  var production = _production(sequelize, DataTypes);
  var style = _style(sequelize, DataTypes);
  var target = _target(sequelize, DataTypes);
  var zone = _zone(sequelize, DataTypes);

  production.belongsTo(buyer, { as: "buyer", foreignKey: "buyer_id"});
  buyer.hasMany(production, { as: "productions", foreignKey: "buyer_id"});
  target.belongsTo(buyer, { as: "buyer", foreignKey: "buyer_id"});
  buyer.hasMany(target, { as: "targets", foreignKey: "buyer_id"});
  zone.belongsTo(factory, { as: "factory", foreignKey: "factory_id"});
  factory.hasMany(zone, { as: "zones", foreignKey: "factory_id"});
  target.belongsTo(line, { as: "line", foreignKey: "line_id"});
  line.hasMany(target, { as: "targets", foreignKey: "line_id"});
  production.belongsTo(style, { as: "style", foreignKey: "style_id"});
  style.hasMany(production, { as: "productions", foreignKey: "style_id"});
  target.belongsTo(style, { as: "style", foreignKey: "style_id"});
  style.hasMany(target, { as: "targets", foreignKey: "style_id"});
  production.belongsTo(target, { as: "target", foreignKey: "target_id"});
  target.hasMany(production, { as: "productions", foreignKey: "target_id"});
  line.belongsTo(zone, { as: "zone", foreignKey: "zone_id"});
  zone.hasMany(line, { as: "lines", foreignKey: "zone_id"});

  return {
    buyer,
    factory,
    line,
    production,
    style,
    target,
    zone,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
