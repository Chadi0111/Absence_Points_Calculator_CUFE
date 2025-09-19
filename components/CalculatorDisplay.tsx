
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { TrackedCourse, CustomRules } from '../types';
import { Counter } from './Counter';

// --- Helper Icon Components (defined in-file to adhere to constraints) ---

const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const ExclamationIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

const SettingsIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400 hover:text-indigo-500 dark:text-slate-500 dark:hover:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const InfoIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const ArrowUpIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
);

const ArrowDownIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

const CalculatorIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m-6 4h6m-6 4h6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012 2z" />
    </svg>
);

interface CourseCardProps {
  trackedCourse: TrackedCourse;
  onUpdate: (id: string, updates: { missedLectures?: number; missedTutorials?: number; customRules?: CustomRules | null }) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
}

export const CalculatorDisplay: React.FC<CourseCardProps> = React.memo(({
  trackedCourse,
  onUpdate,
  onRemove,
  onMove,
  isFirst,
  isLast
}) => {
  const { course, missedLectures, missedTutorials, id, customRules } = trackedCourse;
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAbsenceCombosModalOpen, setIsAbsenceCombosModalOpen] = useState(false);

  const noAbsenceKeywords = useMemo(() => ['graduation project', 'industrial training'], []);
  const noTutorialKeywords = useMemo(() => ['seminar'], []);
  const noTutorialPrefixes = useMemo(() => ['GENS'], []);

  const hasNoAbsence = useMemo(() => noAbsenceKeywords.some(kw => course.name.toLowerCase().includes(kw)), [course.name, noAbsenceKeywords]);
  const hasNoTutorial = useMemo(() => noTutorialKeywords.some(kw => course.name.toLowerCase().includes(kw)) || noTutorialPrefixes.some(p => course.code.startsWith(p)), [course.name, course.code, noTutorialKeywords, noTutorialPrefixes]);
  const isUncertainPolicy = useMemo(() => course.creditHours === 1 && !hasNoAbsence, [course.creditHours, hasNoAbsence]);
  
  const calculation = useMemo(() => {
    const isThreeCredit = course.creditHours === 3;
    
    // Default Rules
    const defaultTotalPoints = isThreeCredit ? 10 : 6;
    const defaultLectureCost = isThreeCredit ? 2 : 1;
    const defaultTutorialCost = 1;
    const defaultFirstWarning = isThreeCredit ? 4 : 2; // at 4 or 2 points remaining
    const defaultSecondWarning = isThreeCredit ? 2 : 1; // at 2 or 1 points remaining

    // Use custom rules if they exist, otherwise use defaults
    const totalPoints = customRules?.totalPoints ?? defaultTotalPoints;
    const lectureCost = customRules?.lectureCost ?? defaultLectureCost;
    const tutorialCost = customRules?.tutorialCost ?? defaultTutorialCost;
    const firstWarning = customRules?.firstWarning ?? defaultFirstWarning;
    const secondWarning = customRules?.secondWarning ?? defaultSecondWarning;

    const pointsDeducted = (missedLectures * lectureCost) + (hasNoTutorial ? 0 : (missedTutorials * tutorialCost));
    const remainingPoints = totalPoints - pointsDeducted;
    
    let status: 'safe' | 'warning' | 'danger' = 'safe';
    let message = "You are safe. Keep up the good work!";
    let warningLevel: 'first' | 'second' | null = null;

    if (remainingPoints < 0) {
      status = 'danger';
      message = "You have exceeded the absence limit and cannot enter the final exam.";
    } else if (remainingPoints <= secondWarning) {
        status = 'warning'; warningLevel = 'second'; message = "Risk of failing is high. Attend all future classes.";
    } else if (remainingPoints <= firstWarning) {
        status = 'warning'; warningLevel = 'first'; message = "Be careful, your points are getting low.";
    }

    return { totalPoints, remainingPoints, status, message, lectureCost, tutorialCost, warningLevel };
  }, [course, missedLectures, missedTutorials, hasNoTutorial, customRules]);

  const header = (
    <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center gap-1 no-print">
            <button onClick={() => onMove(id, 'up')} disabled={isFirst} className="p-1 rounded-full text-slate-400 dark:text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700">
                <ArrowUpIcon />
            </button>
            <button onClick={() => onMove(id, 'down')} disabled={isLast} className="p-1 rounded-full text-slate-400 dark:text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700">
                <ArrowDownIcon />
            </button>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 printable-text">{course.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 printable-text">{course.creditHours} Credit Hours Course ({course.code})</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 no-print">
          <button onClick={() => setIsAbsenceCombosModalOpen(true)} className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <CalculatorIcon className="h-4 w-4" />
            <span>Scenarios</span>
          </button>
          <button onClick={() => setIsSettingsOpen(true)} aria-label={`Custom rules for ${course.name}`} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
            <SettingsIcon />
          </button>
          <button onClick={() => onRemove(id)} aria-label={`Remove ${course.name}`} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
            <TrashIcon />
          </button>
        </div>
      </div>
  );

  if (isUncertainPolicy) {
    return (
      <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 sm:p-5 mb-4 border border-slate-200 dark:border-slate-700 printable-card`}>
        {header}
        <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg mt-4 border border-red-200 dark:border-red-500/30 flex items-center justify-center space-x-3">
          <ExclamationIcon className="h-8 w-8 text-red-500 dark:text-red-400 flex-shrink-0" />
          <div className="text-left">
            <p className="font-semibold text-red-800 dark:text-red-200">Uncertain Absence Policy</p>
            <p className="text-red-700 dark:text-red-300 text-sm mt-1">The policy for 1-credit-hour courses is not confirmed. Tracking is disabled.</p>
          </div>
        </div>
      </div>
    );
  }

  if (hasNoAbsence) {
    return (
      <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 sm:p-5 mb-4 border border-slate-200 dark:border-slate-700 printable-card`}>
        {header}
        <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg mt-4 border border-slate-200 dark:border-slate-700">
            <p className="font-semibold text-slate-700 dark:text-slate-200">No Absence Tracking</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">This course type does not have absence points.</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className={`bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-5 mb-4 border border-slate-200 dark:border-slate-700 printable-card dark:printable-bg transition-shadow duration-300 shadow-md`}>
      {header}
      {customRules && (
        <div className="no-print mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-500/30 flex items-center space-x-3">
          <InfoIcon className="h-6 w-6 text-blue-500 dark:text-blue-400 flex-shrink-0" />
          <div className="text-blue-800 dark:text-blue-200 text-sm">
              This course is using custom absence rules. Calculations do not reflect official bylaws.
          </div>
        </div>
      )}
      <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 w-full space-y-3">
            <Counter 
              label="Missed Lectures"
              count={missedLectures}
              onCountChange={(count) => onUpdate(id, { missedLectures: count })}
              helpText={`Each costs ${calculation.lectureCost} point(s)`}
            />
            <Counter 
              label="Missed Tutorials"
              count={missedTutorials}
              onCountChange={(count) => onUpdate(id, { missedTutorials: count })}
              helpText={hasNoTutorial ? 'No tutorials for this course' : `Each costs ${calculation.tutorialCost} point(s)`}
              disabled={hasNoTutorial}
            />
          </div>
          
          <div className="flex-shrink-0 flex flex-col items-center text-center">
            <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center border-8 transition-all duration-300 printable-bg
              ${calculation.status === 'safe' ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-500/30' : ''}
              ${calculation.status === 'warning' ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-500/30' : ''}
              ${calculation.status === 'danger' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-500/30' : ''}`}
            >
              <span className={`text-5xl sm:text-6xl font-bold printable-text
                ${calculation.status === 'safe' ? 'text-green-600 dark:text-green-400' : ''}
                ${calculation.status === 'warning' ? 'text-amber-600 dark:text-amber-400' : ''}
                ${calculation.status === 'danger' ? 'text-red-600 dark:text-red-400' : ''}`}
              >
                {calculation.remainingPoints}
              </span>
            </div>
            <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm printable-text">out of {calculation.totalPoints} points</p>
          </div>
        </div>

        <div className="mt-6">
          <div className={`text-center p-3 rounded-lg font-medium text-sm printable-bg
            ${calculation.status === 'safe' ? 'bg-green-50 text-green-800 dark:bg-green-500/10 dark:text-green-200' : ''}
            ${calculation.status === 'warning' ? 'bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-200' : ''}
            ${calculation.status === 'danger' ? 'bg-red-50 text-red-800 dark:bg-red-500/10 dark:text-red-200' : ''}`}
          >
             {calculation.warningLevel && (
                <span className={`font-bold uppercase text-xs tracking-wider rounded-full px-2 py-0.5 mr-2
                  ${calculation.status === 'warning' ? 'bg-amber-200 text-amber-900 dark:bg-amber-400/20 dark:text-amber-200' : ''}`}
                >
                  {calculation.warningLevel} Warning
                </span>
             )}
            <span className="printable-text">{calculation.message}</span>
          </div>
        </div>
      </div>
    </div>
    {isSettingsOpen && <CustomRulesModal course={course} customRules={customRules} onClose={() => setIsSettingsOpen(false)} onSave={(rules) => onUpdate(id, { customRules: rules })} onReset={() => onUpdate(id, { customRules: null })} />}
    {isAbsenceCombosModalOpen && <AbsenceCombosModal calculation={calculation} hasNoTutorial={hasNoTutorial} courseName={course.name} onClose={() => setIsAbsenceCombosModalOpen(false)} />}
    </>
  );
});

// --- Absence Combinations Modal ---
const AbsenceCombosModal: React.FC<{
    calculation: ReturnType<typeof useMemo<any>>;
    hasNoTutorial: boolean;
    courseName: string;
    onClose: () => void;
}> = ({ calculation, hasNoTutorial, courseName, onClose }) => {
    
    const combos = useMemo(() => {
        const { remainingPoints, lectureCost, tutorialCost } = calculation;
        if (remainingPoints < 0) return [];
        
        const results: { lectures: number; tutorials: number }[] = [];
        
        if (hasNoTutorial) {
            const maxLectures = lectureCost > 0 ? Math.floor(remainingPoints / lectureCost) : Infinity;
            if (maxLectures !== Infinity && maxLectures >= 0) {
                 for (let l = 0; l <= maxLectures; l++) {
                    results.push({ lectures: l, tutorials: 0 });
                }
            }
            return results.reverse();
        }

        if (lectureCost <= 0 && tutorialCost <= 0) return [];

        for (let l = 0; (l * lectureCost) <= remainingPoints; l++) {
            const pointsAfterLectures = remainingPoints - (l * lectureCost);
            const t = tutorialCost > 0 ? Math.floor(pointsAfterLectures / tutorialCost) : Infinity;
            if (t !== Infinity) {
                results.push({ lectures: l, tutorials: t });
            }
        }
        return results;
    }, [calculation, hasNoTutorial]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 no-print" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-6 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200">
                    <XIcon />
                </button>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">Absence Combinations</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">For {courseName}</p>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                    With your remaining <span className="font-bold text-indigo-600 dark:text-indigo-400">{calculation.remainingPoints} points</span>, you can still miss any of the following combinations:
                </p>
                
                <div className="max-h-64 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    {combos.length > 0 ? (
                        <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                            {combos.map((combo, index) => (
                                <li key={index} className="flex justify-between items-center py-2 text-slate-700 dark:text-slate-300">
                                    <span>{combo.lectures} Lecture(s)</span>
                                    {!hasNoTutorial && <span className="text-slate-400">+</span>}
                                    {!hasNoTutorial && <span>{combo.tutorials} Tutorial(s)</span>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                         <p className="text-center text-slate-500 dark:text-slate-400 py-4">No combinations possible with the remaining points.</p>
                    )}
                </div>
            </div>
        </div>
    );
}


// --- Custom Rules Modal Component ---

const CustomRulesModal: React.FC<{
    course: TrackedCourse['course'];
    customRules: CustomRules | undefined;
    onClose: () => void;
    onSave: (rules: CustomRules) => void;
    onReset: () => void;
}> = ({ course, customRules, onClose, onSave, onReset }) => {
    
    const isThreeCredit = course.creditHours === 3;
    const defaultRules = {
        totalPoints: isThreeCredit ? 10 : 6,
        lectureCost: isThreeCredit ? 2 : 1,
        tutorialCost: 1,
        firstWarning: isThreeCredit ? 4 : 2,
        secondWarning: isThreeCredit ? 2 : 1,
    };
    
    const [formState, setFormState] = useState(() => {
        const initialState = customRules || defaultRules;
        return {
            totalPoints: String(initialState.totalPoints),
            lectureCost: String(initialState.lectureCost),
            tutorialCost: String(initialState.tutorialCost),
            firstWarning: String(initialState.firstWarning),
            secondWarning: String(initialState.secondWarning),
        };
    });

    const handleSave = () => {
        onSave({
            totalPoints: parseInt(formState.totalPoints, 10) || 0,
            lectureCost: parseInt(formState.lectureCost, 10) || 0,
            tutorialCost: parseInt(formState.tutorialCost, 10) || 0,
            firstWarning: parseInt(formState.firstWarning, 10) || 0,
            secondWarning: parseInt(formState.secondWarning, 10) || 0,
        });
        onClose();
    };
    
    const handleReset = () => {
        onReset();
        onClose();
    };

    const handleInputChange = (field: keyof CustomRules, value: string) => {
        if (/^\d*$/.test(value)) {
            setFormState(prev => ({...prev, [field]: value }));
        }
    };
    
    return (
         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 no-print" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-6 relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200">
                    <XIcon />
                </button>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">Custom Absence Rules</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">For {course.name}</p>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <label className="block col-span-1 sm:col-span-3">
                            <span className="text-slate-700 dark:text-slate-300 font-medium">Total Starting Points</span>
                            <input type="text" inputMode="numeric" value={formState.totalPoints} onChange={e => handleInputChange('totalPoints', e.target.value)} className="mt-1 w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md text-slate-900 dark:text-slate-200" />
                        </label>
                        <label className="block">
                            <span className="text-slate-700 dark:text-slate-300 font-medium">Lecture Cost</span>
                            <input type="text" inputMode="numeric" value={formState.lectureCost} onChange={e => handleInputChange('lectureCost', e.target.value)} className="mt-1 w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md text-slate-900 dark:text-slate-200" />
                        </label>
                        <label className="block">
                            <span className="text-slate-700 dark:text-slate-300 font-medium">Tutorial Cost</span>
                            <input type="text" inputMode="numeric" value={formState.tutorialCost} onChange={e => handleInputChange('tutorialCost', e.target.value)} className="mt-1 w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md text-slate-900 dark:text-slate-200" />
                        </label>
                    </div>
                     <div>
                        <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">Warning Thresholds (Points Remaining)</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <label className="block">
                                <span className="text-sm text-slate-500 dark:text-slate-400">1st Warning At/Below</span>
                                <input type="text" inputMode="numeric" value={formState.firstWarning} onChange={e => handleInputChange('firstWarning', e.target.value)} className="mt-1 w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md text-slate-900 dark:text-slate-200" />
                            </label>
                             <label className="block">
                                <span className="text-sm text-slate-500 dark:text-slate-400">2nd Warning At/Below</span>
                                <input type="text" inputMode="numeric" value={formState.secondWarning} onChange={e => handleInputChange('secondWarning', e.target.value)} className="mt-1 w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md text-slate-900 dark:text-slate-200" />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
                    <button onClick={handleSave} className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Save Custom Rules</button>
                    <button onClick={handleReset} className="w-full sm:w-auto px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">Reset to Default</button>
                </div>
            </div>
        </div>
    );
}