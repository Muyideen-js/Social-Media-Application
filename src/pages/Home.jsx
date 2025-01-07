import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import CreatePost from '../components/CreatePost';
import Toast from '../components/Toast';
import '../styles/Home.css';
import Post from '../components/Post';

function Home() {
  const [posts, setPosts] = useState([]);
  const [toast, setToast] = useState(null);

  // Listen to posts in real-time
  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(newPosts);
    });

    return () => unsubscribe();
  }, []);

  const handlePostCreated = () => {
    setToast({
      message: 'Post created successfully!',
      type: 'success'
    });
  };

  return (
    <div className="home">
      <CreatePost user={auth.currentUser} onPostCreated={handlePostCreated} />

      <div className="posts-feed">
        {posts.map(post => (
          <Post 
            key={post.id} 
            post={post} 
            currentUserId={auth.currentUser.uid} 
          />
        ))}
      </div>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}

export default Home; 