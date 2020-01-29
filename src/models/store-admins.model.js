'use strict';
module.exports = (sequelize, DataTypes) => {
  var StoreAdmins = sequelize.define(
    'store_admins',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      store_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        foreignKey: true,
        references: {
          model: 'stores',
          key: 'id'
        }
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        foreignKey: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      role: {
        allowNull: false,
        type: DataTypes.STRING
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {
      timestamps: true,
      underscored: true
    }
  );

  StoreAdmins.associate = function(models) {
    // associations can be defined here
  };
  return StoreAdmins;
};
