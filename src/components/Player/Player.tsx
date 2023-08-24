import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FaPlay, FaPause, FaChevronRight, FaChevronLeft } from 'react-icons/fa6';
import { Song } from 'api';
import { formatTime } from 'utils';

import './styles.css';

interface PlayerProps {
  value: Song;

  onNext?(): void;

  onPrevious?(): void;
}

const emptyFn = () => {
};
export const Player = ({value, onNext = emptyFn, ...props}: PlayerProps) => {

  const audio = useMemo(() => new Audio(), []);

  const metaRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    audio.addEventListener('ended', onNext);

    return () => audio.removeEventListener('ended', onNext);
  }, [onNext]);

  useEffect(() => {
    const onPlaying = () => setIsPlaying(!audio.paused);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPlaying);

    return () => {
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPlaying);
    };
  }, [audio]);

  const onTimeUpdate = useCallback(() => {
    setDuration(audio.duration);
    setCurrentTime(audio.currentTime);
    metaRef.current = requestAnimationFrame(onTimeUpdate);
  }, [audio]);

  useEffect(() => {
    if (isPlaying) {
      metaRef.current = requestAnimationFrame(onTimeUpdate);
    } else {
      if (metaRef.current) {
        cancelAnimationFrame(metaRef.current);
      }
    }
  }, [isPlaying, audio, onTimeUpdate]);

  useEffect(() => {
    if (value?.audio) {
      audio.src = value.audio;
      audio.play().catch(console.info);
    }
  }, [value, audio]);

  const playPause = useCallback(() => {
    if (audio.paused) {
      audio.play().catch(console.info);
    } else {
      audio.pause();
    }
  }, [audio]);

  return (
    <div className="player-container">
      <div className="song-cover ">
        <img className={isPlaying ? 'pulse' : ''} src={value.cover} alt={value.name}/>
      </div>
      <div className="song-title">
        {value.artist || '-'}
      </div>
      <h2>
        Player
      </h2>
      <div className="progress-container">
        <span>
          {formatTime(currentTime)}
        </span>
        <input
          type="range"
          min="0"
          max={isNaN(duration) ? 0 : duration}
          value={currentTime}
          className="progress-bar"
          onChange={(e) => {
            audio.currentTime = Number(e.target.value);
          }}
        />
        <span>
          {formatTime(duration)}
        </span>
      </div>
      <div className="player-controls">
        <FaChevronLeft className="player-controls-buttons" onClick={props?.onPrevious}/>
        <div className="player-controls-buttons" onClick={playPause}>
          {isPlaying ? <FaPause/> : <FaPlay/>}
        </div>
        <FaChevronRight className="player-controls-buttons" onClick={onNext}/>
      </div>
    </div>
  );
};

// git config