import { useForm } from "react-hook-form";
import { usePasswordChange } from "./usePasswordChange";
import FormRow from "../../components/FormRow";

function ChangePassword() {
  const { register, handleSubmit, reset, formState, getValues } = useForm();
  const { errors } = formState;
  const { isLoading, passwordChange } = usePasswordChange();

  function onSubmit({ currentPassword, password }) {
    passwordChange(
      { currentPassword, password },
      {
        onSuccess: () => {
          reset();
          window.location.reload();
        },
      }
    );
  }

  return (
    <div className="w-full bg-[#2b1346] text-white flex flex-col items-center gap-2 p-6 rounded-xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full md:px-10 flex flex-col gap-6 md:pt-5"
      >
        <FormRow
          name="currentPassword"
          label="Current Password"
          error={errors?.currentPassword?.message}
        >
          <input
            type="password"
            id="currentPassword"
            placeholder="Current Password"
            className="w-full bg-[#1f1d22] focus:outline-none placeholder:uppercase placeholder:text-sm font-semibold px-4 py-3 rounded-lg border border-gray-600"
            disabled={isLoading}
            {...register("currentPassword", {
              required: "Current Password is required",
            })}
          />
        </FormRow>

        <FormRow
          name="password"
          label="New Password"
          error={errors?.password?.message}
        >
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="w-full bg-[#1f1d22] focus:outline-none placeholder:uppercase placeholder:text-sm font-semibold px-4 py-3 rounded-lg border border-gray-600"
            disabled={isLoading}
            {...register("password", {
              required: "New Password is required",
            })}
          />
        </FormRow>

        <FormRow
          name="repeatPassword"
          label="Repeat New Password"
          error={errors?.repeatPassword?.message}
        >
          <input
            type="password"
            id="repeatPassword"
            placeholder="Repeat New Password"
            className="w-full bg-[#1f1d22] focus:outline-none placeholder:text-sm font-semibold px-4 py-3 rounded-lg border border-gray-600"
            disabled={isLoading}
            {...register("repeatPassword", {
              required: "Repeat Password is required",
              validate: (value) =>
                value === getValues().password || "Password doesn't match",
            })}
          />
        </FormRow>

        <button
          className="self-center bg-[#2e2550] text-sm uppercase font-semibold px-4 py-3 rounded-xl"
          disabled={isLoading}
        >
          Change password
        </button>
      </form>

      <div className="flex flex-col items-center gap-6 pt-12">
        <input
          type="text"
          value="pacopower@gmail.com"
          className="bg-transparent p-2 rounded-lg text-lg font-semibold"
        />
        <button className="bg-[#2e2550] text-sm uppercase font-semibold px-4 py-3 rounded-xl">
          Change Email
        </button>
      </div>
    </div>
  );
}

export default ChangePassword;
