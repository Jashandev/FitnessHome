import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendance, markAttendance } from '../Store/Slices/AttendanceSlice';
import { Button, message, Spin } from 'antd';
import moment from 'moment';
import { useParams } from 'react-router-dom';

const GYM_LOCATION = { lat: 30.738029, lon: 76.732300 }; // Gym coordinates

const Attendance = () => {
  const dispatch = useDispatch();
  const { id } = useParams(); // Get the id from the route
  const { attendance, status, marked, error } = useSelector((state) => state.Attendance);
  const [canMark, setCanMark] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [isMarkedToday, setIsMarkedToday] = useState(false); // Track if today’s attendance is marked
  const [attendanceDates, setAttendanceDates] = useState([]); // Store unique attendance dates
  const [loading, setLoading] = useState(true); // Track loading state

  // Fetch attendance data when the component loads
  useEffect(() => {
    dispatch(fetchAttendance(id)); // Fetch attendance using id from the route
  }, [dispatch, id]);

  // Process attendance data and check if today’s attendance is already marked
  useEffect(() => {
    const todayDate = moment().format('YYYY-MM-DD'); // Get today's date

    if (attendance === null || attendance.length === 0) {
      // No attendance data available, but we allow marking for today
      setLoading(false);
    } else {
      const uniqueDates = Array.from(
        new Set(
          attendance.map((att) => moment(att.date).format('YYYY-MM-DD')) // Format the date
        )
      );
      setAttendanceDates(uniqueDates); // Store unique dates in state
      setLoading(false); // Set loading to false once data is ready

      // Check if today's attendance is already marked
      if (uniqueDates.includes(todayDate)) {
        setIsMarkedToday(true); // Prevent marking again for today
      }
    }
  }, [attendance]);

  // Check user's proximity to the gym for marking attendance
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const distance = calculateDistance(GYM_LOCATION.lat, GYM_LOCATION.lon, latitude, longitude);

          if (distance <= 110) {
            setCanMark(true); // Allow attendance marking within 2 km
          } else {
            setLocationError('You must be within 2 km of the gym to mark attendance.');
          }
        },
        (error) => {
          setLocationError('Unable to retrieve your location. Please enable location services.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  }, []);

  // Calculate distance between two geo-coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  // Handle attendance marking using the 'id' from params
  const handleMarkAttendance = () => {
    if (canMark) {
      dispatch(markAttendance({ userId: id, status: 'present' })); // Use id from params
      message.success('Attendance marked successfully!');
      setIsMarkedToday(true); // Mark attendance as done for today
    }
  };

  // Show loading until the attendance data is ready
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Attendance</h2>

      {/* Show error if location issue */}
      {locationError && <div className="text-red-600 mb-4">{locationError}</div>}

      {/* Show message if no past attendance data */}
      {attendance.length === 0 && (
        <div className="text-gray-500 mb-4">
          No past attendance data available. You can mark attendance for today.
        </div>
      )}

      {/* Mark Attendance Button */}
      {canMark && !isMarkedToday && (
        <Button type="primary" onClick={handleMarkAttendance} className="mb-4">
          Mark Attendance for Today
        </Button>
      )}

      {isMarkedToday && (
        <div className="text-green-600">
          Attendance for today has already been marked.
        </div>
      )}
    </div>
  );
};

export default Attendance;
