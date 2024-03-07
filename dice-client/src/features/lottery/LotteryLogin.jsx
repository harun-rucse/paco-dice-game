import Modal from "../../components/Modal";
import Authentication from "../authentication/Authentication";

function LotteryLogin() {
  return (
    <div className="md:self-stretch bg-transparent rounded-2xl px-4 py-8 w-full lg:w-full relative">
      <div className="flex flex-col items-center justify-center gap-4">
        <img
          src="/icons/lock.png"
          alt=""
          className="w-[200px] h-auto object-cover"
        />
        <p className="uppercase text-white text-lg -mt-7">
          Please Login to see this page
        </p>

        <Modal>
          <Modal.Open opens="authentication">
            <button className="items-center text-white uppercase gap-2 bg-[#2e2550] rounded-xl px-6 md:px-8 py-2 shadow-[0px_4px_4px_0px_#00000040]">
              Login
            </button>
          </Modal.Open>
          <Modal.Body name="authentication">
            <Authentication />
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

export default LotteryLogin;
