// Se encarga solamente de conectarse a MongoDB
import mongoose from 'mongoose';

export async function connectDatabase(uri: string): Promise<void> {
  await mongoose.connect(uri);
  console.log('MongoDB conectado');
}
