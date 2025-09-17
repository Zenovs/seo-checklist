const checklistItems = [
  {
    id: 'tech-title',
    category: 'Technisches SEO',
    title: 'Titel setzen (ca. 60 Zeichen)',
    webflow: 'Webflow → Page settings → SEO → Title',
    example: 'Beispiel: Kauwerk – Dentaltechnik in Visp'
  },
  {
    id: 'tech-description',
    category: 'Technisches SEO',
    title: 'Meta Description schreiben (max. 155 Zeichen)',
    webflow: 'Webflow → Page settings → SEO → Meta description',
    example: 'Beispiel: Kauwerk in Visp – Massgeschneiderte Zahntechnik für dein Lächeln'
  },
  {
    id: 'tech-og',
    category: 'Technisches SEO',
    title: 'Open Graph Bild hinterlegen (1200 × 630)',
    webflow: 'Webflow → Page settings → Open Graph settings → Image',
    example: 'Beispiel: /images/visp-dentaltechnik.jpg'
  },
  {
    id: 'tech-canonical',
    category: 'Technisches SEO',
    title: 'Canonical URL prüfen',
    webflow: 'Webflow → Page settings → SEO → Canonical URL',
    example: 'Beispiel: https://kauwerk.ch/visp'
  },
  {
    id: 'tech-sitemap',
    category: 'Technisches SEO',
    title: 'Sitemap aktivieren',
    webflow: 'Webflow → Project settings → SEO → Auto-generate sitemap',
    example: 'Beispiel: https://kauwerk.ch/sitemap.xml'
  },
  {
    id: 'tech-redirects',
    category: 'Technisches SEO',
    title: '301 Weiterleitungen einrichten',
    webflow: 'Webflow → Project settings → Publishing → 301 redirects',
    example: 'Beispiel: /zahnlabor → https://kauwerk.ch/visp'
  },
  {
    id: 'content-h1',
    category: 'Inhalt',
    title: 'Einzigartige H1 schreiben',
    webflow: 'Webflow → Designer → Add panel → Heading H1',
    example: 'Beispiel: Zahnersatz aus Visp – wir bauen dein Lächeln auf'
  },
  {
    id: 'content-intro',
    category: 'Inhalt',
    title: 'Einleitung nennt Angebot und Ort',
    webflow: 'Webflow → Designer → Rich text → Erster Absatz',
    example: 'Beispiel: Wir fertigen Kronen in Visp innerhalb von 3 Tagen'
  },
  {
    id: 'content-cta',
    category: 'Inhalt',
    title: 'Call-to-Action in Du-Form',
    webflow: 'Webflow → Designer → Button settings',
    example: 'Beispiel: Jetzt Beratung in Visp buchen'
  },
  {
    id: 'content-alt',
    category: 'Inhalt',
    title: 'Alt-Text beschreibt Bild',
    webflow: 'Webflow → Designer → Asset panel → Image → Alt text',
    example: 'Beispiel: Zahntechnikerin zeigt fertige Schiene in Visp'
  },
  {
    id: 'trust-contact',
    category: 'Vertrauen',
    title: 'Kontaktblock klar zeigen',
    webflow: 'Webflow → Designer → Symbol → Kontaktblock',
    example: 'Beispiel: Ruf uns an unter 027 000 00 00 in Visp'
  },
  {
    id: 'trust-legal',
    category: 'Vertrauen',
    title: 'Impressum und Datenschutz verlinken',
    webflow: 'Webflow → Designer → Footer → Link settings',
    example: 'Beispiel: /impressum → Interne Seite Impressum'
  },
  {
    id: 'trust-privacy',
    category: 'Vertrauen',
    title: 'Datenschutzerklärung veröffentlichen',
    webflow: 'Webflow → Pages → Datenschutz → Rich text bearbeiten',
    example: 'Beispiel: CH-konforme Datenschutzerklärung mit Cookie-Abschnitt einfügen'
  },
  {
    id: 'trust-imprint',
    category: 'Vertrauen',
    title: 'Impressum mit Pflichtangaben pflegen',
    webflow: 'Webflow → Pages → Impressum → Inhalte ergänzen',
    example: 'Beispiel: Firmenname, Adresse, UID und Kontakt gemäss CH-Recht'
  },
  {
    id: 'trust-cookies',
    category: 'Vertrauen',
    title: 'Cookie Banner & Policy integrieren',
    webflow: 'Webflow → Project settings → Privacy & Cookies → Cookie consent aktivieren',
    example: 'Beispiel: Consent-Tool eingebunden und Link zur Cookie-Policy gesetzt'
  },
  {
    id: 'trust-reviews',
    category: 'Vertrauen',
    title: 'Bewertungen integrieren',
    webflow: 'Webflow → CMS → Testimonials Collection',
    example: 'Beispiel: 5 Sterne von Zahnarztpraxis Sion'
  },
  {
    id: 'links-internal',
    category: 'Links',
    title: 'Interne Links zu Service-Seiten setzen',
    webflow: 'Webflow → Designer → Rich text → Link',
    example: 'Beispiel: Verlinke auf /implantate-visp'
  },
  {
    id: 'links-footer',
    category: 'Links',
    title: 'Footer-Navigation prüfen',
    webflow: 'Webflow → Designer → Footer nav menu → Link settings',
    example: 'Beispiel: Füge /preise hinzu'
  },
  {
    id: 'links-external',
    category: 'Links',
    title: 'Werbelinks mit rel="nofollow" markieren',
    webflow: 'Webflow → Designer → Link settings → Rel attribute',
    example: 'Beispiel: Sponsoring-Link auf dentalmesse.ch als nofollow'
  },
  {
    id: 'local-address',
    category: 'Lokal & Mehrsprachig (CH)',
    title: 'Adresse mit PLZ pflegen',
    webflow: 'Webflow → Designer → Footer → Address block',
    example: 'Beispiel: Bahnhofstrasse 10, 3930 Visp'
  },
  {
    id: 'local-phone',
    category: 'Lokal & Mehrsprachig (CH)',
    title: 'Telefon im CH-Format angeben',
    webflow: 'Webflow → Designer → Contact form → Link settings',
    example: 'Beispiel: +41 27 000 00 00'
  },
  {
    id: 'local-language-switch',
    category: 'Lokal & Mehrsprachig (CH)',
    title: 'Sprachumschalter verlinken',
    webflow: 'Webflow → Designer → Navbar → Language switcher',
    example: 'Beispiel: Button fr-CH zeigt auf /fr/visp-labo'
  },
  {
    id: 'local-hreflang',
    category: 'Lokal & Mehrsprachig (CH)',
    title: 'hreflang Snippet einfügen',
    webflow: 'Webflow → Page settings → Custom code → Head',
    example: 'Beispiel: Nutze Snippet hreflang de-fr-it-CH'
  },
  {
    id: 'geo-faq',
    category: 'GEO/LLM',
    title: 'FAQ mit klaren Fragen pflegen',
    webflow: 'Webflow → CMS → FAQ Collection',
    example: 'Beispiel: «Wie schnell erhalte ich meinen Zahnersatz in Visp?»'
  },
  {
    id: 'geo-robots-ai',
    category: 'GEO/LLM',
    title: 'Robots für AI-Crawler ergänzen',
    webflow: 'Webflow → Project settings → SEO → robots.txt',
    example: 'Beispiel: Ergänze Snippet robots-ai.txt'
  },
  {
    id: 'maintenance-forms',
    category: 'Wartung',
    title: 'Formulare testen',
    webflow: 'Webflow → Project settings → Forms → Send test',
    example: 'Beispiel: Testmail an hello@kauwerk.ch'
  },
  {
    id: 'maintenance-export',
    category: 'Wartung',
    title: 'Checkliste exportieren und sichern',
    webflow: 'Webflow → Custom code → Footer → Notiz',
    example: 'Beispiel: Lade CSV herunter und sichere im Team-Drive'
  }
];

