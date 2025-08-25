class Event {
    invisible() {
        game.player.invisible();
    }

    shoot(s) {
        if (game.pause === -1) {
            game.SHOOT = s;
            if (game.SHOOT && !game.player.shooting) {
                game.player.shoot()
            }
            game.player.shooting = s
        }
    }

    pause() {
        game.pause = -game.pause;

        let enterZone = $(`.enter-zone`);
        if (enterZone.css('animation-play-state') === 'paused') {
            enterZone.css('animation-play-state', 'running');
        } else {
            enterZone.css('animation-play-state', 'paused');
        }
    }

    sound() {
        if (game.volume)
            game.volume = 0;
        else
            game.volume = 1;
    }

    fontPlus() {
        let size = parseInt($('body').css('font-size'));
        size += 1;
        $('body').css('font-size', size + 'px');
    }

    fontMin() {
        let size = parseInt($('body').css('font-size'));
        size -= 1;
        $('body').css('font-size', size + 'px');
    }

    hideExcept(id) {
        $('#instructions').addClass('hide');
        $('#scoreForm').addClass('hide');
        $('#gameBoard').addClass('hide');
        $('#ranking').addClass('hide');

        $(id).removeClass('hide');
    }

    showCanvas(s) {
        if (s)
            $('canvas').removeClass('opacity-5');
        else
            $('canvas').addClass('opacity-5');
    }

    toggleShop() {
        this.pause();

        let shop = $('#shop');

        shop.toggleClass('active');
        shop.css({
            'animation-delay': shop.hasClass('active') ? 'initial' : '.4s',
            'transition-delay': shop.hasClass('active') ? 'initial' : '.4s'
        });
        $('#shop > div.menu.top').css('transition-delay', shop.hasClass('active') ? '.6s' : 'initial');

        game.shop.toggleMusic();

        if (!shop.hasClass('active')) {
            $('#shop .menu.bottom').removeClass('active');
            setTimeout(() => {
                game.player.shopMode = 'leaving';
                $('#zone_joystick').toggleClass('d-none');
            }, 700);
        } else {
            $('#zone_joystick').toggleClass('d-none');
        }
    }

    toggleEnterZone() {
        let enterZone = $('.enter-zone');

        if (enterZone.hasClass('active')) {
            enterZone.css('animation', 'none');
            setTimeout(() => {
                enterZone.removeClass('active')
            }, 40);
        } else {
            enterZone.addClass('active');
            enterZone.css('animation', '1s enterZoneAnimation infinite .4s');
        }
    }
}

let ev = new Event();

//  KeyDown Event

window.addEventListener('keydown', function (e) {
    let keycode = e.keyCode;

    switch (keycode) {
        case 32:
            ev.shoot(1);
            break;
        case 73:
            ev.invisible();
            break;
    }
});

//  KeyUp Event

window.addEventListener('keyup', function (e) {
    let keycode = e.keyCode;

    switch (keycode) {
        case 32:
            ev.shoot(0);
            break;
        case 80:
            ev.pause();
            break;
    }
});

//  Touch Function

if (/iP(hone|od|ad)/.test(navigator.platform)) {
    $(".game-control, #zone_joystick").css({"cursor": "pointer"});
}

$(document).on('touchstart', function (e) {
    e.preventDefault();
    if ($(e.target).hasClass('game-shoot')) {
        ev.shoot(1)
    } else if ($(e.target).hasClass('invisible-btn')) {
        ev.invisible()
    }
});


$(document).on('touchend', function (e) {
    if (game.player) {
        game.player.speedX = 0
        game.player.speedY = 0
        if ($(e.target).hasClass('game-shoot')) {
            ev.shoot(0)
        }
    }
});

function moveJoystick(data) {
    let zoneJoystick = document.getElementById('zone_joystick')

    if (data && data.position) {
        let gameControl = {
            left: $(zoneJoystick).offset().left,
            top: $(zoneJoystick).offset().top,
            width: $(zoneJoystick).width(),
            height: $(zoneJoystick).height(),
        };

        let touch = data.position

        let x = touch.x - gameControl.left;
        let y = touch.y - gameControl.top;

        let moveX = x - gameControl.width / 2;
        let moveY = y - gameControl.height / 2;

        if (canvas.offsetWidth > 1000) {
            moveX *= 5 / 3;
            moveY *= 5 / 3;
        }

        game.player.speedX = moveX / 6;
        game.player.speedY = moveY / 6;
    }
}

//  Button Trigger

$('.pause,.btn-close-settings').on('click', function () {
    $('.modal.setting').toggleClass('modal-hide');
    ev.pause();
});

$('#inputSound').on('click', function () {

    if ($(this).is(':checked'))
        localStorage.setItem('star-battle-audio', 1);
    else
        localStorage.setItem('star-battle-audio', 0);

    game.volume = parseInt(localStorage.getItem('star-battle-audio'));
});

if (parseInt(localStorage.getItem('star-battle-audio')) !== 0) {
    $('#inputSound').prop('checked', 1);
}

$('.sound').on('click', function () {
    ev.sound();
});

$('.exit-shop').on('click', function () {
    ev.toggleShop();
});

//  Score Form Submit

$('[name="name"]').keyup(function () {
    if ($(this).val())
        $('.continue-btn').prop('disabled', false);
    else
        $('.continue-btn').prop('disabled', true);
});

$('#scoreForm').submit(function (e) {
    e.preventDefault();

    let data = JSON.parse(localStorage.getItem('star-battle')) || []

    data.push({
        name: $('[name="name"]').val(),
        score: game.stats.score,
        time: game.stats.time,
    })

    localStorage.setItem('star-battle', JSON.stringify(data))

    $('[name="name"]').val('');
    $('.continue-btn').prop('disabled', true);

    data.sort(function (a, b) {
        return b.time - a.time;
    });
    data.sort(function (a, b) {
        return b.score - a.score;
    });

    $('.table-rank tbody').html('');

    let samePos = 0;

    for (let key in data) {
        let item = data[key];

        if (parseInt(key) > 0) {
            let prevItem = data[parseInt(key) - 1];
            if (prevItem.score === item.score && prevItem.time === item.time) {
                samePos++;
            } else {
                samePos = 0;
            }
        }

        $('.table-rank tbody').append('\n' +
            '        <tr>\n' +
            '          <td>' + (parseInt(key) + 1 - samePos) + '</td>\n' +
            '          <td>' + item.name + '</td>\n' +
            '          <td>' + item.score + '</td>\n' +
            '          <td>' + item.time + '</td>\n' +
            '        </tr>');
    }

    ev.hideExcept('#ranking');
});