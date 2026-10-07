const inputSearch = document.getElementById('input-search');
const btnSearch = document.getElementById('btn-search');
const profileResult = document.querySelector('.profile-results');

const BASE_URL = 'https://api.github.com/';

const setTextContent = (element, value, fallback = '') => {
  element.textContent = value ?? fallback;
};

const showMessage = (message, type = 'info') => {
  profileResult.replaceChildren();

  const messageElement = document.createElement('p');
  messageElement.className = `profile-message ${type}`;
  messageElement.textContent = message;

  profileResult.append(messageElement);
};

const showProfile = (userData) => {
  const card = document.createElement('article');
  card.className = 'profile-card';
  card.innerHTML = `
    <img class="profile-avatar" alt="" loading="lazy">
    <div class="profile-info">
      <h2></h2>
      <p class="profile-login"></p>
      <p class="profile-bio"></p>
      <dl class="profile-stats">
        <div><dt>Repositórios</dt><dd></dd></div>
        <div><dt>Seguidores</dt><dd></dd></div>
        <div><dt>Seguindo</dt><dd></dd></div>
      </dl>
      <p class="profile-location"></p>
      <a class="profile-link" target="_blank" rel="noopener noreferrer">Ver perfil no GitHub</a>
    </div>
  `;

  const avatar = card.querySelector('.profile-avatar');
  const title = card.querySelector('h2');
  const login = card.querySelector('.profile-login');
  const bio = card.querySelector('.profile-bio');
  const stats = card.querySelectorAll('.profile-stats dd');
  const location = card.querySelector('.profile-location');
  const profileLink = card.querySelector('.profile-link');

  avatar.src = userData.avatar_url;
  avatar.alt = `Avatar de ${userData.login}`;
  setTextContent(title, userData.name || userData.login);
  setTextContent(login, `@${userData.login}`);
  setTextContent(bio, userData.bio || 'Este usuário não possui uma bio cadastrada.');
  stats[0].textContent = userData.public_repos;
  stats[1].textContent = userData.followers;
  stats[2].textContent = userData.following;
  location.textContent = userData.location ? `Localização: ${userData.location}` : '';
  profileLink.href = userData.html_url;

  profileResult.replaceChildren(card);
};

const searchUser = async () => {
  const username = inputSearch.value.trim();

  if (!username) {
    showMessage('Por favor, digite um nome de usuário do GitHub.', 'error');
    return;
  }

  try {
    btnSearch.disabled = true;
    showMessage('Carregando...');

    const response = await fetch(`${BASE_URL}users/${encodeURIComponent(username)}`);

    if (!response.ok) {
      showMessage(
        response.status === 403
          ? 'Limite de requisições da API atingido. Tente novamente mais tarde.'
          : 'Usuário não encontrado.',
        'error'
      );
      return;
    }

    const userData = await response.json();
    showProfile(userData);
  } catch (error) {
    console.error('Erro ao buscar o usuário:', error);
    showMessage('Ocorreu um erro ao buscar o usuário. Por favor, tente novamente mais tarde.', 'error');
  } finally {
    btnSearch.disabled = false;
  }
};

btnSearch.addEventListener('click', searchUser);

inputSearch.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchUser();
  }
});
