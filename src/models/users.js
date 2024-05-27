const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Users', {
    id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      primaryKey: true,
      unique: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'account',
        key: 'email'
      }
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(5),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'users',
    timestamps: false,
    indexes: [
      {
        name: "sqlite_autoindex_users_1",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
