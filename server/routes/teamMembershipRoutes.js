import { Router } from "express";

import {
  addTeamMembership,
  listIncomingTeamMemberships,
  listMyTeamMemberships,
  listProjectTeamMemberships,
  updateMembershipStatus,
  withdrawMembership,
  listCurrentProjectTeam,
} from "../controllers/teamMembershipController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.get("/me", requireAuth, listMyTeamMemberships);
router.get("/incoming", requireAuth, listIncomingTeamMemberships);

// Public: lets anyone viewing a project see accepted team members
router.get("/project/:projectId/team", listCurrentProjectTeam);

// Private: used for full project membership management
router.get("/project/:projectId", requireAuth, listProjectTeamMemberships);

router.post("/", requireAuth, addTeamMembership);
router.patch("/:membershipId/status", requireAuth, updateMembershipStatus);
router.delete("/:membershipId", requireAuth, withdrawMembership);

export default router;
