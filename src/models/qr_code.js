const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('QrCode', {
    id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      primaryKey: true,
      unique: true
    },
    event_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'event',
        key: 'id'
      }
    },
    area_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'area',
        key: 'id'
      }
    },
    code: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'QR_code',
    timestamps: false,
    indexes: [
      {
        name: "sqlite_autoindex_QR_code_1",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
