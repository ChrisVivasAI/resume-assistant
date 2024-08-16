'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProcessStatus({ params }) {
  const [status, setStatus] = useState('Processing');
  const [ocrText, setOcrText] = useState('');
  const router = useRouter();
  const { fileId } = params;

  console.log("FileId in ProcessStatus page:", fileId);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/process-status/${fileId}`);
        const data = await response.json();

        if (data.status === 'completed') {
          setStatus('Completed');
          setOcrText(data.ocrText);
        } else if (data.status === 'failed') {
          setStatus('Failed');
        } else {
          setStatus('Processing');
        }
      } catch (error) {
        console.error('Error checking status:', error);
        setStatus('Error');
      }
    };

    const interval = setInterval(checkStatus, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [fileId]);

  const handleNextStep = () => {
    console.log("Navigating to convert-to-json with fileId:", fileId);
    router.push(`/convert-to-json/${fileId}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold mb-8">Processing Resume</h1>
      <p className="text-xl mb-4">Status: {status}</p>
      
      {status === 'Processing' && (
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      )}

      {status === 'Completed' && (
        <div className="mt-8 w-full max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4">OCR Result Preview:</h2>
          <div className="bg-gray-100 p-4 rounded-md text-black overflow-auto max-h-[60vh]">
            <pre className="whitespace-pre-wrap">{ocrText}</pre>
          </div>
          <button
            onClick={handleNextStep}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Convert to JSON
          </button>
        </div>
      )}

      {status === 'Failed' && (
        <div className="mt-8">
          <p className="text-red-500">Processing failed. Please try again.</p>
          <Link href="/upload" className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block">
            Upload New File
          </Link>
        </div>
      )}

      {status === 'Error' && (
        <div className="mt-8">
          <p className="text-red-500">An error occurred. Please try again later.</p>
          <Link href="/" className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block">
            Go Back to Home
          </Link>
        </div>
      )}
    </div>
  );
}