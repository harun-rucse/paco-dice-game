import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

function Authentication() {
  const [current, setCurrent] = useState("login");

  return (
    <div className="flex flex-col md:flex-row items-start h-[80vh] md:h-full overflow-y-scroll">
      <div className="w-full md:w-[24rem] md:h-[40rem] bg-[#411b6a] space-y-3 px-6 py-8"></div>

      <div className="w-full bg-[#2b1346] px-6 py-8 space-y-3">
        {current === "login" && <LoginForm setCurrent={setCurrent} />}
        {current === "register" && <RegisterForm setCurrent={setCurrent} />}
        {current === "forgot" && <ForgotPasswordForm setCurrent={setCurrent} />}
      </div>
    </div>
  );
}

export default Authentication;
