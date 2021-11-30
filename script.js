const form  = document.getElementById('form');
const search  = document.getElementById('search');
const result  = document.getElementById('result');
const more = document.getElementById('more')

const apiURL ='https://api.lyrics.ovh';
// const apiURL1 ='https://www.lyrics.com/lyric/';
// song search

async function searchingSong(searchValue){
    const searchResult = await fetch(`${apiURL}/suggest/${searchValue}`);
    const data = await searchResult.json();

    showData(data);
}

//  updating DOM

function showData(data){
    result.innerHTML = `
    <ul class="songs">
      ${data.data
        .map(
          song => `<li>
      <span><strong>${song.artist.name}</strong> - ${song.title}</span>
      <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
    </li>`
        )
        .join('')}
    </ul>
  `;

            if (data.prev || data.next) {
                more.innerHTML = `
                  ${
                    data.prev
                      ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>`
                      : ''
                  }
                  ${
                    data.next
                      ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>`
                      : ''
                  }
                `;
              } else {
                more.innerHTML = '';
              }

}

// Get prev and next songs
async function getMoreSongs(url) {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await res.json();
  
    showData(data);
}


// get lyrics

async function getLyrics(artist, songTitle){
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await res.json();

    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

    result.innerHTML = `<h2><strong>${artist}</strong> -${songTitle}</h2>
                        <span>${lyrics}</span>`;
                        more.innerHTML = '';
}

// add even listener in form

form.addEventListener('submit', e=>{
    e.preventDefault();

    const searchVal =search.value.trim();

    // checking search is empty or not

    if(!searchVal){
        alert('Please type in search box');
    }
    else{
        searchingSong(searchVal)
    }
});



// event listener in get lyrics button

result.addEventListener('click', e=>{
    const clickedEliment =e.target;

    // checking clicked button is 
    if(clickedEliment.tagName === 'BUTTON'){
        const artist = clickedEliment.getAttribute('data-artist');
        const songTitle = clickedEliment.getAttribute('data-songtitle');

        getLyrics(artist,songTitle);
    }
});
