// Database utilities with MongoDB integration and localStorage fallback
import connectToDatabase from './mongodb';

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

// MongoDB helper functions
async function tryMongoDBOperation(collection: string, operation: Function, localFallback: Function) {
  try {
    const { db } = await connectToDatabase();
    if (!db) throw new Error("Database connection failed");
    return await operation(db.collection(collection));
  } catch (error) {
    console.error(`MongoDB operation failed, using localStorage fallback:`, error);
    return localFallback();
  }
}

// Existing functions with MongoDB integration first, then localStorage fallback

export async function getFeatures() {
  return await tryMongoDBOperation(
    'features',
    async (collection) => {
      const features = await collection.find({}).toArray();
      return { features };
    },
    () => {
      const features = getLocalData('features', [
        { id: '1', name: 'Course Publishing', description: 'Share your knowledge with others' },
        { id: '2', name: 'Attendance Tracking', description: 'Track your daily attendance' },
        { id: '3', name: 'Study Materials', description: 'Access learning resources' }
      ]);
      return { features };
    }
  );
}

export async function getStudents() {
  return await tryMongoDBOperation(
    'students',
    async (collection) => {
      const students = await collection.find({}).toArray();
      return { students };
    },
    () => {
      const students = getLocalData('students', []);
      return { students };
    }
  );
}

export async function getCourses() {
  return await tryMongoDBOperation(
    'courses',
    async (collection) => {
      const courses = await collection.find({}).toArray();
      return { courses };
    },
    () => {
      const courses = getLocalData('courses', []);
      return { courses };
    }
  );
}

export async function getAssignments(studentId: string) {
  return await tryMongoDBOperation(
    'assignments',
    async (collection) => {
      const assignments = await collection.find({ studentId }).toArray();
      return { assignments };
    },
    () => {
      const allAssignments = getLocalData('assignments', []);
      const assignments = allAssignments.filter((assignment: any) => 
        assignment.studentId === studentId
      );
      return { assignments };
    }
  );
}

export async function updateProfile(userId: string, profileData: any) {
  return await tryMongoDBOperation(
    'users',
    async (collection) => {
      const result = await collection.updateOne(
        { _id: userId },
        { $set: profileData }
      );
      return { success: true, result };
    },
    () => {
      const users = getLocalData('users', []);
      const updatedUsers = users.map((user: any) => 
        user._id === userId ? { ...user, ...profileData } : user
      );
      
      saveLocalData('users', updatedUsers);
      return { success: true, result: { modifiedCount: 1 } };
    }
  );
}

export async function saveCourse(courseData: any) {
  return await tryMongoDBOperation(
    'public_courses',
    async (collection) => {
      const newCourse = {
        ...courseData,
        createdAt: new Date().toISOString(),
        isPublic: true
      };
      
      const result = await collection.insertOne(newCourse);
      return { success: true, courseId: result.insertedId };
    },
    () => {
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
    }
  );
}

export async function getPublicCourses() {
  return await tryMongoDBOperation(
    'public_courses',
    async (collection) => {
      const courses = await collection.find({ isPublic: true })
        .sort({ createdAt: -1 })
        .toArray();
      return { courses };
    },
    () => {
      const courses = getLocalData('public_courses', [])
        .filter((course: any) => course.isPublic)
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      return { courses };
    }
  );
}

export async function searchCourses(query: string) {
  return await tryMongoDBOperation(
    'public_courses',
    async (collection) => {
      const courses = await collection.find({
        isPublic: true,
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { author: { $regex: query, $options: 'i' } }
        ]
      }).toArray();
      
      return { courses };
    },
    () => {
      const courses = getLocalData('public_courses', []);
      const searchResults = courses.filter((course: any) => {
        const searchableText = `${course.title} ${course.description} ${course.author}`.toLowerCase();
        return course.isPublic && searchableText.includes(query.toLowerCase());
      });
      
      return { courses: searchResults };
    }
  );
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
