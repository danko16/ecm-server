'use strict';
module.exports = (sequelize, DataTypes) => {
  var Category = sequelize.define(
    'categories',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
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

  Category.associate = function(models) {
    // associations can be defined here
    Category.hasMany(models.products, {
      foreignKey: 'product_id',
      constraints: false
    });
  };
  return Category;
};
