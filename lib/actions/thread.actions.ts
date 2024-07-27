"use server"

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.models";
import { connectToDB } from "../mongoose"

interface Params {
    text: string,
    author: string,
    communityId: string | null,
    path: string
}

export async function createThread({
    text, author, communityId, path
}: Params) {
    try {
        connectToDB();
    const createdThread = await Thread.create({
        text,
        author,
        community: null
    });

    // Update the user by pushing his thread to the User table 
    // and attaching thsat thread id to the User id
    await User.findByIdAndUpdate(author, {
        $push: {
            threads: createdThread._id
        }
    })

    revalidatePath(path);
    } catch (error: any) {
        throw new Error(`Error creating thread: ${error.message}`)
    }
}

export async function fetchPosts({
    pageNumber = 1,
    pageSize = 20
}){
    connectToDB();

    // Calculate the number of posts to skip
    const skipAmount = (pageNumber  - 1) * pageSize;

    // Fetch the posts that have no parents..meaning they
    // are common (we have to find top level threads)
    const postsQuery = Thread.find({
        parentId: {
            $in: [null, undefined]
        }
    }).sort({createdAt: 'desc'}).skip(skipAmount).limit(pageSize)
    .populate({ path: 'author', model: User })
    .populate({
        path: 'children' ,
        populate: {
            path: 'author',
            model: User,
            select: "_id name parentId image"
        }
    })

    const totalPostsCount = await Thread.countDocuments({
        parentId: {
            $in: [null, undefined]
        }
    })

    const posts = await postsQuery.exec();

    const isNext = totalPostsCount > skipAmount + posts.length;

    return { posts, isNext }
}

export async function fetchThreadById(id: string){
    connectToDB();

    try {
        // Populate community
        const thread = await Thread.findById(id)
            .populate({
                path:  'author',
                model: User,
                select: "_id id name image"
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: "_id id name parentId image"
                    },
                    {
                        path: 'children',
                        model: 'Thread',
                        populate: {
                            path: 'author',
                            model: User,
                            select: "_id id name parentId image"
                        }
                    }
                ]
            }).exec();
            return thread;
    } catch (error: any) {
        throw new Error(`Error fetching Thread ${error.message}`)
    }
}

export async function addCommentToThread(
    threadId: string,
    commentText: string,
    userId: string,
    path: string
){
    connectToDB();

    try {
        // adding a comment to a thread
        const originalThread = await Thread.findById(threadId);
        if(!originalThread) {
            throw new Error(`Thread not found`)
        }

        // If everything is fine then move on to 
        //creating a new comment formed thread
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId
        })

        //Save the new thread
        const savedCommentThread = await commentThread.save()

        // A way of checking the bug cuz i was getting undefined when originalThread.children was called so i had to fix the thread model
        // console.log("Here is the original thread", originalThread.children);
        // console.log("Here is the original savedComme", savedCommentThread);

        // Now we gotta update the original thread to include the new comment
        originalThread.children.push(savedCommentThread._id)

        // Save the original thread
        await originalThread.save();

        revalidatePath(path);
    } catch (error: any) {
        console.log("Error adding comment: ", error)
        throw new Error(`Error adding comment to thread: ${error.message}`)
    }
}