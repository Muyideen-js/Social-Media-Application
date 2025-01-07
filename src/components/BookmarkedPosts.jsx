import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import Post from './Post';

function BookmarkedPosts({ userId }) {
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarkedPosts = async () => {
      try {
        // Get user's bookmarks
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        const bookmarks = userDoc.data()?.bookmarks || [];

        if (bookmarks.length === 0) {
          setBookmarkedPosts([]);
          setLoading(false);
          return;
        }

        // Fetch all bookmarked posts
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, where('__name__', 'in', bookmarks));
        const querySnapshot = await getDocs(q);

        const posts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setBookmarkedPosts(posts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookmarked posts:', error);
        setLoading(false);
      }
    };

    if (userId) {
      fetchBookmarkedPosts();
    }
  }, [userId]);

  if (loading) {
    return <div className="loading">Loading bookmarks...</div>;
  }

  return (
    <div className="bookmarked-posts">
      {bookmarkedPosts.length === 0 ? (
        <div className="no-bookmarks">
          <p>No bookmarked posts yet</p>
        </div>
      ) : (
        bookmarkedPosts.map(post => (
          <Post key={post.id} post={post} currentUserId={userId} />
        ))
      )}
    </div>
  );
}

export default BookmarkedPosts; 