const snippetSources = [
  {
    id: 'snippet-hreflang',
    title: 'hreflang de-CH / fr-CH / it-CH',
    path: 'snippets/hreflang/de-fr-it-CH.html'
  },
  {
    id: 'snippet-org',
    title: 'Organization JSON-LD',
    path: 'snippets/jsonld/organization.json'
  },
  {
    id: 'snippet-local',
    title: 'LocalBusiness CH JSON-LD',
    path: 'snippets/jsonld/localbusiness-ch.json'
  },
  {
    id: 'snippet-breadcrumb',
    title: 'Breadcrumb JSON-LD',
    path: 'snippets/jsonld/breadcrumb.json'
  },
  {
    id: 'snippet-robots',
    title: 'Robots Erweiterung für AI-Crawler',
    path: 'snippets/robots/robots-ai.txt'
  }
];

const storageKey = 'seo-checklist-state-v1';
const themeStorageKey = 'seo-checklist-theme';
const clientStateKey = '__clientName';

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initClientField();
  renderChecklist();
  setupControls();
  loadSnippets();
});

function loadState() {
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.error('Konnte Speicher nicht lesen', error);
    return {};
  }
}

function saveState(state) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (error) {
    console.error('Konnte Speicher nicht schreiben', error);
  }
}

function getClientNameFromState(state) {
  const value = state && typeof state[clientStateKey] === 'string' ? state[clientStateKey].trim() : '';
  return value;
}

