import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import marksService from '../../services/marksService';
import Card from '../Card';

const MarksManagement = () => {
  const { user } = useContext(AuthContext);
  const [marks, setMarks] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddMarks = () => {
    setMarks([
      ...marks,
      { studentId: '', examType: 'midterm', marksObtained: '', totalMarks: '', grade: 'A' }
    ]);
  };

  const handleUpdateMarks = (index, field, value) => {
    const newMarks = [...marks];
    newMarks[index][field] = value;
    setMarks(newMarks);
  };

  const handleRemoveMarks = (index) => {
    setMarks(marks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (let mark of marks) {
        await marksService.createMarks({
          course: courseId,
          student: mark.studentId,
          faculty: user?.id,
          examType: mark.examType,
          marksObtained: parseFloat(mark.marksObtained),
          totalMarks: parseFloat(mark.totalMarks),
          grade: mark.grade
        });
      }
      setSuccess('Marks submitted successfully');
      setMarks([]);
    } catch (err) {
      setError('Failed to submit marks');
    }
  };

  return (
    <div>
      <Card title="Manage Marks">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Course ID</label>
            <input
              type="text"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              required
            />
          </div>

          <button type="button" onClick={handleAddMarks} className="btn btn-primary">
            + Add Marks
          </button>

          {marks.length > 0 && (
            <div className="table-container" style={{ marginTop: '20px' }}>
              <table>
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Exam Type</th>
                    <th>Marks Obtained</th>
                    <th>Total Marks</th>
                    <th>Grade</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {marks.map((mark, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          value={mark.studentId}
                          onChange={(e) => handleUpdateMarks(index, 'studentId', e.target.value)}
                          required
                        />
                      </td>
                      <td>
                        <select
                          value={mark.examType}
                          onChange={(e) => handleUpdateMarks(index, 'examType', e.target.value)}
                        >
                          <option value="midterm">Midterm</option>
                          <option value="endterm">Endterm</option>
                          <option value="quiz">Quiz</option>
                          <option value="assignment">Assignment</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          value={mark.marksObtained}
                          onChange={(e) => handleUpdateMarks(index, 'marksObtained', e.target.value)}
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={mark.totalMarks}
                          onChange={(e) => handleUpdateMarks(index, 'totalMarks', e.target.value)}
                          required
                        />
                      </td>
                      <td>
                        <select
                          value={mark.grade}
                          onChange={(e) => handleUpdateMarks(index, 'grade', e.target.value)}
                        >
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                          <option value="D">D</option>
                          <option value="F">F</option>
                        </select>
                      </td>
                      <td>
                        <button 
                          type="button"
                          onClick={() => handleRemoveMarks(index)}
                          className="btn btn-danger btn-small"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="form-buttons" style={{ marginTop: '20px' }}>
            <button type="submit" className="btn btn-success">Submit Marks</button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default MarksManagement;