const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('production', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    production_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    hour: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    output: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    target_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'target',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'production',
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
        name: "fk_4_idx",
        using: "BTREE",
        fields: [
          { name: "target_id" },
        ]
      },
    ]
  });
};
