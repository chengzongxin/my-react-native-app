import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TextInput, Dimensions, FlatList, ListRenderItem, TouchableOpacity } from 'react-native';
import { Search } from 'lucide-react-native';
import { Href, router, useNavigation } from 'expo-router';
import axios from 'axios';
import { TabView, SceneMap } from 'react-native-tab-view';

// 更新接口返回的数据类型
interface FileItem {
  name: string;
  path: string;
  children: FileItem[] | null;
  thumbnail: string | null;
  directory: boolean;
}

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width * 0.8;
const BANNER_SPACING = width * 0.1;
const SERVER_IP = '192.168.10.111';

const MovieList: React.FC = () => {
  const navigation = useNavigation();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const flatListRef = useRef<FlatList<FileItem>>(null);
  const autoScrollTimer = useRef<NodeJS.Timeout | null>(null);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: '首页' },
    { key: 'second', title: '电影' },
    // 添加更多标签
  ]);

  useEffect(() => {
    fetchFiles();
    navigation.setOptions({
      title: '视频列表',
      headerStyle: {
        backgroundColor: 'black',
      },
      headerTintColor: 'white',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerShadowVisible: false, // 移除导航栏底部阴影
    });
  }, [navigation]);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`http://${SERVER_IP}:8080/files/scan?type=movie`)
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  // 更新渲染轮播图项目函数
  const renderBannerItem: ListRenderItem<FileItem> = ({ item }) => (
    <TouchableOpacity
      style={styles.bannerItemContainer}
      onPress={() => router.push(`/player?path=${encodeURIComponent(item.path)}` as Href<string>)}
    >
      <View style={styles.bannerItem}>
        <Image 
          source={{ uri: item.thumbnail!}} 
          style={styles.bannerImage} 
          resizeMode="cover" 
        />
        <Text style={styles.bannerTitle}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  // 更新渲染电影项目函数
  const renderMovieItem: ListRenderItem<FileItem> = ({ item }) => (
    <TouchableOpacity 
      style={styles.movieItem}
      onPress={() => router.push(`/player?path=${encodeURIComponent(item.path)}` as Href<string>)}
    >
      <Image 
        source={{ uri: item.thumbnail! }} 
        style={styles.movieImage} 
        resizeMode="cover" 
      />
      <Text style={styles.movieTitle} numberOfLines={2}>{item.name}</Text>
    </TouchableOpacity>
  );


const FirstRoute = () => {
  // 这里是第一个标签的内容
  return <FlatList<FileItem> data={files} renderItem={renderMovieItem} />;
};

const SecondRoute = () => {
  // 这里是第二个标签的内容
  return <FlatList<FileItem> data={files} renderItem={renderMovieItem} />;
};

  const scrollToIndex = useCallback((index: number) => {
    flatListRef.current?.scrollToOffset({
      offset: index * (BANNER_WIDTH + BANNER_SPACING),
      animated: true
    });
    setCurrentPage(index);
  }, []);

  const startAutoScroll = useCallback(() => {
    autoScrollTimer.current = setInterval(() => {
      const nextPage = (currentPage + 1) % (files.filter(file => !file.directory).slice(0, 5).length);
      scrollToIndex(nextPage);
    }, 3000);
  }, [currentPage, files, scrollToIndex]);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
      autoScrollTimer.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, [startAutoScroll, stopAutoScroll]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    // 添加更多标签的场景
  });

  return (
    <View style={styles.container}>
      {/* 顶部分类导��� */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
      />
      {/* 搜索栏 */}
      <View style={styles.searchBar}>
        <Search color="#999" size={20} style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput} 
          placeholder="搜索视频" 
          placeholderTextColor="#999"
        />
      </View>
    </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#000', // 将背景色改为黑色
  },
  category: {
    color: '#999',
    fontSize: 15,
  },
  activeCategory: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    margin: 10,
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    padding: 8,
    fontSize: 14,
  },
  bannerList: {
    paddingHorizontal: BANNER_SPACING / 2,
  },
  bannerItemContainer: {
    width: BANNER_WIDTH + BANNER_SPACING,
    paddingHorizontal: BANNER_SPACING / 2,
  },
  bannerItem: {
    width: BANNER_WIDTH,
    overflow: 'hidden',
  },
  bannerImage: {
    width: BANNER_WIDTH,
    height: 200,
    borderRadius: 8,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#555',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#fff',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
  },
  movieList: {
    paddingHorizontal: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  listContainer: {
    padding: 10,
  },
  movieItem: {
    width: (width - 30) / 2,
    marginBottom: 20,
  },
  movieImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
    width: '100%',
  },
  movieInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 3,
  },
  movieRating: {
    color: '#ff9900',
    fontSize: 12,
  },
  movieType: {
    color: '#999',
    fontSize: 12,
  },
});

export default MovieList;
