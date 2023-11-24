import { useForm } from "react-hook-form";
import { useResetPassword } from "./useResetPassword";
import FormRow from "../../components/FormRow";
import { useParams } from "react-router-dom";

function ResetPassword() {
  const { resetToken } = useParams();
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
    <div className="rounded-lg w-[22rem] md:min-w-[47rem] md:min-h-[36rem] md:overflow-hidden flex flex-col md:flex-row items-start md:h-full overflow-y-scroll">
      <div className="w-full md:w-[24rem] md:h-[40rem] bg-[#411b6a] space-y-3 px-6 py-8"></div>

      <div className="w-full h-[40rem] bg-[#2b1346] px-6 py-8 space-y-3">
        <div className="flex justify-center absolute top-0 md:top-0 left-[45%] md:left-[58%]">
          <img src="/lock.png" alt="" className="h-16 object-cover" />
        </div>
        <h2 className="text-2xl md:text-3xl uppercase text-center font-extralight text-white md:pt-12">
          Reset Your Password
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 md:pt-5"
        >
          <FormRow
            name="password"
            label="Password"
            error={errors?.password?.message}
          >
            <input
              type="password"
              id="password"
              placeholder="New Password"
              className="w-full bg-[#1f1d22] focus:outline-none placeholder:uppercase placeholder:text-sm font-extralight px-4 py-3 rounded-lg border border-gray-600"
              disabled={isLoading}
              {...register("password", {
                required: "Password is required",
              })}
            />
          </FormRow>

          <button
            className="self-center bg-[#2e2550] text-white uppercase text-sm font-extralight px-8 py-3 rounded-lg shadow-[0px_4px_4px_0px_#00000040]"
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
