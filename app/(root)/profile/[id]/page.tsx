import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

const page = async ({params}: {params: {id: string}}) => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  // If viewving somebody else's id
  const userInfo = await fetchUser(params.id);

  if (!userInfo.onboarded) redirect("/onboarding");
  return <section>
    <ProfileHeader 
        accountId={userInfo.id} // Account u are looking at
        authorUserId={user.id} // Logged in user id
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
    />

    <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
            <TabsList className="tab">
                {
                    profileTabs.map((tab) => (
                        <TabsTrigger className="tab"
                        key={tab.label} value={tab.value}>
                            <Image 
                                src={tab.icon}
                                width={24}
                                height={24}
                                alt={tab.label}
                                className="object-contain"
                            />
                            <p className="max-sm:hidden">
                                {tab.label}
                            </p>
                            {
                               tab.label === 'Threads' ? 
                               <p className="ml-1 rounded-sm bg-light-4 px-2 py-1
                                    !text-tiny-medium text-light-2">
                                        {userInfo?.threads?.length}
                               </p> : null
                            }
                        </TabsTrigger>
                    ))
                }
            </TabsList>
            {
                profileTabs.map((tab) => (
                    <TabsContent key={`content-${tab.label}`} value={tab.value}>
                        <ThreadsTab 
                            currentUserId={user.id}
                            accountId={userInfo.id}
                            accountType="User"
                        />
                    </TabsContent>
                ))
            }
        </Tabs>

    </div>
  </section>;
};

export default page;
