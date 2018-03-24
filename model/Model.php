<?php

class Model
{
    private $arr;
    private $rows;
    private $cols;
    private $result=[];

    public function __construct()
    {
        $this->arr = $this->generateArr($_POST['fieldRow'], $_POST['fieldCol']);
        $this->rows = count($this->arr);
        $this->cols = count($this->arr[0]);
    }

    public function goRight($row, $col, $count)
    {
        for ($k = 0; $k < $count; $k++) {
            $col++;//движемся вправо по массиву
            if ($col >= $this->cols) { //если дошли до края то сбрасываем счетчик
                $col = 0;
                $row++;//переходим на след. ряд
                if ($row >= $this->rows) { //если нет след. ряда то поднимаемся на первый ряд
                    $row = 0;
                }
            }
            $this->result[] +=$this->arr[$row][$col];// записываем все совершенные ходы
        }
        return $this->result;
    }

    public function goLeft($row, $col, $count)
    {
        for ($k = 0; $k < $count; $k++) {
            if($col == 0){$col = $this->cols; $row--;}
            $col--;
            if ($row < 0) {
                $row = $this->rows-1;
            }
            $this->result[] +=$this->arr[$row][$col];
            if($col == 0){$col = $this->cols; $row--;}
        }
       return $this->result;
    }

    public function goDown($row, $col, $count)
    {
        for ($k = 0; $k < $count; $k++) {
           $row++;
            if($row >= $this->rows) {
                $col--;
                $row = 0;
                if ($col >= $this->cols) {
                    $col --;
                }
                if($col < 0){
                    $col = $this->cols;
                    $col --;
                }
            }
            $this->result[] += $this->arr[$row][$col];
        }
        return $this->result;
    }

    public function goUp($row, $col, $count)
    {
        for ($k = 0; $k < $count; $k++) {
            if($row == 0){$row = $this->rows; $col++;}
            $row--;
            if ($col > $this->rows-1) {
                $col = 0;
            }
            $this->result[] += $this->arr[$row][$col];
            if($row == 0){$row = $this->rows; $col++;}
        }
        return  $this->result;
    }

    private function generateArr($row, $col){
        $arr=[];
        $cnt=0;
        for($i=0; $i<$row; $i++){
            for ($j=0; $j<$col; $j++){
                $cnt++;
                $arr[$i][$j] = $cnt;
            }
        }
        return $arr;
    }
}