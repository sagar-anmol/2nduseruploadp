// /app/api/get-upload-url/route.js

export async function POST(req) {
  try {
    const { filename, filetype } = await req.json();

    const response = await fetch('https://upnshare.com/api/v1/video/upload', {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'api-token': '8552ca47b12939361650c1aa',
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return new Response(JSON.stringify({ error }), { status: response.status });
    }

    const data = await response.json(); // should return { uploadUrl, accessToken }

    return new Response(
      JSON.stringify({
        tusUrl: data.tusUrl,
        accessToken: data.accessToken,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
