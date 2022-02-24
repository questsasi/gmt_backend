const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('zone', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    zone_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    factory_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'factory',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'zone',
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
        name: "fk_1_idx",
        using: "BTREE",
        fields: [
          { name: "factory_id" },
        ]
      },
    ]
  });
};
