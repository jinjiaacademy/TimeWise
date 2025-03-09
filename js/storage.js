/**
 * storage.js
 * Handles all data storage operations using localForage (IndexedDB)
 */

// Initialize localForage stores
const timeEntryStore = localforage.createInstance({
    name: 'timewise-app',
    storeName: 'time-entries'
});

const categoryStore = localforage.createInstance({
    name: 'timewise-app',
    storeName: 'categories'
});

// Default categories
const defaultCategories = [
    { id: 'work', name: 'Work', color: '#4a6fa5' },
    { id: 'study', name: 'Study', color: '#6b8cae' },
    { id: 'personal', name: 'Personal', color: '#ff6b6b' },
    { id: 'health', name: 'Health', color: '#4caf50' },
    { id: 'leisure', name: 'Leisure', color: '#ff9800' }
];

// Initialize the database
async function initializeDatabase() {
    try {
        // Check if categories exist, if not, create default ones
        const existingCategories = await categoryStore.getItem('categories');
        if (!existingCategories) {
            await categoryStore.setItem('categories', defaultCategories);
            console.log('Default categories created');
        }
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// Time Entry CRUD Operations
const TimeEntryStorage = {
    // Create a new time entry
    async addEntry(entry) {
        try {
            // Generate a unique ID
            entry.id = Date.now().toString();
            
            // Get existing entries
            const entries = await this.getAllEntries();
            
            // Add new entry
            entries.push(entry);
            
            // Save updated entries
            await timeEntryStore.setItem('entries', entries);
            
            return entry;
        } catch (error) {
            console.error('Error adding time entry:', error);
            throw error;
        }
    },
    
    // Get all time entries
    async getAllEntries() {
        try {
            const entries = await timeEntryStore.getItem('entries');
            return entries || [];
        } catch (error) {
            console.error('Error getting time entries:', error);
            return [];
        }
    },
    
    // Get entries for a specific date
    async getEntriesByDate(date) {
        try {
            const allEntries = await this.getAllEntries();
            const dateStr = new Date(date).toDateString();
            
            return allEntries.filter(entry => {
                const entryDate = new Date(entry.startTime).toDateString();
                return entryDate === dateStr;
            });
        } catch (error) {
            console.error('Error getting entries by date:', error);
            return [];
        }
    },
    
    // Update an existing time entry
    async updateEntry(updatedEntry) {
        try {
            const entries = await this.getAllEntries();
            const index = entries.findIndex(entry => entry.id === updatedEntry.id);
            
            if (index !== -1) {
                entries[index] = updatedEntry;
                await timeEntryStore.setItem('entries', entries);
                return updatedEntry;
            } else {
                throw new Error('Entry not found');
            }
        } catch (error) {
            console.error('Error updating time entry:', error);
            throw error;
        }
    },
    
    // Delete a time entry
    async deleteEntry(id) {
        try {
            const entries = await this.getAllEntries();
            const filteredEntries = entries.filter(entry => entry.id !== id);
            
            await timeEntryStore.setItem('entries', filteredEntries);
            return true;
        } catch (error) {
            console.error('Error deleting time entry:', error);
            throw error;
        }
    }
};

// Category CRUD Operations
const CategoryStorage = {
    // Get all categories
    async getAllCategories() {
        try {
            const categories = await categoryStore.getItem('categories');
            return categories || defaultCategories;
        } catch (error) {
            console.error('Error getting categories:', error);
            return defaultCategories;
        }
    },
    
    // Add a new category
    async addCategory(category) {
        try {
            // Generate a unique ID if not provided
            if (!category.id) {
                category.id = Date.now().toString();
            }
            
            const categories = await this.getAllCategories();
            categories.push(category);
            
            await categoryStore.setItem('categories', categories);
            return category;
        } catch (error) {
            console.error('Error adding category:', error);
            throw error;
        }
    },
    
    // Update an existing category
    async updateCategory(updatedCategory) {
        try {
            const categories = await this.getAllCategories();
            const index = categories.findIndex(cat => cat.id === updatedCategory.id);
            
            if (index !== -1) {
                categories[index] = updatedCategory;
                await categoryStore.setItem('categories', categories);
                return updatedCategory;
            } else {
                throw new Error('Category not found');
            }
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    },
    
    // Delete a category
    async deleteCategory(id) {
        try {
            const categories = await this.getAllCategories();
            
            // Prevent deleting default categories
            const isDefault = defaultCategories.some(cat => cat.id === id);
            if (isDefault) {
                throw new Error('Cannot delete default category');
            }
            
            const filteredCategories = categories.filter(cat => cat.id !== id);
            
            await categoryStore.setItem('categories', filteredCategories);
            return true;
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }
};

// Initialize the database when the script loads
initializeDatabase();
