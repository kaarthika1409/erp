import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import announcementService from '../../services/announcementService';
import Card from '../Card';

const ViewAnnouncements = () => {
  const { user } = useContext(AuthContext);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await announcementService.getAnnouncementsByRole('student');
      setAnnouncements(response.data);
    } catch (err) {
      setError('Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading announcements...</div>;

  return (
    <div>
      <h2 className="section-title">Announcements</h2>
      
      {error && <div className="error-message">{error}</div>}

      {announcements.length === 0 ? (
        <Card><p>No announcements available</p></Card>
      ) : (
        announcements.map((announcement) => (
          <Card key={announcement._id} title={announcement.title} className="announcement-card">
            <div style={{ marginBottom: '10px' }}>
              <span className={`priority-badge priority-${announcement.priority}`}>
                {announcement.priority.toUpperCase()}
              </span>
            </div>
            <p>{announcement.content}</p>
            <small>
              Posted by: {announcement.createdBy?.name} on {new Date(announcement.createdAt).toLocaleDateString()}
            </small>
          </Card>
        ))
      )}
    </div>
  );
};

export default ViewAnnouncements;