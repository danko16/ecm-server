'use strict';
module.exports = (sequelize, DataTypes) => {
  var Advertisements = sequelize.define(
    'advertisements',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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

  Advertisements.associate = function(models) {
    // associations can be defined here
  };
  return Advertisements;
};
