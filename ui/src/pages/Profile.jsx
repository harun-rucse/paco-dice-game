import ChangePassword from "../features/profile/ChangePassword";
import ProfileInfo from "../features/profile/ProfileInfo";

function Profile() {
  return (
    <div className="flex flex-col md:flex-row md:items-start gap-10 mb-16 md:mb-0">
      <ProfileInfo />
      <ChangePassword />
    </div>
  );
}

export default Profile;
