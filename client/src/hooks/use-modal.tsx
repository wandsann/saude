import { useState, createContext, useContext, ReactNode } from "react";

interface ModalContextType {
  openModal: (modalId: string, props?: any) => void;
  closeModal: () => void;
  currentModal: string | null;
  modalProps: any;
}

export const ModalContext = createContext<ModalContextType>({} as ModalContextType);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [modalProps, setModalProps] = useState<any>(null);

  const openModal = (modalId: string, props?: any) => {
    setCurrentModal(modalId);
    if (props) {
      setModalProps(props);
    } else {
      setModalProps(null);
    }
  };

  const closeModal = () => {
    setCurrentModal(null);
    setModalProps(null);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, currentModal, modalProps }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
