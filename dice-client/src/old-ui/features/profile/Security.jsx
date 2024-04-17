import Switch from "../../components/Switch";

function Security() {
  return (
    <div className="w-full bg-[#2b1346] text-white flex flex-col gap-6 px-10 py-6 rounded-xl border border-[#613692]">
      <span>2-FACTOR AUTHENTICATION</span>
      <div className="flex items-center gap-3">
        <span>2FA</span>
        <Switch onSwitch={(state) => console.log(state)} />
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
