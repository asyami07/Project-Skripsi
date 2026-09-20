export default (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "Users",
    {
      username: {
        type: DataTypes.STRING(25),
        allowNull: false,
        unique: true, // username tidak boleh sama
      },

      password: {
        type: DataTypes.STRING(),
        allowNull: false,
      },

      role: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "pelatih",
      },
    },
    {
      freezeTableName: true,
    },
  );

  return Users;
};
