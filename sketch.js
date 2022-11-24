let socket
let current = {
}

function setup() { 
    createCanvas(windowWidth, windowHeight)
    //socket连接
    socket = io.connect('http://localhost:8080')

    socket.on('drawing', (data) => {
        console.log('sending mouse: ' + data.x0 + ' ' + data.y0 + ' ' + data.x1 + ' ' + data.y1);
        line(data.x0 * width, data.y0 * height, data.x1 * width, data.y1 * height)
    })
}

function draw() {

}

function drawLine(x0, y0, x1, y1) {
    line(x0, y0, x1, y1)
    //画线时将2个点传递给服务器
    console.log('sending mouse: '+x0+' '+y0+' '+x1+' '+y1);
    socket.emit('mouse', {
        //点在画布上的百分位置，兼容不同的显示器尺寸
        //width和height是createCanvas传入的2个参数
        x0: x0 / width, 
        y0: y0 / height,
        x1: x1 / width, 
        y1: y1 / height,
    })
}

function mousePressed() { 
    if (mouseButton === LEFT) {
        current.x = mouseX
        current.y = mouseY
    }
}

function mouseDragged() {
    if (mouseButton === LEFT) { 
        drawLine(current.x, current.y, mouseX, mouseY)
        current.x = mouseX
        current.y = mouseY
    }
}