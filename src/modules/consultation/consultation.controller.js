import { consultationModel } from "../../../database/models/consultation.model.js";

export const createConsultation = async (req, res) => {
    try {
        const { type, selectedDay, phone, email } = req.body
        
        if (!type || !selectedDay || !phone || !email) {
            return res.status(400).json({ error: "All fields are required" })
        }

        const consObject = {
            type: type,
            selectedDay: selectedDay,
            phone: phone,
            email: email
        }

        console.log("Attempting to create consultation with:", consObject);

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
