const signup = {
    name: 'Simon',
    email: 'email',
    business: 'business',

    init: () => {
        signup.getName();
    },

    getName: () => {
        $('#signupFormPrompt').text('What Is Your Full Name?');
        $('#signupFormInput').val(signup.name ? signup.name : '');
        $('#signupNext').attr({
            onclick: 'signup.setName()'
        })
        $('#signupPrev').css('display', 'none');
    },

    setName: () => {
        signup.name = $('#signupFormInput').val();
        signup.getEmail();
    },

    getEmail: () => {
        $('#signupFormPrompt').text('Please provide an email address.');
        $('#signupFormInput').val(signup.email ? signup.email : '');
        $('#signupNext').attr({
            onclick: 'signup.setEmail()'
        })
        $('#signupPrev').css('display', 'inline-block').attr({
            onclick: 'signup.getName();'
        });
    },

    setEmail: () => {
        signup.email = $('#signupFormInput').val();
        signup.getBusiness();
    },

    getBusiness: () => {
        $('#signupFormPrompt').text('Please provide your business name, the way you\'d like it to appear on your guests end.');
        $('#signupFormInput').val(signup.business ? signup.business : '');

        $('#signupNext').attr({
            onclick: 'signup.setBusiness()'
        })
        $('#signupPrev').css('display', 'inline-block').attr({
            onclick: 'signup.getEmail();'
        });
    },

    setBusiness: () => {
        signup.business = $('#signupFormInput').val();
        signup.doSignup();
    },

    doSignup: () => {
        console.log(`${signup.name} ${signup.email} ${signup.business}`);

        $.ajax({
            url: '/user/signup',
            data: {
                name: signup.name,
                email: signup.email,
                business: signup.business
            },
            type: 'POST',
            dataType: 'JSON',
            success: function(response) {
                console.log(response)
            },
            error: function(response) {
                console.log(response);
            }
        });

    }
}