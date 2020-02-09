'use strict';
module.exports = (sequelize, DataTypes) => {
  var Product = sequelize.define(
    'products',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      category_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        foreignKey: true,
        references: {
          model: 'categories',
          key: 'id'
        }
      },
      admin_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        foreignKey: true,
        references: {
          model: 'admins',
          key: 'id'
        }
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING
      },
      amount: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      image: {
        allowNull: false,
        type: DataTypes.STRING
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {
      timestamps: true,
      underscored: true
    }
  );

  Product.associate = function(models) {
    // associations can be defined here
    Product.belongsTo(models.admins, {
      foreignKey: 'admin_id',
      constraints: false
    });

    Product.belongsTo(models.categories, {
      foreignKey: 'category_id',
      constraints: false
    });
  };
  return Product;
};
