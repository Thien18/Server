const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Member', {
    id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      primaryKey: true,
      unique: true
    },
    group_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'groups',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'member',
    timestamps: false,
    indexes: [
      {
        name: "sqlite_autoindex_member_1",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
