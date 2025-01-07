import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { FcGoogle } from 'react-icons/fc';

function Auth() {
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Welcome to WiChat</h1>
        <p>Connect with friends and share your moments</p>
        <button className="google-sign-in" onClick={handleGoogleSignIn}>
          <FcGoogle className="google-icon" />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
}

export default Auth; 