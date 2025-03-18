
import clientPromise from './mongodb';

export async function getFeatures() {
  try {
    const client = await clientPromise;
    const db = client.db("school_edge");
    const features = await db.collection("features").find({}).toArray();
    return { features };
  } catch (e) {
    console.error("Error fetching features from MongoDB:", e);
    return { error: "Failed to fetch features" };
  }
}

export async function getStudents() {
  try {
    const client = await clientPromise;
    const db = client.db("school_edge");
    const students = await db.collection("students").find({}).toArray();
    return { students };
  } catch (e) {
    console.error("Error fetching students from MongoDB:", e);
    return { error: "Failed to fetch students" };
  }
}

export async function getCourses() {
  try {
    const client = await clientPromise;
    const db = client.db("school_edge");
    const courses = await db.collection("courses").find({}).toArray();
    return { courses };
  } catch (e) {
    console.error("Error fetching courses from MongoDB:", e);
    return { error: "Failed to fetch courses" };
  }
}

export async function getAssignments(studentId: string) {
  try {
    const client = await clientPromise;
    const db = client.db("school_edge");
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
    const client = await clientPromise;
    const db = client.db("school_edge");
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
