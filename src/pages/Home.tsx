import React from 'react';
import Hero from '../components/Hero';
import CoursesPreview from '../components/CoursesPreview';
import AboutPreview from '../components/AboutPreview';
import ContactPreview from '../components/ContactPreview';

const Home = () => {
  return (
    <>
      <Hero />
      <CoursesPreview />
      <AboutPreview />
      <ContactPreview />
    </>
  );
};

export default Home;