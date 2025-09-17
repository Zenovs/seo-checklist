document.addEventListener('DOMContentLoaded', () => {
  const TASK_STATE_KEY = 'seo-checklist-task-state-v1';
  const CUSTOM_TASK_KEY = 'seo-checklist-custom-tasks-v1';
  const THEME_KEY = 'seo-checklist-theme';

  const body = document.body;
  const sections = Array.from(document.querySelectorAll('[data-section]'));
  const searchInput = document.querySelector('[data-search]');
  const modeToggle = document.querySelector('[data-mode-toggle]');
  const modeIcon = modeToggle ? modeToggle.querySelector('.mode-toggle__icon') : null;
  const modeLabel = modeToggle ? modeToggle.querySelector('.mode-toggle__label') : null;
  const progressBar = document.querySelector('[data-progress-bar]');
  const progressMeter = progressBar ? progressBar.closest('.progress-meter') : null;
  const progressLabel = document.querySelector('[data-progress-label]');
  const progressPercent = document.querySelector('[data-progress-percent]');

  const taskState = readJSON(TASK_STATE_KEY, {});
  const customTasks = readJSON(CUSTOM_TASK_KEY, {});
  const tasks = new Map();

  let customTasksDirty = false;

  Object.keys(customTasks).forEach((sectionId) => {
    if (!sections.some((section) => section.dataset.sectionId === sectionId)) {
      delete customTasks[sectionId];
      customTasksDirty = true;
    }
  });

  sections.forEach((section) => {
    const sectionId = section.dataset.sectionId;
    if (!sectionId) {
      return;
    }

    const list = section.querySelector('.task-list');
    if (!list) {
      return;
    }

    const stored = Array.isArray(customTasks[sectionId]) ? customTasks[sectionId] : [];
    const validTasks = [];

    stored.forEach((task) => {
      if (!task || typeof task.id !== 'string' || typeof task.text !== 'string') {
        customTasksDirty = true;
        return;
      }

      const { element } = createTaskElement(task.text, task.id, true);
      list.appendChild(element);
      validTasks.push({ id: task.id, text: task.text });
    });

    customTasks[sectionId] = validTasks;
    if (validTasks.length !== stored.length) {
      customTasksDirty = true;
    }
  });

  if (customTasksDirty) {
    persistCustomTasks();
  }

  document.querySelectorAll('.task-item input[type="checkbox"]').forEach((checkbox) => {
    registerTask(checkbox);
  });

  cleanupState();
  persistState();
  updateProgress();

  if (searchInput) {
    filterTasks(searchInput.value);
    searchInput.addEventListener('input', (event) => {
      filterTasks(event.target.value);
    });
  } else {
    filterTasks('');
  }

  document.querySelectorAll('[data-add-task]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = form.querySelector('input');
      if (!input) {
        return;
      }

      const rawValue = input.value.trim();
      if (!rawValue) {
        input.focus();
        return;
      }

      const section = form.closest('[data-section]');
      if (!section) {
        return;
      }

      const sectionId = section.dataset.sectionId;
      const list = section.querySelector('.task-list');
      if (!sectionId || !list) {
        return;
      }

      const taskId = `${sectionId}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
      const { element, checkbox } = createTaskElement(rawValue, taskId, true);
      list.appendChild(element);

      const registered = registerTask(checkbox);
      if (registered) {
        persistState();
      }

      if (!Array.isArray(customTasks[sectionId])) {
        customTasks[sectionId] = [];
      }

      customTasks[sectionId].push({ id: taskId, text: rawValue });
      persistCustomTasks();

      input.value = '';
      updateProgress();
      filterTasks(searchInput ? searchInput.value : '');
      input.focus();
    });
  });

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-remove-task]');
    if (!trigger) {
      return;
    }

    const item = trigger.closest('.task-item');
    if (!item || !item.dataset.custom) {
      return;
    }

    const section = trigger.closest('[data-section]');
    if (!section) {
      return;
    }

    const sectionId = section.dataset.sectionId;
    const taskId = item.dataset.taskId;
    if (!sectionId || !taskId) {
      return;
    }

    const list = customTasks[sectionId];
    if (Array.isArray(list)) {
      const index = list.findIndex((task) => task.id === taskId);
      if (index !== -1) {
        list.splice(index, 1);
        persistCustomTasks();
      }
    }

    tasks.delete(taskId);
    delete taskState[taskId];
    persistState();

    item.remove();
    updateProgress();
    filterTasks(searchInput ? searchInput.value : '');
  });

  initTheme();

  function registerTask(checkbox) {
    if (!(checkbox instanceof HTMLInputElement)) {
      return false;
    }

    const item = checkbox.closest('.task-item');
    if (!item) {
      return false;
    }

    const taskId = item.dataset.taskId;
    if (!taskId || tasks.has(taskId)) {
      return false;
    }

    tasks.set(taskId, { checkbox, item });

    const saved = taskState[taskId];
    if (typeof saved === 'boolean') {
      checkbox.checked = saved;
    } else {
      taskState[taskId] = checkbox.checked;
    }

    item.classList.toggle('is-complete', checkbox.checked);

    checkbox.addEventListener('change', () => {
      taskState[taskId] = checkbox.checked;
      persistState();
      item.classList.toggle('is-complete', checkbox.checked);
      updateProgress();
    });

    return true;
  }

  function createTaskElement(text, id, isCustom = false) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.taskId = id;
    if (isCustom) {
      li.dataset.custom = 'true';
    }

    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    const span = document.createElement('span');
    span.textContent = text;

    label.append(checkbox, span);
    li.append(label);

    if (isCustom) {
      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.className = 'task-remove';
      removeButton.dataset.removeTask = 'true';
      removeButton.setAttribute('aria-label', 'Aufgabe löschen');
      removeButton.innerHTML = '<span aria-hidden="true">✕</span>';
      li.append(removeButton);
    }

    return { element: li, checkbox };
  }

  function updateProgress() {
    const entries = Array.from(tasks.values());
    const totalTasks = entries.length;
    const completedTasks = entries.filter((entry) => entry.checkbox.checked).length;
    const percent = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

    if (progressBar) {
      progressBar.style.width = `${percent}%`;
    }

    if (progressMeter) {
      progressMeter.setAttribute('aria-valuenow', String(percent));
      progressMeter.setAttribute('aria-valuetext', `${completedTasks} von ${totalTasks} Aufgaben erledigt`);
    }

    if (progressLabel) {
      progressLabel.textContent = `${completedTasks} von ${totalTasks} Aufgaben erledigt`;
    }

    if (progressPercent) {
      progressPercent.innerHTML = `${percent}&nbsp;%`;
    }

    sections.forEach((section) => {
      const sectionTasks = Array.from(section.querySelectorAll('.task-item'));
      let completed = 0;
      let total = 0;

      sectionTasks.forEach((item) => {
        const entry = tasks.get(item.dataset.taskId || '');
        if (entry) {
          total += 1;
          if (entry.checkbox.checked) {
            completed += 1;
          }
        }
      });

      const sectionPercent = total ? Math.round((completed / total) * 100) : 0;
      const sectionBar = section.querySelector('[data-section-progress]');
      const sectionMeter = section.querySelector('.progress-meter');
      const sectionLabel = section.querySelector('[data-section-label]');

      if (sectionBar) {
        sectionBar.style.width = `${sectionPercent}%`;
      }

      if (sectionMeter) {
        sectionMeter.setAttribute('aria-valuenow', String(sectionPercent));
        sectionMeter.setAttribute('aria-valuetext', `${completed} von ${total} Aufgaben erledigt`);
      }

      if (sectionLabel) {
        sectionLabel.textContent = `${completed}/${total}`;
      }
    });
  }

  function filterTasks(term) {
    const query = term ? term.toLowerCase() : '';

    sections.forEach((section) => {
      const items = Array.from(section.querySelectorAll('.task-item'));
      let visibleCount = 0;

      items.forEach((item) => {
        const text = item.textContent ? item.textContent.toLowerCase() : '';
        const matches = !query || text.includes(query);
        item.classList.toggle('is-hidden', !matches);
        if (matches) {
          visibleCount += 1;
        }
      });

      const emptyMessage = section.querySelector('[data-empty-state]');
      if (emptyMessage) {
        emptyMessage.hidden = !query || visibleCount > 0;
      }

      section.classList.toggle('section--filtered', Boolean(query));
      section.classList.toggle('section--filtered-empty', Boolean(query) && visibleCount === 0);
    });
  }

  function cleanupState() {
    let changed = false;

    Object.keys(taskState).forEach((taskId) => {
      if (!tasks.has(taskId)) {
        delete taskState[taskId];
        changed = true;
      }
    });

    if (changed) {
      persistState();
    }
  }

  function persistState() {
    try {
      localStorage.setItem(TASK_STATE_KEY, JSON.stringify(taskState));
    } catch (error) {
      console.warn('Konnte Aufgabenstatus nicht speichern:', error);
    }
  }

  function persistCustomTasks() {
    try {
      localStorage.setItem(CUSTOM_TASK_KEY, JSON.stringify(customTasks));
    } catch (error) {
      console.warn('Konnte benutzerdefinierte Aufgaben nicht speichern:', error);
    }
  }

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        return fallback;
      }

      const parsed = JSON.parse(raw);
      return typeof parsed === 'object' && parsed !== null ? parsed : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function initTheme() {
    if (!modeToggle) {
      return;
    }

    const storedTheme = localStorage.getItem(THEME_KEY);
    const mediaQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

    if (storedTheme === 'dark' || storedTheme === 'light') {
      applyTheme(storedTheme, true);
    } else {
      const prefersDark = mediaQuery ? mediaQuery.matches : false;
      applyTheme(prefersDark ? 'dark' : 'light', false);
    }

    if (mediaQuery) {
      const handleChange = (event) => {
        if (localStorage.getItem(THEME_KEY)) {
          return;
        }
        applyTheme(event.matches ? 'dark' : 'light', false);
      };

      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', handleChange);
      } else if (typeof mediaQuery.addListener === 'function') {
        mediaQuery.addListener(handleChange);
      }
    }

    modeToggle.addEventListener('click', () => {
      const nextTheme = body.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme, true);
    });

    updateThemeToggle();

    function applyTheme(theme, persist) {
      body.dataset.theme = theme;
      if (persist) {
        localStorage.setItem(THEME_KEY, theme);
      }
      updateThemeToggle();
    }

    function updateThemeToggle() {
      const isDark = body.dataset.theme === 'dark';
      modeToggle.setAttribute('aria-pressed', String(isDark));
      modeToggle.setAttribute('aria-label', isDark ? 'Light Mode aktivieren' : 'Dark Mode aktivieren');
      if (modeIcon) {
        modeIcon.textContent = isDark ? '☀️' : '🌙';
      }
      if (modeLabel) {
        modeLabel.textContent = isDark ? 'Light Mode' : 'Dark Mode';
      }
    }
  }
});
