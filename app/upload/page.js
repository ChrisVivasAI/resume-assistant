'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log('File selected:', selectedFile?.name);
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      console.log('No file selected');
      setError('Please select a file');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      console.log('Preparing form data');
      const formData = new FormData();
      formData.append('file', file);

      console.log('Sending request to /api/upload');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorMessage = `HTTP error! status: ${response.status}`;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          throw new Error(errorData.error || errorMessage);
        } else {
          throw new Error(errorMessage);
        }
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        console.log('Upload successful, navigating to process page');
        router.push(`/process/${data.fileId}`);
      } else {
        throw new Error(data.error || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error during upload:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-3xl font-bold mb-8">Upload Your Resume</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <div className="mb-4">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
        <button
          type="submit"
          disabled={!file || isProcessing}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full disabled:opacity-50"
        >
          {isProcessing ? 'Processing...' : 'Upload and Process'}
        </button>
      </form>
    </div>
  );
}