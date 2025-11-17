window.app = (function () {
    const API_BASE = '/api';
    const useApi = true;

    async function apiFetch(path, opts) {
        if (!useApi) throw new Error('API disabled');
        const res = await fetch(API_BASE + path, opts);
        if (!res.ok) throw new Error('API error: ' + res.status);
        return res.json();
    }

    async function loadClubs(containerSelector) {
        const container = document.querySelector(containerSelector);
        container.innerHTML = '<p>Loading…</p>';
        try {
            const clubs = await apiFetch('/clubs');
            renderClubsList(container, clubs);
        } catch (err) {
            const clubs = JSON.parse(localStorage.getItem('clubs') || '[]');
            renderClubsList(container, clubs);
        }
    }

    function renderClubsList(container, clubs) {
        if (!clubs.length) { container.innerHTML = '<p>No clubs.</p>'; return; }
        container.innerHTML = '';
        clubs.forEach(c => {
            const div = document.createElement('div');
            div.className = 'list-item';
            div.innerHTML = `<div>
          <strong>${escapeHtml(c.name)}</strong>
          <div class="meta">${escapeHtml(c.description || '')} • cap: ${c.capacity || '—'}</div>
        </div>
        <div>
          <button class="small-btn" data-id="${c.club_id}" data-action="delete">Delete</button>
        </div>`;
            container.appendChild(div);
        });
        container.querySelectorAll('[data-action="delete"]').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                try {
                    await apiFetch('/clubs/' + id, { method: 'DELETE' });
                } catch (e) {
                    const clubs = JSON.parse(localStorage.getItem('clubs') || '[]').filter(x => String(x.club_id) !== String(id));
                    localStorage.setItem('clubs', JSON.stringify(clubs));
                } finally {
                    loadClubs(containerSelector);
                }
            });
        });
    }

    async function createClub(data) {
        try {
            const res = await apiFetch('/clubs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return res;
        } catch (err) {
            const clubs = JSON.parse(localStorage.getItem('clubs') || '[]');
            const id = (clubs.length ? (Math.max(...clubs.map(c => c.club_id || 0)) + 1) : 1);
            const newClub = Object.assign({ club_id: id }, data);
            clubs.push(newClub);
            localStorage.setItem('clubs', JSON.stringify(clubs));
            return newClub;
        }
    }

    async function loadActivities(containerSelector) {
        const container = document.querySelector(containerSelector);
        container.innerHTML = '<p>Loading…</p>';
        try {
            const activities = await apiFetch('/activities');
            renderActivities(container, activities);
        } catch (err) {
            const activities = JSON.parse(localStorage.getItem('activities') || '[]');
            renderActivities(container, activities);
        }
    }

    function renderActivities(container, list) {
        if (!list.length) { container.innerHTML = '<p>No activities.</p>'; return; }
        container.innerHTML = '';
        list.forEach(a => {
            const div = document.createElement('div');
            div.className = 'list-item';
            div.innerHTML = `<div>
          <strong>${escapeHtml(a.title)}</strong>
          <div class="meta">${a.start_date || ''} ${a.start_time || ''} • ${escapeHtml(a.location || '')}</div>
        </div>
        <div>
          <button class="small-btn" data-id="${a.activity_id}" data-action="delete">Delete</button>
        </div>`;
            container.appendChild(div);
        });
        container.querySelectorAll('[data-action="delete"]').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                try {
                    await apiFetch('/activities/' + id, { method: 'DELETE' });
                } catch (e) {
                    const arr = JSON.parse(localStorage.getItem('activities') || '[]').filter(x => String(x.activity_id) !== String(id));
                    localStorage.setItem('activities', JSON.stringify(arr));
                } finally { loadActivities(containerSelector); }
            });
        });
    }

    async function createActivity(data) {
        try {
            return await apiFetch('/activities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } catch (e) {
            const arr = JSON.parse(localStorage.getItem('activities') || '[]');
            const id = arr.length ? Math.max(...arr.map(x => x.activity_id || 0)) + 1 : 1;
            const newActivity = Object.assign({ activity_id: id }, data);
            arr.push(newActivity);
            localStorage.setItem('activities', JSON.stringify(arr));
            return newActivity;
        }
    }

    function escapeHtml(s = '') {
        return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    return {
        loadClubs,
        createClub,
        loadActivities,
        createActivity
    };
})();
