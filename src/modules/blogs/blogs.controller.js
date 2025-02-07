import { Blog } from "../../../database/models/blog.model.js"
import { customAlphabet } from 'nanoid'
import imagekit, { destroyImage } from "../../utilities/imagekitConfigration.js"
import { pagination } from "../../utilities/pagination.js"
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 5)

export const createBlog = async (req, res, next) => {
  try {
    const { _id } = req.authUser;
    const { title, description, Keywords, views } = req.body;
    // console.log(req.body);
    
    // Ensure request contains all necessary fields
    if (!title?.en || !title?.ar || !description?.en || !description?.ar || !Keywords?.en || !Keywords?.ar) {
      return next(new Error("Please provide title, description, and keywords in both languages", { cause: 400 }));
    }

    if (!req.file) {
      return next(new Error("Please upload a Blog image", { cause: 400 }));
    }

    const customId = nanoid();

    // Upload image to ImageKit
    const uploadResult = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: `${process.env.PROJECT_FOLDER}/Blogs/${customId}`,
    });

    const blogObject = {
      title: {
        en: title.en,
        ar: title.ar,
      },
      description: {
        en: description.en,
        ar: description.ar,
      },
      Keywords: {
        en: Keywords.en, // Convert comma-separated string to array
        ar: Keywords.ar,
      },
      author: _id,
      views: views || 253, // Default value if not provided
      customId,
      Image: {
        secure_url: uploadResult.url, // Image URL for frontend
        public_id: uploadResult.fileId, // ImageKit file ID
      },
    };

    const blog = await Blog.create(blogObject);

    if (!blog) {
      await destroyImage(uploadResult.fileId);
      return next(new Error("Try again later, failed to add", { cause: 400 }));
    }

    res.status(201).json({ message: "Blog added successfully", blog });
  } catch (error) {
    next(new Error(`Failed to create blog: ${error.message}`, { cause: 500 }));
  }
};



export const updateBlog = async (req, res, next) => {
  try {
    const { title, description, Keywords, views } = req.body;
    const id = req.params.id;
    const { _id } = req.authUser;

    // Find the blog by id and ensure it belongs to the authenticated user
    const blog = await Blog.findOne({ _id: id, author: _id });

    if (!blog) {
      return next(new Error("Blog not found", { cause: 404 }));
    }

    // Validate the required fields for title, description, and Keywords in both languages
    if (
      (title?.en && !title?.ar) ||
      (title?.ar && !title?.en) ||
      (description?.en && !description?.ar) ||
      (description?.ar && !description?.en) ||
      (Keywords?.en && !Keywords?.ar) ||
      (Keywords?.ar && !Keywords?.en)
    ) {
      return next(new Error("Please provide title, description, and keywords in both languages", { cause: 400 }));
    }

    // Update fields if they exist in the request
    if (title) {
      blog.title.en = title.en || blog.title.en;
      blog.title.ar = title.ar || blog.title.ar;
    }

    if (description) {
      blog.description.en = description.en || blog.description.en;
      blog.description.ar = description.ar || blog.description.ar;
    }

    if (Keywords) {
      blog.Keywords.en = Keywords.en || blog.Keywords.en;
      blog.Keywords.ar = Keywords.ar || blog.Keywords.ar;
    }

    if (views) blog.views = views;

    // Handle image upload if a new image is provided
    if (req.file) {
      // Destroy the old image from ImageKit
      await destroyImage(blog.Image.public_id);

      // Upload the new image to ImageKit
      const uploadResult = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: `${process.env.PROJECT_FOLDER}/Blogs/${blog.customId}`,
      });

      // Update the blog's image information
      blog.Image.secure_url = uploadResult.url;
      blog.Image.public_id = uploadResult.fileId;
    }

    // Save the updated blog
    await blog.save();

    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    next(new Error(`Failed to update blog: ${error.message}`, { cause: 500 }));
  }
};



export const getAllBlogs = async(req,res,next) => {

  const {page, size} = req.query
  const {limit, skip} = pagination({page, size}) 
  
  const blogs = await Blog.find().limit(limit).skip(skip)
  
  if(!blogs) return next(new Error("No Blogs Founded",{cause:404}))
  
    const num = blogs.length
    res.status(201).json({message:`Blogs Number : ${num}`,blogs})
}


export const getAllBlogsAR = async (req, res, next) => {
  const { page, size, lang } = req.query; // Default to English
  const { limit, skip } = pagination({ page, size });

  const blogs = await Blog.find().select(`title.${lang} description.${lang} Keywords views Image`);
  
  if (!blogs) return next(new Error("No Blogs Found", { cause: 404 }));

  res.status(200).json({ message: `Blogs in ${lang}`, blogs });
};

export const getAllBlogsEN = async (req, res, next) => {
  const { page, size, lang  } = req.query; // Default to English
  const { limit, skip } = pagination({ page, size });

  const blogs = await Blog.find({
    lang:lang
  });
  
  if (!blogs) return next(new Error("No Blogs Found", { cause: 404 }));

  res.status(200).json({ message: `Blogs in ${lang}`, blogs });
};



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


















