const inputSearch = document.getElementById('input-search');
const btnSearch = document.getElementById('btn-search');
const profileResult = document.querySelector('.profile-results');

const BASE_URL = 'https://api.github.com/';

const showMessage = (message, type = 'info') => {
  const color = type === 'error' ? '#d93025' : '#1a73e8';
  profileResult.innerHTML = `<p class="profile-message" style="color: ${color};">${message}</p>`;
};

const showProfile = (userData) => {
  profileResult.innerHTML = `
    <div class="profile-card">
      <img src="${userData.avatar_url}" alt="Avatar de ${userData.login}" class="profile-avatar">
      <div class="profile-info">
        <h2>${userData.name || userData.login}</h2>
        <p>${userData.bio || 'Não possui bio cadastrada 😢'}</p>
        <a href="${userData.html_url}" target="_blank" rel="noreferrer">Ver perfil no GitHub</a>
      </div>
    </div>`;
};

const searchUser = async () => {
  const username = inputSearch.value.trim();

  if (!username) {
    showMessage('Por favor, digite um nome de usuário do GitHub.', 'error');
    return;
  }

  try {
    profileResult.innerHTML = '<p class="profile-message">Carregando...</p>';
    const response = await fetch(`${BASE_URL}users/${username}`);

    if (!response.ok) {
      showMessage('Usuário não encontrado.', 'error');
      return;
    }

    const userData = await response.json();
    showProfile(userData);
  } catch (error) {
    console.error('Erro ao buscar o usuário:', error);
    showMessage('Ocorreu um erro ao buscar o usuário. Por favor, tente novamente mais tarde.', 'error');
  }
};

btnSearch.addEventListener('click', searchUser);

inputSearch.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    searchUser();
  }
});
