const mongoose = require("mongoose");
// codemarkcodes
// Z3WhRUDttgpLtMIR
// const mongoDbUri = 'mongodb+srv://codemark:Ryzen0296@cluster0.n0rgkru.mongodb.net/us-door'
const mongoDbUri = 'mongodb+srv://codemarkcodes:Z3WhRUDttgpLtMIR@cluster0.yrshi8o.mongodb.net/e4d4'
const connectionWithDb = () => {
    mongoose.set('strictQuery', false);
    mongoose.connect(mongoDbUri).then(()=>{
        console.log('Connected to mongodb')
    })
}
module.exports = connectionWithDb;