let socket
let current = {
    color: "#70cccc",
    weight: 1
}
let pg  //缓存画布内容

const weightSlider = document.getElementById('weight-slider')
weightSlider.addEventListener('change', changeWeight)

function changeWeight(e) { 
    current.weight = e.target.value
}
function changeColor(color) {
    current.color = `${color}`
}

function setup() { 
    createCanvas(windowWidth, windowHeight)

    pg = createGraphics(windowWidth, windowHeight)
    pg.background(255)

    //socket连接
    socket = io.connect('http://localhost:8080')
    socket.on('drawing', (data) => {
        // console.log('sending mouse: ' + data.x0 + ' ' + data.y0 + ' ' + data.x1 + ' ' + data.y1);    
        pg.stroke(data.color)
        pg.strokeWeight(data.weight)
        pg.line(
            data.x0 * width,
            data.y0 * height,
            data.x1 * width,
            data.y1 * height
        )
    })
}

function draw() {
    //不断地画缓存的内容并展示出来
    image(pg, 0, 0)
}

//窗口改变时重置画布大小
function windowResized() { 
    if (windowWidth > width || windowHeight > height) {
        //只在画布放大时重置画布和graphics尺寸，防止画布缩小时导致原本绘制内容丢失的情况
        resizeCanvas(windowWidth, windowHeight)
        //因为没有直接重置graphics大小的方法，所以重新创建一个新的graphics，将原来的内容绘制上去
        const oldPg = pg
        pg = createGraphics(windowWidth, windowHeight)
        pg.background(255)
        pg.image(oldPg, 0, 0)
    }
}

function drawLine(x0, y0, x1, y1) {
    pg.stroke(current.color)
    pg.strokeWeight(current.weight)
    pg.line(x0, y0, x1, y1)
    //画线时将2个点传递给服务器
    // console.log('sending mouse: '+x0+' '+y0+' '+x1+' '+y1);
    socket.emit('mouse', {
        //点在画布上的百分位置，兼容不同的显示器尺寸
        //width和height是createCanvas传入的2个参数
        x0: x0 / width, 
        y0: y0 / height,
        x1: x1 / width, 
        y1: y1 / height,
        color: current.color,
        weight:current.weight
    })
}

function mousePressed() { 
    if (mouseButton === LEFT) {
        current.x = mouseX
        current.y = mouseY
    }
}

function mouseDragged(e) {
    if (mouseButton === LEFT) { 
        if (e.target.tagName === 'CANVAS') {
            //当鼠标拖动的对象是画布而不是其它控件时才开始绘制
            drawLine(current.x, current.y, mouseX, mouseY)
            current.x = mouseX
            current.y = mouseY
        }
    }
}