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
      stores_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        foreignKey: true,
        references: {
          model: 'stores',
          key: 'id'
        }
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
      name: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      amount: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      image: {
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

  Product.associate = function(models) {
    // associations can be defined here
    Product.belongsTo(models.categories, {
      foreignKey: 'category_id',
      constraints: false
    });
    Product.belongsTo(models.stores, {
      foreignKey: 'store_id',
      constraints: false
    });
  };
  return Product;
};
