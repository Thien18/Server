const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Roles', {
    id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      primaryKey: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'roles',
    timestamps: false,
    indexes: [
      {
        name: "sqlite_autoindex_roles_1",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
