import { useEffect } from "react";
import { AiFillWarning } from "react-icons/ai";
import { useForm } from "react-hook-form";
import Balance from "../../components/Balance";
import { useBalance } from "../../context/BalanceContext";
import { useWithdraw } from "./useWithdraw";

function Withdraw() {
  const { currentBalance } = useBalance();

  const {
    register,
    handleSubmit,
    reset,
    formState,
    getValues,
    setValue,
    setError,
  } = useForm();
  const { errors } = formState;
  const { isLoading, withdraw } = useWithdraw();

  function onSubmit({ amount, address }) {
    withdraw(
      { paymentType: currentBalance?.name?.toLowerCase(), amount, address },
      {
        onSuccess: () => {
          reset();
          window.location.reload();
        },
      }
    );
  }

  useEffect(() => {
    setValue("amount", "");
  }, [currentBalance, setValue]);

  function handleAll() {
    setValue("amount", currentBalance.value);
    setError("amount", undefined);
  }

  return (
    <>
      <h2 className="text-lg uppercase font-extrabold text-white">Withdraw</h2>
      <Balance className="gap-4" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 pt-6 text-white"
      >
        <input
          type="text"
          placeholder="Enter Address"
          className="bg-[#1f1d22] focus:outline-none placeholder:uppercase font-bold px-4 py-3 rounded-lg border border-gray-600"
          disabled={isLoading}
          {...register("address", {
            required: "Wallet address is required",
          })}
        />
        {errors?.address?.message && (
          <span className="text-sm text-red-400">
            {errors?.address?.message}
          </span>
        )}

        <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4">
          <div className="relative">
            <input
              type="number"
              placeholder="Enter Amount"
              className="bg-[#1f1d22] focus:outline-none placeholder:uppercase font-bold px-4 py-3 rounded-lg border border-gray-600"
              disabled={isLoading}
              {...register("amount", {
                required: "Amount is required",
                max: {
                  value: currentBalance.value,
                  message: "Insufficient balance",
                },
              })}
            />
            <span
              onClick={handleAll}
              className="absolute right-1 top-2 cursor-pointer uppercase text-white text-sm bg-[#2e2550] rounded-xl p-2"
            >
              All
            </span>
          </div>

          <div className="relative w-full flex items-center gap-2 bg-[#1f1d22] px-4 py-2 rounded-lg border border-gray-600">
            <img src={currentBalance.imgUrl} alt="" className="h-7" />
            <div className="flex flex-col ">
              <span className="uppercase text-gray-400 font-bold text-xs">
                Balance
              </span>
              <strong className="text-white text-sm font-bold">
                {currentBalance.value}
              </strong>
            </div>
          </div>
        </div>

        {errors?.amount?.message && (
          <span className="text-sm text-red-400">
            {errors?.amount?.message}
          </span>
        )}

        <div className="flex items-center gap-2 bg-[#323232] px-4 py-2 rounded-xl text-white mt-6">
          <AiFillWarning color="#ffcc00" size={20} />
          <span className="text-sm uppercase font-bold">
            MINIMUM WITHDRAWAL AMOUNT IS 500000 PACO.
          </span>
        </div>

        <div className="mt-[5rem] w-full">
          <button
            className="bg-[#d11f1f] w-full uppercase text-sm font-extrabold px-6 py-3 rounded-lg shadow-[ 0px_4px_4px_0px_#00000040]"
            disabled={
              isLoading || getValues().amount <= 0 || errors?.amount?.message
            }
          >
            {isLoading ? "Withdrawing..." : "Withdraw"}
          </button>
          <p className="text-xs font-bold mt-2">
            TRANSACTION FEE - 10000 PACO.
          </p>
        </div>
      </form>
    </>
  );
}

export default Withdraw;
