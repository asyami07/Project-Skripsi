export default (sequelize, DataTypes) => {
  return sequelize.define(
    "DetailLineup",
    {
      // relasi ke lineup
      id_lineup: {
        type: DataTypes.INTEGER,
      },

      // pemain yang dipilih
      id_pemain: {
        type: DataTypes.INTEGER,
      },

      // posisi di lineup
      id_posisi: {
        type: DataTypes.INTEGER,
      },
    },
    {
      freezeTableName: true,
    },
  );
};

// Tabel penghubung : lineup, pemain & posisi
