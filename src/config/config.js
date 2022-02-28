require('dotenv').config();

module.exports = {
	port: process.env.PORT || 4005,
	secret: process.env.SECRET_KEY,
	db_url: process.env.DB_URL
};