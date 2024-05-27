const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Ticket', {
    id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      primaryKey: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(18,0),
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
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    minimum: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    maximum: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    opening_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sale_end_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'ticket',
    timestamps: false,
    indexes: [
      {
        name: "sqlite_autoindex_ticket_1",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
