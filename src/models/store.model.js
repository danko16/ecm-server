'use strict';
module.exports = (sequelize, DataTypes) => {
  var Stores = sequelize.define(
    'stores',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      parent_store_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        foreignKey: true,
        references: {
          model: 'stores',
          key: 'id'
        }
      },
      codename: {
        allowNull: false,
        type: DataTypes.STRING
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      address: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      phone: {
        allowNull: true,
        type: DataTypes.STRING,
        defaultValue: null
      },
      timezone: {
        allowNull: false,
        defaultValue: 'Asia/Jakarta',
        type: DataTypes.STRING
      },
      active: {
        allowNull: false,
        type: DataTypes.TINYINT,
        defaultValue: 0
      },
      registration_complete: {
        allowNull: true,
        type: DataTypes.TINYINT,
        defaultValue: 0
      },
      image: {
        allowNull: true,
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

  Stores.associate = function(models) {
    // associations can be defined here
    Stores.belongsToMany(models.users, {
      through: 'store_admins',
      foreignKey: 'store_id',
      constraints: false
    });
    Stores.hasMany(models.advertisements, {
      foreignKey: 'store_id',
      onDelete: 'CASCADE'
    });
    Stores.hasMany(models.products, {
      foreignKey: 'store_id',
      onDelete: 'CASCADE'
    });
  };
  return Stores;
};
