"use client"

import { CommentValidation } from "@/lib/validations/thread";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/thread.actions";
import { usePathname } from "next/navigation";


interface Props {
  threadId: string;
  currentUserImage: string;
  currentUserId: string;
}

const Comment = ({ threadId, currentUserImage, currentUserId }: Props) => {

    const pathname = usePathname();

    const form = useForm<z.infer<typeof CommentValidation>>({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
          thread: ''
        },
      });

    async function onSubmit(values: z.infer<typeof CommentValidation>) {
        await addCommentToThread(
            threadId,
            values.thread,
            JSON.parse(currentUserId),
            pathname
        )

        form.reset();
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}
       className=" comment-form">
         <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className='flex gap-3 w-full items-center'>
              <FormLabel >
                <Image 
                    src={currentUserImage}
                    alt="Current User"
                    width={48}
                    height={48}
                    className="rounded-full object-cover "
                />
              </FormLabel>
              <FormControl  className="border-none bg-transparent">
                <Input 
                type="text"
                  className='text-light-1 outline-none border-2 border-white no-focus '
                  {...field}
                  placeholder='comment...!'
                />

              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="comment-form_btn">
            Reply
        </Button>
       </form>
    </Form>
  )
};

export default Comment;
