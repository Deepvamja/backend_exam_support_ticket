const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const commentController = require("../controllers/commentController");


router.patch(
  "/:id",
  verifyToken,
  commentController.updateComment
);

router.delete(
  "/:id",
  verifyToken,
  commentController.deleteComment
);

module.exports = router;