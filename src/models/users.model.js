module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define(
    'users',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      full_name: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          max: {
            args: 40,
            msg:
              'Username must start with a letter, have no spaces, and be at less than 40 characters.'
          },
          notEmpty: { msg: 'Please input username' }
        }
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      },
      phone: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING
      },
      avatar: {
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

  // eslint-disable-next-line no-unused-vars
  User.associate = function(models) {
    User.hasMany(models.access_tokens, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
  };

  User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());

    delete values.password;
    return values;
  };

  return User;
};
