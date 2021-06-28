const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');


// Load env vars 
dotenv.config({path : './config/config.env'});

// Load modules
const Note = require('./models/Note');
const User = require('./models/User');


// Connect to db 
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser : true,
    useCreateIndex : true,
    useFindAndModify: false,
    useUnifiedTopology : true
})


// Read JSON files
const note = JSON.parse(
    fs.readFileSync(`${__dirname}/data/note.json`,'utf-8')
);
const user = JSON.parse(
    fs.readFileSync(`${__dirname}/data/user.json`,'utf-8')
);

// Import into BD 
const importData = async () => {
    try{
        await Note.create(note);
        await User.create(user);
        console.log('Data Imported...'.green.inverse);
        process.exit();
    }catch(err){
        console.error(err);
    }
}


// Delete Data
const deleteData = async () => {
    try {
        await Note.deleteMany();
        await User.deleteMany();
        console.log('Data destroyed...'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(error)
    }
}


if(process.argv[2] === '-i'){
    importData();
}else if(process.argv[2] === '-d'){
    deleteData();
}