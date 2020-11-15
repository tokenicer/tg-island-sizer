Title Guaranty CIS Assessment - Island Sizer
===========================

This project serves as the Coding Question solution for the Title Guaranty CIS Assessment.
At a high level, it first populates a 2D array object simulating a "map as a grid" with X's 
in specified cells indicating the existence of an island. The program then finds all the
island land masses and determines its size by finding neighboring or contiguous X's. The
final result of the islands' IDs and Sizes is then written to a csv file in the project
directory.

----------


Setup
-------------

#### Restoring Packages

After cloning this project locally, you will need to download the packages that the project depends on

> **Restore browser packages with npm**
>
> 1. Ensure your node is version 13.x.x and npm is version is 6.x.x
> 2. Install npm packages: npm install

#### Run application
> **Command from terminal: node index.js**

----------


Assumptions
-------------

"Contiguous" X's are cells that neighbor a cell from the top, bottom, left, or right only. Diagonal cells
will not be accounted for.


Enhancement Opportunities
-------------

 - Separate files for function calls, functions, and possibly variables
 - Add testing script using Mocha.js to assert how many islands, their sizes, etc.
 - Allow for user input of coordinates to indicate grid size, and possibly coordinates of island land masses
 - Output visual of grid map and color in the different islands' cells to highlight each island's land masses
 - Set island ID to more meaningful value, possibly taking into account its size
 - Additional logging of events in console when application is run, possibly with variable for "DEBUG" mode
