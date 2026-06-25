function SearchBar({ query, setQuery, onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="SearchForm">
      <input
        className="SearchBar"
        type="text"
        placeholder="Search by title, author, or genre..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="SearchButton" type="submit">Search</button>
    </form>
  );
}

export default SearchBar;