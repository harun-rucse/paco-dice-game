import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRegister } from "./useRegister";
import FormRow from "../../components/FormRow";
import { useState } from "react";

function RegisterForm({ setCurrent }) {
  const { referralCode } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, reset, formState, getValues } = useForm();
  const { errors } = formState;
  const { isLoading, register: handleRegister } = useRegister();

  function onSubmit({ email, password, referral }) {
    handleRegister(
      { email, password, referral },
      {
        onSuccess: () => {
          reset();
          window.location.reload();
        },
      }
    );
  }

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <h2 className="text-2xl desktop:text-3xl uppercase text-center font-extralight text-white">
          Join Now
        </h2>
        <img src="/lock.png" alt="" className="h-6 desktop:h-8 object-cover" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FormRow name="email" label="Email" error={errors?.email?.message}>
          <input
            type="email"
            id="email"
            placeholder="Email"
            className="w-full bg-transparent focus:outline-none placeholder:text-sm font-extralight px-4 py-2 tablet:py-3 rounded-lg border border-gray-600"
            disabled={isLoading}
            {...register("email", {
              required: "Email is required",
            })}
          />
        </FormRow>

        <FormRow
          name="password"
          label="Password"
          error={errors?.password?.message}
        >
          <div className="self-stretch flex items-center justify-between relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Password"
              className="w-full bg-transparent focus:outline-none placeholder:uppercase placeholder:text-sm font-extralight px-4 py-2 tablet:py-3 rounded-lg border border-gray-600"
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

        <FormRow
          name="passwordConfirm"
          label="Confirm Password"
          error={errors?.passwordConfirm?.message}
        >
          <div className="self-stretch flex items-center justify-between relative">
            <input
              type={showPassword ? "text" : "password"}
              id="passwordConfirm"
              placeholder="Confirm Password"
              className="w-full bg-transparent focus:outline-none placeholder:text-sm font-extralight px-4 py-2 tablet:py-3 rounded-lg border border-gray-600"
              disabled={isLoading}
              {...register("passwordConfirm", {
                required: "Repeat Password is required",
                validate: (value) =>
                  value === getValues().password || "Password doesn't match",
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

        <FormRow
          name="referral"
          label="Referral Code"
          error={errors?.referral?.message}
        >
          <input
            type="text"
            id="referral"
            placeholder="Enter Referral Code"
            className="w-full bg-transparent focus:outline-none placeholder:text-sm font-extralight px-4 py-2 tablet:py-3 rounded-lg border border-gray-600"
            disabled={isLoading}
            value={referralCode}
            readOnly={Boolean(referralCode)}
            {...register("referral")}
          />
        </FormRow>

        <button className="self-center bg-[#413e72] text-white uppercase text-sm font-extralight px-6 desktop:px-8 py-2 desktop:py-3 rounded-lg border border-[#605e96] shadow-[0px_4px_4px_0px_#00000040]">
          Register
        </button>

        {!referralCode && (
          <p className="text-gray-300 text-center font-extralight">
            Already have an account?
            <span
              className="ml-2 text-white underline cursor-pointer"
              onClick={() => setCurrent("login")}
            >
              Login
            </span>
          </p>
        )}
      </form>
    </>
  );
}

export default RegisterForm;
