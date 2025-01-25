import mongoose from 'mongoose';

export interface IModel {
	name: string;
	description: string;
	task: string;
	huggingFaceId: string;
	metrics?: {
		[key: string]: number;
	};
	createdAt: Date;
	updatedAt: Date;
}

const modelSchema = new mongoose.Schema<IModel>(
	{
		name: {
			type: String,
			required: true,
			unique: true
		},
		description: {
			type: String,
			required: true
		},
		task: {
			type: String,
			required: true
		},
		huggingFaceId: {
			type: String,
			required: true,
			unique: true
		},
		metrics: {
			type: Map,
			of: Number
		}
	},
	{
		timestamps: true
	}
);

// Create indexes
modelSchema.index({ name: 'text', description: 'text' });

// Only create the model if it doesn't exist (prevents model overwrite warning)
export const Model = mongoose.models.Model || mongoose.model<IModel>('Model', modelSchema); 