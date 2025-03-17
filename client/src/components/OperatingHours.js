import { useState } from "react";
import TimePicker from "react-time-picker";
import Toggle from "react-toggle";

const OperatingHours = () => {
  const [operatingHours, setOperatingHours] = useState({
    Monday: { open: "09:00", close: "18:00", isClosed: false },
    Tuesday: { open: "09:00", close: "18:00", isClosed: false },
    Wednesday: { open: "09:00", close: "18:00", isClosed: false },
    Thursday: { open: "09:00", close: "18:00", isClosed: false },
    Friday: { open: "09:00", close: "18:00", isClosed: false },
    Saturday: { open: "10:00", close: "17:00", isClosed: false },
    Sunday: { open: "", close: "", isClosed: true },
  });

  const handleTimeChange = (day, field, value) => {
    setOperatingHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleToggle = (day) => {
    setOperatingHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        isClosed: !prev[day].isClosed,
        open: prev[day].isClosed ? "09:00" : "", // Reset time if toggled to closed
        close: prev[day].isClosed ? "18:00" : "",
      },
    }));
  };

  return (
    <div className="container">
      <h3 className="text-center mb-4">Operating Hours</h3>
      {Object.keys(operatingHours).map((day) => (
        <div key={day} className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="mb-0">{day}</h5>
            <Toggle
              checked={!operatingHours[day].isClosed}
              onChange={() => handleToggle(day)}
              icons={false}
              aria-label={`Toggle ${day} operating hours`}
            />
          </div>
          {!operatingHours[day].isClosed && (
            <div className="d-flex gap-3">
              <div>
                <label>Opening Time</label>
                <TimePicker
                  value={operatingHours[day].open}
                  onChange={(value) => handleTimeChange(day, "open", value)}
                  disableClock
                  clearIcon={null}
                />
              </div>
              <div>
                <label>Closing Time</label>
                <TimePicker
                  value={operatingHours[day].close}
                  onChange={(value) => handleTimeChange(day, "close", value)}
                  disableClock
                  clearIcon={null}
                />
              </div>
            </div>
          )}
          {operatingHours[day].isClosed && <p className="text-muted">Closed</p>}
        </div>
      ))}
    </div>
  );
};

export default OperatingHours;
