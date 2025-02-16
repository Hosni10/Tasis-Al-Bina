import { consultationModel } from "../../../database/models/consultation.model.js";
import { io } from "../../utilities/initiateApp.js";

export const createConsultation = async (req, res) => {
    try {
        const { type, selectedDay, phone, email,status } = req.body
        
        if (!type || !selectedDay || !phone || !email) {
            return res.status(400).json({ error: "All fields are required" })
        }

        const consObject = {
            type: type,
            selectedDay: selectedDay,
            phone: phone,
            email: email,
            status: status
        }

                  io.emit('new_consultation', {            
                    type, 
                    selectedDay,
                    phone,
                    email,
                    status });

        // console.log("Attempting to create consultation with:", consObject);

        const newConsultation = new consultationModel(consObject)
        const savedConsultation = await newConsultation.save()

        console.log("Successfully saved consultation:", savedConsultation);

        res.status(201).json({
            message: "Consultation created successfully",
            newConsultation: savedConsultation
        })
    } catch (error) {
        console.error("Consultation creation error:", error);
        res.status(500).json({ 
            error: error.message,
            stack: error.stack 
        })
    }
}



// Get all consultations
export const getAllConsultation = async (req, res) => {
    try {
        const consultations = await consultationModel.find();
        
        if (!consultations) {
            return next(new Error("Interest records not found", { cause: 404 }))
        }
        if (consultations.length > 0) {
                  io.emit("consultation-featch", consultations)
            }
        res.status(200).json(consultations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




// Get a single consultation by ID
export const getOneConsultation =  async (req, res) => {
    try {
        const consultation = await consultationModel.findById(req.params.id);
        if (!consultation) {
            return res.status(404).json({ message: "Consultation not found" });
        }
        res.status(200).json(consultation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a consultation by ID
export const updateConsultation =  async (req, res) => {
    try {
        const updatedConsultation = await consultationModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedConsultation) {
            return res.status(404).json({ message: "Consultation not found" });
        }
        res.status(200).json({ message: "Consultation updated successfully", updatedConsultation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a consultation by ID
export const deleteConsultation = async (req, res) => {
    try {
        const deletedConsultation = await consultationModel.findByIdAndDelete(req.params.id);
        if (!deletedConsultation) {
            return res.status(404).json({ message: "Consultation not found" });
        }
        res.status(200).json({ message: "Consultation deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const markAsRead =  async (req, res) => {
    try {
        const consultation = await consultationModel.findByIdAndUpdate({ _id: req.params.id }, { status: 'مكتملة' }, { new: true });
        if (!consultation) {
            return res.status(404).json({ message: "Consultation not found" });
        }
        res.status(200).json(consultation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const markAsCanceled =  async (req, res) => {
    try {
        const consultation = await consultationModel.findByIdAndUpdate({ _id: req.params.id }, { status: 'ملغية' }, { new: true });
        if (!consultation) {
            return res.status(404).json({ message: "Consultation not found" });
        }
        res.status(200).json(consultation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getLastThreeConsultes = async (req, res, next) => {
    try {
      const consultes = await consultationModel.find()
      .select(`type selectedDay phone`)
      .sort({ createdAt: -1 }).limit(4);
        const count = await consultationModel.countDocuments();
      if (!consultes || consultes.length === 0) {
        return next(new Error("No consultes Found", { cause: 404 }));
      }

     const returnedData = {
        count,
        consultes,
      }
  
      res.status(200).json({ message: "Last 4 consultes and thair count", returnedData });
    } catch (error) {
      next(error);
    }
  };


  export const isRead = async (req, res, next) => {
    try {
      await consultationModel.updateMany(
        { isRead: false },
        { $set: { isRead: true}}
      )
      io.emit("consultation_read")
  
      res.json({ message: 'Marked as read' })
    } catch (error) {
      res.status(500).json({ message: 'Failed to mark as read' })
    }
  }

  export const getAllLastOneHour = async (req, res, next) => {
    try {
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
  
      const consultationData = await consultationModel.find({ createdAt: { $gte: oneHourAgo } });
  
      // console.log(consultationData.length);
      
      if (consultationData.length === 0) return next(new Error('No consultations found in the last hour', { cause: 404 }));
  
      if (consultationData.length > 0) {
        io.emit("last-one-hour-consoltation", consultationData)
      }
      // console.log(consultationData);
      
  
      res.status(200).json({ message: "Emails from the last hour", consultationData });
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };


  export const getAllUnReadConsultents = async (req, res, next) => {
      try {
          const consultations = await consultationModel.find({ isRead: false })
  
              if (!consultations) {
                  return next(new Error("Interest records not found", { cause: 404 }))
              }
              if (consultations.length > 0) {
                        io.emit("consultation-featch", consultations)
                  }
              console.log(consultations);
              
          res.status(200).json({ message: "Success", consultations })
      } catch (error) {
          next(error) 
      }
  }