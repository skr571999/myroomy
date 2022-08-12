const { DB_USERNAME, DB_PASSWORD } = require("./config");

module.exports = {
  url: `mongodb://${DB_USERNAME}:${DB_PASSWORD}@localhost`,
};
