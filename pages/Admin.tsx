import React, { useState, useContext, ChangeEvent, FormEvent } from 'react';
import PageWrapper from '../components/PageWrapper';
import { AdminContext } from '../contexts/AdminContext';
import { Project, Writing, WorkExperience, Education, Certificate, WritingGenre, WritingCategory, Episode, Message } from '../types';
import { FiTrash2, FiEye } from 'react-icons/fi';

type AdminTab = 'Dashboard' | 'Inbox' | 'Settings' | 'Projects' | 'Literature' | 'Professional';

// Reusable component for form fields
const FormField: React.FC<{label: string, name: string, value: string, onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void, type?: string, required?: boolean, rows?: number, options?: string[], autoComplete?: string}> = 
({label, name, value, onChange, type = 'text', required = true, rows, options, autoComplete = 'off'}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-300">{label}</label>
        {type === 'textarea' ? (
            <textarea id={name} name={name} value={value} onChange={onChange} required={required} rows={rows || 4} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md p-2 text-white focus:ring-primary-accent focus:border-primary-accent" />
        ) : type === 'select' && options ? (
            <select id={name} name={name} value={value} onChange={onChange} required={required} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md p-2 text-white focus:ring-primary-accent focus:border-primary-accent">
                <option value="" disabled>Select a {label.toLowerCase()}</option>
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        ) : (
            <input id={name} type={type} name={name} value={value} onChange={onChange} required={required} autoComplete={autoComplete} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md p-2 text-white focus:ring-primary-accent focus:border-primary-accent" />
        )}
    </div>
);

// Generic CRUD section component
const CrudSection: React.FC<{
    title: string;
    items: any[];
    onDelete: (id: string) => Promise<void>;
    setEditingItem: (item: any | null) => void;
    renderItem: (item: any) => React.ReactNode;
    isSubmitting: boolean;
}> = ({ title, items, onDelete, setEditingItem, renderItem, isSubmitting }) => (
    <section className="bg-slate-800 p-6 rounded-lg mb-8">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{title}</h2>
            <button onClick={() => setEditingItem({})} disabled={isSubmitting} className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-500">Add New</button>
        </div>
        <div className="space-y-4">
            {items.map(item => (
                <div key={item.id} className="bg-slate-700 p-4 rounded flex justify-between items-center">
                    <div>{renderItem(item)}</div>
                    <div>
                        <button onClick={() => setEditingItem(item)} disabled={isSubmitting} className="text-yellow-400 hover:text-yellow-300 mr-4 font-semibold disabled:text-gray-500">Edit</button>
                        <button onClick={() => onDelete(item.id)} disabled={isSubmitting} className="text-red-500 hover:text-red-400 font-semibold disabled:text-gray-500">Delete</button>
                    </div>
                </div>
            ))}
             {items.length === 0 && <p className="text-gray-400">No items yet. Click "Add New" to get started.</p>}
        </div>
    </section>
);

