import ChangePassword from "../features/profile/ChangePassword";
import ProfileInfo from "../features/profile/ProfileInfo";
import Security from "../features/profile/Security";
import TransactionTable from "../features/profile/TransactionTable";

function Profile() {
  return (
    <div className="flex flex-col gap-10 px-4 tablet:px-4 laptop:px-12 desktop:px-36 py-8 pb-32 tablet:pb-52 bg-[#120e1f]">
      <div className="flex flex-col tablet:flex-row tablet:items-start gap-4 tablet:gap-2 laptop:gap-10">
        <div className="space-y-4 laptop:space-y-8">
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
