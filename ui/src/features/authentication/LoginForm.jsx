import { useForm } from "react-hook-form";
import { useLogin } from "./useLogin";
import FormRow from "../../components/FormRow";

function LoginForm({ setCurrent }) {
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;
  const { isLoading, login } = useLogin();

  function onSubmit({ email, password }) {
    login(
      { email, password },
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
      <div className="flex justify-center absolute top-10 md:top-0 left-[45%] md:left-[57%]">
        <img src="/lock.png" alt="" className="h-16 object-cover" />
      </div>
      <h2 className="text-3xl uppercase text-center font-extrabold text-white md:pt-4">
        Login
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 md:pt-5"
      >
        <FormRow name="email" label="Email" error={errors?.email?.message}>
          <input
            type="email"
            id="email"
            placeholder="Email"
            className="w-full bg-[#1f1d22] focus:outline-none placeholder:text-sm font-bold px-4 py-3 rounded-lg border border-gray-600"
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
            className="w-full bg-[#1f1d22] focus:outline-none placeholder:uppercase placeholder:text-sm font-bold px-4 py-3 rounded-lg border border-gray-600"
            disabled={isLoading}
            {...register("password", {
              required: "Password is required",
            })}
          />
        </FormRow>

        <button
          className="self-center bg-[#2e2550] text-white uppercase text-sm font-extrabold px-8 py-3 rounded-lg shadow-[0px_4px_4px_0px_#00000040]"
          disabled={isLoading}
        >
          Login
        </button>

        <p className="text-white text-center font-bold">
          Don't have an account?{" "}
          <span
            className="underline cursor-pointer"
            onClick={() => setCurrent("register")}
          >
            Join Now
          </span>
        </p>
      </form>
    </>
  );
}

export default LoginForm;
