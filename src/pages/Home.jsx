import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import RightSidebar from '../components/RightSidebar';
import '../styles/Home.css';
import { IoArrowBack } from 'react-icons/io5';

function Home({ user }) {
  const [posts, setPosts] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
    });

    return () => unsubscribe();
  }, []);

  const handleHashtagSearch = async (results, term) => {
    setIsLoading(true);
    setSearchTerm(term);
    
    // Add a small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setSearchResults(results);
    setIsLoading(false);
  };

  return (
    <div className="home">
      <div className="home-content">
        {searchResults !== null ? (
          <>
            <div className="search-results-header">
              <button 
                className="back-button"
                onClick={() => {
                  setSearchResults(null);
                  setSearchTerm('');
                }}
              >
                <IoArrowBack />
              </button>
              <div className="search-info">
                <h2>Search Results</h2>
                {searchTerm && <p>Showing posts with #{searchTerm}</p>}
              </div>
            </div>
            <div className="posts-feed">
              {isLoading ? (
                <div className="loading">
                  <div className="loading-spinner"></div>
                  <p>Loading results...</p>
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map(post => (
                  <Post key={post.id} post={post} currentUserId={user?.uid} />
                ))
              ) : (
                <div className="no-results">
                  <h3>No posts found with #{searchTerm}</h3>
                  <button 
                    className="clear-search"
                    onClick={() => {
                      setSearchResults(null);
                      setSearchTerm('');
                    }}
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <CreatePost user={user} />
            <div className="posts-feed">
              {posts.map(post => (
                <Post key={post.id} post={post} currentUserId={user?.uid} />
              ))}
            </div>
          </>
        )}
      </div>
      <RightSidebar 
        onHashtagSearch={handleHashtagSearch} 
        user={user}
      />
    </div>
  );
}

export default Home; 