import player1 from '../../media/assets/Player.png'
import player2 from '../../media/assets/Player2.png'
import player3 from '../../media/assets/Player3.png'

import ambient1 from '../../media/audio/ambient/ambient1.mp3'
import ambient2 from '../../media/audio/ambient/ambient2.mp3'
import ambient3 from '../../media/audio/ambient/ambient3.mp3'
import ambient4 from '../../media/audio/ambient/ambient4.mp3'
import ambient5 from '../../media/audio/ambient/ambient5.mp3'

import walk1 from '../../media/audio/sfx/walk/walk1.wav'
import walk2 from '../../media/audio/sfx/walk/walk2.wav'
import walk3 from '../../media/audio/sfx/walk/walk3.wav'

// ROOMS
import room01 from '../../media/rooms/room01.png'
import lever from '../../media/audio/lever.wav'

export const assets = {
    player: {
        player1: player1,
        player2: player2,
        player3: player3
    },
    rooms: {
        'room01': room01
    },
    ambient: {
        'ambient1': ambient1,
        'ambient2': ambient2,
        'ambient3': ambient3
    },
    sfxWalk: {
        'walk1': walk1,
        'walk2': walk2,
        'walk3': walk3
    },
    'lever': lever
}