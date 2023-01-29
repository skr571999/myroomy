const mongoose = require('mongoose');

const { app } = require('./server');

const config = {
    port: process.env.PORT || 8000,
    mongoUrl: process.env.MONGO_URL || 'mongodb://admin:admin@localhost',
};

(async () => {
    try {
        const dbConnection = await mongoose.connect(config.mongoUrl, { dbName: 'test' });
        console.log('DB Connected ', dbConnection.connection.db.databaseName);
        app.listen(config.port, console.log(`Listening on ${config.port}`));
    } catch (error) {
        console.log('Error: ', error);
        process.exit(1);
    }
})();
