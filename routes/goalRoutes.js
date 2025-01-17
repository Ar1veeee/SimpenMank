const express = require("express");
const verifyToken = require("../middlewares/authMiddlewares");
const { verifyGoalOwnership } = require("../middlewares/userMiddlewares");
const router = express.Router();
const {
  Goals,
  GoalDetail,
  AddGoal,
  UpdateGoal,
  DeleteGoal,
} = require("../controllers/goalController");
const verifyUser = verifyGoalOwnership;

router.use(verifyToken);
router.use(verifyUser);
router.get("/", Goals);
router.post("/", AddGoal);

router.put("/:goal_id", UpdateGoal);
router.delete("/:goal_id", DeleteGoal);
router.get("/:goal_id/detail", GoalDetail);

module.exports = router;
