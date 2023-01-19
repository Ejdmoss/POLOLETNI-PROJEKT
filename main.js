let engine = Matter.Engine.create()
let sound = new Audio('img/kampan.mp3');
let shotsFired = 0;
sound.volume = 0.7;

/* Vytvářím hrací plochu s rozměry*/

let rederer = Matter.Render.create({
    element: document.body,
    engine: engine,
    options: {
        height: 830,
        width: 1920,
        wireframes: false,
    }
})

/* Vykresluji objeky na mapě jako zdi a další monumenty */

let ground = Matter.Bodies.rectangle(1100, 400, 250, 30, {
    isStatic: true,
    render: {
        fillStyle: '#444444'
    }
})

let ground2 = Matter.Bodies.rectangle(1350, 400, 30, 250, {
    isStatic: true,
    render: {
        fillStyle: '#444444'
    }
})

let ground3 = Matter.Bodies.rectangle(1750, 600, 250, 30, {
    isStatic: true,
    render: {
        fillStyle: '#444444'
    }
})

let ground4 = Matter.Bodies.rectangle(1200, 15, 250, 30, {
    isStatic: true,
    render: {
        fillStyle: '#444444'
    }
})

/* Generace těl postav/ koulí a následné  nastavení polohy */
let box = Matter.Bodies.rectangle(600, 200, 50, 50)

/* generace koulí do stylu pyramidy 10*8 koule */
let composite = Matter.Composites.pyramid(1000, 300, 10, 8, 0, 0, function (x, y) {
    return Matter.Bodies.rectangle(x, y, 20, 20, {
        render: {
            sprite: {
                texture: 'img/babis.png'
            }
        }
    })
})
/* generace koulí do stylu pyramidy 10*8 koule */
let composite2 = Matter.Composites.pyramid(1650, 485, 10, 8, 0, 0, function (x, y) {
    return Matter.Bodies.rectangle(x, y, 20, 20, {
        render: {
            sprite: {
                texture: 'img/babis.png'
            }
        }
    })
})

/* pozice hlavní koule */
let ball_pos = {
    x: 200,
    y: 350
}

/* přehaje zvuk jakmile je ball vytřelen + trackuje moje střely do 9*/

Matter.Events.on(engine, 'afterUpdate', function (event) {
    if (isFired) {
        sound.play();
        shotsFired++;
        if (shotsFired === 30) {
            Matter.Engine.clear(engine);
            alert("Vystřelil jsi 9 střel. Prohrál si.");
        }
    }
});

/* nastavení koule její polohy a styl */

let ball = Matter.Bodies.circle(ball_pos.x, ball_pos.y, 20, {
    render: {
        sprite: {
            texture: 'img/petr.png'
        }
    }
})
let sling = Matter.Constraint.create({
    pointA: {
        x: ball_pos.x,
        y: ball_pos.y
    },
    bodyB: ball,
    stiffness: 0.05
})

/* vygeneruje mi čáru za objektem kterým směrem mířím */
let mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: Matter.Mouse.create(rederer.canvas)
})
rederer.mouse = mouseConstraint

/*vygenerování všech vytvořených objektů */
Matter.World.add(engine.world, [ground, ground2, ground3, ground4, composite, composite2, ball, sling, mouseConstraint])

let isFired = false

Matter.Events.on(mouseConstraint, 'enddrag', function (event) {
    if (event.body === ball) {
        isFired = true
    }
})
/* hitboxy koulí podle matter.js a jejich funkce na padání */
Matter.Events.on(engine, 'afterUpdate', function (event) {
    let dist_x = Math.abs(ball.position.x - ball_pos.x)
    let dist_y = Math.abs(ball.position.y - ball_pos.y)
    if (isFired && dist_x < 20 && dist_y < 20) {
        ball = Matter.Bodies.circle(ball_pos.x, ball_pos.y, 20, {
            render: {
                sprite: {
                    texture: 'img/petr.png'
                }
            }
        })
        sling.bodyB = ball
        Matter.World.add(engine.world, ball)
        isFired = false
    }
})



/* aktivace a spuštění matter.js */
Matter.Render.run(rederer)
Matter.Runner.run(engine)