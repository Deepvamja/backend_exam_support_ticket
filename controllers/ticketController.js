const db = require("../config/db");


exports.createTicket = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    if (!title || title.length < 5) {
      return res.status(400).json({
        message: "Title must be at least 5 characters",
      });
    }

    if (!description || description.length < 10) {
      return res.status(400).json({
        message: "Description must be at least 10 characters",
      });
    }

    const allowedPriorities = ["LOW", "MEDIUM", "HIGH"];

    if (!allowedPriorities.includes(priority)) {
      return res.status(400).json({
        message: "Invalid priority value",
      });
    }

    await db.promise().query(
      `INSERT INTO tickets 
       (title, description, priority, created_by) 
       VALUES (?, ?, ?, ?)`,
      [title, description, priority, req.user.id]
    );

    res.status(201).json({
      message: "Ticket created successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getTickets = async (req, res) => {
  try {
    let query;
    let params = [];

    if (req.user.role_id === 3) {
   
      query = "SELECT * FROM tickets WHERE created_by = ?";
      params = [req.user.id];

    } else if (req.user.role_id === 2) {
   
      query = "SELECT * FROM tickets WHERE assigned_to = ?";
      params = [req.user.id];

    } else {
   
      query = "SELECT * FROM tickets";
    }

    const [tickets] = await db.promise().query(query, params);

    res.status(200).json(tickets);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getSingleTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const [ticket] = await db.promise().query(
      "SELECT * FROM tickets WHERE id = ?",
      [id]
    );

    if (ticket.length === 0) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.status(200).json(ticket[0]);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    const [ticket] = await db.promise().query(
      "SELECT status FROM tickets WHERE id = ?",
      [id]
    );

    if (ticket.length === 0) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    const currentStatus = ticket[0].status;

    const lifecycle = {
      OPEN: "IN_PROGRESS",
      IN_PROGRESS: "RESOLVED",
      RESOLVED: "CLOSED",
      CLOSED: null,
    };

    if (lifecycle[currentStatus] !== status) {
      return res.status(400).json({
        message: `Invalid transition. Allowed: ${currentStatus} → ${lifecycle[currentStatus]}`,
      });
    }

  
    await db.promise().query(
      "UPDATE tickets SET status = ? WHERE id = ?",
      [status, id]
    );

    await db.promise().query(
      `INSERT INTO status_logs 
       (ticket_id, old_status, new_status, changed_by)
       VALUES (?, ?, ?, ?)`,
      [id, currentStatus, status, req.user.id]
    );

    res.status(200).json({
      message: "Status updated and logged successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.assignTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { assigned_to } = req.body;

    if (!assigned_to) {
      return res.status(400).json({
        message: "assigned_to user ID required",
      });
    }

    const [user] = await db.promise().query(
      "SELECT role_id FROM users WHERE id = ?",
      [assigned_to]
    );

    if (user.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user[0].role_id === 3) {
      return res.status(400).json({
        message: "Cannot assign ticket to USER role",
      });
    }

    await db.promise().query(
      "UPDATE tickets SET assigned_to = ? WHERE id = ?",
      [assigned_to, id]
    );

    res.status(200).json({
      message: "Ticket assigned successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const [ticket] = await db.promise().query(
      "SELECT id FROM tickets WHERE id = ?",
      [id]
    );

    if (ticket.length === 0) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    await db.promise().query(
      "DELETE FROM tickets WHERE id = ?",
      [id]
    );

    res.status(200).json({
      message: "Ticket deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({
        message: "Comment is required",
      });
    }

    const [ticket] = await db.promise().query(
      "SELECT id FROM tickets WHERE id = ?",
      [id]
    );

    if (ticket.length === 0) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    await db.promise().query(
      `INSERT INTO comments 
       (ticket_id, user_id, comment)
       VALUES (?, ?, ?)`,
      [id, req.user.id, comment]
    );

    res.status(201).json({
      message: "Comment added successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getComments = async (req, res) => {
  try {
    const { id } = req.params;

    const [comments] = await db.promise().query(
      "SELECT * FROM comments WHERE ticket_id = ?",
      [id]
    );

    res.status(200).json(comments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
