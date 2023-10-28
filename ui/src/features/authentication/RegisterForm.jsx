import { useForm } from "react-hook-form";
import { useRegister } from "./useRegister";
import FormRow from "../../components/FormRow";

function RegisterForm() {
  const { register, handleSubmit, reset, formState, getValues } = useForm();
  const { errors } = formState;
  const { isLoading, register: handleRegister } = useRegister();

  function onSubmit({ username, password }) {
    handleRegister(
      { username, password },
      {
        onSettled: () => reset(),
      }
    );
  }

  return (
    <>
      <h2 className="text-lg uppercase font-extrabold text-white">
        Create a new account
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 pt-10"
      >
        <FormRow
          name="username"
          label="Username/Email"
          error={errors?.username?.message}
        >
          <input
            type="text"
            id="username"
            placeholder="Enter username or email address"
            className="bg-[#1f1d22] focus:outline-none placeholder:uppercase placeholder:text-sm font-bold px-4 py-2 rounded-lg border border-gray-600"
            disabled={isLoading}
            {...register("username", {
              required: "Username is required",
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
            placeholder="Enter password"
            className="bg-[#1f1d22] focus:outline-none placeholder:uppercase placeholder:text-sm font-bold px-4 py-2 rounded-lg border border-gray-600"
            disabled={isLoading}
            {...register("password", {
              required: "Password is required",
            })}
          />
        </FormRow>

        <FormRow
          name="passwordConfirm"
          label="Repeat Password"
          error={errors?.passwordConfirm?.message}
        >
          <input
            type="password"
            id="passwordConfirm"
            placeholder="Enter password"
            className="bg-[#1f1d22] focus:outline-none placeholder:uppercase placeholder:text-sm font-bold px-4 py-2 rounded-lg border border-gray-600"
            disabled={isLoading}
            {...register("passwordConfirm", {
              required: "Repeat Password is required",
              validate: (value) =>
                value === getValues().password || "Password doesn't match",
            })}
          />
        </FormRow>

        <button className="bg-[#6c1fb8] text-white w-full uppercase text-sm font-extrabold px-6 py-3 rounded-lg shadow-[ 0px_4px_4px_0px_#00000040]">
          Create new account
        </button>
      </form>
    </>
  );
}

export default RegisterForm;
