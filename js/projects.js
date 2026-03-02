/**
 * projects.js — Filter bar for project cards
 */
document.addEventListener('DOMContentLoaded', function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card, .project-featured');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Dim non-matching cards in-place (opacity only, no DOM reordering)
      // so the grid layout stays stable and doesn't visually jump.
      // Each card carries a `data-tags` attribute with space-separated tag slugs.
      projectCards.forEach(card => {
        if (filter === 'all') {
          card.classList.remove('filtered-out');
        } else {
          const tags = (card.dataset.tags || '').split(' ');
          if (tags.includes(filter)) {
            card.classList.remove('filtered-out');
          } else {
            card.classList.add('filtered-out');
          }
        }
      });
    });
  });
});
