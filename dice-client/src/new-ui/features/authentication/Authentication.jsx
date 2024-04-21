import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

function Authentication() {
  const [current, setCurrent] = useState("login");

  return (
    <div className="flex flex-col tablet:flex-row items-start h-[80vh] tablet:h-[60vh] laptop:h-[80vh] desktop:h-[75vh] overflow-y-auto">
      <div className="w-full tablet:w-[24rem] h-[4rem] tablet:h-full bg-[#24224a] space-y-3 px-6 py-8"></div>

      <div className="w-full h-full bg-[#1c1a3e] px-6 py-3 tablet:py-8 space-y-3 pb-10 tablet:pb-0">
        {current === "login" && <LoginForm setCurrent={setCurrent} />}
        {current === "register" && <RegisterForm setCurrent={setCurrent} />}
        {current === "forgot" && <ForgotPasswordForm setCurrent={setCurrent} />}
      </div>
    </div>
  );
}

export default Authentication;
