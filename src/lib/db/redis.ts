import { createClient, type RedisClientType } from 'redis';
import { REDIS_URL } from '$env/static/private';

let redisClient: RedisClientType | null = null;

export async function connectToRedis() {
	try {
		if (!redisClient) {
			console.log('Connecting to Redis...');
			
			// Create Redis client
			redisClient = createClient({
				url: REDIS_URL
			});
			
			// Handle connection events
			redisClient.on('error', (err) => {
				console.error('Redis Client Error:', err);
				redisClient = null;
			});
			
			redisClient.on('connect', () => {
				console.log('Redis connected successfully');
			});
			
			redisClient.on('disconnect', () => {
				console.warn('Redis disconnected');
				redisClient = null;
			});
			
			// Connect to Redis
			await redisClient.connect();
		}
		
		return redisClient;
	} catch (error) {
		console.error('Failed to connect to Redis:', error);
		throw error;
	}
}

export function getRedisConnection() {
	return redisClient;
}

export async function closeRedisConnection() {
	if (redisClient) {
		await redisClient.quit();
		redisClient = null;
	}
} 