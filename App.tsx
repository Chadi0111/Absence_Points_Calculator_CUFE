import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { programsData } from './data/courseData';
import { Program, Course, TrackedCourse, SavedDashboards, CustomRules } from './types';
import { CalculatorDisplay } from './components/CalculatorDisplay';

// --- Helper Components defined in App.tsx to adhere to file constraints ---

const BugIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        <path d="M9.344 3.034a1 1 0 011.312 0l1.168 1.168a1 1 0 010 1.414l-1.33 1.33a1 1 0 01-1.414 0L7.75 5.616a1 1 0 010-1.414l1.594-1.168zM14.25 12.25a1 1 0 011.414 0l1.168 1.168a1 1 0 010 1.414l-1.168 1.168a1 1 0 01-1.414 0L12.25 14.07a1 1 0 010-1.414l1.168-1.168a1 1 0 01.832-.242zM3.75 12.25a1 1 0 011.414 0L7.16 14.246a1 1 0 010 1.414l-1.168 1.168a1 1 0 01-1.414 0L3.41 15.66a1 1 0 010-1.414l1.172-1.164a1 1 0 01.832-.242z" />
    </svg>
);

const TrashIcon: React.FC<{className?: string}> = ({ className = 'h-5 w-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const FolderIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
    </svg>
);

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const ClipboardIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m-8 4h.01M12 16h.01" />
    </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const QuestionMarkCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ExclamationIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

const PrintIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
    </svg>
);

const XCircleIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const UploadIcon: React.FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);


// --- Custom Combobox Component ---
interface ComboboxOption { value: string; label: string; }

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
}

const Combobox: React.FC<ComboboxProps> = ({ options, value, onChange, placeholder, disabled = false }) => {
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredOptions = useMemo(() => 
        options.filter(option => option.label.toLowerCase().includes(inputValue.toLowerCase())),
        [options, inputValue]
    );

    const selectedOption = useMemo(() => options.find(opt => opt.value === value), [options, value]);

    useEffect(() => {
        setInputValue(selectedOption ? selectedOption.label : '');
    }, [selectedOption]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setInputValue(selectedOption ? selectedOption.label : '');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [selectedOption]);

    return (
        <div className="relative w-full" ref={containerRef}>
            <input
                type="text"
                value={inputValue}
                onChange={e => {
                    setInputValue(e.target.value);
                    if (!isOpen) setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder={placeholder}
                disabled={disabled}
                className="w-full p-3 pr-10 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 dark:text-slate-100"
            />
            {isOpen && !disabled && (
                <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map(option => (
                            <li
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setInputValue(option.label);
                                    setIsOpen(false);
                                }}
                                className="px-4 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 cursor-pointer text-slate-800 dark:text-slate-200"
                            >
                                {option.label}
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-2 text-slate-500 dark:text-slate-400">No results found</li>
                    )}
                </ul>
            )}
        </div>
    );
};


// --- Main App Component ---

