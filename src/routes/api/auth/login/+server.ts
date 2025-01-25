import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { User } from '$lib/models/User';
import { generateAccessToken, generateRefreshToken } from '$lib/auth/jwt';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { email, password } = await request.json();
		
		// Find user
		const user = await User.findOne({ email });
		if (!user) {
			return new Response('Invalid credentials', { status: 401 });
		}
		
		// Verify password
		const isValidPassword = await user.comparePassword(password);
		if (!isValidPassword) {
			return new Response('Invalid credentials', { status: 401 });
		}
		
		// Generate tokens
		const accessToken = generateAccessToken(user);
		const refreshToken = generateRefreshToken(user);
		
		// Store refresh token
		user.refreshTokens = user.refreshTokens || [];
		user.refreshTokens.push(refreshToken);
		
		// Keep only the last 5 refresh tokens
		if (user.refreshTokens.length > 5) {
			user.refreshTokens = user.refreshTokens.slice(-5);
		}
		
		await user.save();
		
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
		});
	} catch (error) {
		console.error('Login error:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
}; 