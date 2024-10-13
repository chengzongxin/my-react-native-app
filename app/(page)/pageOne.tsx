import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TextInput, TouchableOpacity, Dimensions, FlatList, ListRenderItem } from 'react-native';
import { Home, Search, PlayCircle, Download, User } from 'lucide-react-native';

// 定义类型
interface Banner {
  title: string;
  image: string;
}

interface Movie {
  title: string;
  image: string;
  rating: string;
  type: string;
}

// 获取屏幕宽度，用于计算banner尺寸
const { width } = Dimensions.get('window');
const BANNER_WIDTH = width * 0.8;
const BANNER_SPACING = width * 0.1;

const MovieApp: React.FC = () => {
  // 定义分类、轮播图和电影数据
  const categories: string[] = ['小说', '推荐', '电影', '电视剧', '动漫'];
  const banners: Banner[] = [
    { title: '流浪地球2', image: 'https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2885955777.webp' },
    { title: '满江红', image: 'https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2886444616.webp' },
    { title: '无名', image: 'https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2886492021.webp' },
  ];
  const movies: Movie[] = [
    { title: '满江红', image: 'https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2886444616.webp', rating: '7.3', type: '剧情' },
    { title: '流浪地球2', image: 'https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2885955777.webp', rating: '8.3', type: '科幻' },
    { title: '无名', image: 'https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2886492021.webp', rating: '7.3', type: '悬疑' },
    { title: '中国乒乓', image: 'https://img9.doubanio.com/view/photo/s_ratio_poster/public/p2886491845.webp', rating: '7.2', type: '体育' },
    // Add more movies here...
  ];

  // 用于轮播图分页的状态
  const [currentPage, setCurrentPage] = useState<number>(0);

  // 渲染轮播图项目
  const renderBannerItem: ListRenderItem<Banner> = ({ item }) => (
    <View style={styles.bannerItem}>
      <Image source={{ uri: item.image }} style={styles.bannerImage} resizeMode="cover" />
      <Text style={styles.bannerTitle}>{item.title}</Text>
    </View>
  );

  // 渲染电影项目
  const renderMovieItem: ListRenderItem<Movie> = ({ item }) => (
    <View style={styles.movieItem}>
      <Image source={{ uri: item.image }} style={styles.movieImage} resizeMode="cover" />
      <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
      <View style={styles.movieInfo}>
        <Text style={styles.movieRating}>{item.rating}</Text>
        <Text style={styles.movieType}>{item.type}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* 顶部分类导航 */}
        <View style={styles.header}>
          {categories.map((category, index) => (
            <Text key={index} style={[styles.category, index === 2 ? styles.activeCategory : null]}>{category}</Text>
          ))}
        </View>
        
        {/* 搜索栏 */}
        <View style={styles.searchBar}>
          <Search color="#999" size={20} style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="搜索片" 
            placeholderTextColor="#999"
          />
        </View>
        
        {/* 轮播图 */}
        <FlatList<Banner>
          data={banners}
          renderItem={renderBannerItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={BANNER_WIDTH + BANNER_SPACING}
          decelerationRate="fast"
          contentContainerStyle={styles.bannerList}
          onMomentumScrollEnd={(event) => {
            const newPage = Math.round(event.nativeEvent.contentOffset.x / (BANNER_WIDTH + BANNER_SPACING));
            setCurrentPage(newPage);
          }}
        />
        
        {/* 轮播图分页指示器 */}
        <View style={styles.paginationDots}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentPage ? styles.paginationDotActive : null,
              ]}
            />
          ))}
        </View>
        
        {/* 电影列表标题 */}
        <Text style={styles.sectionTitle}>首播影院</Text>
        
        {/* 电影列表 */}
        <FlatList<Movie>
          data={movies}
          renderItem={renderMovieItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          columnWrapperStyle={styles.movieRow}
          contentContainerStyle={styles.movieList}
        />
      </ScrollView>
      
      {/* 底部导航栏 */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Home color="#fff" size={24} />
          <Text style={styles.tabText}>首页</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Search color="#fff" size={24} />
          <Text style={styles.tabText}>搜索</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <PlayCircle color="#fff" size={24} />
          <Text style={styles.tabText}>播放</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Download color="#fff" size={24} />
          <Text style={styles.tabText}>下载</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <User color="#fff" size={24} />
          <Text style={styles.tabText}>我的</Text>
        </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: '#333',
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
  bannerItem: {
    width: BANNER_WIDTH,
    marginHorizontal: BANNER_SPACING / 2,
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
  movieRow: {
    justifyContent: 'space-between',
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
    width: 100,
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
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#222',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  tabItem: {
    alignItems: 'center',
  },
  tabText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
});

export default MovieApp;