const App: React.FC = () => {
  const [selectedProgramName, setSelectedProgramName] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>('');
  const [trackedCourses, setTrackedCourses] = useState<TrackedCourse[]>(() => {
      const saved = localStorage.getItem('trackedCourses');
      return saved ? JSON.parse(saved) : [];
  });
  const [dashboardName, setDashboardName] = useState('');
  const [isDashboardManagerOpen, setIsDashboardManagerOpen] = useState(false);
  const dashboardManagerRef = useRef<HTMLDivElement>(null);
  const importFileRef = useRef<HTMLInputElement>(null);
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const [isExplanationModalOpen, setIsExplanationModalOpen] = useState(false);
  const [copiedItem, setCopiedItem] = useState<'email' | 'body' | null>(null);
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // --- Storage Helper ---
  const getFromStorage = <T,>(key: string, fallback: T): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (error) { return fallback; }
  };
  
  const [savedDashboards, setSavedDashboards] = useState<SavedDashboards>(() => getFromStorage('savedDashboards', {}));

  useEffect(() => { localStorage.setItem('trackedCourses', JSON.stringify(trackedCourses)); }, [trackedCourses]);
  useEffect(() => { localStorage.setItem('savedDashboards', JSON.stringify(savedDashboards)); }, [savedDashboards]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (dashboardManagerRef.current && !dashboardManagerRef.current.contains(event.target as Node)) {
            setIsDashboardManagerOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedProgram = useMemo(() => programsData.find(p => p.name === selectedProgramName), [selectedProgramName]);

  const sortedPrograms = useMemo(() => {
    return [...programsData].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const sortedCourses = useMemo(() => {
    if (!selectedProgram) return [];
    return [...selectedProgram.courses].sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedProgram]);

  const handleProgramChange = (value: string) => {
    setSelectedProgramName(value);
    setSelectedCourseCode('');
  };

  const handleAddCourse = () => {
    const courseToAdd = selectedProgram?.courses.find(c => c.code === selectedCourseCode);
    if (courseToAdd && !trackedCourses.some(tc => tc.course.code === courseToAdd.code)) {
      setTrackedCourses(prev => [{ course: courseToAdd, missedLectures: 0, missedTutorials: 0, id: `${courseToAdd.code}-${Date.now()}` }, ...prev]);
      setSelectedCourseCode('');
    }
  };

  const handleUpdateCourse = useCallback((id: string, updates: Partial<Pick<TrackedCourse, 'missedLectures' | 'missedTutorials' | 'customRules'>>) => {
    setTrackedCourses(prev => prev.map(tc => tc.id === id ? { ...tc, ...updates } : tc));
  }, []);

  const handleRemoveCourse = useCallback((id: string) => {
    setTrackedCourses(prev => prev.filter(tc => tc.id !== id));
  }, []);

  const handleSaveDashboard = () => {
    const name = dashboardName.trim();
    if (!name || trackedCourses.length === 0) return;
    setSavedDashboards(prev => ({ ...prev, [name]: trackedCourses }));
    setDashboardName('');
    setIsDashboardManagerOpen(false);
  };
  
  const handleLoadDashboard = (name: string) => {
    if (savedDashboards[name]) {
        setTrackedCourses(savedDashboards[name]);
        setSelectedCourseCode('');
    }
    setIsDashboardManagerOpen(false);
  };

  const handleDeleteDashboard = (name: string) => {
    const confirmation = window.confirm(`Are you sure you want to delete the "${name}" dashboard?`);
    if(confirmation) {
        setSavedDashboards(prev => {
            const newDashboards = { ...prev };
            delete newDashboards[name];
            return newDashboards;
        });
    }
  };
  
  const handleClearDashboard = () => {
    if (window.confirm("Are you sure you want to clear the entire dashboard? This action cannot be undone.")) {
        setTrackedCourses([]);
        setIsDashboardManagerOpen(false);
    }
  };
  
  const handleExportDashboard = () => {
    if (trackedCourses.length === 0) {
        alert("Dashboard is empty. Nothing to export.");
        return;
    }
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(trackedCourses, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `absence_dashboard_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    setIsDashboardManagerOpen(false);
  };
  
  const handleImportDashboard = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const text = e.target?.result;
            if (typeof text !== 'string') throw new Error("File could not be read.");
            const importedCourses: TrackedCourse[] = JSON.parse(text);
            
            // Basic validation
            if (Array.isArray(importedCourses) && importedCourses.every(c => c.course?.code && c.id && 'missedLectures' in c)) {
                setTrackedCourses(importedCourses);
                alert("Dashboard imported successfully!");
            } else {
                throw new Error("Invalid dashboard file format.");
            }
        } catch (error) {
            alert(`Error importing dashboard: ${error instanceof Error ? error.message : "Unknown error"}`);
        } finally {
            if (event.target) {
                event.target.value = '';
            }
        }
    };
    reader.readAsText(file);
    setIsDashboardManagerOpen(false);
  };


  const bugReportDetails = {
    recipient: 'Chadi.Cherri06@eng-st.cu.edu.eg',
    subject: 'Bug Report - Absence Points Calculator',
    body: `Hello,\n\nI'd like to report a bug.\n\n**Bug Description:**\n[Please describe the bug in detail here]\n\n**Steps to Reproduce:**\n1.\n2.\n3.\n\n**Expected Behavior:**\n[What did you expect to happen?]\n\n**Actual Behavior:**\n[What actually happened?]\n\n---\nApp Version: 3.5.0\nBrowser: [Please fill in your browser and version, e.g., Chrome 125]`
  };

  const handleCopy = (text: string, type: 'email' | 'body') => {
    navigator.clipboard.writeText(text).then(() => {
        setCopiedItem(type);
        setTimeout(() => setCopiedItem(null), 2000);
    });
  };

  const semesterOptions = [
    { value: 'Fall', label: 'Fall Semester' },
    { value: 'Spring', label: 'Spring Semester' },
    { value: 'Summer', label: 'Summer Semester' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center p-4 font-sans transition-colors duration-300">
      <main className="w-full max-w-5xl mx-auto">
        <div className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-sm rounded-2xl shadow-xl dark:shadow-slate-900/50 p-6 sm:p-10 border border-transparent dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-8 no-print">
             <div className="flex items-center justify-center gap-2">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">Absence Points</h1>
                <button onClick={() => setIsExplanationModalOpen(true)} className="text-slate-400 hover:text-indigo-500 dark:text-slate-500 dark:hover:text-indigo-400">
                    <QuestionMarkCircleIcon className="h-7 w-7" />
                </button>
            </div>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="w-16 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label="Toggle dark mode"
            >
                <div className="absolute w-full flex justify-between items-center px-2">
                    <SunIcon className="h-4 w-4 text-yellow-500" />
                    <MoonIcon className="h-4 w-4 text-sky-400" />
                </div>
                <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                    theme === 'dark' ? 'translate-x-8' : 'translate-x-0'
                    }`}
                />
            </button>
          </div>
          <p className="text-center text-slate-500 dark:text-slate-400 -mt-6 mb-8 no-print">Track, save, and manage your course absence points.</p>
          
          <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700/50 no-print">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Combobox options={semesterOptions} value={selectedSemester} onChange={setSelectedSemester} placeholder="Select a Semester" />
                {selectedSemester && <button onClick={() => setSelectedSemester('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><XCircleIcon /></button>}
              </div>
              <div className="relative">
                 <Combobox options={sortedPrograms.map(p => ({ value: p.name, label: p.name }))} value={selectedProgramName} onChange={handleProgramChange} placeholder="Search for a Program" />
                 {selectedProgramName && <button onClick={() => { setSelectedProgramName(''); setSelectedCourseCode(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><XCircleIcon /></button>}
              </div>
              <div className="relative">
                <Combobox options={sortedCourses.map(c => ({ value: c.code, label: `${c.name} (${c.code})` }))} value={selectedCourseCode} onChange={setSelectedCourseCode} placeholder="Search for a Course" disabled={!selectedProgram || !selectedSemester} />
                {selectedCourseCode && <button onClick={() => setSelectedCourseCode('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><XCircleIcon /></button>}
              </div>
            </div>

            {selectedSemester === 'Summer' && (
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-500/30 flex items-center space-x-3">
                  <ExclamationIcon className="h-6 w-6 text-amber-500 dark:text-amber-400 flex-shrink-0" />
                  <div className="text-amber-800 dark:text-amber-200">
                      <p className="font-semibold">Summer Semester Policy Notice</p>
                      <p className="text-sm">Absence calculations are not yet confirmed. Please check with student affairs and use at your own risk.</p>
                  </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3 pt-2">
                <div className="flex items-center gap-3">
                   <button onClick={() => { setSelectedSemester(''); setSelectedProgramName(''); setSelectedCourseCode(''); }} className="p-2 text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 font-semibold">Clear Selections</button>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:justify-end gap-3 w-full sm:w-auto">
                    <button
                        onClick={handleAddCourse}
                        disabled={!selectedCourseCode || trackedCourses.some(tc => tc.course.code === selectedCourseCode) || !selectedSemester}
                        className="w-full sm:w-auto p-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                        Add Course to Dashboard
                    </button>
                    <div className="relative" ref={dashboardManagerRef}>
                        <button onClick={() => setIsDashboardManagerOpen(prev => !prev)} className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition text-xs uppercase tracking-wider">
                            <FolderIcon className="h-4 w-4" />
                            Manage Dashboards
                            <ChevronDownIcon className={`h-4 w-4 transition-transform ${isDashboardManagerOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isDashboardManagerOpen && (
                            <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 z-20 p-4">
                                <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-base mb-3">Save current dashboard</h3>
                                <div className="flex space-x-2">
                                    <input type="text" value={dashboardName} onChange={e => setDashboardName(e.target.value)} placeholder="Dashboard name..." className="w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md text-sm text-slate-900 dark:text-slate-200"/>
                                    <button onClick={handleSaveDashboard} disabled={!dashboardName.trim() || trackedCourses.length === 0} className="px-3 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 text-sm">Save</button>
                                </div>
                                <hr className="my-4 border-slate-200 dark:border-slate-700" />
                                <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-base mb-3">Load dashboard</h3>
                                {Object.keys(savedDashboards).length > 0 ? (
                                    <ul className="space-y-2 max-h-40 overflow-y-auto">
                                        {Object.keys(savedDashboards).map(name => (
                                            <li key={name} className="flex justify-between items-center bg-slate-50 dark:bg-slate-700/50 p-2 rounded">
                                                <span className="text-slate-800 dark:text-slate-200 font-medium text-sm">{name}</span>
                                                <div className="space-x-2">
                                                    <button onClick={() => handleLoadDashboard(name)} className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400 text-sm">Load</button>
                                                    <button onClick={() => handleDeleteDashboard(name)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500" aria-label={`Delete ${name}`}>
                                                        <TrashIcon className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">No saved dashboards.</p>
                                )}
                                <hr className="my-4 border-slate-200 dark:border-slate-700" />
                                <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-base mb-3">Dashboard Actions</h3>
                                <input type="file" ref={importFileRef} onChange={handleImportDashboard} accept=".json" style={{ display: 'none' }} />
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <button onClick={() => importFileRef.current?.click()} className="w-full text-center px-3 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 flex items-center justify-center gap-2">
                                        <UploadIcon /> Import
                                    </button>
                                    <button onClick={handleExportDashboard} className="w-full text-center px-3 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 flex items-center justify-center gap-2">
                                        <DownloadIcon /> Export
                                    </button>
                                    <button onClick={() => window.print()} className="w-full text-center px-3 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 flex items-center justify-center gap-2">
                                        <PrintIcon className="h-4 w-4" /> Print
                                    </button>
                                    <button onClick={handleClearDashboard} className="w-full text-center px-3 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600">
                                        Clear
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
          </div>

          <div className="mt-8">
            {trackedCourses.length > 0 ? (
              trackedCourses.map(tc => (
                <CalculatorDisplay
                  key={tc.id}
                  trackedCourse={tc}
                  onUpdate={handleUpdateCourse}
                  onRemove={handleRemoveCourse}
                />
              ))
            ) : (
              <div className="text-center p-8 bg-slate-50 dark:bg-slate-900/50 rounded-lg mt-6 border-dashed border-2 border-slate-300 dark:border-slate-700 no-print">
                <p className="text-slate-500 dark:text-slate-400">Your dashboard is empty.</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Add courses above to start tracking.</p>
              </div>
            )}
          </div>
        </div>

        <footer className="text-center mt-8 space-y-4 no-print">
          <div className="flex items-center justify-center space-x-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Student-led initiative, not an official university website.
              </p>
              <button onClick={() => setIsBugModalOpen(true)} className="inline-flex items-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition text-sm">
                <BugIcon className="h-4 w-4" />
                Report a Bug
              </button>
          </div>
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 w-1/2 mx-auto">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Created by Chadi Cherri
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Chadi.Cherri06@eng-st.cu.edu.eg
              </p>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">&copy; {new Date().getFullYear()} Absence Points Calculator. All Rights Reserved.</p>
        </footer>
      </main>

      {isBugModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={() => setIsBugModalOpen(false)}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg p-6 relative" onClick={e => e.stopPropagation()}>
                <button onClick={() => setIsBugModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200">
                    <XIcon />
                </button>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Report a Bug</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                    To report a bug, please send an email. You can copy the email address and the template below to help us understand the issue.
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Email</label>
                        <div className="flex items-center space-x-2">
                            <input type="text" readOnly value={bugReportDetails.recipient} className="w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md text-slate-900 dark:text-slate-100" />
                            <button onClick={() => handleCopy(bugReportDetails.recipient, 'email')} className="flex items-center justify-center px-3 py-2 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 w-24">
                                {copiedItem === 'email' ? <CheckIcon className="text-green-600"/> : <><ClipboardIcon className="mr-1 h-4 w-4"/> Copy</>}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bug Report Template</label>
                         <div className="flex items-start space-x-2">
                            <textarea readOnly value={bugReportDetails.body} className="w-full p-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md h-48 resize-none font-mono text-xs text-slate-900 dark:text-slate-100"></textarea>
                            <button onClick={() => handleCopy(bugReportDetails.body, 'body')}  className="flex items-center justify-center px-3 py-2 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 w-24">
                               {copiedItem === 'body' ? <CheckIcon className="text-green-600"/> : <><ClipboardIcon className="mr-1 h-4 w-4"/> Copy</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {isExplanationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={() => setIsExplanationModalOpen(false)}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg p-6 relative" onClick={e => e.stopPropagation()}>
                <button onClick={() => setIsExplanationModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200">
                    <XIcon />
                </button>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Absence Policy Explained</h2>
                <div className="space-y-4 text-slate-600 dark:text-slate-300">
                    <p>The absence point system is based on the credit hours (CH) of each course.</p>
                    <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">3 Credit Hour Courses</h3>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>You start with <span className="font-semibold">10 total points</span>.</li>
                            <li>Each missed <span className="font-semibold">lecture</span> costs <span className="font-semibold">2 points</span>.</li>
                            <li>Each missed <span className="font-semibold">tutorial</span> costs <span className="font-semibold">1 point</span>.</li>
                        </ul>
                    </div>
                     <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">2 Credit Hour Courses</h3>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>You start with <span className="font-semibold">6 total points</span>.</li>
                            <li>Each missed <span className="font-semibold">lecture</span> costs <span className="font-semibold">1 point</span>.</li>
                            <li>Each missed <span className="font-semibold">tutorial</span> costs <span className="font-semibold">1 point</span>.</li>
                        </ul>
                    </div>
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-500/50 text-red-800 dark:text-red-200">
                        <p className="font-semibold">Important: If your remaining points go below zero, you are barred from entering the final exam for that course.</p>
                    </div>
                    <div className="mt-4 p-4 bg-sky-50 dark:bg-sky-900/20 rounded-lg border border-sky-200 dark:border-sky-500/50 text-sky-800 dark:text-sky-200">
                        <h4 className="font-semibold">Pro Tip: Withdrawing vs. Failing</h4>
                        <p className="text-sm mt-1">If you are nearing the absence limit and expect to exceed it, consider officially withdrawing from the course. Being barred from the final exam will result in an 'F' grade, which significantly impacts your GPA. A withdrawal ('W') typically does not.</p>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;