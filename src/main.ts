import './style.css'


const textarea_value = `ex: "Bonjour,

Je suis le propriétaire d'une entreprise de boulangerie et je souhaiterais créer un site internet pour promouvoir mes produits et offrir à mes clients la possibilité de passer des commandes en ligne. Le site devrait présenter mon entreprise, mes produits et leurs ingrédients, ainsi que des informations sur ma boutique et mes horaires d'ouverture.

Je souhaiterais également ajouter une section "blog" où je pourrais publier des recettes et des actualités liées à mon entreprise. Enfin, j'aimerais que le site soit adapté aux appareils mobiles pour que mes clients puissent facilement y accéder depuis leurs smartphones ou tablettes.

Pouvez-vous me dire si vous êtes en mesure de réaliser ce projet et quels seraient les coûts et délais associés ? Je vous remercie d'avance pour votre réponse.

Cordialement,
[Votre nom]"
`

const textarea = document.querySelector('textarea') as HTMLTextAreaElement
textarea.placeholder = textarea_value

const updateTextareaHeight = () => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
};

textarea.addEventListener('input', updateTextareaHeight);
textarea.addEventListener('change', updateTextareaHeight);

updateTextareaHeight();
