import React, { useState } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [name, setName] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [queryName, setQueryName] = useState('');
  const [queryQrCodeUrl, setQueryQrCodeUrl] = useState('');

  const handleSubmit = async () => {
    if (name) {
      try {
        // 发送请求生成QR码
        await axios.post('http://127.0.0.1:8000/api/generate-qr/', { name });

        // 获取生成的QR码
        const response = await axios.get(`http://127.0.0.1:8000/api/get-qr/${name}/`, { responseType: 'blob' });
        const qrCodeBlob = new Blob([response.data], { type: 'image/png' });
        const qrCodeUrl = URL.createObjectURL(qrCodeBlob);

        setQrCodeUrl(qrCodeUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    }
  };

  const handleSearch = async () => {
    if (queryName) {
      try {
        // 获取已有的QR码
        const response = await axios.get(`http://127.0.0.1:8000/api/get-qr/${queryName}/`, { responseType: 'blob' });
        const qrCodeBlob = new Blob([response.data], { type: 'image/png' });
        const qrCodeUrl = URL.createObjectURL(qrCodeBlob);

        setQueryQrCodeUrl(qrCodeUrl);
      } catch (error) {
        console.error('Error fetching QR code:', error);
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
      {qrCodeUrl && (
        <div style={{ marginTop: '20px' }}>
          <img src={qrCodeUrl} alt="QR Code" />
        </div>
      )}

      <h2>Search for Existing QR Code</h2>
      <input
        type="text"
        value={queryName}
        onChange={(e) => setQueryName(e.target.value)}
        placeholder="Enter name to search"
        style={{ padding: '10px', fontSize: '16px', width: '300px' }}
      />
      <button onClick={handleSearch} style={{ padding: '10px 20px', marginLeft: '10px', fontSize: '16px' }}>
        Search QR Code
      </button>
      {queryQrCodeUrl && (
        <div style={{ marginTop: '20px' }}>
          <img src={queryQrCodeUrl} alt="QR Code" />
        </div>
      )}
    </div>
  );
};

export default App;
