export default (sequelize, DataTypes) => {
  return sequelize.define(
    "Formasi",
    {
      // contoh: 4-3-3
      nama_formasi: {
        type: DataTypes.STRING(10),
      },

      jumlah_gk: DataTypes.INTEGER,
      jumlah_df: DataTypes.INTEGER,
      jumlah_mf: DataTypes.INTEGER,
      jumlah_fw: DataTypes.INTEGER,
    },
    {
      freezeTableName: true, // mencegah Sequelize mengubah nama tabel
    },
  );
};
