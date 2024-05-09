import Spinner from "../../../../components/Spinner";
import { useResetBurn } from "./useResetBurn";

function ResetBurn() {
  const { isLoading, resetBurn } = useResetBurn();

  function handleResetBurn() {
    resetBurn();
  }

  if (isLoading) return <Spinner />;

  return (
    <>
      <strong>Click to reset the burn amount on burn pool.</strong>
      <button
        className="button text-lg lg:text-xl w-32"
        onClick={handleResetBurn}
      >
        Reset Burn
      </button>
    </>
  );
}

export default ResetBurn;
