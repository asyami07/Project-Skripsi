export default (sequelize, DataTypes) => {
  return sequelize.define(
    "Nilai",
    {
      // nilai pemain terhadap kriteria
      nilai: {
        type: DataTypes.INTEGER,
      },

      // nilai input setiap kriteria
      nilai_input: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      // foreign key ke pemain
      id_pemain: {
        type: DataTypes.INTEGER,
      },

      // foreign key ke kriteria
      id_kriteria: {
        type: DataTypes.INTEGER,
      },
    },
    {
      freezeTableName: true, // mencegah Sequelize mengubah nama tabel
    },
  );
};
