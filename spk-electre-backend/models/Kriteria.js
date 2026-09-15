export default (sequelize, DataTypes) => {
  return sequelize.define(
    "Kriteria",
    {
      // id_posisi
      id_posisi: {
        type: DataTypes.INTEGER,
      },
      // nama kriteria (stamina, speed, dll)
      nama_kriteria: {
        type: DataTypes.STRING(30),
      },

      // tipe kriteria (benefit / cost)
      tipe: {
        type: DataTypes.STRING(10),
      },

      // bobot untuk ELECTRE
      bobot: {
        type: DataTypes.INTEGER,
      },
    },
    {
      freezeTableName: true, // mencegah Sequelize mengubah nama tabel
    },
  );
};
