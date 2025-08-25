class Equipment{
    constructor(){
        this.stats = {
            bullet: {
                1: {
                    speed: 16,
                    power: 10,
                },
                2: {
                    speed: 7,
                    power: 30,
                }
            },
            exhaust: {
                1: {
                    speed: 1
                },
                2: {
                    speed: 1.2
                }
            }
        };

        this.maxStats = {
            bullet: {
                speed: 20,
                power: 50
            },
            exhaust: {
                speed: 2
            }
        }
    }
}