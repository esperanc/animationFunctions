 
// Returns a function which is a constant
function constant(c) {
	return function (x) {
		return c;
	}
}

// A linear function
function linear (x) {
	return x;
}


// A senoid function with range between 0 and 1
function senoid(x) {
	return (Math.sin(x)+1)/2;
}

// Returns f modified so that the domain between 0 and 1 is mapped onto a and b
function mapDomain(f,a,b) {
	return function (x) {
		return f((x-a)/(b-a));
	}
}

// Returns f modified so that the range between 0 and 1 is mapped onto a and b
function mapRange(f,a,b) {
	return function (x) {
		return f(x)*(b-a)+a;
	}
}

// A cubic bezier interpolator
function bezierFunc(a,b,c,d) {
  return function (x) {
    return bezierPoint (a,b,c,d,x);
  }
}

// Quadratic function
function quadratic(x) {
  return x*x;
}

// A parabola passing through (0,0), (0.5,1) and (1,0)
function parabola(x) {
  return 1-quadratic(2*x-1);
}

// Simple physically based movement: starts at x0, moves at
// velocity dx units per unit time and accelerates at rate
// dx2 units per unit time
function phys (x0, dx, dx2) {
	return function (x) {
		return x0 + dx*x + dx2 * x * x;
	}
}
