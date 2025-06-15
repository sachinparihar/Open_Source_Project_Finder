import React from 'react';
import { useAuth } from '../context/AuthContext';
import BookmarkButton from './BookmarkButton';

export default function ProjectCard({ project }) {
  const { isAuthenticated } = useAuth();
  return (
    <div className="search-result" style={{ padding:'1rem', border:'1px solid #ccc', marginBottom:'1rem' }}>
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <a href={project.url} target="_blank" rel="noopener noreferrer">
        View on GitHub
      </a>
      <br />
      {isAuthenticated && <BookmarkButton project={project} />}
    </div>
  );
}