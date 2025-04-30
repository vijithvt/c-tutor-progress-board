
export type LessonStatus = "Not Started" | "In Progress" | "Completed";

export interface TimeLog {
  startDateTime: string | null;
  endDateTime: string | null;
  duration: number | null; // in minutes
}

export interface Lesson {
  id: string;
  title: string;
  status: LessonStatus;
  timeLog: TimeLog;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface ClassSchedule {
  id: string;
  dateTime: string;
  mode: "Online" | "Offline";
}

export interface AppData {
  modules: Module[];
  classSchedules: ClassSchedule[];
  googleMeetLink: string;
  tutorPin: string;
}

export interface AppState extends AppData {
  isTutorMode: boolean;
}
