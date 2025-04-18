exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { email } = JSON.parse(event.body);

    // Validate email
    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid email address' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email received successfully' })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}; 