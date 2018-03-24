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
        generatePlay();
        $('.step').prop("disabled", true);
        cycle = true;
        $('.setting_game').remove();
        highLite();
        startGame();
    });

    function startGame() {
        $('.cell').bind('click', function () {
            let selectCell = '';
            let col = '';
            let row = '';
            $('.step').prop("disabled", false);
            if (cycle) {
                $('.cell').css('background-color', '#8a6d3b').text('');
                $(this).css({
                    backgroundColor:'#ff7b11',
                    paddingTop: $(this).height()/2 + 'px',
                }).text('Выбран');
                $('.step').unbind('click');
                 selectCell = $(this).attr('data-cell');
                 col = $(this).attr('data-col');
                 row = $(this).attr('data-row');
                $('.step').bind('click', function () {
                    let action = $(this).attr('action');
                    $('.play_game, .setting_game').remove();
                    info('Выберите место где остановился маркер');
                    $('.cell').css('background-color', '#8a6d3b').text('');

                    $.ajax({
                        type: 'POST',
                        url: 'index.php',
                        data: {
                            action: action,
                            count: count_steps,
                            selectCell: selectCell,
                            column: col,
                            rows: row,
                            fieldRow: field_row,
                            fieldCol: field_col
                        },
                        success: function (data) {
                            $('.cell').each(function () {
                                $(this).bind('click', function () {
                                    $('.alert').remove();
                                    if ($(this).attr('data-cell') === data) {
                                        $(this).css('background-color', 'green').text('You win!');
                                        $('.cell').unbind('click');
                                    }
                                    if ($(this).attr('data-cell') !== data) {
                                        $(this).css('background-color', 'red').text('You lose!');
                                        $('[data-cell=' + data + ']').css({
                                            backgroundColor: 'green',
                                            paddingTop: $(this).height()/2 + 'px'
                                        }).text('Correctly');
                                        $('.cell').unbind('click');
                                    }
                                    generateBtn();
                                });
                            });
                        }
                    });
                });
            } else {
                $('.step').unbind('click');
                $('.cell').unbind('click');
                return false;
            }
        });
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

    function generatePlay() {
        $('.btn-group').html();
        $('.btn-group').append(`<div class="play_game">
        <button action="goUp" type="button" class="btn btn-default step">Ход вверх</button>
        <button action="goDown" type="button" class="btn btn-default step">Ход вниз</button>
        <button action="goLeft" type="button" class="btn btn-default step">Ход влево</button>
        <button action="goRight" type="button" class="btn btn-default step">Ход вправо</button></div> 
        `);
        $('.step').bind('click');
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
            if($(this).text() === ''){
                $(this).css('background-color', ' #8a8219');
            }
        });
        $('.cell').mouseleave(function () {
            if($(this).text() === '') {
                $(this).css('background-color', ' #8a6d3b');
            }
        });
    }

    function info(text) {
        $('.btn-group').append(`<div class="alert alert-info" role="alert">`+text+`</div>`);
    }
});

