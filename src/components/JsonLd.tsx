import React from 'react';

interface JsonLdProps {
  type: 'MedicalBusiness' | 'BlogPosting' | 'FAQPage' | 'BreadcrumbList';
  data: any;
}

export const JsonLd = ({ type, data }: JsonLdProps) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};
