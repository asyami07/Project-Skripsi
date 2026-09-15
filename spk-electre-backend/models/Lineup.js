export default (sequelize, DataTypes) => {
  return sequelize.define("Lineup", {

    // relasi ke formasi
    id_formasi: {
      type: DataTypes.INTEGER
    },

    // tanggal lineup dibuat
    tanggal: {
      type: DataTypes.DATE
    }

  },{
  freezeTableName: true
});
};

// Menyimpan 1 hasil lineup (bisa banyak data historis)