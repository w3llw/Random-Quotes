document.addEventListener('DOMContentLoaded', () => {

    const getQuoteButton = document.getElementById('newQuote');
    const addFavoriteButton = document.getElementById('addToFavorite');
    const favoritesList = document.getElementById('favorites_list');
    const noQuotesMessage = document.getElementById('noQuotesMessage');
    const quoteBlock = document.getElementById('quoteBlock'); // Define the quoteBlock element

    let currentQuote = '';
    let currentAuthor = '';

    // Загрузка избранных цитат из LocalStorage
    const loadFavorites = () => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favoritesList.innerHTML = '';
        if (favorites.length === 0) {
            noQuotesMessage.style.display = 'block';
        } else {
            noQuotesMessage.style.display = 'none';
            favorites.forEach((favorite, index) => {
                const li = document.createElement('li');
                li.classList.add('p-4', 'mb-4', 'bg-white', 'shadow-md', 'rounded', 'border', 'border-gray-200');
                li.style.listStyle = 'none'; // Убираем точки перед li
                // Раскодирование перед выводом
                li.innerHTML = `<p class="text-lg italic">"${decodeURIComponent(favorite.content)}"</p><p class="text-right mt-2">- ${decodeURIComponent(favorite.author)}</p>`;
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Удалить';
                deleteButton.classList.add('bg-red-500', 'text-white', 'px-2', 'py-1', 'rounded', 'mt-2', 'hover:bg-red-700');
                deleteButton.addEventListener('click', () => {
                    removeFavorite(index);
                });
                li.appendChild(deleteButton);
                favoritesList.appendChild(li);
            });
        }
    };

    // Сохранение избранных цитат в LocalStorage
    const saveFavorites = (favorites) => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    };

    // Удаление избранной цитаты из списка
    const removeFavorite = (index) => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites.splice(index, 1);
        saveFavorites(favorites);
        loadFavorites();
    };

    // Получение случайной цитаты из API Quotable
    const fetchQuote = async () => {
        try {
            const response = await fetch('http://api.quotable.io/random');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            currentQuote = data.content;
            currentAuthor = data.author;
            // Обновление интерфейса с цитатой
            quoteBlock.innerHTML = `<p class="text-lg italic">"${currentQuote}"</p><p class="text-right mt-2">- ${currentAuthor}</p>`;
            // Скрыть сообщение об отсутствии цитат
            noQuotesMessage.style.display = 'none';
        } catch (error) {
            console.error('Error fetching quote:', error);
            quoteBlock.innerHTML = '<p class="text-lg italic">Не удалось загрузить цитату. Попробуйте позже.</p>';
        }
    };

    // Добавление текущей цитаты в избранное
    const addFavorite = () => {
        if (!currentQuote || !currentAuthor) {
            alert('Сначала получите цитату!');
            return;
        }
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        // Кодирование перед добавлением
        favorites.push({ content: encodeURIComponent(currentQuote), author: encodeURIComponent(currentAuthor) });
        saveFavorites(favorites);
        loadFavorites();
    };

    // Обработчики событий
    getQuoteButton.addEventListener('click', fetchQuote);
    addFavoriteButton.addEventListener('click', addFavorite);

    // Первоначальная загрузка избранных цитат
    loadFavorites();
});
