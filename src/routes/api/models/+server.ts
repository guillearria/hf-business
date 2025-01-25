import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { Model } from '$lib/models/Model';
import { getRedisConnection } from '$lib/db/redis';

const CACHE_KEY = 'models:all';
const CACHE_TTL = 60 * 5; // 5 minutes

export const GET: RequestHandler = async () => {
	try {
		// Try to get from cache first
		const redis = await getRedisConnection();
		if (redis) {
			const cachedModels = await redis.get(CACHE_KEY);
			if (cachedModels) {
				return json(JSON.parse(cachedModels));
			}
		}

		// If not in cache, get from database
		const models = await Model.find().sort({ createdAt: -1 }).limit(20);

		// Cache the results
		if (redis) {
			await redis.setEx(CACHE_KEY, CACHE_TTL, JSON.stringify(models));
		}

		return json(models);
	} catch (error) {
		console.error('Error fetching models:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const modelData = await request.json();
		
		// Create new model
		const model = new Model(modelData);
		await model.save();
		
		// Invalidate cache
		const redis = await getRedisConnection();
		if (redis) {
			await redis.del(CACHE_KEY);
		}
		
		return json(model, { status: 201 });
	} catch (error) {
		console.error('Error creating model:', error);
		
		if (error instanceof Error && error.message.includes('duplicate key')) {
			return new Response('Model already exists', { status: 409 });
		}
		
		return new Response('Internal Server Error', { status: 500 });
	}
}; 