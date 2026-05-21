import { collection, doc, setDoc, getDocs, query, where, orderBy, writeBatch, serverTimestamp, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

export interface AttendanceRecord {
  id?: string;
  studentId: string;
  date: string;
  timestamp: any;
}

export interface TaskRecord {
  id?: string;
  title: string;
  createdAt: any;
  createdBy: string;
}

export interface TaskCompletion {
  id?: string;
  studentId: string;
  taskId: string;
  completedAt: any;
}

// Ensure local date string in YYYY-MM-DD
export function getLocalDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function markAttendance(studentId: string) {
  try {
    const date = getLocalDateString();
    const docId = `${date}_${studentId}`;
    const docRef = doc(db, 'attendance', docId);
    
    // Only write if doesn't exist to preserve original timestamp
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      await setDoc(docRef, {
        studentId,
        date,
        timestamp: serverTimestamp()
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'attendance');
  }
}

export async function getAttendances(date: string): Promise<AttendanceRecord[]> {
  try {
    const q = query(collection(db, 'attendance'), where('date', '==', date));
    const qs = await getDocs(q);
    return qs.docs.map(d => ({ id: d.id, ...d.data() } as AttendanceRecord));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'attendance');
    return [];
  }
}

export async function createTask(title: string, createdBy: string) {
  try {
    const newDocRef = doc(collection(db, 'tasks'));
    await setDoc(newDocRef, {
      title,
      createdAt: serverTimestamp(),
      createdBy
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'tasks');
  }
}

export async function getTasks(): Promise<TaskRecord[]> {
  try {
    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'asc'));
    const qs = await getDocs(q);
    return qs.docs.map(d => ({ id: d.id, ...d.data() } as TaskRecord));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'tasks');
    return [];
  }
}

export async function toggleTaskCompletion(studentId: string, taskId: string, completed: boolean) {
  try {
    const docId = `${studentId}_${taskId}`;
    const docRef = doc(db, 'taskCompletions', docId);
    if (completed) {
      await setDoc(docRef, {
        studentId,
        taskId,
        completedAt: serverTimestamp()
      });
    } else {
      const batch = writeBatch(db);
      batch.delete(docRef);
      await batch.commit();
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'taskCompletions');
  }
}

export async function getStudentTaskCompletions(studentId: string): Promise<TaskCompletion[]> {
  try {
    const q = query(collection(db, 'taskCompletions'), where('studentId', '==', studentId));
    const qs = await getDocs(q);
    return qs.docs.map(d => ({ id: d.id, ...d.data() } as TaskCompletion));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'taskCompletions');
    return [];
  }
}

export async function getAllTaskCompletions(): Promise<TaskCompletion[]> {
  try {
    const q = query(collection(db, 'taskCompletions'));
    const qs = await getDocs(q);
    return qs.docs.map(d => ({ id: d.id, ...d.data() } as TaskCompletion));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'taskCompletions');
    return [];
  }
}
