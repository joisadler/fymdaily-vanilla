const {
  DBUSER,
  DBPASSWORD,
  DBHOST,
  DBPORT,
  DBNAME
} = process.env;
/* eslint-disable max-len */
module.exports = {
  url: `mongodb://${DBUSER}:${DBPASSWORD}@${DBHOST}:${DBPORT}/${DBNAME}`
};
