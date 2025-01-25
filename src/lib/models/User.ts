import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	role: 'user' | 'admin';
	refreshTokens: string[];
	createdAt: Date;
	updatedAt: Date;
	comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true
		},
		password: {
			type: String,
			required: true,
			minlength: 8
		},
		firstName: {
			type: String,
			required: true,
			trim: true
		},
		lastName: {
			type: String,
			required: true,
			trim: true
		},
		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user'
		},
		refreshTokens: [{
			type: String
		}]
	},
	{
		timestamps: true
	}
);

// Hash password before saving
userSchema.pre('save', async function (next) {
	if (this.isModified('password')) {
		this.password = await bcrypt.hash(this.password, 12);
	}
	next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
	return bcrypt.compare(candidatePassword, this.password);
};

// Create indexes
userSchema.index({ email: 1 });

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema); 