const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('factory', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    factory_name: {
      type: DataTypes.STRING(45),
      allowNull: true,
      unique: "factory_name_UNIQUE"
    }
  }, {
    sequelize,
    tableName: 'factory',
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
        name: "factory_name_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "factory_name" },
        ]
      },
    ]
  });
};
