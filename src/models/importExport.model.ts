module.exports = function (sequelize, DataTypes) {
  const ImportExport: any = sequelize.define(
    'ImportExport',
    {
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      jobId: {
        type: DataTypes.BIGINT,
      },

      file: {
        type: DataTypes.STRING,
        defaultValue: '',
      },

      status: {
        type: DataTypes.ENUM,
        values: ['waiting', 'active', 'completed', 'failed'],
        defaultValue: 'waiting',
      },
    },
    {
      underscored: true,
    },
  );

  ImportExport.associate = (db) => {
    db.Todo.belongsTo(db.User);
  };

  return ImportExport;
};
