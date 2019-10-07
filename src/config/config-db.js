const mongoose = require('mongoose');
const { config } = require('./config-app');

mongoose
	.connect(`mongodb://localhost/${config.db_name}`, {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false
	})
	.then(db => console.log('BD Conectada!'))
	.catch(err => console.log(err));
