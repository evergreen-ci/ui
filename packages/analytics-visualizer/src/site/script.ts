/**
 * JavaScript code for the visualization
 */
export const SCRIPT = `
    const escapeHtml = (text) => {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    };

    // Smooth scroll to identifier section
    const scrollToIdentifier = (identifier) => {
      const element = document.getElementById('identifier-' + identifier);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    // Update active sidebar item based on scroll position
    const updateActiveSidebarItem = () => {
      const sections = document.querySelectorAll('section:not(.hidden)');
      const navItems = document.querySelectorAll('nav a');
      const contentArea = document.querySelector('.content');
      
      if (!contentArea || sections.length === 0) return;
      
      let currentActive = null;
      const scrollTop = contentArea.scrollTop;
      const headerOffset = 100; // Account for header height
      const viewportTop = scrollTop + headerOffset;
      
      // Find the section currently in view
      sections.forEach((section) => {
        // Use getBoundingClientRect to get position relative to viewport
        const sectionRect = section.getBoundingClientRect();
        const contentRect = contentArea.getBoundingClientRect();
        
        // Calculate absolute position within content area
        const sectionTop = sectionRect.top - contentRect.top + scrollTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        // Check if section is in viewport (with some offset)
        if (viewportTop >= sectionTop && viewportTop < sectionBottom) {
          currentActive = section.getAttribute('data-identifier');
        }
      });
      
      // If no section is in view, find the last visible one that's above the viewport
      if (!currentActive) {
        let lastAbove = null;
        let lastTop = -Infinity;
        sections.forEach((section) => {
          const sectionRect = section.getBoundingClientRect();
          const contentRect = contentArea.getBoundingClientRect();
          const sectionTop = sectionRect.top - contentRect.top + scrollTop;
          
          if (sectionTop <= viewportTop && sectionTop > lastTop) {
            lastTop = sectionTop;
            lastAbove = section.getAttribute('data-identifier');
          }
        });
        currentActive = lastAbove;
      }
      
      navItems.forEach(item => {
        const identifier = item.getAttribute('data-identifier');
        if (identifier === currentActive) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }

    // Sidebar navigation click handlers
    document.addEventListener('DOMContentLoaded', () => {
      const navItems = document.querySelectorAll('nav a');
      navItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          const identifier = item.getAttribute('data-identifier');
          scrollToIdentifier(identifier);
        });
      });

      // Update active item on scroll
      const contentArea = document.querySelector('.content');
      contentArea.addEventListener('scroll', updateActiveSidebarItem);
      
      // Initial update
      updateActiveSidebarItem();
    });

    // Filter functionality
    const applyFilters = () => {
      const searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();
      const prefixFilter = document.getElementById('prefixFilterSelect').value.toLowerCase().trim();
      const actionItems = document.querySelectorAll('article');
      const identifierSections = document.querySelectorAll('section');
      const noResults = document.getElementById('noResults');
      let hasResults = false;

      // Filter actions
      actionItems.forEach(item => {
        const actionName = item.getAttribute('data-action-name');
        const properties = item.getAttribute('data-properties');
        let matches = true;

        // Apply search filter (matches anywhere in name or properties)
        if (searchQuery !== '') {
          const text = (actionName + ' ' + properties).toLowerCase();
          if (!text.includes(searchQuery)) {
            matches = false;
          }
        }

        // Apply prefix filter (matches start of action name)
        if (matches && prefixFilter !== '') {
          if (!actionName.startsWith(prefixFilter)) {
            matches = false;
          }
        }

        if (matches) {
          item.classList.remove('hidden');
          hasResults = true;
        } else {
          item.classList.add('hidden');
        }
      });

      // Show/hide identifier sections based on visible actions
      identifierSections.forEach(section => {
        const identifier = section.getAttribute('data-identifier');
        const visibleActions = section.querySelectorAll('article:not(.hidden)');
        
        if (visibleActions.length > 0) {
          section.classList.remove('hidden');
        } else {
          section.classList.add('hidden');
        }
      });

      // Show no results message
      if (hasResults) {
        noResults.classList.add('hidden');
      } else {
        noResults.classList.remove('hidden');
      }

      // Update active sidebar item after filtering
      updateActiveSidebarItem();
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', applyFilters);

    // ActionTypePrefix filter functionality
    const prefixFilterSelect = document.getElementById('prefixFilterSelect');
    prefixFilterSelect.addEventListener('change', applyFilters);
  `;

