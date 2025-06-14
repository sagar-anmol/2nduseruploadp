'use client';

import { useState } from 'react';

type Video = {
  id: string;
  name: string;
  poster: string;
  preview?: string;
};

type VideoGalleryProps = {
  data: Video[];
};

const VideoGallery = ({ data }: VideoGalleryProps) => {
  const [copiedVideoId, setCopiedVideoId] = useState<string | null>(null);
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);

  // Handle Delete
  const handleDelete = async (videoId: string) => {
    setDeletingVideoId(videoId);

    try {
      const response = await fetch(`/api/delete-video/${videoId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const { error } = await response.json();
        alert(`Failed to delete video: ${error}`);
        return;
      }

      alert('Video deleted successfully');
      // Optionally, remove the deleted video from UI
      window.location.reload(); // Or filter the data state
    } catch (error) {
      alert('Something went wrong.');
    } finally {
      setDeletingVideoId(null);
    }
  };

  // Handle Embed
  const handleEmbedClick = (id: string) => {
    const embedUrl = `https://rdflix.online/#${id}`;
    navigator.clipboard.writeText(embedUrl).then(() => {
      setCopiedVideoId(id);
      alert('Embed URL copied to clipboard!');
      setTimeout(() => setCopiedVideoId(null), 2000); // Reset after 2 seconds
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((video) => {
        const videoUrl = `https://rdflix.online/#${video.id}`;
        const base = 'https://rdflix.online';

        return (
          <div key={video.id} className="group relative">
            <img
              src={`${base}${video.poster}`}
              alt={video.name}
              className="h-auto w-full rounded-lg transition-opacity duration-300 group-hover:opacity-0"
            />
            {video.preview ? (
              <video
                src={`${base}${video.preview}`}
                className="absolute left-0 top-0 hidden h-full w-full rounded-lg group-hover:block"
                autoPlay
                muted
                loop
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-75 text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                No preview available
              </div>
            )}
            <div className="mt-2 text-center">
              <p className="truncate text-sm font-medium">{video.name}</p>
            </div>
            <button
              onClick={() => handleEmbedClick(video.id)}
              className="absolute right-2 top-2 rounded-full bg-blue-600 p-2 text-white transition hover:bg-blue-500"
            >
              {copiedVideoId === video.id ? 'Copied!' : 'Embed'}
            </button>
            {/*<button
              onClick={() => handleDelete(video.id)}
              className="absolute bottom-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-500 transition"
              disabled={deletingVideoId === video.id}
            >
              {deletingVideoId === video.id ? 'Deleting...' : 'Delete'}
            </button>*/}
          </div>
        );
      })}
    </div>
  );
};

export default VideoGallery;
