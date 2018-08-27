// Инициализация VK
VK.init({
    apiId:6673051
});

function authVK() {
    return new Promise((resolve, reject) => {
        VK.Auth.login(data => {
            if (data.session) {
                resolve();
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 2);
    });
}

// Промис для выгрузки друзей
function callAPI (method, params) {
    params.v = '5.76';
    
    return new Promise((resolve, reject) => {
        VK.api(method, params, (data) => {
            if (data.error) {
                reject(data.error);
            } else {
                resolve(data.response);
            }
        });
    })
}

// Установка шаблона
var template = `
{{#each items}}
    <li class="zone-link" draggable="true">
        <img src="{{photo_200}}" class="zone-link-photo">
        <span class="zone-link-name">{{first_name}} {{last_name}}</span>
        <img src="img/add_icon.png" class="zone-link-add">
    </li>
{{/each}}
`;

var templateFn = Handlebars.compile(template);

new Promise(resolve => window.onload = resolve)
    .then(() => authVK())
    .then(() => callAPI('friends.get', {fields: 'photo_200'}))
    .then(response => {
        document.querySelector('.zone-list').innerHTML = templateFn(response);
    });

//------------drag and drop функция

//функция взятия области
function getCurrentZone(from) {
    do {
        if (from.classList.contains('mainblock-zone')) {
            return from;
        }
    } while (from = from.parentElement);

    return null;
}

let counter = 0;
let currentDrag;

document.addEventListener('dragstart', (e) => {
    const zone = getCurrentZone(e.target);

    if (zone) {
        currentDrag = { startZone: zone, node: e.target };
    }
});

document.addEventListener('dragover', (e) => {
    const zone = getCurrentZone(e.target);

    if (zone) {
        e.preventDefault();
    }
});

document.addEventListener('drop', (e) => {
    if (currentDrag) {
        const zone = getCurrentZone(e.target);

        e.preventDefault();

        if (zone && currentDrag.startZone !== zone) {
            if(e.target.classList.contains('zone-link')) {
                zone.insertBefore(currentDrag.node, e.target.nextElementSibling);
                currentDrag.node.addClassList('icon-rotate');
            } else {
                zone.insertBefore(currentDrag.node, zone.lastElementChild);
                currentDrag.node.classList.add('icon-rotate');
            }
        }
        currentDrag = null;
    }
});


const leftZone = document.querySelector('.left-zone');
const rightZone = document.querySelector('.right-zone');

leftZone.addEventListener('click', (e) => {
    if (e.target.getAttribute('class') === 'zone-link-add'){
        e.target.parentNode.classList.add('icon-rotate');
        rightZone.insertBefore(e.target.parentNode, rightZone.firstChild);
    }
});

rightZone.addEventListener('click', (e) => {
    if (e.target.getAttribute('class') === 'zone-link-add'){
        e.target.parentNode.classList.remove('icon-rotate');
        leftZone.insertBefore(e.target.parentNode, leftZone.firstChild);
    }
});