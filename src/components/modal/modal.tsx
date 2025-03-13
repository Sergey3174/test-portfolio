import { createPortal } from "react-dom";
import "./modal.scss";
import Form from "../form/form";
import { FC } from "react";
import { motion } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Modal: FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-wrapper" onClick={() => setIsOpen(false)}>
      <motion.div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        initial={{
          y: 1000,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
      >
        <Form setIsOpen={setIsOpen} />
      </motion.div>
    </div>,
    document.body
  );
};

export default Modal;
