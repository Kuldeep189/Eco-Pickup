import React from 'react';

const Notifications = () => {
  // Placeholder notifications
  const notifications = [
    'Garbage pickup scheduled for tomorrow.',
    'New garbage report submitted in your area.',
    'Pickup request #1234 marked as completed.',
  ];

  return (
    <div style={{
      maxWidth: 600,
      margin: '0 auto',
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    }}>
      <h2>Notifications</h2>
      <ul style={{ paddingLeft: 20 }}>
        {notifications.map((note, idx) => (
          <li key={idx} style={{ marginBottom: 10 }}>
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
