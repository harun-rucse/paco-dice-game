import Modal from "../../components/Modal";
import AboutStaking from "./AboutStaking";
import StakingCalculator from "./StakingCalculator";

function StakingControls() {
  return (
    <div className="flex items-center gap-3 lg:gap-8">
      <Modal>
        <Modal.Open opens="about-staking">
          <button className="button text-sm lg:text-lg">About Staking</button>
        </Modal.Open>
        <Modal.Body name="about-staking" className="calculator-gradient-bg">
          <AboutStaking />
        </Modal.Body>
      </Modal>

      <button className="button text-sm lg:text-lg flex gap-1 items-center">
        <img src="/icons/paco-icon.png" alt="" className="w-5 lg:w-7" />
        <span>About Paco</span>
      </button>

      <Modal>
        <Modal.Open opens="staking-calculator">
          <button className="button text-sm lg:text-lg !bg-[#32a45f] !border-[#316A48]">
            Calculate
          </button>
        </Modal.Open>
        <Modal.Body
          name="staking-calculator"
          className="calculator-gradient-bg"
        >
          <StakingCalculator />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default StakingControls;
