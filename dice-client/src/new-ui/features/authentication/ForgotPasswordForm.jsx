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
        },
      }
    );
  }

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <h2 className="text-2xl desktop:text-3xl uppercase text-center font-extralight text-white">
          Reset Password
        </h2>
        <img src="/lock.png" alt="" className="h-6 desktop:h-8 object-cover" />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 tablet:pt-5"
      >
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

        <button className="self-center bg-[#413e72] text-white uppercase text-sm font-extralight px-6 desktop:px-8 py-2 desktop:py-3 rounded-lg border border-[#605e96] shadow-[0px_4px_4px_0px_#00000040]">
          {isLoading ? "Sending..." : "Send reset token"}
        </button>
      </form>
    </>
  );
}

export default ForgotPasswordForm;
