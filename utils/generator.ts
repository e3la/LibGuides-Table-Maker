import type { TableData, CustomizationOptions } from '../types';

function escapeHtml(unsafe: string) {
  // A robust HTML escaping function
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function stripHtml(html: string) {
  // This is a browser-only function.
  // It's a simple and effective way to strip HTML tags for this client-side app.
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

const themes = {
  light: `
    --table-bg-color: #ffffff;
    --table-text-color: #212529;
    --table-border-color: #dee2e6;
    --table-header-bg: #f8f9fa;
    --table-header-text: #212529;
    --table-stripe-bg: #f2f2f2;
    --table-hover-bg: #e9ecef;
    --table-focus-ring: #86b7fe;
    --table-search-bg: #ffffff;
    --table-search-border: #ced4da;
  `,
  dark: `
    --table-bg-color: #212529;
    --table-text-color: #f8f9fa;
    --table-border-color: #495057;
    --table-header-bg: #343a40;
    --table-header-text: #f8f9fa;
    --table-stripe-bg: #2c3034;
    --table-hover-bg: #343a40;
    --table-focus-ring: #86b7fe;
    --table-search-bg: #343a40;
    --table-search-border: #495057;
  `,
  'high-contrast': `
    --table-bg-color: #ffffff;
    --table-text-color: #000000;
    --table-border-color: #000000;
    --table-header-bg: #e0e0e0;
    --table-header-text: #000000;
    --table-stripe-bg: #f0f0f0;
    --table-hover-bg: #d0d0d0;
    --table-focus-ring: #0000ff;
    --table-search-bg: #ffffff;
    --table-search-border: #000000;
  `,
};


export const generateTableHtml = (data: TableData, options: CustomizationOptions): string => {
  const { headers, rows } = data;
  const { tableCaption, stripHtml: shouldStripHtml, tableTheme, stripedRows } = options;
  const tableId = `lg-table-${Date.now()}`;

  const getCellContent = (cell: string) => {
    if (shouldStripHtml) {
      return escapeHtml(stripHtml(cell));
    }
    // If not stripping, we trust the user's HTML input.
    // No escaping is done to allow tags like <b>, <i>, <a> etc.
    return cell;
  };

  const tableHeaders = headers.map(header =>
    `<th scope="col">
      <button class="lg-table-sort-btn">
        ${escapeHtml(header)}
        <span class="sort-indicator" aria-hidden="true"></span>
      </button>
    </th>`
  ).join('');

  const tableRows = rows.map(row =>
    `<tr>
      ${row.map(cell => `<td>${getCellContent(cell)}</td>`).join('')}
    </tr>`
  ).join('');

  // The entire output is a single string literal
  return `
<!-- LibGuides Accessible Table START -->
<style>
  :root {
    ${themes[tableTheme]}
  }
  #${tableId}-container {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: var(--table-text-color);
  }
  #${tableId}-search-label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  #${tableId}-search {
    width: 100%;
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    border: 1px solid var(--table-search-border);
    border-radius: 0.25rem;
    background-color: var(--table-search-bg);
    color: var(--table-text-color);
    margin-bottom: 1rem;
    box-sizing: border-box;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }
  #${tableId}-search:focus {
    outline: none;
    border-color: var(--table-focus-ring);
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  }
  #${tableId}-wrapper {
    overflow-x: auto;
  }
  #${tableId} {
    width: 100%;
    border-collapse: collapse;
    background-color: var(--table-bg-color);
  }
  #${tableId} caption {
    caption-side: top;
    padding: 0.5rem;
    font-size: 1.25rem;
    font-weight: bold;
    text-align: left;
    color: var(--table-header-text);
  }
  #${tableId} th, #${tableId} td {
    padding: 0.75rem;
    border: 1px solid var(--table-border-color);
    text-align: left;
    vertical-align: top;
  }
  #${tableId} thead th {
    background-color: var(--table-header-bg);
    font-weight: bold;
    color: var(--table-header-text);
  }
  ${stripedRows ? `
  #${tableId} tbody tr:nth-of-type(odd) {
    background-color: var(--table-stripe-bg);
  }
   #${tableId} tbody tr:nth-of-type(even) {
    background-color: var(--table-bg-color);
  }
  ` : `
   #${tableId} tbody tr {
    background-color: var(--table-bg-color);
  }
  `}
  #${tableId} tbody tr:hover {
    background-color: var(--table-hover-bg);
  }
  .lg-table-sort-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background: none;
    border: none;
    font: inherit;
    color: inherit;
    text-align: left;
    cursor: pointer;
    padding: 0;
  }
  .lg-table-sort-btn:focus-visible {
    outline: 2px solid var(--table-focus-ring);
    outline-offset: 2px;
  }
  .lg-table-sort-btn .sort-indicator {
    display: inline-block;
    width: 1em;
    height: 1em;
    margin-left: 0.5rem;
    opacity: 0.5;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'%3e%3cpath fill='currentColor' d='M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z'/%3e%3c/svg%3e");
  }
  th[aria-sort] .sort-indicator {
    opacity: 1;
  }
  th[aria-sort="ascending"] .sort-indicator {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'%3e%3cpath fill='currentColor' d='M279 224H41c-21.4 0-32.1-25.9-17-41L143 64c9.4-9.4 24.6-9.4 33.9 0l119 119c15.2 15.1 4.5 41-16.9 41z'/%3e%3c/svg%3e");
  }
  th[aria-sort="descending"] .sort-indicator {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'%3e%3cpath fill='currentColor' d='M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41z'/%3e%3c/svg%3e");
  }
</style>

<div id="${tableId}-container">
  <label for="${tableId}-search" id="${tableId}-search-label">Search this table:</label>
  <input type="search" id="${tableId}-search" placeholder="Filter rows...">
  <div id="${tableId}-wrapper">
    <table id="${tableId}">
      <caption>${escapeHtml(tableCaption)}</caption>
      <thead>
        <tr>
          ${tableHeaders}
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  </div>
</div>

<script>
  (function() {
    const tableContainer = document.getElementById('${tableId}-container');
    if (!tableContainer) return;

    const searchInput = tableContainer.querySelector('#${tableId}-search');
    const table = tableContainer.querySelector('#${tableId}');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const headers = Array.from(table.querySelectorAll('thead th'));

    // Search functionality
    searchInput.addEventListener('keyup', (e) => {
      const query = e.target.value.toLowerCase();
      rows.forEach(row => {
        const rowText = row.textContent.toLowerCase();
        row.style.display = rowText.includes(query) ? '' : 'none';
      });
    });

    // Sort functionality
    headers.forEach((header, index) => {
      const sortButton = header.querySelector('.lg-table-sort-btn');
      if (sortButton) {
        sortButton.addEventListener('click', () => {
          const currentSort = header.getAttribute('aria-sort');
          let direction = 'ascending';
          if (currentSort === 'ascending') {
            direction = 'descending';
          }

          const isNumeric = Array.from(rows).every(row => {
            const cellText = row.children[index]?.textContent?.trim() || '';
            return cellText === '' || !isNaN(parseFloat(cellText.replace(/[,\\$]/g, '')));
          });

          const sortedRows = Array.from(rows).sort((a, b) => {
            const aText = a.children[index]?.textContent?.trim() || '';
            const bText = b.children[index]?.textContent?.trim() || '';

            let aVal = aText;
            let bVal = bText;

            if (isNumeric) {
              aVal = parseFloat(aText.replace(/[,\\$]/g, '')) || 0;
              bVal = parseFloat(bText.replace(/[,\\$]/g, '')) || 0;
            }

            if (aVal < bVal) return -1;
            if (aVal > bVal) return 1;
            return 0;
          });

          if (direction === 'descending') {
            sortedRows.reverse();
          }

          // Reset aria-sort on all headers
          headers.forEach(h => h.removeAttribute('aria-sort'));
          header.setAttribute('aria-sort', direction);

          tbody.innerHTML = '';
          sortedRows.forEach(row => tbody.appendChild(row));
        });
      }
    });
  })();
</script>
<!-- LibGuides Accessible Table END -->
`;
};
