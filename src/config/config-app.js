require('dotenv').config();

const config = {
	environment: process.env.NODE_ENV,
	port: process.env.LOCALPORT,
	db_name: process.env.DB_NAME,
	secret: process.env.SECRET
};

module.exports = { config };
