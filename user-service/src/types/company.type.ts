import { Schema } from 'mongoose';

export type TSocialProfile = {
    linkedin?: String;
    facebook?: String;
    website?: String;
    twitter?: String;
};
export type TGeneralInfo = {
    founded?: String;
    industry?: String;
    company_size?: String;
}

export type THeadQuarter = {
    country: Schema.Types.ObjectId
    city?: String;
    street?: String
}