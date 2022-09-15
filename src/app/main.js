// cards
const element = document.getElementById('cards')

const all_projects = [
    {
        picture: "https://google.com",
        desc: "Allo Maître d’Ho",
        date: "11 June 2022"
    },
    {
        picture: "https://google.com",
        desc: "unicityCoin",
        date: "11 June 2022"
    },
    {
        picture: "https://google.com",
        desc: "test",
        date: "11 June 2022"
    },
    {
        picture: "https://google.com",
        desc: "test",
        date: "11 June 2022"
    },
]

function card_template (picture, desc, date) {
    const value = `
    <div class="card">
        <div class="__front">
            <div class="img"></div>
            <p>${desc}</p>
        </div>
        <div class="__back">
            <p>
                Create at June 11.07.2022
            </p>
        </div>
    </div>
    `
    return value 
}


if (element)
    for (let index = 0; index < all_projects.length; index++) {
        const p = all_projects[index]
        element.innerHTML +=("beforebegin", card_template(p.picture, p.desc, p.date))
    }
