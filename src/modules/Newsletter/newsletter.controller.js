import { newsletterModel } from "../../../database/models/newsletter.model.js"

export const createNewsletter = async(req,res,next) => {


    const email = req.body.email

    const emailExsist = await newsletterModel.findOne({email:email})

    
    if(emailExsist) return next(new Error('you are already subscribed',{cause:400}))

       const emailObject ={
            email
        }

        const newsData = await newsletterModel.create(emailObject)

    if(!newsData) return next(new Error('error when adding email',{cause:400}))

    res.status(201).json({message:"Done, you are subscriped in the newsletter",email})
}

export const getAllEmails = async (req,res,next) => {
    try{

      const {page, size} = req.query
      const {limit, skip} = pagination({page, size}) 

         const emailData = await newsletterModel.find().limit().skip()
         if(!emailData) return next(new Error("didn't found the emails .",{cause:404}))
         
            const num = emailData.length
         res.status(201).json({message : `Questions: ${num}`,emailData})
       }  catch (error) {
         next(new Error(`fail to upload ${error.message}`, { cause: 500 }));
       }
}
