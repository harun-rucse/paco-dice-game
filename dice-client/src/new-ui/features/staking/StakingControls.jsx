import Modal from "../../components/Modal";
import AboutStaking from "./AboutStaking";
import StakingCalculator from "./StakingCalculator";

function StakingControls() {
  return (
    <div className="flex items-center gap-3 tablet:gap-5 desktop:gap-6">
      <Modal>
        <Modal.Open opens="about-staking">
          <button className="button !bg-[#413e72] dark:!bg-[#3a2354] !border-[#34325c] dark:!border-[#2f1c44] text-sm desktop:text-lg">
            About Staking
          </button>
        </Modal.Open>
        <Modal.Body name="about-staking" className="bg-[#24224a]">
          <AboutStaking />
        </Modal.Body>
      </Modal>
      {/* onClick open a link */}
      <button
        className="button !bg-[#413e72] dark:!bg-[#3a2354] !border-[#34325c] dark:!border-[#2f1c44] text-sm desktop:text-lg flex gap-1 items-center"
        onClick={() => {
          window.open("https://pacodellama.org", "_blank");
        }}
      >
        <img src="/icons/paco-icon.png" alt="" className="w-5 desktop:w-7" />
        <span>About Paco</span>
      </button>

      <Modal>
        <Modal.Open opens="staking-calculator">
          <button className="button !bg-[#413e72] dark:!bg-[#3a2354] !border-[#34325c] dark:!border-[#2f1c44] text-sm desktop:text-lg">
            Calculate
          </button>
        </Modal.Open>
        <Modal.Body
          name="staking-calculator"
          className="bg-[#24224a] h-[35rem] tablet:h-[50rem] desktop:h-full"
        >
          <StakingCalculator />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default StakingControls;
