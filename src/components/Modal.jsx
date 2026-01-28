import { useRef, useEffect } from 'react';
import '../css/Modal.css';

const InfoModal = ({ isOpen, onClose }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  return (
    <dialog 
      ref={dialogRef} 
      onClose={onClose} 
      className="modal-info"
      onClick={(e) => e.target === dialogRef.current && onClose()}>
      <div className="modal-content">
        <h2 className="modal-title">MAGIC: Info</h2>
        <p>Get points by clicking on cards, but don't click on a card more than once!</p>
        <p>This app uses the Scryfall API to fetch Magic: The Gathering card images.</p>
        <button onClick={onClose} className="close-btn">Dismiss</button>
      </div>
    </dialog>
  );
}

export default InfoModal;