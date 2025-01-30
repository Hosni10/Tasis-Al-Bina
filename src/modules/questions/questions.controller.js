import { questionsModel } from "../../../database/models/questions.model.js"
import { pagination } from "../../utilities/pagination.js"


export const createQuestion = async (req,res,next) => {
   try{

    const {
        question,
        answer,
        description,
        Keywords,
        createdBy} = req.body


        const isQuestionExisting = await questionsModel.findOne({
            question:question
        })
    
        if(isQuestionExisting) return next(new Error("this question is already existing.",{cause:400}))


        const questionObject = {
            question,
            answer,
            description,
            Keywords,
            createdBy
        }

        const questionData = await questionsModel.create(questionObject) 
        // console.log(questionData);
        

        if(!questionData) return next(new Error("Fail to Upload question",{cause:400}))

       await questionData.save()
        
       res.status(201).json({message:"question added successfully",questionData})
    }catch (error) {
        next(new Error(`fail to upload${error.message}`, { cause: 500 }));
      }
}

export const UpdateQuestion = async (req,res,next) => {
    try{

        const id = req.params.id

        const {
            question,
            answer,
            description,
            Keywords} = req.body

        // console.log(req.body);
        

         const isQuestionExisting = await questionsModel.findById(id)
         if(!isQuestionExisting) return next(new Error("didn't found the question .",{cause:404}))
 
 
            if(question) isQuestionExisting.question = question

            if(answer) isQuestionExisting.answer = answer

            if(description) isQuestionExisting.description = description

            if(Keywords) isQuestionExisting.Keywords = Keywords

//  console.log(isQuestionExisting.question);
//  console.log(isQuestionExisting.answer);
//  console.log(isQuestionExisting.description);
//  console.log(isQuestionExisting.Keywords);
 
         
 
         await isQuestionExisting.save()
         res.status(201).json({message : "Question updated successfully",isQuestionExisting})
       }  catch (error) {
         next(new Error(`fail to upload ${error.message}`, { cause: 500 }));
       }
}

export const getAllQuestion = async (req,res,next) => {
    try{

      const {page, size} = req.query
      const {limit, skip} = pagination({page, size}) 

         const questionData = await questionsModel.find().limit(limit).skip(skip)
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

