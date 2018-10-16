! function (t, e) {
    "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e(t.d3 = t.d3 || {})
}(this, function (t) {
    "use strict";

    function e(t, e, r, n) {
        var o = Math.cos(e),
            a = Math.sin(e),
            u = Math.cos(r),
            d = Math.sin(r),
            c = Math.cos(n),
            i = Math.sin(n),
            f = o * d * i - a * c,
            p = o * d * c + a * i,
            y = a * u,
            x = a * d * i + o * c,
            h = a * d * c - o * i,
            z = -d,
            l = u * i,
            s = u * c;
        return {
            x: o * u * t.x + f * -t.y + p * t.z,
            y: y * t.x + x * -t.y + h * t.z,
            z: z * t.x + l * -t.y + s * t.z
        }
    }

    function r(t, e, r, n, o) {
        return e === p.ortho ? {
            x: r[0] + n * t.x,
            y: r[1] + n * t.y
        } : e === p.persp ? {
            x: r[0] + n * t.x / (t.z + o),
            y: r[1] + n * t.y / (t.z + o)
        } : void 0
    }

    function n(t, n, o, a, u, d, c, i) {
        for (var f = t.length - 1; f >= 0; f--) {
            var p = t[f];
            p.rotated = e({
                x: p.x,
                y: p.y,
                z: p.z
            }, o, a, u), p.projected = r(p.rotated, n, d, c, i)
        }
        return t
    }

    function o(t, n, o, a, u, d, c, i) {
        for (var f = t.length - 1; f >= 0; f--) {
            var p = t[f],
                y = p[0],
                x = p[1];
            y.rotated = e({
                x: y.x,
                y: y.y,
                z: y.z
            }, o, a, u), x.rotated = e({
                x: x.x,
                y: x.y,
                z: x.z
            }, o, a, u), y.projected = r(y.rotated, n, d, c, i), x.projected = r(x.rotated, n, d, c, i), p.lng = Math.sqrt(Math.pow(x.rotated.x - y.rotated.x, 2) + Math.pow(x.rotated.y - y.rotated.y, 2) + Math.pow(x.rotated.z - y.rotated.z, 2)), p.midPoint = {
                x: (y.x + x.x) / 2,
                y: (y.y + x.y) / 2,
                z: (y.z + x.z) / 2
            }
        }
        return t
    }

    function a(t, e, r, n, o, a, u, d) {
        for (var c = t.length - 1; c >= 0; c--);
        return t
    }

    function u(t, e, r, n, o, a, u, d) {
        for (var c = t.length - 1; c >= 0; c--);
        return t
    }

    function d(t, n, o, a, u, d, c, i) {
        for (var f = t.length - 1; f >= 0; f--) {
            var p = t[f],
                y = p[0],
                x = p[1],
                h = p[2];
            y.rotated = e({
                x: y.x,
                y: y.y,
                z: y.z
            }, o, a, u), x.rotated = e({
                x: x.x,
                y: x.y,
                z: x.z
            }, o, a, u), h.rotated = e({
                x: h.x,
                y: h.y,
                z: h.z
            }, o, a, u), y.projected = r(y.rotated, n, d, c, i), x.projected = r(x.rotated, n, d, c, i), h.projected = r(h.rotated, n, d, c, i), p.area = 1
        }
        return t
    }

    function c(t, e, r, n, o, a, u, d) {
        for (var c = t.length - 1; c >= 0; c--);
        return t
    }

    function i(t, e, r, n, o, a, u, d) {
        for (var c = t.length - 1; c >= 0; c--);
        return t
    }

    function f(t) {
        return "M" + t[0].projected.x + "," + t[0].projected.y + "L" + t[1].projected.x + "," + t[1].projected.y + "L" + t[2].projected.x + "," + t[2].projected.y + "Z"
    }
    var p = {
            ortho: "ortho",
            persp: "persp"
        },
        y = function () {
            function t(t) {
                return v[g](t, r, z, l, s, y, x, h)
            }
            var e = p.ortho,
                r = (p.persp, e),
                y = [0, 0],
                x = 1,
                h = 1,
                z = 0,
                l = 0,
                s = 0,
                g = "POINTS",
                v = {
                    POINTS: n,
                    LINES: o,
                    LINES_LOOP: a,
                    LINES_STRIP: u,
                    TRIANGLES: d,
                    TRIANGLES_STRIP: c,
                    TRIANGLES_FAN: i
                },
                j = {
                    TRIANGLES: f
                };
            return t.projection = function (e) {
                return arguments.length ? (r = e, t) : r
            }, t.origin = function (e) {
                return arguments.length ? (y = e, t) : y
            }, t.scale = function (e) {
                return arguments.length ? (x = e, t) : x
            }, t.distance = function (e) {
                return arguments.length ? (h = e, t) : h
            }, t.rotateZ = function (e) {
                return arguments.length ? (z = e, t) : z
            }, t.rotateY = function (e) {
                return arguments.length ? (l = e, t) : l
            }, t.rotateX = function (e) {
                return arguments.length ? (s = e, t) : s
            }, t.primitiveType = function (e) {
                return arguments.length ? (g = e, t) : g
            }, t.draw = function (t) {
                if ("POINTS" !== g || "LINES" !== g) return j[g](t)
            }, t
        };
    t._3d = y, Object.defineProperty(t, "__esModule", {
        value: !0
    })
});