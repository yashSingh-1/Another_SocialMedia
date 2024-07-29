import UserCard from "@/components/cards/UserCard";
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

  //We'll have to fetch all the users! for searching 
  // or we have to make a function that searches the db directly
  // without fetching all the users
  const result = await fetchUsers({
    userId: user.id,
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
          result.users.length === 0 ? (
            <p className="no-result">No users</p>
          ) : (
            <>
              { 
                result.users.map((person) => (
                  <UserCard 
                    key={person.id}
                    id={person.id}
                    name={person.name}
                    username={person.username}
                    imgUrl={person.image}
                    personType='User'
                  />
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
