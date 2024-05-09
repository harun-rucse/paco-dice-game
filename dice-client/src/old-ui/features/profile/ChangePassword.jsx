import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { usePasswordChange } from "./usePasswordChange";
import FormRow from "../../components/FormRow";
import { useCurrentUser } from "../authentication/useCurrentUser";
import Spinner from "../../components/Spinner";
import { useUpdateProfile } from "./useUpdateProfile";

function ChangePassword() {
  const [email, setEmail] = useState("");
  const { register, handleSubmit, reset, formState, getValues } = useForm();
  const { errors } = formState;

  const { user, isLoading: isLoading1 } = useCurrentUser();
  const { isLoading, passwordChange } = usePasswordChange();
  const { isLoading: isUpdating, profileUpdate } = useUpdateProfile();

  useEffect(() => {
    if (!isLoading1 && user) setEmail(user?.email);
  }, [isLoading1, user]);

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

  function handleUpdate() {
    profileUpdate({ username: user?.username, email });
  }

  if (isLoading1 || isUpdating) return <Spinner />;

  return (
    <div className="w-full bg-[#2b1346] text-white flex flex-col items-center gap-2 p-6 rounded-xl border border-[#613692]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full md:px-6 flex flex-col gap-10 md:pt-5"
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
            className="w-full bg-[#1f1d22] focus:outline-none placeholder:uppercase placeholder:text-sm font-extralight px-4 py-3 rounded-lg border border-gray-600"
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
            className="w-full bg-[#1f1d22] focus:outline-none placeholder:uppercase placeholder:text-sm font-extralight px-4 py-3 rounded-lg border border-gray-600"
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
            className="w-full bg-[#1f1d22] focus:outline-none placeholder:text-sm font-extralight px-4 py-3 rounded-lg border border-gray-600"
            disabled={isLoading}
            {...register("repeatPassword", {
              required: "Repeat Password is required",
              validate: (value) =>
                value === getValues().password || "Password doesn't match",
            })}
          />
        </FormRow>

        <button
          className="self-center bg-[#2e2550] text-sm uppercase font-extralight px-4 py-3 rounded-xl"
          disabled={isLoading}
        >
          Change password
        </button>
      </form>

      <div className="flex flex-col items-center gap-6 pt-12">
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-transparent p-2 rounded-lg text-lg font-extralight cursor-pointer"
        />
        <button
          className="bg-[#2e2550] text-sm uppercase font-extralight px-4 py-3 rounded-xl"
          onClick={handleUpdate}
          disabled={isUpdating}
        >
          Change Email
        </button>
      </div>
    </div>
  );
}

export default ChangePassword;
