const mongoose = require('mongoose');
const review = require('./review.js');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {type:String,required:true},
    description: String,
    image: {filename:{type:String},url:{type:String,default: "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg",set: (v) => v==="" ? "https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg" : v}},
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});

listingSchema.post('findOneAndDelete',async(listing)=>{
    if(listing){
        await review.deleteMany({_id:{$in: listing.reviews}});
    }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;