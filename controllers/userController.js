const db = require("../config/db");
const bcrypt = require("bcryptjs");


exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body;

    if (!name || !email || !password || !role_id) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const allowedRoles = [1, 2, 3];

    if (!allowedRoles.includes(role_id)) {
      return res.status(400).json({
        message: "Invalid role_id",
      });
    }

    const [existing] = await db.promise().query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.promise().query(
      `INSERT INTO users (name, email, password, role_id)
       VALUES (?, ?, ?, ?)`,
      [name, email, hashedPassword, role_id]
    );

    res.status(201).json({
      message: "User created successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getUsers = async (req, res) => {
  try {
    const [users] = await db.promise().query(
      "SELECT id, name, email, role_id, created_at FROM users"
    );

    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};