
// Local storage based database utilities
// This implementation replaces MongoDB with client-side storage for better performance

// Helper to get data from localStorage with a default value
const getLocalData = (key: string, defaultValue: any[] = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error(`Error retrieving ${key} from localStorage:`, e);
    return defaultValue;
  }
};

// Helper to save data to localStorage
const saveLocalData = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
    return false;
  }
};

export async function getFeatures() {
  try {
    const features = getLocalData('features', [
      { id: '1', name: 'Course Publishing', description: 'Share your knowledge with others' },
      { id: '2', name: 'Attendance Tracking', description: 'Track your daily attendance' },
      { id: '3', name: 'Study Materials', description: 'Access learning resources' }
    ]);
    return { features };
  } catch (e) {
    console.error("Error fetching features:", e);
    return { error: "Failed to fetch features" };
  }
}

export async function getStudents() {
  try {
    const students = getLocalData('students', []);
    return { students };
  } catch (e) {
    console.error("Error fetching students:", e);
    return { error: "Failed to fetch students" };
  }
}

export async function getCourses() {
  try {
    const courses = getLocalData('courses', []);
    return { courses };
  } catch (e) {
    console.error("Error fetching courses:", e);
    return { error: "Failed to fetch courses" };
  }
}

export async function getAssignments(studentId: string) {
  try {
    const allAssignments = getLocalData('assignments', []);
    const assignments = allAssignments.filter((assignment: any) => 
      assignment.studentId === studentId
    );
    return { assignments };
  } catch (e) {
    console.error("Error fetching assignments:", e);
    return { error: "Failed to fetch assignments" };
  }
}

export async function updateProfile(userId: string, profileData: any) {
  try {
    const users = getLocalData('users', []);
    const updatedUsers = users.map((user: any) => 
      user._id === userId ? { ...user, ...profileData } : user
    );
    
    saveLocalData('users', updatedUsers);
    return { success: true, result: { modifiedCount: 1 } };
  } catch (e) {
    console.error("Error updating profile:", e);
    return { error: "Failed to update profile" };
  }
}

export async function saveCourse(courseData: any) {
  try {
    const courses = getLocalData('public_courses', []);
    const newCourse = {
      ...courseData,
      _id: `local-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isPublic: true
    };
    
    courses.push(newCourse);
    saveLocalData('public_courses', courses);
    return { success: true, courseId: newCourse._id };
  } catch (e) {
    console.error("Error saving course:", e);
    return { error: "Failed to save course" };
  }
}

export async function getPublicCourses() {
  try {
    const courses = getLocalData('public_courses', [])
      .filter((course: any) => course.isPublic)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return { courses };
  } catch (e) {
    console.error("Error fetching public courses:", e);
    return { error: "Failed to fetch public courses" };
  }
}

export async function searchCourses(query: string) {
  try {
    const courses = getLocalData('public_courses', []);
    const searchResults = courses.filter((course: any) => {
      const searchableText = `${course.title} ${course.description} ${course.author}`.toLowerCase();
      return course.isPublic && searchableText.includes(query.toLowerCase());
    });
    
    return { courses: searchResults };
  } catch (e) {
    console.error("Error searching courses:", e);
    return { error: "Failed to search courses" };
  }
}

export async function trackAttendance(userId: string, date: string) {
  try {
    const attendance = getLocalData('attendance', []);
    
    // Check if attendance already marked for today
    const existing = attendance.find((record: any) => 
      record.userId === userId && record.date === date
    );
    
    if (existing) {
      return { success: false, message: "Attendance already marked for today" };
    }
    
    // Mark attendance
    const newRecord = {
      userId,
      date,
      timestamp: new Date().toISOString()
    };
    
    attendance.push(newRecord);
    saveLocalData('attendance', attendance);
    
    return { success: true, result: newRecord };
  } catch (e) {
    console.error("Error tracking attendance:", e);
    return { error: "Failed to track attendance" };
  }
}

export async function getAttendanceCount(userId: string) {
  try {
    const attendance = getLocalData('attendance', []);
    const count = attendance.filter((record: any) => record.userId === userId).length;
    return { count };
  } catch (e) {
    console.error("Error getting attendance count:", e);
    return { error: "Failed to get attendance count" };
  }
}

// New functions for course notes
export async function getCourseNotes(courseId: string) {
  try {
    const notes = getLocalData('course_notes', []);
    return { notes: notes.filter((note: any) => note.courseId === courseId) };
  } catch (e) {
    console.error("Error fetching course notes:", e);
    return { error: "Failed to fetch course notes" };
  }
}

export async function saveCourseNote(noteData: {
  courseId: string;
  userId: string;
  content: string;
  title?: string;
}) {
  try {
    const notes = getLocalData('course_notes', []);
    const newNote = {
      ...noteData,
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    notes.push(newNote);
    saveLocalData('course_notes', notes);
    return { success: true, noteId: newNote.id };
  } catch (e) {
    console.error("Error saving course note:", e);
    return { error: "Failed to save course note" };
  }
}

export async function updateCourseNote(noteId: string, content: string) {
  try {
    const notes = getLocalData('course_notes', []);
    const updatedNotes = notes.map((note: any) => 
      note.id === noteId 
        ? { ...note, content, updatedAt: new Date().toISOString() } 
        : note
    );
    
    saveLocalData('course_notes', updatedNotes);
    return { success: true };
  } catch (e) {
    console.error("Error updating course note:", e);
    return { error: "Failed to update course note" };
  }
}

export async function deleteCourseNote(noteId: string) {
  try {
    const notes = getLocalData('course_notes', []);
    const filteredNotes = notes.filter((note: any) => note.id !== noteId);
    
    saveLocalData('course_notes', filteredNotes);
    return { success: true };
  } catch (e) {
    console.error("Error deleting course note:", e);
    return { error: "Failed to delete course note" };
  }
}
