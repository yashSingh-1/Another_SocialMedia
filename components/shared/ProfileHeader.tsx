import Image from "next/image";

interface Props {
  accountId: string;
  authorUserId: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
}

const ProfileHeader = ({
  accountId,
  authorUserId,
  name,
  username,
  imgUrl,
  bio,
}: Props) => {
  return <div className="flex flex-col justify-start w-full">
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="relative h-20 w-20 object-cover">
                <Image 
                    src={imgUrl}
                    alt="Profile image"
                    fill
                    className="rounded-full object-cover shadow-2xl"
                />
            </div>
            <div className="flex-1">
                <h2 className="text-left text-heading2-bold text-light-1">
                    {name}
                </h2>
                <p className="text-base-medium text-gray-1">
                    @{username}
                </p>
            </div>
        </div>
    </div>
    /** To do community */
        <p className="mt-6 max-w-lg text-base-regular text-light-2">
            {bio}
        </p>
        <div className="mt-12 h-0.5 w-full bg-slate-900"/>
  </div>;
};

export default ProfileHeader;
