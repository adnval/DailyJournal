import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Easing } from 'react-native';

const { width } = Dimensions.get('window');

// Color scheme
const lightColors = {
  primary: '#6366F1',
  primaryLight: '#A5B4FC',
  secondary: '#F1F5F9',
  accent: '#F59E0B',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  text: '#1F2937',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  border: '#E5E7EB',
  success: '#10B981',
  warning: '#F59E0B',
};

const darkColors = {
  primary: '#6366F1',
  primaryLight: '#A5B4FC',
  secondary: '#1F2937',
  accent: '#F59E0B',
  background: '#18181B',
  surface: '#23232A',
  text: '#F3F4F6',
  textSecondary: '#A1A1AA',
  textLight: '#71717A',
  border: '#27272A',
  success: '#10B981',
  warning: '#F59E0B',
};

// Dynamic styles generator
const getDynamicStyles = (colors) => ({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  app: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    marginBottom: Platform.OS === 'ios' ? 60 : 50,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    paddingTop: 0,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  tabText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  screen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  todayScrollContainer: {
    flex: 1,
  },
  todayContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 20,
  },
  header: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  headerDate: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  section: {
    marginBottom: 15,
  },
  expandedSection: {
    flex: 1,
    marginBottom: 15,
    minHeight: 100,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodButton: {
    width: (width - 80) / 4,
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: colors.border,
  },
  selectedMood: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  moodEmoji: {
    fontSize: 24,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    color: colors.text,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 60,
  },
  mainInput: {},
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  saveButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  settingsSection: {
    marginBottom: 30,
  },
  settingsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 15,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsItemIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  settingsItemSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  settingsItemArrow: {
    fontSize: 18,
    color: colors.textLight,
    marginLeft: 10,
  },
  dangerItem: {
    borderColor: '#FEE2E2',
  },
  dangerText: {
    color: '#DC2626',
  },
  historyItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyItemDateContainer: {
    flex: 1,
  },
  historyItemDate: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  historyItemTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  historyItemMood: {
    fontSize: 20,
  },
  historyItemPreview: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  entryDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    paddingRight: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  deleteButton: {
    paddingLeft: 10,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  entryDetailDate: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  detailSection: {
    marginBottom: 25,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 12,
  },
  detailMood: {
    fontSize: 32,
    textAlign: 'center',
    paddingVertical: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

// Tab Navigation Component
const TabBar = ({ activeTab, setActiveTab, slideAnim, colors, styles }) => {
  const tabs = [
    { id: 0, title: 'Today', icon: '✍️' },
    { id: 1, title: 'History', icon: '📚' },
    { id: 2, title: 'Settings', icon: '⚙️' },
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.activeTab]}
          onPress={() => setActiveTab(tab.id)}
        >
          <Text style={styles.tabIcon}>{tab.icon}</Text>
          <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
            {tab.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Today's Journal Component
const TodayScreen = ({ entries, setEntries, slideAnim, colors, styles }) => {
  const [todayEntry, setTodayEntry] = useState('');
  const [mood, setMood] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [goals, setGoals] = useState('');
  const scrollRef = useRef(null);

  const today = new Date().toDateString();

  // Helper to scroll to input
  const scrollToInput = (y) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y, animated: true });
    }
  };

  const saveEntry = async () => {
    if (!todayEntry.trim() && !mood.trim() && !gratitude.trim() && !goals.trim()) {
      Alert.alert('Empty Entry', 'Please write something before saving.');
      return;
    }

    const now = new Date();
    const entryId = now.getTime().toString();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });

    const entry = {
      id: entryId,
      date: today,
      timestamp: now.toISOString(),
      timeString: timeString,
      reflection: todayEntry,
      mood: mood,
      gratitude: gratitude,
      goals: goals,
    };

    const todayEntries = entries[today] || [];
    const updatedTodayEntries = [...todayEntries, entry];
    const newEntries = { ...entries, [today]: updatedTodayEntries };
    setEntries(newEntries);

    try {
      await AsyncStorage.setItem('journalEntries', JSON.stringify(newEntries));
      setTodayEntry('');
      setMood('');
      setGratitude('');
      setGoals('');
      Alert.alert('Saved!', `Your reflection has been saved for ${timeString}.`);
    } catch (error) {
      Alert.alert('Error', 'Failed to save your entry. Please try again.');
    }
  };

  const moods = ['😊', '😔', '😐', '😴', '🤗', '😤', '🥳', '😰'];

  return (
    <Animated.View style={[
      styles.screen, 
      { 
        transform: [{ 
          translateX: slideAnim.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [0, -width, -width * 2]
          })
        }]
      }
    ]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 60}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.todayScrollContainer}
          contentContainerStyle={styles.todayContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Daily Reflection</Text>
            <Text style={styles.headerDate}>{today}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How are you feeling today?</Text>
            <View style={styles.moodContainer}>
              {moods.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[styles.moodButton, mood === emoji && styles.selectedMood]}
                  onPress={() => setMood(emoji)}
                >
                  <Text style={styles.moodEmoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.expandedSection}>
            <Text style={styles.sectionTitle}>What are you grateful for?</Text>
            <TextInput
              style={styles.textInput}
              placeholder="I'm grateful for ..."
              multiline
              value={gratitude}
              onChangeText={setGratitude}
              placeholderTextColor={colors.textLight}
              returnKeyType="next"
              onFocus={e => scrollToInput(e.target?.offsetTop ?? 200)}
            />
          </View>

          <View style={styles.expandedSection}>
            <Text style={styles.sectionTitle}>Today's Reflection</Text>
            <TextInput
              style={[styles.textInput, styles.mainInput]}
              placeholder="What happened today? How did it make you feel? What did you learn?"
              multiline
              value={todayEntry}
              onChangeText={setTodayEntry}
              placeholderTextColor={colors.textLight}
              returnKeyType="next"
              onFocus={e => scrollToInput(e.target?.offsetTop ?? 400)}
            />
          </View>

          <View style={styles.expandedSection}>
            <Text style={styles.sectionTitle}>Tomorrow's Goals</Text>
            <TextInput
              style={styles.textInput}
              placeholder="What do you want to accomplish tomorrow?"
              multiline
              value={goals}
              onChangeText={setGoals}
              placeholderTextColor={colors.textLight}
              returnKeyType="done"
              onFocus={e => scrollToInput(e.target?.offsetTop ?? 600)}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={saveEntry}>
            <Text style={styles.saveButtonText}>Save Entry</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

// History Screen Component
const HistoryScreen = ({ entries, setEntries, slideAnim, colors, styles }) => {
  const [selectedEntry, setSelectedEntry] = useState(null);

  const allEntries = [];
  Object.keys(entries).forEach(date => {
    const dateEntries = entries[date];
    if (Array.isArray(dateEntries)) {
      allEntries.push(...dateEntries);
    } else if (dateEntries) {
      allEntries.push(dateEntries);
    }
  });
  allEntries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const deleteEntry = async (entryToDelete) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const entryDate = new Date(entryToDelete.timestamp).toDateString();
              const dateEntries = entries[entryDate];
              let newEntries = { ...entries };
              if (Array.isArray(dateEntries)) {
                const updatedDateEntries = dateEntries.filter(entry => 
                  (entry.id && entry.id !== entryToDelete.id) || 
                  (entry.timestamp !== entryToDelete.timestamp)
                );
                if (updatedDateEntries.length === 0) {
                  delete newEntries[entryDate];
                } else {
                  newEntries[entryDate] = updatedDateEntries;
                }
              } else {
                delete newEntries[entryDate];
              }
              setEntries(newEntries);
              await AsyncStorage.setItem('journalEntries', JSON.stringify(newEntries));
              setSelectedEntry(null);
              Alert.alert('Deleted', 'Entry has been deleted successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete entry. Please try again.');
            }
          }
        }
      ]
    );
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  const formatDateTime = (timestamp, timeString) => {
    const date = formatDate(timestamp);
    return `${date} at ${timeString}`;
  };

  if (selectedEntry) {
    return (
      <Animated.View style={[
        styles.screen, 
        { 
          transform: [{ 
            translateX: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [width, 0]
            })
          }]
        }
      ]}>
        <View style={styles.entryDetailHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedEntry(null)}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.entryDetailDate}>
            {formatDateTime(selectedEntry.timestamp, selectedEntry.timeString)}
          </Text>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => deleteEntry(selectedEntry)}
          >
            <Text style={styles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {selectedEntry.mood && (
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Mood</Text>
              <Text style={styles.detailMood}>{selectedEntry.mood}</Text>
            </View>
          )}

          {selectedEntry.gratitude && (
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Gratitude</Text>
              <Text style={styles.detailText}>{selectedEntry.gratitude}</Text>
            </View>
          )}

          {selectedEntry.reflection && (
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Reflection</Text>
              <Text style={styles.detailText}>{selectedEntry.reflection}</Text>
            </View>
          )}

          {selectedEntry.goals && (
            <View style={styles.detailSection}>
              <Text style={styles.detailLabel}>Goals</Text>
              <Text style={styles.detailText}>{selectedEntry.goals}</Text>
            </View>
          )}

          <View style={{ height: 50 }} />
        </ScrollView>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[
      styles.screen, 
      { 
        transform: [{ 
          translateX: slideAnim.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [width, 0, -width]
          })
        }]
      }
    ]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Journey</Text>
        <Text style={styles.headerSubtitle}>{allEntries.length} entries</Text>
      </View>

      {allEntries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No entries yet</Text>
          <Text style={styles.emptyStateSubtext}>Start your journaling journey today!</Text>
        </View>
      ) : (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {allEntries.map((entry) => (
            <TouchableOpacity
              key={entry.id || entry.timestamp}
              style={styles.historyItem}
              onPress={() => setSelectedEntry(entry)}
            >
              <View style={styles.historyItemHeader}>
                <View style={styles.historyItemDateContainer}>
                  <Text style={styles.historyItemDate}>
                    {formatDate(entry.timestamp)}
                  </Text>
                  <Text style={styles.historyItemTime}>
                    {entry.timeString || new Date(entry.timestamp).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </Text>
                </View>
                {entry.mood && <Text style={styles.historyItemMood}>{entry.mood}</Text>}
              </View>
              <Text style={styles.historyItemPreview} numberOfLines={2}>
                {entry.reflection || entry.gratitude || 'No content'}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={{ height: 50 }} />
        </ScrollView>
      )}
    </Animated.View>
  );
};

// Settings Screen Component
const SettingsScreen = ({ entries, setEntries, slideAnim, colors, darkMode, toggleDarkMode, styles }) => {
  const getTotalEntries = () => {
    let total = 0;
    Object.keys(entries).forEach(date => {
      const dateEntries = entries[date];
      if (Array.isArray(dateEntries)) {
        total += dateEntries.length;
      } else if (dateEntries) {
        total += 1;
      }
    });
    return total;
  };

  const getStorageSize = () => {
    const dataString = JSON.stringify(entries);
    const sizeInBytes = dataString.length;
    const sizeInKB = (sizeInBytes / 1024).toFixed(2);
    return `${sizeInKB} KB`;
  };

  const exportData = async () => {
    try {
      const normalizedEntries = {};
      Object.keys(entries).forEach(date => {
        const dateEntries = Array.isArray(entries[date])
          ? entries[date]
          : entries[date]
            ? [entries[date]]
            : [];
        normalizedEntries[date] = dateEntries;
      });

      const dataString = JSON.stringify(normalizedEntries, null, 2);
      const fileName = `journal_export_${new Date().toISOString().split('T')[0]}.json`;

      if (Platform.OS === 'android') {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (!permissions.granted) {
          Alert.alert('Permission Denied', 'Cannot access storage to export file.');
          return;
        }
        const uri = await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          fileName,
          'application/json'
        );
        await FileSystem.writeAsStringAsync(uri, dataString, { encoding: FileSystem.EncodingType.UTF8 });
        Alert.alert('Exported', 'Your journal data has been saved to your selected folder.');
      } else {
        const fileUri = FileSystem.documentDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, dataString, { encoding: FileSystem.EncodingType.UTF8 });
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        } else {
          Alert.alert('Exported', `Your journal data has been saved to a file:\n${fileUri}`);
        }
      }
    } catch (error) {
      console.log('Export error:', error);
      Alert.alert(
        'Export Failed',
        `Could not export your data. Error: ${error.message || error.toString()}`
      );
    }
  };

  const importData = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        const fileUri = result.uri;
        const response = await fetch(fileUri);
        const fileText = await response.text();
        const importedEntries = JSON.parse(fileText);

        if (typeof importedEntries !== 'object' || importedEntries === null) {
          Alert.alert('Import Failed', 'Invalid file format.');
          return;
        }

        let mergedEntries = {};
        if (!entries || Object.keys(entries).length === 0) {
          mergedEntries = importedEntries;
        } else {
          mergedEntries = { ...entries };
          Object.keys(importedEntries).forEach(date => {
            const importedDateEntries = Array.isArray(importedEntries[date])
              ? importedEntries[date]
              : importedEntries[date]
                ? [importedEntries[date]]
                : [];

            const existingDateEntries = Array.isArray(mergedEntries[date])
              ? mergedEntries[date]
              : mergedEntries[date]
                ? [mergedEntries[date]]
                : [];

            const existingKeys = new Set(
              existingDateEntries.map(e => `${e.id || ''}_${e.timestamp || ''}`)
            );
            const newEntries = importedDateEntries.filter(
              e => !existingKeys.has(`${e.id || ''}_${e.timestamp || ''}`)
            );
            mergedEntries[date] = [...existingDateEntries, ...newEntries];
          });
        }

        setEntries(mergedEntries);
        await AsyncStorage.setItem('journalEntries', JSON.stringify(mergedEntries));
        Alert.alert('Import Successful', 'Your journal data has been imported.');
      }
    } catch (err) {
      Alert.alert('Import Failed', 'Could not import your data. Please try again.');
    }
  };

  const deleteAllData = async () => {
    Alert.alert(
      'Delete All Data',
      'Are you absolutely sure you want to delete ALL your journal entries? This action cannot be undone and will permanently erase your entire journaling history.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              setEntries({});
              await AsyncStorage.removeItem('journalEntries');
              Alert.alert('Deleted', 'All journal entries have been permanently deleted.');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete data. Please try again.');
            }
          }
        }
      ]
    );
  };

  return (
    <Animated.View style={[
      styles.screen,
      { backgroundColor: colors.background,
        transform: [{
          translateX: slideAnim.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [width * 2, width, 0]
          })
        }]
      }
    ]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Manage your journal</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.settingsSection}>
          <Text style={[styles.settingsSectionTitle, { color: colors.text }]}>Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{getTotalEntries()}</Text>
              <Text style={styles.statLabel}>Total Entries</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{Object.keys(entries).length}</Text>
              <Text style={styles.statLabel}>Days Journaled</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{getStorageSize()}</Text>
              <Text style={styles.statLabel}>Data Size</Text>
            </View>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={[styles.settingsSectionTitle, { color: colors.text }]}>Appearance</Text>
          <TouchableOpacity style={styles.settingsItem} onPress={toggleDarkMode}>
            <View style={styles.settingsItemLeft}>
              <Text style={styles.settingsItemIcon}>{darkMode ? '🌙' : '☀️'}</Text>
              <View>
                <Text style={[styles.settingsItemTitle, { color: colors.text }]}>Dark Mode</Text>
                <Text style={styles.settingsItemSubtitle}>
                  {darkMode ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
            </View>
            <Text style={styles.settingsItemArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>Data Management</Text>
          
          <TouchableOpacity style={styles.settingsItem} onPress={exportData}>
            <View style={styles.settingsItemLeft}>
              <Text style={styles.settingsItemIcon}>📤</Text>
              <View>
                <Text style={styles.settingsItemTitle}>Export Data</Text>
                <Text style={styles.settingsItemSubtitle}>Download all your entries as JSON</Text>
              </View>
            </View>
            <Text style={styles.settingsItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsItem} onPress={importData}>
            <View style={styles.settingsItemLeft}>
              <Text style={styles.settingsItemIcon}>📥</Text>
              <View>
                <Text style={styles.settingsItemTitle}>Import Data</Text>
                <Text style={styles.settingsItemSubtitle}>Merge entries from a JSON file</Text>
              </View>
            </View>
            <Text style={styles.settingsItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingsItem, styles.dangerItem]} onPress={deleteAllData}>
            <View style={styles.settingsItemLeft}>
              <Text style={styles.settingsItemIcon}>🗑️</Text>
              <View>
                <Text style={[styles.settingsItemTitle, styles.dangerText]}>Delete All Data</Text>
                <Text style={styles.settingsItemSubtitle}>Permanently erase all entries</Text>
              </View>
            </View>
            <Text style={styles.settingsItemArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>About</Text>
          
          <View style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Text style={styles.settingsItemIcon}>📱</Text>
              <View>
                <Text style={styles.settingsItemTitle}>Daily Reflection Journal</Text>
                <Text style={styles.settingsItemSubtitle}>Version 1.0.0</Text>
              </View>
            </View>
          </View>

          <View style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Text style={styles.settingsItemIcon}>💡</Text>
              <View>
                <Text style={styles.settingsItemTitle}>Tips</Text>
                <Text style={styles.settingsItemSubtitle}>Write regularly for best results</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>Privacy</Text>
          
          <View style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Text style={styles.settingsItemIcon}>🔒</Text>
              <View>
                <Text style={styles.settingsItemTitle}>Local Storage Only</Text>
                <Text style={styles.settingsItemSubtitle}>Your data never leaves your device</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </Animated.View>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState(0); // Use index instead of string
  const [entries, setEntries] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Animated value for theme transition
  const themeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animation = Animated.timing(themeAnim, {
      toValue: darkMode ? 1 : 0,
      duration: 600,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    });
    animation.start();
    return () => {
      animation.stop();
    };
  }, [darkMode]);

  const animatedBackgroundColor = themeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [lightColors.background, darkColors.background],
  });

  const colors = darkMode ? darkColors : lightColors;
  const styles = getDynamicStyles(colors);

  useEffect(() => {
    loadEntries();
    loadTheme();
  }, []);

  const loadEntries = async () => {
    try {
      const stored = await AsyncStorage.getItem('journalEntries');
      if (stored) {
        setEntries(JSON.parse(stored));
      }
    } catch (error) {
      console.log('Error loading entries:', error);
    }
  };

  const loadTheme = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem('darkMode');
      if (storedTheme !== null) {
        setDarkMode(storedTheme === 'true');
      }
    } catch (error) {
      // ignore
    }
  };

  const toggleDarkMode = async () => {
    setDarkMode((prev) => {
      AsyncStorage.setItem('darkMode', (!prev).toString());
      return !prev;
    });
  };

  // Render all screens, but slide them in/out using translateX
  return (
    <Animated.View style={{ flex: 1, backgroundColor: animatedBackgroundColor }}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} backgroundColor={colors.background} />
        <View style={styles.content}>
          <TodayScreen
            entries={entries}
            setEntries={setEntries}
            slideAnim={slideAnim}
            colors={colors}
            styles={styles}
          />
          <HistoryScreen
            entries={entries}
            setEntries={setEntries}
            slideAnim={slideAnim}
            colors={colors}
            styles={styles}
          />
          <SettingsScreen
            entries={entries}
            setEntries={setEntries}
            slideAnim={slideAnim}
            colors={colors}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            styles={styles}
          />
        </View>
        <TabBar
          activeTab={activeTab}
          setActiveTab={(tabId) => {
            setActiveTab(tabId);
            Animated.spring(slideAnim, {
              toValue: tabId,
              tension: 100,
              friction: 8,
              useNativeDriver: false,
            }).start();
          }}
          slideAnim={slideAnim}
          colors={colors}
          styles={styles}
        />
      </SafeAreaView>
    </Animated.View>
  );
};

export default App;