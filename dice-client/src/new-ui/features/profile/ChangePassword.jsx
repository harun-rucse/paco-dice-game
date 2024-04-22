import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { usePasswordChange } from "./usePasswordChange";
import FormRow from "../../components/FormRow";
import { useCurrentUser } from "../authentication/useCurrentUser";
import Spinner from "../../../components/Spinner";
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
    <div className="w-full bg-[#1e1c3a] dark:bg-[#31294c] text-white flex flex-col items-center gap-2 p-3 laptop:p-6 rounded-xl pb-8 tablet:pb-16 laptop:pb-16">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full tablet:px-4 laptop:px-6 flex flex-col gap-10 tablet:pt-5"
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
            className="w-full bg-transparent focus:outline-none placeholder:uppercase placeholder:text-sm font-extralight px-4 py-2 tablet:py-3 rounded-lg border border-gray-600"
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
            className="w-full bg-transparent focus:outline-none placeholder:uppercase placeholder:text-sm font-extralight px-4 py-2 tablet:py-3 rounded-lg border border-gray-600"
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
            className="w-full bg-transparent focus:outline-none placeholder:text-sm font-extralight px-4 py-2 tablet:py-3 rounded-lg border border-gray-600"
            disabled={isLoading}
            {...register("repeatPassword", {
              required: "Repeat Password is required",
              validate: (value) =>
                value === getValues().password || "Password doesn't match",
            })}
          />
        </FormRow>

        <button
          className="self-center bg-[#413e72] dark:bg-[#3a2354] border border-[#605e96] dark:border-[#533378] text-sm uppercase font-extralight px-4 py-3 rounded-xl"
          disabled={isLoading}
        >
          Change password
        </button>
      </form>

      <div className="w-full flex items-end desktop:items-center justify-between gap-2 laptop:gap-6 pt-10">
        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="text-lg text-gray-400 font-extralight"
          >
            Email address
          </label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent w-full py-2 rounded-lg text-lg font-extralight cursor-pointer focus:border border-[#4b5563] focus:outline-none"
          />
        </div>
        <button
          className="w-[10rem] tablet:w-[8rem] laptop:w-fit bg-[#413e72] dark:bg-[#3a2354] border border-[#605e96] dark:border-[#533378] text-sm uppercase font-extralight px-2 laptop:px-4 py-2 tablet:py-3 rounded-xl"
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
