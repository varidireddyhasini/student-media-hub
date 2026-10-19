import { useEffect, useState } from 'react'
import './App.css'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/videos'
function getYouTubeEmbedUrl(url) {
  try {
    const parsed = new URL(url)
    let videoId = ''

    if (parsed.hostname.includes('youtu.be')) {
      videoId = parsed.pathname.slice(1)
    } else if (
      parsed.hostname.includes('youtube.com') ||
      parsed.hostname.includes('youtube-nocookie.com')
    ) {
      if (parsed.pathname === '/watch') {
        videoId = parsed.searchParams.get('v') || ''
      } else if (
        parsed.pathname.startsWith('/shorts/') ||
        parsed.pathname.startsWith('/embed/')
      ) {
        videoId = parsed.pathname.split('/')[2] || ''
      }
    }

    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return null
    }

    return `https://www.youtube.com/embed/${videoId}`
  } catch {
    return null
  }
}
function App() {
  const [videos, setVideos] = useState([])
  const [playingVideoId, setPlayingVideoId] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const [reviewForms, setReviewForms] = useState({})
  const [reviewMessages, setReviewMessages] = useState({})
  const [activeReviewVideoId, setActiveReviewVideoId] = useState(null)
  async function submitReview(videoId) {
    const review = reviewForms[videoId] || {
      studentName: '',
      rating: '5',
      comment: '',
    }
    console.log('Review form values:', review)
console.log('Rating as number:', Number(review.rating))
    if (!review.studentName.trim() || !review.comment.trim()) {
      setReviewMessages((previous) => ({
        ...previous,
        [videoId]: 'Please enter your name and comment.',
      }))
      return
    }

    try {
      console.log('Video ID for review:', videoId)
      console.log('Review form:', review)
console.log('Rating before sending:', Number(review.rating))
      const response = await fetch(`${API_URL}/${videoId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        
body: JSON.stringify({
  studentName: review.studentName.trim(),
  rating: Number(review.rating),
  comment: review.comment.trim(),
}),

      })
        const data = await response.json()

console.log('Review response status:', response.status)
console.log('Review response data:', data)

if (!response.ok) {
  throw new Error(data.message || 'Could not submit review.')
}
      setVideos((previous) =>
        previous.map((video) => (video._id === videoId ? data : video))
      )

      setReviewForms((previous) => ({
        ...previous,
        [videoId]: { studentName: '', rating: '5', comment: '' },
      }))

      setReviewMessages((previous) => ({
        ...previous,
        [videoId]: 'Review submitted successfully!',
      }))
    } catch (err) {
      setReviewMessages((previous) => ({
        ...previous,
        [videoId]: err.message || 'Could not submit review.',
      }))
    }
  }


  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Could not load videos')
        }
        return response.json()
      })
      .then((data) => {
        setVideos(data)
        setError('')
      })
      .catch(() => {
        setError(
          'Could not connect to the backend. Make sure your backend server is running.'
        )
      })
      .finally(() => setLoading(false))
  }, [])

  const categories = [
    'All',
    ...new Set(videos.map((video) => video.field)),
  ]

  const filteredVideos = videos.filter((video) => {
    const matchesCategory =
      category === 'All' || video.field === category

    const searchText = search.toLowerCase()

    const matchesSearch =
      video.title.toLowerCase().includes(searchText) ||
      video.description.toLowerCase().includes(searchText) ||
      video.field.toLowerCase().includes(searchText)

    return matchesCategory && matchesSearch
  })

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-icon">▶</span>
          FieldReel
        </a>

        <nav>
          <a className="nav-active" href="#home">Home</a>
          <a href="#videos">Explore Videos</a>
          <a href="#about">About</a>
        </nav>

        <a className="nav-button" href="#videos">
          Explore Now ↗
        </a>
      </header>

      <main>
        <section className="hero-section" id="home">
          <div className="hero-content">
            <span className="eyebrow">
              ✦ LEARN · WATCH · REVIEW
            </span>

            <h1>
              Your learning.
              <br />
              Your <span>community.</span>
            </h1>

            <p>
              Discover inspiring educational videos, explore new
              fields, and share your reviews with fellow students.
            </p>

            <a className="primary-button" href="#videos">
              Explore Videos <span>→</span>
            </a>

            <div className="hero-note">
              <span>🎓</span>
              Made for curious students
            </div>
          </div>

          <div className="hero-art">
            <div className="art-circle circle-one"></div>
            <div className="art-circle circle-two"></div>

            <div className="floating-card card-top">
              <span>✨</span> Learn something new
            </div>

            <div className="video-preview">
              <div className="preview-top">
                <span>FIELDREEL ORIGINALS</span>
                <span>STUDENT HUB</span>
              </div>

              <div className="preview-emoji">🚀</div>

              <div className="preview-title">
                Ideas that move
                <br />
                you forward.
              </div>

              <div className="preview-bottom">
                <span>Student spotlight</span>
                <span>▶ Watch & learn</span>
              </div>
            </div>

            <div className="floating-card card-bottom">
              <span>⭐</span> Student-rated content
            </div>
          </div>
        </section>

        <section className="videos-section" id="videos">
          <div className="section-heading">
            <div>
              <span className="eyebrow">YOUR NEXT DISCOVERY</span>
              <h2>
                Explore the feed<span>.</span>
              </h2>
              <p>Videos loaded from your Student Media Hub database.</p>
            </div>

            
            <div className="video-count">
              <strong>
                {filteredVideos.length.toString().padStart(2, '0')}
              </strong>
              <span>VIDEOS FOUND</span>
            </div>
          </div>

          <div className="search-box">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Search videos, topics, or fields..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          
<div className="category-filters">
  {[
    'All',
    ...new Set(videos.map((video) => video.field)),
  ].map((item) => (
    <button
      key={item}
      type="button"
      className={`category-button ${
        category === item ? 'active' : ''
      }`}
      onClick={() => setCategory(item)}
    >
      {item}
    </button>
  ))}
</div>


          <div className="category-list">
            {categories.map((item) => (
              <button
                key={item}
                className={
                  category === item ? 'category active' : 'category'
                }
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {loading && (
            <p>Loading videos from MongoDB...</p>
          )}

          {error && (
            <div className="empty-state">
              <h3>Unable to load videos</h3>
              <p>{error}</p>
              <button
                className="primary-button"
                onClick={() => window.location.reload()}
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="video-grid">
              {filteredVideos.map((video, index) => (
                <article className="video-card" key={video._id}>
                  <div
                    className={`video-art ${
                      ['purple', 'pink', 'blue', 'orange'][
                        index % 4
                      ]
                    }`}
                  >
                    <span className="video-number">
                      REEL {String(index + 1).padStart(2, '0')}
                    </span>

                    {video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        style={{
                          width: '100%',
                          height: '180px',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <span className="video-emoji">🎬</span>
                    )}

                    {getYouTubeEmbedUrl(video.videoUrl) && (
  <button
    type="button"
    className="play-button"
    onClick={() =>
      setPlayingVideoId(
        playingVideoId === video._id ? null : video._id
      )
    }
    aria-label={`Play ${video.title}`}
  >
    {playingVideoId === video._id ? '×' : '▶'}
  </button>
                    )}

                    <span className="art-caption">
                      {video.field}
                    </span>
                  </div>
                  {playingVideoId === video._id && (
                    <div className="embedded-player">
                      <iframe
                        src={getYouTubeEmbedUrl(video.videoUrl)}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  </div>
)}

                  <div className="video-info">
                    <div className="video-meta">
                      <span>{video.field}</span>
                      <span>
                        ★ {video.averageRating ?? 0}
                      </span>
                    </div>

                    <h3>{video.title}</h3>
                    <p>{video.description}</p>

                   
<div className="review-button">
  <a
    href={video.videoUrl}
    target="_blank"
    rel="noreferrer"
  >
    Watch Video ↗
  </a>

  <button
    type="button"
    className="rate-video-button"
    onClick={() => setActiveReviewVideoId(video._id)}
  >
    ⭐ Rate This Video
  </button>

  <span>
    {video.reviews?.length ?? 0} reviews
   </span>
 </div>
 </div>
 </article>
 ))}
 </div>
  )}                 

          {activeReviewVideoId && (() => {
            const video = videos.find(
              (item) => item._id === activeReviewVideoId
            )

            if (!video) return null

            const review = reviewForms[video._id] || {
              studentName: '',
              rating: '5',
              comment: '',
            }

            return (
              <div
                className="review-modal-backdrop"
                onClick={() => setActiveReviewVideoId(null)}
              >
                <section
                  className="review-modal"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="review-modal-title"
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    className="review-modal-close"
                    onClick={() => setActiveReviewVideoId(null)}
                  >
                    ×
                  </button>

                  <span className="eyebrow">STUDENT REVIEWS</span>
                  <h2 id="review-modal-title">{video.title}</h2>
                  <p>{video.description}</p>

                  <div className="review-summary">
                    <strong>★ {video.averageRating ?? 0} / 5</strong>
                    <span>{video.reviews?.length ?? 0} reviews</span>
                  </div>

                  <h3>Student feedback</h3>

                  <div className="review-list">
                    {video.reviews?.length ? (
                      video.reviews.map((item, index) => (
                        <div className="review-card" key={item._id || index}>
                          <strong>{item.studentName}</strong>
                          <div className="review-card-stars">
                            {'★'.repeat(Number(item.rating) || 0)}
                            {'☆'.repeat(5 - (Number(item.rating) || 0))}
                          </div>
                          <p>{item.comment}</p>
                          {item.createdAt && (
                            <small>
                              {new Date(item.createdAt).toLocaleDateString()}
                            </small>
                          )}
                        </div>
                      ))
                    ) : (
                      <p>No reviews yet. Be the first to review!</p>
                    )}
                  </div>

                  <div className="student-review-form">
                    <h3>Write your review</h3>

                    <input
                      type="text"
                      placeholder="Your name"
                      value={review.studentName}
                      onChange={(event) =>
                        setReviewForms((previous) => ({
                          ...previous,
                          [video._id]: {
                            ...(previous[video._id] || {}),
                            studentName: event.target.value,
                          },
                        }))
                      }
                    />

                    <div className="star-rating-input">
                      <span className="rating-label">Your rating</span>
                      <div className="star-options">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={
                              star <= Number(review.rating)
                                ? 'star-option selected'
                                : 'star-option'
                            }
                            onClick={() =>
                              setReviewForms((previous) => ({
                                ...previous,
                                [video._id]: {
                                  ...(previous[video._id] || {}),
                                  rating: String(star),
                                },
                              }))
                            }
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      <span className="rating-hint">
                        {Number(review.rating)} out of 5 stars
                      </span>
                    </div>

                    <textarea
                      placeholder="Write your review..."
                      value={review.comment}
                      onChange={(event) =>
                        setReviewForms((previous) => ({
                          ...previous,
                          [video._id]: {
                            ...(previous[video._id] || {}),
                            comment: event.target.value,
                          },
                        }))
                      }
                    />

                    <button
                      type="button"
                      className="primary-button"
                      onClick={() => submitReview(video._id)}
                    >
                      Submit Review
                    </button>

                    {reviewMessages[video._id] && (
                      <p>{reviewMessages[video._id]}</p>
                    )}
                  </div>
                </section>
              </div>
            )
          })()}

          {!loading && !error && filteredVideos.length === 0 && (
            <div className="empty-state">
              <span>🔎</span>
              <h3>No videos found</h3>
              <p>
                {videos.length === 0
                  ? 'No videos have been added yet.'
                  : 'Try another search or category.'}
              </p>
              <button
                className="primary-button"
                onClick={() => {
                  setSearch('')
                  setCategory('All')
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        <section className="about-section" id="about">
          <span>BUILT FOR STUDENT CREATIVITY</span>
          <h2>Watch with curiosity. Review with purpose.</h2>
          <p>
            A place for students to discover educational media
            and exchange helpful feedback.
          </p>
        </section>
      </main>

      <footer>
              
        <a className="brand" href="#home">
          <span className="brand-icon">▶</span>
          FieldReel
          
        </a>
        <span>
          Student Media Hub · Learn something worth sharing.
        </span>
      </footer>
    </div>
  )
}

export default App
