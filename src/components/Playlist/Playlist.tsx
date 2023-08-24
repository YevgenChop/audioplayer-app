import React from 'react';
import { Song } from 'api';

import './styles.css';

interface PlaylistProps {
  value: Song[];
  current?: Song;
  onChange?(song: Song): void;
}

export const Playlist = ({value, onChange, current}: PlaylistProps) => {

  return (
    <div>
      {value.map((song) => (
        <div
          className={current?.id === song.id ? 'playlist-song-active' : ''}
          key={song.id}
          onClick={() => onChange && onChange(song)}
        >
          <div className="playlist-song">
            <img className="playlist-song-cover" src={song.cover} alt={song.name}/>
            <div className="playlist-song-description">
              <span className="playlist-song-title">
                {song.name}
              </span>
              <span className="playlist-song-artist">
                {song.artist}
             </span>
            </div>
          </div>
        </div>
      ))
      }
    </div>
  );
};