import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function BookmarkedFolktale() {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!token) {
        setError('Please log in to view bookmarks.');
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:5000/api/folktales/bookmark`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookmarks(response.data);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
        setError('Failed to load bookmarks. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookmarks();
  }, [token]);

  const handleRemoveBookmark = async (folktaleId) => {
    try {
      await axios.delete(`http://localhost:5000/api/folktales/bookmarks/${folktaleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookmarks(bookmarks.filter((bookmark) => bookmark.folktaleId._id !== folktaleId));
      toast.success('Bookmark removed!');
    } catch (error) {
      console.error('Error removing bookmark:', error);
      const errorMessage = error.response?.data?.message || 'Failed to remove bookmark. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handleFolktaleClick = (folktaleId) => {
    navigate(`/folktale/${folktaleId}`);
  };

  if (!token) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          Please <span onClick={() => navigate('/login')} style={styles.link}>log in</span> to view your bookmarked folktales.
        </div>
      </div>
    );
  }

  if (isLoading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner}></div>
      <p style={styles.loadingText}>Loading your bookmarks...</p>
    </div>
  );
  
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        theme="light"
      />
      <h1 style={styles.title}>Your Bookmarked Folktales</h1>
      {bookmarks.length === 0 ? (
        <div style={styles.noBookmarksContainer}>
          <p style={styles.noBookmarks}>You haven't bookmarked any folktales yet.</p>
          <button 
            onClick={() => navigate('/')}
            style={styles.exploreButton}
          >
            Explore Folktales
          </button>
        </div>
      ) : (
        <div style={styles.bookmarkList}>
          {bookmarks.map((bookmark) => (
            <div key={bookmark.folktaleId._id} style={styles.bookmarkCard}>
              <div 
                style={styles.thumbnailContainer}
                onClick={() => handleFolktaleClick(bookmark.folktaleId._id)}
              >
                <img
                  src={bookmark.folktaleId.imageUrl}
                  alt={bookmark.folktaleId.title}
                  style={styles.thumbnail}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                  }}
                />
              </div>
              <div style={styles.bookmarkDetails}>
                <div 
                  style={styles.bookmarkTitleContainer}
                  onClick={() => handleFolktaleClick(bookmark.folktaleId._id)}
                >
                  <h3 style={styles.bookmarkTitle}>
                    {bookmark.folktaleId.title}
                  </h3>
                </div>
                <div style={styles.metaContainer}>
                  <p style={styles.bookmarkMeta}>
                    <strong>Region:</strong> {bookmark.folktaleId.region}
                  </p>
                  <p style={styles.bookmarkMeta}>
                    <strong>Genre:</strong> {bookmark.folktaleId.genre}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveBookmark(bookmark.folktaleId._id)}
                  style={styles.removeButton}
                >
                  Remove Bookmark
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Merriweather', serif",
    color: '#3a3a3a',
    lineHeight: '1.6',
    minHeight: 'calc(100vh - 100px)',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '2.5rem',
    color: '#5c3c10',
    textAlign: 'center',
    marginBottom: '30px',
    borderBottom: '2px solid #e0c9a6',
    paddingBottom: '10px',
    '@media (max-width: 768px)': {
      fontSize: '2rem',
    },
  },
  noBookmarksContainer: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#f9f5e9',
    borderRadius: '12px',
    margin: '30px 0',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  },
  noBookmarks: {
    fontSize: '1.2rem',
    color: '#666',
    marginBottom: '20px',
  },
  bookmarkList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '25px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  bookmarkCard: {
    display: 'flex',
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
    },
    '@media (max-width: 480px)': {
      flexDirection: 'column',
    },
  },
  thumbnailContainer: {
    cursor: 'pointer',
    flexShrink: 0,
    width: '150px',
    height: '150px',
    '@media (max-width: 480px)': {
      width: '100%',
      height: '200px',
    },
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  bookmarkDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '15px',
  },
  bookmarkTitleContainer: {
    cursor: 'pointer',
    marginBottom: '10px',
    '&:hover h3': {
      color: '#8b5a2b',
    },
  },
  bookmarkTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.3rem',
    color: '#5c3c10',
    margin: '0 0 8px 0',
    transition: 'color 0.2s ease',
  },
  metaContainer: {
    margin: '10px 0',
  },
  bookmarkMeta: {
    fontSize: '0.95rem',
    color: '#666',
    margin: '5px 0',
    backgroundColor: '#f9f5e9',
    padding: '5px 12px',
    borderRadius: '20px',
    display: 'inline-block',
    marginRight: '8px',
  },
  removeButton: {
    backgroundColor: '#d32f2f',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 15px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: "'Merriweather', serif",
    alignSelf: 'flex-start',
    marginTop: '10px',
    '&:hover': {
      backgroundColor: '#b71c1c',
      transform: 'translateY(-2px)',
    },
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
  },
  spinner: {
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #5c3c10',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  loadingText: {
    fontSize: '1.2rem',
    color: '#5c3c10',
    fontFamily: "'Merriweather', serif",
  },
  error: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '1.2rem',
    color: '#d32f2f',
    fontFamily: "'Merriweather', serif",
    backgroundColor: '#fff3cd',
    borderRadius: '8px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  link: {
    color: '#5c3c10',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontWeight: 'bold',
    '&:hover': {
      color: '#8b5a2b',
    },
  },
  exploreButton: {
    backgroundColor: '#5c3c10',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '12px 25px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: "'Merriweather', serif",
    '&:hover': {
      backgroundColor: '#8b5a2b',
      transform: 'translateY(-2px)',
    },
  },
};

// Add CSS for animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .bookmark-title:hover {
    color: #8b5a2b;
  }
`;
document.head.appendChild(styleSheet);

export default BookmarkedFolktale;