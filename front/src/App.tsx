import React, { useState } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [name, setName] = useState('');
  const [qrCode, setQrCode] = useState('');

  const handleSubmit = async () => {
    if (name) {
      try {
        // 模拟后端API调用
        // const response = await axios.post('http://localhost:8000/api/generate-qr/', { name });
        // setQrCode(response.data.qrCode);

        // 使用dummy数据代替后端响应
        const dummyResponse = { data: { qrCode: `dummy-qr-code-for-${name}` } };
        setQrCode(dummyResponse.data.qrCode);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>QR Code Generator</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        style={{ padding: '10px', fontSize: '16px', width: '300px' }}
      />
      <button onClick={handleSubmit} style={{ padding: '10px 20px', marginLeft: '10px', fontSize: '16px' }}>
        Generate QR Code
      </button>
      {qrCode && (
        <div style={{ marginTop: '20px' }}>
          <img src={`http://dummy-qr-code-service/${qrCode}`} alt="QR Code" />
          <p>{qrCode}</p>
        </div>
      )}
    </div>
  );
};

export default App;
