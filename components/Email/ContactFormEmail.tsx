import React from 'react';

interface ContactFormEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  company?: string;
  service?: string;
}

export const ContactFormEmail: React.FC<Readonly<ContactFormEmailProps>> = ({ 
  name, 
  email, 
  subject, 
  message, 
  phone, 
  company, 
  service 
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333' }}>
    <h1 style={{ color: '#1a202c' }}>New Contact Form Submission</h1>
    <p>You have received a new message from your website contact form.</p>
    <hr style={{ borderColor: '#e2e8f0' }} />
    <h2 style={{ color: '#2d3748' }}>Message Details:</h2>
    <ul>
      <li><strong>Name:</strong> {name}</li>
      <li><strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a></li>
      {phone && <li><strong>Phone:</strong> {phone}</li>}
      {company && <li><strong>Company:</strong> {company}</li>}
      {service && <li><strong>Service of Interest:</strong> {service}</li>}
    </ul>
    <h3 style={{ color: '#2d3748' }}>Subject: {subject}</h3>
    <div style={{ padding: '10px', border: '1px solid #e2e8f0', borderRadius: '5px', backgroundColor: '#f7fafc' }}>
      <p style={{ margin: 0 }}>{message}</p>
    </div>
    <hr style={{ marginTop: '20px', borderColor: '#e2e8f0' }} />
    <p style={{ fontSize: '12px', color: '#718096' }}>This email was sent from your website's contact form.</p>
  </div>
);
