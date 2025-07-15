# Navigation Guide

This document outlines the navigation structure and best practices for the Conneqt360 app.

## Navigation Structure

### Root Stack (`app/_layout.tsx`)
- Handles the root navigation stack
- Contains all major navigation groups
- Manages global navigation state and theming

### Auth Stack (`app/(auth)/`)
- `login` - User login screen
- `register` - User registration
- `forgot-password` - Password recovery

### Main Tabs (`app/(tabs)/`)
- `index` - Home/Feed
- `circles` - User circles/directory
- `marketplace` - Marketplace
- `chats` - Messaging
- `profile` - User profile

### Drawer Navigation (`app/(drawer)/`)
- `home` - Main drawer content
- `settings` - App settings

### Modals (`app/(modals)/`)
- `post-details` - Post details modal
- `user-profile` - User profile modal

## Navigation Utilities

### `navigate(route, params)`
Type-safe navigation helper.

```typescript
import { navigate } from '@/utils/navigation';

// Navigate to a screen
navigate('(tabs)/profile');

// With parameters
navigate('communityfeed', { postId: '123' });
```

### `withAuth(route, params)`
Protects routes that require authentication.

```typescript
import { withAuth } from '@/utils/navigation';

// In your screen component
const handlePress = async () => {
  const canProceed = await withAuth('(tabs)/profile');
  if (canProceed) {
    // User is authenticated
  }
};
```

### `withoutAuth(redirectRoute)`
Prevents authenticated users from accessing auth screens.

```typescript
import { useEffect } from 'react';
import { withoutAuth } from '@/utils/navigation';

function LoginScreen() {
  useEffect(() => {
    withoutAuth('(tabs)');
  }, []);
  
  // ... rest of the component
}
```

### Type Safety

All routes are type-safe using TypeScript. The `ScreenProps` type can be used to type your screen components:

```typescript
import { ScreenProps } from '@/types/navigation';

type Props = ScreenProps<'(tabs)/profile'>;

function ProfileScreen({ route, navigation }: Props) {
  // route.params is properly typed
  return (
    // ...
  );
}
```

## Best Practices

1. **Use the `navigate` helper** instead of directly using `router.navigate`
2. **Group related screens** using route groups (e.g., `(auth)`, `(tabs)`)
3. **Use modals** for temporary content that should be dismissible
4. **Lazy load** screens when possible
5. **Handle navigation errors** gracefully
6. **Use route parameters** instead of global state when possible
7. **Keep navigation logic** in the component or a custom hook

## Error Handling

- All screens are wrapped in an `ErrorBoundary`
- Navigation errors are caught and logged
- Authentication state is checked before protected routes

## Theming

The app uses a theme provider for consistent styling. Access the theme in your components:

```typescript
import { useTheme } from '@/context/ThemeContext';

function MyComponent() {
  const { theme, isDark, toggleTheme } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      {/* ... */}
    </View>
  );
}
```
