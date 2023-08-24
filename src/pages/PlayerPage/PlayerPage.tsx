import React, { useCallback, useEffect, useMemo } from 'react';
import { Player, Playlist } from 'components';
import { Song, songs } from 'api';

import './styles.css';

export const PlayerPage = () => {
  const [current, setCurrent] = React.useState<Song>(songs[0]);

  const currentSongIndex = useMemo(() => {
    return songs.findIndex((song) => song.id === current.id)
  }, [current]);

  const onNext = useCallback(() => {
    const nextSong = songs[currentSongIndex + 1] || songs[0];
    if (nextSong) {
      setCurrent(nextSong);
    }
  }, [currentSongIndex]);

  const onPrevious = useCallback(() => {
    const previousSong = songs[currentSongIndex - 1] || songs[songs.length - 1];
    if (previousSong) {
      setCurrent(previousSong);
    }
  }, [currentSongIndex]);

  useEffect(() => {
    document.title = !current ? 'Player' : `Player - ${current.name} - ${current.artist}`
  }, [current]);

  return (
    <div className="player-page">
      <div className="playlist-page-sidebar">
        <Playlist
          value={songs}
          onChange={setCurrent}
          current={current}
        />
      </div>
      <div className="player-page-main">
        <Player
          value={current}
          onNext={onNext}
          onPrevious={onPrevious}
        />
      </div>
    </div>
  )
}