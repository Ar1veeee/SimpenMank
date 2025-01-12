const admin = require("firebase-admin");
const serviceAccount = require("../services/simpenmank-firebase-adminsdk-2cjcj-185b53cb20.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
