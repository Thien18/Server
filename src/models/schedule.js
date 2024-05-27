const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Schedule', {
    id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      primaryKey: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    event_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'event',
        key: 'id'
      }
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'schedule',
    timestamps: false,
    indexes: [
      {
        name: "sqlite_autoindex_schedule_1",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
