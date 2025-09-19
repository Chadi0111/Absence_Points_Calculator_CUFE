export interface Course {
  code: string;
  name: string;
  creditHours: number;
  semester: number;
}

export interface Program {
  name: string;
  courses: Course[];
}

export interface CustomRules {
  totalPoints: number;
  lectureCost: number;
  tutorialCost: number;
  firstWarning: number; // Points remaining
  secondWarning: number; // Points remaining
}

export interface TrackedCourse {
  course: Course;
  missedLectures: number;
  missedTutorials: number;
  id: string; 
  customRules?: CustomRules;
}

export type SavedDashboards = {
  [name: string]: TrackedCourse[];
};