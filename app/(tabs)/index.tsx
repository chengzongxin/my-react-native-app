import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // 引入 Expo 图标库

const OPENWEATHERMAP_API_KEY = 'bd21fec9a5a6e33c93fc5f7c08abde21'; // Replace with your actual API key
const CITY = 'Beijing'; // Replace with the desired city

export default function HomePage() {
  const insets = useSafeAreaInsets();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const [weather, setWeather] = useState('');
  const [temperature, setTemperature] = useState('');
  const [weatherIcon, setWeatherIcon] = useState('');

  useEffect(() => {
    // 更新日期时间和问候语
    const updateDateTime = () => {
      const now = new Date();
      const currentHour = now.getHours();
      if (currentHour < 6 || currentHour >= 18) {
        setIsDarkMode(true);
        setGreeting('晚上好，程宗鑫');
      } else {
        setIsDarkMode(false);
        setGreeting('早上好，程宗鑫');
      }

      // 使用 Intl.DateTimeFormat 获取本地化的日期和星期
      const dateFormatter = new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
      const dayFormatter = new Intl.DateTimeFormat('zh-CN', { weekday: 'long' });
      
      setCurrentDate(dateFormatter.format(now));
      setCurrentDay(dayFormatter.format(now));
    };

    // 获取天气数据
    const fetchWeatherData = async () => {
      try {
        // 使用和风天气 API
        const response = await axios.get(
          `https://devapi.qweather.com/v7/weather/now?location=101010100&key=YOUR_QWEATHER_API_KEY`
        );
        setWeather(response.data.now.text);
        setTemperature(`${response.data.now.temp}°C`);
        setWeatherIcon(`https://a.hecdn.net/img/common/icon/202106d/${response.data.now.icon}.png`);
      } catch (error) {
        console.error('获取天气数据时出错:', error);
      }
    };

    updateDateTime();
    fetchWeatherData();

    const timer = setInterval(updateDateTime, 60000); // Update date and time every minute
    const weatherTimer = setInterval(fetchWeatherData, 1800000); // Update weather every 30 minutes

    return () => {
      clearInterval(timer);
      clearInterval(weatherTimer);
    };
  }, []);

  // 图标组件
  const IconButton = ({ name, label, onPress }) => (
    <TouchableOpacity style={styles.iconContainer} onPress={onPress}>
      <Ionicons name={name} size={24} color={isDarkMode ? '#fff' : '#000'} />
      <Text style={[styles.iconLabel, isDarkMode && styles.darkText]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <View style={styles.header}>
          <Text style={[styles.greeting, isDarkMode && styles.darkText]}>{greeting}</Text>
          <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)}>
            <Text style={styles.expandIcon}>{isDarkMode ? '🌙' : '☀️'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.weatherSection}>
          <View style={styles.dateContainer}>
            <Text style={[styles.dateText, isDarkMode && styles.darkText]}>{currentDate}</Text>
            <Text style={[styles.dayText, isDarkMode && styles.darkText]}>{currentDay}</Text>
          </View>
          <View style={styles.weatherContainer}>
            {weatherIcon && <Image source={{ uri: weatherIcon }} style={styles.weatherIcon} />}
            <View>
              <Text style={[styles.temperatureText, isDarkMode && styles.darkText]}>{temperature}</Text>
              <Text style={[styles.weatherText, isDarkMode && styles.darkText]}>{weather}</Text>
            </View>
          </View>
        </View>

        <TextInput
          style={[styles.searchInput, isDarkMode && styles.darkSearchInput]}
          placeholder="输入关键词搜索"
          placeholderTextColor={isDarkMode ? '#666' : '#999'}
        />

        <View style={styles.banner}>
          <Text style={styles.bannerText}>首页自定义</Text>
          <Text style={styles.bannerSubtext}>更多组件任你配 »</Text>
        </View>
        <View style={styles.iconsGrid}>
          <IconButton name="videocam" label="视频" onPress={() => router.push('/(page)/movieList')} />
          <IconButton name="calendar" label="签到" onPress={() => {}} />
          <IconButton name="briefcase" label="请假" onPress={() => {}} />
          <IconButton name="time" label="我的加班" onPress={() => {}} />
          <IconButton name="star" label="积分" onPress={() => {}} />
          <IconButton name="document-text" label="我的申请" onPress={() => {}} />
          <IconButton name="person" label="我的档案" onPress={() => {}} />
          <IconButton name="ellipsis-horizontal" label="更多" onPress={() => {}} />
        </View>

        <View style={styles.promotionBanner}>
          <Text style={styles.promotionText}>打卡的同时可以贴标签啦</Text>
          <TouchableOpacity>
            <Text style={styles.promotionButton}>来体验 »</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.vacationSection}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.darkText]}>假期余额</Text>
          <View style={styles.vacationItems}>
            <VacationItem label="年假" value="10天" />
            <VacationItem label="体检" value="3.5小时" />
            <VacationItem label="哺乳假" value="12小时" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const VacationItem = ({ label, value }) => (
  <View style={styles.vacationItem}>
    <Text style={styles.vacationValue}>{value}</Text>
    <Text style={styles.vacationLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  darkText: {
    color: '#fff',
  },
  expandIcon: {
    fontSize: 24,
  },
  weatherSection: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginBottom: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dayText: {
    fontSize: 14,
    marginTop: 4,
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherIcon: {
    width: 50,
    height: 50,
    marginRight: 8,
  },
  temperatureText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  weatherText: {
    fontSize: 14,
  },
  searchInput: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  darkSearchInput: {
    backgroundColor: '#333',
    color: '#fff',
  },
  banner: {
    backgroundColor: '#8080ff',
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  bannerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bannerSubtext: {
    color: '#fff',
    marginTop: 4,
  },
  iconsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 16,
  },
  iconContainer: {
    alignItems: 'center',
    width: '25%',
    marginBottom: 16,
  },
  icon: {
    width: 50,
    height: 50,
    backgroundColor: '#ddd',
    borderRadius: 25,
  },
  darkIcon: {
    backgroundColor: '#444',
  },
  iconLabel: {
    marginTop: 8,
    fontSize: 12,
  },
  promotionBanner: {
    backgroundColor: '#ffe0b2',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promotionText: {
    flex: 1,
    fontSize: 14,
  },
  promotionButton: {
    color: '#ff9800',
    fontWeight: 'bold',
  },
  vacationSection: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  vacationItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vacationItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,152,0,0.1)',
    padding: 12,
    borderRadius: 8,
  },
  vacationValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff9800',
  },
  vacationLabel: {
    color: '#666',
    marginTop: 4,
    fontSize: 12,
  },
});
