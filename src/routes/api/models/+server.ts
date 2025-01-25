import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Temporary mock data until we integrate with Hugging Face API
const mockModels = [
	{
		id: 1,
		name: 'GPT-2',
		description: 'A language model for text generation'
	},
	{
		id: 2,
		name: 'BERT',
		description: 'Bidirectional Encoder Representations from Transformers'
	},
	{
		id: 3,
		name: 'Stable Diffusion',
		description: 'A text-to-image generation model'
	}
];

export const GET: RequestHandler = async () => {
	// TODO: Integrate with Hugging Face API
	return json(mockModels);
}; 