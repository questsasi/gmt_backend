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
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    production_hrs: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    buyer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'buyer',
        key: 'id'
      }
    },
    style_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'style',
        key: 'id'
      }
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
      {
        name: "fk_5_idx",
        using: "BTREE",
        fields: [
          { name: "style_id" },
        ]
      },
      {
        name: "fk_buyer_idx",
        using: "BTREE",
        fields: [
          { name: "buyer_id" },
        ]
      },
    ]
  });
};
