document.addEventListener("DOMContentLoaded", () => {
    // Load Navbar
    fetch('components/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
            
            // Setup Search Logic
            const searchInput = document.getElementById('global-search-input');
            const searchBtn = document.getElementById('global-search-btn');
            
            function executeSearch() {
                const query = searchInput.value.trim();
                if(query) {
                    window.location.href = `catalog.html?type=search&val=${encodeURIComponent(query)}`;
                }
            }

            if (searchBtn && searchInput) {
                searchBtn.addEventListener('click', executeSearch);
                searchInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') executeSearch();
                });
            }
        });

    // Load Sidebar
    fetch('components/sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar-placeholder').innerHTML = data;
            
            // Set active class based on current page
            let currentPage = window.location.pathname.split("/").pop();
            if (currentPage === "") currentPage = "homepage.html"; // Default fallback

            const navLinks = document.querySelectorAll('#sidebar-nav .nav-link');
            navLinks.forEach(link => {
                if (link.getAttribute('data-page') === currentPage) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            // Re-attach smooth scroll event listener for contact link
            const contactLink = document.querySelector('.contact-link');
            if (contactLink) {
                contactLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    document.querySelector('#footer').scrollIntoView({
                        behavior: 'smooth'
                    });
                });
            }
        });

    // Load Footer
    fetch('components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });
});
