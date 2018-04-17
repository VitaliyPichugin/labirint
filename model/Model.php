<?php

class Model
{
    private $arr;
    private $rows;
    private $cols;
    private $result=[];
    private $generate_row;
    private $generate_col;

    public function __construct()
    {
        $this->arr = $this->generateArr($_POST['fieldRow'], $_POST['fieldCol']);
        $this->rows = count($this->arr);
        $this->cols = count($this->arr[0]);
    }

    public function generateSteps($row, $col, $count)
    {
        $callStep = [];
        $arrFunctions = [
            0 => 'goRight',
            1 => 'goLeft',
            2 => 'goDown',
            3 => 'goUp'
        ];

        for ($i = 0; $i < $count + 1; $i++) {
            $index = rand(0, 3);
            if($i === 0){
                 $this->generateFunctions(
                     $arrFunctions[$index],
                     $row, $col
                 );
                 array_push($callStep, $arrFunctions[$index]);
            }else{
                $this->generateFunctions(
                    $arrFunctions[$index],
                    $this->generate_row,
                    $this->generate_col
                );
                array_push($callStep, $arrFunctions[$index]);
            }
        }

        $data = [
            'route' => $callStep,
            'steps' => $this->result
        ];

        return $data;
    }


    public function generateFunctions($method, $row, $col)
    {
        if (method_exists($this, $method)) {
            return $this->$method($row, $col);
        }
        else return null;
    }

    private function goRight($row, $col)
    {
        $col++;
        if ($col >= $this->cols) {
            $col = 0;
            $row++;
            if ($row >= $this->rows) {
                $row = 0;
            }
        }

        $this->result[] += $this->arr[$row][$col];
        $this->generate_row = $row;
        $this->generate_col = $col;

        return $this->result;
    }

    private function goLeft($row, $col)
    {
        if ($col == 0) {
            $col = $this->cols;
            $row--;
        }
        $col--;
        if ($row < 0) {
            $row = $this->rows - 1;
        }
        $this->result[] += $this->arr[$row][$col];
        $this->generate_row = $row;
        $this->generate_col = $col;

        return $this->result;
    }

    private function goDown($row, $col)
    {
        $row++;
        if ($row >= $this->rows) {
            $col--;
            $row = 0;
            if ($col >= $this->cols) {
                $col--;
            }
            if ($col < 0) {
                $col = $this->cols;
                $col--;
            }
        }

        $this->result[] += $this->arr[$row][$col];
        $this->generate_row = $row;
        $this->generate_col = $col;

        return $this->result;
    }

    private function goUp($row, $col)
    {
        if ($row == 0) {
            $row = $this->rows;
            $col++;
        }
        $row--;
        if ($col > $this->rows - 1) {
            $col = 0;
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
