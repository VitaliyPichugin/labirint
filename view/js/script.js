jQuery(document).ready(function($) {
     var cycle = false;
     var field_row = $('.cnt_rows').val() > 3 ? $('.cnt_rows').val() : 3;
     var field_col = $('.cnt_cols').val() > 3 ? $('.cnt_cols').val() : 3;
     //var count_steps = $('.cnt_steps').val() > 1 ? $('.cnt_steps').val() : 10;
    var count_steps = 10;

    draw_field(field_row,field_col);
    generateBtn();
    generatePanelSteps(count_steps);
    $('.cell').each(function (e) {
        $(this).attr('data-cell', e + 1);
    });

    $('.save_config').on('click', function () {
        field_row = $('.cnt_rows').val() > 3 ? $('.cnt_rows').val() : 3;
        field_col = $('.cnt_cols').val() > 3 ? $('.cnt_cols').val() : 3;
        //count_steps = $('.cnt_steps').val() > 1 ? $('.cnt_steps').val() : 10;
        $('.field').remove();
        draw_field(field_row,field_col);
        generatePanelSteps(count_steps);
        $('.cell').each(function (e) {
            $(this).attr('data-cell', e + 1);
        });
    });

    $('body').on('click', '.new', function () {
        $('.play_game').remove();
        $('.cell').unbind('click').css('background-color', '#8a6d3b').text('');
        $('.step').html('').css('background-color', '#a5835f');

        cycle = true;
        $('.setting_game').remove();
        startGame();
    });

    function startGame() {
        if (cycle) {
            $('.cell').css({
                backgroundColor: '#8a6d3b',
                paddingTop: $('.cell').height() / 2 + 'px'
            }).text('');
            let cell = generatePoint();
            let step = generateStep();
            $('.play_game, .setting_game').remove();
            setTimeout(function () {
                    highLite();
                    getAjax(step, count_steps, cell.cell, cell.col, cell.row, field_row, field_col);
                }, 600
            );
        } else {
            return false;
        }
    }

    function draw_field(rows, cols) {
        for(let i = 0; i < rows; i++){
            $('.container').append(`
                <div class="row field">
                    <div class="col-xs-12">
                        <div style="display: inline-block"  class=" cell-`+i+`"></div>
                    </div>
            </div>`);
            for(let j=0; j<cols; j++){
                $(`<div data-col="`+j+`" data-row="`+i+`" class="col-sm-4 cell"></div>`).appendTo(".cell-"+i);
            }
        }
    }

    function getAjax(step, count_steps, cell, col, row, field_row, field_col) {
        $.ajax({
            type: 'POST',
            url: 'index.php',
            data: {
                action: step,
                count: count_steps,
                selectCell: cell,
                column: col,
                rows: row,
                fieldRow: field_row,
                fieldCol: field_col
            },
            success: function (data) {
                let res = JSON.parse(data);
                let steps = res.steps;
                let route = res.route;
                let first_step = steps[0];
                steps.splice(0, 1);
                route.splice(0, 1);
                let last_step = steps[steps.length - 1];
                setTimeout(() => {
                    $('.cell').unbind('click');
                    $('.cell[data-cell="' + first_step + '"]')
                        .append(`<img src="http://` + location.hostname + `/view/img/start.png" alt="" style="width: 40px">`);
                    for (let i = 0; i < steps.length; i++) {
                        setTimeout(() => {
                            setTimeout(() => {
                                $('.step[data-step="' + i + '"]').addClass('active_step').css('background-color', '#828a48');
                                if ($('.step:last').hasClass('active_step')) {
                                    $('.cell').bind('click', function () {
                                        $('[data-cell=' + first_step + ']').html('');
                                        if ($(this).attr('data-cell') === last_step) {
                                            $(this).css('background-color', '#93904f').html('')
                                                .append(`<img src="http://` + location.hostname + `/view/img/win.png" alt="" style="width: 40px">`);
                                        } else {
                                            $(this).css('background-color', '#93904f').html('')
                                                .append(`<img src="http://` + location.hostname + `/view/img/lose.png" alt="" style="width: 40px">`);
                                            $('[data-cell=' + last_step + ']').css({
                                                backgroundColor: '#93904f'
                                            }).html('').append(`<img src="http://` + location.hostname + `/view/img/correctle.png" alt="" style="width: 40px">`);
                                            generateBtn();
                                        }
                                        $('.step').removeClass('active_step');
                                        $('.cell').unbind('click');
                                    });
                                }
                            }, 800);
                            $('.step[data-step="' + i + '"]')
                                .append(`<img src="http://` + location.hostname + `/view/img/` + route[i] + `.png" alt="" style="width: 30px">`);
                        }, 800 * i);
                    }
                }, 500);
            }
        });
    }


    function userPoint() {
        $('.cell').removeClass('user_point');
        $('.cell').css('background-color', '#8a6d3b').html('').each(function () {
            $(this).bind('click', function () {
                flag = true;
                $(this).append(`<img src="http://`+location.hostname+`/view/img/ask.png" alt="" style="width: 40px">`)
                    .addClass('user_point');
                $('.cell').unbind('click');
            });
        });
    }

    function generatePoint() {
        let min_point = $('.cell:first').attr('data-cell');
        let max_point = $('.cell:last').attr('data-cell');

        let val = getRandomValue(min_point, max_point);
        let selected_point = $('.cell[data-cell="'+val+'"]');

        let row = selected_point.attr('data-row');
        let col = selected_point.attr('data-col');

        return {
            "cell": val,
            "row": row,
            "col": col
        };
    }

    function generateStep() {
        const steps = [
            "goUp",
            "goDown",
            "goLeft",
            "goRight"
        ];

        let min_step = 0;
        let max_step = steps.length-1;
        let step = getRandomValue(min_step, max_step, 'step');

        return steps[step];
    }

    function getRandomValue(min, max, type=null){
        if(type == 'step'){
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }else {
            return  Math.ceil(Math.random() * (max - min) + min);
        }
    }

    function generateBtn() {
        $('.btn-group').html();
        $('.btn-group').append(`<div class="setting_game">
        <button type="button" class="btn btn-default new">Новая игра </button>
        <button data-toggle="modal" data-target="#dialog" type="button" class="btn btn-default conf">Настройки игры </button></div>
        `);
    }

    function generatePanelSteps(count_steps) {
        let cnt = 0;
        for(let i = 0; i < 2; i++){
            $('.container').append(`
                <div class="row field">
                    <div class="col-xs-12">
                        <div style="display: inline-block"  class=" step-`+i+`"></div>
                    </div>
            </div>`);
            for(let j=0; j<count_steps/2; j++){
                $(`<div data-step="`+cnt+`" class="col-sm-4 step"></div>`).appendTo(".step-"+i);
                cnt++;
            }
        }
    }

    function highLite() {
        $('.cell').mousemove(function () {
            if($(this).html() == '' ){
                $(this).css('background-color', ' #8a8219');
            }
        });
        $('.cell').mouseleave(function () {
            if($(this).html() == '' ) {
                $(this).css('background-color', ' #8a6d3b');
            }
        });
    }
});

