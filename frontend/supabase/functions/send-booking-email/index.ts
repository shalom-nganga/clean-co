import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL');
const SITE_URL = Deno.env.get('SITE_URL');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    if (!body) {
      return new Response(JSON.stringify({ error: 'Empty request body' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { firstName, lastName, email, service, package: pkg, frequency, date, time, address, city, notes } = JSON.parse(body);

    // Email to customer
    const customerEmail = {
      from: 'CleanCo <onboarding@resend.dev>',
      to: email,
      subject: 'Your booking request has been received!',
      html: `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; color: #0f1a2e;">
          <div style="background: #0f1a2e; padding: 32px 40px;">
            <h1 style="color: #f9f8f5; font-size: 24px; margin: 0;">✦ CleanCo</h1>
          </div>
          <div style="padding: 40px;">
            <h2 style="font-size: 28px; margin-bottom: 8px;">Hi ${firstName}, you're all set!</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
              We've received your booking request and will confirm your appointment shortly. Here's a summary:
            </p>
            <div style="background: #f9f8f5; border-radius: 4px; padding: 24px; margin-bottom: 32px;">
              <table style="width: 100%; font-size: 15px; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #999; width: 40%;">Service</td><td style="color: #0f1a2e; font-weight: 500;">${service}</td></tr>
                <tr><td style="padding: 8px 0; color: #999;">Package</td><td style="color: #0f1a2e; font-weight: 500;">${pkg}</td></tr>
                <tr><td style="padding: 8px 0; color: #999;">Frequency</td><td style="color: #0f1a2e; font-weight: 500;">${frequency}</td></tr>
                <tr><td style="padding: 8px 0; color: #999;">Date</td><td style="color: #0f1a2e; font-weight: 500;">${date}</td></tr>
                <tr><td style="padding: 8px 0; color: #999;">Time</td><td style="color: #0f1a2e; font-weight: 500;">${time}</td></tr>
                <tr><td style="padding: 8px 0; color: #999;">Address</td><td style="color: #0f1a2e; font-weight: 500;">${address}, ${city}</td></tr>
              </table>
            </div>
            ${notes ? `<p style="color: #666; font-size: 14px;"><strong>Your notes:</strong> ${notes}</p>` : ''}
            <p style="color: #666; font-size: 15px; line-height: 1.6;">
              We'll be in touch soon to confirm everything. If you have any questions in the meantime, just reply to this email.
            </p>
            <p style="margin-top: 32px; color: #0f1a2e; font-size: 15px;">The CleanCo Team</p>
          </div>
          <div style="background: #f4f3f0; padding: 20px 40px; text-align: center;">
            <p style="color: #aaa; font-size: 12px; margin: 0;">© 2025 CleanCo. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    // Email to admin
    const adminEmail = {
      from: 'CleanCo Bookings <onboarding@resend.dev>',
      to: ADMIN_EMAIL,
      subject: `New booking request from ${firstName} ${lastName}`,
      html: `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; color: #0f1a2e;">
          <div style="background: #0f1a2e; padding: 32px 40px;">
            <h1 style="color: #f9f8f5; font-size: 24px; margin: 0;">✦ CleanCo — New Booking</h1>
          </div>
          <div style="padding: 40px;">
            <h2 style="font-size: 24px; margin-bottom: 24px;">New booking request received</h2>
            <div style="background: #f9f8f5; border-radius: 4px; padding: 24px;">
              <table style="width: 100%; font-size: 15px; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #999; width: 40%;">Client</td><td style="color: #0f1a2e; font-weight: 500;">${firstName} ${lastName}</td></tr>
                <tr><td style="padding: 8px 0; color: #999;">Email</td><td style="color: #0f1a2e; font-weight: 500;">${email}</td></tr>
                <tr><td style="padding: 8px 0; color: #999;">Service</td><td style="color: #0f1a2e; font-weight: 500;">${service}</td></tr>
                <tr><td style="padding: 8px 0; color: #999;">Package</td><td style="color: #0f1a2e; font-weight: 500;">${pkg}</td></tr>
                <tr><td style="padding: 8px 0; color: #999;">Frequency</td><td style="color: #0f1a2e; font-weight: 500;">${frequency}</td></tr>
                <tr><td style="padding: 8px 0; color: #999;">Date</td><td style="color: #0f1a2e; font-weight: 500;">${date}</td></tr>
                <tr><td style="padding: 8px 0; color: #999;">Time</td><td style="color: #0f1a2e; font-weight: 500;">${time}</td></tr>
                <tr><td style="padding: 8px 0; color: #999;">Address</td><td style="color: #0f1a2e; font-weight: 500;">${address}, ${city}</td></tr>
                ${notes ? `<tr><td style="padding: 8px 0; color: #999;">Notes</td><td style="color: #0f1a2e; font-weight: 500;">${notes}</td></tr>` : ''}
              </table>
            </div>
            <a href="${SITE_URL}/admin" style="display: inline-block; margin-top: 32px; background: #3ecfb0; color: #0f1a2e; padding: 14px 28px; text-decoration: none; border-radius: 2px; font-size: 14px; font-weight: 500;">View in Dashboard</a>
          </div>
        </div>
      `,
    };

    // Send both emails
    const [customerRes, adminRes] = await Promise.all([
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(customerEmail),
      }),
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(adminEmail),
      }),
    ]);

    const customerData = await customerRes.json();
    const adminData = await adminRes.json();

    return new Response(JSON.stringify({ customerData, adminData }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});