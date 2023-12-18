const energyView = document.getElementsByClassName("energy")[0]
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

//[----------------<Function>----------------]
const print = (value) => { console.log(value) }

function updateDataView() {
    var energy = 0
    for (var i in atoms) {
        energy += atoms[i].Ek
    }
    energyView.innerText = `${energy}J`
}

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
    mul(m) {
        this.x *= m
        this.y *= m
    }
    sizeSquare() {
        return this.x ** 2 + this.y ** 2
    }
    normalized() {
        var size = this.sizeSquare()
        return new Vector(this.x / size, this.y / size)
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
    if (axis < 0) {
        return -1
    }
    if (axis > canvas.width) {
        return -1
    }
    return 1
}

function isCrashed(atom1, atom2) {
    const ds = distanceSquare(atom1.pos, atom2.pos)

    if (ds <= (atom1.radius + atom2.radius) ** 2) {
        return true
    }
}

function interactWith(A, B) {
    // A, B => Atom
    if (isCrashed(A, B)) {
        //Before
        var v1 = Math.sqrt(A.vel.sizeSquare())
        var v2 = Math.sqrt(B.vel.sizeSquare())
        var v1_normalize = A.vel.normalized()
        var v2_normalize = B.vel.normalized()
        var preCalc = 2 * (v2 - v1) / (A.mass + B.mass)

        //After
        var v1_After = v1 + B.mass * preCalc
        var v2_After = v2 - A.mass * preCalc
        v1_normalize.mul(-v1_After)
        v2_normalize.mul(-v2_After)

        A.vel = v1_normalize
        B.vel = v2_normalize

        ctx.fillStyle = 'red'
        A.draw()
        B.draw()
        ctx.fillStyle = 'black'
    }
}

class Atom {
    constructor(pos, vel, mass, radius) {
        this.pos = new Vector(pos[0], pos[1])
        this.vel = new Vector(vel[0], vel[1])
        this.mass = mass
        this.radius = radius
    }
    get x() { return this.pos.x }
    get y() { return this.pos.y }
    get Ek() { return this.mass * this.vel.sizeSquare() }
    draw() {
        fillCircle(this.pos, this.radius)
    }
    move() {
        this.pos.add(this.vel)
        this.vel.x *= operateCrashWall(this.x, this.vel.x)
        this.vel.y *= operateCrashWall(this.y, this.vel.y)
    }
}

//[----------------<Main>----------------]
const atoms = [
    new Atom([200, 200], [3, 3], 1, 15),
    new Atom([350, 400], [-1, -2], 3, 10),
]

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (var i in atoms) {
        atoms[i].move()
        atoms[i].draw()
    }
    for (var i = 0; i < atoms.length - 1; i++) {
        for (var j = i + 1; j < atoms.length; j++) {
            interactWith(atoms[i], atoms[j])
        }
    }
    updateDataView()
    requestAnimationFrame(render)
}

render()