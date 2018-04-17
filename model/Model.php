<?php

class Model
{
    private $arr;
    private $rows;
    private $cols;
    private $result=[];
    private $generate_row;
    private $generate_col;
    private $steps=[];

    public function __construct()
    {
        $this->arr = $this->generateArr($_POST['fieldRow'], $_POST['fieldCol']);
        $this->rows = count($this->arr)-1;
        $this->cols = count($this->arr[0])-1;
    }

    public function generateSteps($row, $col, $count)
    {
        $this->generate_row = $row;
        $this->generate_col = $col;
        $arrFunctions = [
            0 => 'goRight',
            1 => 'goLeft',
            2 => 'goDown',
            3 => 'goUp'
        ];
        for ($i = 0; $i < $count + 1; $i++) {
            $this->generateStep($this->generate_row,
                $this->generate_col,
                $arrFunctions[rand(0, 3)]
            );
        }
        $data = [
            'route' => $this->steps,
            'steps' => $this->result
        ];
        return $data;
    }

    private function generateStep($row, $col, $type)
    {
        switch ($type) {
            case 'goUp': {
                if ($row == 0) {
                    $row = 1;
                    array_push($this->steps, 'goDown');
                } else {
                    $row--;
                    array_push($this->steps, 'goUp');
                }
                break;
            }
            case 'goDown': {
                if ($row >= $this->rows) {
                    $row = $this->rows - 1;
                    array_push($this->steps, 'goUp');
                } else {
                    $row++;
                    array_push($this->steps, 'goDown');
                }
                break;
            }
            case 'goRight': {
                if ($col >= $this->cols) {
                    $col = $this->cols - 1;
                    array_push($this->steps, 'goLeft');
                } else {
                    $col++;
                    array_push($this->steps, 'goRight');
                }
                break;
            }
            case 'goLeft': {
                if ($col == 0) {
                    $col = 1;
                    array_push($this->steps, 'goRight');
                } else {
                    $col--;
                    array_push($this->steps, 'goLeft');
                }
                break;
            }
        }
        $this->result[] += $this->arr[$row][$col];
        $this->generate_row = $row;
        $this->generate_col = $col;

        return $this->result;
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
