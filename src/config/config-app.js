require('dotenv').config();

const config = {
	environment: process.env.NODE_ENV,
	port: process.env.LOCALPORT,
	db_host: process.env.DB_HOST,
	db_user: process.env.DB_USER,
	db_password: process.env.DB_PASSWORD,
	db_name: process.env.DB_NAME,
	// gm_user: process.env.GM_USER,
	// gm_password: process.env.GM_PASSWORD,
	secret: process.env.SECRET
};

module.exports = { config };
