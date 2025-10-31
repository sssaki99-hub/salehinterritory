
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Session, Subscription } from '@supabase/supabase-js';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Engineering from './pages/Engineering';
import EngineeringDetail from './pages/EngineeringDetail';
import Literature from './pages/Literature';
import LiteratureDetail from './pages/LiteratureDetail';
import Professional from './pages/Professional';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import { AdminContext } from './contexts/AdminContext';
import { Project, Writing, WorkExperience, Education, Certificate, Message, AdminSettings } from './types';
import { getProjects, getWritings, getWorkExperience, getEducation, getCertificates, getMessages, getSettings, onAuthChange } from './supabaseClient';

// FIX: Define initialSettings directly in the file to resolve the module not found error.
const initialSettings: AdminSettings = {
  commentsEnabled: true,
  ratingsEnabled: true,
  heroSection: {
    title: "Salehin's Territory",
    subtitle: "A Journey Through Code, Creativity, and Everything in Between",
  },
  footerContent: {
    copyright: `© ${new Date().getFullYear()} S.M. Samius Salehin. All rights reserved.`,
  },
  aboutMe: {
    name: "S.M. Samius Salehin",
    photoUrl: "https://i.imgur.com/example.png", // Placeholder
    bio: "I am a passionate software engineer and a creative writer with a knack for building beautiful and functional applications. This space is my canvas, where I showcase my projects, share my stories, and document my professional journey. Welcome!",
    professionalSummary: "A highly motivated and detail-oriented software engineer with experience in full-stack web development. Proficient in modern technologies like React, TypeScript, and Node.js. Passionate about creating efficient, scalable, and user-friendly solutions.",
  },
  contactDetails: {
    email: "contact@example.com",
    phone: "123-456-7890",
    facebook: "https://facebook.com/example",
    linkedin: "https://linkedin.com/in/example",
    location: "Dhaka, Bangladesh",
  }
};

const App: React.FC = () => {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [writings, setWritings] = useState<Writing[]>([]);
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<AdminSettings>(initialSettings);
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [
        projectsData, writingsData, workExperienceData, educationData,
        certificatesData, messagesData, settingsData
      ] = await Promise.all([
        getProjects(), getWritings(), getWorkExperience(), getEducation(),
        getCertificates(), getMessages(), getSettings()
      ]);
      
      setProjects(projectsData);
      setWritings(writingsData);
      setWorkExperience(workExperienceData);
      setEducation(educationData);
      setCertificates(certificatesData);
      setMessages(messagesData);
      if (settingsData) setSettings(settingsData);

    } catch (error) {
      console.error("Failed to fetch data:", error);
      alert("Could not connect to the database. Please check your Supabase credentials in supabaseClient.ts and ensure the service is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
    // FIX: The onAuthChange function returns an object with a 'subscription' property, not a 'data' property.
    // The destructuring has been corrected to { subscription } instead of { data: { subscription } }.
    const { subscription } = onAuthChange((session: Session | null) => {
      setIsAdmin(!!session);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [fetchAllData]);

  const adminContextValue = useMemo(() => ({
    isAdmin,
    setIsAdmin,
    settings,
    setSettings,
    projects,
    writings,
    workExperience,
    education,
    certificates,
    messages,
    refetchAllData: fetchAllData
  }), [isAdmin, settings, projects, writings, workExperience, education, certificates, messages, fetchAllData]);

  return (
    <AdminContext.Provider value={adminContextValue}>
      <div className="flex flex-col min-h-screen bg-dark-bg">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-accent"></div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/engineering" element={<Engineering />} />
                <Route path="/engineering/:id" element={<EngineeringDetail />} />
                <Route path="/literature" element={<Literature />} />
                <Route path="/literature/:id" element={<LiteratureDetail />} />
                <Route path="/professional" element={<Professional />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </AnimatePresence>
          )}
        </main>
        <Footer />
      </div>
    </AdminContext.Provider>
  );
};

export default App;
