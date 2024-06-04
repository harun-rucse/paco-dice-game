import Modal from "../../components/Modal";
import Authentication from "../authentication/Authentication";

function ReferralUnAuth() {
  return (
    <div className="tablet:self-stretch bg-[#1e1c3a] dark:bg-[#31294c] rounded-2xl px-4 py-12 w-full h-full tablet:h-[40rem] laptop:h-[60vh]">
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
            <button className="bg-[#2e2550] dark:bg-[#4e3270] rounded-full px-12 py-2 uppercase text-white shadow-sm">
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

export default ReferralUnAuth;
