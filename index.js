'use strict';

/** --------------------------- **/
/**          NPM objects        **/
/** --------------------------- **/

// Package to output results into csv file
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

/** --------------------------- **/
/**       Global Variables      **/
/** --------------------------- **/

// Grid height/length for loops to populate map object
let gridLength = 11;
let gridHeight = 14;

// "Grid" to hold arrays of coordinate objects
let map = [];

// Coordinates designating a land mass in the grid belonging to an island
let islandCoordinates = [
	{"x":0, "y": 0},
	{"x":2, "y": 1},
	{"x":2, "y": 9},
	{"x":3, "y": 1},
	{"x":3, "y": 7},
	{"x":3, "y": 8},
	{"x":4, "y": 6},
	{"x":4, "y": 7},
	{"x":4, "y": 8},
	{"x":5, "y": 7},
	{"x":6, "y": 4},
	{"x":6, "y": 10},
	{"x":6, "y": 12},
	{"x":6, "y": 13},
	{"x":7, "y": 3},
	{"x":8, "y": 2},
	{"x":9, "y": 1},
	{"x":10, "y": 7}
];

// Final island list containing island ids and total sizes
let islands = [];

/** --------------------------- **/
/**        Function calls       **/
/** --------------------------- **/

// Initial call to populate map object with "grid" cell values indicating 
// located island land masses
createGrid();

// Call to loop through map object to find island land masses, and to determine 
// its size based on contiguous land masses
getIslandSizes();

// Sort final island list in order of island size from largest to smallest
islands.sort(compare);

// Output islands object to csv file
writeToCsv();

/** --------------------------- **/
/** Post map creating functions **/
/** --------------------------- **/

/** 
 * Comparison function for sorting island list from largest to smallest
 * 
 * @param object a first island object for comparison
 * @param object b second element object for comparison
 *  
 * @return integer returns indication of how a and b's indexes will be adjusted
				   < 0 - a comes first
				     0 - no changes to indexes
				   > 0 - b comes first
*/
function compare(a, b) {
	if (a.size < b.size){
		return 1;
	}
	if (a.size > b.size){
		return -1;
	}
	return 0;
}

/** 
 * Write islands array to csv file islands.csv in same directory
*/
function writeToCsv() {
	const csvWriter = createCsvWriter({
		path: 'islands.csv',
		header: [
			{id: 'id', title: 'Island ID'},
			{id: 'size', title: 'Island Size'}
		]
	});

	csvWriter
	  .writeRecords(islands)
	  .then(()=> console.log('Islands CSV file was written successfully.'));
}

/** 
 * Loop through map object to find islands and sizes
*/
function getIslandSizes() {
	
	for (let x = 0; x < map.length; x++) {
        for (let y = 0; y < map[x].length; y++) {
			visit(false, -1, map[x][y], x, y);
        }
    }
}

/** 
 * Inspect individual grid cell to see if it has been "checked", is an island 
 * mass and if so, either create a new island, or increment an existing one's size by 1
 * 
 * @param boolean isNeighbor Indicates if cell is a neighbor to the currently found island
 * @param integer islandId ID of current island
 * @param object coord Cell properties indicating if it was checked and if it's part of an island
 * @param integer x X-coordinate of cell in correlation to map
 * @param integer y Y-coordinate of cell in correlation to map
*/
function visit(isNeighbor, islandId, coord, x, y) {

	// Island has already been checked so no need to go further
	if (coord.checked) { return; }
	
	// Update map object with updated cell object so it doesn't get rechecked
	coord.checked = true;
	map[x][y] = coord;
	
	// Only update islands object if cell value is an 'X', indicating a land mass
	if (coord.value == "X")
	{		
		addToIslandList(isNeighbor, islandId);
		// Get neighbors of land mass (top, bottom, left, right cells)
		var neighbors = getNeighbors(x, y);
		
		// Loop through neighbors and call this same method, but with indication that it may 
		// be part of the current island
		neighbors.forEach(function(neighbor, index) {
			visit(true, islands.length, map[neighbor.x][neighbor.y], neighbor.x, neighbor.y);
		});
	}
}

/** 
 * Update islands object with new islands or updated island sizes using ID
 * 
 * @param boolean isNeighbor Indicates if cell is a neighbor to the currently found island
 * @param integer islandId ID of current island
*/
function addToIslandList(isNeighbor, islandId) {

	// Increment size if neighboring land mass
	if (isNeighbor) {
		var islandIndex = islands.findIndex((island => island.id == islandId));
		islands[islandIndex].size++;
	}
	// Create new island if not
	else {
		var island = {
			id: islands.length + 1,
			size: 1
		};
		
		islands.push(island);
	}
}

/** 
 * Get neighboring cell coordinates of current/found island land mass
 * 
 * @param integer x X-coordinate of cell to find neighoring cells of
 * @param integer y Y-coordinate of cell to find neighoring cells of
 *  
 * @return array returns the x/y coordinates of applicable neighboring cells
*/
function getNeighbors(x, y) {
	var neighbors = [];
	
	var top    = {"x": x, "y": y-1};
	var bottom = {"x": x, "y": y+1};
	var left   = {"x": x-1, "y": y};
	var right  = {"x": x+1, "y": y};
	
	// Only return certain neighbor cells based on coordinates of current/found island 
	// since it may be on border of grid
	if (y != 0) neighbors.push(top);
	if (x != 0) neighbors.push(left);
	if (y != gridHeight-1) neighbors.push(bottom);
	if (x != gridLength-1) neighbors.push(right);
	
	return neighbors;
}

/** --------------------------- **/
/** Map creating functions **/
/** --------------------------- **/

/** 
 * Populating map object with cell contents indicating checked status and existence of land mass
*/
function createGrid() {
    for (let x = 0; x < gridLength; x++) {
		map[x] = [];
        for (let y = 0; y < gridHeight; y++) {
            addCellContents(x, y); 
        }
    }
}

/** 
 * Get neighboring cell coordinates of current/found island land mass
 * 
 * @param integer x X-coordinate of cell in correlation to map
 * @param integer y Y-coordinate of cell in correlation to map
*/
function addCellContents(x, y) {
	map[x].push(newCell(x, y));
}

/** 
 * Set each cell's content
 * 
 * @param integer x X-coordinate of cell in correlation to map
 * @param integer y Y-coordinate of cell in correlation to map
 *  
 * @return object returns cell's content (checked: boolean, value: string)
*/
function newCell(x, y) {
	// Every map "cell" will be an object with a checked property to prevent unnecessary 
	// checking of grid cells, and a value property to indicate if it's part of an island
	var cell = {
		checked: false,
		value: ''
	};
	if (coordinatesIsPartOfIsland(x, y)) {
		cell['value'] = 'X';
	}
	return cell;
}

/** 
 * Go through islandCoordinates object to determine of map "cell" should have an 'X' for its value
 * 
 * @param integer x X-coordinate of cell in correlation to map
 * @param integer y Y-coordinate of cell in correlation to map
 *  
 * @return boolean returns whether currently checked cell's coordinates are part of an island using
 *                 islandCoordinates object
*/
function coordinatesIsPartOfIsland(x, y) {
	return islandCoordinates.some(function(coords) {
		return (coords.x === x && coords.y === y);
	});
}