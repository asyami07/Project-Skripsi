import db from "../models/index.js";

import bcrypt from "bcrypt";

//  GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    // ambil semua user
    const users = await db.Users.findAll({
      attributes: {
        exclude: ["password"], // sembunyikan password
      },
    });

    res.json({
      message: "Data user berhasil diambil",
      data: users,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi error",
      error: error.message,
    });
  }
};

//  GET USER BY ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db.Users.findByPk(id, {
      attributes: {
        exclude: ["password"],
      },
    });

    // jika tidak ditemukan
    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    res.json({
      message: "Detail user berhasil diambil",
      data: user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi error",
      error: error.message,
    });
  }
};

// CREATE USER
export const createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // cek username
    const existingUser = await db.Users.findOne({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Username sudah digunakan",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // simpan user
    const user = await db.Users.create({
      username,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User berhasil ditambahkan",
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi error",
      error: error.message,
    });
  }
};

//  UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // cari user
    const user = await db.Users.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    const updateData = {
      username: req.body.username,
      role: req.body.role,
    };

    // jika password diisi → hash ulang
    if (req.body.password) {
      updateData.password = await bcrypt.hash(req.body.password, 10);
    }

    // update user
    await user.update(updateData);

    res.json({
      message: "User berhasil diupdate",
      data: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi error",
      error: error.message,
    });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // cari user
    const user = await db.Users.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    // hapus user
    await user.destroy();

    res.json({
      message: "User berhasil dihapus",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Terjadi error",
      error: error.message,
    });
  }
};
