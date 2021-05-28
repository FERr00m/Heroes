window.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line strict
  'use strict';

  const select = document.getElementById('films'),
    btnShowAll = document.getElementById('show-all'),
    sectionCards = document.querySelector('.cards'),
    audio = document.getElementById('audio'),
    speaker = document.querySelector('.speaker');

  const getData = () => fetch('./dbHeroes.json');


  //spekerListener
  const spekerListener = () => {
    speaker.addEventListener('click', () => {
      audio.classList.toggle('audio-show');
    });
  };

  spekerListener();


  //card listener
  const cardListener = () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        const target = e.target;
        if (target.matches('.more, .back')) {
          target.closest('.card-wrapper').children[0].classList.toggle('card-content-active');
          target.closest('.card-wrapper').children[1].classList.toggle('card-list-active');
        }
      });
    });
  };


  // render
  const render = hero => {
    const { name, photo } = hero;
    const elementCard = document.createElement('div'),
      elementWrapper = document.createElement('div'),
      elementUl = document.createElement('ul'),
      elementCardList = document.createElement('div');

    elementCard.classList.add('card');
    elementCard.classList.add('animate__animated');
    elementCard.classList.add('animate__fadeIn');
    elementCard.classList.add('animate__delay-1s');
    elementWrapper.classList.add('card-wrapper');
    elementCardList.classList.add('card-list');

    elementWrapper.innerHTML = `
      <div class="card-content card-content-active">
        <img src="${photo}" alt="${name}" class="card-img">
        <h2 class="card-title">${name}</h2>
        <a href="#" class="more">more</a>
      </div>
    `;

    for (const key in hero) {
      const li = document.createElement('li');
      if (key === 'name' || key === 'photo') {
        continue;
      } else if (key === 'movies') {
        li.innerHTML = `<span class="key-title">${key.toLocaleUpperCase()}:</span> ${hero[key].join(', ')}`;
      } else {
        li.innerHTML = `<span class="key-title">${key.toLocaleUpperCase()}:</span> ${hero[key]}`;
      }
      elementUl.insertAdjacentElement('beforeend', li);
    }

    elementCardList.insertAdjacentElement('afterbegin', elementUl);
    elementCardList.insertAdjacentHTML('beforeend', `<a href="#" class="back">back</a>`);
    elementWrapper.insertAdjacentElement('beforeend', elementCardList);

    elementCard.insertAdjacentElement('afterbegin', elementWrapper);
    sectionCards.insertAdjacentElement('afterbegin', elementCard);

  };


  //make options in select
  const makeOptions = () => {
    getData()
      .then(response => {
        if (response.status !== 200) {
          throw new Error('status Network NOT 200');
        }
        return (response.json());
      })
      .then(data => {
        const movies = new Set();

        data.forEach(element => {
          if (element.movies === undefined) {
            return;
          } else {
            element.movies.forEach(movie => {
              movies.add(movie.trim());
            });
          }
        });
        [...movies].sort().forEach(movie => {
          select.insertAdjacentHTML('beforeend', `
          <option value="${movie}">${movie}</option>
          `);
        });
      })
      .catch(error => console.error(error));
  };

  makeOptions();


  //show all
  const showAll = () => {
    btnShowAll.addEventListener('click', () => {
      getData()
        .then(response => {
          if (response.status !== 200) {
            throw new Error('status Network NOT 200');
          }
          return (response.json());
        })
        .then(data => {
          sectionCards.innerHTML = '';
          data.forEach(element => {
            render(element);
          });
          cardListener();
        })
        .catch(error => console.error(error));
    });
  };

  showAll();


  //showSelect
  const showSelect = () => {
    select.addEventListener('change', () => {
      getData()
        .then(response => {
          if (response.status !== 200) {
            throw new Error('status Network NOT 200');
          }
          return (response.json());
        })
        .then(data => {
          sectionCards.innerHTML = '';
          data.forEach(hero => {
            if (hero.movies === undefined) {
              return;
            } else {
              hero.movies.forEach(movie => {
                if (movie === select.value) {
                  render(hero);
                }
              });
            }
          });

          cardListener();
        })
        .catch(error => console.error(error));
    });
  };

  showSelect();
});
