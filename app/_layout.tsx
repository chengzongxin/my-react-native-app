import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={({ route }) => ({
        // 只有当路由名称为空字符串（即首页）时，才禁用头部
        headerShown: route.name !== '(tabs)',
        title: route.name,
      })}
    />
  );
}
