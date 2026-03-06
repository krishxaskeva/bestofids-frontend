import React from 'react';
import Section from './Section';
import Breadcrumb from './Breadcrumb';
import { pageTitle } from '../utils/PageTitle';

export default function Blog() {
  pageTitle('ID Education & Knowledge Hub');
  return (
    <>
      <Section topMd={140} topLg={95} topXl={75} bottomMd={24} bottomLg={20}>
        <Breadcrumb title="ID Education & Knowledge Hub" />
      </Section>
      <Section
        topMd={0}
        topLg={0}
        topXl={0}
        bottomMd={200}
        bottomLg={150}
        bottomXl={110}
      >
        <div className="container text-center">
          <p className="cs_muted mb-0">Content coming soon.</p>
        </div>
      </Section>
    </>
  );
}
