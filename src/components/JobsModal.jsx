import { useState } from 'react';
import { 
  IoCloseOutline, 
  IoBriefcaseOutline,
  IoLocationOutline,
  IoTimeOutline,
  IoBusinessOutline,
  IoCashOutline,
  IoFilterOutline
} from 'react-icons/io5';
import '../styles/JobsModal.css';

function JobsModal({ isOpen, onClose }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const jobListings = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'Remote',
      type: 'Full-time',
      salary: '$120k - $150k',
      tags: ['React', 'TypeScript', 'Node.js'],
      posted: '2 days ago',
      featured: true
    },
    {
      id: 2,
      title: 'UX/UI Designer',
      company: 'DesignHub',
      location: 'New York, USA',
      type: 'Full-time',
      salary: '$90k - $120k',
      tags: ['Figma', 'Adobe XD', 'Sketch'],
      posted: '3 days ago'
    },
    {
      id: 3,
      title: 'Backend Developer',
      company: 'ServerPro',
      location: 'Remote',
      type: 'Contract',
      salary: '$80k - $100k',
      tags: ['Python', 'Django', 'PostgreSQL'],
      posted: '1 week ago'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="jobs-modal-overlay">
      <div className="jobs-modal">
        <div className="jobs-header">
          <h2>
            <IoBriefcaseOutline className="header-icon" />
            Job Opportunities
          </h2>
          <button className="close-button" onClick={onClose}>
            <IoCloseOutline />
          </button>
        </div>

        <div className="jobs-content">
          {/* Search and Filter Section */}
          <div className="jobs-search-section">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-tabs">
              <button 
                className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All Jobs
              </button>
              <button 
                className={`filter-tab ${activeFilter === 'remote' ? 'active' : ''}`}
                onClick={() => setActiveFilter('remote')}
              >
                Remote
              </button>
              <button 
                className={`filter-tab ${activeFilter === 'featured' ? 'active' : ''}`}
                onClick={() => setActiveFilter('featured')}
              >
                Featured
              </button>
            </div>
          </div>

          {/* Job Listings */}
          <div className="job-listings">
            {jobListings.map(job => (
              <div key={job.id} className={`job-card ${job.featured ? 'featured' : ''}`}>
                <div className="job-card-header">
                  <h3>{job.title}</h3>
                  {job.featured && <span className="featured-badge">Featured</span>}
                </div>
                
                <div className="job-info">
                  <div className="info-item">
                    <IoBusinessOutline />
                    <span>{job.company}</span>
                  </div>
                  <div className="info-item">
                    <IoLocationOutline />
                    <span>{job.location}</span>
                  </div>
                  <div className="info-item">
                    <IoCashOutline />
                    <span>{job.salary}</span>
                  </div>
                  <div className="info-item">
                    <IoTimeOutline />
                    <span>{job.posted}</span>
                  </div>
                </div>

                <div className="job-tags">
                  {job.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>

                <div className="job-actions">
                  <button className="apply-button">Apply Now</button>
                  <button className="save-button">Save Job</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="jobs-footer">
          <p>Can't find what you're looking for? <a href="#">Post a job</a></p>
        </div>
      </div>
    </div>
  );
}

export default JobsModal;