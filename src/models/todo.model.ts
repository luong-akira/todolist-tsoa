module.exports = function (sequelize, DataTypes) {
  const Todo: any = sequelize.define(
    'Todo',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      body: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: ['done', 'none'],
        defaultValue: 'none',
      },
    },
    {
      underscored: true,
    },
  );

  Todo.associate = (db) => {
    db.Todo.belongsTo(db.User);
  };

  return Todo;
};
