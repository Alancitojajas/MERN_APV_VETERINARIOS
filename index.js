import  express  from "express";
import cors from "cors";
import dotenv from "dotenv";
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js';
import conectarDB from "./config/db.js";

const app = express();
app.use(express.json());
dotenv.config()
conectarDB();

const dominiosPermitidos = [process.env.FRONTEND_URL , 'http://127.0.0.1:5173' ];

const corsOptions = {
    origin: function(origin, callback) {
        if(dominiosPermitidos.indexOf(origin)!== -1){
            callback(null, true);
        } else {
            callback(new Error("No permitido por cors"));
        }
    }
}

app.use(cors(corsOptions));
app.use("/api/veterinarios", veterinarioRoutes);
app.use("/api/pacientes", pacienteRoutes);

const port = process.env.PORT ?? 4000

app.listen(port, () =>{
    console.log("Servidor iniciado correctamente");
});