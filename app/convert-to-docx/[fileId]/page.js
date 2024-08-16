'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ConvertToDocx({ params }) {
  const [status, setStatus] = useState('Converting');
  const router = useRouter();
  const { fileId } = params;

  useEffect(() => {
    const convertToDocx = async () => {
      if (!fileId) {
        console.error("FileId is undefined");
        setStatus('Error');
        return;
      }

      try {
        const response = await fetch(`/api/convert-to-docx?fileId=${fileId}`, {
          method: 'POST',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setStatus('Converted');
        } else {
          throw new Error(data.error || 'Unknown error occurred');
        }
      } catch (error) {
        console.error('Error converting to DOCX:', error);
        setStatus('Error');
      }
    };

    convertToDocx();
  }, [fileId]);

  const handleDownload = () => {
    window.location.href = `/docxfinal/${fileId}.docx`;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold mb-8">Convert to DOCX</h1>
      <p className="text-xl mb-4">Status: {status}</p>
      
      {status === 'Converting' && (
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      )}

      {status === 'Converted' && (
        <div className="mt-8">
          <p className="text-green-500 mb-4">DOCX file generated successfully!</p>
          <button
            onClick={handleDownload}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Download DOCX
          </button>
          <p/>
          <button
            onClick={() => router.push('/upload')}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Upload New File
          </button>
        </div>
      )}

      {status === 'Error' && (
        <div className="mt-8">
          <p className="text-red-500">An error occurred during conversion. Please try again.</p>
          <button
            onClick={() => router.push('/upload')}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Upload New File
          </button>
        </div>
      )}
    </div>
  );
}