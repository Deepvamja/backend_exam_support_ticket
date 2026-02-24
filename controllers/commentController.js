const db = require("../config/db");


exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ message: "Comment required" });
    }

    const [rows] = await db.promise().query(
      "SELECT user_id FROM comments WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const commentOwner = rows[0].user_id;

    if (req.user.role_id !== 1 && req.user.id !== commentOwner) {
      return res.status(403).json({
        message: "Not authorized to edit this comment",
      });
    }

    await db.promise().query(
      "UPDATE comments SET comment = ? WHERE id = ?",
      [comment, id]
    );

    res.status(200).json({ message: "Comment updated" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* =========================================
   DELETE COMMENT
   Author OR MANAGER
========================================= */
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.promise().query(
      "SELECT user_id FROM comments WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const commentOwner = rows[0].user_id;

    if (req.user.role_id !== 1 && req.user.id !== commentOwner) {
      return res.status(403).json({
        message: "Not authorized to delete this comment",
      });
    }

    await db.promise().query(
      "DELETE FROM comments WHERE id = ?",
      [id]
    );

    res.status(204).send();

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};