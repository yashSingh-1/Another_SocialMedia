import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

const page = async () => {
    const user = await currentUser();

    if(!user){
        return null;
    }

    const userInfo = await fetchUser(user.id)
    console.log(userInfo)

    if(!userInfo.onboarded) redirect('/onboarding');

  return (
    <>
    <div className="head-text">
        Create Thread
    </div>
    <PostThread userId={userInfo._id}/>
    </>
  )
}

export default page