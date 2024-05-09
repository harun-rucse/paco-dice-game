import ChangePassword from "../features/profile/ChangePassword";
import ProfileInfo from "../features/profile/ProfileInfo";
import Security from "../features/profile/Security";
import TransactionTable from "../features/profile/TransactionTable";

function Profile() {
  return (
    <div className="flex flex-col gap-10 mb-28">
      <div className="flex flex-col md:flex-row md:items-start gap-10">
        <div className="space-y-8">
          <ProfileInfo />
          <Security />
        </div>
        <ChangePassword />
      </div>
      <TransactionTable />
    </div>
  );
}

export default Profile;
