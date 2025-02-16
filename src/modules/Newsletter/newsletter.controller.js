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

        // const unreadCount = await newsletterModel.countDocuments({ isRead: false })
        // io.emit("new_email", { email: newEmail, unreadCount })
        

          io.emit('new_subscription', { email });

    res.status(201).json({message:"Done, you are subscriped in the newsletter",email})
}

export const getAllEmails = async (req, res, next) => {
  try {
    const emailData = await newsletterModel.find({ isRead: false })
    res.json({ emailData })

    // Only emit if there are unread emails
    if (emailData.length > 0) {
      io.emit("emails_fetched", emailData)
    }
  } catch (error) {
    console.error("Error fetching subscribers:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

  // Get unread count
export const unRead = async (req, res, next) => {
  try {
    const count = await newsletterModel.countDocuments({ isRead: false })
    res.json({ count })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch unread count' })
  }
}

// Mark as read
export const markAsRead = async (req, res, next) => {
  try {
    await newsletterModel.updateMany(
      { isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    )
    io.emit("notifications_read")

    res.json({ message: 'Marked as read' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark as read' })
  }
}



export const getAll = async (req, res, next) => {
  try {
    const emailData = await newsletterModel.find()


    if(emailData.length === 0) return next(new Error('No emails found',{cause:404}))

      res.status(200).json({ message: "All emails", emailData })  
  } catch (error) {
    console.error("Error fetching subscribers:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}


export const getAllLastHour = async (req, res, next) => {
  try {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const emailData = await newsletterModel.find({ createdAt: { $gte: oneHourAgo } })


    if(emailData.length === 0) return next(new Error('No emails found',{cause:404}))

    if (emailData.length > 0) {
      io.emit("last-one-hour-newsletter", emailData)
    }
      res.status(200).json({ message: "All emails", emailData })  
  } catch (error) {
    console.error("Error fetching subscribers:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}