const mongoose = require("mongoose");

const defaultValidation = {
  type: String,
  min: 6,
  max: 255,
};

const requireValidation = {
  ...defaultValidation,
  required: true,
};

const moneyReportSchema = new mongoose.Schema({
  user_id: {
    ...requireValidation,
  },
  title: {
    ...requireValidation,
  },
  value: {
    ...requireValidation,
  },
  where: {
    ...requireValidation,
  },
  payment_method: {
    ...requireValidation,
  },
  category: {
    ...defaultValidation,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("MoneyReport", moneyReportSchema);
