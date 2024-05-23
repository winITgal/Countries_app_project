document.addEventListener('DOMContentLoaded', () => {
    const toggler = document.querySelector('.toggler');
    const container = document.querySelector('.container');
    const searchInput = document.querySelector('.form input');
    const searchButton = document.querySelector('.btn');
    const closeButton = document.querySelector('#close');
    const backButton = document.querySelector('#back');
    const countriesContainer = document.querySelector('.countries');
    const resultsText = document.querySelector('.results');
    const introducerText = document.querySelector('.introducer');
    const regionSelect = document.querySelector('#regionSelect');
    const stats = document.querySelector('.stats');

    let countriesData = [];

    // Toggle dark/light mode
    toggler.addEventListener('click', () => {
        container.classList.toggle('light-mode');
    });

    // Fetch countries data from API
    const fetchCountries = async () => {
        try {
            const response = await fetch('https://restcountries.com/v3.1/all');
            const data = await response.json();
            countriesData = data;
            displayCountries(countriesData);
        } catch (error) {
            console.error('Error fetching countries data:', error);
        }
    };

    // Display countries in the container
    const displayCountries = (countries) => {
        countriesContainer.innerHTML = '';
        countries.forEach(country => {
            const countryCard = document.createElement('div');
            countryCard.classList.add('country-card');
            countryCard.innerHTML = `
                <img src="${country.flags.svg}" alt="${country.name.common} flag">
                <div class="country-info">
                    <h3>${country.name.common}</h3>
                    <p>Population: ${country.population.toLocaleString()}</p>
                    <p>Region: ${country.region}</p>
                    <p>Capital: ${country.capital}</p>
                </div>
            `;
            countryCard.addEventListener('click', () => displayCountryDetails(country));
            countriesContainer.appendChild(countryCard);
        });
    };

// Display detailed info about a country
const displayCountryDetails = (country) => {
    const infoContainer = document.createElement('div');
    infoContainer.classList.add('info');

    const leftColumn = document.createElement('div');
    leftColumn.classList.add('left-column');

    const rightColumn = document.createElement('div');
    rightColumn.classList.add('right-column');

    // Add information to the left column
    leftColumn.innerHTML += `
        <p>Native Name: <span>${country.name.nativeName?.[Object.keys(country.name.nativeName)[0]].common || 'N/A'}</span></p>
        <p>Region: <span>${country.region}</span></p>
        <p>Subregion: <span>${country.subregion}</span></p>
        <p>Capital: <span>${country.capital}</span></p>
    `;

    // Add information to the right column
    rightColumn.innerHTML += `
        <p>Top Level Domain: <span>${country.tld}</span></p>
        <p>Currency: <span>${Object.values(country.currencies)?.[0].name || 'N/A'}</span></p>
        <p>Language: <span>${Object.values(country.languages).join(', ')}</span></p>
    `;

    infoContainer.appendChild(leftColumn);
    infoContainer.appendChild(rightColumn);

    stats.querySelector('.image').innerHTML = `<img src="${country.flags.svg}" alt="${country.name.common} flag">`;
    stats.querySelector('.country_title').textContent = country.name.common;
    stats.appendChild(infoContainer);

    stats.style.display = 'flex';
    closeButton.classList.remove('hidden');
    backButton.classList.remove('hidden');
    countriesContainer.classList.add('hidden');
    introducerText.classList.add('hidden');
};

  // Search functionality
  const handleSearch = () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm) {
        const filteredCountries = countriesData.filter(country =>
            country.name.common.toLowerCase().includes(searchTerm)
        );
        displayCountries(filteredCountries);
        resultsText.textContent = `Found ${filteredCountries.length} countries for "${searchTerm}"`;
    } else {
        displayCountries(countriesData);
        resultsText.textContent = '';
    }
};

searchButton.addEventListener('click', handleSearch);

searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

    // Close detailed view
    closeButton.addEventListener('click', () => {
        stats.style.display = 'none';
        closeButton.classList.add('hidden');
        backButton.classList.add('hidden');
        countriesContainer.classList.remove('hidden');
        introducerText.classList.remove('hidden');
    });

    // Back to standard display
    backButton.addEventListener('click', () => {
        stats.style.display = 'none';
        closeButton.classList.add('hidden');
        backButton.classList.add('hidden');
        countriesContainer.classList.remove('hidden');
        introducerText.classList.remove('hidden');
    });

    // Filter by region
    regionSelect.addEventListener('change', () => {
        const selectedRegion = regionSelect.value;
        if (selectedRegion === 'All') {
            displayCountries(countriesData);
        } else {
            const filteredCountries = countriesData.filter(country => country.region === selectedRegion);
            displayCountries(filteredCountries);
        }
    });

    // Initial fetch and display
    fetchCountries();
});


