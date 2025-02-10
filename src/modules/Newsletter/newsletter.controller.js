import { newsletterModel } from "../../../database/models/newsletter.model.js"
import { io } from "../../utilities/initiateApp.js"

export const createNewsletter = async(req,res,next) => {


    const email = req.body.email

    const emailExsist = await newsletterModel.findOne({email:email})

    
    if(emailExsist) return next(new Error('you are already subscribed',{cause:400}))

       const emailObject ={
            email
        }

        // Emit an event to all connected clients
        const newsData = await newsletterModel.create(emailObject)
        
        if(!newsData) return next(new Error('error when adding email',{cause:400}))

          // io.emit('new_subscription', { email });

    res.status(201).json({message:"Done, you are subscriped in the newsletter",email})
}
export const getAllEmails = async (req,res,next) => {
    try {
      const emailData = await newsletterModel.find(); // Fetch from database
      res.json({ emailData });
  
      // Emit real-time update
      io.emit("emails_fetched", emailData);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
