import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, getDocs, where, doc, getDoc } from 'firebase/firestore';
import Post from '../components/Post';
import CreatePost from '../components/CreatePost';

function Home({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('you');
  const [userDetails, setUserDetails] = useState(null);

  // Fetch user details including following/followers
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserDetails(userDoc.data());
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [user.uid]);

  // Fetch posts based on active tab
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let q;
        
        switch(activeTab) {
          case 'following':
            if (!userDetails?.following?.length) {
              setPosts([]);
              setLoading(false);
              return;
            }
            q = query(
              collection(db, 'posts'),
              where('userId', 'in', userDetails.following),
              orderBy('createdAt', 'desc')
            );
            break;
            
          case 'followers':
            if (!userDetails?.followers?.length) {
              setPosts([]);
              setLoading(false);
              return;
            }
            q = query(
              collection(db, 'posts'),
              where('userId', 'in', userDetails.followers),
              orderBy('createdAt', 'desc')
            );
            break;
            
          case 'you':
          default:
            q = query(
              collection(db, 'posts'),
              orderBy('createdAt', 'desc')
            );
            break;
        }

        const querySnapshot = await getDocs(q);
        const fetchedPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        console.log(`Fetched ${fetchedPosts.length} posts for tab: ${activeTab}`);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    if (userDetails || activeTab === 'you') {
      fetchPosts();
    }
  }, [activeTab, userDetails, user.uid]);

  const handleTabChange = (newTab) => {
    console.log('Tab changed to:', newTab);
    setActiveTab(newTab);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <CreatePost user={user} onTabChange={handleTabChange} />
      <div className="posts-container">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post key={post.id} post={post} currentUserId={user.uid} />
          ))
        ) : (
          <div className="no-posts">
            {activeTab === 'following' 
              ? "You're not following anyone yet. Follow some users to see their posts!"
              : activeTab === 'followers'
              ? "No posts from your followers yet."
              : "No posts yet. Be the first to post something!"}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home; 