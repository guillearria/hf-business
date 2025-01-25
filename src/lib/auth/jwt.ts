import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_REFRESH_SECRET } from '$env/static/private';
import type { IUser } from '$lib/models/User';

interface TokenPayload {
	userId: string;
	email: string;
	role: string;
}

// Generate access token (short-lived)
export function generateAccessToken(user: IUser): string {
	const payload: TokenPayload = {
		userId: user._id.toString(),
		email: user.email,
		role: user.role
	};
	
	return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

// Generate refresh token (long-lived)
export function generateRefreshToken(user: IUser): string {
	const payload: TokenPayload = {
		userId: user._id.toString(),
		email: user.email,
		role: user.role
	};
	
	return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

// Verify access token
export function verifyAccessToken(token: string): TokenPayload {
	return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

// Verify refresh token
export function verifyRefreshToken(token: string): TokenPayload {
	return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
}

// Extract token from Authorization header
export function extractTokenFromHeader(authHeader: string | null): string | null {
	if (!authHeader?.startsWith('Bearer ')) {
		return null;
	}
	
	return authHeader.substring(7);
} 