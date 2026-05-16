import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  verifyBeforeUpdateEmail,
} from 'firebase/auth';
import { auth } from './firebaseConfig';

export const loginUser = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const registerUser = async (
  fullName: string,
  email: string,
  password: string
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await updateProfile(userCredential.user, {
    displayName: fullName,
  });

  return userCredential;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const forgotPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

export const updateUserFullName = async (user: User, fullName: string) => {
  await updateProfile(user, {
    displayName: fullName,
  });
};

export const requestUserEmailChange = async (
  user: User,
  newEmail: string
) => {
  await verifyBeforeUpdateEmail(user, newEmail);
};