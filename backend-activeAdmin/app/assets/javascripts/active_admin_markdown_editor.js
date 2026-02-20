// EasyMDE initialization for ActiveAdmin markdown editor
(function() {
  function initMarkdownEditors() {
    var textareas = document.querySelectorAll('.markdown-editor-textarea, textarea[data-markdown-editor="true"]');
    textareas.forEach(function(textarea) {
      if (textarea.getAttribute('data-easymde-initialized') === 'true') return;
      textarea.setAttribute('data-easymde-initialized', 'true');
      if (typeof EasyMDE !== 'undefined') {
        new EasyMDE({
          element: textarea,
          spellChecker: false,
          autosave: { enabled: false },
          toolbar: [
            'bold', 'italic', 'heading', '|',
            'quote', 'code', 'unordered-list', 'ordered-list', '|',
            'link', 'image', '|',
            'preview', 'side-by-side', 'fullscreen', '|',
            'guide'
          ]
        });
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMarkdownEditors);
  } else {
    initMarkdownEditors();
  }
  // Re-initialize on Turbo navigation (if present)
  if (typeof Turbo !== 'undefined') {
    document.addEventListener('turbo:load', initMarkdownEditors);
  }
})();
