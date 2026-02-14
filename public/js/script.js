// Theme toggle (light / dark)
(function themeToggle() {
  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function() {
      var root = document.documentElement;
      var current = root.getAttribute('data-theme') || 'light';
      var next = current === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }
})();

// Bootstrap form validation
(function() {
  'use strict';
  var forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(function(form) {
    form.addEventListener('submit', function(event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
})();