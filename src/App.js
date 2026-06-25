import { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './SearchBar';

function App() {
  const [searchQuery, setSearchQerry] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setRecommendations([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/books/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setRecommendations(data); 
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  async function handleSearch(overrideQuery) {
    const targetQuery = overrideQuery || searchQuery;
    if (!targetQuery.trim()) return;

    setIsLoading(true);
    setRecommendations([]);

    try {
      const response = await fetch(`http://localhost:5001/api/books/search?q=${encodeURIComponent(targetQuery)}`);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='Container'>
      <h1 className='Title'> My library </h1>
      
      <SearchBar
        query={searchQuery}
        setQuery={setSearchQerry}
        onSearch={() => handleSearch()} 
      />

      <div className="BookList">
        {recommendations.length > 0 && (
          <ul>
            {recommendations.map((book, index) => {
              const bookTitle = book.title || book;
              return (
                <li 
                  key={book.id || index} 
                  className="BookItem"
                  onMouseDown={() => {
                    setSearchQerry(bookTitle);
                    setRecommendations([]); 
                    handleSearch(bookTitle);
                  }}
                >
                  {bookTitle}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="ResultsContainer">
        {isLoading && <p className="DetailedLoadingText">Loading book details...</p>}

        {!isLoading && books.length > 0 && (
          <div className="BooksGrid">
            {books.map((book, index) => (
              <div key={book.id || index} className="BookCard">
                <div className="BookHeader">
                  <h2 className="BookCardTitle">{book.title}</h2>
                  {book.price && <span className="BookPrice">${book.price.toFixed(2)}</span>}
                </div>
                
                <p className="BookMeta">
                  <span><strong>Author:</strong> {book.author || 'Unknown'}</span>
                  <span><strong>Genre:</strong> {book.genre || 'General'}</span>
                  {book.published_year && <span><strong>Year:</strong> {book.published_year}</span>}
                </p>
                
                {book.description && <p className="BookDescription">{book.description}</p>}
                {book.isbn && <small className="BookIsbn">ISBN: {book.isbn}</small>}
              </div>
            ))}
          </div>
        )}

        {!isLoading && books.length === 0 && searchQuery && (
          <p className="NoDetailedResultsText">No book match found in our library catalog.</p>
        )}
      </div>
    </div>
  );
}

export default App;