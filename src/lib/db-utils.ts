
import clientPromise from './mongodb';

// Cache the database connection to prevent reconnection on every request
let dbConnection: any = null;

async function getDatabase() {
  if (dbConnection) return dbConnection;
  
  try {
    const client = await clientPromise;
    dbConnection = client.db("school_edge");
    return dbConnection;
  } catch (e) {
    console.error("Failed to connect to the database:", e);
    throw new Error("Database connection failed");
  }
}

export async function getFeatures() {
  try {
    const db = await getDatabase();
    const features = await db.collection("features").find({}).toArray();
    return { features };
  } catch (e) {
    console.error("Error fetching features from MongoDB:", e);
    return { error: "Failed to fetch features" };
  }
}

export async function getStudents() {
  try {
    const db = await getDatabase();
    const students = await db.collection("students").find({}).toArray();
    return { students };
  } catch (e) {
    console.error("Error fetching students from MongoDB:", e);
    return { error: "Failed to fetch students" };
  }
}

export async function getCourses() {
  try {
    const db = await getDatabase();
    const courses = await db.collection("courses").find({}).toArray();
    return { courses };
  } catch (e) {
    console.error("Error fetching courses from MongoDB:", e);
    return { error: "Failed to fetch courses" };
  }
}

export async function getAssignments(studentId: string) {
  try {
    const db = await getDatabase();
    const assignments = await db.collection("assignments")
      .find({ studentId: studentId })
      .toArray();
    return { assignments };
  } catch (e) {
    console.error("Error fetching assignments from MongoDB:", e);
    return { error: "Failed to fetch assignments" };
  }
}

export async function updateProfile(userId: string, profileData: any) {
  try {
    const db = await getDatabase();
    const result = await db.collection("users").updateOne(
      { _id: userId },
      { $set: profileData }
    );
    return { success: true, result };
  } catch (e) {
    console.error("Error updating profile in MongoDB:", e);
    return { error: "Failed to update profile" };
  }
}

export async function saveCourse(courseData: any) {
  try {
    const db = await getDatabase();
    const result = await db.collection("public_courses").insertOne({
      ...courseData,
      createdAt: new Date(),
      isPublic: true
    });
    return { success: true, courseId: result.insertedId };
  } catch (e) {
    console.error("Error saving course to MongoDB:", e);
    return { error: "Failed to save course" };
  }
}

export async function getPublicCourses() {
  try {
    const db = await getDatabase();
    const courses = await db.collection("public_courses")
      .find({ isPublic: true })
      .sort({ createdAt: -1 })
      .toArray();
    return { courses };
  } catch (e) {
    console.error("Error fetching public courses from MongoDB:", e);
    return { error: "Failed to fetch public courses" };
  }
}

export async function searchCourses(query: string) {
  try {
    const db = await getDatabase();
    const courses = await db.collection("public_courses")
      .find({ 
        $and: [
          { isPublic: true },
          { 
            $or: [
              { title: { $regex: query, $options: 'i' } },
              { description: { $regex: query, $options: 'i' } },
              { author: { $regex: query, $options: 'i' } }
            ]
          }
        ]
      })
      .toArray();
    return { courses };
  } catch (e) {
    console.error("Error searching courses in MongoDB:", e);
    return { error: "Failed to search courses" };
  }
}

export async function trackAttendance(userId: string, date: string) {
  try {
    const db = await getDatabase();
    
    // Check if attendance already marked for today
    const existing = await db.collection("attendance").findOne({
      userId,
      date
    });
    
    if (existing) {
      return { success: false, message: "Attendance already marked for today" };
    }
    
    // Mark attendance
    const result = await db.collection("attendance").insertOne({
      userId,
      date,
      timestamp: new Date()
    });
    
    return { success: true, result };
  } catch (e) {
    console.error("Error tracking attendance in MongoDB:", e);
    return { error: "Failed to track attendance" };
  }
}

export async function getAttendanceCount(userId: string) {
  try {
    const db = await getDatabase();
    const count = await db.collection("attendance").countDocuments({ userId });
    return { count };
  } catch (e) {
    console.error("Error getting attendance count from MongoDB:", e);
    return { error: "Failed to get attendance count" };
  }
}
