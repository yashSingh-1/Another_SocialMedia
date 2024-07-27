"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { Textarea } from "../ui/textarea";
// import { updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";
import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";

interface Props {
  user: {
    id: string | undefined;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

const PostThread = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<z.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: '',
      accountId: userId
    },
  });

  async function onSubmit(values: z.infer<typeof ThreadValidation>){
    await createThread({
        text: values.thread,
        author: userId,
        communityId: null,
        path: pathname
    });
    router.push("/")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}
       className="space-y-8 flex flex-col justify-start gap-6 mt-10">
         <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className='flex gap-3 w-full flex-col'>
              <FormLabel className='text-base-semibold text-light-2 flex justify-start'>
                Content
              </FormLabel>
              <FormControl  className="no-focus border-1 border-dark-2 bg-dark-3 text-light-1">
                <Textarea 
                rows={5}
                  className='account-form_input no-focus '
                  {...field}
                  placeholder='Enter you post!'
                />

              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500 text-white">
            Post Thread
        </Button>
       </form>
    </Form>
  )
};

export default PostThread;
