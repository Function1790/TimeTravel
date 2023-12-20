const HTML = {
    energy: document.getElementsByClassName("energy")[0],
    playBtn: document.getElementsByClassName("playBtn")[0],
    errorRate: document.getElementsByClassName("errorRate")[0],
    reverseBtn: document.getElementsByClassName("reverseBtn")[0],
    minError: document.getElementById("minError")
}
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

//[----------------<Setting>----------------]
const Setting = {
    GravityConstant: 100
}

//[----------------<Function>----------------]
const print = (value) => { console.log(value) }

function updateDataView(errorRate) {
    var energy = 0
    for (var i in atoms) {
        energy += atoms[i].Ek
    }
    HTML["energy"].innerText = `ΣE=${energy}J`
    HTML["errorRate"].innerText = `error=${errorRate}%`
}

function randint(range) {
    return Math.floor(Math.random() * range)
}

function floorIn(value, n) {
    const correct = 10 ** n
    return Math.floor(value * correct) / correct
}

function reverseAll() {
    for (var i in atoms) {
        atoms[i].vel.mul(-1)
    }
    revValue *= -1
}

function updateMinRate(rate) {
    minErrorRate = rate
    HTML.minError.innerText = `Min : ${rate}%`
}


//[----------------<Event>----------------]
HTML.playBtn.addEventListener("click", () => {
    if (isPlaying == true) {
        isPlaying = false
        HTML.playBtn.innerText = "STOP"
    } else {
        isPlaying = true
        HTML.playBtn.innerText = "PLAY"
    }
})

HTML.reverseBtn.addEventListener("click", () => {
    if (isReverse) {
        return
    }
    print("< Reverse >")
    minErrorRate = 999999
    reverseAll()
    isReverse = true
    isSkipInRev = true
    HTML["reverseBtn"].innerText = "..."
})

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
        var size = Math.sqrt(this.sizeSquare())
        if (size == 0) {
            return new Vector(0, 0)
        }
        return new Vector(this.x / size, this.y / size)
    }
    toStr() {
        return `{x: ${this.x}, y: ${this.y}}`
    }
    getWithMul(m) {
        return new Vector(this.x * m, this.y * m)
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

//[----------------<Interaction>----------------]
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

function crashBetween(A, B) {
    var v1 = Math.sqrt(A.vel.sizeSquare())
    var v2 = Math.sqrt(B.vel.sizeSquare())
    var v1_normalize = A.vel.normalized()
    var v2_normalize = B.vel.normalized()
    var preCalc = 2 * (v2 - v1) / (A.mass + B.mass)

    //After
    var v1_After = v1 + B.mass * preCalc
    var v2_After = v2 - A.mass * preCalc
    v1_normalize.mul(-v2_After)
    v2_normalize.mul(-v1_After)

    A.vel = v1_normalize
    B.vel = v2_normalize

    ctx.fillStyle = 'red'
    A.draw()
    B.draw()
    ctx.fillStyle = 'black'
}

function gravityBetween(A, B) {
    var F = A.mass * B.mass / distanceSquare(A, B)
    F *= Setting.GravityConstant
    var sin = (B.y - A.y) / Math.sqrt(distanceSquare(A, B))
    var cos = (B.x - A.x) / Math.sqrt(distanceSquare(A, B))
    sin *= revValue
    cos *= revValue
    A.applyForce(F * cos, F * sin)
    B.applyForce(-F * cos, -F * sin)
}

function interactWith(A, B) {
    // A, B => Atom
    gravityBetween(A, B)
    if (isCrashed(A, B)) {
        //crashBetween(A, B)
    }
}

//[----------------<Atom>----------------]
var data1 = []
var data2 = []
class Atom {
    constructor(pos, vel, mass, radius) {
        this.origin = {
            pos: new Vector(pos[0], pos[1]),
            vel: new Vector(vel[0], vel[1])
        }
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
    processSpeed() {
        this.vel.x *= operateCrashWall(this.x, this.vel.x)
        this.vel.y *= operateCrashWall(this.y, this.vel.y)
        this.vel.y += 0.5
    }
    move() {
        if (isSkipInRev) {
            print("Skiped" + this.vel.toStr())
        }
        data1.push(this.vel.y)
        this.vel.x *= operateCrashWall(this.x, this.vel.x)
        this.vel.y *= operateCrashWall(this.y, this.vel.y)
        this.vel.y += 1
        if (isSkipInRev) {
            isSkipInRev = false
            return
        }
        if (!isSkipInRev) {
            this.pos.add(this.vel)
        }
        isSkipInRev = false
    }
    getErrorRate() {
        var dpos = distanceSquare(this.pos, this.origin.pos)
        var dvel = distanceSquare(this.vel.getWithMul(-1), this.origin.vel)
        if (isReverse) {
            //print(`${this.pos.toStr()}\t${this.origin.pos.toStr()}\t${this.vel.toStr()}`)
            if (Math.floor(dvel) == 0) {
                //print(`last : ${this.pos.toStr()}`)
                isPlaying = false
            }
        }
        return dpos + dvel
    }
    applyForce(Fx, Fy) {
        this.vel.x += Fx / this.mass
        this.vel.y += Fy / this.mass
    }
}

//[----------------<Main>----------------]
const atoms = [
    new Atom([100, 100], [1, 0], 5, 15),
    //new Atom([140, 240], [1, -1], 5, 15)
]

/*for (var i = 0; i < 2; i++) {
    atoms.push(new Atom(
        [Math.random() * 800, Math.random() * 800],
        [2 + randint(3), 2 + randint(3)], 5, 15))
}*/

var isPlaying = true
var isReverse = false
var isSkipInRev = false
var revValue = 1
var minErrorRate = 999999999
function render() {
    if (!isPlaying) {
        requestAnimationFrame(render)
        return
    }

    var errorRate = 0
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (var i in atoms) {
        atoms[i].move()
        atoms[i].draw()
        errorRate += atoms[i].getErrorRate()
    }
    for (var i = 0; i < atoms.length - 1; i++) {
        for (var j = i + 1; j < atoms.length; j++) {
            //interactWith(atoms[i], atoms[j])
        }
    }

    if (errorRate < minErrorRate) {
        errorRate = floorIn(errorRate, 10)
        updateMinRate(errorRate)
        //print(`Min : ${minErrorRate}%`)
    }

    if (isReverse) {
        if (minErrorRate == 0) {
            isPlaying = false
            isReverse = false
            updateMinRate(1000)
            reverseAll()
            HTML["reverseBtn"].innerText = "REV"
        }
    }
    updateDataView(errorRate)
    requestAnimationFrame(render)
}

render()