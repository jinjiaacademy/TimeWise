/**
 * categories.js
 * Handles category management functionality for TimeWise
 */

// DOM Elements
const categoriesList = document.getElementById('categories-list');
const categoryForm = document.getElementById('category-form');
const categoryNameInput = document.getElementById('category-name');
const categoryColorInput = document.getElementById('category-color');
const parentCategorySelect = document.getElementById('parent-category');
const saveCategoryBtn = document.getElementById('save-category');
const cancelCategoryBtn = document.getElementById('cancel-category');

// Current category being edited
let currentEditingCategoryId = null;

// Initialize categories module
async function initCategories() {
    // Load categories
    await loadCategories();
    
    // Set up event listeners
    setupCategoryEventListeners();
    
    // Update category dropdowns in the main form and modal
    await updateCategoryDropdowns();
}

// Set up event listeners for category management
function setupCategoryEventListeners() {
    // Form submission
    categoryForm.addEventListener('submit', handleSaveCategory);
    
    // Cancel button
    cancelCategoryBtn.addEventListener('click', resetCategoryForm);
}

// Load and display categories
async function loadCategories() {
    try {
        const categories = await CategoryStorage.getAllCategories();
        
        // Clear the categories list
        categoriesList.innerHTML = '';
        
        if (categories.length === 0) {
            categoriesList.innerHTML = '<div class="empty-state">No categories defined</div>';
            return;
        }
        
        // Create a map for quick parent lookup
        const categoryMap = {};
        categories.forEach(category => {
            categoryMap[category.id] = category;
        });
        
        // Filter top-level categories (no parent)
        const topLevelCategories = categories.filter(category => !category.parentId);
        
        // Render top-level categories
        topLevelCategories.forEach(category => {
            const categoryElement = createCategoryElement(category);
            categoriesList.appendChild(categoryElement);
            
            // Render subcategories if any
            renderSubcategories(category.id, categories, categoryMap, categoriesList);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Render subcategories for a parent category
function renderSubcategories(parentId, allCategories, categoryMap, container) {
    const subcategories = allCategories.filter(category => category.parentId === parentId);
    
    if (subcategories.length > 0) {
        const subcategoryContainer = document.createElement('div');
        subcategoryContainer.className = 'subcategories';
        
        subcategories.forEach(subcategory => {
            const subcategoryElement = createCategoryElement(subcategory);
            subcategoryElement.classList.add('subcategory');
            subcategoryContainer.appendChild(subcategoryElement);
            
            // Recursively render nested subcategories
            renderSubcategories(subcategory.id, allCategories, categoryMap, subcategoryContainer);
        });
        
        container.appendChild(subcategoryContainer);
    }
}

// Create a category list item element
function createCategoryElement(category) {
    const categoryElement = document.createElement('div');
    categoryElement.className = 'category-item';
    categoryElement.dataset.id = category.id;
    
    categoryElement.innerHTML = `
        <div class="category-name">
            <span class="category-color" style="background-color: ${category.color}"></span>
            ${category.name}
        </div>
        <div class="category-actions">
            <button class="edit-category" title="Edit"><i>✏️</i></button>
            <button class="delete-category" title="Delete"><i>🗑️</i></button>
        </div>
    `;
    
    // Add event listeners for edit and delete buttons
    categoryElement.querySelector('.edit-category').addEventListener('click', () => {
        openEditCategoryForm(category);
    });
    
    categoryElement.querySelector('.delete-category').addEventListener('click', () => {
        deleteCategory(category.id);
    });
    
    return categoryElement;
}

// Open the form for editing a category
function openEditCategoryForm(category) {
    currentEditingCategoryId = category.id;
    
    // Fill in the form with category details
    categoryNameInput.value = category.name;
    categoryColorInput.value = category.color || '#4a6fa5';
    parentCategorySelect.value = category.parentId || '';
    
    // Change button text
    saveCategoryBtn.textContent = 'Update Category';
    
    // Scroll to the form
    categoryForm.scrollIntoView({ behavior: 'smooth' });
}

// Reset the category form
function resetCategoryForm() {
    currentEditingCategoryId = null;
    categoryForm.reset();
    saveCategoryBtn.textContent = 'Save Category';
}

// Handle save category form submission
async function handleSaveCategory(event) {
    event.preventDefault();
    
    // Get form values
    const name = categoryNameInput.value.trim();
    const color = categoryColorInput.value;
    const parentId = parentCategorySelect.value || null;
    
    // Validate input
    if (!name) {
        alert('Please enter a category name');
        return;
    }
    
    try {
        let actionType = 'created';
        
        if (currentEditingCategoryId) {
            // Update existing category
            const updatedCategory = {
                id: currentEditingCategoryId,
                name,
                color,
                parentId
            };
            
            await CategoryStorage.updateCategory(updatedCategory);
            actionType = 'updated';
        } else {
            // Add new category
            const newCategory = {
                name,
                color,
                parentId
            };
            
            await CategoryStorage.addCategory(newCategory);
        }
        
        // Reset form and reload categories
        resetCategoryForm();
        await loadCategories();
        
        // Update category dropdowns
        await updateCategoryDropdowns();
        
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.textContent = `Category "${name}" has been ${actionType}`;
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    } catch (error) {
        console.error('Error saving category:', error);
        alert('Failed to save category. Please try again.');
    }
}

// Delete a category
async function deleteCategory(id) {
    // Check if this is a default category
    const categories = await CategoryStorage.getAllCategories();
    const category = categories.find(cat => cat.id === id);
    
    if (category && ['work', 'study', 'personal', 'health', 'leisure'].includes(id)) {
        alert('Cannot delete default categories');
        return;
    }
    
    // Check if this category has subcategories
    const hasSubcategories = categories.some(cat => cat.parentId === id);
    
    if (hasSubcategories) {
        alert('Cannot delete a category with subcategories. Please delete the subcategories first.');
        return;
    }
    
    if (confirm('Are you sure you want to delete this category?')) {
        try {
            await CategoryStorage.deleteCategory(id);
            await loadCategories();
            await updateCategoryDropdowns();
            
            // Notify the user of successful deletion
            const notification = document.createElement('div');
            notification.className = 'notification success';
            notification.textContent = `Category "${category.name}" has been deleted`;
            document.body.appendChild(notification);
            
            // Remove notification after 3 seconds
            setTimeout(() => {
                notification.remove();
            }, 3000);
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Failed to delete category. Please try again.');
        }
    }
}

// Update category dropdowns in the main form and modal
async function updateCategoryDropdowns() {
    try {
        const categories = await CategoryStorage.getAllCategories();
        
        // Clear existing options in parent category select
        while (parentCategorySelect.options.length > 1) {
            parentCategorySelect.remove(1);
        }
        
        // Clear existing options in main activity category select
        const activityCategorySelect = document.getElementById('activity-category');
        // Keep only the first option (placeholder)
        while (activityCategorySelect.options.length > 1) {
            activityCategorySelect.remove(1);
        }
        
        // Clear existing options in modal category select
        const modalCategorySelect = document.getElementById('modal-category');
        modalCategorySelect.innerHTML = '';
        
        // Add categories to dropdowns
        categories.forEach(category => {
            // Add to parent category dropdown (for category management)
            const parentOption = document.createElement('option');
            parentOption.value = category.id;
            parentOption.textContent = category.name;
            parentCategorySelect.appendChild(parentOption);
            
            // Add to main activity category dropdown
            const activityOption = document.createElement('option');
            activityOption.value = category.id;
            activityOption.textContent = category.name;
            activityCategorySelect.appendChild(activityOption);
            
            // Add to modal category dropdown
            const modalOption = document.createElement('option');
            modalOption.value = category.id;
            modalOption.textContent = category.name;
            modalCategorySelect.appendChild(modalOption);
        });
        
        // Add the manage categories option to the main dropdown
        // This is now handled in app.js to avoid duplication
    } catch (error) {
        console.error('Error updating category dropdowns:', error);
    }
}

// Return to the main tracking view after operations
function returnToMainView() {
    // Check if app.js has defined the showMainView function
    if (typeof showMainView === 'function') {
        showMainView();
    } else {
        // Fallback if the function isn't available
        const categoriesSection = document.getElementById('categories-section');
        const mainContentContainer = document.querySelector('.main-content-container');
        
        if (categoriesSection && mainContentContainer) {
            categoriesSection.style.display = 'none';
            mainContentContainer.style.display = 'flex';
        }
    }
}

// Initialize the categories module when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize after a short delay to ensure storage.js has initialized
    setTimeout(initCategories, 100);
});
