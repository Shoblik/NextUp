const signup = {
    name: 'Simon Hoblik',
    email: 'shoblik@yahoo.com',
    business: 'Ocelot Enclosure',

    init: () => {
        signup.getName();
    },

    getName: () => {
        $('#signupFormPrompt').text('Full Name');
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
        $('#signupFormPrompt').text('Email');
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
        $('#signupFormPrompt').text('Business name, the way you\'d like it to appear on your guests\' end.');
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
                if (response.user) {
                    window.location.href = `/business/${response.businessUri}`;
                } else {
                    // error handling
                }
                console.log(response)
            },
            error: function(response) {
                console.log(response);
            }
        });

    }
}

var storeFront = {
    modalShowing: false,

    init: (businessUri) => {
        $.ajax({
            url: '/business/details',
            data: {
                businessUri: businessUri
            },
            type: 'POST',
            dataType: 'JSON',
            success: function(response) {
                if (response.results.length) {
                    //create the store front
                    storeFront.buildStoreFront(response.results[0]);
                } else {
                    // error handling
                }
            },
            error: function(response) {
                console.log(response);
            }
        });

        // attach event handlers
        $('#addParty').on('click', storeFront.toggleModal);
        $('#closeModal').on('click', storeFront.toggleModal);
    },

    buildStoreFront: (business) => {
        $('#storeName').text(business.business);
    },

    toggleModal: () => {
        if (storeFront.modalShowing) {
            $('#addModal').css('transform', 'translateX(-100%)');
            storeFront.modalShowing = false;
        } else {
            $('#addModal').css('transform', 'none');
            storeFront.modalShowing = true;
        }
    }
}