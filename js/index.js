document.getElementById('github-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const searchValue = document.getElementById('search').value.trim();
  if (searchValue === '') return;

  // Clear previous search results
  document.getElementById('user-list').innerHTML = '';
  document.getElementById('repos-list').innerHTML = '';

  // GitHub API endpoints
  const userSearchEndpoint = `https://api.github.com/search/users?q=${searchValue}`;
  const userReposEndpoint = `https://api.github.com/users/${searchValue}/repos`;

  // Fetch user search results
  fetch(userSearchEndpoint)
    .then(response => response.json())
    .then(data => {
      data.items.forEach(user => {
        const li = document.createElement('li');
        const username = document.createTextNode(user.login);
        const avatar = document.createElement('img');
        avatar.src = user.avatar_url;
        const profileLink = document.createElement('a');
        profileLink.href = user.html_url;
        profileLink.appendChild(document.createTextNode('Profile'));
        profileLink.target = '_blank';
        li.appendChild(username);
        li.appendChild(avatar);
        li.appendChild(profileLink);
        document.getElementById('user-list').appendChild(li);

        // Click event to fetch user repositories
        li.addEventListener('click', function () {
          fetch(userReposEndpoint)
            .then(response => response.json())
            .then(repos => {
              document.getElementById('repos-list').innerHTML = '';
              repos.forEach(repo => {
                const repoLi = document.createElement('li');
                const repoName = document.createTextNode(repo.name);
                repoLi.appendChild(repoName);
                document.getElementById('repos-list').appendChild(repoLi);
              });
            })
            .catch(error => console.error('Error fetching user repositories:', error));
        });
      });
    })
    .catch(error => console.error('Error fetching user search results:', error));
});
