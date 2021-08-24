const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('target', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    line_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'line',
        key: 'id'
      }
    },
    target: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    target_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    production_hrs: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'target',
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
        name: "fk_3_idx",
        using: "BTREE",
        fields: [
          { name: "line_id" },
        ]
      },
    ]
  });
};
