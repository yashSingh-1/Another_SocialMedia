import AccountProfile from "@/components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const Onboarding = async () => {
  const user = await currentUser(); // import from clerk
  const userInfo = {} //Fetch from the prisma db
  const userData = {
    id: user?.id,
    objectId: userInfo?._id,
    username: userInfo.username || user?.username,
    name: userInfo?.name || user?.firstName || "",
    bio: userInfo?.bio || "",
    image: userInfo?.image || user?.imageUrl,


  }
  return (
    <main
      className="mx-auto flex max-w-3xl flex-col
        justify-start px-10 py-20">
      <div className="head-text">Onboarding</div>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile to use Threads.
      </p>
      <section className="mt-9 bg-dark-2 p-10 text-white">
        <AccountProfile user={userData} btnTitle="Continue"/>
      </section>
    </main>
  );
};

export default Onboarding;
