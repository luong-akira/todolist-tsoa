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

      userId: {
        type: DataTypes.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    },
    {
      underscored: true,
    },
  );

  ImportExport.associate = (db) => {
    db.ImportExport.belongsTo(db.User);
  };

  return ImportExport;
};
