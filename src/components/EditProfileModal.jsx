import { AiOutlineClose } from 'react-icons/ai';
import '../styles/EditProfileModal.css';

function EditProfileModal({ isOpen, onClose, profile, onSave }) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    onSave(e);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button className="close-btn" onClick={onClose}>
            <AiOutlineClose />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-group">
            <label>Profile Picture</label>
            <div className="avatar-upload">
              <img src={profile.avatarUrl} alt="Profile" />
              <input
                type="file"
                accept="image/*"
                id="avatar-input"
                className="file-input"
              />
              <label htmlFor="avatar-input" className="upload-label">
                Change Photo
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Cover Photo</label>
            <div className="cover-upload">
              <div className="cover-preview" style={{ backgroundImage: `url(${profile.coverUrl})` }} />
              <input
                type="file"
                accept="image/*"
                id="cover-input"
                className="file-input"
              />
              <label htmlFor="cover-input" className="upload-label">
                Change Cover
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              placeholder="Write something about yourself..."
              maxLength={160}
              defaultValue={profile.bio}
            />
            <span className="char-count">160 characters maximum</span>
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              placeholder="Add your location"
              defaultValue={profile.location}
            />
          </div>

          <div className="form-group">
            <label>Website</label>
            <input
              type="url"
              placeholder="Add your website"
              defaultValue={profile.website}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal; 