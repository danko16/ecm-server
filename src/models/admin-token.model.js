module.exports = function(sequelize, DataTypes) {
  const AdminToken = sequelize.define(
    'admin_tokens',
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
      access_token: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      refresh_token: {
        allowNull: false,
        type: DataTypes.TEXT
      },
      client_id: {
        allowNull: false,
        type: DataTypes.STRING
      },
      client_secret: {
        allowNull: true,
        type: DataTypes.STRING
      },
      provider: {
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

  // eslint-disable-next-line no-unused-vars
  AdminToken.associate = function(models) {
    AdminToken.belongsTo(models.admins, {
      foreignKey: 'admin_id',
      constraints: false
    });
  };

  return AdminToken;
};
