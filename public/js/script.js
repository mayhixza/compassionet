// let delBtn = document.getElementsByClassName('button.del-btn')
// let cancelDel = document.querySelector('a.cancel')

let post = document.querySelector('a.yes');
let cancelNewPost = document.querySelector('a.cancel');
let confirmPost = document.querySelector('button.post');
let profileImg = document.querySelector('img.profile-img');

post.onclick = display = () => {
    let postPrompt = document.querySelector('div.prompt');
    let bgcolor = document.querySelector('div.bgcolor')    
    bgcolor.classList.toggle('hide');
    postPrompt.classList.toggle('hide');
}

cancelNewPost.onclick = display = () => {
    let postPrompt = document.querySelector('div.prompt');
    let bgcolor = document.querySelector('div.bgcolor')    
    bgcolor.classList.toggle('hide');
    postPrompt.classList.toggle('hide');
}

confirmPost.onclick = display = () => {
    let postPrompt = document.querySelector('div.prompt');
    let bgcolor = document.querySelector('div.bgcolor')    
    bgcolor.classList.toggle('hide');
    postPrompt.classList.toggle('hide');
}

profileImg.onclick = display = () => {
    let wrap = document.querySelector('div.wrap');
    wrap.classList.toggle('hide');
}

// const btn = document.querySelector('button.color');
// const showBtn = document.querySelector('p.showtext');
// const mode = document.querySelector('button.mode');

// delBtn.onclick = display = () => {
//     let delPrompt = document.querySelector('div.confirm-del');
//     delPrompt.classList.toggle('hide');
// }

// cancelDel.onclick = display = () => {
//     let delPrompt = document.querySelector('div.confirm-del');
//     delPrompt.classList.toggle('hide')
// }