function initClientField() {
  const input = document.querySelector('[data-client-input]');
  if (!input) {
    return;
  }

  const currentState = loadState();
  const initialName = getClientNameFromState(currentState);
  if (initialName) {
    input.value = initialName;
    if (currentState[clientStateKey] !== initialName) {
      currentState[clientStateKey] = initialName;
      saveState(currentState);
    }
  } else if (currentState[clientStateKey]) {
    delete currentState[clientStateKey];
    saveState(currentState);
  }
  updateClientOutput(initialName);

  input.addEventListener('input', () => {
    const nextState = loadState();
    const name = input.value.trim();
    if (name) {
      nextState[clientStateKey] = name;
    } else {
      delete nextState[clientStateKey];
    }
    saveState(nextState);
    updateClientOutput(name);
  });
}

function updateClientOutput(name) {
  const output = document.querySelector('[data-client-output]');
  if (output) {
    const progressContainer = output.closest('.client-progress');
    if (progressContainer) {
      progressContainer.dataset.state = name ? 'filled' : 'empty';
    }
    output.textContent = name ? name : 'Kein Kunde gesetzt';
  }
}

function renderChecklist() {
  const checklistContainer = document.getElementById('checklist');
  checklistContainer.innerHTML = '';
  const saved = loadState();

  const categories = Array.from(
    checklistItems.reduce((map, item) => {
      if (!map.has(item.category)) {
        map.set(item.category, []);
      }
      map.get(item.category).push(item);
      return map;
    }, new Map())
  );

  categories.forEach(([categoryName, items], index) => {
    const details = document.createElement('details');
    details.className = 'category';
    details.dataset.category = categoryName;
    if (index === 0) {
      details.open = true;
    }

    const summary = document.createElement('summary');
    const titleSpan = document.createElement('span');
    titleSpan.textContent = categoryName;
    const progressSpan = document.createElement('span');
    progressSpan.className = 'category-progress';
    progressSpan.dataset.categoryProgress = categoryName;
    summary.append(titleSpan, progressSpan);

    const taskList = document.createElement('div');
    taskList.className = 'task-list';

    items.forEach((task) => {
      const taskArticle = document.createElement('article');
      taskArticle.className = 'task';
      taskArticle.dataset.taskId = task.id;

      const label = document.createElement('label');
      label.setAttribute('for', task.id);

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = task.id;
      checkbox.checked = Boolean(saved[task.id]);

      const labelText = document.createElement('span');
      labelText.textContent = task.title;

      label.append(checkbox, labelText);

      const info = document.createElement('div');
      info.className = 'task-info';

      const webflowLine = document.createElement('p');
      webflowLine.className = 'webflow-path';
      webflowLine.textContent = `Webflow-Wegweiser: ${task.webflow}`;

      const exampleLine = document.createElement('p');
      exampleLine.className = 'example';
      exampleLine.textContent = task.example;

      info.append(webflowLine, exampleLine);
      taskArticle.append(label, info);
      taskList.append(taskArticle);

      if (checkbox.checked) {
        taskArticle.classList.add('completed');
      }

      checkbox.addEventListener('change', () => {
        const state = loadState();
        state[task.id] = checkbox.checked;
        saveState(state);
        taskArticle.classList.toggle('completed', checkbox.checked);
        updateProgress();
      });
    });

    details.append(summary, taskList);
    checklistContainer.append(details);
  });

  updateProgress();
}

function updateProgress() {
  const saved = loadState();
  const total = checklistItems.length;
  const done = checklistItems.filter((item) => saved[item.id]).length;
  const overall = document.getElementById('overall-progress');
  overall.textContent = `${done} von ${total} Aufgaben erledigt`;
  updateClientOutput(getClientNameFromState(saved));

  const categoryTotals = checklistItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { total: 0, done: 0 };
    }
    acc[item.category].total += 1;
    if (saved[item.id]) {
      acc[item.category].done += 1;
    }
    return acc;
  }, {});

  document.querySelectorAll('.category').forEach((categoryEl) => {
    const categoryName = categoryEl.dataset.category;
    const progressSpan = categoryEl.querySelector('[data-category-progress]');
    const data = categoryTotals[categoryName] || { total: 0, done: 0 };
    progressSpan.textContent = `${data.done}/${data.total}`;

    categoryEl.querySelectorAll('.task').forEach((taskEl) => {
      const id = taskEl.dataset.taskId;
      taskEl.classList.toggle('completed', Boolean(saved[id]));
    });
  });
}

