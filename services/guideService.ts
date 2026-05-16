import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const guidesCollection = collection(db, 'guides');

export type Guide = {
  id?: string;
  title: string;
  category: string;
  content: string;
  isPublic?: boolean;
  isArchived?: boolean;
  userId?: string | null;
  createdAt?: any;
  updatedAt?: any;
};

export const addGuide = async (guide: {
  title: string;
  category: string;
  content: string;
  isPublic?: boolean;
  userId?: string | null;
}) => {
  const docRef = await addDoc(guidesCollection, {
    title: guide.title,
    category: guide.category,
    content: guide.content,
    isPublic: guide.isPublic ?? true,
    isArchived: false,
    userId: guide.userId ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
};

export const getGuides = async () => {
  const q = query(guidesCollection, where('isPublic', '==', true));
  const snapshot = await getDocs(q);

  const guides = snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as Guide[];

  return guides.filter((item) => item.isArchived === false);
};

export const getGuideById = async (id: string) => {
  const ref = doc(db, 'guides', id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Guide;
};

export const updateGuide = async (
  id: string,
  updatedData: {
    title?: string;
    category?: string;
    content?: string;
    isPublic?: boolean;
  }
) => {
  const ref = doc(db, 'guides', id);

  await updateDoc(ref, {
    ...updatedData,
    updatedAt: serverTimestamp(),
  });
};

export const deleteGuide = async (id: string) => {
  const ref = doc(db, 'guides', id);
  await deleteDoc(ref);
};

export const softDeleteGuide = async (id: string) => {
  const ref = doc(db, 'guides', id);

  await updateDoc(ref, {
    isArchived: true,
    updatedAt: serverTimestamp(),
  });
};