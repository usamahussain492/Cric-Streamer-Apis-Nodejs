const addImage = require("../constants/addImage");
const Image = require("../models/UploadImage");
const VerifyToken = require("../validation/verifyToken");

exports.UploadImage = async (req, res, next) => {
  try {
    const validatedUser = VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
     
      const image  = await addImage(req.file)
      
      return res.status(200).json({
        status: true,
        message: "Image uploaded successfully",
        image: image,
      });
    
  } catch (err) {
    return res.status(400).json({
      status: false,
      data: err,
      message: "got some error",
    });
  }
};


exports.UploadImages = async (req, res, next) => {
  try {
    const validatedUser = VerifyToken(req, res);
    if (!validatedUser) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }
     let files = [];
     for(let file of req.files) {
      const image  = await addImage(file)
      files.push(image);
     }

     
      
      return res.status(200).json({
        status: true,
        message: "Images uploaded successfully",
        image: files,
      });
    
  } catch (err) {
    return res.status(400).json({
      status: false,
      data: err,
      message: "got some error",
    });
  }
}; 


