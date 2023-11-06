import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import { useCurrentUser } from "../authentication/useCurrentUser";

function ProfileInfo() {
  const [username, setUsername] = useState("");
  const { user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && user) setUsername(user?.username);
  }, [isLoading, user]);

  if (isLoading) return <Spinner />;

  return (
    <div className="bg-[#2b1346] text-white flex flex-col  items-center gap-2 p-6 rounded-xl">
      <h2 className="uppercase text-3xl font-semibold">Profile</h2>
      <div className="w-16 h-16 rounded-full bg-[#d11f9f] flex justify-center items-center">
        <img src="/slider-img.png" alt="" className="h-11" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <label
              className="text-lg text-gray-400 font-semibold"
              htmlFor="username"
            >
              Alias
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-transparent py-2 rounded-lg text-lg font-semibold"
            />
          </div>
          <button className="bg-[#2e2550] text-sm uppercase font-semibold px-4 py-2 rounded-xl">
            Edit
          </button>
        </div>

        <div className="flex flex-col">
          <span className="text-lg text-gray-400 font-semibold">Email</span>
          <strong className="text-lg font-semibold">pacopower@gmail.com</strong>
        </div>
      </div>
    </div>
  );
}

export default ProfileInfo;
