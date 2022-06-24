import { Schema } from 'mongoose';

export type TQuestion = {
    question: Schema.Types.ObjectId
    response?: String,
}