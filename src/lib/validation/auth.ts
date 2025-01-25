import { z } from 'zod';

// Registration schema
export const registerSchema = z.object({
	email: z
		.string()
		.email('Invalid email format')
		.min(5, 'Email must be at least 5 characters')
		.max(64, 'Email must not exceed 64 characters'),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters')
		.max(64, 'Password must not exceed 64 characters')
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/,
			'Password must contain at least one uppercase letter, one lowercase letter, and one number'
		),
	firstName: z
		.string()
		.min(2, 'First name must be at least 2 characters')
		.max(32, 'First name must not exceed 32 characters')
		.regex(/^[a-zA-Z\s-']+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
	lastName: z
		.string()
		.min(2, 'Last name must be at least 2 characters')
		.max(32, 'Last name must not exceed 32 characters')
		.regex(/^[a-zA-Z\s-']+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes')
});

// Login schema
export const loginSchema = z.object({
	email: z.string().email('Invalid email format'),
	password: z.string().min(1, 'Password is required')
});

// Refresh token schema
export const refreshSchema = z.object({
	refreshToken: z.string().min(1, 'Refresh token is required')
});

// Helper function to validate data
export async function validateData<T>(schema: z.Schema<T>, data: unknown): Promise<z.infer<T>> {
	try {
		return await schema.parseAsync(data);
	} catch (error) {
		if (error instanceof z.ZodError) {
			// Combine all error messages
			const messages = error.errors.map((err) => err.message).join(', ');
			throw new Error(messages);
		}
		throw error;
	}
} 