import { IoClose } from 'react-icons/io5';
import CreatePost from './CreatePost';

function CreatePostModal({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create Post</h2>
          <button className="close-button" onClick={onClose}>
            <IoClose />
          </button>
        </div>
        <CreatePost onPostComplete={onClose} />
      </div>
    </div>
  );
}

export default CreatePostModal; 