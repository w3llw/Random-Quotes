document.addEventListener('DOMContentLoaded', () => {
    const quoteBlock = document.getElementById('quote');
    const getQuoteButton = document.getElementById('newQuote');
    const addFavoriteButton = document.getElementById('addToFavorite');
    const favoritesList = document.getElementById('favorites_list');
    const noQuotesMessage = document.getElementById('noQuotesMessage');

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
                li.textContent = `"${favorite.content}" - ${favorite.author}`;
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Удалить';
                deleteButton.classList.add('bg-red-500', 'text-white', 'px-2', 'py-1', 'rounded', 'ml-2', 'hover:bg-red-700');
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
            const response = await fetch('https://api.quotable.io/random');
            const data = await response.json();
            currentQuote = data.content;
            currentAuthor = data.author;
            quoteBlock.innerHTML = `<p class="text-lg italic">"${currentQuote}"</p><p class="text-right mt-2">- ${currentAuthor}</p>`;
        } catch (error) {
            console.error('Error fetching quote:', error);
        }
    };

    // Добавление текущей цитаты в избранное
    const addFavorite = () => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites.push({ content: currentQuote, author: currentAuthor });
        saveFavorites(favorites);
        loadFavorites();
    };

    // Обработчики событий
    getQuoteButton.addEventListener('click', fetchQuote);
    addFavoriteButton.addEventListener('click', addFavorite);

    // Первоначальная загрузка избранных цитат
    loadFavorites();
});