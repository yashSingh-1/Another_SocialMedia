"use server"

import mongoose from 'mongoose'

let isConnected = false;

export const connectToDB = async () => {
    mongoose.set(
        'strictQuery', true
    )

    if(!process.env.MONGODB_URL) {
        return console.log("Mongo db url not found")
    }

    if(isConnected) return console.log("Already connected")

    try {
        await mongoose.connect(process.env.MONGODB_URL)
        isConnected = true;
        console.log("Connected to mongo db")

    } catch (error) {
        console.log("Error", error)
    }
}