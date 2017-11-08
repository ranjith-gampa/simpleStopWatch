class Stopwatch {
    
    constructor(display, results) {
        this.running = false;
        this.display = display;
        this.results = results;
        this.reset();
        this.print(this.times);
        if(localStorage.getItem("arr") === null){
            this.arr = [];
        }
        else{
            this.arr = localStorage.getItem("arr");
        }
    }
    
    reset() {
        this.times = [ 0, 0, 0 ];
        this.display.innerText = this.format([0,0,0]);
    }
    
    start() {
        if (!this.time) this.time = performance.now();
        this.prev = this.time
        if(!this.running){
            var watchState = "watch-started";
            geoFindMe(watchState);
        }
        if (!this.running) {
            this.running = true;
            requestAnimationFrame(this.step.bind(this));
        }
    }
    
    stop() {
        if(this.running){
            geoFindMe("watch-stopped", this.time, this.prev);
        }
        this.running = false;
        this.time = null;
        
    }

    restart() {
        if (!this.time) this.time = performance.now();
        if (!this.running) {
            this.running = true;
            requestAnimationFrame(this.step.bind(this));
        }
        this.reset();
    }
    
    clear() {
        clearChildren(this.myTable);
    }
    
    step(timestamp) {
        if (!this.running) return;
        this.calculate(timestamp);
        this.time = timestamp;
        this.print();
        requestAnimationFrame(this.step.bind(this));
    }
    
    calculate(timestamp) {
        var diff = timestamp - this.time;
        // Hundredths of a second are 100 ms
        this.times[2] += diff / 10;
        // Seconds are 100 hundredths of a second
        if (this.times[2] >= 100) {
            this.times[1] += 1;
            this.times[2] -= 100;
        }
        // Minutes are 60 seconds
        if (this.times[1] >= 60) {
            this.times[0] += 1;
            this.times[1] -= 60;
        }
    }
    
    print() {
        this.display.innerText = this.format(this.times);
    }
    
    format(times) {
        return `\
            ${pad0(times[0], 2)}:\
            ${pad0(times[1], 2)}:\
            ${pad0(Math.floor(times[2]), 2)}`;
    }
}

function saveToLocal(item){
    global.arr.push(item);
}

function pad0(value, count) {
    var result = value.toString();
    for (; result.length < count; --count)
        result = '0' + result;
    return result;
}

function clearChildren(table) {
    while(table.rows.length > 0) {
        table.deleteRow(0);
    }
}

function stopwatchInfo(watchState, startTime, latitude, longitude, timeElapsed ){
    this.watchState = watchState;
    this.startTime = startTime;
    this.latitude = latitude;
    this.longitude = longitude;
    this.timeElapsed = timeElapsed;
}

//console.log("Previous Elements count:- "+localStorage.getItem("arr").length)
let stopwatch = new Stopwatch(
    document.querySelector('.stopwatch'),
    document.querySelector('.myTable'));
    
function geoFindMe(state, current, prev) {
  var table = document.getElementById("myTable");

  if (!navigator.geolocation){
    //output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }

  function success(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;
    var tableRef = document.getElementById('myTable').getElementsByTagName('tbody')[0];
    var row   = tableRef.insertRow(tableRef.rows.length);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    
    cell1.innerHTML = state;
    cell2.innerHTML = new Date();
    cell3.innerHTML = latitude;
    cell4.innerHTML = longitude;
    if(state === "watch-stopped"){
        var num = (current - prev)/1000
        var diff = Math.round( num * 1000 + Number.EPSILON ) / 1000
        cell5.innerHTML = diff + "s";
         //arr.push(new stopwatchInfo(state, new Date(), latitude, longitude, diff))
         //localStorage.setItem("arr", arr);
    }
    saveToLocal(new stopwatchInfo(state, new Date(), latitude, longitude));

  }

  function error() {
    //output.innerHTML = "Unable to retrieve your location";
  }


  navigator.geolocation.getCurrentPosition(success, error);
}
            