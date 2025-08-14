const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
app.use(express.json());

// Configura la conexión a MongoDB
const uri = "mongodb+srv://ialfper:ialfper21@alumnos.zoinj.mongodb.net/alumnos?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Función para conectar a la base de datos y obtener las colecciones
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Conectado a MongoDB Atlas");
    const db = client.db('tiempo');
    return {
      predicciones: db.collection('predicciones'),
      
    };
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    throw new Error('Error al conectar a la base de datos');
  }
}

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


app.get('/api/predicciones', async (req, res) => {
  try {
    const { predicciones } = await connectToMongoDB();
    const lista_predics = await predicciones.find().toArray();
    console.log("predict:", lista_predics);
    res.json(lista_predics);
  } catch (error) {
    console.error("Error al obtener al cartas:", error);
    res.status(500).json({ error: 'Error al obtener las cartas' });
  }
});

app.post('/api/crear', async (req, res) => {
  try {
    const { predicciones } = await connectToMongoDB();

    // Obtenemos los datos del body
    const nuevaPredict = req.body;

    
    if (!nuevaPredict || Object.keys(nuevaPredict).length === 0) {
      return res.status(400).json({ error: 'No se recibieron datos para guardar' });
    }

    // Insertar en la colección
    const resultado = await predicciones.insertOne(nuevaPredict);

    res.status(201).json({
      mensaje: 'Predicción guardada correctamente',
      id: resultado.insertedId
    });
  } catch (error) {
    console.error("Error al crear la predicción:", error);
    res.status(500).json({ error: 'Error al guardar la predicción' });
  }
});
//a


app.delete('/api/borrar', async (req, res) => {
   const { predicciones } = await connectToMongoDB();

    const { id } = req.body; 


    // ver si mandamos el id
    if (!id) {  
        return res.status(400).json({ mensaje: 'No se proporcionó ID' });
    }

    try {
        const predictBorrada = await predicciones.findByIdAndDelete(id);

        if (!predictBorrada) {
            return res.status(404).json({ mensaje: 'Carta no encontrada' });
        }

        res.json({ mensaje: 'Carta borrada correctamente', carta: cartaBorrada });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al borrar la carta' });
    }
});







module.exports = app;