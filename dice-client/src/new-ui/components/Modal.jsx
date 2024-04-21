import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { cn } from "../../utils";

const ModalContext = createContext();

function ModalOpen({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);

  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

function ModalBody({ children, name, className }) {
  const { openName, close } = useContext(ModalContext);
  const ref = useOutsideClick(close);

  if (name !== openName) return null;

  return createPortal(
    <div className="fixed inset-0 bg-gray-200/20 flex items-start desktop:items-center backdrop-blur-sm justify-center z-[99999]">
      <div
        ref={ref}
        className={cn(
          `mt-10 flex flex-col gap-4 bg-[#1e1c3a] rounded-2xl w-[22rem] md:min-w-[47rem] overflow-y-auto md:min-h-[36rem] md:overflow-hidden`,
          className
        )}
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
