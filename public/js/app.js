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
        $('#signupFormPrompt').text('Business name, the way you\'d like it to appear on your guests\' end');
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
            url: '/business/signup',
            data: {
                name: signup.name,
                email: signup.email,
                business: signup.business
            },
            type: 'POST',
            dataType: 'JSON',
            success: function(response) {
                if (response.user) {
                    window.location.href = `/business/${response.businessUri}?id=${response.id}`;
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
    businessId: null,

    init: (businessUri) => {
        storeFront.getStoreFrontDetails(businessUri);

        // attach event handlers
        $('#addParty').on('click', storeFront.toggleModal);
        $('#closeModal').on('click', storeFront.toggleModal);
        $('#addPartyButton').on('click', storeFront.submitParty);
    },

    getStoreFrontDetails: (businessUri, businessId) => {
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

                    // set business id
                    storeFront.businessId = response.results[0].id;

                    // fetch active parties
                    storeFront.getActiveParties();

                } else {
                    // error handling
                }
            },
            error: function(response) {
                console.log(response);
            }
        });
    },

    getActiveParties: () => {
        $.ajax({
            url: '/party/allByBusinessId',
            data: {
                businessId: storeFront.businessId
            },
            type: 'POST',
            dataType: 'JSON',
            success: function(response) {
                if (response.parties.length) {
                    //build the parties
                    storeFront.buildParties(response.parties);
                } else {
                    // no parties, build the message
                    storeFront.noPartiesMessage();
                }
            },
            error: function(response) {
                console.log(response);
            }
        });
    },

    noPartiesMessage: () => {
        const queue = $('#queueContainer');
        const row = $('<div>').addClass('row one-party text-center').attr({
            id: 'queuePlaceholder'
        });
        const p1 = $('<p>').text('Secure your spot');
        const p2 = $('<p>').text('at the front of the line!');

        $(row).append(p1, p2);
        $(queue).append(row);
    },

    togglePartyActive: (partyIndex) => {
        const partyEle = $('#party' + partyIndex);

        if (Number(partyEle.attr('active'))) {
            partyEle.removeClass('active-party').attr({
                active: 0
            });

            $('#party' + partyIndex + ' .modifiers').slideUp('fast');
        } else {
            partyEle.addClass('active-party').attr({
                active: 1
            });

            $('#party' + partyIndex + ' .modifiers').slideDown('fast');
        }
    },

    buildOneParty: (party, index) => {
        const queue = $('#queueContainer');
        const row = $('<div>').addClass('row one-party text-start').on('click', () => {
            storeFront.togglePartyActive(index);
        }).attr({
            active: 0,
            id: `party${index}`
        });
        const num = $('<p>').addClass('queue-num').text(index + 1);
        const name = $('<p>').addClass('name').text(`${party.name}`);
        const partySize = $('<p>').addClass('party').text(`party: ${party.party_size}`);
        const modifiers = $('<div>').addClass('modifiers');
        const text = $('<i>').addClass('fa fa-comment').on('click', (index) => {
            event.stopPropagation(index);

            
        });
        const remove = $('<i>').addClass('fa fa-times-circle', () => {
            event.stopPropagation(index);
        });

        $(modifiers).append(text, remove);
        $(row).append(num, name, partySize, modifiers);
        $(queue).append(row);
    },

    buildParties: (parties, forceIndex=false) => {
        const queue = $('#queueContainer').empty();

        parties.forEach((party, index) => {
            storeFront.buildOneParty(party, index);
        })
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
    },

    submitParty: () => {
        const name = $('#name').val();
        const partySize = $('#size').val();
        $.ajax({
            url: '/party/add',
            data: {
                name: name,
                phone: $('#phone').val(),
                partySize: partySize,
                businessId: storeFront.businessId
            },
            type: 'POST',
            dataType: 'JSON',
            success: function(response) {
                if (response.added) {
                    $('#queuePlaceholder').remove();

                    storeFront.toggleModal();
                    storeFront.buildOneParty({
                        name,
                        party_size: partySize
                    }, $('#queueContainer').children().length);
                } else {
                    // error handling
                }
            },
            error: function(response) {
                console.log(response);
            }
        });
    },


}