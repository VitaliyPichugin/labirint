jQuery(document).ready(function($) {
     var cycle = false;
     var field_row = $('.cnt_rows').val() > 3 ? $('.cnt_rows').val() : 3;
     var field_col = $('.cnt_cols').val() > 3 ? $('.cnt_cols').val() : 3;
     var count_steps = $('.cnt_steps').val() > 1 ? $('.cnt_steps').val() : 10;

    draw_field(field_row,field_col);
    generateBtn();
    $('.cell').each(function (e) {
        $(this).attr('data-cell', e + 1);
    });

    $('.save_config').on('click', function () {
        field_row = $('.cnt_rows').val() > 3 ? $('.cnt_rows').val() : 3;
        field_col = $('.cnt_cols').val() > 3 ? $('.cnt_cols').val() : 3;
        count_steps = $('.cnt_steps').val() > 1 ? $('.cnt_steps').val() : 10;
        $('.field').remove();
        draw_field(field_row,field_col);
        $('.cell').each(function (e) {
            $(this).attr('data-cell', e + 1);
        });
    });

    $('body').on('click', '.new', function () {
        $('.play_game').remove();
        $('.cell').unbind('click').css('background-color', '#8a6d3b').text('');
        $('.step').prop("disabled", true);
        cycle = true;
        $('.setting_game').remove();
        startGame();
    });

    function startGame() {
        $('.step').prop("disabled", false);
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
                let steps = JSON.parse(data);
                let last_step = steps[steps.length - 1];

                setTimeout(() => {
                    for (let i = 0; i < steps.length; i++) {
                        setTimeout(() => {
                            $('.cell').css('background-color', '#8a6d3b');
                            $('.cell[data-cell="' + steps[i] + '"]').css('background-color', '#7c5b06')
                                .append(`<img src="http://`+location.hostname+`/view/img/` + step + `.png" alt="" style="width: 40px">`);
                            if (i == (steps.length-1 )) {
                                setTimeout(()=>{
                                    info('Выберите место где остановился маркер');
                                    checkPoint(last_step);
                                }, 100);
                            }
                        }, 200 * i);
                    }
                }, 200);
            }
        });
    }

    function checkPoint(last_step) {
        $('.cell').css('background-color', '#8a6d3b').html('').each(function () {
            $(this).bind('click', function () {
                $('.alert').remove();
                if ($(this).attr('data-cell') == last_step) {
                    $(this).css('background-color', '#93904f')
                        .append(`<img src="http://`+location.hostname+`/view/img/win.png" alt="" style="width: 40px">`);
                    $('.cell').unbind('click');
                }
                if ($(this).attr('data-cell') != last_step) {
                    $(this).css('background-color', '#93904f')
                        .append(`<img src="http://`+location.hostname+`/view/img/lose.png" alt="" style="width: 40px">`);
                    $('[data-cell=' + last_step + ']').css({
                        backgroundColor: '#93904f'
                    }).append(`<img src="http://`+location.hostname+`/view/img/correctle.png" alt="" style="width: 40px">`);
                    $('.cell').unbind('click');
                }
                generateBtn();
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

        setTimeout(function () {
            selected_point.addClass('active').css({
                backgroundColor:'#7c5b06'
            }).text();
        }, 500);

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


    function getRandomValue(min, max, type=null)
    {
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

    function info(text) {
        $('.btn-group').append(`<div class="alert alert-info" role="alert">`+text+`</div>`);
    }
});

