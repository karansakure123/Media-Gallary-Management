 import  Cards from "../schema/homeSchema.js";



 export const createCards=async(req,res, next)=>{
    const  {cardName, cardTitle, cardDescription} = req.body;
     if(!cardName || !cardTitle || !cardDescription){
        return next("please fill all fields", 400)
     }

     try{
      const createCard  = await Cards.create({cardName, cardTitle, cardDescription});
      res.status(201).json({
        success:true,
        message:"crated",   
        createCard
      })
        
    }catch(error){
      return next('error not create',error);
     }
 }


 export const getCards=async(req,res, next)=>{
    try {
        const getcards = await Cards.find();
        res.status(200).json({
            succes:true,
            message:"fetch success",
            getcards
        })
    } catch (error) {
        console.log('not fetch ', error);
    }
 }

 export const updCards=async(req,res, next)=>{
    try {
        const updcards = await Cards.findByIdAndUpdate(req.params.id,req.body,{new:true});
 
        if(!updcards){
            res.status(200).json({success:false,message:'err find card',updCards})
            
        }
        res.status(200).json({
            succes:true,
            message:"update success",
            updcards
        })
    } catch (error) {
          res.status(200).json({success:false,message:'err update',error})
    }
 }


export const deleteCards = async(req,res,next)=>{

    const deleteCards = await Cards.findByIdAndDelete(req.params.id,req.body,{new:true});
    if(!deleteCards){
       return res.status(404).json('error deleting card', deleteCards);
    }
    return res.status(200).json({success:true,message:'delete success',deleteCards})
}
