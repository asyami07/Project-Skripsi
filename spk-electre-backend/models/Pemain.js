// Export function untuk membuat model Pemain
export default (sequelize, DataTypes) => {
  // define = membuat tabel di database
  return sequelize.define(
    "Pemain",
    {
      // kolom nama pemain
      nama: {
        type: DataTypes.STRING(25),
      },
      // "fit" atau "cedera"
      status: {
        type: DataTypes.STRING(7),
        defaultValue: "fit",
      },
      // posisi pemain (GK, DF, MF, FW)
      id_posisi: {
        type: DataTypes.INTEGER,
      },
    },
    {
      freezeTableName: true, // mencegah Sequelize mengubah nama tabel
    },
  );
};
