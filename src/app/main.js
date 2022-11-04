// cards
const parent_cards = document.getElementById('cards')

const all_projects = [
  {
    picture: "./picture/amh.webp",
    link: "https://allo-maitre-dho.fr/",
    desc: "Allo Maître d’Ho",
    date: "11 June 2022"
  },
  {
    picture: "http://sthd.clepopiplay.com/",
    link: "http://sthd.clepopiplay.com/",
    desc: "unicityCoin",
    date: "11 June 2022"
  },
  {
    picture: "./picture/amh.webp",
    desc: "test",
    date: "11 June 2022"
  },
  {
    picture: "./picture/amh.webp",
    desc: "test",
    date: "11 June 2022"
  },
]

const projet = `
  <div id="picture">
  </div>
  <div id="card">
  </div>
`
document.querySelector('#cards').innerHTML+=projet

const parent_picture = document.querySelector('#picture')
const parent_card = document.querySelector('#card')
let id = 0

function card_template (picture, desc, date) {
  const img = `
    <img id="${id}" class="__front img" src="${picture}">
  `
  const card = `
    <div class="__back">
      <div class="__text">    
        <p>${desc}</p>
        <p>Create at June 11.07.2022</p>
      </div>
    </div>
  `
  const i = id
  const value = {
    img, card, i
  }
  id++
  return value 
}

addEventListener('load', () => {
  console.log('load')
  for (let index = 0; index < all_projects.length; index++) {
    const p = all_projects[index]
    const res = card_template(p.picture, p.desc, p.date)
    const calc_res = 50*res.i
    const a = parent_picture.innerHTML +=("beforebegin", res.img)
    parent_card.innerHTML +=("beforebegin", res.card)
  }
  load()
})

function load() {
  let index = 0
  const a = document.querySelectorAll(`.__front.img`)
    a.forEach((e) => {
      const i = index
      e.addEventListener('mouseenter', function (event) {
        event.target.classList.add('__full')
        event.target.style.marginTop = (event.target.style.marginTop.split('px')[0])-50*i +"px"
        console.log(i)
      })
      e.addEventListener('mouseleave', function (event) {
        event.target.classList.remove('__full')
        event.target.style.marginTop = (event.target.style.marginTop.split('px')[0])+50*i +"px"
      })
      e.style.marginTop += 50*index +"px"
      index++
    })
}
