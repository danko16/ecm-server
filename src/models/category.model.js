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
      image: {
        allowNull: true,
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

  Category.associate = function(models) {
    // associations can be defined here
    Category.belongsTo(models.admins, {
      foreignKey: 'admin_id',
      constraints: false
    });

    Category.hasMany(models.products, {
      foreignKey: 'product_id',
      onDelete: 'CASCADE'
    });
  };
  return Category;
};
