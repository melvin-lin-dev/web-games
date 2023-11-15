function sound(name, soundType = 'effect') {
    let soundName;
    let tone = null;
    let audio = {
        loop: false
    };

    switch (name) {
        case 'title':
            soundName = 'title';

            audio.loop = true;
            break;
        case 'light-trail':
            lightTrail.pitch.value = lightTrail.pitch.default;

            tone = {
                type: 'lightTrail',
                buffer: lightTrail.sound,
                pitch: lightTrail.pitch.value,
                loop: true
            };
            break;
        case 'start':
            soundName = 'chant3';
            break;
        case 'rolling':
            soundName = 'rolling';
            break;
        case 'shoot':
            soundName = 'fireball1';
            break;
        case 'shoot-collide':
            soundName = 'ballclick1';
            break;
        case 'ball-collide':
            soundName = 'ballclick2';
            break;
        case 'warning':
            soundName = 'warning1';
            break;
        case 'break':
            let currentScoreMultiplier = scoreMultiplier;

            tone = {
                type: 'break',
                buffer: breakSound,
                pitch: currentScoreMultiplier * 2
            };
            soundName = 'ballsdestroyed' + (currentScoreMultiplier - 1 > 5 ? 5 : currentScoreMultiplier - 1);
            break;
    }

    if (tone) {
        let currentTone = toneSound[tone.type];

        currentTone.pitchShift.pitch = tone.pitch;

        currentTone.tone = new Tone.Player(tone.buffer).start(0);
        currentTone.tone.loop = tone.loop;
        currentTone.tone.connect(currentTone.pitchShift);
    }

    if (!tone || scoreMultiplier > 1) {
        let sound = new Audio(`assets/sounds/${soundType}/${soundName}.${soundType === 'effect' ? 'ogg' : 'mp3'}`);

        if (audio.loop) {
            backgroundMusic = sound;
            sound.loop = audio.loop;
        }

        sound.play();
        sound.remove();
    }
}
