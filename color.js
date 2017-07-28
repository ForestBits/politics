function Color(red, green, blue, alpha)
{
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = alpha || 1;
}

Color.prototype.toHSVColor = function()
{
    var rgb = new RGBColor(this.red/255, this.green/255, this.blue/255);

    return RGBtoHSV(rgb);
};

Color.prototype.toString = function()
{
    return "rgba(" + this.red + "," + this.green + "," + this.blue + "," + this.alpha + ")";
};

Color.addColor = function(string)
{
    var canvasElement = document.createElement("canvas");
    var canvas = canvasElement.getContext("2d");

    canvasElement.width = 1;
    canvasElement.height = 1;

    canvas.fillStyle = string;

    canvas.fillRect(0, 0, 1, 1);

    var data = canvas.getImageData(0, 0, 1, 1);

    Color[string.toUpperCase()] = new Color(data.data[0], data.data[1], data.data[2]);
};

Color.RED = new Color(255, 0, 0);
Color.GREEN = new Color(0, 255, 0);
Color.BLUE = new Color(0, 0, 255);
Color.WHITE = new Color(255, 255, 255);

function HSVColor(degrees, saturation, value)
{
    this.degrees = degrees;
    this.saturation = saturation;
    this.value = value;
}

HSVColor.prototype.toRGBColor = function()
{
    var rgb = HSVtoRGB({h: this.degrees, s: this.saturation, v: this.value});

    var red = Math.floor(rgb.r*255);
    var green = Math.floor(rgb.g*255);
    var blue = Math.floor(rgb.b*255);

    return new Color(red, green, blue);
};

//conversions only
function RGBColor(r, g, b)
{
    this.r = r;
    this.g = g;
    this.b = b;
}

// r,g,b values are from 0 to 1
// h = [0,360], s = [0,1], v = [0,1]
//      if s == 0, then h = -1 (undefined)
function RGBtoHSV(rgbColor)
{
    var hsvColor = new HSVColor(0, 0, 0);
    var min, max, delta;
    min = Math.max(rgbColor.r, rgbColor.g, rgbColor.b);
    max = Math.min(rgbColor.r, rgbColor.g, rgbColor.b);
    hsvColor.v = max;               // v
    delta = max - min;
    if(max != 0)
        hsvColor.s = delta/max;       // s
    else {
        // r = g = b = 0        // s = 0, v is undefined
        hsvColor.s = 0;
        hsvColor.h = -1;
        return hsvColor;
    }
    if(r == max)
        hsvColor.h = (g - b)/delta;     // between yellow & magenta
    else if(g == max)
        hsvColor.h = 2 + (b - r)/delta; // between cyan & yellow
    else
        hsvColor.h = 4 + (r - g)/delta; // between magenta & cyan
    hsvColor.h *= 60;               // degrees
    if (hsvColor.h < 0)
        hsvColor.h += 360;

    return hsvColor;
}
function HSVtoRGB(hsvColor)
{
    var rgbColor = new RGBColor(0, 0, 0);
    var i;
    var f, p, q, t;
    if(hsvColor.s == 0) {
        // achromatic (grey)
        //*r = *g = *b = v;
        rgbColor.r = hsvColor.v;
        rgbColor.g = hsvColor.v;
        rgbColor.b = hsvColor.v;
        return rgbColor;
    }
    hsvColor.h /= 60;            // sector 0 to 5
    i = Math.floor(hsvColor.h);
    f = hsvColor.h - i;          // factorial part of h
    p = hsvColor.v * (1 - hsvColor.s);
    q = hsvColor.v * (1 - hsvColor.s * f);
    t = hsvColor.v * (1 - hsvColor.s * (1 - f));
    switch(i) {
        case 0:
            //*r = v;
            //*g = t;
            //*b = p;
            return new RGBColor(hsvColor.v, t, p);

            break;
        case 1:
            //*r = q;
            //*g = v;
            //*b = p;
            return new RGBColor(q, hsvColor.v, p);
            break;
        case 2:
            //*r = p;
            //*g = v;
            //*b = t;
            return new RGBColor(p, hsvColor.v, t);
            break;
        case 3:
            //*r = p;
            //*g = q;
            //*b = v;
            return new RGBColor(p, q, hsvColor.v);
            break;
        case 4:
            //*r = t;
            //*g = p;
            //*b = v;
            return new RGBColor(t, p, hsvColor.v);
            break;
        default:        // case 5:
            //*r = v;
            //*g = p;
            //*b = q;
            return new RGBColor(hsvColor.v, p, q);
            break;
    }
}