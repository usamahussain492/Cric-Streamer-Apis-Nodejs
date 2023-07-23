// verify token
const jwt = require("jsonwebtoken");

const  VerifyToken = async (req, res)=> {
  try {
    const token = req.header("auth-token");
    
    if (!token)
      return res.status(401).json({ status: false, message: "Access Denied" });
    const verified =  jwt.verify(token, process.env.TOKEN_SECRET);
    
    return verified.user;
    
  } catch (e) {
    res.status(400).json({
      status: false,
      message: e,
    });
  }
};

module.exports = VerifyToken;
