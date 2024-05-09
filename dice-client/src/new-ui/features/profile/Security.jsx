import Toggle2Factor from "../../components/Toggle2Factor";

function Security() {
  return (
    <div className="w-full bg-[#1e1c3a] dark:bg-[#31294c] text-white flex flex-col gap-6 px-6 tablet:px-10 py-6 rounded-xl">
      <span>2-FACTOR AUTHENTICATION</span>
      <div className="flex items-center gap-3">
        <span>2FA</span>
        <Toggle2Factor onSwitch={(state) => console.log(state)} />
        <span>Disabled</span>
      </div>

      <span>
        2-Factor Authentication is an added layer of security that will keep
        your account protected from unauthorized access.
      </span>
    </div>
  );
}

export default Security;
