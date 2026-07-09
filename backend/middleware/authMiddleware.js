import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect route - verify token

// export const protect = async(req, res, next) => {

//     const check = false;

//     if(check){
//         next();
//     }else{
//         console.log("User must login");
//     }

// }


export const protect = async(req, res, next) => {

   let token;

   if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
       try{
        
        token = req.headers.authorization.split(" ")[1];
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select("-password");

        console.log("im route middleware");

        next();
       }catch(error){
        console.error(error);
        res.status(401).json({ message: 'Not authorized, token failed' });
       }

   }

  if(!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }

}

// Admin middleware

export const admin = (req, res, next) => {

    if(req.user && req.user.isAdmin){
       next();
    }else {
        res.status(401).json({ message: 'Not authorized as admin' });
    }

}
