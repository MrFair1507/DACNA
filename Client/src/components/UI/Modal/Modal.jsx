// // src/components/UI/Modal.jsx
// import React from 'react';
// import './Modal.css';

// const Modal = ({ 
//   isOpen, 
//   onClose, 
//   title, 
//   children, 
//   footerContent,
//   size = 'medium' // small, medium, large
// }) => {
//   if (!isOpen) return null;
  
//   const sizeClasses = {
//     small: 'modal-container-small',
//     medium: 'modal-container-medium',
//     large: 'modal-container-large'
//   };
  
//   return (
//     <div className="modal-overlay">
//       <div className={`modal-container ${sizeClasses[size]}`}>
//         <div className="modal-header">
//           <h2>{title}</h2>
//           <button className="close-btn" onClick={onClose}>×</button>
//         </div>
        
//         <div className="modal-body">
//           {children}
//         </div>
        
//         {footerContent && (
//           <div className="modal-footer">
//             {footerContent}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Modal;


// src/components/UI/Modal.jsx
import React from 'react';
import './Modal.css';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footerContent,
  size = 'medium' // small | medium | large
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    small: 'modal-container-small',
    medium: 'modal-container-medium',
    large: 'modal-container-large'
  };

  return (
    <div className="modal-overlay">
      <div className={`modal-container ${sizeClasses[size]}`}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
        {footerContent && <div className="modal-footer">{footerContent}</div>}
      </div>
    </div>
  );
};

export default Modal;
