import { Blog } from "../../../database/models/blog.model.js"
import { customAlphabet } from 'nanoid'
import imagekit, { destroyImage } from "../../utilities/imagekitConfigration.js"
import { pagination } from "../../utilities/pagination.js"
import { count } from "console"
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 5)


export const createBlog = async(req,res,next) => {
  try {
  console.log(req.body);
  console.log(req.file);
  // const {_id} = req.authUser
  const { title, description, Keywords ,views, lang } = req.body
    
    // const lang = req.query.lang
    if (!req.file) {
        return next(new Error('Please upload Blog image', { cause: 400 }))
    }

    //  console.log(req.body);  
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
          description,
          lang,  
          // author:_id, 
          Keywords,
          // views,
          customId,
          Image: {
            secure_url: uploadResult.url,       // image url that frontend can access the image 
            public_id: uploadResult.fileId,  // image path on imagekit website
          },
        };
        console.log(blogObject);
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

  const {page, size} = req.query
  const {limit, skip} = pagination({page, size}) 
  
  const blogs = await Blog.find().limit(limit).skip(skip)
  
  if(!blogs) return next(new Error("No Blogs Founded",{cause:404}))
  
    const num = blogs.length
    res.status(201).json({message:`Blogs Number : ${num}`,blogs})
}


export const getAllBlogsAR = async (req, res, next) => {

  const {page, size} = req.query
  const {limit, skip} = pagination({page, size}) 

  const blogs = await Blog.find({lang: "ar"}).limit(limit).skip(skip)
  
  if (!blogs) return next(new Error("No Blogs Found", { cause: 404 }));

  res.status(200).json({ message: `Done`, blogs });
}

export const getAllBlogsEN = async (req, res, next) => {

  const {page, size} = req.query
  const {limit, skip} = pagination({page, size}) 

  const blogs = await Blog.find({lang:"en"}).limit(limit).skip(skip);
  
  if (!blogs) return next(new Error("No Blogs Found", { cause: 404 }));

  res.status(200).json({ message: `Done`, blogs });
}



export const getSingleBlogs = async(req,res,next) => {

  try {
    
  const id = req.params.id
  const blog = await Blog.findById(id)

  if(!blog) return next(new Error("No Blog Didn't Found",{cause:404}))

    res.status(201).json({message:`Blog:`,blog})
  } catch (error) {
    next(new Error(`fail to upload${error.message}`, { cause: 500 }));
  }
}

export const updateBlog = async(req,res,next) => {

  try {
    const { title,description, Keywords ,views } = req.body
    const id = req.params.id
    // const {_id} = req.authUser

    const blog = await Blog.findOne({_id:id})
  
    if(!blog) {
      return next(new Error("Blog Didn't Found",{cause:404}))
    }
  
    if(title) blog.title = title
    if(description) blog.description = description
    if(Keywords) blog.Keywords = Keywords
    if(views) blog.views = views

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

    const id = req.params.id
    
    const blog = await Blog.findById(id);
    if (!blog) {
      return next(new Error('Blog not found', { cause: 404 }));
    }
    
    await destroyImage(blog.Image.public_id);    
    await Blog.findByIdAndDelete(id);


    res.status(200).json({ message: 'Blog and image deleted successfully'});
  } catch (error) {
    next(new Error(`Error deleting blog: ${error.message}`, { cause: 500 }));
  }
};




export const getLastThreeBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 }).limit(3);

    if (!blogs || blogs.length === 0) {
      return next(new Error("No Blogs Found", { cause: 404 }));
    }

    res.status(200).json({ message: "Last 3 Blogs", blogs });
  } catch (error) {
    next(error);
  }
};


export const getLastThreeBlogsforDashboard = async (req, res, next) => {
  try {

    
    const blogs = await Blog.find().select('title createdAt Image').sort({ createdAt: -1 }).limit(4);
    
    const count = await Blog.countDocuments();
    if (!blogs || blogs.length === 0) {
      return next(new Error("No Blogs Found", { cause: 404 }));
    }

    const returnedData = {
      blogs,
      count
    }
    
    res.status(200).json({ message: "Last 4 Blogs", returnedData });
  } catch (error) {
    next(error);
  }
};






