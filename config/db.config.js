const { DB_USERNAME, DB_PASSWORD } = require("./config");

module.exports = {
  url: "mongodb://localhost/myroomy",
  urlCloud: `mongodb://${DB_USERNAME}:${DB_PASSWORD}@ds149894.mlab.com:49894/roomy`
};
