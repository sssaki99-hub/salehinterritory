import React, { useState, useMemo } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

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
import { AdminContext, AdminSettings } from './contexts/AdminContext';
import { Project, Writing, WorkExperience, Education, Certificate, Message } from './types';

// All initial data is cleared to provide a blank slate for the user.
const initialProjects: Project[] = [];
const initialWritings: Writing[] = [];
const initialWorkExperience: WorkExperience[] = [];
const initialEducation: Education[] = [];
const initialCertificates: Certificate[] = [];
const initialMessages: Message[] = [];


const App: React.FC = () => {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('admin123');

  // Content states
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [writings, setWritings] = useState<Writing[]>(initialWritings);
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>(initialWorkExperience);
  const [education, setEducation] = useState<Education[]>(initialEducation);
  const [certificates, setCertificates] = useState<Certificate[]>(initialCertificates);
  const [messages, setMessages] = useState<Message[]>(initialMessages);


  const [settings, setSettings] = useState<AdminSettings>({
    commentsEnabled: true,
    ratingsEnabled: true,
    heroSection: {
      title: "Welcome to Your Territory",
      subtitle: "Edit this in the Admin Panel",
    },
    footerContent: {
      copyright: `© ${new Date().getFullYear()} S.M. Samius Salehin. All Rights Reserved.`,
    },
    aboutMe: {
        name: "S.M. Samius Salehin",
        photoUrl: "https://via.placeholder.com/400",
        bio: `This is a placeholder bio. You can update this text in the admin panel under Site Settings -> About Me Section. Talk about your passions, your journey, and what makes your work unique.`,
        professionalSummary: `This is a placeholder for your professional summary, which will appear on your CV. Keep it concise and impactful. You can edit this in the admin panel.`
    },
    contactDetails: {
        email: "your-email@example.com",
        phone: "+1 (000) 000-0000",
        facebook: "https://facebook.com",
        linkedin: "https://linkedin.com/in/",
        location: "Your City, Country"
    }
  });

  const adminContextValue = useMemo(() => ({
    isAdmin,
    setIsAdmin,
    adminPassword,
    setAdminPassword,
    settings,
    setSettings,
    projects,
    setProjects,
    writings,
    setWritings,
    workExperience,
    setWorkExperience,
    education,
    setEducation,
    certificates,
    setCertificates,
    messages,
    setMessages
  }), [isAdmin, adminPassword, settings, projects, writings, workExperience, education, certificates, messages]);

  return (
    <AdminContext.Provider value={adminContextValue}>
      <div className="flex flex-col min-h-screen bg-dark-bg">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        </main>
        <Footer />
      </div>
    </AdminContext.Provider>
  );
};

export default App;