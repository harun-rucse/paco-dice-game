import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useResetPassword } from "./useResetPassword";
import FormRow from "../../components/FormRow";
import { useState } from "react";

function ResetPassword() {
  const { resetToken } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;
  const { isLoading, resetPassword } = useResetPassword();

  function onSubmit({ password }) {
    resetPassword(
      { password, resetToken },
      {
        onSuccess: () => {
          reset();
          window.location = "/";
        },
      }
    );
  }

  return (
    <div className="rounded-lg w-[22rem] tablet:min-w-[47rem] tablet:min-h-[36rem] tablet:overflow-hidden flex flex-col tablet:flex-row items-start tablet:h-full overflow-y-scroll">
      <div className="w-full tablet:w-[24rem] tablet:h-[40rem] bg-[#24224a] dark:bg-[#241c38] space-y-3 px-6 py-8"></div>

      <div className="w-full h-[30rem] tablet:h-[40rem] bg-[#1b193e] dark:bg-[#161430] border border-[#24224a] px-6 py-8 space-y-3">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-lg tablet:text-3xl uppercase text-center font-extralight text-white">
            Reset Your Password
          </h2>
          <img src="/lock.png" alt="" className="h-6 tablet:h-8 object-cover" />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 tablet:pt-5"
        >
          <FormRow
            name="password"
            label="Password"
            error={errors?.password?.message}
          >
            <div className="self-stretch flex items-center justify-between relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="New Password"
                className="w-full bg-transparent focus:outline-none placeholder:uppercase placeholder:text-sm font-extralight px-4 py-3 rounded-lg border border-gray-600"
                disabled={isLoading}
                {...register("password", {
                  required: "Password is required",
                })}
              />
              <div
                className="absolute top-3 tablet:top-4 right-4"
                onClick={() => setShowPassword((state) => !state)}
              >
                {showPassword ? (
                  <FaEyeSlash
                    size={18}
                    color="#504d8d"
                    className="cursor-pointer"
                  />
                ) : (
                  <FaEye size={18} color="#504d8d" className="cursor-pointer" />
                )}
              </div>
            </div>
          </FormRow>

          <button
            className="self-center bg-[#413e72] dark:bg-[#4e3270] border border-[#605e96] text-white uppercase text-sm font-extralight px-8 py-3 rounded-lg shadow-[0px_4px_4px_0px_#00000040]"
            disabled={isLoading}
          >
            Reset now
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
