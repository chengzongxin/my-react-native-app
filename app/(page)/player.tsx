import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';

const { width, height } = Dimensions.get('window');

const Player: React.FC = () => {
  const { path } = useLocalSearchParams<{ path: string }>();
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    if (path) {
      setVideoUrl(path);
    }
  }, [path]);

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRewind = async () => {
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      if (status.isLoaded) {
        await videoRef.current.setPositionAsync(Math.max(0, status.positionMillis - 10000));
      }
    }
  };

  const handleFastForward = async () => {
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      if (status.isLoaded) {
        await videoRef.current.setPositionAsync(Math.min(status.durationMillis || 0, status.positionMillis + 10000));
      }
    }
  };

  const handleVolumeChange = async (change: number) => {
    const newVolume = Math.max(0, Math.min(1, volume + change));
    setVolume(newVolume);
    if (videoRef.current) {
      await videoRef.current.setVolumeAsync(newVolume);
    }
  };

  const handleFullscreen = async () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        await videoRef.current.presentFullscreenPlayer();
      } else {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        await videoRef.current.dismissFullscreenPlayer();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  useEffect(() => {
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  return (
    <View style={styles.container}>
      {videoUrl && (
        <>
          <Video
            ref={videoRef}
            source={{ uri: videoUrl }}
            style={styles.video}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
            useNativeControls={false}
            onPlaybackStatusUpdate={(status) => setIsPlaying(status.isPlaying || false)}
          />
          <View style={styles.controls}>
            <TouchableOpacity onPress={handleRewind}>
              <Ionicons name="play-back" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePlayPause}>
              <Ionicons name={isPlaying ? "pause" : "play"} size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleFastForward}>
              <Ionicons name="play-forward" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleVolumeChange(-0.1)}>
              <Ionicons name="volume-low" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleVolumeChange(0.1)}>
              <Ionicons name="volume-high" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleFullscreen}>
              <Ionicons name={isFullscreen ? "contract" : "expand"} size={24} color="white" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: width,
    height: height,
  },
  fullscreenButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  fullscreenButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 10,
  },
});

export default Player;
