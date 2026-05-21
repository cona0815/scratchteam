import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut, signInAnonymously } from 'firebase/auth';
import { auth } from './firebase';

const provider = new GoogleAuthProvider();

export const initAuth = (
  onAuthSuccess?: (user: User) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (onAuthSuccess) onAuthSuccess(user);
    } else {
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

export const studentAnonymousSignIn = async (): Promise<User | null> => {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error('Student sign in error:', error);
    throw error;
  }
};

export const logout = async () => {
  await signOut(auth);
};
