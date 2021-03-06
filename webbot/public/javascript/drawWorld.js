interval = undefined;

function read_json(game_id){
    $.getJSON('/robo_data?game_id=' + game_id, function(data) {
        //clear the canvas
        $("canvas").clearCanvas();

        if (data.time < 0) {
            clearInterval(interval);
        }else{
            $("#timeleft").text(data.time);
            $.each(data.bullets, function(index,value){
                var location = value.position,
                    x_coord = location[0] * 6,
                    y_coord = location[1] * 5,
                    color = '#000';
                if (value.exploding == 1){
                    color = '#FFFF00';
                } else if (value.exploding == 2){
                    color = '#FF0000';
                }
                $("canvas")
                .drawArc({
                    fillStyle: color,
                    x: x_coord, y: y_coord,
                    radius: 2 + (5*value.exploding)
                });
            });
        }

        // Handle the robots
        $.each(data.robots, function(index,value){
            $( "#pb" + index ).progressbar({
                value: value.health
            });

            $('#robo_info_' + index + ' .name').text(value.name);

            if (value.health <= 0){
                return;
            }
            var location = value.position,
                x_coord = location[0] * 6,
                y_coord = location[1] * 5;
            $("canvas")
            .drawImage({
                source: '/images/r0' + (index + 1) + '.png',
                x: x_coord, y: y_coord,
                width: 32,
                height: 32,
                fromCenter: true,
                angle: value.rotation,
            })
            .drawImage({
                source: '/images/turret.png',
                x: x_coord, y: y_coord,
                width: 32,
                height: 32,
                fromCenter: true,
                angle: value.rotation + value.turret_angle,
            });
        });
        $.each(data.walls, function(index,value){
            var location = value.position,
                x_coord = location[0] * 6,
                y_coord = location[1] * 5;
            $("canvas")
            .drawRect({
                fillStyle: "#000",
                x: x_coord, y: y_coord,
                width: value.width * 6,
                height: value.height * 5,
                fromCenter: true
            });
        });
    });
};
