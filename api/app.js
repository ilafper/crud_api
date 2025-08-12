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
    const db = client.db('minecraft');
    return {
      cartas: db.collection('cartas'),
      inventario: db.collection('inventario')
      
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


app.get('/api/productos', async (req, res) => {
  try {
    const { cartas } = await connectToMongoDB();
    const lista_cartas = await cartas.find().toArray();
    console.log("cartitas:", lista_cartas);
    res.json(lista_cartas);
  } catch (error) {
    console.error("Error al obtener al cartas:", error);
    res.status(500).json({ error: 'Error al obtener las cartas' });
  }
});


app.get('/api/', async (req, res) => {
  try {
    const { inventario } = await connectToMongoDB();
    const lista_inve = await inventario.find().toArray();
    console.log("inventarioGET:", lista_inve);
    res.json(lista_inve);
  } catch (error) {
    console.error("Error al obtener INVENTARIOGET:", error);
    res.status(500).json({ error: 'Error al obtener EL INVENTARIOGET' });
  }
});






module.exports = app;