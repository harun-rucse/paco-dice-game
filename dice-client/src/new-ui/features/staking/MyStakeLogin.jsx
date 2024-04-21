import Modal from "../../components/Modal";
import Authentication from "../authentication/Authentication";

function MyStakeLogin() {
  return (
    <div className="tablet:self-stretch bg-[#1e1c3a] dark:bg-[#31294c] rounded-2xl px-4 py-4 w-full laptop:w-[24rem] desktop:w-[26rem] relative">
      <img
        src="/icons/rocket-icon.png"
        alt=""
        className="absolute -top-6 laptop:-top-10 -right-4 laptop:-right-6 w-20 laptop:w-24"
      />

      <div className="flex flex-col items-center justify-center gap-4 laptop:pt-20">
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
