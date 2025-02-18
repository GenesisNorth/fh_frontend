import React, { useState, useEffect } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import './App.css';

// Import images
import farmImage from './assets/farmer-image.jpg';
import riceImage from './assets/Rice-farming.jpg';
import cowpeaImage from './assets/Cowpea-farming.jpg';
import drySeasonImage from './assets/Dry-season-farming.jpg';
import fruitImage from './assets/fruit-farm.jpg';
import vegetableImage from './assets/Vegetable-farm.jpg';
import cashImage from './assets/cash-crop.jpeg';
import seedImage from './assets/Seed-farm.jpg';
import consultImage from './assets/consult-farm.jpg';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:7000';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [crops, setCrops] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ crop: '', state: '', ecology: '' });

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/crops`);
        setCrops(response.data);
      } catch (err) {
        console.error('Error fetching crops:', err);
      }
    };
    fetchCrops();
  }, []);

  const fetchFilteredCrops = debounce(async () => {
    if (!searchQuery.trim()) {
      setFilteredCrops([]);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/crops/search`, {
        params: { query: searchQuery, ...filters }
      });
      setFilteredCrops(response.data);
    } catch (err) {
      setError('Error fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, 500);

  useEffect(() => {
    fetchFilteredCrops();
    return () => fetchFilteredCrops.cancel();
  }, [searchQuery, filters]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCropSelect = (crop) => {
    setSelectedCrop(crop);
    setSearchQuery('');
    setFilteredCrops([]);
  };

  return (
    <div className="App">
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="text-content">
            <h1 className="hero-title">Welcome To <br /> Farmers Helpline</h1>
            <button className="cta-button">Call Us Today</button>
          </div>
          <div className="image-content">
            <img src={farmImage} alt="Farm" className="hero-image" />
          </div>
        </div>
      </section>

      <section className="search-section">
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Enter Crop Name" className="search-bar" />
        <div className="filter-container">
          <select name="variety" onChange={handleFilterChange} className="dropdown">
            <option value="">Select Crop Variety</option>
            <option value="FARO 44">FARO 44 (RICE)</option>
            <option value="FARO 52">FARO 52 (RICE)</option>
            <option value="TGX 1448-2E">TGX 144-2E (SOY BEAN)</option>
            <option value="TDr 89/02665">TDr 89/02665 (YAM)</option>
            <option value="IT89KD (COWPEA)">IT89KD (COWPEA)</option>
           
          </select>
          <select name="state" onChange={handleFilterChange} className="dropdown">
            <option value="">Select State</option>
            <option value="Kaduna">Kaduna</option>
            <option value="Ondo">Ondo</option>
            <option value="Niger">Niger</option>
            <option value="Bauchi">Bauchi</option>
          </select>
          <select name="ecology" onChange={handleFilterChange} className="dropdown">
            <option value="">Select Ecology</option>
            <option value="Savanna">Savanna</option>
            <option value="Forest">Forest</option>
          </select>
        </div>
        {loading && <p className="loading">Loading...</p>}
        {error && <p className="error">{error}</p>}
        {filteredCrops.length > 0 && (
          <ul className="search-results">
            {filteredCrops.map((crop) => (
              <li key={crop._id} onClick={() => handleCropSelect(crop)}>
                {crop.cropName} - {crop.ecology}
              </li>
            ))}
          </ul>
        )}
      </section>

  {selectedCrop && (
    <section className="crop-details-section">
      <h2 align="center">Crop Details</h2>
      <table className="crop-details-table">
        <tbody>
          <tr><th>Crop Name</th><td>{selectedCrop.cropName || 'N/A'}</td></tr>
          <tr><th>Variety</th><td>{selectedCrop.variety || 'N/A'}</td></tr>
          <tr><th>Ecology</th><td>{(selectedCrop.ecology || 'N/A').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</td></tr>
          <tr><th>Yield Potential</th><td>{selectedCrop.yieldPotential || 'N/A'}</td></tr>
          <tr><th>Duration</th><td>{selectedCrop.duration || 'N/A'}</td></tr>
          <tr><th>Production System</th><td>{(selectedCrop.productionSystem || 'N/A').replace(/([A-Z])/g, ' $1')}</td></tr>
          <tr><th>Planting Dates</th><td>
            {selectedCrop.plantingDates ? (
              <>
                <strong>Northern Guinea Savanna:</strong> {selectedCrop.plantingDates.northernGuineaSavanna}<br />
                <strong>Southern Guinea Savanna:</strong> {selectedCrop.plantingDates.southernGuineaSavanna}
              </>
            ) : "Not Available"}
          </td></tr>
          <tr><th>Harvesting</th><td>{selectedCrop.harvesting?.replace('Harvest maturity: ', '') || 'N/A'}</td></tr>
          <tr><th>Storage</th><td>{selectedCrop.storage || 'N/A'}</td></tr>
        </tbody>
      </table>
    </section>
      )}

      {/* Featured Search Section */}
      <section className="featured-search-section">
        <h1 align="center">Featured Search</h1>
        <br />
        <div className="featured-search-container">
          <div className="featured-search-item">
            <img src={riceImage} alt="Rice Farming" className="featured-search-image" />
            <h3 className="featured-search-title">Rice Farming</h3>
            <p className="featured-search-description">How to farm rice in Nigeria.</p>
            <button className="cta-button">Search Now</button>
          </div>
          <div className="featured-search-item">
            <img src={cowpeaImage} alt="Cowpea Farming" className="featured-search-image" />
            <h3 className="featured-search-title">Cowpea Farming</h3>
            <p className="featured-search-description">How to farm Cowpea in Nigeria.</p>
            <button className="cta-button">Search Now</button>
          </div>
          <div className="featured-search-item">
            <img src={drySeasonImage} alt="Dry Season Farming" className="featured-search-image" />
            <h3 className="featured-search-title">Dry Season Farming</h3>
            <p className="featured-search-description">Explore dry season farming in Nigeria.</p>
            <button className="cta-button">Search Now</button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="category-section">
        <h2 className="category-header">Farming Categories</h2>
        <div className="category-container">
          <div className="category-item">
            <img src={fruitImage} alt="Fruits" className="category-image" />
            <h3 className="category-title">Fruits</h3>
            <p className="category-description">Learn about different types of fruits and how to grow them.</p>
          </div>
          <div className="category-item">
            <img src={cashImage} alt="Cash Crops" className="category-image" />
            <h3 className="category-title">Cash Crops</h3>
            <p className="category-description">Get tips and advice on growing valuable cash crops.</p>
          </div>
          <div className="category-item">
            <img src={seedImage} alt="Seeds" className="category-image" />
            <h3 className="category-title">Seeds</h3>
            <p className="category-description">Discover the importance of quality seeds for successful farming.</p>
          </div>
          <div className="category-item">
            <img src={vegetableImage} alt="Vegetables" className="category-image" />
            <h3 className="category-title">Vegetables</h3>
            <p className="category-description">Learn how to grow a variety of vegetables for your farm.</p>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="what-we-do-section">
        <h2 className="category-header">What We Do</h2>
        <div className="category-container">
          <div className="category-item">
            <img src={consultImage} alt="Consultation" className="category-image" />
            <h3 className="category-title">Consultation</h3>
            <p className="category-description">We provide expert consultation for all types of farming.</p>
          </div>
          <div className="category-item">
            <img src={consultImage} alt="Training" className="category-image" />
            <h3 className="category-title">Training</h3>
            <p className="category-description">We offer hands-on training for farmers on best practices.</p>
          </div>
          <div className="category-item">
            <img src={consultImage} alt="Supply of Inputs" className="category-image" />
            <h3 className="category-title">Supply of Inputs</h3>
            <p className="category-description">We supply high-quality seeds, fertilizers, and tools.</p>
          </div>
          <div className="category-item">
            <img src={consultImage} alt="Market Linkage" className="category-image" />
            <h3 className="category-title">Market Linkages</h3>
            <p className="category-description">We help farmers connect with markets for their produce.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;