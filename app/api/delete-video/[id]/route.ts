import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Missing video ID' }, { status: 400 });
  }

  try {
    const apiToken = '8552ca47b12939361650c1aa'; // Replace with your actual API token
    const response = await fetch(
      `https://upnshare.com/api/v1/video/manage/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'api-token': apiToken
        }
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: response.status });
    }

    return NextResponse.json({ message: 'Video deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
