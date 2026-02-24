const express = require("express");
const router = express.Router();

const ticketController = require("../controllers/ticketController");
const verifyToken = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");

/* =========================================
   CREATE TICKET
   POST /tickets
   Roles: USER (3), MANAGER (1)
========================================= */
router.post(
  "/",
  verifyToken,
  checkRole(1, 3), // MANAGER + USER
  ticketController.createTicket
);


/* =========================================
   GET TICKETS
   GET /tickets
   USER → own
   SUPPORT → assigned
   MANAGER → all
========================================= */
router.get(
  "/",
  verifyToken,
  ticketController.getTickets
);


/* =========================================
   GET SINGLE TICKET
   GET /tickets/:id
========================================= */
router.get(
  "/:id",
  verifyToken,
  ticketController.getSingleTicket
);


/* =========================================
   UPDATE STATUS
   PATCH /tickets/:id/status
   Roles: MANAGER (1), SUPPORT (2)
========================================= */
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