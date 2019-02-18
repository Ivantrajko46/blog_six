// var posts = [];
// let postsToJsonGlobal = JSON.parse(localStorage.posts);

// events on append elements must be outside jquery ready function.
// delete post 
function deletePost(postId) {
    // Proci kroz niz, naci post sa prosledjenim ID-jem i ukloniti ga iz liste
    let posts = JSON.parse(localStorage.getItem("posts"));
    localStorage.removeItem("posts");
    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id == postId) {
            posts.splice(i, 1);
            localStorage.setItem("posts", JSON.stringify(posts));
            $('#' + postId).remove(); // add id attr to dom same as id of object
            $('#preview').hide();
        }
    }
}
// edit post
function editPost(postId) {
    // Otvaramo edit formu koja je popunjena podacima iz prosledjnog post objekta
    let posts = JSON.parse(localStorage.getItem("posts"));
    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id === postId) {
            // open post with data in form fields
            $('#headline').val(posts[i].headline);
            $('#description').val(posts[i].description);
            $('#text').val(posts[i].text);
            $('#author').val(posts[i].author);
            // input type file value
            $('#image').val('');

            $('#preview').attr('src', `data:image/png;base64, ${posts[i].image}`);
            $('#post-id').attr('data-post-id', postId);

            $('.posts, .first, .sorting, #submit').hide();
            $('.post-form, .second, #save, #preview').show();

        }
    }
}
// make input type file load image, make preview and get base64
function previewFile() {
    var preview = document.querySelector('#preview');
    var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();

    reader.addEventListener("load", function() {
        preview.src = reader.result;
        preview.style.display = 'block';
        let base64 = reader.result.split(',')[1];
        // put base64 in input post-id attribute and than call it in addPost()
        $('#post-id').attr('data-base-64', base64);


    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}
// Preview click on post headline 
function previewClick(postId) {
    let posts = JSON.parse(localStorage.getItem("posts"));
    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id == postId) {
            $('#post-headline1').html(posts[i].headline);
            $('#post-text-paragraph1').html(posts[i].text);
            $('#author1').html(posts[i].author);
            $('#post-image1').attr('src', `data:image/png;base64, ${posts[i].image}`);
        }
    }
    $('.first, .posts, .sorting').hide();
    $('.third, .preview').show();
}
// function search posts
function searchPosts() {
    let input = $('#search-input');
    let filter = input.val().toLowerCase();
    let headline = $('.post h3');
    let textValue;

    for (let i = 0; i < headline.length; i++) {
        textValue = $(headline[i]).html().toLowerCase();

        if (textValue.indexOf(filter) > -1) {
            $(headline[i]).parents().eq(2).show();

        } else {
            $(headline[i]).parents().eq(2).hide();
        }
    }
}
// add post
function addPost(validate) {
    let currentPosts = [];
    if (JSON.parse(localStorage.getItem("posts")) != undefined) {
        currentPosts = JSON.parse(localStorage.getItem("posts"));
    }
    let date = new Date();
    let time = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${(date.getMinutes()<10?'0':'') + date.getMinutes()}`;

    let validation = validatePost();
    if (validation == validate) {
        location.href = "index.html";

        let post = {
            id: Math.floor(Math.random() * 90000) + 10000,
            headline: $('#headline').val(),
            description: $('#description').val(),
            text: $('#text').val(),
            // base64 in input post-id attr data-base-64
            image: $('#post-id').attr('data-base-64'),
            author: $('#author').val(),
            date: time
        };
        localStorage.removeItem("posts");
        currentPosts.push(post);
        localStorage.setItem("posts", JSON.stringify(currentPosts));
        renderPost();

    } else if (validation === 'empty') {
        $('#toast-error-1').slideDown(400).delay(3000).fadeOut(400);
    }
}
//render post
function renderPost() {
    let posts = JSON.parse(localStorage.getItem("posts"));
    $('#append-posts *').remove();
    // go to page
    for (let i = 0; i < posts.length; i++) {
        $('#append-posts').append(`
        <div class="col-sm-6 col-md-6 col-lg-6 col-xl-4 post" id="${posts[i].id}">
          <div class="post-data">
            <div class="col-6 post-image">
              <img id="post-image" src="data:image/png;base64, ${posts[i].image}" alt="post-image" style="width:100%;">
            </div>
            <div class="col-6 post-text">
               <h3 id="post-headline" onclick="previewClick(${posts[i].id})">${posts[i].headline}</h3>
               <p>By : <i>${posts[i].author}</i></p>
               <p id="post-description">${posts[i].description}</p>
               <i class="far fa-edit"></i><a id="post-edit" onclick="editPost(${posts[i].id})">edit</a>
               <i class="far fa-trash-alt"></i><a id="post-delete" onclick="deletePost(${posts[i].id})">delete</a>
               <p id="post-date"><i>${posts[i].date}</i></p>
            </div>
          </div>
        </div>
    `);
    }
}
// validate post
function validatePost() {

    if ($('#headline').val().length === 0 || $('#description').val().length === 0 || $('textarea').val().length === 0 || $('#author').val().length === 0 || $('#image').val().length === 0) {
        return "empty";
    } else {
        return true;
    }
}
// check and render
function checkAndRender() {
    let posts = [];
    if (JSON.parse(localStorage.getItem("posts")) != undefined) {
        posts = JSON.parse(localStorage.getItem("posts"));
    }
    if (posts.length > 0) {
        renderPost();
    }
}

//___________________________________________________________________________

$(document).ready(function(){

    // hide save button for edit
    $('#save').hide();
    // show/hide search field
    $('.fa-search').on('click', () => {
        $('#search-input').slideToggle(600);
    });
    // show post form and hide other content
    $('#nav-to-form').on('click', () => {
        $('.posts, .first, .sorting').hide();
        $('.post-form, .second').show();
    });
    // save form on edit
    $('#save').on('click', e => {
        e.preventDefault();
        let postIdInput = $('#post-id').attr('data-post-id');
        let posts = JSON.parse(localStorage.getItem("posts"));
        localStorage.removeItem("posts");
        let date = new Date();
        let time = `edited on: ${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${(date.getMinutes()<10?'0':'') + date.getMinutes()}`;
        // save input values on save
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].id == postIdInput) {
                let post = posts[i];
                post.id = parseInt(postIdInput);
                post.headline = $('#headline').val();
                post.description = $('#description').val();
                post.text = $('#text').val();
                // base64 in input post-id attr data-base-64
                // problem was here
                post.image = $('#image').val() == 0 ? post.image : $('#post-id').attr('data-base-64'); 
                post.author = $('#author').val();
                post.date = time;
                //set to local storage
                localStorage.setItem("posts", JSON.stringify(posts));
                renderPost();

                $('#my-form').find('input[type="text"], textarea, input[type="file"]').val('');
                $('.post-form, .second, #save, #preview').hide();
                $('.posts, .first, .sorting, #submit').show();
            }
        }
    });
    // submit post on button (validate, add, render)
    $('#my-form').on('submit', e => {
        e.preventDefault();
        addPost(true);

        $('#my-form').find('input[type="text"], textarea, input[type="file"]').val('');
        $('#preview').hide();
    });
    // sort by headline
    $('#by-headline').on('click', () => {
        $('#by-headline i').toggleClass('rotate');
        let posts = JSON.parse(localStorage.getItem("posts"));
        let icon = $('#by-headline i').hasClass('rotate');
        // sort function
        posts.sort(function(a, b) {
            let nameA = a.headline.toUpperCase(); // ignore upper and lowercase
            let nameB = b.headline.toUpperCase(); // ignore upper and lowercase
            if (!icon) {
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            
            }else if (icon) {
                if (nameA < nameB) {
                    return 1;
                }
                if (nameA > nameB) {
                    return -1;
                }
                return 0;
            }
        });
        //set to local storage
        localStorage.removeItem("posts");
        localStorage.setItem("posts", JSON.stringify(posts));
        renderPost();
    });
    // sort by author
    $('#by-author').on('click', () => {
        $('#by-author i').toggleClass('rotate');
        let posts = JSON.parse(localStorage.getItem("posts"));
        let icon = $('#by-author i').hasClass('rotate');
        //sort function
        posts.sort(function(a, b) {
            let nameA = a.author.toUpperCase(); // ignore upper and lowercase
            let nameB = b.author.toUpperCase(); // ignore upper and lowercase
            if (!icon) {
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            
            }else if (icon) {
                if (nameA < nameB) {
                    return 1;
                }
                if (nameA > nameB) {
                    return -1;
                }
                return 0;
            }
        });
        localStorage.removeItem("posts");
        localStorage.setItem("posts", JSON.stringify(posts));
        renderPost();
    });
    // sort by date
    $('#by-date').on('click', (e) => {
        $('#by-date i').toggleClass('rotate');
        let posts = JSON.parse(localStorage.getItem("posts"));
        let icon = $('#by-date i').hasClass('rotate');
        // sort function
        posts.sort(function compare(a, b) {
            if (!icon) {
                return new Date(a.date) - new Date(b.date);

            } else if (icon) {

                return new Date(b.date) - new Date(a.date);
            }
        });
        // set to local storage
        localStorage.removeItem("posts");
        localStorage.setItem("posts", JSON.stringify(posts));
        renderPost();
    });
    // check if local storage is empty or not and render
    checkAndRender();

});