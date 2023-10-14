// Declaring variables
let board;
let score = 0;
let rows = 4;
let columns = 4;
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;
let gameOver = false;

// Create function to set the gameboard


function setGame(){
  // Initialize the 4x4 game board with all tiles set to 0
  board = [
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0], 
    [0,0,0,0]
  ];
  

  // Create the game board tile on the HTML document
  // outer loop is for rows
  for(let r = 0; r < rows; r++){
    // inner loop is for columns
    for(let c = 0; c < columns; c++){
      // creating a div element representing a tile
      let tile = document.createElement("div");

      // Setting a unique identifier
      // r0c0 -> 0-0
      tile.id = r.toString() + "-" + c.toString();

      // board is currently set to 0
      let num = board[r][c];
      
      // Update the tile's apperance based on the num value.
      updateTile(tile, num);
   
      // Append the tile to the gameboard container.
      document.getElementById("board").append(tile);
    }
  }
  setTwo();  
}

// Function to update the appearance of a tile based on its number.
function updateTile(tile, num){
  // clear the tile content
  tile.innerText = "";

  // clear the classList to avoid multiple classes
  tile.classList.value = "";

  // add a class named "tile";
  tile.classList.add("tile");

  // This will check for the "num" parameter and will apply specific styling based on the number value.
  // If num is positive, the number is converted to a string and placed inside the tile as text.
  if(num > 0) {
    // Set the tile's text to the number based on the num value.
    tile.innerText = num.toString();
    // if num is less than or equal to 4096, a class based on the number is added to the tile's classlist. 
    if (num <= 4096){
        tile.classList.add("x"+num.toString());
    } else {
        // if num is greater than 4096, a special  class "x8192" is added.
        tile.classList.add("x8192");
    }
  }
}

// event that triggers when web page finishes loading.
window.onload = function(){
  // to execute or invoke the setGame();
  setGame();
  let player = prompt("Enter your name: ");
  if(player === "" || player === null){
    document.getElementById("player").innerText = "Feeling Mysterious Ferson";
    alert("Feeling mysterious pud!"); 
  }
  else{
    document.getElementById("player").innerText = player;
    alert(`Hello ${player} and welcome to 2048!`);
  }
  alert(`Use the ARROW KEYS to play the game.\n\nNote: At the moment, this game is only playable on desktop devices. I'll update this soon.\n\nGood luck :)`);
}

// Create function for event listeners for keys sliding (left,right,up,down)
// "e" represents the event object, which containts information about the action occured
function handleSlide(e){
  //  console.log(e.code);
  
  // Check the key pressed and perform the appropriate action.
  if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)){  
    // prevent default behavior (scrolling on keydown)
    e.preventDefault();

    // this invoke/call a function based on the key pressed.
    if(e.code == "ArrowLeft"){
      slideLeft();
    }
    else if(e.code == "ArrowRight"){
      slideRight();
    }
    else if(e.code == "ArrowUp"){
      slideUp();
    }
    else if(e.code == "ArrowDown"){
      slideDown();
    }
    setTwo();
  }
  // Update the score
  document.getElementById("score").innerText = score.toString();
  
  checkWin();

  // Call hasLost() to check for game over conditions
  if (hasLost()) {
    if (!gameOver) {
      gameOver = true;
      setTimeout(() => {
        alert("Game Over! No more tiles to merge. The game will restart.");
        gameOver = false;
        restartGame();
      }, 100);
    }
  }
}

document.addEventListener("keydown", handleSlide);

function filterZero(row){
  // removing of empty tiles
  return row.filter(num => num != 0);
}
// Core function for sliding and merging tiles (adjacent tile) in a row
function slide(row){

  // sample: [0,2,2,2]
  row = filterZero(row); //get rid of zero tiles

  // sample: [2,2,2]
  // check for adjacent equal numbers
  for(let i = 0; i < row.length - 1; i++){
    if(row[i] == row[i+1]){
      // merge the two tiles; double the value of the first tile
      row[i] *= 2;
      // setting the second one to zero
      row[i+1] = 0;
      // logic for scoring
      score += row[i];
    } //[2,2,2] -> [4,0,2]
  }
  // [4,2]
  row = filterZero(row); //get rid of zero tiles again

  // [4,2] -> [4,2,0,0]
  // add zeroes back
  while(row.length < columns){
    row.push(0);
  }

  return row; // returns the updated row value: [4,2,0,0]
}

