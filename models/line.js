const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('line', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    line_name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    zone_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'zone',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'line',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "id_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "fk_2_idx",
        using: "BTREE",
        fields: [
          { name: "zone_id" },
        ]
      },
    ]
  });
};
