import { create } from 'zustand';
import type { MockLabel } from '@/types/task-form';

// Color palette for new tags
const TAG_COLORS = ['blue', 'green', 'purple', 'red', 'orange', 'yellow', 'gray', 'pink', 'cyan'] as const;

// Initial mock tags
const initialTags: MockLabel[] = [
  { id: "1", name: "Frontend", color: "blue", description: "Frontend development tasks" },
  { id: "2", name: "Backend", color: "green", description: "Backend development tasks" },
  { id: "3", name: "Design", color: "purple", description: "UI/UX design tasks" },
  { id: "4", name: "Security", color: "red", description: "Security related tasks" },
  { id: "5", name: "DevOps", color: "orange", description: "DevOps and infrastructure tasks" },
  { id: "6", name: "Testing", color: "yellow", description: "Testing and QA tasks" },
  { id: "7", name: "Documentation", color: "gray", description: "Documentation tasks" },
  { id: "8", name: "Bug Fix", color: "pink", description: "Bug fixing tasks" },
  { id: "9", name: "Feature", color: "cyan", description: "New feature development" },
  { id: "10", name: "Urgent", color: "red", description: "Urgent priority tasks" },
];

interface TagsState {
  tags: MockLabel[];
  colorIndex: number;
}

interface TagsActions {
  createTag: (name: string, description?: string) => MockLabel;
  getTagById: (id: string) => MockLabel | undefined;
  getTagByName: (name: string) => MockLabel | undefined;
  getAllTags: () => MockLabel[];
  searchTags: (query: string) => MockLabel[];
}

type TagsStore = TagsState & TagsActions;

export const useTagsStore = create<TagsStore>((set, get) => ({
  tags: initialTags,
  colorIndex: 0,

  createTag: (name: string, description?: string) => {
    const state = get();
    
    // Check if tag already exists
    const existingTag = state.tags.find(tag => 
      tag.name.toLowerCase() === name.toLowerCase()
    );
    
    if (existingTag) {
      return existingTag;
    }

    // Generate new tag
    const newTag: MockLabel = {
      id: `tag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      color: TAG_COLORS[state.colorIndex % TAG_COLORS.length],
      description: description || `Custom tag: ${name.trim()}`,
    };

    // Update store
    set({
      tags: [...state.tags, newTag],
      colorIndex: state.colorIndex + 1,
    });

    return newTag;
  },

  getTagById: (id: string) => {
    return get().tags.find(tag => tag.id === id);
  },

  getTagByName: (name: string) => {
    return get().tags.find(tag => 
      tag.name.toLowerCase() === name.toLowerCase()
    );
  },

  getAllTags: () => {
    return get().tags;
  },

  searchTags: (query: string) => {
    const tags = get().tags;
    if (!query.trim()) return tags;
    
    const lowerQuery = query.toLowerCase();
    return tags.filter(tag => 
      tag.name.toLowerCase().includes(lowerQuery) ||
      tag.description?.toLowerCase().includes(lowerQuery)
    );
  },
}));
