// Мобильная навигация
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Закрытие алертов
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                alert.remove();
            }, 500);
        }, 5000);
    });
    
    // Плавный скролл для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.feature-card, .expert-card, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Валидация форм
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#f44336';
                    field.style.animation = 'shake 0.5s';
                    
                    setTimeout(() => {
                        field.style.animation = '';
                        field.style.borderColor = '#ddd';
                    }, 500);
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('Пожалуйста, заполните все обязательные поля');
            }
        });
    });
    
    // Динамическая загрузка экспертов (для демонстрации)
    loadMoreExperts();
});

// Функция загрузки дополнительных экспертов
function loadMoreExperts() {
    const expertsContainer = document.querySelector('.experts-grid');
    if (!expertsContainer) return;
    
    // Симуляция загрузки
    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.textContent = 'Загрузить еще экспертов';
    loadMoreBtn.className = 'btn-submit';
    loadMoreBtn.style.margin = '2rem auto';
    loadMoreBtn.style.display = 'block';
    loadMoreBtn.style.maxWidth = '300px';
    
    loadMoreBtn.addEventListener('click', function() {
        this.textContent = 'Загрузка...';
        this.disabled = true;
        
        setTimeout(() => {
            const newExperts = [
                {
                    name: 'Дмитрий Волков',
                    specialty: 'Цифровая криминалистика',
                    experience: 7,
                    rating: 4.9
                },
                {
                    name: 'Анна Соколова',
                    specialty: 'Веб-безопасность',
                    experience: 5,
                    rating: 4.8
                }
            ];
            
            newExperts.forEach(expert => {
                const card = createExpertCard(expert);
                expertsContainer.appendChild(card);
            });
            
            this.remove();
        }, 1500);
    });
    
    expertsContainer.parentNode.insertBefore(loadMoreBtn, expertsContainer.nextSibling);
}

// Создание карточки эксперта
function createExpertCard(data) {
    const card = document.createElement('div');
    card.className = 'expert-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    card.innerHTML = `
        <div class="expert-avatar">
            <div class="avatar-placeholder">👨‍💻</div>
        </div>
        <h3>${data.name}</h3>
        <p class="specialty">${data.specialty}</p>
        <p class="experience">Опыт: ${data.experience} лет</p>
        <div class="rating">⭐ ${data.rating}/5.0</div>
        <a href="/contact/" class="contact-expert">Связаться</a>
    `;
    
    setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 100);
    
    return card;
}

// Подтверждение удаления/отмены
function confirmAction(message) {
    return new Promise((resolve) => {
        if (confirm(message || 'Вы уверены?')) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
}

// Форматирование даты
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}