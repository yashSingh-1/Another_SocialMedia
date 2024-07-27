"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.models";
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model";
import { FilterQuery, model, SortOrder } from "mongoose";

interface Params {
    userId: string,
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string
}

export async function updateUser({
    userId,
    username,
    name,
    bio,
    image,
    path
}: Params
): Promise<void> {
    connectToDB();

   try {
    await User.findOneAndUpdate(
        {id: userId},
        { username: username.toLowerCase(),
            name,
            bio,
            image,
            onboarded: true
        },
        { upsert: true }
    )

    if(path === '/profile/edit') {
        revalidatePath(path)
    }
   } catch (error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`)
   }
}

export async function fetchUser (userId: string) {
    try {
        connectToDB();

        return await User.findOne({
            id: userId
        })
        // .populate({
        //     path: 'communities',
        //     model: Community
        // })
    } catch (error: any) {
        throw new Error(`Failed to fetch user: ${error.message}`)
    }

}

// For user profile page
export async function fetchUserPosts(userId: string){
    try {
        connectToDB()

        // Find all threads authored by user with the given user id

        // todo : Populate community

        const threads = await User.findOne({id: userId})
            .populate({
                path: 'threads',
                model: Thread,
                populate: {
                    path: 'children',
                    model: Thread,
                    populate: {
                        path: 'author',
                        model: User,
                        select: 'name image id'
                    }
                }
            })

            return threads

    } catch (error: any) {
        throw new Error(`Failed to fetch user Posts: ${error.message}`)
    }
}

// For search
export async function fetchUsers({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc"
}: {
    userId: string,
    searchString? : string,
    pageNumber?: number,
    pageSize?: number,
    sortBy?: SortOrder 
}){
    try {
        connectToDB();
        
        // Preparing for the skipping
        const skipAmount = (pageNumber - 1) * pageSize ;

        const regex=  new RegExp(searchString, "i")

        // Fetching
        const query: FilterQuery<typeof User> = {
            id: { $ne: userId }
        }

        // Searching
        if(searchString.trim() !== ""){
            query.$or = [
                { username: { $regex: regex }},
                { name: { $regex: regex }}
            ]
        }

        // Sorting
        const sortOptions = { createdAt: sortBy }

        // Passing the query
        const usersQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize)

        // Total Users: To know the total num
        //  of pages for the users
        const totalUserCount = await User.countDocuments(query);

        //Execute the query
        const users = await usersQuery.exec();

        // now we can know if there is next page?
        const isNext = totalUserCount > skipAmount + users.length;

        return {users, isNext};
    } catch (error: any) {
        throw new Error(`Failed to Search for users! ${error.message}`)
    }
}

// For activity
export async function getActivity(userId: string){
    try {
        connectToDB();

        // find all threds created by the user
        const userThreads = await Thread.find(
            {
                author: userId
            }
        )

        // Collect all the child thread ids (replies)
        // from the children field
        const childThreadIds = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.children)
        }, []) // The array specifies here is the default value of that acc array

        const replies = await Thread.find({
            _id: { $in: childThreadIds }, // Finding all the replies
            author: { $ne: userId } // excluding the replies made by the same user
        }).populate({
            path: 'author',
            model: User,
            select: 'name image _id'
        })

        return replies;

    } catch (error: any) {
        throw new Error(`Error to fetch activity: ${error.message}`)
    }
}