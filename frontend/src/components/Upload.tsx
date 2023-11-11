import React, { useState } from 'react';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState("Upload sensor data from an external CSV source.")

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      fetch(`http://localhost:8080/upload`, {
        method: 'POST',
        body: formData,
      })
        .then(response => {
          if (!response.ok) {
            setStatus("Generic network error")
            throw new Error('Network response was not ok');
          }
        })
        .then(() => {
          setStatus('File uploaded successfully')
          console.log('File uploaded successfully');
        })
        .catch(error => {
          setStatus("Generic network error")
          console.error('Error uploading file:', error);
        });
    }
  };

  return (
    <div className='h-60 flex flex-col items-center pt-6 text-xl'>
      <h1 className='text-white font-semibold text-center py-6'>{status}</h1>
      <div className='flex justify-center align-middle items-center'>
        <input type="file" onChange={handleFileChange} className='' />

        <button onClick={handleUpload} disabled={!selectedFile} className='bg-white px-8 py-4 rounded-lg cursor-pointer'>
          Upload
        </button>
      </div>
    </div>
  );
}

export default App;
