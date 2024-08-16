'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ExtractInfo({ params }) {
  const [extractedInfo, setExtractedInfo] = useState('');
  const [status, setStatus] = useState('Extracting');
  const router = useRouter();
  const { fileId } = params;

  useEffect(() => {
    const extractInfo = async () => {
      if (!fileId) {
        console.error("FileId is undefined");
        setStatus('Error');
        return;
      }

      try {
        const response = await fetch(`/api/extract-info/${fileId}`, {
          method: 'POST',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setExtractedInfo(data.extractedInfo);
        setStatus('Extracted');
      } catch (error) {
        console.error('Error extracting information:', error);
        setStatus('Error');
      }
    };

    extractInfo();
  }, [fileId]);

  const handleConvertToDocx = () => {
    router.push(`/convert-to-docx/${fileId}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold mb-8">Extracted Resume Information</h1>
      <p className="text-xl mb-4">Status: {status}</p>
      
      {status === 'Extracting' && (
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      )}

      {status === 'Extracted' && (
        <div className="mt-8 w-full max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4">Extracted Information:</h2>
          <div className="bg-gray-100 p-4 rounded-md text-black overflow-auto max-h-[60vh]">
            <pre className="whitespace-pre-wrap">{extractedInfo}</pre>
          </div>
          <button
            onClick={handleConvertToDocx}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Convert to DOCX
          </button>
        </div>
      )}

      {status === 'Error' && (
        <div className="mt-8">
          <p className="text-red-500">An error occurred during extraction. Please try again.</p>
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