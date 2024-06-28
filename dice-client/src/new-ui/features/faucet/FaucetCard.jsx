import { useDarkMode } from "../../../context/DarkModeContext";
import Modal from "../../components/Modal";
import BonusCard from "./BonusCard";
import FaucetStats from "./FaucetStats";
import FaucetTable from "./FaucetTable";
import LevelCard from "./LevelCard";
import FaucetGamble from "./modals/FaucetGamble";
import FaucetRule from "./modals/FaucetRule";
import Prize from "./modals/Prize";
import Tournament from "./modals/Tournament";

function FaucetCard() {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="p-2 space-y-4 flex flex-col">
      <div className="tablet:w-fit self-center tablet:self-end flex items-center gap-6 bg-[#24224a] dark:bg-[#594a80] rounded-xl border border-[#917ec2] dark:border-[#917ec2] px-6 py-3">
        <Modal>
          <Modal.Open opens="tournament-modal">
            <button>
              <img
                src={
                  isDarkMode
                    ? "/images/faucet/trophy-dark.png"
                    : "/images/faucet/trophy.png"
                }
                className="w-6"
                alt=""
              />
            </button>
          </Modal.Open>
          <Modal.Body
            name="tournament-modal"
            className="bg-gradient-to-b from-[#39366f] dark:from-[#752c83] via-[#24224a] dark:via-[#5d2c83] to-[#24224a] dark:to-[#522c83] w-[22rem] tablet:min-w-[30rem] tablet:min-h-[30rem]"
          >
            <Tournament />
          </Modal.Body>
        </Modal>

        <Modal>
          <Modal.Open opens="faucet-rule-modal">
            <button>
              <img
                src={
                  isDarkMode
                    ? "/images/faucet/doc-dark.png"
                    : "/images/faucet/doc.png"
                }
                className="w-6"
                alt=""
              />
            </button>
          </Modal.Open>
          <Modal.Body
            name="faucet-rule-modal"
            className="bg-gradient-to-b from-[#39366f] dark:from-[#752c83] via-[#24224a] dark:via-[#5d2c83] to-[#24224a] dark:to-[#522c83] w-[22rem] tablet:min-w-[30rem] tablet:min-h-[30rem]"
          >
            <FaucetRule />
          </Modal.Body>
        </Modal>

        <Modal>
          <Modal.Open opens="faucet-gamble-modal">
            <button>
              <img
                src={
                  isDarkMode
                    ? "/images/faucet/game-dark.png"
                    : "/images/faucet/game.png"
                }
                className="w-6"
                alt=""
              />
            </button>
          </Modal.Open>
          <Modal.Body
            name="faucet-gamble-modal"
            className="bg-gradient-to-b from-[#39366f] dark:from-[#752c83] via-[#24224a] dark:via-[#5d2c83] to-[#24224a] dark:to-[#522c83] w-[22rem] tablet:min-w-[30rem] tablet:min-h-[30rem]"
          >
            <FaucetGamble />
          </Modal.Body>
        </Modal>

        <Modal>
          <Modal.Open opens="prize-modal">
            <button>
              <img
                src={
                  isDarkMode
                    ? "/images/faucet/gift-dark.png"
                    : "/images/faucet/gift.png"
                }
                className="w-6"
                alt=""
              />
            </button>
          </Modal.Open>
          <Modal.Body
            name="prize-modal"
            className="bg-gradient-to-b from-[#39366f] dark:from-[#752c83] via-[#24224a] dark:via-[#5d2c83] to-[#24224a] dark:to-[#522c83] w-[22rem] tablet:min-w-[30rem] tablet:min-h-[30rem]"
          >
            <Prize />
          </Modal.Body>
        </Modal>
      </div>
      <div className="flex flex-col laptop:flex-row items-start gap-8 laptop:gap-4 desktop:gap-8">
        <div className="w-full laptop:w-[65%] desktop:w-[70%]">
          <BonusCard />
        </div>

        <div className="w-full laptop:w-[35%] desktop:w-[30%]">
          <LevelCard />
        </div>
      </div>

      <FaucetStats />
      <FaucetTable />
    </div>
  );
}

export default FaucetCard;