function setupControls() {
  document.querySelectorAll('[data-action="open-all"]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.category').forEach((category) => {
        category.open = true;
      });
    });
  });

  document.querySelectorAll('[data-action="close-all"]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.category').forEach((category) => {
        category.open = false;
      });
    });
  });

  document.querySelectorAll('[data-action="reset"]').forEach((button) => {
    button.addEventListener('click', () => {
      saveState({});
      document.querySelectorAll('.task input[type="checkbox"]').forEach((checkbox) => {
        checkbox.checked = false;
      });
      const clientInput = document.querySelector('[data-client-input]');
      if (clientInput) {
        clientInput.value = '';
      }
      updateClientOutput('');
      updateProgress();
    });
  });

  document.querySelectorAll('[data-action="export"]').forEach((button) => {
    button.addEventListener('click', () => {
      exportChecklist();
    });
  });
}

function initThemeToggle() {
  const toggleButton = document.querySelector('[data-action="toggle-theme"]');
  if (!toggleButton) {
    return;
  }

  const storedTheme = readStoredTheme();
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const initialTheme = storedTheme || (prefersDark.matches ? 'dark' : 'light');

  applyTheme(initialTheme);

  const handlePreferenceChange = (event) => {
    if (!readStoredTheme()) {
      applyTheme(event.matches ? 'dark' : 'light');
    }
  };

  if (typeof prefersDark.addEventListener === 'function') {
    prefersDark.addEventListener('change', handlePreferenceChange);
  } else if (typeof prefersDark.addListener === 'function') {
    prefersDark.addListener(handlePreferenceChange);
  }

  toggleButton.addEventListener('click', () => {
    const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme, true);
  });
}

function applyTheme(theme, persist = false) {
  document.documentElement.dataset.theme = theme;
  document.body.dataset.theme = theme;

  const toggleButton = document.querySelector('[data-action="toggle-theme"]');
  if (toggleButton) {
    toggleButton.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    toggleButton.setAttribute(
      'title',
      theme === 'dark' ? 'Wechsle zu Light Mode' : 'Wechsle zu Dark Mode'
    );

    const label = toggleButton.querySelector('[data-theme-label]');
    if (label) {
      label.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }
  }

  if (persist) {
    writeStoredTheme(theme);
  }
}

function readStoredTheme() {
  try {
    return window.localStorage.getItem(themeStorageKey);
  } catch (error) {
    console.error('Konnte Theme nicht lesen', error);
    return null;
  }
}

function writeStoredTheme(theme) {
  try {
    window.localStorage.setItem(themeStorageKey, theme);
  } catch (error) {
    console.error('Konnte Theme nicht speichern', error);
  }
}

function exportChecklist() {
  const saved = loadState();
  const header = ['id', 'Kategorie', 'Aufgabe', 'Webflow', 'Beispiel', 'Status'];
  const rows = checklistItems.map((item) => [
    item.id,
    item.category,
    item.title,
    item.webflow,
    item.example,
    saved[item.id] ? 'erledigt' : 'offen'
  ]);

  const csvContent = [header, ...rows]
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(';'))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const timestamp = new Date().toISOString().split('T')[0];
  link.download = `webflow-seo-checkliste-${timestamp}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function loadSnippets() {
  const grid = document.getElementById('snippet-grid');
  grid.innerHTML = '';

  snippetSources.forEach((snippet) => {
    const card = document.createElement('article');
    card.className = 'snippet-card';

    const header = document.createElement('header');
    const title = document.createElement('h3');
    title.textContent = snippet.title;
    const button = document.createElement('button');
    button.className = 'copy-button';
    button.type = 'button';
    button.textContent = 'Kopieren';
    button.dataset.snippetId = snippet.id;

    header.append(title, button);

    const pre = document.createElement('pre');
    pre.className = 'snippet-content';
    pre.textContent = 'Lade ...';

    card.append(header, pre);
    grid.append(card);

    fetch(snippet.path)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Status ${response.status}`);
        }
        return response.text();
      })
      .then((text) => {
        const cleaned = text.trim();
        pre.textContent = cleaned;
        button.addEventListener('click', () => copyToClipboard(cleaned, button));
      })
      .catch((error) => {
        pre.textContent = `Konnte Snippet nicht laden: ${error.message}`;
        button.disabled = true;
      });
  });
}

function copyToClipboard(text, trigger) {
  if (!navigator.clipboard) {
    fallbackCopy(text, trigger);
    return;
  }

  navigator.clipboard
    .writeText(text)
    .then(() => showCopied(trigger))
    .catch(() => fallbackCopy(text, trigger));
}

function fallbackCopy(text, trigger) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showCopied(trigger);
  } catch (error) {
    console.error('Kopieren nicht möglich', error);
  } finally {
    document.body.removeChild(textarea);
  }
}

function showCopied(trigger) {
  const original = trigger.textContent;
  trigger.textContent = 'Kopiert!';
  trigger.disabled = true;
  setTimeout(() => {
    trigger.textContent = original;
    trigger.disabled = false;
  }, 1600);
}
