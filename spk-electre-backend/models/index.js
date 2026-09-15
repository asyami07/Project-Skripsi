// Import Sequelize (library ORM)
import Sequelize from "sequelize";

// Import koneksi database
import sequelize from "../config/database.js";

// Import semua model (tabel)
import PemainModel from "./Pemain.js";
import KriteriaModel from "./Kriteria.js";
import NilaiModel from "./Nilai.js";
import FormasiModel from "./Formasi.js";
import UsersModel from "./Users.js";
import PosisiModel from "./Posisi.js";
import LineupModel from "./Lineup.js";
import DetailLineupModel from "./DetailLineup.js";

//  INISIALISASI

// Object untuk menampung semua model
const db = {};

// Simpan class Sequelize (opsional)
db.Sequelize = Sequelize;

// Simpan koneksi database
db.sequelize = sequelize;

//  INIT MODEL
// Di sini “mendaftarkan” semua tabel ke Sequelize

// Tabel pemain
db.Pemain = PemainModel(sequelize, Sequelize.DataTypes);

// Tabel kriteria (untuk ELECTRE)
db.Kriteria = KriteriaModel(sequelize, Sequelize.DataTypes);

// Tabel nilai (relasi pemain & kriteria)
db.Nilai = NilaiModel(sequelize, Sequelize.DataTypes);

// Tabel formasi (4-3-3, dll)
db.Formasi = FormasiModel(sequelize, Sequelize.DataTypes);

// Tabel user (admin/pelatih)
db.Users = UsersModel(sequelize, Sequelize.DataTypes);

// Tabel posisi (GK, DF, MF, FW)
db.Posisi = PosisiModel(sequelize, Sequelize.DataTypes);

// Tabel lineup (1 hasil lineup)
db.Lineup = LineupModel(sequelize, Sequelize.DataTypes);

// Tabel detail lineup (isi pemain dalam lineup)
db.DetailLineup = DetailLineupModel(sequelize, Sequelize.DataTypes);

//  RELASI

//  POSISI ↔ PEMAIN

// Satu posisi punya banyak pemain
// contoh: posisi "FW" punya banyak pemain
db.Posisi.hasMany(db.Pemain, { foreignKey: "id_posisi" });

// Setiap pemain punya satu posisi
db.Pemain.belongsTo(db.Posisi, { foreignKey: "id_posisi" });

//  PEMAIN ↔ NILAI

// Satu pemain punya banyak nilai
// contoh: dika punya nilai stamina, speed, dll
db.Pemain.hasMany(db.Nilai, { foreignKey: "id_pemain" });

// Setiap nilai milik satu pemain
db.Nilai.belongsTo(db.Pemain, { foreignKey: "id_pemain" });

//  KRITERIA ↔ NILAI

// Satu kriteria dipakai banyak nilai
// contoh: kriteria "stamina" dipakai semua pemain
db.Kriteria.hasMany(db.Nilai, { foreignKey: "id_kriteria" });

// Setiap nilai punya satu kriteria
db.Nilai.belongsTo(db.Kriteria, { foreignKey: "id_kriteria", as: "Kriteria" });

// Posisi → Kriteria
db.Posisi.hasMany(db.Kriteria, { foreignKey: "id_posisi" });
db.Kriteria.belongsTo(db.Posisi, { foreignKey: "id_posisi" });

// FORMASI ↔ LINEUP

// Satu formasi bisa dipakai banyak lineup
// contoh: formasi 4-3-3 dipakai berkali-kali
db.Formasi.hasMany(db.Lineup, { foreignKey: "id_formasi" });

// Setiap lineup punya satu formasi
db.Lineup.belongsTo(db.Formasi, { foreignKey: "id_formasi" });

//  LINEUP ↔ DETAIL LINEUP

// Satu lineup berisi banyak pemain
db.Lineup.hasMany(db.DetailLineup, { foreignKey: "id_lineup" });

// Setiap detail lineup milik satu lineup
db.DetailLineup.belongsTo(db.Lineup, { foreignKey: "id_lineup" });

// PEMAIN ↔ DETAIL LINEUP

// Satu pemain bisa muncul di banyak lineup
db.Pemain.hasMany(db.DetailLineup, { foreignKey: "id_pemain" });

// Setiap detail lineup punya satu pemain
db.DetailLineup.belongsTo(db.Pemain, { foreignKey: "id_pemain" });

// POSISI ↔ DETAIL LINEUP

// Satu posisi bisa muncul di banyak detail lineup
db.Posisi.hasMany(db.DetailLineup, { foreignKey: "id_posisi" });

// Setiap detail lineup punya satu posisi
db.DetailLineup.belongsTo(db.Posisi, { foreignKey: "id_posisi" });

// Export supaya bisa dipakai di controller / service
export default db;
