!function (t, e) {
  "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e(t.cloud = {});
}(this, function (t) {
  "use strict";
  var r = function (t, e) {
    return (r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, e) {
      t.__proto__ = e;
    } || function (t, e) {
      for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
    })(t, e);
  };function e(t, e) {
    function n() {
      this.constructor = t;
    }r(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n());
  }var h = function () {
    return (h = Object.assign || function (t) {
      for (var e, n = 1, r = arguments.length; n < r; n++) for (var o in e = arguments[n]) Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);return t;
    }).apply(this, arguments);
  };function n(t, e, n, r) {
    var o,
        i = arguments.length,
        a = i < 3 ? e : null === r ? r = Object.getOwnPropertyDescriptor(e, n) : r;if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(t, e, n, r);else for (var s = t.length - 1; 0 <= s; s--) (o = t[s]) && (a = (i < 3 ? o(a) : 3 < i ? o(e, n, a) : o(e, n)) || a);return 3 < i && a && Object.defineProperty(e, n, a), a;
  }function p(t, a, s, c) {
    return new (s = s || Promise)(function (n, e) {
      function r(t) {
        try {
          i(c.next(t));
        } catch (t) {
          e(t);
        }
      }function o(t) {
        try {
          i(c.throw(t));
        } catch (t) {
          e(t);
        }
      }function i(t) {
        var e;t.done ? n(t.value) : ((e = t.value) instanceof s ? e : new s(function (t) {
          t(e);
        })).then(r, o);
      }i((c = c.apply(t, a || [])).next());
    });
  }function k(n, r) {
    var o,
        i,
        a,
        t,
        s = { label: 0, sent: function () {
        if (1 & a[0]) throw a[1];return a[1];
      }, trys: [], ops: [] };return t = { next: e(0), throw: e(1), return: e(2) }, "function" == typeof Symbol && (t[Symbol.iterator] = function () {
      return this;
    }), t;function e(e) {
      return function (t) {
        return function (e) {
          if (o) throw new TypeError("Generator is already executing.");for (; s;) try {
            if (o = 1, i && (a = 2 & e[0] ? i.return : e[0] ? i.throw || ((a = i.return) && a.call(i), 0) : i.next) && !(a = a.call(i, e[1])).done) return a;switch (i = 0, a && (e = [2 & e[0], a.value]), e[0]) {case 0:case 1:
                a = e;break;case 4:
                return s.label++, { value: e[1], done: false };case 5:
                s.label++, i = e[1], e = [0];continue;case 7:
                e = s.ops.pop(), s.trys.pop();continue;default:
                if (!(a = 0 < (a = s.trys).length && a[a.length - 1]) && (6 === e[0] || 2 === e[0])) {
                  s = 0;continue;
                }if (3 === e[0] && (!a || e[1] > a[0] && e[1] < a[3])) {
                  s.label = e[1];break;
                }if (6 === e[0] && s.label < a[1]) {
                  s.label = a[1], a = e;break;
                }if (a && s.label < a[2]) {
                  s.label = a[2], s.ops.push(e);break;
                }a[2] && s.ops.pop(), s.trys.pop();continue;}e = r.call(n, s);
          } catch (t) {
            e = [6, t], i = 0;
          } finally {
            o = a = 0;
          }if (5 & e[0]) throw e[1];return { value: e[0] ? e[1] : undefined, done: true };
        }([e, t]);
      };
    }
  }function o() {
    return function (t, e, n) {
      var l = n.value;n.value = function (t) {
        var e,
            n = t || {},
            r = n.success,
            o = undefined === r ? null : r,
            i = n.fail,
            a = undefined === i ? null : i,
            s = n.complete,
            c = undefined === s ? null : s,
            u = !c && !a && !o;try {
          e = l.apply(this, arguments);
        } catch (t) {
          return u ? Promise.reject(t) : (a && a(t), undefined);
        }if (e = e.then ? e : Promise.resolve(e), u) return e;e.then(function (t) {
          try {
            o && o(t), c && c(t);
          } catch (t) {
            throw t;
          }
        }).catch(function (t) {
          a && a(t), c && c(t);
        });
      };
    };
  }function T(t, e, n) {
    Array.isArray(e) || (e = e.split("."));var r = e.reduce(function (t, e) {
      return t ? t[e] : null;
    }, t);return n ? r || n : r;
  }function i(t, e) {
    return t(e = { exports: {} }, e.exports), e.exports;
  }var d,
      a,
      s = i(function (t, e) {
    var n;t.exports = (n = n || function (l) {
      var n = Object.create || function (t) {
        var e;return r.prototype = t, e = new r(), r.prototype = null, e;
      };function r() {}var t = {},
          e = t.lib = {},
          o = e.Base = { extend: function (t) {
          var e = n(this);return t && e.mixIn(t), e.hasOwnProperty("init") && this.init !== e.init || (e.init = function () {
            e.$super.init.apply(this, arguments);
          }), (e.init.prototype = e).$super = this, e;
        }, create: function () {
          var t = this.extend();return t.init.apply(t, arguments), t;
        }, init: function () {}, mixIn: function (t) {
          for (var e in t) t.hasOwnProperty(e) && (this[e] = t[e]);t.hasOwnProperty("toString") && (this.toString = t.toString);
        }, clone: function () {
          return this.init.prototype.extend(this);
        } },
          p = e.WordArray = o.extend({ init: function (t, e) {
          t = this.words = t || [], this.sigBytes = null != e ? e : 4 * t.length;
        }, toString: function (t) {
          return (t || a).stringify(this);
        }, concat: function (t) {
          var e = this.words,
              n = t.words,
              r = this.sigBytes,
              o = t.sigBytes;if (this.clamp(), r % 4) for (var i = 0; i < o; i++) {
            var a = n[i >>> 2] >>> 24 - i % 4 * 8 & 255;e[r + i >>> 2] |= a << 24 - (r + i) % 4 * 8;
          } else for (i = 0; i < o; i += 4) e[r + i >>> 2] = n[i >>> 2];return this.sigBytes += o, this;
        }, clamp: function () {
          var t = this.words,
              e = this.sigBytes;t[e >>> 2] &= 4294967295 << 32 - e % 4 * 8, t.length = l.ceil(e / 4);
        }, clone: function () {
          var t = o.clone.call(this);return t.words = this.words.slice(0), t;
        }, random: function (t) {
          for (var e, n = [], r = function (e) {
            e = e;var n = 987654321,
                r = 4294967295;return function () {
              var t = ((n = 36969 * (65535 & n) + (n >> 16) & r) << 16) + (e = 18e3 * (65535 & e) + (e >> 16) & r) & r;return t /= 4294967296, (t += .5) * (.5 < l.random() ? 1 : -1);
            };
          }, o = 0; o < t; o += 4) {
            var i = r(4294967296 * (e || l.random()));e = 987654071 * i(), n.push(4294967296 * i() | 0);
          }return new p.init(n, t);
        } }),
          i = t.enc = {},
          a = i.Hex = { stringify: function (t) {
          for (var e = t.words, n = t.sigBytes, r = [], o = 0; o < n; o++) {
            var i = e[o >>> 2] >>> 24 - o % 4 * 8 & 255;r.push((i >>> 4).toString(16)), r.push((15 & i).toString(16));
          }return r.join("");
        }, parse: function (t) {
          for (var e = t.length, n = [], r = 0; r < e; r += 2) n[r >>> 3] |= parseInt(t.substr(r, 2), 16) << 24 - r % 8 * 4;return new p.init(n, e / 2);
        } },
          s = i.Latin1 = { stringify: function (t) {
          for (var e = t.words, n = t.sigBytes, r = [], o = 0; o < n; o++) {
            var i = e[o >>> 2] >>> 24 - o % 4 * 8 & 255;r.push(String.fromCharCode(i));
          }return r.join("");
        }, parse: function (t) {
          for (var e = t.length, n = [], r = 0; r < e; r++) n[r >>> 2] |= (255 & t.charCodeAt(r)) << 24 - r % 4 * 8;return new p.init(n, e);
        } },
          c = i.Utf8 = { stringify: function (t) {
          try {
            return decodeURIComponent(escape(s.stringify(t)));
          } catch (t) {
            throw new Error("Malformed UTF-8 data");
          }
        }, parse: function (t) {
          return s.parse(unescape(encodeURIComponent(t)));
        } },
          u = e.BufferedBlockAlgorithm = o.extend({ reset: function () {
          this._data = new p.init(), this._nDataBytes = 0;
        }, _append: function (t) {
          "string" == typeof t && (t = c.parse(t)), this._data.concat(t), this._nDataBytes += t.sigBytes;
        }, _process: function (t) {
          var e = this._data,
              n = e.words,
              r = e.sigBytes,
              o = this.blockSize,
              i = r / (4 * o),
              a = (i = t ? l.ceil(i) : l.max((0 | i) - this._minBufferSize, 0)) * o,
              s = l.min(4 * a, r);if (a) {
            for (var c = 0; c < a; c += o) this._doProcessBlock(n, c);var u = n.splice(0, a);e.sigBytes -= s;
          }return new p.init(u, s);
        }, clone: function () {
          var t = o.clone.call(this);return t._data = this._data.clone(), t;
        }, _minBufferSize: 0 }),
          d = (e.Hasher = u.extend({ cfg: o.extend(), init: function (t) {
          this.cfg = this.cfg.extend(t), this.reset();
        }, reset: function () {
          u.reset.call(this), this._doReset();
        }, update: function (t) {
          return this._append(t), this._process(), this;
        }, finalize: function (t) {
          return t && this._append(t), this._doFinalize();
        }, blockSize: 16, _createHelper: function (n) {
          return function (t, e) {
            return new n.init(e).finalize(t);
          };
        }, _createHmacHelper: function (n) {
          return function (t, e) {
            return new d.HMAC.init(n, e).finalize(t);
          };
        } }), t.algo = {});return t;
    }(Math), n);
  }),
      c = (i(function (t, e) {
    var c;t.exports = (c = s, function (o) {
      var t = c,
          e = t.lib,
          n = e.WordArray,
          r = e.Hasher,
          i = t.algo,
          a = [],
          g = [];!function () {
        function t(t) {
          for (var e = o.sqrt(t), n = 2; n <= e; n++) if (!(t % n)) return;return 1;
        }function e(t) {
          return 4294967296 * (t - (0 | t)) | 0;
        }for (var n = 2, r = 0; r < 64;) t(n) && (r < 8 && (a[r] = e(o.pow(n, .5))), g[r] = e(o.pow(n, 0.3333333333333333)), r++), n++;
      }();var b = [],
          s = i.SHA256 = r.extend({ _doReset: function () {
          this._hash = new n.init(a.slice(0));
        }, _doProcessBlock: function (t, e) {
          for (var n = this._hash.words, r = n[0], o = n[1], i = n[2], a = n[3], s = n[4], c = n[5], u = n[6], l = n[7], p = 0; p < 64; p++) {
            if (p < 16) b[p] = 0 | t[e + p];else {
              var d = b[p - 15],
                  h = (d << 25 | d >>> 7) ^ (d << 14 | d >>> 18) ^ d >>> 3,
                  f = b[p - 2],
                  v = (f << 15 | f >>> 17) ^ (f << 13 | f >>> 19) ^ f >>> 10;b[p] = h + b[p - 7] + v + b[p - 16];
            }var y = r & o ^ r & i ^ o & i,
                m = (r << 30 | r >>> 2) ^ (r << 19 | r >>> 13) ^ (r << 10 | r >>> 22),
                w = l + ((s << 26 | s >>> 6) ^ (s << 21 | s >>> 11) ^ (s << 7 | s >>> 25)) + (s & c ^ ~s & u) + g[p] + b[p];l = u, u = c, c = s, s = a + w | 0, a = i, i = o, o = r, r = w + (m + y) | 0;
          }n[0] = n[0] + r | 0, n[1] = n[1] + o | 0, n[2] = n[2] + i | 0, n[3] = n[3] + a | 0, n[4] = n[4] + s | 0, n[5] = n[5] + c | 0, n[6] = n[6] + u | 0, n[7] = n[7] + l | 0;
        }, _doFinalize: function () {
          var t = this._data,
              e = t.words,
              n = 8 * this._nDataBytes,
              r = 8 * t.sigBytes;return e[r >>> 5] |= 128 << 24 - r % 32, e[14 + (64 + r >>> 9 << 4)] = o.floor(n / 4294967296), e[15 + (64 + r >>> 9 << 4)] = n, t.sigBytes = 4 * e.length, this._process(), this._hash;
        }, clone: function () {
          var t = r.clone.call(this);return t._hash = this._hash.clone(), t;
        } });t.SHA256 = r._createHelper(s), t.HmacSHA256 = r._createHmacHelper(s);
    }(Math), c.SHA256);
  }), i(function (t, e) {
    var n;t.exports = (n = s, undefined);
  }), i(function (t, e) {
    t.exports = s.HmacSHA256;
  })),
      u = i(function (t, e) {
    var n;t.exports = (n = s, function () {
      var c = n.lib.WordArray;n.enc.Base64 = { stringify: function (t) {
          var e = t.words,
              n = t.sigBytes,
              r = this._map;t.clamp();for (var o = [], i = 0; i < n; i += 3) for (var a = (e[i >>> 2] >>> 24 - i % 4 * 8 & 255) << 16 | (e[i + 1 >>> 2] >>> 24 - (i + 1) % 4 * 8 & 255) << 8 | e[i + 2 >>> 2] >>> 24 - (i + 2) % 4 * 8 & 255, s = 0; s < 4 && i + .75 * s < n; s++) o.push(r.charAt(a >>> 6 * (3 - s) & 63));var c = r.charAt(64);if (c) for (; o.length % 4;) o.push(c);return o.join("");
        }, parse: function (t) {
          var e = t.length,
              n = this._map,
              r = this._reverseMap;if (!r) {
            r = this._reverseMap = [];for (var o = 0; o < n.length; o++) r[n.charCodeAt(o)] = o;
          }var i = n.charAt(64);if (i) {
            var a = t.indexOf(i);-1 !== a && (e = a);
          }return function (t, e, n) {
            for (var r = [], o = 0, i = 0; i < e; i++) if (i % 4) {
              var a = n[t.charCodeAt(i - 1)] << i % 4 * 2,
                  s = n[t.charCodeAt(i)] >>> 6 - i % 4 * 2;r[o >>> 2] |= (a | s) << 24 - o % 4 * 8, o++;
            }return c.create(r, o);
          }(t, e, r);
        }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" };
    }(), n.enc.Base64);
  }),
      l = i(function (t, e) {
    var a;t.exports = (a = s, function (l) {
      var t = a,
          e = t.lib,
          n = e.WordArray,
          r = e.Hasher,
          o = t.algo,
          S = [];!function () {
        for (var t = 0; t < 64; t++) S[t] = 4294967296 * l.abs(l.sin(t + 1)) | 0;
      }();var i = o.MD5 = r.extend({ _doReset: function () {
          this._hash = new n.init([1732584193, 4023233417, 2562383102, 271733878]);
        }, _doProcessBlock: function (t, e) {
          for (var n = 0; n < 16; n++) {
            var r = e + n,
                o = t[r];t[r] = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8);
          }var i = this._hash.words,
              a = t[e + 0],
              s = t[e + 1],
              c = t[e + 2],
              u = t[e + 3],
              l = t[e + 4],
              p = t[e + 5],
              d = t[e + 6],
              h = t[e + 7],
              f = t[e + 8],
              v = t[e + 9],
              y = t[e + 10],
              m = t[e + 11],
              w = t[e + 12],
              g = t[e + 13],
              b = t[e + 14],
              _ = t[e + 15],
              A = i[0],
              x = i[1],
              q = i[2],
              R = i[3];A = k(A, x, q, R, a, 7, S[0]), R = k(R, A, x, q, s, 12, S[1]), q = k(q, R, A, x, c, 17, S[2]), x = k(x, q, R, A, u, 22, S[3]), A = k(A, x, q, R, l, 7, S[4]), R = k(R, A, x, q, p, 12, S[5]), q = k(q, R, A, x, d, 17, S[6]), x = k(x, q, R, A, h, 22, S[7]), A = k(A, x, q, R, f, 7, S[8]), R = k(R, A, x, q, v, 12, S[9]), q = k(q, R, A, x, y, 17, S[10]), x = k(x, q, R, A, m, 22, S[11]), A = k(A, x, q, R, w, 7, S[12]), R = k(R, A, x, q, g, 12, S[13]), q = k(q, R, A, x, b, 17, S[14]), A = T(A, x = k(x, q, R, A, _, 22, S[15]), q, R, s, 5, S[16]), R = T(R, A, x, q, d, 9, S[17]), q = T(q, R, A, x, m, 14, S[18]), x = T(x, q, R, A, a, 20, S[19]), A = T(A, x, q, R, p, 5, S[20]), R = T(R, A, x, q, y, 9, S[21]), q = T(q, R, A, x, _, 14, S[22]), x = T(x, q, R, A, l, 20, S[23]), A = T(A, x, q, R, v, 5, S[24]), R = T(R, A, x, q, b, 9, S[25]), q = T(q, R, A, x, u, 14, S[26]), x = T(x, q, R, A, f, 20, S[27]), A = T(A, x, q, R, g, 5, S[28]), R = T(R, A, x, q, c, 9, S[29]), q = T(q, R, A, x, h, 14, S[30]), A = M(A, x = T(x, q, R, A, w, 20, S[31]), q, R, p, 4, S[32]), R = M(R, A, x, q, f, 11, S[33]), q = M(q, R, A, x, m, 16, S[34]), x = M(x, q, R, A, b, 23, S[35]), A = M(A, x, q, R, s, 4, S[36]), R = M(R, A, x, q, l, 11, S[37]), q = M(q, R, A, x, h, 16, S[38]), x = M(x, q, R, A, y, 23, S[39]), A = M(A, x, q, R, g, 4, S[40]), R = M(R, A, x, q, a, 11, S[41]), q = M(q, R, A, x, u, 16, S[42]), x = M(x, q, R, A, d, 23, S[43]), A = M(A, x, q, R, v, 4, S[44]), R = M(R, A, x, q, w, 11, S[45]), q = M(q, R, A, x, _, 16, S[46]), A = E(A, x = M(x, q, R, A, c, 23, S[47]), q, R, a, 6, S[48]), R = E(R, A, x, q, h, 10, S[49]), q = E(q, R, A, x, b, 15, S[50]), x = E(x, q, R, A, p, 21, S[51]), A = E(A, x, q, R, w, 6, S[52]), R = E(R, A, x, q, u, 10, S[53]), q = E(q, R, A, x, y, 15, S[54]), x = E(x, q, R, A, s, 21, S[55]), A = E(A, x, q, R, f, 6, S[56]), R = E(R, A, x, q, _, 10, S[57]), q = E(q, R, A, x, d, 15, S[58]), x = E(x, q, R, A, g, 21, S[59]), A = E(A, x, q, R, l, 6, S[60]), R = E(R, A, x, q, m, 10, S[61]), q = E(q, R, A, x, c, 15, S[62]), x = E(x, q, R, A, v, 21, S[63]), i[0] = i[0] + A | 0, i[1] = i[1] + x | 0, i[2] = i[2] + q | 0, i[3] = i[3] + R | 0;
        }, _doFinalize: function () {
          var t = this._data,
              e = t.words,
              n = 8 * this._nDataBytes,
              r = 8 * t.sigBytes;e[r >>> 5] |= 128 << 24 - r % 32;var o = l.floor(n / 4294967296),
              i = n;e[15 + (64 + r >>> 9 << 4)] = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8), e[14 + (64 + r >>> 9 << 4)] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8), t.sigBytes = 4 * (e.length + 1), this._process();for (var a = this._hash, s = a.words, c = 0; c < 4; c++) {
            var u = s[c];s[c] = 16711935 & (u << 8 | u >>> 24) | 4278255360 & (u << 24 | u >>> 8);
          }return a;
        }, clone: function () {
          var t = r.clone.call(this);return t._hash = this._hash.clone(), t;
        } });function k(t, e, n, r, o, i, a) {
        var s = t + (e & n | ~e & r) + o + a;return (s << i | s >>> 32 - i) + e;
      }function T(t, e, n, r, o, i, a) {
        var s = t + (e & r | n & ~r) + o + a;return (s << i | s >>> 32 - i) + e;
      }function M(t, e, n, r, o, i, a) {
        var s = t + (e ^ n ^ r) + o + a;return (s << i | s >>> 32 - i) + e;
      }function E(t, e, n, r, o, i, a) {
        var s = t + (n ^ (e | ~r)) + o + a;return (s << i | s >>> 32 - i) + e;
      }t.MD5 = r._createHelper(i), t.HmacMD5 = r._createHmacHelper(i);
    }(Math), a.MD5);
  });(a = d = d || {})[a.MTOP = 1] = "MTOP", a[a.MY = 2] = "MY", a[a.GATEWAY = 3] = "GATEWAY";var f,
      v = (e(y, f = Error), y);function y() {
    return null !== f && f.apply(this, arguments) || this;
  }function m(t) {
    this.options = t || {}, this.options.dataProxyGatewayUrl = this.options.dataProxyGatewayUrl || this.options.gatewayUrl;
  }var w = (g.prototype.init = function (e, n) {
    return p(this, undefined, undefined, function () {
      return k(this, function (t) {
        switch (t.label) {case 0:
            return this.options = h({}, e), this.proxy = n, this.tasks = [], this.inited = true, [4, this.listenNetworkChange()];case 1:
            return t.sent(), this.flushGatewayRequestQueue(), this.pauseExecTask = false, [2];}
      });
    });
  }, g.prototype.listenNetworkChange = function () {
    return p(this, undefined, undefined, function () {
      var e,
          n = this;return k(this, function (t) {
        switch (t.label) {case 0:
            return t.trys.push([0, 2,, 3]), [4, this.exec({ url: "my.getNetworkType" })];case 1:
            return e = t.sent(), this.networkType = e.networkType, window.my && window.my.onNetworkStatusChange && window.my.onNetworkStatusChange(function (t) {
              t && t.networkType && (n.networkType = t.networkType);
            }), [3, 3];case 2:
            return t.sent(), [3, 3];case 3:
            return [2];}
      });
    });
  }, g.getRequestType = function (t) {
    return 0 === t.indexOf("mtop.") ? d.MTOP : 0 === t.indexOf("my.") ? d.MY : d.GATEWAY;
  }, g.prototype.verifyResponse = function (e, n, r) {
    return p(this, undefined, undefined, function () {
      return k(this, function (t) {
        switch (t.label) {case 0:
            if (T(r, "mc-code") || T(e, "errCode") || T(e, "error_response.code"), n.__is_retry_task__) return this.tryThrowError(e, r), [2, e];t.label = 1;case 1:
            return t.trys.push([1, 3,, 4]), this.tryThrowError(e, r), [2, e];case 2:
            return [2, t.sent()];case 3:
            throw t.sent();case 4:
            return [2];}
      });
    });
  }, g.prototype.tryThrowError = function (t, e) {
    var n = T(e, "mc-msg") || T(t, "errMsg") || T(t, "error_response.msg"),
        r = T(e, "mc-code") || T(t, "errCode") || T(t, "error_response.code");if (r && "200" != r) {
      var o = new v(r + ":::" + n);throw o.code = r, o.msg = n, o;
    }
  }, g.prototype.sendGatewayRequest = function (r) {
    return p(this, undefined, undefined, function () {
      var e,
          n = this;return k(this, function (t) {
        switch (t.label) {case 0:
            return this.pauseExecTask ? [2, new Promise(function (t, e) {
              n.tasks.push({ detail: r, success: t, fail: e });
            })] : [3, 1];case 1:
            return r = this.createGatewayRequest(r), [4, this.proxy.apply(h({}, r), d.GATEWAY)];case 2:
            return e = t.sent(), [4, this.verifyResponse(T(e, "data"), r, T(e, "headers"))];case 3:
            return [2, t.sent()];}
      });
    });
  }, g.prototype.flushGatewayRequestQueue = function (o) {
    var i = this;undefined === o && (o = false), this.tasks.forEach(function (t) {
      var e = t.detail,
          n = t.success,
          r = t.fail;if (o) return r("初始化失败");i.exec(e, d.GATEWAY).then(n).catch(r);
    }), this.tasks = [];
  }, g.prototype.exec = function (e, n) {
    return p(this, undefined, undefined, function () {
      return k(this, function (t) {
        switch (t.label) {case 0:
            if (n = n || g.getRequestType(e.url), !this.inited) throw new Error("请先调用cloud.init()");return n !== d.GATEWAY ? [3, 2] : [4, this.sendGatewayRequest(e)];case 1:
            return [2, t.sent()];case 2:
            return [4, this.proxy.apply(e, n)];case 3:
            return [2, t.sent()];}
      });
    });
  }, g.prototype.getHttpRequestSign = function (t, e, n, r, o) {
    if (this.options.signSecret) {
      var i = o;delete r["mc-sign"];var a = e + "\n" + u.stringify(l(i)) + "\napplication/json\n" + Object.keys(r).filter(function (t) {
        return (/^mc-/.test(t)
        );
      }).sort().map(function (t) {
        return t.toLowerCase() + ":" + r[t];
      }).join("\n") + "\n" + t + (n ? "?" + n : "");return u.stringify(c(a, this.options.signSecret));
    }
  }, g.prototype.createGatewayRequest = function (t) {
    var e = this.options,
        n = e.sessionKey,
        r = e.appKey,
        o = e.requestId,
        i = e.miniappId,
        a = e.openId,
        s = e.unionId,
        c = e.cloudId;t.method = "POST";var u = h(h({}, t.headers), { "Content-Type": "application/json", "mc-timestamp": "" + Date.now(), "mc-session": n });a && (u["mc-open-id"] = a), c && (u["mc-cloud-id"] = c), s && (u["mc-union-id"] = s), r && (u["mc-appKey"] = r), i && (u["mc-miniapp-id"] = i), o && (u["mc-request-id"] = o), t.env && (u["mc-env"] = t.env), this.networkType && (u["mc-network"] = this.networkType), u["mc-session"] || delete u["mc-session"], t.rawData = t.rawData || t.data, "object" == typeof t.data && (t.data = JSON.stringify(t.data));var l = this.getHttpRequestSign(t.url, t.method, "", u, t.data);return h(h({}, t), { url: "" + t.url, headers: h(h({}, u), { sign: l, "eagleeye-traceid": o }) });
  }, g);function g() {
    this.inited = false, this.pauseExecTask = false;
  }function b(t, e) {
    this.request = e, this.options = t;
  }new w();var _,
      A = (e(x, _ = b), x.prototype.invoke = function (e, n, r, o) {
    return undefined === r && (r = "main"), p(this, undefined, undefined, function () {
      return k(this, function (t) {
        switch (t.label) {case 0:
            return [4, this.fcRequest({ fcName: e, handler: r, data: n, options: o })];case 1:
            return [2, t.sent()];}
      });
    });
  }, x.prototype.fcRequest = function (e) {
    return p(this, undefined, undefined, function () {
      return k(this, function (t) {
        switch (t.label) {case 0:
            return [4, this.request.exec({ env: this.options.env || "online", url: "fc", data: e }, d.GATEWAY)];case 1:
            return [2, t.sent()];}
      });
    });
  }, n([o()], x.prototype, "invoke", null), x);function x() {
    return null !== _ && _.apply(this, arguments) || this;
  }var q,
      M = "mtop.taobao.miniapp.cloud.store.config.v2.get",
      E = "mtop.taobao.miniapp.cloud.store.config.v2.seller.get",
      O = "mtop.taobao.miniapp.cloud.store.file.v2.save",
      P = "mtop.taobao.miniapp.cloud.store.file.v2.seller.save",
      R = "mtop.taobao.miniapp.cloud.store.file.v2.delete",
      S = "mtop.taobao.miniapp.cloud.store.file.v2.seller.delete",
      I = "mtop.taobao.miniapp.cloud.store.file.v2.list",
      B = "mtop.taobao.miniapp.cloud.store.file.v2.seller.list",
      H = "other",
      C = (e(D, q = b), D.prototype.parseUploadResult = function (t, e) {
    return this.parsePostUploadResult(t, e);
  }, D.prototype.parsePostUploadResult = function (t, e) {
    var n, r, o;try {
      var i = JSON.parse(e.data);r = i.fileId, n = i.url, o = i.message;
    } catch (t) {}return { imageUrl: n, specialId: r, message: o };
  }, D.prototype.uploadFile = function (S) {
    return p(this, undefined, undefined, function () {
      var e, n, r, o, i, a, s, c, u, l, p, d, h, f, v, y, m, w, g, b, _, A, x, q, R;return k(this, function (t) {
        switch (t.label) {case 0:
            e = S.filePath, n = S.fileType, r = undefined === n ? H : n, o = S.fileName, i = undefined === o ? "miniappfile" : o, a = S.seller, s = undefined !== a && a, c = S.dirId, t.label = 1;case 1:
            return t.trys.push([1, 3,, 4]), l = s ? E : M, [4, this.storageRequest(l, { newContainer: true, cloudPath: i, fileType: r, sellerSpace: s, dirId: c })];case 2:
            return u = t.sent(), [3, 4];case 3:
            throw p = t.sent(), new Error("获取配置错误" + (p.message || p.toString()));case 4:
            return d = T(u, ["data", "model", r], {}), h = d.url, f = undefined === h ? "" : h, v = d.formData, y = undefined === v ? null : v, m = d.headers, (w = { url: f, fileType: r, header: undefined === m ? null : m, formData: y, filePath: e, fileName: "file" }).header && w.header.Authorization && (w.formData.Authorization = w.header.Authorization), i && (w.formData.localFileName = Date.now() + "-" + function (t) {
              if (!t) return "file";var e = t.lastIndexOf("/");return 0 <= e ? t.substr(e + 1) : t;
            }(i)), w.header ? "image" !== r && (w.header.origin = w.header.origin || "https://miniapp-cloud.taobao.com", w.header.referer = w.header.referer || "https://miniapp-cloud.taobao.com") : delete w.header, w.formData || delete w.formData, [4, this.storageRequest("my.uploadFile", w)];case 5:
            if (g = t.sent(), b = this.parseUploadResult(r, g), _ = b.imageUrl, A = b.specialId, x = b.message, !A) throw new Error(x || "upload exception:unknown error");return q = { fileType: r, specialId: A, url: _, cloudPath: i, sellerSpace: s }, [4, this.storageRequest(s ? P : O, q)];case 6:
            if (!T(R = t.sent(), "data.model.fileId")) throw new Error(T(R, ["result", "msgInfo"], "上传文件失败"));return [2, T(R, "data.model")];}
      });
    });
  }, D.prototype.deleteFile = function (c) {
    return p(this, undefined, undefined, function () {
      var e, n, r, o, i, a, s;return k(this, function (t) {
        switch (t.label) {case 0:
            return e = c.fileId, n = c.fileType, r = undefined === n ? H : n, o = c.seller, i = undefined !== o && o, a = Array.isArray(e) ? e : [e], a = JSON.stringify(a), [4, this.storageRequest(i ? S : R, { fileType: r, fileIds: a, sellerSpace: i })];case 1:
            if (T(s = t.sent(), ["data", "model"])) return [2, true];throw new Error(T(s, ["data", "msgInfo"]));}
      });
    });
  }, D.prototype.getTempFileURL = function (s) {
    return p(this, undefined, undefined, function () {
      var e, n, r, o, i, a;return k(this, function (t) {
        switch (t.label) {case 0:
            if (e = s.fileId, n = s.seller, r = undefined !== n && n, !e) throw new Error("缺少fileId,请检查参数");return o = Array.isArray(e) ? e : [e], o = JSON.stringify(o), [4, this.storageRequest(r ? B : I, { fileIds: o, sellerSpace: r })];case 1:
            if (i = t.sent(), a = T(i, ["data", "model"])) return [2, a];throw new Error(T(i, ["data", "msgInfo"]));}
      });
    });
  }, D.prototype.downloadByFileId = function (l) {
    return p(this, undefined, undefined, function () {
      var e, n, r, o, i, a, s, c, u;return k(this, function (t) {
        switch (t.label) {case 0:
            if (e = l.fileId, n = l.cache, !e) throw new Error("缺少fileId,请检查参数");return r = Array.isArray(e) ? e : [e], [4, this.storageRequest(I, { fileIds: JSON.stringify(r) })];case 1:
            o = t.sent(), i = T(o, ["data", "model"]) || [], a = [], s = 0, t.label = 2;case 2:
            return s < i.length ? (c = (i[s] || {}).url, [4, this._downloadByUrl(c, n)]) : [3, 5];case 3:
            (u = t.sent()) && a.push(u), t.label = 4;case 4:
            return s++, [3, 2];case 5:
            return [2, a];}
      });
    });
  }, D.prototype.storageRequest = function (n, r, o) {
    return p(this, undefined, undefined, function () {
      var e;return k(this, function (t) {
        switch (t.label) {case 0:
            return e = "test" === this.options.env ? "test" : "online", (r = r || {}).env = e, [4, this.request.exec({ url: n, data: r }, o)];case 1:
            return [2, t.sent()];}
      });
    });
  }, D.prototype._downloadByUrl = function (r, o) {
    return p(this, undefined, undefined, function () {
      var e, n;return k(this, function (t) {
        switch (t.label) {case 0:
            return r ? o ? [4, this.request.proxy.apply({ url: "my.getStorage", data: { key: r } })] : [3, 2] : [2, null];case 1:
            if (e = t.sent().data) return [2, e];t.label = 2;case 2:
            return [4, this.request.exec({ url: "my.downloadFile", data: { url: r } })];case 3:
            return n = t.sent().apFilePath, o ? [4, this.request.exec({ url: "my.setStorage", data: { key: r, data: n } })] : [3, 5];case 4:
            t.sent(), t.label = 5;case 5:
            return [2, n];}
      });
    });
  }, n([o()], D.prototype, "uploadFile", null), n([o()], D.prototype, "deleteFile", null), n([o()], D.prototype, "getTempFileURL", null), n([o()], D.prototype, "downloadByFileId", null), D);function D() {
    return null !== q && q.apply(this, arguments) || this;
  }var j = (Object.defineProperty(G.prototype, "name", { get: function () {
      return this._coll;
    }, enumerable: true, configurable: true }), G.prototype.aggregate = function (n) {
    return p(this, undefined, undefined, function () {
      var e;return k(this, function (t) {
        switch (t.label) {case 0:
            return Array.isArray(n) || (n = [n]), e = { aggregate_pipelines: n, collection_name: this._coll }, [4, this._db.dbRequest("miniapp.cloud.db.collection.aggregate", e)];case 1:
            return [2, t.sent()];}
      });
    });
  }, G.prototype.count = function (n) {
    return p(this, undefined, undefined, function () {
      var e;return k(this, function (t) {
        switch (t.label) {case 0:
            return e = { filter: n, collection_name: this._coll }, [4, this._db.dbRequest("miniapp.cloud.db.collection.count", e)];case 1:
            return [2, t.sent()];}
      });
    });
  }, G.prototype.deleteMany = function (n) {
    return p(this, undefined, undefined, function () {
      var e;return k(this, function (t) {
        switch (t.label) {case 0:
            return e = { filter: n, collection_name: this._coll }, [4, this._db.dbRequest("miniapp.cloud.db.collection.remove", e)];case 1:
            return [2, t.sent()];}
      });
    });
  }, G.prototype.find = function (n, r) {
    return undefined === r && (r = {}), p(this, undefined, undefined, function () {
      var e;return k(this, function (t) {
        switch (t.label) {case 0:
            return e = { displayed_fields: r.projection, order_by: r.sort, skip: r.skip, limit: r.limit, filter: n, collection_name: this._coll }, [4, this._db.dbRequest("miniapp.cloud.db.collection.get", e)];case 1:
            return [2, t.sent()];}
      });
    });
  }, G.prototype.replaceOne = function (n, r) {
    return p(this, undefined, undefined, function () {
      var e;return k(this, function (t) {
        switch (t.label) {case 0:
            return e = { filter: n, new_record: r, collection_name: this._coll }, [4, this._db.dbRequest("miniapp.cloud.db.collection.replace", e)];case 1:
            return [2, t.sent()];}
      });
    });
  }, G.prototype.insertOne = function (n) {
    return p(this, undefined, undefined, function () {
      var e;return k(this, function (t) {
        switch (t.label) {case 0:
            return e = { record: n, collection_name: this._coll }, [4, this._db.dbRequest("miniapp.cloud.db.collection.add", e)];case 1:
            return [2, t.sent()];}
      });
    });
  }, G.prototype.insertMany = function (n) {
    return p(this, undefined, undefined, function () {
      var e;return k(this, function (t) {
        switch (t.label) {case 0:
            if (e = { records: n, collection_name: this._coll }, !Array.isArray(n)) throw new Error("带插入的数据只能为数组");return [4, this._db.dbRequest("miniapp.cloud.db.collection.addMany", e)];case 1:
            return [2, t.sent()];}
      });
    });
  }, G.prototype.updateMany = function (n, r, o) {
    return p(this, undefined, undefined, function () {
      var e;return k(this, function (t) {
        switch (t.label) {case 0:
            return e = { filter: n, action: r, arrayFilters: o, collection_name: this._coll }, [4, this._db.dbRequest("miniapp.cloud.db.collection.update", e)];case 1:
            return [2, t.sent()];}
      });
    });
  }, G.prototype.createIndex = function (n, r, o) {
    return p(this, undefined, undefined, function () {
      var e;return k(this, function (t) {
        switch (t.label) {case 0:
            return e = { index_name: n, unique: r, fields: o, collection_name: this._coll }, [4, this._db.dbRequest("miniapp.cloud.db.index.create", e)];case 1:
            return [2, t.sent()];}
      });
    });
  }, n([o()], G.prototype, "aggregate", null), n([o()], G.prototype, "count", null), n([o()], G.prototype, "deleteMany", null), n([o()], G.prototype, "find", null), n([o()], G.prototype, "replaceOne", null), n([o()], G.prototype, "insertOne", null), n([o()], G.prototype, "insertMany", null), n([o()], G.prototype, "updateMany", null), n([o()], G.prototype, "createIndex", null), G);function G(t, e) {
    this._db = t, this._coll = e;
  }var U,
      N = (e(z, U = b), z.prototype.collection = function (t) {
    if (!t) throw new Error("集合名称不能为空");return new j(this, t);
  }, z.prototype.createCollection = function (n, t) {
    return p(this, undefined, undefined, function () {
      var e;return k(this, function (t) {
        switch (t.label) {case 0:
            return e = { collection_name: n }, [4, this.dbRequest("miniapp.cloud.db.collection.create", e)];case 1:
            return [2, t.sent()];}
      });
    });
  }, z.prototype.dbRequest = function (n, r) {
    return p(this, undefined, undefined, function () {
      var e;return k(this, function (t) {
        switch (t.label) {case 0:
            return "test" !== (e = this.options.env) && (e = "online"), r = h(h({}, r), { env: e }), [4, this.request.exec({ env: e, url: "db/" + n, data: r }, d.GATEWAY)];case 1:
            return [2, t.sent()];}
      });
    });
  }, n([o()], z.prototype, "createCollection", null), z);function z() {
    return null !== U && U.apply(this, arguments) || this;
  }var W,
      Y = (e(F, W = b), F.prototype.invoke = function (d) {
    return p(this, undefined, undefined, function () {
      var e, i, a, s, c, u, l, p;return k(this, function (t) {
        switch (t.label) {case 0:
            return e = d.data, i = d.headers, a = d.authScope, s = d.api, e = e || {}, Object.keys(e).forEach(function (t) {
              e[t] = "string" == typeof e[t] ? e[t] : JSON.stringify(e[t]);
            }), c = { apiName: s, httpHeaders: i, data: e }, [4, this.topRequest(c)];case 1:
            if (!T(u = t.sent(), "error_response")) return [2, u];if (l = T(u, "error_response.code"), (p = my && my.canIUse("qn.cleanToken")) && !a && (a = "*"), 26 != l && 27 != l && 53 != l || !a) return [3, 9];t.label = 2;case 2:
            return t.trys.push([2, 8,, 9]), p ? (console.log("call my.qn.cleanToken"), [4, my.qn.cleanToken()]) : [3, 4];case 3:
            t.sent(), t.label = 4;case 4:
            return [4, (n = my.authorize, r = { scopes: a }, n ? (r = r || {}, new Promise(function (t, e) {
              n.call(o || my, h(h({}, r), { success: t, fail: e }));
            })) : Promise.reject("未实现my.api"))];case 5:
            return [4, t.sent()];case 6:
            return t.sent(), [4, this.topRequest(c)];case 7:
            return T(u = t.sent(), "error_response") ? [3, 9] : [2, u];case 8:
            return t.sent(), [3, 9];case 9:
            throw new Error("" + JSON.stringify(T(u, "error_response")));}var n, r, o;
      });
    });
  }, F.prototype.topRequest = function (e) {
    return p(this, undefined, undefined, function () {
      return k(this, function (t) {
        switch (t.label) {case 0:
            return [4, this.request.exec({ env: this.options.env || "online", url: "top", data: e }, d.GATEWAY)];case 1:
            return [2, t.sent()];}
      });
    });
  }, n([o()], F.prototype, "invoke", null), F);function F() {
    return null !== W && W.apply(this, arguments) || this;
  }var J,
      K = (e(L, J = b), L.prototype.invoke = function (o) {
    return p(this, undefined, undefined, function () {
      var e, n, r;return k(this, function (t) {
        switch (t.label) {case 0:
            return e = o.data, n = o.headers, r = o.api, [4, this.topRequest({ apiName: r, httpHeaders: n, data: e })];case 1:
            return [2, t.sent()];}
      });
    });
  }, L.prototype.topRequest = function (e) {
    return p(this, undefined, undefined, function () {
      return k(this, function (t) {
        switch (t.label) {case 0:
            return [4, this.request.exec({ url: "process", data: e }, d.GATEWAY)];case 1:
            return [2, t.sent()];}
      });
    });
  }, n([o()], L.prototype, "invoke", null), L);function L() {
    return null !== J && J.apply(this, arguments) || this;
  }var Q,
      X = (e($, Q = b), $.prototype.invoke = function (i) {
    return p(this, undefined, undefined, function () {
      var e, n, r, o;return k(this, function (t) {
        switch (t.label) {case 0:
            return e = i.data, n = i.headers, r = i.api, o = i.targetAppKey, [4, this.qimenRequest({ apiName: r, httpHeaders: n, targetAppKey: o, data: e })];case 1:
            return [2, t.sent()];}
      });
    });
  }, $.prototype.qimenRequest = function (e) {
    return p(this, undefined, undefined, function () {
      return k(this, function (t) {
        switch (t.label) {case 0:
            return [4, this.request.exec({ env: this.options.env || "online", url: "qimen", data: e }, d.GATEWAY)];case 1:
            return [2, t.sent()];}
      });
    });
  }, n([o()], $.prototype, "invoke", null), $);function $() {
    return null !== Q && Q.apply(this, arguments) || this;
  }var V,
      Z = (e(tt, V = b), tt.prototype.httpRequest = function (s) {
    return p(this, undefined, undefined, function () {
      var e, n, r, o, i, a;return k(this, function (t) {
        switch (t.label) {case 0:
            return e = s.body, n = s.params, r = s.headers, o = s.path, i = s.method, a = s.exts, [4, this.innerRequest({ path: o, headers: r, body: e, queryString: n, method: i, options: a })];case 1:
            return [2, t.sent()];}
      });
    });
  }, tt.prototype.innerRequest = function (e) {
    return p(this, undefined, undefined, function () {
      return k(this, function (t) {
        switch (t.label) {case 0:
            return [4, this.request.exec({ env: this.options.env || "online", url: "cloudHttp", data: e }, d.GATEWAY)];case 1:
            return [2, t.sent()];}
      });
    });
  }, n([o()], tt.prototype, "httpRequest", null), tt);function tt() {
    return null !== V && V.apply(this, arguments) || this;
  }var et,
      nt = (e(rt, et = Error), rt.prototype.toString = function () {
    return (this.code || "") + " " + (this.message || "");
  }, rt);function rt() {
    return null !== et && et.apply(this, arguments) || this;
  }var ot,
      it = (e(at, ot = m), at.getMtopErrorMsg = function (t) {
    var e = new nt();if (!t) return e.code = "500", e.message = "mtop请求错误", e;var n,
        r,
        o = t.ret && t.ret[0] && t.ret[0].split("::");return t.data = t.data || T(t, ["err", "data"]), t.data && t.data.errCode && (n = t.data.errCode, r = t.data.errMessage || t.data.errMsg), t.data && t.data.errorCode && (n = t.data.errorCode), t.data && t.data.errorMessage && (r = t.data.errorMessage), t.data && t.data.success || o && "SUCCESS" === o[0] && !n ? undefined : (n = n || (o && "FAIL_SYS_SESSION_EXPIRED" === o[0] ? "904" : "500"), r = r || o && o[1] || "mtop请求错误", e.code = n, e.message = r, e);
  }, at.GATEWAY_APIS = { "db/miniapp.cloud.db.collection.create": "mtop.taobao.dataproxy.collection.create", "db/miniapp.cloud.db.index.create": "mtop.taobao.dataproxy.index.create", "db/miniapp.cloud.db.collection.aggregate": "mtop.taobao.dataproxy.record.aggregate", "db/miniapp.cloud.db.collection.count": "mtop.taobao.dataproxy.record.count", "db/miniapp.cloud.db.collection.remove": "mtop.taobao.dataproxy.record.delete", "db/miniapp.cloud.db.collection.get": "mtop.taobao.dataproxy.record.select", "db/miniapp.cloud.db.collection.replace": "mtop.taobao.dataproxy.record.replace", "db/miniapp.cloud.db.collection.add": "mtop.taobao.dataproxy.record.insert", "db/miniapp.cloud.db.collection.addMany": "mtop.taobao.dataproxy.record.batch.insert", "db/miniapp.cloud.db.collection.update": "mtop.taobao.dataproxy.record.update", fc: "mtop.miniapp.cloud.invoke.fc", top: "mtop.miniapp.cloud.invoke.top", qimen: "mtop.miniapp.cloud.invoke.qimen.cloud", process: "mtop.miniapp.cloud.invoke.process", cloudHttp: "mtop.miniapp.cloud.application.request" }, at);function at() {
    var t = null !== ot && ot.apply(this, arguments) || this;return t.sendMtop = function (i, a, s) {
      return p(t, undefined, undefined, function () {
        return k(this, function (t) {
          return console.log("sendMtop", a), [2, new Promise(function (n, r) {
            var e = 1,
                o = function () {
              my.sendMtop(h(h({ api: i, v: "1.0", data: a, method: "POST", needLogin: true, sessionOption: "AutoLoginAndManualLogin" }, s), { success: function (t) {
                  var e = at.getMtopErrorMsg(t);e ? r(e) : n(t);
                }, fail: function (t) {
                  if (1 === t.error_type && 0 < e) return --e, o();r(at.getMtopErrorMsg(t));
                } }));
            };o();
          })];
        });
      });
    }, t.invokeMyApi = function (n, r) {
      return p(t, undefined, undefined, function () {
        return k(this, function (t) {
          return [2, new Promise(function (t, e) {
            return n = n.replace(/^my\./, ""), my[n](h(h({}, r), { success: t, fail: e }));
          })];
        });
      });
    }, t.sendHttpRequest = function (r, o, i, a) {
      return p(t, undefined, undefined, function () {
        var e = this;return k(this, function (t) {
          return [2, new Promise(function (n, t) {
            my.httpRequest({ url: e.options.gatewayUrl + "/" + r, data: o, dataType: "text", method: a, headers: i, success: function (e) {
                try {
                  n(h(h({}, e), { data: JSON.parse(e.data) }));
                } catch (t) {
                  n(h(h({}, e), { data: e.data }));
                }
              }, fail: t });
          })];
        });
      });
    }, t.apply = function (u, l) {
      return p(t, undefined, undefined, function () {
        var e, n, r, o, i, a, s, c;return k(this, function (t) {
          switch (t.label) {case 0:
              return e = u.url, n = u.data, r = u.headers, o = u.mtopOptions, i = u.method, l !== d.MTOP ? [3, 2] : [4, this.sendMtop(e, n, o)];case 1:
              return [2, t.sent()];case 2:
              return l !== d.GATEWAY ? [3, 8] : this.options.gatewayUrl ? [4, this.sendHttpRequest(e, n, r, i)] : [3, 4];case 3:
              return [2, t.sent()];case 4:
              return t.trys.push([4, 6,, 7]), u.rawData && Object.keys(u.rawData).forEach(function (t) {
                "object" == typeof u.rawData[t] && (u.rawData[t] = JSON.stringify(u.rawData[t]));
              }), [4, this.sendMtop(at.GATEWAY_APIS[e], h(h({}, u.rawData), { protocols: JSON.stringify(r) }), o)];case 5:
              return a = t.sent(), (s = a && a.data || {}).errCode ? [2, { headers: { "mc-code": s.errCode, "mc-msg": s.errMessage }, data: {} }] : [2, { headers: { "mc-code": 200, "mc-msg": "请求成功" }, data: T(s, ["data"]) || {} }];case 6:
              return (c = t.sent()) && c.code ? [2, { headers: { "mc-code": c.code, "mc-msg": c.message } }] : [2, { headers: { "mc-code": 500, "mc-msg": c.message || c } }];case 7:
              return [3, 10];case 8:
              return [4, this.invokeMyApi(e, n)];case 9:
              return [2, t.sent()];case 10:
              return [2];}
        });
      });
    }, t;
  }var st = (ct.prototype.init = function (i, a) {
    return p(this, undefined, undefined, function () {
      var n, r, o;return k(this, function (t) {
        switch (t.label) {case 0:
            return t.trys.push([0, 2,, 3]), e = i.env, n = "string" == typeof (e = e || "online") ? { database: e, file: e, function: e, message: e } : (e.database = e.database || "online", e.file = e.file || "online", e.function = e.function || "online", e.message = e.message || "online", e), r = new w(), this.db = new N({ env: n.database }, r), this.function = new A({ env: n.function }, r), this.file = new C({ env: n.file }, r), this.qimenApi = new X({ env: n.database }, r), this.topApi = new Y({ env: n.database }, r), this.processApi = new K({ env: n.database }, r), this.application = new Z({ env: n.database }, r), [4, r.init(h({}, i), a || new it({ gatewayUrl: i.__gatewayUrl }))];case 1:
            return t.sent(), [2, true];case 2:
            return o = t.sent(), console.error("SDK初始化失败 ", o), [3, 3];case 3:
            return [2, false];}var e;
      });
    });
  }, ct);function ct() {}var ut = new st();t.Cloud = st, t.default = ut, Object.defineProperty(t, "__esModule", { value: true });
});