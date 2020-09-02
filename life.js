DEAD = 0
LIVE = 1
DEAD_CLASS = "deadcell"
LIVE_CLASS = "livecell"

// Offsets for each of the 8 neighbor locations
NEIGHBORS = [
    [-1, -1],
    [-1,  0],
    [-1,  1],
    [ 0, -1],
    [ 0,  1],
    [ 1, -1],
    [ 1,  0],
    [ 1,  1],
]

// Game state
var rows = 0
var cols = 0
var running = false
var world = null


function setup() {
    toggleRun(true)

    rows = $('#numrows').val()
    cols = $('#numcols').val()
    running = false
    world = createEmptyWorld()

    addSampleShape()

    createGrid()
    displayWorld()
}

function toggleRun(reset) {
    if (reset) {
        running = false
    }
    else {
        running = !running
    }
    var button = $('#runbtn')

    if (running) {
        button.text('Stop')
        run()
    }
    else {
        button.text('Start')
    }
}

function run() {
    if (!running) {
        return
    }

    stepWorld()
    displayWorld()

    var delay = $('#delayms').val()
    setTimeout(function() {run()}, delay)
}

function createGrid() {
    var grid = $('<table/>', {id: 'grid', class: 'grid'})
    for (i = 0; i < rows; i++) {
        var row = $('<tr/>')
        for (j = 0; j < cols; j++) {
            row.append(
                $('<td/>', {class: DEAD_CLASS})
                .on('click', function() {toggleCellState(this)})
            )
        }
        grid.append(row)
    }

    var gridroot = $('#gridroot')
    gridroot.empty()
    gridroot.append(grid)
}

function createEmptyWorld() {
    var newWorld = new Array(rows)
    for (var i = 0; i < rows; i++) {
        newWorld[i] = new Array(cols)
        for (var j = 0; j < cols; j++) {
            newWorld[i][j] = DEAD
        }
    }
    return newWorld
}

function displayWorld() {
    var grid = $('#grid')[0]
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var cellAlive = world[i][j]
            var cellTd = grid.childNodes[i].childNodes[j]
            setCellTd(cellAlive, cellTd)
        }
    }
}

function toggleCellState(cellTd) {
    col = $(cellTd).index()
    row = $(cellTd).parent().index()

    console.log('Toggling cell', row, col)

    cellAlive = !world[row][col]
    world[row][col] = cellAlive
    setCellTd(cellAlive, cellTd)
}

function setCellTd(cellAlive, cellTd) {
    cellTd.className = cellAlive ? LIVE_CLASS : DEAD_CLASS
}

function stepWorld() {
    var newWorld = createEmptyWorld()
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var cellAlive = world[i][j]
            var liveNeighbors = checkNeighbors(i, j)
            newWorld[i][j] = nextCellState(cellAlive, liveNeighbors)
        }
    }
    world = newWorld
}

function checkNeighbors(row, col) {
    var liveNeighbors = 0
    NEIGHBORS.forEach(function(offset) {
        liveNeighbors += checkNeighbor(row, col, offset[0], offset[1])
    })
    return liveNeighbors
}

function checkNeighbor(curRow, curCol, rowDir, colDir) {
    var row = curRow + rowDir
    var col = curCol + colDir

    // Check if out of bounds
    if (row < 0 || col < 0 || row >= rows || col >= cols) {
        return 0
    }
    return world[row][col]
}

function nextCellState(cellAlive, liveNeighbors) {
    // Can comment or uncomment lines to change the rules
    var liveRules = [
        // (cellAlive && liveNeighbors == 1),
        (cellAlive && liveNeighbors == 2),
        (cellAlive && liveNeighbors == 3),
        // (cellAlive && liveNeighbors == 4),
        // (cellAlive && liveNeighbors == 5),
        // (cellAlive && liveNeighbors == 6),
        // (cellAlive && liveNeighbors == 7),
        // (cellAlive && liveNeighbors == 8),

        // (!cellAlive && liveNeighbors == 1),
        // (!cellAlive && liveNeighbors == 2),
        (!cellAlive && liveNeighbors == 3),
        // (!cellAlive && liveNeighbors == 4),
        // (!cellAlive && liveNeighbors == 5),
        // (!cellAlive && liveNeighbors == 6),
        // (!cellAlive && liveNeighbors == 7),
        // (!cellAlive && liveNeighbors == 8),
    ]
    if (liveRules.some(function(x) {return x})) {
        return LIVE
    }
    return DEAD
}

function addShape(originRow, originCol, shape) {
    shape.forEach(function(offset) {
        var row = originRow + offset[0]
        var col = originCol + offset[1]
        world[row][col] = LIVE
    })
}

SAMPLE_SHAPE = [
    [1, -3],
    [1, -2],
    [-1, -2],
    [0, 0],
    [1, 1],
    [1, 2],
    [1, 3],
]

function addSampleShape() {
    addShape(
        Math.floor(rows / 2),
        Math.floor(cols / 2) + 15,
        SAMPLE_SHAPE
    )
}

setup()
