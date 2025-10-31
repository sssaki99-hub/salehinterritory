import { createContext, Dispatch, SetStateAction } from 'react';
import { Project, Writing, WorkExperience, Education, Certificate, Message, AboutMeSettings as AppAboutMeSettings } from '../types';

export interface HeroSectionSettings {
  title: string;
  subtitle: string;
}

export interface FooterContentSettings {
  copyright: string;
}

export interface AboutMeSettings extends AppAboutMeSettings {}

export interface ContactDetails {
    email: string;
    phone: string;
    facebook: string;
    linkedin: string;
    location: string;
}

export interface AdminSettings {
  commentsEnabled: boolean;
  ratingsEnabled: boolean;
  heroSection: HeroSectionSettings;
  footerContent: FooterContentSettings;
  aboutMe: AboutMeSettings;
  contactDetails: ContactDetails;
}

interface AdminContextType {
  isAdmin: boolean;
  setIsAdmin: Dispatch<SetStateAction<boolean>>;
  adminPassword: string;
  setAdminPassword: Dispatch<SetStateAction<string>>;
  settings: AdminSettings;
  setSettings: Dispatch<SetStateAction<AdminSettings>>;
  projects: Project[];
  setProjects: Dispatch<SetStateAction<Project[]>>;
  writings: Writing[];
  setWritings: Dispatch<SetStateAction<Writing[]>>;
  workExperience: WorkExperience[];
  setWorkExperience: Dispatch<SetStateAction<WorkExperience[]>>;
  education: Education[];
  setEducation: Dispatch<SetStateAction<Education[]>>;
  certificates: Certificate[];
  setCertificates: Dispatch<SetStateAction<Certificate[]>>;
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
}

export const AdminContext = createContext<AdminContextType | null>(null);