import RegisterForm from "../features/authentication/RegisterForm";

function JoinViaReferral() {
  return (
    <div className="px-4 desktop:px-8 pt-8 tablet:py-8 pb-60 space-y-6 tablet:mb-[12rem] flex items-center justify-center">
      <div className="w-full tablet:w-[30rem] h-[4rem] tablet:h-full">
        <RegisterForm />
      </div>
    </div>
  );
}

export default JoinViaReferral;
