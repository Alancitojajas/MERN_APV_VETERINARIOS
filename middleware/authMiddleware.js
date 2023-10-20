import Jwt from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";

const checkAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    console.log("si tiene bearer");
  }

  try {
    token = req.headers.authorization.split(" ")[1];
    const decoded = Jwt.verify(token, process.env.JWT_SECRET);
    req.veterinario = await Veterinario.findById(decoded.id).select(
      "-password -token -confirmado"
    );
    return next();
  } catch (err) {
    const error = new Error("Token no valido");
    res.status(403).json({ msg: error.msg });
  }

  if (!token) {
    const error = new Error("Token no valido");
    res.status(403).json({ msg: error.msg });
  }

  next();
};

export default checkAuth;
