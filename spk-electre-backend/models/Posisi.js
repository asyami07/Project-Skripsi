export default (sequelize, DataTypes) => {
  return sequelize.define(
    "Posisi",
    {
      // nama posisi (GK, DF, MF, FW)
      nama_posisi: {
        type: DataTypes.STRING(15),
      },
    },
    {
      freezeTableName: true,
    },
  );
};

// Menyimpan master posisi (biar tidak hardcode di pemain)
