import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { User } from '$lib/models/User';
import { generateAccessToken, generateRefreshToken } from '$lib/auth/jwt';
import { registerSchema, validateData } from '$lib/validation/auth';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		
		// Validate input data
		const validatedData = await validateData(registerSchema, data);
		
		// Check if user already exists
		const existingUser = await User.findOne({ email: validatedData.email });
		if (existingUser) {
			return new Response('User already exists', { status: 409 });
		}
		
		// Create new user
		const user = new User({
			email: validatedData.email,
			password: validatedData.password,
			firstName: validatedData.firstName,
			lastName: validatedData.lastName
		});
		
		await user.save();
		
		// Generate tokens
		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user);
		
		// Store refresh token
		user.refreshTokens = [refreshToken];
		await user.save();
		
		// Return tokens
		return json({
			accessToken,
			refreshToken,
			user: {
				id: user._id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				role: user.role
			}
		}, { status: 201 });
	} catch (error) {
		console.error('Registration error:', error);
		
		// Return validation errors
		if (error instanceof Error) {
			return new Response(error.message, { status: 400 });
		}
		
		return new Response('Internal Server Error', { status: 500 });
	}
}; 