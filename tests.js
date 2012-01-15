var Animal = function Animal(char, x, y, predator) {
  this.char = char;
  this.x = x;
  this.y = y;
  this.predator = predator;
  this.alive = true;
  // we're moving to the position we're already in, just for the drawing
  this.changePosition(x, y);
};
Animal.prototype.changePosition = function changePosition(x, y) {
  // clear old position
  tests.grid[0].rows[this.y].cells[this.x].innerHTML = '&nbsp;'
  // and style
  tests.grid[0].rows[this.y].cells[this.x].style.color = 'black'
  
  // update the position
  this.x = x;
  this.y = y;
  
  // show the animal in the new position
  tests.grid[0].rows[this.y].cells[this.x].innerHTML = this.char;
  // change color if a predator
  if (this.predator) {
    tests.grid[0].rows[this.y].cells[this.x].style.color = 'red'
  }
}
Animal.prototype.move = function move() {
  // if the animal is a predator
  if (this.predator) {
    // look for prey in all adjacent squares
    // cheat by just looking at the animals array
    for (var k = 0; k < tests.animals.length; k++) {
      var animal = tests.animals[k];
      // if we're not looking at the same animal and it is prey
      if (animal.alive && animal.char != this.char && !animal.predactor) {
        // if the other animal is either 1 less, the same, or 1 more position x
        if (animal.x >= this.x - 1 && animal.x <= this.x + 1) {
          // if the other animal is either 1 less, the same, or 1 more position y
          if (animal.y >= this.y - 1 && animal.y <= this.y + 1) {
            // ATTACK!
            this.changePosition(animal.x, animal.y);
            animal.alive = false;
            // console.log(this.char, "just killed", animal.char);
            $("#next").next().append("<p>" + this.char + " just killed " + animal.char + "!</p>")
            return;
          }
        }
      }
    }
  }
  
  
  // default is to randomly move one cell in any direction
  var newX = this.randX();
  var newY = this.randY();
  // only move into the cell if it's not occupied
  if (!tests.cellOccupied(newX, newY)) {
    this.changePosition(newX, newY);
  }
}
Animal.prototype.randX = function randX() {
  var r = Math.round(Math.random() * 2) - 1
  // left
  if (r == -1) {
    return (this.x - 1 > 0) ? this.x - 1 : 0;
  }
  // right
  else if (r == 1) {
    return (this.x + 1 < tests.grid.x) ? this.x + 1 : tests.grid.x - 1; // -1 b/c grid dimensions aren't zero-indexed
  }
  // no change
  else {
    return this.x;
  }
}
Animal.prototype.randY = function randY() {
  var r = Math.round(Math.random() * 2) - 1
  // up
  if (r == -1) {
    return (this.y - 1 > 0) ? this.y - 1 : 0;
  }
  // down
  else if (r == 1) {
    return (this.y + 1 < tests.grid.y) ? this.y + 1 : tests.grid.y - 1; // -1 b/c grid dimensions aren't zero-indexed
  }
  // no change
  else {
    return this.y;
  }
}

var tests = {
  animals: [],
  setGrid: function setGrid(x, y) {
    // save for easy reference
    tests.grid.x = x;
    tests.grid.y = y;
    
    for (var k = 0; k < y; k++) {
      // -1 to append
      var tr = tests.grid[0].insertRow(-1);
      for (var i = 0; i < x; i++) {
        var td = tr.insertCell(-1);
        td.innerHTML = '&nbsp;'
      }
      tests.grid.append(tr);
    }
  },
  cellOccupied: function cellOccupied(x, y) {
    return tests.grid[0].rows[y].cells[x].innerHTML != '&nbsp;'
  },
  moveAll: function moveAll() {
    for (var k = 0; k < this.animals.length; k++) {
      var animal = this.animals[k];
      if (animal.alive) {
        animal.move();
      }
    }
  }
};

$(document).ready(function () {
  tests.grid = $("table#grid");
});