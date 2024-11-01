import mongoose from "mongoose";
const homeSchema= mongoose.Schema({
     cardName :{
        type:String,
        required:true
     },
     cardTitle:{
        type:String,
        requried:true,
     },
     cardDescription:{
        type:String,
        requried:true,
     },

})
const Cards = mongoose.model("Card",homeSchema);
export default Cards;