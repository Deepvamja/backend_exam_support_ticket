const express = require("express");
const router = express.Router();

const ticketController = require("../controllers/ticketController");
const verifyToken = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");


router.post(
  "/",
  verifyToken,
  checkRole(1, 3), 
  ticketController.createTicket
);


router.get(
  "/",
  verifyToken,
  ticketController.getTickets
);


router.get(
  "/:id",
  verifyToken,
  ticketController.getSingleTicket
);


router.patch(
  "/:id/status",
  verifyToken,
  checkRole(1, 2),
  ticketController.updateStatus
);


router.patch(
  "/:id/assign",
  verifyToken,
  checkRole(1, 2),
  ticketController.assignTicket
);



router.delete(
  "/:id",
  verifyToken,
  checkRole(1),
  ticketController.deleteTicket
);


router.post(
  "/:id/comments",
  verifyToken,
  ticketController.addComment
);



router.get(
  "/:id/comments",
  verifyToken,
  ticketController.getComments
);

module.exports = router;
