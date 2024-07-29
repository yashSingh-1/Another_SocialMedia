import CommunityCard from "@/components/cards/CommunityCard";
import UserCard from "@/components/cards/UserCard";
import { fetchCommunities } from "@/lib/actions/community.actions";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  // If viewving somebody else's id
  const userInfo = await fetchUser(user.id);

  if (!userInfo.onboarded) redirect("/onboarding");

  //We'll have to fetch all the communities! for searching 
  // or we have to make a function that searches the db directly
  // without fetching all the communities
  const result = await fetchCommunities({
    searchString : '',
    pageNumber: 1,
    pageSize: 20
  })

  return (
    <section>
      <h1 className="head-text mb-10 ">Search</h1>

      {/* { Search bar } */}

      <div className="mt-14 flex flex-col gap-9 ">
        {
          result.communities.length === 0 ? (
            <p className="no-result">No users</p>
          ) : (
            <>
              { 
                result.communities.map((community) => (
                  <CommunityCard 
                    key={community.id}
                    id={community.id}
                    name={community.name}
                    username={community.username}
                    imgUrl={community.image}
                     bio={community.bio}
                      members={community.members}                  />
                ))
              }
            </>
          )
        }

      </div>
    </section>
  );
};

export default page;
