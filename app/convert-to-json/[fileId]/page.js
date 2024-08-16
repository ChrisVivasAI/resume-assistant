'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ConvertToJson({ params }) {
  const [status, setStatus] = useState('Converting');
  const [jsonData, setJsonData] = useState(null);
  const router = useRouter();
  const fileId = params?.fileId;

  console.log("Params in ConvertToJson page:", params);
  console.log("FileId in ConvertToJson page:", fileId);

  useEffect(() => {
    const convertToJson = async () => {
      if (!fileId) {
        console.error("FileId is undefined");
        setStatus('Error');
        return;
      }

      try {
        const response = await fetch(`/api/convert-to-json/${fileId}`, {
          method: 'POST',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setJsonData(data);
        setStatus('Converted');
      } catch (error) {
        console.error('Error converting to JSON:', error);
        setStatus('Error');
      }
    };

    convertToJson();
  }, [fileId]);

  const handleNextStep = () => {
    if (fileId) {
      router.push(`/extract/${fileId}`);
    } else {
      console.error("FileId is undefined, cannot navigate to next step");
      setStatus('Error');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold mb-8">Converting Resume to JSON</h1>
      <p className="text-xl mb-4">Status: {status}</p>
      {fileId && <p className="text-md mb-4">File ID: {fileId}</p>}
      
      {status === 'Converting' && (
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      )}

      {status === 'Converted' && jsonData && (
        <div className="mt-8 w-full max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4">JSON Preview:</h2>
          <div className="bg-gray-100 p-4 rounded-md text-black overflow-auto max-h-[60vh]">
            <pre className="whitespace-pre-wrap">{JSON.stringify(jsonData, null, 2)}</pre>
          </div>
          <button
            onClick={handleNextStep}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Continue to Extraction
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