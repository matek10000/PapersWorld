import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Funkcja do pobierania wszystkich budynków z Firestore
export const getAllBuildings = async () => {
  try {
    const buildingsCollection = collection(db, 'buildings');
    const buildingsSnapshot = await getDocs(buildingsCollection);

    // Mapujemy dokumenty na tablicę obiektów
    const buildings = buildingsSnapshot.docs.map((doc) => ({
      id: doc.id, // ID dokumentu
      ...doc.data() // Dane budynku
    }));

    return buildings;
  } catch (error) {
    console.error('Error fetching buildings:', error);
    return [];
  }
};
