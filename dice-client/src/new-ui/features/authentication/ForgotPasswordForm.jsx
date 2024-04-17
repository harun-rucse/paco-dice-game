import { useForm } from "react-hook-form";
import { useForgotPassword } from "./useForgotPassword";
import FormRow from "../../components/FormRow";

function ForgotPasswordForm() {
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;
  const { isLoading, forgotPassword } = useForgotPassword();

  function onSubmit({ email }) {
    forgotPassword(
      { email },
      {
        onSuccess: () => {
          reset();
          // window.location.reload();
        },
      }
    );
  }

  return (
    <>
      <div className="flex justify-center absolute top-10 md:top-1 2xl:top-36 left-[47%] md:left-[57%] 2xl:left-[55%]">
        <img src="/lock.png" alt="" className="h-16 object-cover" />
      </div>
      <h2 className="text-2xl md:text-3xl uppercase text-center font-extralight text-white md:pt-4">
        Reset Password
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
            className="w-full bg-[#1f1d22] focus:outline-none placeholder:text-sm font-extralight px-4 py-3 rounded-lg border border-gray-600"
            disabled={isLoading}
            {...register("email", {
              required: "Email is required",
            })}
          />
        </FormRow>

        <button
          className="self-center bg-[#2e2550] text-white uppercase text-sm font-extralight px-8 py-3 rounded-lg shadow-[0px_4px_4px_0px_#00000040]"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send reset token"}
        </button>
      </form>
    </>
  );
}

export default ForgotPasswordForm;
