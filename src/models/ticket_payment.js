const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TicketPayment', {
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
    ticket_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'ticket',
        key: 'id'
      }
    },
    is_status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'ticket_payment',
    timestamps: false,
    indexes: [
      {
        name: "sqlite_autoindex_ticket_payment_1",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
