const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Account', {
    email: {
      type: DataTypes.STRING(50),
      allowNull: true,
      primaryKey: true,
      unique: true
    },
    password: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    role_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'roles',
        key: 'id'
      }
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    refreshToken: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    passwordChangedAt: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    otpCode: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    passwordResetToken: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    passwordResetExpires: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'account',
    timestamps: false,
    indexes: [
      {
        name: "sqlite_autoindex_account_1",
        unique: true,
        fields: [
          { name: "email" },
        ]
      },
    ]
  });
};
