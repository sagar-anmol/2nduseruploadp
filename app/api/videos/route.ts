import { NextRequest, NextResponse } from 'next/server';

async function getVideoData(page: number, perPage: number) {
  const response = await fetch(
    `https://upnshare.com/api/v1/video/manage?status=Active&page=${page}&timestamp=${Date.now()}`, // Add timestamp
    {
      method: 'GET',
      headers: {
        'api-token': '8552ca47b12939361650c1aa'
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  const result = await response.json();
  return result;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const perPage = parseInt(searchParams.get('perPage') || '20', 10);

  try {
    const data = await getVideoData(page, perPage);

    // Filter the data to return only id, name, poster, and preview
    const filteredData = data.data.map((video: any) => ({
      id: video.id,
      name: video.name,
      poster: video.poster,
      preview: video.preview
    }));

    return NextResponse.json(
      {
        data: filteredData,
        metadata: {
          total: data.metadata.total,
          perPage: data.metadata.perPage,
          currentPage: data.metadata.currentPage,
          maxPage: data.metadata.maxPage,
          offset: data.metadata.offset
        }
      },
      {
        headers: {
          'Cache-Control':
            'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0'
        }
      }
    );
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
