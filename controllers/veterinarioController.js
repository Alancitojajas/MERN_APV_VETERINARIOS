import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarjwt.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {
  const { email, nombre } = req.body;
  //revisar si un usuario esta registrado
  const existeUsuario = await Veterinario.findOne({ email });
  if (existeUsuario) {
    const error = new Error("Usario ya registrado");
    return res.status(400).json({ msg: error.message });
  }
  try {
    //guardar nuevo veterinario
    const veterinario = new Veterinario(req.body);
    const veterinarioGuardado = await veterinario.save();

    //Enviar email
    emailRegistro({
      email,
      nombre,
      token: veterinarioGuardado.token,
    });

    res.json({ msg: "Registrando usuario" });
  } catch (error) {
    console.log(error);
  }
};

const perfil = (req, res) => {
  const { veterinario } = req;
  res.json(veterinario);
};

const confirmar = async (req, res) => {
  const { token } = req.params;
  const usuarioConfirmar = await Veterinario.findOne({ token });

  if (!usuarioConfirmar) {
    const error = new Error("Token no valido");
    return res.status(404).json({ msg: error.message });
  }

  try {
    //! Consultamos a la bd y con la instancia guardamos los campos que debemos cambiar
    usuarioConfirmar.token = null;
    usuarioConfirmar.confirmado = true;
    await usuarioConfirmar.save();
    return res.json({ msg: "Usuario confirmado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;
  //comprobar si el usuario existe
  const usuario = await Veterinario.findOne({ email: email });

  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  //comprovar si el usuario esta confirmado o no
  if (!usuario.confirmado) {
    const error = new Error("El usuario no esta confirmado");
    return res.status(403).json({ msg: error.message });
  }

  //autenticar usuario
  if (await usuario.comprobarPassword(password)) {
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario.id),
    });
  } else {
    const error = new Error("Password incorrecto");
    return res.status(403).json({ msg: error.message });
  }
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;
  const existeEmail = await Veterinario.findOne({ email: email });
  if (!existeEmail) {
    const error = new Error("Usuario no encontrado");
    return res.status(400).json({ msg: error.message });
  }

  try {
    existeEmail.token = generarId();
    await existeEmail.save();

    //Enviar email con instrucciones
    emailOlvidePassword({
      email,
      nombre: existeEmail.nombre,
      token: existeEmail.tokenz,
    });
    res.json({ msg: "Hemos enviado un email con las instrucciones" });
  } catch (error) {
    console.log(error);
  }
};
const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const veterinario = await Veterinario.findOne({ token: token });

  if (!veterinario) {
    const error = new Error("Token no valido");
    return res.status(400).json({ error: error.message });
  }

  res.json({ msg: "Token valido" });
};
const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const veterinario = await Veterinario.findOne({ token });
  if (!veterinario) {
    const error = new Error("No se puede encontrar el token");
    return res.status(400).json({ message: error.message });
  }

  try {
    veterinario.token = null;
    veterinario.password = password;
    await veterinario.save();
    res.json({ message: "Contraseña modificada correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const actualizarPerfil = async (req, res) => {
  const veterinario = await Veterinario.findById(req.params.id);
  if (!veterinario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }

  const {email} = req.body;
  if(veterinario.email!== req.body.email) {
    const existeEmail = await Veterinario.findOne({email})
    if(existeEmail){
      const error = new Error("Ese email ya esta en uso");
      return res.status(400).json({ msg: error.message });
    }
  }

  try {
    veterinario.nombre = req.body.nombre || veterinario.nombre;
    veterinario.email = req.body.email || veterinario.email;
    veterinario.web = req.body.web || veterinario.web;
    veterinario.telefono = req.body.telefono || veterinario.telefono;



    const veterinarioActualizado = await veterinario.save();
    res.json(veterinarioActualizado);
  } catch (error) {
    console.log(error)
  }
};

const actualizarPassword = async (req, res) => {
  const {id} = req.veterinario;
  const {pwd_actual, pwd_nuevo} = req.body;

  const veterinario = await Veterinario.findById(id);
  if (!veterinario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  } 


  if(await veterinario.comprobarPassword(pwd_actual)){
    veterinario.password = pwd_nuevo
    await veterinario.save()
    res.json({msg: "Password actualizado correctamente"});
  }else{
    const error = new Error("El password actual es incorrecto");
    return res.status(400).json({ msg: error.message });
  }
};

export {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  actualizarPerfil,
  actualizarPassword
};
