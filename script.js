const modal = document.getElementById('modal')
const modalShow = document.getElementById('show-modal')
const modalClose = document.getElementById('close-modal')
const bookmarkForm = document.getElementById('bookmark-form')
const websiteNameElem = document.getElementById('website-name')
const websiteURLElem = document.getElementById('website-URL')
const bookmarksContainer = document.getElementById('bookmarks-container')

let bookmarks = []

// Показываем форму с фокусом на поле ввода //
function showModal () {
    modal.classList.add('show-modal')
    websiteNameElem.focus()
}

modalShow.addEventListener('click', showModal)
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'))
window.addEventListener('click', e => (e.target === modal ? modal.classList.remove('show-modal') : false))

// Валидация формы //
function validate(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression)

    if (!nameValue || !urlValue) {
        alert('Пожалуйста, заполните значения для обоих полей')
        return false
    } 
    if(!urlValue.match(regex)) {
        alert('Пожалуйста, введите действительный адрес сайта')
        return false
    }
    return true
}

// Создаем DOM-элементы для закладки //
function buildBookmarks() {
    // Удаляем все закладки
    bookmarksContainer.textContent = ' '
    // Создаем DOM
    bookmarks.forEach(bookmark => {
        const { name, url } = bookmark
        // Контейнер
        const item = document.createElement('div')
        item.classList.add('item')
        // Закрывающая иконка
        const closeIcon = document.createElement('i')
        closeIcon.classList.add('fas', 'fa-times')
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`)
        // Значок сайта & Контейнер ссылки
        const linkInfo = document.createElement('div')
        linkInfo.classList.add('name')
        const favicon = document.createElement('img')
        // Получаем иконку сайта
        favicon.setAttribute('src', `http://s2.googleusercontent.com/s2/favicons?domain=${url}`)
        favicon.setAttribute('alt', 'Favicon')
        // Ссылка
        const link = document.createElement('a')
        link.setAttribute('href', `${url}`)
        link.setAttribute('target', '_blank')
        link.textContent = name
        // Добавляем в контейнер
        linkInfo.append(favicon, link)
        item.append(closeIcon, linkInfo)
        bookmarksContainer.appendChild(item)
    })
}

// Извлекаем закладки из LocalStorage //
function fetchBookmarks() {
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'))
    }
    buildBookmarks()
}

// Удаляем закладку //
function deleteBookmark(url) {
    bookmarks.forEach((bookmark, i) => {
        if (bookmark.url === url) {
            bookmarks.splice(i, 1)
        }
    })
    //Обновляем LocalStorage, перезаписываем DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    fetchBookmarks()
}

// Получаем данные из формы //
function getBookmark(e) {
    e.preventDefault()
    const nameValue = websiteNameElem.value.trim()
    let urlValue = websiteURLElem.value.trim()
    if (!urlValue.includes('http://', 'https://')) {
        urlValue = `https://${urlValue}`
    }
    if (!validate(nameValue, urlValue)) {
        return false
    }
    const bookmark = {
        name: nameValue,
        url: urlValue,
    }
    bookmarks.push(bookmark)
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    fetchBookmarks()
    bookmarkForm.reset()
    websiteNameElem.focus()
}

bookmarkForm.addEventListener('submit', getBookmark)

fetchBookmarks()