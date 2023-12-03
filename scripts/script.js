let canvas;
let context;
let particles = [];
let threshold = 70;
let Particle = class {


    constructor(context, cw, ch) {
        this.cw = cw;
        this.ch = ch;
        this.dx = Math.random() * 2 - 1;
        this.dy = Math.random() * 2 - 1;
        this.diameter = 4;
        this.x = Math.round(Math.random() * cw);
        this.y = Math.round(Math.random() * ch);
        this.context = context;
        this.draw(this.x, this.y);
    }

    draw = (x, y) => {
        this.context.fillStyle = "cyan";
        this.context.beginPath();
        this.context.arc(x, y, 2, 0, 2 * Math.PI);
        this.context.fill();
    }

    update = () => {
        if (Math.round(this.x) == 0 || Math.round(this.x) + this.diameter == this.cw) {
            this.dx *= -1;
        }
        if (Math.round(this.y) == 0 || Math.round(this.y) + this.diameter == this.ch) {
            this.dy *= -1;
        }
        this.x += this.dx
        this.y += this.dy;
        this.draw(this.x, this.y);
    }

}

let updateCountdown = () =>  {
    const now = new Date();
    const target = new Date();
    target.setHours(16,30, 0); // 3:30 PM

    const diff = target - now;

    if (diff <= 0) {
        clearInterval(intervalId);
        document.getElementById('countdown').innerHTML = '00:00:00';
        return;
    }

    let hours = Math.floor(diff / 1000 / 60 / 60);
    let minutes = Math.floor(diff / 1000 / 60) % 60;
    let seconds = Math.floor(diff / 1000) % 60;

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    document.getElementById('countdown').innerHTML = `${hours}:${minutes}:${seconds}`;
}

intervalId = setInterval(updateCountdown, 1000);



let init = () => {
    canvas = document.createElement("canvas");
    context = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    context.strokeStyle = "#09f";
    context.lineWidth = 0.3;
}

let spawn = (max) => {
    for (let i = 0; i < max; i++) {
        particles.push(new Particle(context, canvas.width, canvas.height));
    }
}

checkDist = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}

drawConnection = (x1, y1, x2, y2) => {
    let dist = checkDist(x1, y1, x2, y2);
    if (dist < threshold) {
        context.lineWidth = threshold / dist * 0.15;
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
    }
}



let animate = () => {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height)
    particles.map(p => {
        particles.map(q => {
            drawConnection(p.x, p.y, q.x, q.y);
        })
        p.update()
    })
    window.requestAnimationFrame(animate);
}


document.addEventListener("DOMContentLoaded", () => {
    init();
    updateCountdown();
    spawn(500, canvas.width, canvas.height);
    animate();
})