const AdminDashboard = () => {
    const adminContext = useContext(AdminContext);
    const [activeTab, setActiveTab] = useState<AdminTab>('Dashboard');
    const [currentSettings, setCurrentSettings] = useState(adminContext!.settings);
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
    const [passwordFields, setPasswordFields] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);


    // State for CRUD operations
    const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
    const [editingWriting, setEditingWriting] = useState<Partial<Writing> | null>(null);
    const [editingWorkExperience, setEditingWorkExperience] = useState<Partial<WorkExperience> | null>(null);
    const [editingEducation, setEditingEducation] = useState<Partial<Education> | null>(null);
    const [editingCertificate, setEditingCertificate] = useState<Partial<Certificate> | null>(null);
    
    // Generic form handler
    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, setter: React.Dispatch<React.SetStateAction<any>>) => {
        setter((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Generic file to base64 converter
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    }

    // A helper for simulated async operations
    const fakeApiCall = () => new Promise(resolve => setTimeout(resolve, 500));

    // Save/Delete handlers
    const handleProjectSave = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // TODO: Replace with Supabase client call (insert or update)
            await fakeApiCall();
            const project = editingProject as Project;
            if (project.id) { // Update
                adminContext?.setProjects(prev => prev.map(p => p.id === project.id ? project : p));
            } else { // Create
                adminContext?.setProjects(prev => [...prev, { ...project, id: `proj_${Date.now()}`, comments: [], ratings: [] }]);
            }
            setEditingProject(null);
        } catch (error) {
            console.error("Failed to save project:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleProjectDelete = async (id: string) => {
       if (!window.confirm('Are you sure you want to delete this project?')) return;
       setIsSubmitting(true);
       try {
            // TODO: Replace with Supabase client call (delete)
            await fakeApiCall();
            adminContext?.setProjects(prev => prev.filter(p => p.id !== id));
       } catch(error){
            console.error("Failed to delete project:", error);
       } finally {
            setIsSubmitting(false);
       }
    };
    
    const handleWritingSave = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // TODO: Replace with Supabase client call (insert or update)
            await fakeApiCall();
            let writing = editingWriting as Writing;
            
            if (writing.category === WritingCategory.Novel) {
                if (!Array.isArray(writing.content)) writing.content = [];
            } else {
                if (Array.isArray(writing.content)) writing.content = '';
            }

            if (writing.id) { // Update
                adminContext?.setWritings(prev => prev.map(w => w.id === writing.id ? writing : w));
            } else { // Create
                adminContext?.setWritings(prev => [...prev, { ...writing, id: `writ_${Date.now()}`, comments: [], ratings: [] }]);
            }
            setEditingWriting(null);
        } catch(error) {
            console.error("Failed to save writing:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleWritingDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this literary work?')) return;
        setIsSubmitting(true);
        try {
            // TODO: Replace with Supabase client call (delete)
            await fakeApiCall();
            adminContext?.setWritings(prev => prev.filter(w => w.id !== id));
        } catch(error) {
            console.error("Failed to delete writing:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleWorkExperienceSave = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // TODO: Replace with Supabase client call (insert or update)
            await fakeApiCall();
            const exp = editingWorkExperience as WorkExperience;
            const finalExp = {...exp, description: typeof exp.description === 'string' ? (exp.description as string).split('\n') : exp.description};
            if (exp.id) {
                adminContext?.setWorkExperience(prev => prev.map(w => w.id === exp.id ? finalExp : w));
            } else {
                adminContext?.setWorkExperience(prev => [...prev, { ...finalExp, id: `work_${Date.now()}` }]);
            }
            setEditingWorkExperience(null);
        } catch(error) {
             console.error("Failed to save work experience:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleWorkExperienceDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this work experience?')) return;
        setIsSubmitting(true);
        try {
             // TODO: Replace with Supabase client call (delete)
            await fakeApiCall();
            adminContext?.setWorkExperience(prev => prev.filter(w => w.id !== id));
        } catch(error) {
            console.error("Failed to delete work experience:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleEducationSave = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // TODO: Replace with Supabase client call (insert or update)
            await fakeApiCall();
            const edu = editingEducation as Education;
            if (edu.id) {
                adminContext?.setEducation(prev => prev.map(ed => ed.id === edu.id ? edu : ed));
            } else {
                adminContext?.setEducation(prev => [...prev, { ...edu, id: `edu_${Date.now()}` }]);
            }
            setEditingEducation(null);
        } catch(error) {
            console.error("Failed to save education:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEducationDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this education entry?')) return;
        setIsSubmitting(true);
        try {
            // TODO: Replace with Supabase client call (delete)
            await fakeApiCall();
            adminContext?.setEducation(prev => prev.filter(e => e.id !== id));
        } catch(error) {
            console.error("Failed to delete education:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleCertificateSave = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
             // TODO: Replace with Supabase client call (insert or update)
            await fakeApiCall();
            const cert = editingCertificate as Certificate;
            if (cert.id) {
                adminContext?.setCertificates(prev => prev.map(c => c.id === cert.id ? cert : c));
            } else {
                adminContext?.setCertificates(prev => [...prev, { ...cert, id: `cert_${Date.now()}` }]);
            }
            setEditingCertificate(null);
        } catch(error) {
            console.error("Failed to save certificate:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleCertificateDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this certificate?')) return;
        setIsSubmitting(true);
        try {
            // TODO: Replace with Supabase client call (delete)
            await fakeApiCall();
            adminContext?.setCertificates(prev => prev.filter(c => c.id !== id));
        } catch(error) {
            console.error("Failed to delete certificate:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>, fieldName: string) => {
        const file = e.target.files?.[0];
        if (file) {
            // TODO: Replace with Supabase Storage upload, then get the URL
            const base64 = await fileToBase64(file);
            handleSettingsChange({ target: { name: fieldName, value: base64 } } as any);
        }
    };
    
    const handleMultiplePhotoUpload = async (e: ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<any>>) => {
        const files = e.target.files;
        if(files) {
             // TODO: Replace with multiple Supabase Storage uploads, then get the URLs
            const base64Promises = Array.from(files).map((file: File) => fileToBase64(file));
            const base64Images = await Promise.all(base64Promises);
            setter((prev: any) => ({ ...prev, images: base64Images }));
        }
    }

    const handleSinglePhotoUpload = async (e: ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<any>>, field: string) => {
        const file = e.target.files?.[0];
        if (file) {
            // TODO: Replace with Supabase Storage upload, then get the URL
            const base64 = await fileToBase64(file);
            setter((prev: any) => ({ ...prev, [field]: base64 }));
        }
    }

    const handleSettingsChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const keys = name.split('.');
        if (keys.length === 2) {
            const [section, field] = keys;
            setCurrentSettings(prev => ({ ...prev, [section]: { ...prev[section as keyof typeof prev], [field]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value } }));
        } else {
             setCurrentSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
        }
    };
    const saveSettings = async () => {
        setIsSubmitting(true);
        try {
            // TODO: Replace with Supabase client call to save settings
            await fakeApiCall();
            adminContext?.setSettings(currentSettings);
            alert('Settings saved!');
        } catch(error) {
            console.error("Failed to save settings:", error);
            alert('Failed to save settings.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
     const handleEpisodeChange = (index: number, field: 'title' | 'content', value: string) => {
        setEditingWriting(prev => {
            if (!prev || !Array.isArray(prev.content)) return prev;
            const newContent = [...prev.content];
            newContent[index] = { ...newContent[index], [field]: value };
            return { ...prev, content: newContent };
        });
    };

    const addEpisode = () => {
        setEditingWriting(prev => {
            if (!prev) return prev;
            const currentContent = Array.isArray(prev.content) ? prev.content : [];
            const newEpisode: Episode = {
                id: `ep_${Date.now()}`,
                episodeNumber: currentContent.length + 1,
                title: '',
                content: ''
            };
            return { ...prev, content: [...currentContent, newEpisode] };
        });
    };

    const removeEpisode = (index: number) => {
        setEditingWriting(prev => {
            if (!prev || !Array.isArray(prev.content)) return prev;
            const newContent = prev.content.filter((_, i) => i !== index);
            return { ...prev, content: newContent };
        });
    };
    
    const handleMessageToggle = (id: string) => {
        setSelectedMessageId(prevId => (prevId === id ? null : id));
        // TODO: Replace with Supabase client call to mark message as read
        adminContext?.setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, read: true } : msg));
    };

    const handleDeleteMessage = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            // TODO: Replace with Supabase client call to delete message
            adminContext?.setMessages(prev => prev.filter(msg => msg.id !== id));
        }
    };

    const handlePasswordFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPasswordFields(prev => ({...prev, [e.target.name]: e.target.value}));
        setPasswordMessage({ type: '', text: '' });
    }

    const handlePasswordSave = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // TODO: Replace with Supabase Auth call to update password
            await fakeApiCall();
            if (passwordFields.currentPassword !== adminContext?.adminPassword) {
                setPasswordMessage({ type: 'error', text: 'Current password is not correct.' });
                return;
            }
            if (!passwordFields.newPassword || passwordFields.newPassword.length < 6) {
                 setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
                return;
            }
            if (passwordFields.newPassword !== passwordFields.confirmPassword) {
                setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
                return;
            }

            adminContext?.setAdminPassword(passwordFields.newPassword);
            setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
            setPasswordFields({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch(error) {
             console.error("Failed to update password:", error);
             setPasswordMessage({ type: 'error', text: 'An error occurred. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    }

    const unreadMessagesCount = adminContext!.messages.filter(m => !m.read).length;

    const renderContent = () => {
        switch(activeTab) {
            case 'Dashboard':
                return (
                     <section>
                        <h2 className="text-2xl font-bold mb-4">Statistics</h2>
                        <div className="bg-slate-800 p-4 rounded-lg h-80 flex items-center justify-center">
                            <p className="text-gray-400">Statistics will be displayed here once your content receives ratings and comments.</p>
                        </div>
                    </section>
                );
            case 'Inbox':
                const sortedMessages = [...adminContext!.messages].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                return (
                     <section className="bg-slate-800 p-6 rounded-lg">
                        <h2 className="text-2xl font-bold mb-6">Inbox</h2>
                        <div className="space-y-4">
                            {sortedMessages.map(msg => (
                                <div key={msg.id} className="bg-slate-700 rounded-lg overflow-hidden">
                                    <div className={`p-4 flex justify-between items-center cursor-pointer hover:bg-slate-600 ${!msg.read ? 'font-bold' : ''}`} onClick={() => handleMessageToggle(msg.id)}>
                                        <div className="flex items-center gap-4">
                                            {!msg.read && <div className="w-2 h-2 rounded-full bg-primary-accent"></div>}
                                            <p className="w-48 truncate">{msg.name}</p>
                                            <p className="flex-1 truncate text-gray-400">{msg.message}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <p className="text-sm text-gray-500">{new Date(msg.timestamp).toLocaleDateString()}</p>
                                            <button onClick={(e) => { e.stopPropagation(); handleDeleteMessage(msg.id); }} className="text-red-500 hover:text-red-400"><FiTrash2 size={18} /></button>
                                        </div>
                                    </div>
                                    {selectedMessageId === msg.id && (
                                        <div className="p-4 border-t border-slate-600">
                                            <p className="font-semibold">From: <a href={`mailto:${msg.email}`} className="text-indigo-400 hover:underline">{msg.name} ({msg.email})</a></p>
                                            <p className="mt-4 whitespace-pre-wrap">{msg.message}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {sortedMessages.length === 0 && <p className="text-gray-400 text-center py-4">Your inbox is empty.</p>}
                        </div>
                    </section>
                );
            case 'Settings':
                 return (
                    <section className="bg-slate-800 p-6 rounded-lg space-y-8">
                        <h2 className="text-2xl font-bold mb-6">Site Settings</h2>
                        <div>
                            <h3 className="text-xl text-indigo-400 mb-4">General</h3>
                            <label className="flex items-center space-x-3"><input type="checkbox" name="commentsEnabled" checked={currentSettings.commentsEnabled} onChange={handleSettingsChange} className="form-checkbox h-5 w-5 text-primary-accent bg-slate-700 border-slate-600 rounded focus:ring-primary-accent" /><span>Enable Comments</span></label>
                            <label className="flex items-center space-x-3 mt-2"><input type="checkbox" name="ratingsEnabled" checked={currentSettings.ratingsEnabled} onChange={handleSettingsChange} className="form-checkbox h-5 w-5 text-primary-accent bg-slate-700 border-slate-600 rounded focus:ring-primary-accent" /><span>Enable Ratings</span></label>
                        </div>
                        <div>
                            <h3 className="text-xl text-indigo-400 mb-4">About Me Section</h3>
                            <div className="space-y-4">
                                <FormField label="Full Name (for CV)" name="aboutMe.name" value={currentSettings.aboutMe.name} onChange={handleSettingsChange} />
                                <div>
                                    <label className="block text-sm font-medium text-gray-300">Profile Photo</label>
                                    <div className="mt-1 flex items-center gap-4">
                                        <img src={currentSettings.aboutMe.photoUrl} alt="Preview" className="w-20 h-20 rounded-full object-cover" />
                                        <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, 'aboutMe.photoUrl')} className="block text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-accent file:text-white hover:file:bg-opacity-80" />
                                    </div>
                                </div>
                                <div><label className="block text-sm font-medium text-gray-300">Bio (for Homepage)</label><textarea name="aboutMe.bio" value={currentSettings.aboutMe.bio} onChange={handleSettingsChange} rows={6} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md p-2" /></div>
                                <div><label className="block text-sm font-medium text-gray-300">Professional Summary (for CV)</label><textarea name="aboutMe.professionalSummary" value={currentSettings.aboutMe.professionalSummary} onChange={handleSettingsChange} rows={4} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md p-2" /></div>
                            </div>
                        </div>
                         <div>
                            <h3 className="text-xl text-indigo-400 mb-4">Contact Information</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField label="Email" name="contactDetails.email" value={currentSettings.contactDetails.email} onChange={handleSettingsChange} type="email" />
                                <FormField label="Phone" name="contactDetails.phone" value={currentSettings.contactDetails.phone} onChange={handleSettingsChange} />
                                <FormField label="Facebook URL" name="contactDetails.facebook" value={currentSettings.contactDetails.facebook} onChange={handleSettingsChange} />
                                <FormField label="LinkedIn URL" name="contactDetails.linkedin" value={currentSettings.contactDetails.linkedin} onChange={handleSettingsChange} />
                                <FormField label="Location" name="contactDetails.location" value={currentSettings.contactDetails.location} onChange={handleSettingsChange} />
                             </div>
                        </div>
                        <div>
                             <h3 className="text-xl text-indigo-400 mb-4">Security</h3>
                             <form onSubmit={handlePasswordSave} className="space-y-4 max-w-md">
                                 <FormField label="Current Password" name="currentPassword" value={passwordFields.currentPassword} onChange={handlePasswordFormChange} type="password" autoComplete="current-password" />
                                 <FormField label="New Password" name="newPassword" value={passwordFields.newPassword} onChange={handlePasswordFormChange} type="password" autoComplete="new-password" />
                                 <FormField label="Confirm New Password" name="confirmPassword" value={passwordFields.confirmPassword} onChange={handlePasswordFormChange} type="password" autoComplete="new-password" />
                                 {passwordMessage.text && (
                                     <p className={`text-sm ${passwordMessage.type === 'success' ? 'text-green-400' : 'text-red-500'}`}>{passwordMessage.text}</p>
                                 )}
                                 <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-500">{isSubmitting ? 'Saving...' : 'Change Password'}</button>
                             </form>
                        </div>
                        <button onClick={saveSettings} disabled={isSubmitting} className="mt-6 bg-primary-accent text-white font-bold py-2 px-4 rounded hover:bg-opacity-80 disabled:bg-gray-500">{isSubmitting ? 'Saving...' : 'Save All Settings'}</button>
                    </section>
                );
            case 'Projects':
                return editingProject ? (
                    <form onSubmit={handleProjectSave} className="bg-slate-800 p-6 rounded-lg space-y-4">
                        <h2 className="text-2xl font-bold mb-4">{editingProject.id ? 'Edit' : 'Add'} Project</h2>
                        <FormField label="Title" name="title" value={editingProject.title || ''} onChange={(e) => handleFormChange(e, setEditingProject)} />
                        <FormField label="Description" name="description" value={editingProject.description || ''} onChange={(e) => handleFormChange(e, setEditingProject)} type="textarea" />
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Project Images</label>
                             <input type="file" multiple accept="image/*" onChange={(e) => handleMultiplePhotoUpload(e, setEditingProject)} className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-accent file:text-white hover:file:bg-opacity-80" />
                            <div className="mt-2 flex gap-2 flex-wrap">
                                {editingProject.images?.map((img, i) => <img key={i} src={img} className="w-24 h-24 object-cover rounded" />)}
                            </div>
                        </div>
                        <FormField label="Demo Video URL" name="demoVideoUrl" value={editingProject.demoVideoUrl || ''} onChange={(e) => handleFormChange(e, setEditingProject)} required={false} />
                        <FormField label="PDF URL" name="pdfUrl" value={editingProject.pdfUrl || ''} onChange={(e) => handleFormChange(e, setEditingProject)} required={false} />
                        <div className="flex space-x-4"><button type="submit" disabled={isSubmitting} className="bg-primary-accent text-white font-bold py-2 px-4 rounded disabled:bg-gray-500">{isSubmitting ? 'Saving...' : 'Save'}</button><button type="button" onClick={() => setEditingProject(null)} className="bg-gray-500 text-white font-bold py-2 px-4 rounded">Cancel</button></div>
                    </form>
                ) : ( <CrudSection title="Engineering Projects" items={adminContext!.projects} onDelete={handleProjectDelete} setEditingItem={setEditingProject} renderItem={(item) => <p>{item.title}</p>} isSubmitting={isSubmitting}/> );
            case 'Literature':
                return editingWriting ? (
                     <form onSubmit={handleWritingSave} className="bg-slate-800 p-6 rounded-lg space-y-4">
                        <h2 className="text-2xl font-bold mb-4">{editingWriting.id ? 'Edit' : 'Add'} Literary Work</h2>
                        <FormField label="Title" name="title" value={editingWriting.title || ''} onChange={(e) => handleFormChange(e, setEditingWriting)} />
                        <FormField label="Category" name="category" value={editingWriting.category || ''} onChange={(e) => handleFormChange(e, setEditingWriting)} type="select" options={Object.values(WritingCategory)} />
                        <FormField label="Genre" name="genre" value={editingWriting.genre || ''} onChange={(e) => handleFormChange(e, setEditingWriting)} type="select" options={Object.values(WritingGenre)} />
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Cover Image</label>
                            <input type="file" accept="image/*" onChange={(e) => handleSinglePhotoUpload(e, setEditingWriting, 'coverImage')} className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-accent file:text-white hover:file:bg-opacity-80" />
                            {editingWriting.coverImage && <img src={editingWriting.coverImage} className="mt-2 w-24 h-36 object-cover rounded" />}
                        </div>
                        <FormField label="Summary" name="summary" value={editingWriting.summary || ''} onChange={(e) => handleFormChange(e, setEditingWriting)} type="textarea" />
                        
                        {editingWriting.category === WritingCategory.Novel ? (
                            <div>
                                <h3 className="text-xl font-bold mt-6 mb-4">Episodes</h3>
                                <div className="space-y-4">
                                    {(Array.isArray(editingWriting.content) ? editingWriting.content : []).map((ep, index) => (
                                        <div key={ep.id} className="bg-slate-700 p-4 rounded-lg space-y-2">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-bold">Episode {index + 1}</h4>
                                                <button type="button" onClick={() => removeEpisode(index)} className="text-red-500 hover:text-red-400">Remove</button>
                                            </div>
                                            <FormField label="Episode Title" name={`ep_title_${index}`} value={ep.title} onChange={e => handleEpisodeChange(index, 'title', e.target.value)} />
                                            <FormField label="Episode Content" name={`ep_content_${index}`} value={ep.content} onChange={e => handleEpisodeChange(index, 'content', e.target.value)} type="textarea" rows={6} />
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={addEpisode} className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600">Add Episode</button>
                            </div>
                        ) : (
                             <FormField label="Content" name="content" value={editingWriting.content as string || ''} onChange={(e) => handleFormChange(e, setEditingWriting)} type="textarea" rows={10} />
                        )}

                        <FormField label="YouTube Audiobook URL" name="youtubeAudiobookUrl" value={editingWriting.youtubeAudiobookUrl || ''} onChange={(e) => handleFormChange(e, setEditingWriting)} required={false} />
                        <div className="flex space-x-4 mt-6"><button type="submit" disabled={isSubmitting} className="bg-primary-accent text-white font-bold py-2 px-4 rounded disabled:bg-gray-500">{isSubmitting ? 'Saving...' : 'Save'}</button><button type="button" onClick={() => setEditingWriting(null)} className="bg-gray-500 text-white font-bold py-2 px-4 rounded">Cancel</button></div>
                    </form>
                ) : ( <CrudSection title="Literary Works" items={adminContext!.writings} onDelete={handleWritingDelete} setEditingItem={setEditingWriting} renderItem={(item) => <p>{item.title} <span className="text-xs bg-gray-600 px-2 py-1 rounded-full ml-2">{item.category}</span></p>} isSubmitting={isSubmitting} /> );
            case 'Professional':
                return (
                    <div>
                        {editingWorkExperience ? (
                             <form onSubmit={handleWorkExperienceSave} className="bg-slate-800 p-6 rounded-lg space-y-4 mb-8">
                                <h2 className="text-2xl font-bold mb-4">{editingWorkExperience.id ? 'Edit' : 'Add'} Work Experience</h2>
                                <FormField label="Role" name="role" value={editingWorkExperience.role || ''} onChange={e => handleFormChange(e, setEditingWorkExperience)} />
                                <FormField label="Company" name="company" value={editingWorkExperience.company || ''} onChange={e => handleFormChange(e, setEditingWorkExperience)} />
                                <FormField label="Period" name="period" value={editingWorkExperience.period || ''} onChange={e => handleFormChange(e, setEditingWorkExperience)} />
                                <FormField label="Description (one point per line)" name="description" value={Array.isArray(editingWorkExperience.description) ? editingWorkExperience.description.join('\n') : editingWorkExperience.description || ''} onChange={e => handleFormChange(e, setEditingWorkExperience)} type="textarea" />
                                <div className="flex space-x-4"><button type="submit" disabled={isSubmitting} className="bg-primary-accent text-white font-bold py-2 px-4 rounded disabled:bg-gray-500">{isSubmitting ? 'Saving...' : 'Save'}</button><button type="button" onClick={() => setEditingWorkExperience(null)} className="bg-gray-500 text-white font-bold py-2 px-4 rounded">Cancel</button></div>
                            </form>
                        ) : ( <CrudSection title="Work Experience" items={adminContext!.workExperience} onDelete={handleWorkExperienceDelete} setEditingItem={setEditingWorkExperience} renderItem={(item) => <p>{item.role} at {item.company}</p>} isSubmitting={isSubmitting} /> )}
                        
                        {editingEducation ? (
                            <form onSubmit={handleEducationSave} className="bg-slate-800 p-6 rounded-lg space-y-4 mb-8">
                                <h2 className="text-2xl font-bold mb-4">{editingEducation.id ? 'Edit' : 'Add'} Education</h2>
                                <FormField label="Degree" name="degree" value={editingEducation.degree || ''} onChange={e => handleFormChange(e, setEditingEducation)} />
                                <FormField label="Institution" name="institution" value={editingEducation.institution || ''} onChange={e => handleFormChange(e, setEditingEducation)} />
                                <FormField label="Period" name="period" value={editingEducation.period || ''} onChange={e => handleFormChange(e, setEditingEducation)} />
                                <FormField label="Details" name="details" value={editingEducation.details || ''} onChange={e => handleFormChange(e, setEditingEducation)} type="textarea" />
                                <div className="flex space-x-4"><button type="submit" disabled={isSubmitting} className="bg-primary-accent text-white font-bold py-2 px-4 rounded disabled:bg-gray-500">{isSubmitting ? 'Saving...' : 'Save'}</button><button type="button" onClick={() => setEditingEducation(null)} className="bg-gray-500 text-white font-bold py-2 px-4 rounded">Cancel</button></div>
                            </form>
                        ) : ( <CrudSection title="Educational Background" items={adminContext!.education} onDelete={handleEducationDelete} setEditingItem={setEditingEducation} renderItem={(item) => <p>{item.degree} from {item.institution}</p>} isSubmitting={isSubmitting} /> )}

                        {editingCertificate ? (
                            <form onSubmit={handleCertificateSave} className="bg-slate-800 p-6 rounded-lg space-y-4">
                                <h2 className="text-2xl font-bold mb-4">{editingCertificate.id ? 'Edit' : 'Add'} Certificate</h2>
                                <FormField label="Name" name="name" value={editingCertificate.name || ''} onChange={e => handleFormChange(e, setEditingCertificate)} />
                                <FormField label="Issuer" name="issuer" value={editingCertificate.issuer || ''} onChange={e => handleFormChange(e, setEditingCertificate)} />
                                <FormField label="Date" name="date" value={editingCertificate.date || ''} onChange={e => handleFormChange(e, setEditingCertificate)} />
                                <FormField label="Credential URL" name="credentialUrl" value={editingCertificate.credentialUrl || ''} onChange={e => handleFormChange(e, setEditingCertificate)} required={false} />
                                <div className="flex space-x-4"><button type="submit" disabled={isSubmitting} className="bg-primary-accent text-white font-bold py-2 px-4 rounded disabled:bg-gray-500">{isSubmitting ? 'Saving...' : 'Save'}</button><button type="button" onClick={() => setEditingCertificate(null)} className="bg-gray-500 text-white font-bold py-2 px-4 rounded">Cancel</button></div>
                            </form>
                        ) : ( <CrudSection title="Certificates" items={adminContext!.certificates} onDelete={handleCertificateDelete} setEditingItem={setEditingCertificate} renderItem={(item) => <p>{item.name} by {item.issuer}</p>} isSubmitting={isSubmitting} /> )}
                    </div>
                );
            default: return null;
        }
    }

    const TabButton: React.FC<{tab: AdminTab, children: React.ReactNode}> = ({tab, children}) => (
        <button onClick={() => setActiveTab(tab)} className={`px-4 py-2 font-semibold rounded-t-lg transition-colors whitespace-nowrap relative ${activeTab === tab ? 'bg-slate-800 text-indigo-400' : 'bg-slate-900 text-gray-400 hover:bg-slate-700'}`}>{children}</button>
    );

    return (
        <div className="space-y-8">
            <h1 className="font-serif text-4xl font-bold text-indigo-400">Admin Dashboard</h1>
            <div className="flex border-b-2 border-slate-700 overflow-x-auto">
                <TabButton tab="Dashboard">Dashboard</TabButton>
                <TabButton tab="Inbox">
                    Inbox
                    {unreadMessagesCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{unreadMessagesCount}</span>}
                </TabButton>
                <TabButton tab="Settings">Site Settings</TabButton>
                <TabButton tab="Projects">Projects</TabButton>
                <TabButton tab="Literature">Literature</TabButton>
                <TabButton tab="Professional">Professional</TabButton>
            </div>
            <div>{renderContent()}</div>
        </div>
    );
};

const Admin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const adminContext = useContext(AdminContext);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminContext?.adminPassword) {
      adminContext?.setIsAdmin(true);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  if (adminContext?.isAdmin) {
    return <PageWrapper><AdminDashboard /></PageWrapper>;
  }

  return (
    <PageWrapper>
      <div className="max-w-md mx-auto">
        <h1 className="font-serif text-4xl font-bold text-indigo-400 text-center mb-8">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-6 card-glass p-8 rounded-lg shadow-lg">
          <div><label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label><input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full bg-slate-700/50 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-primary-accent focus:border-primary-accent"/></div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div><button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-primary-accent hover:bg-opacity-80">Login</button></div>
        </form>
      </div>
    </PageWrapper>
  );
};

export default Admin;