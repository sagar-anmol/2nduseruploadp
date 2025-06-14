// /app/api/submit/route.js

export async function POST(req) {
  try {
    // Parse the JSON body from the incoming request
    const { url, name } = await req.json();

    // Check if both 'url' and 'name' are provided
    if (!url || !name) {
      return new Response(
        JSON.stringify({ message: 'Both URL and name are required.' }),
        { status: 400 }
      );
    }

    // Make the API request to 'upnshare'
    const response = await fetch(
      'https://upnshare.com/api/v1/video/advance-upload',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-token': '8552ca47b12939361650c1aa' // Include API token here
        },
        body: JSON.stringify({ url, name })
      }
    );

    // Check the API response
    if (!response.ok) {
      const errorData = await response.text();
      return new Response(
        JSON.stringify({ message: errorData || 'Failed to upload video.' }),
        { status: response.status }
      );
    }

    // Return the successful response from the API
    const data = await response.json();

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500
    });
  }
}
