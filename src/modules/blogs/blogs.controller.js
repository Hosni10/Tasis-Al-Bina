import { Blog } from "../../../database/models/blog.model.js"
import { customAlphabet } from 'nanoid'
import imagekit, { destroyImage } from "../../utilities/imagekitConfigration.js"
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 5)


export const createBlog = async(req,res,next) => {
  try {
  
  const { title, author, content  } = req.body

    if (!req.file) {
        return next(new Error('Please upload Blog image', { cause: 400 }))
    }

    // ~ console.log(req.body);  
    // ~ console.log(req.file);   

    const customId = nanoid()

      // console.log(req.file.originalname,"req.file.originalname");
      // console.log(req.file.buffer,"req.file.buffer");
      
 
        const uploadResult = await imagekit.upload({
          file: req.file.buffer, 
          fileName: req.file.originalname,  
          folder: `${process.env.PROJECT_FOLDER}/Blogs/${customId}`, 
        });
     
        //  console.log(uploadResult);
        
        const blogObject = {
          title,
          author,
          content,
          customId,
          Image: {
            secure_url: uploadResult.url,       // image url that frontend can access the image 
            public_id: uploadResult.fileId,  // image path on imagekit website
          },
        };
    
        const blog = await Blog.create(blogObject);
    
        if (!blog) {
           await destroyImage(blog.Image.public_id);
           return next(new Error('Try again later, failed to add', { cause: 400 }));
        }
    
        res.status(200).json({ message: 'Blog added successfully', blog });
      } catch (error) {
        next(new Error(`Failed to upload image: ${error.message}`, { cause: 500 }));
      }

}

export const getAllBlogs = async(req,res,next) => {

  const blogs = await Blog.find()

  if(!blogs) return next(new Error("No Blogs Founded",{cause:404}))

    const num = blogs.length
    res.status(201).json({message:`Blogs Number : ${num}`,blogs})
}

export const getSingleBlogs = async(req,res,next) => {

  const id = req.params.id
  const blog = await Blog.findById(id)

  if(!blog) return next(new Error("No Blog Didn't Found",{cause:404}))

    res.status(201).json({message:`Blog:`,blog})
}

export const updateBlog = async(req,res,next) => {

  try {
    const {title, content} =  req.body
    const id = req.params.id
  
    const blog = await Blog.findById(id)
  
    if(!blog) {
      return next(new Error("Blog Didn't Found",{cause:400}))
    }
  
    if(title) blog.title = title
    if(content) blog.content = content
  
    if(req.file){
      await destroyImage(blog.Image.public_id);  
  
    const uploadResult = await imagekit.upload({
      file: req.file.buffer, 
      fileName: req.file.originalname,  
      folder: `${process.env.PROJECT_FOLDER}/Blogs/${blog.customId}`, 
    });
  
    blog.Image.secure_url = uploadResult.url,
    blog.Image.public_id = uploadResult.fileId
  }
  
    await blog.save()
    res.status(200).json({message : "blog updated successfully",blog})
  }  catch (error) {
    next(new Error(`fail to upload${error.message}`, { cause: 500 }));
  }
 
}



export const deleteBlog = async (req, res, next) => {
  try {

    
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return next(new Error('Blog not found', { cause: 404 }));
    }
    
    const deleteResult = await destroyImage(blog.Image.public_id);    
    await Blog.deleteMany();

    res.status(200).json({ message: 'Blog and image deleted successfully'});
  } catch (error) {
    next(new Error(`Error deleting blog: ${error.message}`, { cause: 500 }));
  }
};
