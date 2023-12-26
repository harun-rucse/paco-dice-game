import Modal from "../../components/Modal";
import Authentication from "../authentication/Authentication";

function MyStakeLogin() {
  return (
    <div className="md:self-stretch bg-[#3c2f61] rounded-2xl px-4 py-4 w-full lg:w-[33.33%] relative">
      <img
        src="/icons/rocket-icon.png"
        alt=""
        className="absolute -top-6 lg:-top-10 -right-4 lg:-right-6 w-20 lg:w-24"
      />
      <div className="flex gap-2 border-b border-[#8b849d] pb-6 w-[70%]">
        <img src="/icons/paco-icon.png" alt="" className="w-10" />
        <span className="uppercase text-lg text-[#787089]">My Paco</span>
      </div>
      <p className="flex items-center gap-2 uppercase text-[#787089] pt-4">
        My Staking payouts
        <img src="/icons/money-bag.png" alt="" className="w-5" />
      </p>

      <div className="flex flex-col items-center justify-center gap-4 lg:pt-20">
        <img
          src="/icons/lock.png"
          alt=""
          className="w-[200px] h-auto object-cover"
        />
        <p className="uppercase text-white text-lg -mt-7">
          Login to see this page
        </p>

        <Modal>
          <Modal.Open opens="authentication">
            <button className="bg-[#2e2550] rounded-full px-12 py-2 uppercase text-white shadow-sm">
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

export default MyStakeLogin;
