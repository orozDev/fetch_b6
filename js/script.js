const loadSelectOptions = async (url, select,  name) => {
    const res = await fetch(url)

    if (res.status === 200) {
        const data = await res.json()
        for (const item of data['results']) {
            const option = document.createElement('option')
            option.value = item.id
            option.innerText = item.name
            select.appendChild(option)
        }
    } else {
        alert(`Cannot get ${name}`)
    }
}

const displayNews = async () => {
    const response = await fetch('https://orozking.pythonanywhere.com/api/v1/news/')
    if (response.status !== 200) throw new Error('Error at getting news')
    const news = await response.json()

    const newsContainer = document.querySelector('#news_container')

    newsContainer.innerHTML = ''


    for (const item of news['results']) {
        newsContainer.innerHTML += `
            <div class="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                <div class="card h-100">
                  <img src="${item.image}" class="card-img-top" alt="...">
                  <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">${item.description}</p>
                    <a href="#" class="btn btn-primary">Go somewhere</a>
                  </div>
                </div>
            </div>
        `
    }
}

const launchCreateNewsListener = async () => {
    const createNewsForm = document.forms.createNewsForm


    createNewsForm.addEventListener('submit', async (e) => {
        e.preventDefault()

        const selectedTags = Array.from(createNewsForm.tags.options).filter((option) => option.selected).map(i => +i.value)

        // const body = new FormData()
        //
        // body.append('name', createNewsForm.name.value)
        // body.append('image', createNewsForm.image.files[0])
        // body.append('description', createNewsForm.description.value)
        // body.append('content', createNewsForm.content.value)
        // body.append('category', createNewsForm.category.value)
        // body.append('is_published', String(createNewsForm.name.checked))
        // for (const tag of selectedTags) body.append('tags', tag)

        const body = new FormData(createNewsForm)



        const res = await fetch('https://orozking.pythonanywhere.com/api/v1/news/', {
            method: 'POST',
            headers: {
                Authorization: 'Token b44d3d3a5b689c7c4f00585bfb3ec66269438e51'
            },
            body,
        })

        console.log(res)

        if (res.status === 201) {

            const createNewsModelWin = new bootstrap.Modal(document.querySelector('#newsCreateModal'))
            createNewsModelWin.hide()

            await displayNews()

        } else {
            alert('Error at creating news')
        }

    })
}


async function launch() {

    const categorySelect = document.querySelector('#categorySelect')
    const tagsSelect = document.querySelector('#tagsSelect')

    await loadSelectOptions(
        'https://orozking.pythonanywhere.com/api/v1/categories/',
        categorySelect,
        'categories',
    )

    await loadSelectOptions(
        'https://orozking.pythonanywhere.com/api/v1/tags/',
        tagsSelect,
        'tags',
    )

    await displayNews()

    await launchCreateNewsListener()


}

launch()

