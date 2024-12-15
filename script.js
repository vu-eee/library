const API_KEY = 'AIzaSyCxoFLYO4wsf6lxQC3Nx_V81XGlqBM3Ips'; // Replace with your API key
const ROOT_FOLDER_ID = '1-14QqqtyvPU7bzjy-EoGDBTLK5RtiYyd'; // Replace with your root folder ID

async function fetchFolderContents(folderId) {
  const endpoint = `https://www.googleapis.com/drive/v3/files`;
  const params = new URLSearchParams({
    key: API_KEY,
    q: `'${folderId}' in parents and trashed=false`,
    fields: 'files(id, name, mimeType, webViewLink, webContentLink)',
  });

  try {
    const response = await fetch(`${endpoint}?${params}`);
    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error('Error fetching folder contents:', error);
    return [];
  }
}

function createSpinner() {
  const spinner = document.createElement('div');
  spinner.className = 'spinner';
  return spinner;
}

async function toggleFolderContents(folderLi, folderId) {
  const sublist = folderLi.querySelector('ul');
  const spinner = folderLi.querySelector('.spinner');

  if (sublist) {
    sublist.style.display = sublist.style.display === 'none' ? 'block' : 'none';
    return;
  }

  const loadingSpinner = createSpinner();
  folderLi.appendChild(loadingSpinner);

  const contents = await fetchFolderContents(folderId);

  loadingSpinner.remove();

  const newSublist = document.createElement('ul');
  contents.forEach((item) => {
    const li = document.createElement('li');

    if (item.mimeType === 'application/vnd.google-apps.folder') {
      li.className = 'folder';
      li.innerHTML = `<span>${item.name}</span>`;
      li.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFolderContents(li, item.id);
      });
    } else {
      li.className = 'file';
      const link = document.createElement('a');
      link.href = item.webContentLink || item.webViewLink;
      link.target = '_blank';
      link.textContent = item.name;
      li.appendChild(link);
    }

    newSublist.appendChild(li);
  });

  folderLi.appendChild(newSublist);
}

async function init() {
  const fileList = document.getElementById('file-list');
  fileList.innerHTML = '<li>Loading...</li>';

  const contents = await fetchFolderContents(ROOT_FOLDER_ID);
  fileList.innerHTML = '';
  contents.forEach((item) => {
    const li = document.createElement('li');

    if (item.mimeType === 'application/vnd.google-apps.folder') {
      li.className = 'folder';
      li.innerHTML = `<span>${item.name}</span>`;
      li.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFolderContents(li, item.id);
      });
    } else {
      li.className = 'file';
      const link = document.createElement('a');
      link.href = item.webContentLink || item.webViewLink;
      link.target = '_blank';
      link.textContent = item.name;
      li.appendChild(link);
    }

    fileList.appendChild(li);
  });
}

init();
