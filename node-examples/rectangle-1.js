var rect = require('./simplerect');

function solveRect(l,b) {
  console.log("Value of l is "+ l +" and b is "+b);
  if(l<0||b<0) {
    console.log("Rectangle Dimensions cannot be less than zero");
  }
  else {
    console.log("Area of rectangle is "+rect.area(l,b));
    console.log("Perimeter of rectangle is "+rect.perimeter(l,b));
  }
}
solveRect(3,4);
