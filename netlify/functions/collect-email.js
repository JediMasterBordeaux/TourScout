const { createClient } = require('@supabase/supabase-js');
const sgMail = require('@sendgrid/mail');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

    // Store in Supabase
    const { data, error } = await supabase
      .from('email_collection')
      .insert([
        { email, status: 'pending' }
      ]);

    if (error) {
      console.error('Supabase error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error storing email' })
      };
    }

    // Send confirmation email
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Welcome to Tour Scout!',
      text: `Thank you for signing up for Tour Scout! Here's your link to get started: ${process.env.TOUR_SCOUT_LINK}`,
      html: `
        <h1>Welcome to Tour Scout!</h1>
        <p>Thank you for signing up. We're excited to have you on board!</p>
        <p>Click the button below to get started with Tour Scout:</p>
        <a href="${process.env.TOUR_SCOUT_LINK}" style="
          display: inline-block;
          padding: 12px 24px;
          background-color: #2563eb;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          margin: 16px 0;
        ">Get Started with Tour Scout</a>
        <p>If you have any questions, feel free to reply to this email.</p>
      `
    };

    await sgMail.send(msg);

    // Sync with Google Sheets (optional)
    // You can add Google Sheets integration here if needed

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email collected and confirmation sent' })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}; 