const Listing=require("./models/listing");
const ExpressError=require("./utils/ExpressError.js");
const Review=require("./models/review.js");
const {listingSchema,reviewSchema}=require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You musst be logged in to create a new listing!");
        return res.redirect("/login");
    }
    next();
};  

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    // Check if listing exists
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    // Fix 1: correct typo in res.locals.currUser
    // Fix 2: check if currUser is defined to avoid crashes
    if (!res.locals.currUser || !listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to edit this listing");
        return res.redirect(`/listings/${id}`);  // ✅ use backticks with ${}
    }

    // Fix 3: call next() so request continues if user is owner
    next();
};

module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id,reviewId } = req.params;
    const listing = await Review.findById(reviewId);

    // Check if listing exists
    if (!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You did not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};