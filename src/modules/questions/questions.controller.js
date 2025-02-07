import { questionsModel } from "../../../database/models/questions.model.js"
import { pagination } from "../../utilities/pagination.js"


export const createQuestion = async (req, res, next) => {
  try {
    const { question, answer } = req.body;
    const { _id } = req.authUser; // Assuming user authentication


    console.log(_id);
    
    // Validate question and answer structure
    if (
      !question?.en ||
      !question?.ar ||
      !answer?.en ||
      !answer?.ar
    ) {
      return next(new Error("Both 'en' and 'ar' fields are required for question and answer.", { cause: 400 }));
    }


    const isQuestionExisting = await questionsModel.findOne({
      $or: [{ "question.en": question.en }, { "question.ar": question.ar }],
    });

    if (isQuestionExisting) {
      return next(new Error("This question already exists.", { cause: 400 }));
    }

    // Create the question object
    const questionObject = {
      question,
      answer,
      createdBy: _id,
    };

    const questionData = await questionsModel.create(questionObject);

    if (!questionData) {
      return next(new Error("Failed to create the question", { cause: 400 }));
    }

    res.status(201).json({ message: "Question added successfully", questionData });
  } catch (error) {
    next(new Error(`Failed to upload question: ${error.message}`, { cause: 500 }));
  }
};


export const UpdateQuestion = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { _id } = req.authUser;
    const { question, answer } = req.body;

    // Find the question created by the authenticated user
    const existingQuestion = await questionsModel.findOne({ _id: id, createdBy: _id });

    if (!existingQuestion) {
      return next(new Error("Question not found.", { cause: 404 }));
    }

    // Prevent updating with an existing question
    if (question?.en || question?.ar) {
      const isDuplicate = await questionsModel.findOne({
        _id: { $ne: id }, // Exclude the current question
        $or: [
          { "question.en": question?.en },
          { "question.ar": question?.ar }
        ],
      });

      if (isDuplicate) {
        return next(new Error("This question already exists.", { cause: 400 }));
      }
    }

    // Update question fields if provided
    if (question) {
      existingQuestion.question.en = question.en || existingQuestion.question.en;
      existingQuestion.question.ar = question.ar || existingQuestion.question.ar;
    }

    // Update answer fields if provided
    if (answer) {
      existingQuestion.answer.en = answer.en || existingQuestion.answer.en;
      existingQuestion.answer.ar = answer.ar || existingQuestion.answer.ar;
    }

    await existingQuestion.save();

    res.status(200).json({ message: "Question updated successfully", question: existingQuestion });
  } catch (error) {
    next(new Error(`Failed to update question: ${error.message}`, { cause: 500 }));
  }
};


export const getAllQuestion = async (req,res,next) => {
    try{

      const {page, size} = req.query
      const {limit, skip} = pagination({page, size}) 

         const questionData = await questionsModel.find()
         if(!questionData) return next(new Error("didn't found the question .",{cause:404}))
         
            const num = questionData.length
         res.status(201).json({message : `Questions: ${num}`,questionData})
       }  catch (error) {
         next(new Error(`fail to upload ${error.message}`, { cause: 500 }));
       }
}

export const getSingleQuestion = async (req,res,next) => {
    try{
        const id = req.params.id

         const questionData = await questionsModel.findById(id)
         if(!questionData) return next(new Error("didn't found the question .",{cause:404}))
         
         res.status(201).json({message : `Question: `,questionData})
       }  catch (error) {
         next(new Error(`fail to upload ${error.message}`, { cause: 500 }));
       }
}

export const deleteQuestion = async (req,res,next) => {
    try{
        const id = req.params.id

         const questionData = await questionsModel.findByIdAndDelete(id)
         if(!questionData) return next(new Error("didn't found the question .",{cause:404}))
         

         res.status(201).json({message : "Question Deleted sucessfully"})
       }  catch (error) {
         next(new Error(`fail to upload ${error.message}`, { cause: 500 }));
       }
}

