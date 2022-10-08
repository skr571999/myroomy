const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

const { app } = require('./server');

const PORT = process.env.PORT;

const run = async () => {
    // Disable to use useFindAndModify globally
    mongoose.set('useFindAndModify', false);
    mongoose
        .connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log('DB Connected'))
        .catch((err) => {
            console.log(`DB not Connected\nError name: ${err.name}\nExiting...`);
            process.exit(1);
        });

    app.listen(PORT, console.log(`Server running on ${PORT}`));
};

run();
