import { NEWS_API_KEY } from "../config.js";

let _htmlSyncIntervalId = null;

async function fetchNewsFragment() {
    try {
        const news = document.getElementById("news");
        const path = (window.location.pathname.endsWith('/')) ? window.location.pathname + 'index.html' : window.location.pathname;
        const url = `${path}?_=${Date.now()}`;
        const resp = await fetch(url, { cache: 'no-store' });
        if (!resp.ok) return null;
        const text = await resp.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const frag = doc.getElementById('news');
        return frag ? frag.innerHTML : null;
    } catch (e) {
        console.warn('fetchNewsFragment failed:', e);
        return null;
    }
}

function startHtmlSync(intervalMs = 2000) {
    if (_htmlSyncIntervalId) return;
    _htmlSyncIntervalId = setInterval(async () => {
        const news = document.getElementById('news');
        if (!news) return;
        const fetched = await fetchNewsFragment();
        if (fetched !== null && fetched.trim() !== '' && fetched.trim() !== news.innerHTML.trim()) {
            news.innerHTML = fetched;
        }
    }, intervalMs);
}

export async function updateNewsWidget() {
    const news = document.getElementById("news");

    const getYouTubeEmbed = (url) => {
        try {
            // Поддержка форматов: https://www.youtube.com/watch?v=ID и https://youtu.be/ID
            const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_\-]{11})/);
            if (ytMatch && ytMatch[1]) return `https://www.youtube.com/embed/${ytMatch[1]}`;
        } catch (e) { /* ignore */ }
        return null;
    };

    const render = (articles) => {
        news.innerHTML = articles
            .slice(0, 3)
            .map(a => {
                let media = '';

                if (a.video) {
                    const yt = getYouTubeEmbed(a.video);
                    if (yt) {
                        media = `<div class="news-video"><iframe width="300" height="170" src="${yt}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
                    } else {
                        // попытка воспроизвести напрямую — используется только для прямых mp4 ссылок
                        media = `<video controls class="news-image" width="300" poster="${a.image || ''}"><source src="${a.video}" type="video/mp4">Ваш браузер не поддерживает видео</video>`;
                    }
                } else if (a.image) {
                    media = `<img src="${a.image}" class="news-image" alt="Новость">`;
                }

                return `
                <div class="news-card">
                    ${media}
                    <h3>${a.title || 'Без заголовка'}</h3>
                    ${a.description ? `<p>${a.description}</p>` : ''}
                </div>
            `;
            })
            .join("");
    };

    try {
        // Попробуем получить новости с API, если есть ключ
        if (NEWS_API_KEY && NEWS_API_KEY !== "ВАШ_КЛЮЧ") {
            const response = await fetch(`https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&language=ru`);

            if (response.ok) {
                const data = await response.json();
                if (data.results && data.results.length) {
                    const articles = data.results.map(r => ({
                        title: r.title,
                        description: r.description || r.content || '',
                        image: r.image_url || r.image || ''
                    }));
                    render(articles);
                }
            } else {
                console.error("Ошибка при загрузке новостей:", response.status, response.statusText);
            }
        }

    } catch (err) {
        console.error("Ошибка updateNewsWidget (API):", err);
    }

    // Всегда синхронизируем содержимое из index.html — это позволит моментально увидеть правки в HTML
    try {
        const fetched = await fetchNewsFragment();
        if (fetched !== null && fetched.trim() !== '') {
            news.innerHTML = fetched;
        }
    } catch (e) {
        // ignore
    }

    // Запускаем периодическую подгрузку фрагмента, чтобы правки в файле отображались сразу без перезагрузки страницы
    startHtmlSync();
}