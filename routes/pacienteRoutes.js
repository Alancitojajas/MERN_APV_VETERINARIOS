import Express from "express";
import {
  agregarPaciente,
  obtenerPacientes,
  obtenerPaciente,
  eliminarPaciente,
  actualizarPaciente
} from "../controllers/pacienteController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = Express.Router();

router.route("/").post(checkAuth, agregarPaciente).get(checkAuth, obtenerPacientes);

router
    .route("/:id")
    .get(checkAuth, obtenerPaciente)
    .put(checkAuth, actualizarPaciente)
    .delete(checkAuth, eliminarPaciente);

export default router;
