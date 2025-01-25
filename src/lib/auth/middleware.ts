import type { RequestEvent } from '@sveltejs/kit';
import { extractTokenFromHeader, verifyAccessToken } from './jwt';

export async function requireAuth(event: RequestEvent) {
	try {
		const authHeader = event.request.headers.get('Authorization');
		const token = extractTokenFromHeader(authHeader);
		
		if (!token) {
			return new Response('Unauthorized - No token provided', { status: 401 });
		}
		
		const payload = verifyAccessToken(token);
		
		// Add user info to event.locals
		event.locals.user = {
			id: payload.userId,
			email: payload.email,
			role: payload.role
		};
		
		return null; // Authentication successful
	} catch (error) {
		if (error instanceof Error && error.name === 'TokenExpiredError') {
			return new Response('Unauthorized - Token expired', { status: 401 });
		}
		return new Response('Unauthorized - Invalid token', { status: 401 });
	}
}

export async function requireAdmin(event: RequestEvent) {
	const authResponse = await requireAuth(event);
	if (authResponse) return authResponse;
	
	if (event.locals.user.role !== 'admin') {
		return new Response('Forbidden - Admin access required', { status: 403 });
	}
	
	return null; // Authorization successful
} 