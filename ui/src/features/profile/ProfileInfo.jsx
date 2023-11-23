import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import { useCurrentUser } from "../authentication/useCurrentUser";
import { useUpdateProfile } from "./useUpdateProfile";

function ProfileInfo() {
  const [username, setUsername] = useState("");
  const { user, isLoading } = useCurrentUser();
  const { isLoading: isUpdating, profileUpdate } = useUpdateProfile();

  useEffect(() => {
    if (!isLoading && user) setUsername(user?.username);
  }, [isLoading, user]);

  function handleUpdate() {
    profileUpdate({ username, email: user?.email });
  }

  if (isLoading || isUpdating) return <Spinner />;

  return (
    <div className="bg-[#2b1346] text-white flex flex-col gap-2 px-10 py-6 rounded-xl border border-[#613692]">
      <h2 className="uppercase text-3xl font-extralight text-center">
        Profile
      </h2>
      <div className="self-center w-16 h-16 rounded-full bg-[#d11f9f] flex justify-center items-center">
        <img src="/slider-img.png" alt="" className="h-11" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between md:gap-2">
          <div className="flex flex-col">
            <label
              className="text-lg text-gray-400 font-extralight"
              htmlFor="username"
            >
              Alias
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-transparent py-2 rounded-lg text-lg font-extralight cursor-pointer"
            />
          </div>
          <button
            className="bg-[#2e2550] text-sm uppercase font-extralight px-4 py-2 rounded-xl"
            onClick={handleUpdate}
            disabled={isUpdating}
          >
            Edit
          </button>
        </div>

        <div className="flex flex-col">
          <span className="text-lg text-gray-400 font-extralight">Email</span>
          <strong className="text-lg font-extralight">{user?.email}</strong>
        </div>

        <div className="flex flex-col w-full">
          <span className="text-lg text-gray-400 font-extralight">Rank</span>
          <div className="flex items-start gap-8">
            <strong className="text-lg font-extralight inline-block w-[20%]">
              VIP 4
            </strong>
            <div className="w-full">
              <div className="bg-[#512582] h-5 rounded-xl relative">
                <span className="absolute top-0 left-0 w-[50%] h-full bg-[#9755e2] rounded-xl" />
              </div>
              <div className="flex items-center justify-between">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileInfo;
