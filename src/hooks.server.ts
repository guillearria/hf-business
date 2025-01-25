import { connectToMongo } from '$lib/db/mongo';
import { connectToRedis } from '$lib/db/redis';
import type { Handle } from '@sveltejs/kit';

// Initialize database connections
async function initializeDatabases() {
	try {
		// Connect to MongoDB
		await connectToMongo();
		
		// Connect to Redis
		await connectToRedis();
	} catch (error) {
		console.error('Failed to initialize databases:', error);
		throw error;
	}
}

// Initialize databases when server starts
initializeDatabases();

// Handle all requests
export const handle: Handle = async ({ event, resolve }) => {
	// Add database connections to event.locals if needed
	// event.locals.mongo = getMongoConnection();
	// event.locals.redis = getRedisConnection();
	
	const response = await resolve(event);
	return response;
}; 