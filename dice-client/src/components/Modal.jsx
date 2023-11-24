import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { useOutsideClick } from "../hooks/useOutsideClick";

const ModalContext = createContext();

function ModalOpen({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);

  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

function ModalBody({ children, name }) {
  const { openName, close } = useContext(ModalContext);
  const ref = useOutsideClick(close);

  if (name !== openName) return null;

  return createPortal(
    <div className="fixed inset-0 bg-gray-200/20 flex items-center backdrop-blur-sm justify-center z-[99999]">
      <div
        ref={ref}
        className="flex flex-col gap-4 bg-[#2b1346] rounded-lg w-[22rem] md:min-w-[47rem] overflow-y-auto md:min-h-[36rem] md:overflow-hidden"
      >
        {children}
      </div>
    </div>,
    document.getElementById("portal-root")
  );
}

function Modal({ children }) {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, open, close }}>
      {children}
    </ModalContext.Provider>
  );
}

Modal.Body = ModalBody;
Modal.Open = ModalOpen;

export default Modal;
