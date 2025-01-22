import React, { useState, useEffect } from 'react';
import './Card.css';

const Card = () => {
  const [pokemon, setPokemon] = useState([]); 
  const [paginatedPokemon, setPaginatedPokemon] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 20;

  const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=10000'; // Fetch full list

  // Fetch all Pokémon names and the first page of Pokémon details
  useEffect(() => {
    setLoading(true);

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setPokemon(data.results); // Store full list of Pokémon
        fetchPageData(data.results, 0); // Fetch first 20 Pokémon
      })
      .catch((error) => console.error('Error fetching Pokémon:', error))
      .finally(() => setLoading(false));
  }, []);

  // Fetch details for a specific page
  const fetchPageData = (pokemonList, page) => {
    const offset = page * limit;
    const currentPagePokemon = pokemonList.slice(offset, offset + limit);

    Promise.all(
      currentPagePokemon.map((poke) =>
        fetch(poke.url)
          .then((res) => res.json())
          .then((details) => ({
            name: poke.name,
            image: details.sprites.front_default,
          }))
      )
    ).then((pageData) => setPaginatedPokemon(pageData));
  };

  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      // Reset to the current page if search input is cleared
      fetchPageData(pokemon, currentPage);
      return;
    }

    const foundPokemon = pokemon.find(
      (poke) => poke.name.toLowerCase() === searchQuery.toLowerCase()
    );

    if (foundPokemon) {
      fetch(foundPokemon.url)
        .then((response) => response.json())
        .then((details) => {
          setPaginatedPokemon([
            {
              name: foundPokemon.name,
              image: details.sprites.front_default,
            },
          ]);
        });
    } else {
      setPaginatedPokemon([]); // Show no results if not found
    }
  };

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    if (nextPage * limit < pokemon.length) {
      setCurrentPage(nextPage);
      fetchPageData(pokemon, nextPage);
    }
  };

  const handlePreviousPage = () => {
    const previousPage = currentPage - 1;
    if (previousPage >= 0) {
      setCurrentPage(previousPage);
      fetchPageData(pokemon, previousPage);
    }
  };

  const handleSearchInputChange = (e) => {
    const input = e.target.value;
    setSearchQuery(input);

    if (input.trim() === '') {
      fetchPageData(pokemon, currentPage); // Reset to current page if search input is cleared
    }
  };

  // Render loading state
  if (loading) {
    return <div>Loading Pokémon...</div>;
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Pokémon by name..."
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Pokémon Cards */}
      <div className="card-container">
        {paginatedPokemon.length > 0 ? (
          paginatedPokemon.map((poke, index) => (
            <div key={index} className="card">
              <img src={poke.image} alt={poke.name} className="card-image" />
              <h2 className="card-title">{poke.name}</h2>
            </div>
          ))
        ) : (
          <div>No Pokémon found.</div>
        )}
      </div>

      {/* Pagination Buttons */}
      {!searchQuery && (
        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={currentPage === 0}>
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={(currentPage + 1) * limit >= pokemon.length}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Card;
