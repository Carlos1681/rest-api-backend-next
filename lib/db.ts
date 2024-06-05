import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL;

const connect = async () => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("Já Conectado");
    return;
  }
  if (connectionState === 2) {
    console.log("Conectando...");
    return;
  }
  try {
    mongoose.connect(MONGO_URL!, {
      dbName: "nextrestapi",
      bufferCommands: true,
    });
    console.log("Conectado!");
  } catch (error: any) {
    console.log("Erro ao conectar", error);
    throw new Error("Erro", error);
  }
};

export default connect;
