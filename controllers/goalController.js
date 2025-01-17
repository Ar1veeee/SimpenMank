const { use } = require("passport");
const {
  getUserGoals,
  getGoalDetails,
  addUserGoal,
  editUserGoal,
  deleteUserGoal,
} = require("../models/goalModel");
const { findUserById } = require("../models/usersModel");

const handleErrorResponse = (res, error, message) => {
  console.error(message, error);
  res.status(500).json({ message });
};

const validateGoalFields = ({
  goal_name,
  target_amount,
  current_amount,
  deadline,
}) => {
  if (!goal_name || typeof goal_name !== "string" || goal_name.trim() === "") {
    return "Goal name is required and must be a valid string";
  }

  if (!target_amount || isNaN(target_amount) || target_amount < 0) {
    return "Target amount must be a valid number and cannot be negative";
  }

  if (!current_amount || isNaN(current_amount) || current_amount < 0) {
    return "Current amount must be a valid number and cannot be negative";
  }

  if (!deadline) {
    return "Deadline date is required";
  }

  return null;
};

const validateUser = async (res, user_id) => {
  const user = await findUserById(user_id);
  if (!user) {
    res.status(404).json({ message: "User Not Found" });
    return null;
  }
  return user;
};

const Goals = async (req, res) => {
  const user_id = req.user.id;
  const user = await validateUser(res, user_id);

  if (!user) return;

  try {
    const goals = await getUserGoals(user_id);
    res.status(200).json(goals);
  } catch (error) {
    handleErrorResponse(res, error, "Error Fetching Goals:");
  }
};

const GoalDetail = async (req, res) => {
  const { goal_id } = req.params;
  const user_id = req.user.id;
  const user = await validateUser(res, user_id);

  if (!user) return;
  if (!goal_id) {
    return res.status(400).json({
      message: "Goal ID is required",
    });
  }
  try {
    const goalDetail = await getGoalDetails(user_id, goal_id);
    if (!goalDetail) {
      return res.status(404).json({ message: "Goal not found or unauthorized" });
    }
    res.status(200).json(goalDetail);
  } catch (error) {
    handleErrorResponse(res, error, "Error Fetching Goal Detail:");
  }
};

const AddGoal = async (req, res) => {
  const user_id = req.user.id;
  const { goal_name, target_amount, current_amount, deadline } = req.body;

  const user = await validateUser(res, user_id);

  if (!user) return;

  const validationError = validateGoalFields({
    user_id,
    goal_name,
    target_amount,
    current_amount,
    deadline,
  });

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    await addUserGoal(
      user_id,
      goal_name,
      target_amount,
      current_amount,
      deadline
    );
    res.status(200).json({ message: "Goal successfully added" });
  } catch (error) {
    handleErrorResponse(res, error, "Error Adding Goal:");
  }
};

const UpdateGoal = async (req, res) => {
  const { goal_id } = req.params;
  const user_id = req.user.id;
  const { goal_name, target_amount, current_amount, deadline } = req.body;
  const user = await validateUser(res, user_id);

  if (!user) return;

  if (!goal_id) {
    return res.status(400).json({ message: "Goal ID is required" });
  }

  const validationError = validateGoalFields({
    goal_name,
    target_amount,
    current_amount,
    deadline,
  });

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    await editUserGoal(
      user_id,
      goal_id,
      goal_name,
      target_amount,
      current_amount,
      deadline,
    );
    res.status(200).json({ message: "Goal successfully updated" });
  } catch (error) {
    handleErrorResponse(res, error, "Error Updating Goal:");
  }
};

const DeleteGoal = async (req, res) => {
  const { goal_id } = req.params;
  const user_id = req.user.id;
  const user = await validateUser(res, user_id);

  if (!user) return;
  if (!goal_id) {
    return res.status(400).json({ message: "Goal ID is required" });
  }

  try {
    const result = await deleteUserGoal(user_id, goal_id);
    if (!result) {
      return res.status(400).json({ message: "Goal not found" });
    }
    res.status(200).json({ message: "Goal successfully deleted" });
  } catch (error) {
    handleErrorResponse(res, error, "Error Deleting Goal:");
  }
};

module.exports = { Goals, GoalDetail, AddGoal, UpdateGoal, DeleteGoal };
