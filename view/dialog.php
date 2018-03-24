<div class="modal" id="dialog" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Настройка игры</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p><strong>Количество ходов:</strong> <input class="cnt_steps" value="10" type="number"  minlength="3"></p>
                <p><strong>Размер поля:</strong>
                     <input class="cnt_rows" value="3" maxlength="10" minlength="3" type="number">
                    на <input class="cnt_cols" value="3" maxlength="10" minlength="3" type="number">
                </p>
            </div>
            <div class="modal-footer">
                <button type="button" data-dismiss="modal" class="btn btn-primary save_config">Сохранить</button>
            </div>
        </div>
    </div>
</div>