function slideLeft(){
  // iterate through each row
  for(let r = 0; r < rows; r++){
    let row = board[r];

    // call the slide function to merge similar tile values
    row = slide(row);

    // updated value in the board
    board[r] = row;

    // update the id of the tile as well as its appearance
    for(let c = 0; c < columns; c++){
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
  // generateRandomTwo();
}

function slideRight(){
  for(let r = 0; r < rows; r++){
    let row = board[r];

    // Reverse the order of elements in the row, mirrored version of the slide left
    row = row.reverse();

    // call the slide function to merge similar tile values
    row = slide(row);

    // Reverse the row again to restore its original order
    row = row.reverse();

    // updated value in the board
    board[r] = row;

    // update the id of the tile as well as its appearance
    for(let c = 0; c < columns; c++){
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
  // generateRandomTwo();
}

function slideUp(){
  for(let c = 0; c < columns; c++) {
      // In two dimensional array, the first number represents row, and second is column.
      // Create a temporary array called row that represents a column from top to bottom.
      let row = [board[0][c], board[1][c], board[2][c], board[3][c]] // first column of the board =  [2, 0, 2, 0]

      row = slide(row) // [2, 2] -> [4, 0] -> [4, 0, 0, 0]

      // Update the id of the tile
      for(let r = 0; r < rows; r++){
          // sets the values of the board array back to the values of the modified row, essentially updating the column in the game board.
          board[r][c] = row[r]
          let tile = document.getElementById(r.toString() + "-" + c.toString());
          let num = board[r][c];
          updateTile(tile, num)
      }
  }
  // generateRandomTwo();
}

function slideDown(){
    for(let c = 0; c < columns; c++) {
      // In two dimensional array, the first number represents row, and second is column.
      // Create a temporary array called row that represents a column from top to bottom.
      let row = [board[0][c], board[1][c], board[2][c], board[3][c]] // first column of the board =  [2, 0, 2, 0]
      // Reverse the order of elements in the column, mirrored version of the slide up
      row = row.reverse(); 

      row = slide(row) // [2, 2] -> [4, 0] -> [4, 0, 0, 0]

      // Reverse the row again to restore its original order
      row = row.reverse(); 
      // Update the id of the tile
      for(let r = 0; r < rows; r++){
          // sets the values of the board array back to the values of the modified row, essentially updating the column in the game board.
          board[r][c] = row[r]
          let tile = document.getElementById(r.toString() + "-" + c.toString());
          let num = board[r][c];
          updateTile(tile, num)
      }
  }
  // generateRandomTwo();
}

function hasEmptyTile(){
  for(let r = 0; r < rows; r++){
    for(let c = 0; c < columns; c++){
      // checks if current tile is zero (empty)
      if(board[r][c] == 0){
        return true;
      }
    }
  }
  // there is no tile with zero value
  return false;
}

// function that will generate a random "2" in the game board
function setTwo(){
  // Check if there are empty tiles available
  if(!hasEmptyTile()){
    return;
  }
  // Declare a value if zero tile is found
  let found = false;

  while(!found){
    // Math.random() - generate number between 0 - 1
    // Math.floor() - round down the number to nearest integer
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * columns);

    // check if the position (r,c) in the gameboard is empty
    if(board[r][c] == 0){
      // set the value to 2
      board[r][c] = 2;
      // update the appearance of the tile
      let tile = document.getElementById(r.toString() + "-" + c.toString());
      tile.innerText = "2";
      tile.classList.add("x2");

      found = true;
    }
  }
}

function checkWin(){
  // iterate through the board
  for(let r = 0; r < rows; r++){
      for(let c = 0; c < columns; c++){
          // check if current tile == 2048 and is2048Exist == false
          if(board[r][c] == 2048 && is2048Exist == false){
              alert('You Win! You got the 2048');  // If true, alert and  
              is2048Exist = true;     // reassigned the value of is2048Exist to true to avoid continuous appearance of alert.
          } else if(board[r][c] == 4096 && is4096Exist == false) {
              alert("You are unstoppable at 4096! You are fantastically unstoppable!");
              is4096Exist = true;     // reassigned the value of is4096Exist to true to avoid continuous appearance of alert.
          } else if(board[r][c] == 8192 && is8192Exist == false) {
              alert("Victory!: You have reached 8192! You are incredibly awesome!");
              is8192Exist = true;    // reassigned the value of is8192Exist to true to avoid continuous appearance of alert.
          }
      }
  }
}

function hasLost() {
  // Check if the board is full
  for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
          if (board[r][c] === 0) {
              // Found an empty tile, user has not lost
              return false;
          }

          const currentTile = board[r][c];

          // Check adjacent cells (up, down, left, right) for possible merge
          if (
              r > 0 && board[r - 1][c] === currentTile ||
              r < rows - 1 && board[r + 1][c] === currentTile ||
              c > 0 && board[r][c - 1] === currentTile ||
              c < columns - 1 && board[r][c + 1] === currentTile
          ){
              // Found adjacent cells with the same value, user has not lost
              return false;
          }
      }
  }
  // No possible moves left or empty tiles, user has lost
  return true;
}

// RestartGame by replacing all values into zero.
function restartGame(){
  // Iterate in the board and 
  for(let r = 0; r < rows; r++){
      for(let c = 0; c < columns; c++){
          board[r][c] = 0; // change all values to 0
          const tile = document.getElementById(r.toString() + "-" + c.toString());
          tile.innerText = "";
          tile.classList.value = "tile";
      }
  }
  is2048Exist = false;
  is4096Exist = false;
  is8192Exist = false;
  let gameOver = false;
  setTwo(); // set a new random 2
  score = 0 // reset the score to 0  
  document.getElementById("score").innerText = score.toString();
}

