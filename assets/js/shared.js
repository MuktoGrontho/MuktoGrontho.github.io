/**
 * MuktoGrontho Shared Components & Utilities
 * A modular system for consistent UI across all pages
 */

// Global configuration
window.MuktoGrontho = {
    config: {
        apiUrl: './data',
        colors: {
            primaryBrown: '#8C6B5D',
            primaryGreen: '#5E8B7E',
            bgCream: '#FDFBF6',
            bgLight: '#EAE0D5',
            textDark: '#4A3B31',
            borderLight: '#DCD0C0'
        },
        breakpoints: {
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280
        }
    },
    
    // Global state management
    state: {
        bookData: [],
        currentUser: null,
        preferences: JSON.parse(localStorage.getItem('mukto-preferences') || '{}')
    },
    
    // Utility functions
    utils: {
        // Debounce function for performance
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // HTML escape for security
        escapeHtml(unsafe) {
            return unsafe.replace(/[&<>"']/g, m => ({
                '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
            }[m]));
        },
        
        // Format date in Bengali
        formatDateBengali(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('bn-BD', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },
        
        // Generate slug from text
        generateSlug(text) {
            return text.toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');
        },
        
        // Save to localStorage with error handling
        saveToStorage(key, data) {
            try {
                localStorage.setItem(key, JSON.stringify(data));
                return true;
            } catch (e) {
                console.warn('Failed to save to localStorage:', e);
                return false;
            }
        },
        
        // Load from localStorage with error handling
        loadFromStorage(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.warn('Failed to load from localStorage:', e);
                return defaultValue;
            }
        },
        
        // Loading state management
        showLoading(element) {
            element.classList.add('opacity-50', 'pointer-events-none');
            element.style.position = 'relative';
            
            const spinner = document.createElement('div');
            spinner.className = 'absolute inset-0 flex items-center justify-center bg-white bg-opacity-75';
            spinner.innerHTML = `
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8C6B5D]"></div>
            `;
            spinner.setAttribute('data-loading-spinner', 'true');
            element.appendChild(spinner);
        },
        
        hideLoading(element) {
            element.classList.remove('opacity-50', 'pointer-events-none');
            const spinner = element.querySelector('[data-loading-spinner]');
            if (spinner) spinner.remove();
        },
        
        // Error handling
        showError(message, container) {
            container.innerHTML = `
                <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    <div class="flex items-center">
                        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                        </svg>
                        ${message}
                    </div>
                </div>
            `;
        },
        
        // Success notification
        showSuccess(message) {
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform';
            notification.innerHTML = `
                <div class="flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    ${message}
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Slide in
            requestAnimationFrame(() => {
                notification.classList.remove('translate-x-full');
            });
            
            // Remove after 3 seconds
            setTimeout(() => {
                notification.classList.add('translate-x-full');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }
    },
    
    // API service
    api: {
        async fetchBooks() {
            try {
                const response = await fetch('./data/books.json');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const books = await response.json();
                window.MuktoGrontho.state.bookData = books;
                return books;
            } catch (error) {
                console.error('Failed to fetch books:', error);
                throw error;
            }
        },
        
        async getBookByTitle(title) {
            const books = await this.fetchBooks();
            return books.find(book => book.title === title);
        },
        
        async getBooksByAuthor(author) {
            const books = await this.fetchBooks();
            return books.filter(book => book.author === author);
        },
        
        async searchBooks(query, filters = {}) {
            const books = await this.fetchBooks();
            const searchTerm = query.toLowerCase();
            
            return books.filter(book => {
                const titleMatch = book.title.toLowerCase().includes(searchTerm);
                const authorMatch = book.author.toLowerCase().includes(searchTerm);
                const genreMatch = !filters.genre || book.genre === filters.genre;
                const authorFilterMatch = !filters.author || book.author === filters.author;
                
                return (titleMatch || authorMatch) && genreMatch && authorFilterMatch;
            });
        }
    }
};

/**
 * Shared UI Components
 */
window.MuktoGrontho.components = {
    // Header component
    createHeader(currentPage = 'home', isIndex = false) {
        const homeLink = isIndex ? '#home' : 'index.html';
        const roadmapLink = isIndex ? '#roadmap' : 'index.html#roadmap';
        const booksLink = isIndex ? '#books' : 'index.html#books';
        const standardsLink = isIndex ? '#standards' : 'index.html#standards';
        const contributeLink = isIndex ? '#contribute' : 'index.html#contribute';
        const sourcesLink = isIndex ? '#sources' : 'index.html#sources';

        const navLinks = `
            <a href="${homeLink}" class="nav-link px-4 py-2 rounded-md text-sm font-medium ${currentPage === 'home' ? 'active' : ''}" data-section="home">হোম</a>
            <a href="${roadmapLink}" class="nav-link px-4 py-2 rounded-md text-sm font-medium" data-section="roadmap">প্রকল্পের ধাপ</a>
            <a href="${booksLink}" class="nav-link px-4 py-2 rounded-md text-sm font-medium ${currentPage === 'books' ? 'active' : ''}" data-section="books">প্রস্তাবিত বই</a>
            <a href="book.html" class="nav-link px-4 py-2 rounded-md text-sm font-medium">বই</a>
            <a href="blog.html" class="nav-link px-4 py-2 rounded-md text-sm font-medium ${currentPage === 'blog' ? 'active' : ''}">ব্লগ</a>
            <a href="${standardsLink}" class="nav-link px-4 py-2 rounded-md text-sm font-medium" data-section="standards">কারিগরী মান</a>
            <a href="${contributeLink}" class="nav-link px-4 py-2 rounded-md text-sm font-medium" data-section="contribute">সম্পৃক্ততা</a>
            <a href="${sourcesLink}" class="nav-link px-4 py-2 rounded-md text-sm font-medium" data-section="sources">উৎস</a>
        `;

        const mobileNavLinks = `
            <a href="${homeLink}" class="nav-link block px-3 py-2 rounded-md text-base font-medium ${currentPage === 'home' ? 'active' : ''}" data-section="home">হোম</a>
            <a href="${roadmapLink}" class="nav-link block px-3 py-2 rounded-md text-base font-medium" data-section="roadmap">প্রকল্পের ধাপ</a>
            <a href="${booksLink}" class="nav-link block px-3 py-2 rounded-md text-base font-medium ${currentPage === 'books' ? 'active' : ''}" data-section="books">প্রস্তাবিত বই</a>
            <a href="book.html" class="nav-link block px-3 py-2 rounded-md text-base font-medium">বই</a>
            <a href="blog.html" class="nav-link block px-3 py-2 rounded-md text-base font-medium ${currentPage === 'blog' ? 'active' : ''}">ব্লগ</a>
            <a href="${standardsLink}" class="nav-link block px-3 py-2 rounded-md text-base font-medium" data-section="standards">কারিগরী মান</a>
            <a href="${contributeLink}" class="nav-link block px-3 py-2 rounded-md text-base font-medium" data-section="contribute">সম্পৃক্ততা</a>
            <a href="${sourcesLink}" class="nav-link block px-3 py-2 rounded-md text-base font-medium" data-section="sources">উৎস</a>
        `;

        return `
            <nav class="container mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between h-16">
                    <div class="flex items-center">
                        <a href="${homeLink}" class="text-xl font-bold text-[#4A3B31]">📚 মুক্তগ্রন্থ</a>
                    </div>
                    <div class="nav-container hidden md:flex">
                        <div class="ml-10 flex items-baseline space-x-4">
                            ${navLinks}
                        </div>
                    </div>
                    <div class="md:hidden">
                        <button type="button" id="mobile-menu-button" class="bg-[#8C6B5D] inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-[#705448] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                            <span class="sr-only">মেনু খুলুন</span>
                            <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <svg class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>
            <div class="md:hidden hidden" id="mobile-menu">
                <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    ${mobileNavLinks}
                </div>
            </div>
        `;
    },
    
    // Footer component
    createFooter() {
        return `
            <footer class="bg-[#EAE0D5] text-[#4A3B31] py-8 mt-auto border-t border-[#DCD0C0]">
                <div class="container mx-auto px-4">
                    <div class="grid md:grid-cols-3 gap-8">
                        <div>
                            <h3 class="font-bold text-lg mb-3 text-[#8C6B5D]">মুক্তগ্রন্থ</h3>
                            <p class="text-sm text-gray-600">বাংলা সাহিত্যের উচ্চমানের ডিজিটাল সংস্করণ। বিনামূল্যে পাবলিক ডোমেইন বই পড়ুন।</p>
                        </div>
                        <div>
                            <h4 class="font-semibold mb-3">দ্রুত লিঙ্ক</h4>
                            <ul class="space-y-2 text-sm">
                                <li><a href="index.html" class="text-[#5E8B7E] hover:underline">হোম</a></li>
                                <li><a href="index.html#books" class="text-[#5E8B7E] hover:underline">বইয়ের তালিকা</a></li>
                                <li><a href="blog.html" class="text-[#5E8B7E] hover:underline">ব্লগ</a></li>
                                <li><a href="index.html#contribute" class="text-[#5E8B7E] hover:underline">অবদান রাখুন</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-semibold mb-3">যোগাযোগ</h4>
                            <ul class="space-y-2 text-sm">
                                <li><a href="https://github.com/MuktoGrontho" target="_blank" class="text-[#5E8B7E] hover:underline">GitHub</a></li>
                                <li><a href="mailto:contact@muktogrontho.org" class="text-[#5E8B7E] hover:underline">ইমেইল</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="border-t border-[#DCD0C0] mt-6 pt-6 text-center text-sm text-gray-600">
                        <p>&copy; ২০২৪ মুক্তগ্রন্থ। সর্বস্বত্ব <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" class="text-[#5E8B7E] hover:underline">CC BY-NC-SA 4.0</a> এর অধীনে সংরক্ষিত।</p>
                        <p class="mt-1">একটি উন্মুক্ত উদ্যোগ, বাংলা সাহিত্যের সেবায় নিবেদিত।</p>
                    </div>
                </div>
            </footer>
        `;
    },
    
    // Breadcrumb component
    createBreadcrumb(items) {
        return `
            <nav class="text-sm mb-6 text-gray-600" aria-label="Breadcrumb">
                <ol class="flex items-center space-x-2">
                    ${items.map((item, index) => `
                        <li class="flex items-center">
                            ${index > 0 ? '<span class="text-gray-400 mr-2">›</span>' : ''}
                            ${item.url ? 
                                `<a href="${item.url}" class="text-[#5E8B7E] hover:underline">${item.label}</a>` : 
                                `<span class="text-gray-500">${item.label}</span>`
                            }
                        </li>
                    `).join('')}
                </ol>
            </nav>
        `;
    },
    
    // Book card component
    createBookCard(book) {
        return `
            <div class="book-card bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
                <div class="aspect-w-2 aspect-h-3 bg-gradient-to-br from-[#8C6B5D] to-[#5E8B7E] flex items-center justify-center text-white p-4 min-h-[200px]">
                    <div class="text-center">
                        <div class="text-sm font-bold leading-tight">${window.MuktoGrontho.utils.escapeHtml(book.title)}</div>
                        <div class="text-xs mt-2 opacity-80">${window.MuktoGrontho.utils.escapeHtml(book.author)}</div>
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="font-semibold text-lg mb-2 line-clamp-2">
                        <a href="book.html?title=${encodeURIComponent(book.title)}" 
                           class="text-[#5E8B7E] hover:text-[#8C6B5D] transition-colors">
                            ${window.MuktoGrontho.utils.escapeHtml(book.title)}
                        </a>
                    </h3>
                    <p class="text-gray-600 text-sm mb-2">
                        <a href="author.html?author=${encodeURIComponent(book.author)}" 
                           class="hover:text-[#5E8B7E] transition-colors">
                            ${window.MuktoGrontho.utils.escapeHtml(book.author)}
                        </a>
                    </p>
                    <div class="flex justify-between items-center text-xs text-gray-500">
                        <span class="bg-gray-100 px-2 py-1 rounded">${window.MuktoGrontho.utils.escapeHtml(book.genre)}</span>
                        <span>${book.deathYear}</span>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Loading spinner
    createLoadingSpinner(message = 'লোড হচ্ছে...') {
        return `
            <div class="flex flex-col items-center justify-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8C6B5D] mb-4"></div>
                <p class="text-gray-600">${message}</p>
            </div>
        `;
    }
};

/**
 * Shared functionality initialization
 */
window.MuktoGrontho.init = {
    // Initialize common page functionality
    initializePage() {
        this.injectSharedComponents();
        this.setupMobileMenu();
        this.setupSearchEnhancements();
        this.setupAccessibility();
        this.setupAnalytics();
    },

    // Inject shared components like header and footer
    injectSharedComponents() {
        const headerContainer = document.getElementById('site-header');
        const footerContainer = document.getElementById('site-footer');
        
        if (headerContainer) {
            const path = window.location.pathname.split('/').pop();
            const isIndex = (path === '' || path.startsWith('index'));
            let currentPage = 'home';
            if (!isIndex) {
                if (path.startsWith('blog')) currentPage = 'blog';
                else if (path.startsWith('book') || path.startsWith('author')) currentPage = 'books';
            }
            
            headerContainer.innerHTML = window.MuktoGrontho.components.createHeader(currentPage, isIndex);
        }
        
        if (footerContainer) {
            footerContainer.innerHTML = window.MuktoGrontho.components.createFooter();
        }
    },
    
    // Mobile menu functionality
    setupMobileMenu() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
                mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
                mobileMenu.classList.toggle('hidden');
                
                const svgs = mobileMenuButton.querySelectorAll('svg');
                svgs.forEach(svg => svg.classList.toggle('hidden'));
            });
        }
    },
    
    // Enhanced search functionality
    setupSearchEnhancements() {
        // Add search shortcuts (Ctrl+K or Cmd+K)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('input[type="text"][placeholder*="খুঁজুন"]');
                if (searchInput) {
                    searchInput.focus();
                }
            }
        });
    },
    
    // Accessibility improvements
    setupAccessibility() {
        // Add skip to content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'মূল বিষয়বস্তুতে যান';
        skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-[#8C6B5D] text-white p-2 z-50';
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Ensure main content has id
        const main = document.querySelector('main');
        if (main && !main.id) {
            main.id = 'main-content';
        }
    },
    
    // Basic analytics (privacy-respecting)
    setupAnalytics() {
        // Track page views (could be replaced with actual analytics)
        const pageView = {
            url: window.location.pathname,
            title: document.title,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };
        
        // Store locally for now (could send to analytics service)
        const views = window.MuktoGrontho.utils.loadFromStorage('page-views', []);
        views.push(pageView);
        
        // Keep only last 100 views
        if (views.length > 100) {
            views.splice(0, views.length - 100);
        }
        
        window.MuktoGrontho.utils.saveToStorage('page-views', views);
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.MuktoGrontho.init.initializePage();
    });
} else {
    window.MuktoGrontho.init.initializePage();
}
