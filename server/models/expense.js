module.exports = (sequelize, DataTypes) => {
  const Expense = sequelize.define('Expense', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    date: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    value: {
      allowNull: false,
      validate: { min: 0.01 },
      type: DataTypes.DECIMAL,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }, {
    validate: {
      minValue() {
        if ((this.value < 0.01)) {
          throw new Error('Minimum value allowed is 0.01.');
        }
      },
    },
  });

  Expense.associate = (models) => {
    models.Expense.belongsTo(models.User, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      },
    });
    models.Expense.belongsTo(models.Category);
  };

  return Expense;
};
