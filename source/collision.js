function point(_x, _y) {
    return ({x: _x, y: _y });
}
function straight(_a, _b, _c) {
    return ({ a: _a, b: _b, c: _c });
}
function line(point1, point2) {
    return ({ p1: point1, p2: point2 });
}
function det(a, b, c, d) {
    return (a * d - b * c);
}
function line_to_straight(_line) {
    return straight(_line.p1.y - _line.p2.y, _line.p2.x - _line.p1.x, det(_line.p1.x, _line.p2.x, _line.p1.y, _line.p2.y));
}
    
function in_rect(rect, point) {
    return (point.x >= rect.left && point.x <= rect.right && point.y >= rect.bottom && point.y <= rect.top);
}
function rect(line) {
    return ({
        right: Math.max(line.p1.x, line.p2.x),
        top: Math.max(line.p1.y, line.p2.y),
        left: Math.min(line.p1.x, line.p2.x),
        bottom: Math.min(line.p1.y, line.p2.y)
    });
}

function collision (line1, line2) {
    
    const EPS = 1e-9;
    
    function intersect (m, n) {
        var zn = det(m.a, m.b, n.a, n.b);
        if (Math.abs(zn) < EPS)
            return false;
        return point(- det (m.c, m.b, n.c, n.b) / zn, - det (m.a, m.c, n.a, n.c) / zn);
    }
    
    var p = intersect(line_to_straight(line1), line_to_straight(line2));
    
    if (p === false)
        return false;
    
   
    
    if (in_rect(rect(line1), p) && in_rect(rect(line2), p)) {
        return p;
    }
        
    return false;
}