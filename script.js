const form  = document.getElementById('form');
const search  = document.getElementById('search');
const result  = document.getElementById('result');

const apiURL ='https://api.lyrics.ovh';

// add even listener in form

form.addEventListener('submit', e=>{
    e.preventDefault();
    searchValue =search.value.trim();

    // checking search is empty or not

    if(!searchValue){
        alert('There is nothing to search');
    }
    else{
        searchingSong(searchValue)
    }
})

// song search

async function searchingSong(searchValue){
    const searchResult = await fetch(`${apiURL}/suggest/${searchValue}`);
    const data = await searchResult.json();

    showData(data);
}

//  updating DOM

function showData(data){
    result.innerHTML =`<ul class="song-list">
    ${data.data.map(song=> `<li>
                                <div>
                                    <strong>
                                    ${song.artist.name} 
                                    </strong> -${song.title}
                                </div>
                                <span data-artist ="${song.artist.name}" data-songtitle="${song.title}">
                                 get lyrics
                                </span>
                            </li>`   
                    ).join('')
        }
</ul>`
}

// event listener in get lyrics button

result.addEventListener('click', e=>{
    const clickedEliment =e.target;

    // checking clicked button is 
    if(clickedEliment.tagName === 'SPAN'){
        const artist = clickedEliment.getAttribute('data-artist');
        const songTitle = clickedEliment.getAttribute('data-songtitle');

        getLyrics(artist,songTitle);
    }
});

// get lyrics

async function getLyrics(artist, songTitle){
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await res.json();

    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

    result.innerHTML = `<h2><strong>
                            ${artist}
                            </strong> -${songTitle}
                        </h2>
                        <p>${lyrics}</p>`
}
