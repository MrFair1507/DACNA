import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

const API_URL = process.env.REACT_APP_API_URL;

const SearchBar = () => {
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (keyword.trim()) {
        fetchProjects(keyword);
      } else {
        setSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [keyword]);

  const fetchProjects = async (text) => {
    try {
      const res = await axios.get(`${API_URL}/projects/my-projects`, {
        withCredentials: true,
      });

      const lower = text.toLowerCase();
      const filtered = res.data
        .filter((p) =>
          p.project_name.toLowerCase().includes(lower)
        )
        .map((p) => ({
          id: p.project_id,
          name: p.project_name,
        }));

      setSuggestions(filtered);
    } catch (err) {
      console.error("❌ Không lấy được project:", err.message);
      setSuggestions([]);
    }
  };

  const handleSelect = (projectId) => {
    navigate(`/dashboard/${projectId}/sprints`);
    setKeyword("");
    setSuggestions([]);
  };

  return (
    <div className="search-bar" style={{ position: "relative" }}>
      <input
        type="text"
        placeholder="Tìm dự án..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button className="search-btn">
        <i className="icon-search" />
      </button>

      {suggestions.length > 0 && (
        <ul className="suggestion-dropdown">
          {suggestions.map((item, index) => (
            <li key={index} onClick={() => handleSelect(item.id)}>
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
