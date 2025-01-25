import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { User } from '$lib/models/User';
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from '$lib/auth/jwt';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { refreshToken } = await request.json();
		
		if (!refreshToken) {
			return new Response('Refresh token required', { status: 400 });
		}
		
		// Verify refresh token
		const payload = verifyRefreshToken(refreshToken);
		
		// Find user and check if refresh token exists
		const user = await User.findById(payload.userId);
		if (!user || !user.refreshTokens.includes(refreshToken)) {
			return new Response('Invalid refresh token', { status: 401 });
		}
		
		// Generate new tokens
		const newAccessToken = generateAccessToken(user);
		const newRefreshToken = generateRefreshToken(user);
		
		// Remove old refresh token and add new one
		user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
		user.refreshTokens.push(newRefreshToken);
		
		// Keep only the last 5 refresh tokens
		if (user.refreshTokens.length > 5) {
			user.refreshTokens = user.refreshTokens.slice(-5);
		}
		
		await user.save();
		
		return json({
			accessToken: newAccessToken,
			refreshToken: newRefreshToken
		});
	} catch (error) {
		console.error('Token refresh error:', error);
		
		if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
			return new Response('Invalid refresh token', { status: 401 });
		}
		
		return new Response('Internal Server Error', { status: 500 });
	}
}; 