import db from "../models/index.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// SECRET JWT
const SECRET_KEY = "SPK_SECRET_KEY";

//  REGISTER
export const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // cek username sudah ada atau belum
    const existingUser = await db.Users.findOne({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "username sudah digunakan",
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
      message: "Register berhasil",
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

//  LOGIN
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // cek user
    const user = await db.Users.findOne({
      where: { username },
    });

    // jika user tidak ada
    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }

    // cek password
    // mencocokkan password login dengan hash di database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Password salah",
      });
    }

    // buat token JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      SECRET_KEY,
      {
        expiresIn: "1d",
      },
    );

    res.json({
      message: "Login berhasil",
      token,
      user: {
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
