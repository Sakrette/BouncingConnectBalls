// mobile check from http://detectmobilebrowsers.com/
window.mobileCheck = function() {
    let check = false;
    (function(a){
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i
            .test(a.substr(0,4))
        ) check = true;
    })(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

// prototype
String.prototype.toCapital = function() {
    return this.slice(0,1).toUpperCase() + this.slice(1).toLowerCase();
};

Math.ra2xy = function(r, a) {
    return {
        x: r * Math.cos(a * (Math.PI / 180)),
        y: r * Math.sin(a * (Math.PI / 180))
    };
};

// global variables
const Globals = {};

// onload
window.onload = function() {
    Globals.body = document.body;
    init_timer();
    init_canvas();
    init_simulator();

    main();
};

// initializers
function init_timer() {
    let timer = Globals.timer = {
        start: Date.now(),
        passed: 0,
        update: () => (timer.passed = Date.now() - timer.start),
        reset: function() {
            timer.start  = Date.now();
            timer.passed = 0;
        },
    };
};

function init_canvas() {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';

    let style = {
        color: '#000000',
        type : 'fill',
        width: 15,
    };

    let g_canvas = Globals.canvas = {
        size: [canvas.width, canvas.height],
        set_style: (data) => canvas_set_style(style, data),
        clear: () => canvas_clear(ctx),
        draw: {
            line: (pt1_x, pt1_y, pt2_x, pt2_y, ...more_points)                => canvas_draw_line   (ctx, style, pt1_x, pt1_y, pt2_x, pt2_y, ...more_points),
            line_ra: (pt_x, pt_y, r1, a1, ...more_points)                     => canvas_draw_line_ra(ctx, style, pt_x, pt_y, r1, a1, ...more_points),
            rect: (center_x, center_y,  width, height)                        => canvas_draw_rect   (ctx, style, center_x, center_y, width, height),
            circ: (center_x, center_y, radius, start_angle=0, end_angle=360)  => canvas_draw_circ   (ctx, style, center_x, center_y, radius, start_angle, end_angle),
            circ_ra: (start_x, start_y, r, a, radius)                         => canvas_draw_circ_ra(ctx, style, start_x, start_y, r, a, radius),
        },
    };

    g_canvas.size.width  = canvas.width;
    g_canvas.size.height = canvas.height;
}

function init_simulator() {
    let pid = null;
    let simulator = Globals.simulator = {
        boundary: {
            angle : 90, // 30 ~ 360
            height: 25, // percentage height, 0~50
            width : 15, // line width, 0~20 px
        },
        balls: {
            number: 19,
            radius: 15,
            max: {
                r: 90,  // precentage half height, <= 90 %
                w: 120,  // degree per second, >= 10 deg per sec
                c: 0,   // degree of hue (HSV model), 0~360 deg
            },
            min: {
                r: 10,  // precentage half height, >= 0 %
                w: 90,  // degree per second, >= 10 deg per sec
                c: 180, // degree of hue (HSV model), 0~360 deg
            },
        },
        get_pivot: () => simulator_get_pivot(simulator.boundary),
        play: () => (pid = simulator_play()),
        stop: () => (pid = simulator_stop(pid)),
        update: () => {
            Globals.canvas.clear();
            simulator_draw_boundary(simulator.boundary);
            simulator_draw_balls(simulator.balls);
        },
    };

    simulator.play();
}

// main function
function main() {

}





// canvas functions
function canvas_set_style(style, data) {
    if (style == null) return;
    if (data.color && CSS.supports('color', data.color)) {
        style.color = data.color;
    }
    if (data.type === 'fill' || data.type === 'stroke') {
        style.type = data.type;
    }
    if (data.width != null && Number.isFinite(data.width) && data.width > 0) {
        style.width = data.width;
    }
}

function canvas_clear(ctx) {
    if (ctx == null || typeof ctx.clearRect !== 'function') return;
    ctx.clearRect(0, 0, ...Globals.canvas.size);
}

function canvas_draw(ctx, style, func) {
    ctx[style.type + 'Style'] = style.color;
    ctx.lineWidth = style.width;
    ctx.beginPath();

    let res = func();
    
    ctx[style.type]();

    return res;
}

function canvas_draw_line(ctx, style, pt1_x, pt1_y, pt2_x, pt2_y, ...more_points) {
    return canvas_draw(ctx, style, () => {
        // let pts = [{x: pt1_x, y: pt1_y},
        //            {x: pt2_x, y: pt2_y}];
        ctx.moveTo(pt1_x, Globals.canvas.size.height - pt1_y);
        ctx.lineTo(pt2_x, Globals.canvas.size.height - pt2_y);
        while (more_points.length >= 2) {
            let pt = {
                x: more_points.shift(),
                y: more_points.shift(),
            }
            ctx.lineTo(pt.x, Globals.canvas.size.height - pt.y);
            // pts.push(pt);
        }
        // return pts;
    });
}

function canvas_draw_line_ra(ctx, style, pt_x, pt_y, r1, a1, ...more_points) {
    let angle = 0;
    let pt = {x: pt_x, y: pt_y};
    let dxy;

    return canvas_draw(ctx, style, () => {
        let pts = [{x: pt.x, y: pt.y}];
        ctx.moveTo(pt_x, Globals.canvas.size.height - pt_y);
        angle -= -a1;
        dxy = Math.ra2xy(r1, angle);
        pt.x -= -dxy.x;
        pt.y -= -dxy.y;
        pts.push({x: pt.x, y: pt.y});
        ctx.lineTo(pt.x, Globals.canvas.size.height - pt.y);
        while (more_points.length >= 2) {
            let [r, a] = [more_points.shift(), more_points.shift()];
            angle -= -a;
            dxy = Math.ra2xy(r, angle);
            pt.x -= -dxy.x;
            pt.y -= -dxy.y;
            pts.push({x: pt.x, y: pt.y});
            ctx.lineTo(pt.x, Globals.canvas.size.height - pt.y);
        }
        return pts;
    });
}

function canvas_draw_rect(ctx, style, center_x, center_y, width, height) {
    canvas_draw(ctx, style, () =>{
        ctx.rect(center_x - width/2, Globals.canvas.size.height - center_y - height/2, width, height);
    });
}

function canvas_draw_circ(ctx, style, center_x, center_y, radius, start_angle, end_angle) {
    canvas_draw(ctx, style, () => {
        ctx.arc(center_x, Globals.canvas.size.height - center_y, radius, start_angle * (Math.PI / 180), end_angle * (Math.PI / 180), start_angle < end_angle);
    });
}

function canvas_draw_circ_ra(ctx, style, start_x, start_y, r, a, radius) {
    return canvas_draw(ctx, style, () => {
        let dxy = Math.ra2xy(r, a);
        ctx.arc(start_x -(-dxy.x), Globals.canvas.size.height - (start_y-(-dxy.y)), radius, 0, Math.PI * 2);
        return {
            x: start_x -(-dxy.x),
            y: start_y -(-dxy.y),
            r: radius
        };
    });
}



// simulator functions

function simulator_get_pivot(boundary) {
    let canvas = Globals.canvas;
    let len    = canvas.size.width;
    return {
        x: len/2,
        y: len * boundary.height / 100
    };
}

function simulator_draw_boundary(boundary) {
    let canvas = Globals.canvas;
    let len    = canvas.size.width;

    canvas.set_style({
        color: '#000000',
        type : 'stroke',
        width: boundary.width,
    });

    canvas.draw.line_ra(len/2, len * boundary.height / 100, len / 2, 90 + boundary.angle / 2);
    canvas.draw.line_ra(len/2, len * boundary.height / 100, len / 2, 90 - boundary.angle / 2);
}

function simulator_draw_balls(balls) {
    let canvas = Globals.canvas;
    let len    = canvas.size.width / 2;

    let pivot = Globals.simulator.get_pivot();
    let angle = Globals.simulator.boundary.angle;

    for (let i = balls.number-1; i>=0; i--) {
        let c = (balls.max.c - balls.min.c) * (balls.number-1? (i / (balls.number-1)): 1) -(-balls.min.c),
            w = (balls.max.w - balls.min.w) * (balls.number-1? (i / (balls.number-1)): 1) -(-balls.min.w),
            r = (balls.max.r - balls.min.r) * (balls.number-1? (i / (balls.number-1)): 1) -(-balls.min.r);


        canvas.set_style({
            color: `HSL(${Math.round(c)},100%,50%)`,
            type : 'fill',
        });

        let timer = Globals.timer;
        let angle_last = w * (timer.passed/1000); // for check sound
        timer.passed = Date.now() - timer.start;
        let angle_next = w * (timer.passed/1000);

        let a = angle && angle_next % (2*angle);
        if (angle && a > angle) a = (2*angle) - a;
        canvas.draw.circ_ra(pivot.x, pivot.y, len * (r/100), 90 - a -(-angle/2), balls.radius);
    }
}

function simulator_play() {
    Globals.timer.reset();
    return setInterval(()=>{
        Globals.timer.update();
        Globals.simulator.update();
    }, 0); // with fastest speed
}

function simulator_stop() {
    clearInterval(pid);
    return null;
}