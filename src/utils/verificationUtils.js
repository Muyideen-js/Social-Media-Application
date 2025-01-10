import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function checkVerificationStatus(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('Verification status for user:', userId, userData);
      return {
        verified: userData.verified || false,
        type: userData.verificationType || 'user'
      };
    }
    return null;
  } catch (error) {
    console.error('Error checking verification status:', error);
    return null;
  }
} 