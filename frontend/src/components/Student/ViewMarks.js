import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import marksService from '../../services/marksService';
import Card from '../Card';

const ViewMarks = () => {
  const { user } = useContext(AuthContext);
  const [marks, setMarks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchMarks();
    }
  }, [user?.id]);

  const fetchMarks = async () => {
    try {
      const response = await marksService.getStudentMarks(user?.id);
      setMarks(response.data);
    } catch (err) {
      setError('Failed to fetch marks');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading marks...</div>;

  return (
    <div>
      <Card title="My Results">
        {error && <div className="error-message">{error}</div>}

        {marks && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <h3>CGPA: {marks.cgpa}</h3>
            </div>

            {marks.marks.length === 0 ? (
              <p>No marks records found</p>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Exam Type</th>
                      <th>Obtained</th>
                      <th>Total</th>
                      <th>Percentage</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks.marks.map((mark) => (
                      <tr key={mark._id}>
                        <td>{mark.course?.name}</td>
                        <td>{mark.examType}</td>
                        <td>{mark.marksObtained}</td>
                        <td>{mark.totalMarks}</td>
                        <td>{mark.percentage?.toFixed(2)}%</td>
                        <td>
                          <span className={`grade-badge grade-${mark.grade}`}>
                            {mark.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default ViewMarks;