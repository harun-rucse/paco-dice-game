import { useForm } from "react-hook-form";
import { useRegister } from "./useRegister";
import FormRow from "../../components/FormRow";

function RegisterForm({ setCurrent }) {
  const { register, handleSubmit, reset, formState, getValues } = useForm();
  const { errors } = formState;
  const { isLoading, register: handleRegister } = useRegister();

  function onSubmit({ email, password, promoCode }) {
    handleRegister(
      { email, password, promoCode },
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
      <div className="flex justify-center absolute top-5 md:top-1 2xl:top-36 left-[47%] md:left-[57%] 2xl:left-[55%]">
        <img src="/lock.png" alt="" className="h-16 object-cover" />
      </div>
      <h2 className="text-2xl uppercase text-center font-extralight text-white md:pt-4">
        Join Now
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FormRow name="email" label="Email" error={errors?.email?.message}>
          <input
            type="email"
            id="email"
            placeholder="Email"
            className="w-full bg-[#1f1d22] focus:outline-none placeholder:text-sm font-extralight px-4 py-3 rounded-lg border border-gray-600"
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
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="w-full bg-[#1f1d22] focus:outline-none placeholder:text-sm font-extralight px-4 py-3 rounded-lg border border-gray-600"
            disabled={isLoading}
            {...register("password", {
              required: "Password is required",
            })}
          />
        </FormRow>

        <FormRow
          name="passwordConfirm"
          label="Confirm Password"
          error={errors?.passwordConfirm?.message}
        >
          <input
            type="password"
            id="passwordConfirm"
            placeholder="Confirm Password"
            className="w-full bg-[#1f1d22] focus:outline-none placeholder:text-sm font-extralight px-4 py-3 rounded-lg border border-gray-600"
            disabled={isLoading}
            {...register("passwordConfirm", {
              required: "Repeat Password is required",
              validate: (value) =>
                value === getValues().password || "Password doesn't match",
            })}
          />
        </FormRow>

        <FormRow
          name="promoCode"
          label="Promo Code"
          error={errors?.promoCode?.message}
        >
          <input
            type="text"
            id="promoCode"
            placeholder="Enter Promo Code"
            className="w-full bg-[#1f1d22] focus:outline-none placeholder:text-sm font-extralight px-4 py-3 rounded-lg border border-gray-600"
            disabled={isLoading}
            {...register("promoCode")}
          />
        </FormRow>

        <button className="self-center bg-[#2e2550] text-white uppercase text-sm font-extralight px-8 py-3 rounded-lg shadow-[0px_4px_4px_0px_#00000040]">
          Continue
        </button>

        <p className="text-white text-center font-extralight">
          Already have an account?{" "}
          <span
            className="underline cursor-pointer"
            onClick={() => setCurrent("login")}
          >
            Login
          </span>
        </p>
      </form>
    </>
  );
}

export default RegisterForm;
