'use client';

import { useRef, useState } from 'react';
import * as tus from 'tus-js-client';
import { Toaster, toast } from 'react-hot-toast';

export default function Upload() {
  const [uploading, setUploading] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const uploadRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('Only video files are allowed');
      return;
    }

    if (file.size > 6 * 1024 * 1024 * 1024) {
      toast.error('File exceeds the 6GB limit');
      return;
    }

    setSelectedFile(file);

    try {
      const res = await fetch('/api/get-upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, filetype: file.type }),
      });

      const { tusUrl, accessToken } = await res.json();

      if (!tusUrl || !accessToken) {
        toast.error('Invalid upload URL');
        return;
      }

      const upload = new tus.Upload(file, {
        endpoint: tusUrl,
        chunkSize: 52428800,
        metadata: {
          accessToken,
          filename: file.name,
          filetype: file.type,
          folderId: 'roua',
        },
        retryDelays: [0, 3000, 5000],
        onError: (error) => {
          console.error('Upload failed:', error);
          setUploading(false);
          toast.error('Upload failed: ' + error.message);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const percent = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          setProgress(percent);
        },
        onSuccess: () => {
          setUploading(false);
          setProgress(100);
          toast.success('Upload complete!');
        },
      });

      uploadRef.current = upload;
      setUploading(true);
      setPaused(false);
      upload.start();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Upload error');
    }
  };

  const handlePause = () => {
    if (uploadRef.current && uploading && !paused) {
      uploadRef.current.abort();
      setPaused(true);
      toast('Upload paused');
    }
  };

  const handleResume = () => {
    if (uploadRef.current && paused) {
      uploadRef.current.start();
      setPaused(false);
      toast('Upload resumed');
    }
  };

  const handleCancel = () => {
    if (uploadRef.current) {
      uploadRef.current.abort(true); // Remove the upload from the server
      uploadRef.current = null;
      setUploading(false);
      setPaused(false);
      setProgress(0);
      setSelectedFile(null);
      toast('Upload canceled');
    }
  };

  return (
    <>
      <Toaster position="top-center" />

      <div className="text-center mt-10 font-black text-3xl">Upload Content</div>

      <div className="flex items-center justify-center w-full p-10">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full max-w-xl h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition-all"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5A5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              MP4, MKV or MPEG (MAX. 6GB)
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept="video/mp4,video/x-matroska,video/mpeg"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {selectedFile && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-300 mt-2">
          Selected file: {selectedFile.name}
        </div>
      )}

      {uploading && (
        <div className="w-full max-w-md mx-auto mt-4">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                Uploading...
              </span>
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                {progress}%
              </span>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-800">
              <div
                style={{ width: `${progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"
              ></div>
            </div>

            <div className="flex justify-center gap-4 mt-2">
              <button
                onClick={handlePause}
                disabled={paused}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded disabled:opacity-50"
              >
                Pause
              </button>
              <button
                onClick={handleResume}
                disabled={!paused}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded disabled:opacity-50"
              >
                Resume
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
