import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendance } from '../Store/Slices/AttendanceSlice';
import { Calendar, Badge, Spin, Empty } from 'antd';
import moment from 'moment';
import { useParams } from 'react-router-dom';

const Attendance = () => {
  const { id } = useParams(); // Get the id from the route
  const dispatch = useDispatch();
  const { attendance } = useSelector((state) => state.Attendance);
  const [attendanceDates, setAttendanceDates] = useState([]); // Store unique attendance dates
  const [loading, setLoading] = useState(true); // Track loading state
  const [hasData, setHasData] = useState(false); // Track if there's any attendance data

  // Fetch attendance data when the component loads
  useEffect(() => {
    dispatch(fetchAttendance(id));
  }, [dispatch]);

  useEffect(() => {
    if (attendance === null || attendance.length === 0) {
      // If the response is null or empty, stop loading and indicate no data
      setLoading(false);
      setHasData(false);
    } else {
      // Process attendance data to extract unique attendance dates
      const uniqueDates = Array.from(
        new Set(
          attendance.map((att) => moment(att.date).format('YYYY-MM-DD')) // Extract the date (without time)
        )
      );
      console.log('Unique attendance dates:', uniqueDates); // Debug: log unique dates
      setAttendanceDates(uniqueDates); // Store the unique dates in state
      setHasData(true); // Indicate that we have data
      setLoading(false); // Set loading to false once data is ready
    }
  }, [attendance]);

  // Function to render each date cell in the calendar
  const dateCellRender = (value) => {
    const formattedDate = value.format('YYYY-MM-DD'); // Format the date to match the attendance format

    // Check if this date is in the attendanceDates array
    if (attendanceDates.includes(formattedDate)) {
      return (
        <div>
          <Badge status="success" text="Present" />
        </div>
      );
    }
    return null; // No badge for dates not in attendanceDates
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Attendance</h2>

      {loading ? (
        <Spin />
      ) : hasData ? (
        <Calendar dateCellRender={dateCellRender} />
      ) : (
        <Empty description="No attendance data available" />
      )}
    </div>
  );
};

export default Attendance;
