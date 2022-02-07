const router = require("express").Router();
const MoneyReport = require("../models/MoneyReport");
const jwt = require("jsonwebtoken");

const getUserId = (req) => {
  const headerToken = req.header("authorization").replace("token ", "");
  const { id: userId } = jwt.decode(headerToken);
  return userId;
};

// Middleware
function checkUserId(req, res, next) {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(400).send("Error, token is invalid or broken");
  }
  next();
}

// GET
router.get("/", checkUserId, async (req, res) => {
  const userId = getUserId(req);
  const moneyReport = await MoneyReport.find({
    user_id: userId,
  });
  res.send(moneyReport);
});

// POST
router.post("/", checkUserId, async (req, res) => {
  const userId = getUserId(req);
  const moneyReport = new MoneyReport({
    user_id: userId,
    title: req.body.title,
    value: req.body.value,
    where: req.body.where,
    payment_method: req.body.paymentMethod,
    category: req.body.category,
    date: req.body.date,
  });
  try {
    const savedUser = await moneyReport.save();
    res.send({ savedUser });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Error to save" });
  }
});

// DELETE
router.delete("/:id", checkUserId, async (req, res) => {
  const userId = getUserId(req);
  const moneyReportId = req.params.id;

  if (!moneyReportId) {
    return res.status(400).send({ message: "Error, missing report ID" });
  }
  try {
    const moneyReport = await MoneyReport.findOne({
      _id: moneyReportId,
    });
    const isMine = moneyReport.user_id === userId;
    if (!isMine) {
      return res.status(400).send({ message: "Error, it isn't yours" });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).send({ message: "Error, invalid ID passed" });
  }
  try {
    const moneyReportRemoved = await MoneyReport.remove({
      _id: moneyReportId,
      user_id: userId,
    });
    res.send({ message: "Success to remove" });
  } catch (error) {
    console.log(error);
    res.send({ message: "Error to remove" });
  }
});

// PATCH
router.patch("/:id", checkUserId, async (req, res) => {
  const userId = getUserId(req);
  const moneyReportId = req.params.id;
  if (!moneyReportId) {
    return res.status(400).send({ message: "Error, missing report ID" });
  }
  try {
    const moneyReport = await MoneyReport.findOne({
      _id: moneyReportId,
    });
    const isMine = moneyReport.user_id === userId;
    if (!isMine) {
      return res.status(400).send({ message: "Error, it isn't yours" });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).send({ message: "Error, invalid ID passed" });
  }
  try {
    const moneyReportRemoved = await MoneyReport.remove({
      _id: moneyReportId,
      user_id: userId,
    });
    res.send(moneyReportRemoved);
  } catch (error) {
    console.log(error);
    res.send({ message: "Error to update" });
  }
});

module.exports = router;
