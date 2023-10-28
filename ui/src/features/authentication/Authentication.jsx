import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

function Authentication() {
  const [current, setCurrent] = useState("login");

  return (
    <div className="flex flex-col md:flex-row items-start">
      <div className="w-full md:w-[24rem] md:h-[36rem] bg-[#411b6a] space-y-3 px-6 py-8">
        <div
          onClick={() => setCurrent("login")}
          className="bg-[#1f5cb8] text-sm px-8 py-3 cursor-pointer rounded-lg uppercase font-bold text-white shadow-[0px_4px_4px_0px_#00000040]"
        >
          Login
        </div>
        <div
          onClick={() => setCurrent("register")}
          className="bg-[#6c1fb8] text-sm px-8 py-3 cursor-pointer rounded-lg uppercase font-bold text-white shadow-[0px_4px_4px_0px_#00000040]"
        >
          Register
        </div>
      </div>

      <div className="w-full bg-[#2b1346] px-6 py-8 space-y-3">
        {current === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}

export default Authentication;
