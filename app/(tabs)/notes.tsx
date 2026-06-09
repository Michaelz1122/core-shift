import { View, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AppText from '@/components/ui/AppText';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import { useAppStore } from '@/store/useAppStore';
import { Note } from '@/types';
import { Colors, Spacing, Radii } from '@/constants/theme';
import { Copy } from '@/constants/copy';
import { formatShortDate } from '@/utils/dates';

export default function NotesScreen() {
  const { notes, deleteNote, isDarkMode } = useAppStore();

  const handleDeleteNote = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Delete Reflection Note',
      'Are you sure you want to permanently delete this self-reflection note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            deleteNote(id);
          },
        },
      ]
    );
  };

  const renderNote = ({ item }: { item: Note }) => (
    <Card style={styles.noteCard}>
      <View style={styles.noteHeader}>
        <AppText variant="caption" color="muted">
          {formatShortDate(item.createdAt)}
        </AppText>
        <TouchableOpacity
          onPress={() => handleDeleteNote(item.id)}
          style={styles.deleteBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={16} color={Colors.red} />
        </TouchableOpacity>
      </View>
      <AppText variant="body" style={styles.notePreview}>
        {item.content}
      </AppText>
    </Card>
  );

  const themeBg = isDarkMode ? '#121214' : Colors.background;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: themeBg }]} edges={['top']}>
      <View style={styles.header}>
        <View>
          <AppText variant="h1">{Copy.notes.header}</AppText>
          <AppText variant="small" color="muted" style={styles.subline}>
            {Copy.notes.subline}
          </AppText>
        </View>
        <TouchableOpacity
          style={styles.newBtn}
          onPress={() => router.push('/note-new')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {notes.length === 0 ? (
        <EmptyState
          title={Copy.notes.emptyTitle}
          subtitle={Copy.notes.emptySubtitle}
          style={styles.empty}
        >
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => router.push('/note-new')}
          >
            <AppText variant="bodyMedium" color="primaryBlue">
              Write your first note
            </AppText>
          </TouchableOpacity>
        </EmptyState>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={renderNote}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  subline: {
    marginTop: Spacing.xs,
    maxWidth: 220,
  },
  newBtn: {
    width: 44,
    height: 44,
    borderRadius: Radii.full,
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xxxl,
  },
  noteCard: {
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: Spacing.xs,
  },
  deleteBtn: {
    padding: Spacing.xs,
  },
  notePreview: {
    color: Colors.charcoalSoft,
    lineHeight: 22,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyBtn: {
    marginTop: Spacing.base,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.primaryBlue,
  },
});
