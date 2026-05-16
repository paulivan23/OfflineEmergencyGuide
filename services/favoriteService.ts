import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    serverTimestamp,
    where,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const favoritesCollection = collection(db, 'favorites');

export const addFavorite = async (data: {
  userId: string;
  guideId: string;
  title: string;
  category: string;
  content: string;
}) => {
  const existing = query(
    favoritesCollection,
    where('userId', '==', data.userId),
    where('guideId', '==', data.guideId)
  );

  const snapshot = await getDocs(existing);

  if (!snapshot.empty) {
    return snapshot.docs[0].id;
  }

  const docRef = await addDoc(favoritesCollection, {
    ...data,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};

export const getFavoritesByUser = async (userId: string) => {
  const q = query(favoritesCollection, where('userId', '==', userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
};

export const removeFavorite = async (favoriteId: string) => {
  const ref = doc(db, 'favorites', favoriteId);
  await deleteDoc(ref);
};

export const getFavoriteByGuideAndUser = async (userId: string, guideId: string) => {
  const q = query(
    favoritesCollection,
    where('userId', '==', userId),
    where('guideId', '==', guideId)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const favoriteDoc = snapshot.docs[0];

  return {
    id: favoriteDoc.id,
    ...favoriteDoc.data(),
  };
};