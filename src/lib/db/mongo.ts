import mongoose from 'mongoose';
import { MONGODB_URI } from '$env/static/private';

let mongoConnection: typeof mongoose | null = null;

export async function connectToMongo() {
	try {
		if (!mongoConnection) {
			console.log('Connecting to MongoDB...');
			
			// Configure mongoose
			mongoose.set('strictQuery', true);
			
			// Connect to MongoDB
			await mongoose.connect(MONGODB_URI);
			mongoConnection = mongoose;
			
			console.log('MongoDB connected successfully');
			
			// Handle connection events
			mongoose.connection.on('error', (err) => {
				console.error('MongoDB connection error:', err);
			});
			
			mongoose.connection.on('disconnected', () => {
				console.warn('MongoDB disconnected');
				mongoConnection = null;
			});
		}
		
		return mongoConnection;
	} catch (error) {
		console.error('Failed to connect to MongoDB:', error);
		throw error;
	}
}

export function getMongoConnection() {
	return mongoConnection;
} 