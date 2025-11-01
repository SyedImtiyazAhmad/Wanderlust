const mongoose = require('mongoose');
const initData=require('./data.js');
const Listing = require('../models/listing.js');

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{console.log("connected to DB")})
.catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}
const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"68f87d72a4c640116c6357af"}));
    await Listing.insertMany(initData.data);
    console.log("DB Initialized with sample data");
}
initDB();