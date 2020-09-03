const {
  DBUSER,
  DBPASSWORD,
  DBHOST,
  DBNAME
} = process.env;
/* eslint-disable max-len */
module.exports = {
  url: `mongodb+srv://${DBUSER}:${DBPASSWORD}@${DBHOST}/${DBNAME}?retryWrites=true&w=majority`
};
