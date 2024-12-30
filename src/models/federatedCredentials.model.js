const mongoose = require("mongoose");

const federatedCredentialsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  provider: { type: String, required: true },
  subject: { type: String, required: true },
});

const FederatedCredentials = mongoose.model(
  "FederatedCredentials",
  federatedCredentialsSchema
);

module.exports = FederatedCredentials;
