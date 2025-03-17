
// Simple utility to handle user data in localStorage
export interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  profilePicture?: string;
  bio?: string;
}

export function saveUserData(userData: UserData): void {
  localStorage.setItem('userData', JSON.stringify(userData));
}

export function getUserData(): UserData | null {
  const data = localStorage.getItem('userData');
  return data ? JSON.parse(data) : null;
}

export function updateUserData(updates: Partial<UserData>): UserData | null {
  const userData = getUserData();
  if (!userData) return null;
  
  const updatedData = { ...userData, ...updates };
  saveUserData(updatedData);
  return updatedData;
}

export function clearUserData(): void {
  localStorage.removeItem('userData');
}
