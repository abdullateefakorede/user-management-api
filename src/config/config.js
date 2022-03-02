require('dotenv').config();

module.exports = {
	port: process.env.PORT || 4005,
	secret: process.env.SECRET_KEY,
	MONGODB_URI: process.env.MONGODB_URI
};