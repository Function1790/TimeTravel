const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

//[----------------<Vector>----------------]
class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    add(vec) {
        this.x += vec.x
        this.y += vec.y
    }
}

function distanceSquare(vec1, vec2) {
    return (vec1.x - vec2.x) ** 2 + (vec1.y - vec2.y) ** 2
}

//[----------------<Canvas>----------------]
const PI2 = 2 * Math.PI
function fillCircle(vec, radius) {
    ctx.beginPath()
    ctx.arc(vec.x, vec.y, radius, 0, PI2)
    ctx.fill()
    ctx.closePath()
}

//[----------------<Atom>----------------]
function operateCrashWall(axis, vel_axis) {
    if (axis < 0){
        vel_axis *= -1
        return
    }
    if (axis > canvas.width){
        vel_axis *= -1
        return
    }
}

class Atom {
    constructor(pos, vel, mass) {
        this.pos = new Vector(pos[0], pos[1])
        this.vel = new Vector(vel[0], vel[1])
        this.mass = mass
    }
    get x() { return this.pos.x }
    get y() { return this.pos.y }
    draw() {
        fillCircle(this.pos, 10)
    }
    move() {
        this.pos.add(this.vel)
        operateCrashWall(this.x, this.vel.x)
        operateCrashWall(this.y, this.vel.y)
    }
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    requestAnimationFrame(render)
}

//render()