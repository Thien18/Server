const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Attendance', {
    id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      primaryKey: true,
      unique: true
    },
    user_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
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
    location: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    is_status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    device_code: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'attendance',
    timestamps: false,
    indexes: [
      {
        name: "sqlite_autoindex_attendance_1",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
