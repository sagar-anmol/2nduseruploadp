'use client';

import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import VideoGallery from '@/constants/VideoGallery';
import { cn } from '@/lib/utils';

type Video = {
  id: string;
  name: string;
  poster: string;
  preview?: string;
};

const VideosPage = () => {
  const [data, setData] = useState<Video[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/videos?page=${currentPage}&perPage=${perPage}`,
          {
            headers: {
              'Cache-Control':
                'no-store, no-cache, must-revalidate, proxy-revalidate',
              Pragma: 'no-cache',
              Expires: '0'
            }
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result.data);
        setTotalPages(result.metadata.maxPage);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchData();
  }, [currentPage, perPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="Videos" description="Manage Videos" />
          <Link
            href="/dashboard/thevideo/new"
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>

        <Separator />

        {/* Pass the fetched data to the client-side component */}
        <VideoGallery data={data} />

        {/* Pagination Controls */}
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            Previous
          </button>
          <span>{currentPage}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            Next
          </button>
        </div>
      </div>
    </PageContainer>
  );
};

export default VideosPage;
